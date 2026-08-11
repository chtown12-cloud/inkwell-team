/* ============================================================
   Session rules, shared by the API routes and the local dev server.

   The server is deliberately dumb: it never sees puzzle answers or hint
   text, it only records that an object was solved. Everything it stores
   is validated for SHAPE before it is written, and the client renders
   text from its own in-repo scenario files rather than from anything
   the server returns — so no server value is ever trusted as markup.
   ============================================================ */

// no O/0/I/1 — codes get read aloud over a video call
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

const MAX_PLAYERS = 12;
const MAX_NAME = 20;
const MAX_SOLVED = 40;
// Long think times are the point of this game: someone can stare at a
// mastermind grid for several minutes without touching anything. A short
// timeout used to drop them from the crew and lock them out.
const IDLE_MS = 15 * 60 * 1000;
const MAX_ROOM_INDEX = 7;

const ID_RE = /^[A-Za-z0-9_-]{1,32}$/;   // object ids and player ids
const CODE_RE = new RegExp(`^[${CODE_ALPHABET}]{${CODE_LENGTH}}$`);
const SCENARIO_RE = /^[a-z0-9-]{1,32}$/;

function makeCode() {
  let out = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    out += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return out;
}

const isCode = (v) => typeof v === 'string' && CODE_RE.test(v);
const isId = (v) => typeof v === 'string' && ID_RE.test(v);
const isScenario = (v) => typeof v === 'string' && SCENARIO_RE.test(v);

/** Nicknames are user input: strip control chars, collapse space, hard cap. */
function sanitizeName(raw) {
  const s = String(raw == null ? '' : raw)
    .replace(/[\u0000-\u001f\u007f\u200b-\u200f\u2028\u2029\ufeff]/g, '') // control, bidi, zero-width
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, MAX_NAME);
  return s || 'Crew';
}

/** Emoji field is display-only; keep it to a couple of characters. */
function sanitizeEmoji(raw) {
  return Array.from(String(raw == null ? '' : raw)).slice(0, 2).join('') || '🙂';
}

function newRoom(scenario, difficulty) {
  return {
    code: makeCode(),
    scenario: isScenario(scenario) ? scenario : 'eldermoor',
    difficulty: difficulty === 'relaxed' ? 'relaxed' : 'standard',
    roomIndex: 0,
    startTime: Date.now(),
    solved: [],
    seats: {},
    players: [],
    hintsShown: {},
    hintsUsed: 0,
    wrongCount: 0,
    penaltySec: 0,
    finished: false,
    // who is driving the shared screen; `online` is flipped to false by the
    // database itself when that tab disconnects
    host: { id: '', online: false, seen: 0 },
    rev: 1,
  };
}

/** Drop idle players and free the seats they were holding. */
function reap(room, now) {
  const cutoff = (now || Date.now()) - IDLE_MS;
  const before = room.players.length;
  const live = new Set();
  room.players = room.players.filter((p) => {
    if (p.lastSeen >= cutoff) { live.add(p.id); return true; }
    return false;
  });
  if (room.players.length !== before) {
    for (const objId of Object.keys(room.seats)) {
      room.seats[objId] = room.seats[objId].filter((id) => live.has(id));
      if (!room.seats[objId].length) delete room.seats[objId];
    }
  }
  return room;
}

function seatCount(room, objId) {
  return (room.seats[objId] || []).length;
}

/**
 * Apply one action. Returns { ok, error }.
 * Every branch validates its own inputs; unknown actions are rejected.
 */
