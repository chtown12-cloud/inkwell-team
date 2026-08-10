/* ============================================================
   GET /api/health

   A plain-language check that the deployment is wired up. Visit it in a
   browser after connecting a Redis/KV store:

     { "ok": true, "persistent": true,  "message": "..." }  <- ready
     { "ok": true, "persistent": false, "message": "..." }  <- still falling back

   Deliberately reveals nothing secret: no credentials, no URLs, no
   session data — only whether a store is configured.
   ============================================================ */

const { isPersistent } = require('../lib/store.js');

module.exports = function handler(req, res) {
  const persistent = isPersistent();
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify({
    ok: true,
    api: 'up',
    persistent,
    message: persistent
      ? 'Storage connected — phones can join and stay in sync.'
      : 'API is running but no storage is connected yet. Games still work on one shared screen; connect a Redis/KV store and redeploy to enable phone play.',
  }, null, 2));
};
