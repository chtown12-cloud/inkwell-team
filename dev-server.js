#!/usr/bin/env node
/* ============================================================
   Local dev/test server: serves the static game plus the /api
   routes against the in-memory store, so multi-device play can be
   exercised without deploying or provisioning anything.

     node dev-server.js [port]      # default 8787
   ============================================================ */

const http = require('http');
const fs = require('fs');
const path = require('path');

const roomHandler = require('./api/room.js');
const actionHandler = require('./api/action.js');
const healthHandler = require('./api/health.js');

const ROOT = __dirname;
const PORT = parseInt(process.argv[2], 10) || 8787;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');

  if (url.pathname === '/api/room') return roomHandler(req, res);
  if (url.pathname === '/api/action') return actionHandler(req, res);
  if (url.pathname === '/api/health') return healthHandler(req, res);

  // static files, confined to the repo root
  const rel = url.pathname === '/' ? '/index.html' : url.pathname;
  const file = path.normalize(path.join(ROOT, rel));
  if (!file.startsWith(ROOT)) { res.statusCode = 403; return res.end('forbidden'); }

  fs.readFile(file, (err, buf) => {
    if (err) { res.statusCode = 404; return res.end('not found'); }
    res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'no-store');
    res.end(buf);
  });
});

server.listen(PORT, () => {
  console.log(`Escape the Night dev server: http://localhost:${PORT}`);
  console.log('(in-memory sessions — no KV store required)');
});