function applyAction(room, body) {
  const now = Date.now();
  const action = body && body.action;
  const playerId = body && body.playerId;

  if (!isId(playerId)) return { ok: false, error: 'bad player' };
  reap(room, now);

  const me = room.players.find((p) => p.id === playerId);
  if (me) me.lastSeen = now;

  switch (action) {
    case 'join': {
      if (me) {
        me.name = sanitizeName(body.name);
        me.emoji = sanitizeEmoji(body.emoji);
        break;
      }
      if (room.players.length >= MAX_PLAYERS) return { ok: false, error: 'room full' };
      room.players.push({
        id: playerId,
        name: sanitizeName(body.name),
        emoji: sanitizeEmoji(body.emoji),
        lastSeen: now,
      });
      break;
    }

    case 'ping': // keep-alive only; lastSeen already refreshed above
      if (!me) return { ok: false, error: 'not joined' };
      break;

    case 'claimHost': {
      // Anyone holding the code may take over a screen that has gone away;
      // gating it would add friction without adding protection, since they
      // can already join and solve.
      if (!me) return { ok: false, error: 'not joined' };
      room.host = { id: playerId, online: true, seen: now };
      break;
    }

    case 'hostPing': {
      if (!room.host || room.host.id !== playerId) break;   // not the host: ignore
      room.host.online = true;
      room.host.seen = now;
      break;
    }

    case 'hostLeft': {
      // the screen saying so itself, rather than the database inferring it
      if (!room.host || room.host.id !== playerId) break;
      room.host.online = false;
      break;
    }

    case 'sit': {
      if (!me) return { ok: false, error: 'not joined' };
      if (!isId(body.objId)) return { ok: false, error: 'bad object' };
      // Seats are PRESENCE, not a gate: a puzzle never refuses a player and one
      // person may solve alone. Solved objects still accept people, because
      // teams go back to re-read a clue and the crew should see them do it —
      // solving only sweeps the seats once (below), to move everyone along.
      // The only bound is a safety cap so the array cannot grow past the
      // player limit.
      const current = room.seats[body.objId] || [];
      if (current.includes(playerId)) break;               // idempotent
      if (current.length >= MAX_PLAYERS) return { ok: false, error: 'too many' };
      // a player occupies one puzzle at a time
      for (const id of Object.keys(room.seats)) {
        room.seats[id] = room.seats[id].filter((p) => p !== playerId);
        if (!room.seats[id].length) delete room.seats[id];
      }
      room.seats[body.objId] = [...(room.seats[body.objId] || []), playerId];
      break;
    }

    case 'stand': {
      if (!isId(body.objId)) return { ok: false, error: 'bad object' };
      const list = (room.seats[body.objId] || []).filter((p) => p !== playerId);
      if (list.length) room.seats[body.objId] = list; else delete room.seats[body.objId];
      break;
    }

    case 'solve': {
      if (!me) return { ok: false, error: 'not joined' };
      if (!isId(body.objId)) return { ok: false, error: 'bad object' };
      if (room.solved.length >= MAX_SOLVED) return { ok: false, error: 'too many' };
      if (!room.solved.includes(body.objId)) room.solved.push(body.objId);
      delete room.seats[body.objId]; // solved puzzles free their crew
      break;
    }

    case 'hint': {
      if (!me) return { ok: false, error: 'not joined' };
      if (!isId(body.objId)) return { ok: false, error: 'bad object' };
      const cost = Math.min(Math.max(parseInt(body.cost, 10) || 0, 0), 600);
      const shown = Math.min(Math.max(parseInt(body.shown, 10) || 0, 0), 3);
      const prev = room.hintsShown[body.objId] || 0;
      if (shown <= prev) break;                 // replayed request, ignore
      if (Object.keys(room.hintsShown).length > MAX_SOLVED) return { ok: false, error: 'too many' };
      room.hintsShown[body.objId] = shown;
      room.hintsUsed += 1;
      room.penaltySec += cost;
      break;
    }

    case 'wrong': {
      if (!me) return { ok: false, error: 'not joined' };
      const cost = Math.min(Math.max(parseInt(body.cost, 10) || 0, 0), 60);
      room.wrongCount += 1;
      room.penaltySec += cost;
      break;
    }

    case 'advance': {
      if (!me) return { ok: false, error: 'not joined' };
      const target = parseInt(body.roomIndex, 10);
      if (!Number.isInteger(target) || target < 0 || target > MAX_ROOM_INDEX) {
        return { ok: false, error: 'bad room' };
      }
      // monotonic: only ever forward, and only one room at a time
      if (target === room.roomIndex + 1) { room.roomIndex = target; room.seats = {}; }
      break;
    }

    case 'finish': {
      if (!me) return { ok: false, error: 'not joined' };
      room.finished = true;
      break;
    }

    default:
      return { ok: false, error: 'unknown action' };
  }

  room.rev = (room.rev || 0) + 1;
  return { ok: true };
}


/**
 * Coerce a room read back from storage into the shape the game expects.
 * Firebase Realtime Database drops empty objects/arrays entirely (they come
 * back as null) and may hand arrays back as objects keyed by index, so this
 * runs on every read.
 */
function normalizeRoom(room) {
  if (!room || typeof room !== 'object') return null;
  const asArray = (v) => (Array.isArray(v) ? v : v && typeof v === 'object' ? Object.values(v) : []);
  const asObject = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});
  room.solved = asArray(room.solved).filter(isId);
  room.players = asArray(room.players).filter((p) => p && isId(p.id));
  room.hintsShown = asObject(room.hintsShown);
  const seats = asObject(room.seats);
  room.seats = {};
  for (const key of Object.keys(seats)) {
    const list = asArray(seats[key]).filter(isId);
    if (list.length) room.seats[key] = list;
  }
  room.roomIndex = Number(room.roomIndex) || 0;
  room.penaltySec = Number(room.penaltySec) || 0;
  room.hintsUsed = Number(room.hintsUsed) || 0;
  room.wrongCount = Number(room.wrongCount) || 0;
  room.rev = Number(room.rev) || 0;
  room.finished = !!room.finished;
  const h = room.host && typeof room.host === 'object' ? room.host : {};
  room.host = { id: typeof h.id === 'string' ? h.id : '', online: !!h.online, seen: Number(h.seen) || 0 };
  return room;
}

const API = {
  makeCode, newRoom, applyAction, reap, seatCount, normalizeRoom,
  isCode, isId, isScenario, sanitizeName, sanitizeEmoji,
  CODE_ALPHABET, CODE_LENGTH, MAX_PLAYERS, IDLE_MS,
};

if (typeof module !== 'undefined' && module.exports) module.exports = API;
if (typeof globalThis !== 'undefined') globalThis.SESSION = API;
