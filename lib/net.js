/* ============================================================
   Multiplayer transport. DOM-free on purpose so it can be unit
   tested; the UI subscribes with NET.onState.

   Every call fails soft: if the API is missing (opened from
   file://, or deployed with no KV store) NET stays disabled and the
   game runs exactly as it always has, on one shared screen.
   ============================================================ */
(function (global) {
  'use strict';

  const POLL_MS = 1500;

  function newPlayerId() {
    try {
      const key = 'etn-player-id';
      let id = sessionStorage.getItem(key);
      if (!id) {
        id = (global.crypto && global.crypto.randomUUID)
          ? global.crypto.randomUUID().replace(/-/g, '').slice(0, 24)
          : Math.random().toString(36).slice(2) + Date.now().toString(36);
        sessionStorage.setItem(key, id);
      }
      return id;
    } catch (e) {
      return Math.random().toString(36).slice(2) + Date.now().toString(36);
    }
  }

  /* ---------- Firebase Realtime Database transport ----------
     Preferred when a config is present: pushes over a websocket, so a solve
     lands on every device immediately instead of waiting for a poll. Falls
     back to the REST API, then to single-screen play. */
  const FB = {
    db: null,
    connected: false,
    root: 'escape',
    /** True once the SDK, a config and a databaseURL are all present. */
    configured() {
      return !!(global.firebase && global.firebase.database
        && global.FIREBASE_CONFIG && global.FIREBASE_CONFIG.databaseURL);
    },
    init() {
      if (this.db || !this.configured()) return this.db;
      try {
        if (!global.firebase.apps || !global.firebase.apps.length) {
          global.firebase.initializeApp(global.FIREBASE_CONFIG);
        }
        this.db = global.firebase.database();
        this.db.ref('.info/connected').on('value', (snap) => { this.connected = !!snap.val(); });
      } catch (e) { this.db = null; }
      return this.db;
    },
    ref(code) { return this.db.ref(this.root + '/' + code); },

    /**
     * The SDK now loads asynchronously, so give it a moment to arrive before
     * deciding it isn't coming. Only ever waited once, when a game starts.
     */
    async wait(ms) {
      const deadline = Date.now() + (ms || 2500);
      while (!this.configured() && Date.now() < deadline) {
        // the script tag reported a failure: stop waiting for something that
        // is never coming and fall back straight away
        if (global.__firebaseUnavailable) break;
        await new Promise((r) => setTimeout(r, 100));
      }
      return this.init();
    },
  };

  const NET = {
    code: null,
    playerId: null,
    state: null,
    available: true,       // flips false after a transport failure
    mode: null,            // 'firebase' | 'api' | null
    onState: null,
    _timer: null,
    _busy: false,
    _off: null,
    _identity: null,
    _lastHeal: 0,
    _hostTimer: null,

    enabled() { return !!(this.code && this.available); },

    /** Opened straight off disk: there is no server to talk to, so don't try. */
    offline() {
      try { return location.protocol === 'file:'; } catch (e) { return true; }
    },

    async _fetch(path, options) {
      const res = await fetch(path, options);
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body.ok) throw new Error((body && body.error) || ('http ' + res.status));
      return body;
    },

    /** Host: open a session. Returns the code, or null if unavailable. */
    async createSession(scenario, difficulty) {
      this.playerId = this.playerId || newPlayerId();
      if (await FB.wait()) {
        try {
          const room = SESSION.newRoom(scenario, difficulty);
          await FB.ref(room.code).set(room);
          this.code = room.code; this.state = room; this.mode = 'firebase';
          this._subscribe();
          return this.code;
        } catch (e) { /* fall through to the REST API */ }
      }
      if (this.offline()) { this.available = false; return null; }
      try {
        const body = await this._fetch('/api/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenario, difficulty }),
        });
        this.code = body.room.code;
        this.state = body.room;
        this.mode = 'api';
        return this.code;
      } catch (e) {
        this.available = false;
        return null;
      }
    },

    /** Player: attach to an existing session. */
    async attach(code) {
      this.playerId = this.playerId || newPlayerId();
      this.code = String(code || '').toUpperCase();
      if (await FB.wait()) {
        try {
          const snap = await FB.ref(this.code).get();
          const room = SESSION.normalizeRoom(snap.val());
          if (room) {
            this.state = room; this.mode = 'firebase';
            this._subscribe();
            return room;
          }
        } catch (e) { /* fall through to the REST API */ }
      }
      if (this.offline()) { this.available = false; this.code = null; return null; }
      try {
        const body = await this._fetch('/api/room?code=' + encodeURIComponent(this.code));
        this.state = body.room;
        this.mode = 'api';
        return body.room;
      } catch (e) {
        this.code = null;
        return null;
      }
    },

    /** Live updates: one websocket listener instead of polling. */
    _subscribe() {
      if (this.mode !== 'firebase') return;
      if (this._off) { try { this._off(); } catch (e) {} }
      const ref = FB.ref(this.code);
      const handler = ref.on('value', (snap) => {
        const room = SESSION.normalizeRoom(snap.val());
        if (room) this._apply(room);
      });
      this._off = () => ref.off('value', handler);
    },

    async send(action, extra) {
      if (!this.enabled()) return null;
      const body = Object.assign({ code: this.code, playerId: this.playerId, action }, extra || {});
      if (action === 'join' && extra && extra.name) this._identity = { name: extra.name, emoji: extra.emoji };

      if (this.mode === 'firebase') {
        try {
          // A transaction keeps two people solving at the same instant from
          // clobbering each other; the SAME rules run here as on the REST path.
          await FB.ref(this.code).transaction((raw) => {
            const room = SESSION.normalizeRoom(raw);
            if (!room) return raw;                       // session gone: leave alone
            const out = SESSION.applyAction(room, body);
            return out.ok ? room : undefined;            // undefined aborts
          });
          return this.state;
        } catch (e) { return null; }
      }

      try {
        const res = await this._fetch('/api/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        this._apply(res.room);
        return res.room;
      } catch (e) {
        return null;   // a dropped action is recovered by the next poll
      }
    },

    async poll() {
      if (this.mode === 'firebase') return;   // pushed over a websocket instead
      if (!this.enabled() || this._busy) return;
      this._busy = true;
      try {
        const body = await this._fetch('/api/room?code=' + encodeURIComponent(this.code));
        this._apply(body.room);
      } catch (e) {
        /* transient: keep polling */
      } finally {
        this._busy = false;
      }
    },

    /**
     * If we were reaped for idling (or the session was recreated), quietly
     * rejoin rather than leaving the player silently locked out.
     */
    _selfHeal(room) {
      if (!this._identity || !room || !Array.isArray(room.players)) return;
      if (room.players.some((p) => p.id === this.playerId)) return;
      const now = Date.now();
      if (this._lastHeal && now - this._lastHeal < 5000) return;
      this._lastHeal = now;
      this.send('join', this._identity);
    },

    /**
     * Take (or retake) the shared screen. Also asks the database to flip the
     * host offline the moment this tab disconnects — that write is applied by
     * Firebase's servers, so no heartbeat is needed on that path.
     */
    async becomeHost() {
      await this.send('claimHost');
      if (this.mode === 'firebase') {
        try { FB.ref(this.code).child('host/online').onDisconnect().set(false); } catch (e) {}
      }
      this.stopHostPing();
      // the REST fallback has no disconnect hook, so keep a slow heartbeat
      this._hostTimer = setInterval(() => this.send('hostPing'), 30000);
    },
    stopHostPing() { if (this._hostTimer) clearInterval(this._hostTimer); this._hostTimer = null; },

    /**
     * Is somebody still driving the shared screen? `online` is authoritative
     * when the database can flip it; the timestamp covers the fallback.
     */
    hostLive() {
      const h = this.state && this.state.host;
      if (!h || !h.id) return true;        // nobody ever claimed it: don't nag
      if (h.online === false) return false;
      if (this.mode === 'api' && h.seen && Date.now() - h.seen > 90000) return false;
      return true;
    },

    /** Delete this game's data now. */
    async endSession() {
      if (this.mode !== 'firebase' || !this.code) return;
      try { await FB.ref(this.code).remove(); } catch (e) { /* best effort */ }
    },

    /**
     * Ask the database to delete this game when the host's tab goes away.
     * Armed only once the game is over, so a mid-game network blip can never
     * wipe a session that is still being played.
     */
    armCleanup() {
      if (this.mode !== 'firebase' || !this.code) return;
      try { FB.ref(this.code).onDisconnect().remove(); } catch (e) { /* best effort */ }
    },

    _apply(room) {
      if (!room) return;
      // ignore out-of-order responses
      if (this.state && room.rev != null && this.state.rev != null && room.rev < this.state.rev) return;
      this.state = room;
      if (typeof this.onState === 'function') this.onState(room);
      this._selfHeal(room);
    },

    live() { return this.mode === 'firebase' ? FB.connected : this.mode === 'api'; },

    startPolling(ms) {
      if (this.mode === 'firebase') return;   // nothing to poll
      this.stopPolling();
      this._timer = setInterval(() => this.poll(), ms || POLL_MS);
    },
    stopPolling() { if (this._timer) clearInterval(this._timer); this._timer = null; },

    /** How many players are sitting at a given object. */
    seatedAt(objId) {
      const seats = (this.state && this.state.seats) || {};
      return seats[objId] || [];
    },
    playerName(id) {
      const p = ((this.state && this.state.players) || []).find((x) => x.id === id);
      return p ? p.name : '';
    },
    playerEmoji(id) {
      const p = ((this.state && this.state.players) || []).find((x) => x.id === id);
      return p ? p.emoji : '🙂';
    },
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = NET;
  global.NET = NET;
})(typeof globalThis !== 'undefined' ? globalThis : this);
