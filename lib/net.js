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

  const NET = {
    code: null,
    playerId: null,
    state: null,
    available: true,       // flips false after a transport failure
    onState: null,
    _timer: null,
    _busy: false,

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
      if (this.offline()) { this.available = false; return null; }
      this.playerId = this.playerId || newPlayerId();
      try {
        const body = await this._fetch('/api/room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ scenario, difficulty }),
        });
        this.code = body.room.code;
        this.state = body.room;
        return this.code;
      } catch (e) {
        this.available = false;
        return null;
      }
    },

    /** Player: attach to an existing session. */
    async attach(code) {
      if (this.offline()) { this.available = false; return null; }
      this.playerId = this.playerId || newPlayerId();
      this.code = String(code || '').toUpperCase();
      try {
        const body = await this._fetch('/api/room?code=' + encodeURIComponent(this.code));
        this.state = body.room;
        return body.room;
      } catch (e) {
        this.code = null;
        return null;
      }
    },

    async send(action, extra) {
      if (!this.enabled()) return null;
      try {
        const body = await this._fetch('/api/action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.assign({ code: this.code, playerId: this.playerId, action }, extra || {})),
        });
        this._apply(body.room);
        return body.room;
      } catch (e) {
        return null;   // a dropped action is recovered by the next poll
      }
    },

    async poll() {
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

    _apply(room) {
      if (!room) return;
      // ignore out-of-order responses
      if (this.state && room.rev != null && this.state.rev != null && room.rev < this.state.rev) return;
      this.state = room;
      if (typeof this.onState === 'function') this.onState(room);
    },

    startPolling(ms) {
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
