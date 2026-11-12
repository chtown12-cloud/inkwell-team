/* A stand-in for the Firebase Realtime Database SDK (compat build), for tests.

   The deployed game syncs through Firebase; the dev server only has the REST
   fallback. The two do not behave alike in the one way that matters to the
   game, and for a long time nothing here could tell:

     Firebase hands a page its OWN write back from INSIDE the call that made
     it. set() and transaction() apply the change locally and raise `value`
     on that page's listeners before they return. REST answers a tick later.

   That is what this file keeps faithful (checked against the real 9.23.0 SDK,
   which is the build index.html loads):
     - set(), remove() and transaction() raise `value` on this page, synchronously;
     - a transaction's update runs against the current value, and returning
       undefined aborts it with nothing written;
     - a new listener's first value arrives later, as it would from a server;
     - other pages hear about a write later too.

   What it does not attempt: conflicts and retries, rules, auth, going offline.
   "The database" is this origin's localStorage, so every page in one browser
   context shares it and nothing ever leaves the machine.

   Loaded with page.addInitScript BEFORE any of the game's own scripts; the
   test also blocks gstatic so the real SDK can never load over the top of it. */
(function () {
  'use strict';
  const PREFIX = 'fakefb:';
  const LAG = 25;                       // a round trip to the server, in ms
  const listeners = [];                 // { path, cb }

  // a session lives at escape/CODE; everything below it is stored inside that one node
  const top = (path) => path.split('/').slice(0, 2).join('/');
  const rest = (path) => path.split('/').slice(2);
  const load = (path) => { const raw = localStorage.getItem(PREFIX + top(path)); return raw == null ? null : JSON.parse(raw); };

  function read(path) {
    let v = load(path);
    for (const k of rest(path)) v = (v && typeof v === 'object' && k in v) ? v[k] : null;
    return v == null ? null : v;
  }
  function write(path, value) {
    const keys = rest(path), key = PREFIX + top(path);
    if (!keys.length) {
      if (value == null) localStorage.removeItem(key); else localStorage.setItem(key, JSON.stringify(value));
      return;
    }
    const root = load(path) || {};
    let at = root;
    keys.slice(0, -1).forEach((k) => { if (!at[k] || typeof at[k] !== 'object') at[k] = {}; at = at[k]; });
    if (value == null) delete at[keys[keys.length - 1]]; else at[keys[keys.length - 1]] = value;
    localStorage.setItem(key, JSON.stringify(root));
  }
  function snap(path) {
    const v = read(path);
    return { val: () => (v == null ? null : JSON.parse(JSON.stringify(v))), exists: () => v != null };
  }
  /** Tell everyone on this page who is listening at, above or below a path. */
  function raise(path) {
    listeners.slice().forEach((l) => {
      if (l.path === path || path.startsWith(l.path + '/') || l.path.startsWith(path + '/')) l.cb(snap(l.path));
    });
  }
  // a write made by another page: it reaches this one afterwards, never during
  addEventListener('storage', (e) => { if (e.key && e.key.startsWith(PREFIX)) raise(e.key.slice(PREFIX.length)); });

  const later = (v) => new Promise((r) => setTimeout(() => r(v), LAG));
  const INFO = { '.info/connected': true, '.info/serverTimeOffset': 0 };

  function ref(path) {
    return {
      on(type, cb) {
        if (path in INFO) { setTimeout(() => cb({ val: () => INFO[path] }), 0); return cb; }
        listeners.push({ path, cb });
        setTimeout(() => { if (listeners.some((l) => l.cb === cb)) cb(snap(path)); }, LAG);
        return cb;
      },
      off(type, cb) {
        for (let i = listeners.length - 1; i >= 0; i--) {
          if (listeners[i].path === path && (!cb || listeners[i].cb === cb)) listeners.splice(i, 1);
        }
      },
      set(value) { write(path, value); raise(path); return later(); },
      remove() { write(path, null); raise(path); return later(); },
      get() { return later().then(() => snap(path)); },
      transaction(update) {
        const next = update(snap(path).val());
        if (next === undefined) return later({ committed: false, snapshot: snap(path) });
        write(path, next);
        raise(path);                    // synchronously: this is the behaviour under test
        return later().then(() => ({ committed: true, snapshot: snap(path) }));
      },
      child(sub) { return ref(path + '/' + sub); },
      onDisconnect() {
        const done = () => Promise.resolve();
        return { set: done, remove: done, cancel: done };
      },
    };
  }

  window.firebase = {
    apps: [],
    initializeApp(config) { this.apps.push(config); return {}; },
    database() { return { ref }; },
  };
  window.__fakeFirebase = true;
})();
