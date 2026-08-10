/* ============================================================
   GET  /api/room?code=ABCDEF   -> current session state
   POST /api/room               -> create a session, returns its code

   Same-origin only. Stores no puzzle answers, no hints, no accounts.
   ============================================================ */

const { getRoom, setRoom, isPersistent } = require('../lib/store.js');
const { newRoom, reap, isCode, isScenario } = require('../lib/session.js');

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

const TOO_LARGE = Symbol('too-large');
const BAD_JSON = Symbol('bad-json');
const MAX_BODY = 8192;

/**
 * Read and parse a JSON body, bounded. Oversized bodies are drained and
 * reported rather than dropped on the floor, so the client gets a real 413
 * instead of a mystery network error.
 */
async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;   // Vercel pre-parses
  return await new Promise((resolve) => {
    let raw = '';
    let over = false;
    req.on('data', (c) => {
      if (over) return;
      raw += c;
      if (raw.length > MAX_BODY) { over = true; raw = ''; }
    });
    req.on('end', () => {
      if (over) return resolve(TOO_LARGE);
      try { resolve(JSON.parse(raw || '{}')); } catch (e) { resolve(BAD_JSON); }
    });
    req.on('error', () => resolve(BAD_JSON));
  });
}

/** Returns a response-shaped guard result, or null when the body is usable. */
function bodyProblem(res, body) {
  if (body === TOO_LARGE) { send(res, 413, { ok: false, error: 'payload too large' }); return true; }
  if (body === BAD_JSON) { send(res, 400, { ok: false, error: 'bad json' }); return true; }
  return false;
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const body = await readBody(req);
      if (bodyProblem(res, body)) return;
      const scenario = isScenario(body.scenario) ? body.scenario : 'eldermoor';
      const room = newRoom(scenario, body.difficulty);
      await setRoom(room.code, room);
      return send(res, 200, { ok: true, room, persistent: isPersistent() });
    }

    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://localhost');
      const code = (url.searchParams.get('code') || '').toUpperCase();
      if (!isCode(code)) return send(res, 400, { ok: false, error: 'bad code' });
      const room = await getRoom(code);
      if (!room) return send(res, 404, { ok: false, error: 'no such game' });
      reap(room, Date.now());
      return send(res, 200, { ok: true, room });
    }

    return send(res, 405, { ok: false, error: 'method not allowed' });
  } catch (e) {
    return send(res, 500, { ok: false, error: 'server error' });
  }
};

module.exports.readBody = readBody;
module.exports.send = send;
module.exports.bodyProblem = bodyProblem;
