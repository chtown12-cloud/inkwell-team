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
  const BEAT_MS = 25000;   // keep-alive, comfortably inside the idle window

  function randomId() {
    return (global.crypto && global.crypto.randomUUID)
      ? global.crypto.randomUUID().replace(/-/g, '').slice(0, 24)
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  /**
   * Who this device is, for this game.
   *
   * sessionStorage alone was not enough: closing the tab throws it away, so
   * coming back to the same game arrived as a stranger and left the old player
   * sitting on the shared screen as a ghost. The identity is therefore also
   * kept in localStorage, keyed by game and role, so reopening the same game
   * on the same device resumes the same player — while a phone and a shared
   * screen on ONE device (which is how this gets tested) still stay separate.
   */
  function newPlayerId(code, role) {
    const tabKey = 'etn-player-id:' + (role || 'p');
    const deviceKey = 'etn-player:' + (code || '-') + ':' + (role || 'p');
    try {
      let id = sessionStorage.getItem(tabKey) || localStorage.getItem(deviceKey);
      if (!id) id = randomId();
      sessionStorage.setItem(tabKey, id);
      try { localStorage.setItem(deviceKey, id); } catch (e) {}
      return id;
    } catch (e) {
      return randomId();
    }
  }

  /* ---------- Firebase Realtime Database transport ----------
     Preferred when a config is present: pushes over a websocket, so a solve
     lands on every device immediately instead of waiting for a poll. Falls
     back to the REST API, then to single-screen play. */
  const FB = {
    db: null,
    connected: false,
    // How far this device's clock is from the database's, in ms. Every
    // timestamp the game writes is corrected by it, so a phone running slow
    // cannot be mistaken for a player who wandered off an hour ago.
    skew: 0,
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
        this.db.ref('.info/serverTimeOffset').on('value', (snap) => { this.skew = snap.val() || 0; });
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
    _beatTimer: null,
    _onVisible: null,
    _hostBeat: null,
    _hostSeenAt: 0,
    // How long to go without seeing the screen's heartbeat move before
    // offering the crew the chance to take over. The screen beats every 30s,
    // and a backgrounded tab has its timers throttled to roughly once a
    // minute, so leave a wide margin.
    hostGraceMs: 100000,
    vanished: false,       // the shared session disappeared out from under us
    finishing: false,      // we are deleting it on purpose; don't cry about it
    denied: false,         // the database refused us: a config problem, not a blip
    persistent: null,      // REST path only: does the server actually remember?
    onTrouble: null,

    enabled() { return !!(this.code && this.available); },

    /** Now, as the database would tell it. */
    now() { return Date.now() + (this.mode === 'firebase' ? (FB.skew || 0) : 0); },

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
      if (await FB.wait()) {
        try {
          const room = SESSION.newRoom(scenario, difficulty);
          this.playerId = this.playerId || newPlayerId(room.code, 'host');
          // Stamp the creator as the screen straight away. hostLive() treats an
          // unclaimed host as "nobody to miss", so if claimHost were ever to
          // fail the phones would be told all is well for the rest of the game.
          room.host = { id: this.playerId, online: true, seen: Date.now() + (FB.skew || 0) };
          await FB.ref(room.code).set(room);
          this.code = room.code; this.state = room; this.mode = 'firebase';
          this._subscribe();
          return this.code;
        } catch (e) {
          // "permission denied" means the rules were never published. Falling
          // back would hide a one-line fix behind a game that half works.
          if (this._isDenied(e)) { this.denied = true; this.available = false; return null; }
        }
      }
      this.playerId = this.playerId || newPlayerId(null, 'host');
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
    async attach(code, role) {
      this.code = String(code || '').toUpperCase();
      this.playerId = this.playerId || newPlayerId(this.code, role || 'phone');
      if (await FB.wait()) {
        try {
          const snap = await FB.ref(this.code).get();
          const room = SESSION.normalizeRoom(snap.val());
          if (room) {
            this.state = room; this.mode = 'firebase';
            this._subscribe();
            return room;
          }
        } catch (e) {
          if (this._isDenied(e)) { this.denied = true; this.available = false; this.code = null; return null; }
        }
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

    _isDenied(e) {
      const code = (e && (e.code || e.message) || '').toString().toUpperCase();
      return code.indexOf('PERMISSION_DENIED') >= 0 || code.indexOf('PERMISSION DENIED') >= 0;
    },

    /**
     * Honest three-state connection report, so the UI can never claim to be
     * connected while sitting on a transport that cannot actually work.
     *   ok       - solves will reach everyone
     *   degraded - talking to something, but it will not hold the game
     *   down     - not connected at all
     */
    status() {
      if (this.denied) return { state: 'down', why: 'denied' };
      if (this.vanished) return { state: 'down', why: 'vanished' };
      if (!this.enabled()) return { state: 'down', why: 'none' };
      if (this.mode === 'firebase') {
        return FB.connected ? { state: 'ok', why: 'firebase' } : { state: 'degraded', why: 'connecting' };
      }
      if (this.mode === 'api') {
        if (this.persistent === false) return { state: 'degraded', why: 'nostore' };
        return { state: 'ok', why: 'api' };
      }
      return { state: 'down', why: 'none' };
    },

    /** Ask the REST API whether it can actually remember anything. */
    async checkPersistence() {
      if (this.mode !== 'api') return;
      try {
        const res = await fetch('/api/health');
        const body = await res.json();
        this.persistent = !!body.persistent;
      } catch (e) { this.persistent = false; }
    },

    /** Live updates: one websocket listener instead of polling. */
    _subscribe() {
      if (this.mode !== 'firebase') return;
      if (this._off) { try { this._off(); } catch (e) {} }
      const ref = FB.ref(this.code);
      const handler = ref.on('value', (snap) => {
        const room = SESSION.normalizeRoom(snap.val());
        if (room) { this.vanished = false; this._apply(room); return; }
        // The node is gone. Silently ignoring this is how a wiped session used
        // to look like "nothing is happening" — say so instead.
        if (this.state && !this.finishing) {
          this.vanished = true;
          if (typeof this.onTrouble === 'function') this.onTrouble('vanished');
        }
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
            // MUST abort with undefined, never return raw. Firebase runs this
            // callback optimistically against locally-cached data first, which
            // is null before the server's copy arrives — and returning null
            // from a transaction means "delete this node", which would wipe
            // the whole game the first time anyone acted.
            if (!room) return undefined;
            const out = SESSION.applyAction(room, body, this.now());
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
      // The heartbeat is the backstop for every transport, not just the REST
      // one: Firebase normally flips `online` itself when the tab disconnects,
      // but that relies on its servers noticing a dead socket, and if the
      // registration is ever lost the phones would otherwise wait forever.
      //
      // Crucially this measures elapsed time on THIS device — `h.seen` was
      // written by the shared screen's clock, and comparing two devices'
      // clocks means a phone running a couple of minutes slow would think the
      // screen was immortal (or, running fast, that it had died on arrival).
      // _hostSeenAt is stamped locally whenever the heartbeat actually moves.
      if (this._hostSeenAt && Date.now() - this._hostSeenAt > this.hostGraceMs) return false;
      return true;
    },

    /**
     * Say plainly that this screen is standing down, instead of waiting for the
     * database to work out that the socket died. Best effort: the page is
     * usually on its way out when this runs.
     */
    async releaseHost() {
      this.stopHostPing();
      if (!this.code) return;
      if (this.mode === 'firebase') {
        try { await FB.ref(this.code).child('host/online').set(false); } catch (e) {}
        return;
      }
      try { await this.send('hostLeft'); } catch (e) {}
    },

    /** Delete this game's data now. */
    async endSession() {
      this.finishing = true;
      if (this.mode !== 'firebase' || !this.code) return;
      try { await FB.ref(this.code).remove(); } catch (e) { /* best effort */ }
    },

    /**
     * Ask the database to delete this game when the host's tab goes away.
     * Armed only once the game is over, so a mid-game network blip can never
     * wipe a session that is still being played.
     */
    armCleanup() {
      this.finishing = true;
      if (this.mode !== 'firebase' || !this.code) return;
      try { FB.ref(this.code).onDisconnect().remove(); } catch (e) { /* best effort */ }
    },

    /** Note, on this device's clock, when the screen's heartbeat last moved. */
    _watchHost(room) {
      const h = room && room.host;
      if (!h || !h.id) { this._hostSeenAt = 0; this._hostBeat = null; return; }
      const beat = h.id + ':' + (h.seen || 0) + ':' + (h.online !== false);
      if (beat !== this._hostBeat) { this._hostBeat = beat; this._hostSeenAt = Date.now(); }
    },

    _apply(room) {
      if (!room) return;
      this._watchHost(room);
      // ignore out-of-order responses
      if (this.state && room.rev != null && this.state.rev != null && room.rev < this.state.rev) return;
      this.state = room;
      if (typeof this.onState === 'function') this.onState(room);
      this._selfHeal(room);
    },

    live() { return this.status().state === 'ok'; },

    startPolling(ms) {
      this.startHeartbeat();
      if (this.mode === 'firebase') return;   // nothing to poll
      this.stopPolling();
      this._timer = setInterval(() => this.poll(), ms || POLL_MS);
    },
    stopPolling() { if (this._timer) clearInterval(this._timer); this._timer = null; },

    /**
     * Say "still here" on a timer.
     *
     * Without this, a player's lastSeen only moved when they touched
     * something, so a phone that had been closed for ten minutes was
     * indistinguishable from one whose owner was reading a clue — and the
     * shared screen went on showing a player who had long since gone. The
     * websocket transport used to skip this entirely, because startPolling
     * returned early for Firebase.
     */
    startHeartbeat() {
      this.stopHeartbeat();
      const beat = () => {
        if (!this.enabled()) return;
        try { if (global.document && global.document.hidden) return; } catch (e) {}
        this.send('ping');
      };
      this._beatTimer = setInterval(beat, BEAT_MS);
      this._onVisible = () => {
        try { if (global.document && global.document.hidden) return; } catch (e) {}
        // Back from a locked screen, another app, or a page the browser froze
        // and restored: re-announce at once. Rejoining rather than pinging is
        // deliberate — the room may have swept us out, or we may have said
        // goodbye on the way into the background, and this puts us back under
        // the same identity either way.
        if (this._identity) this.send('join', this._identity);
      };
      try { global.addEventListener('visibilitychange', this._onVisible); } catch (e) {}
    },
    stopHeartbeat() {
      if (this._beatTimer) clearInterval(this._beatTimer);
      this._beatTimer = null;
      if (this._onVisible) {
        try { global.removeEventListener('visibilitychange', this._onVisible); } catch (e) {}
        this._onVisible = null;
      }
    },

    /** Step out of the game: the crew should stop seeing a player who left. */
    async leaveSession() {
      this.stopHeartbeat();
      if (!this.enabled()) return;
      try { await this.send('leave'); } catch (e) { /* best effort on the way out */ }
    },

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
