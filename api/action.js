/* ============================================================
   POST /api/action  { code, playerId, action, ... }

   One endpoint for every mutation: join, ping, sit, stand, solve,
   hint, wrong, advance, finish. All validated in lib/session.js.

   Concurrency: sessions are tiny and writes are last-write-wins, but
   every action is written as a read-modify-write of the whole room and
   each action is idempotent (solving twice, sitting twice, replayed
   hints) so a lost update degrades to a slightly stale rev, never to a
   lost solve — the next poll reconciles it.
   ============================================================ */

const { getRoom, setRoom } = require('../lib/store.js');
const { applyAction, isCode } = require('../lib/session.js');
const { readBody, send, bodyProblem } = require('./room.js');

module.exports = async function handler(req, res) {
  try {
    if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'method not allowed' });

    const body = await readBody(req);
    if (bodyProblem(res, body)) return;
    const code = String(body.code || '').toUpperCase();
    if (!isCode(code)) return send(res, 400, { ok: false, error: 'bad code' });

    const room = await getRoom(code);
    if (!room) return send(res, 404, { ok: false, error: 'no such game' });

    const out = applyAction(room, body);
    if (!out.ok) return send(res, 400, { ok: false, error: out.error });

    await setRoom(code, room);
    return send(res, 200, { ok: true, room });
  } catch (e) {
    return send(res, 500, { ok: false, error: 'server error' });
  }
};
