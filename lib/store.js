/* ============================================================
   Session store.

   Backed by Vercel KV (Upstash Redis REST) in production. When no
   credentials are configured — local dev, tests, or a deploy where the
   KV store was never created — it silently falls back to an in-memory
   Map so the API still works and the game degrades to single-screen
   play instead of breaking.
   ============================================================ */

const TTL_SECONDS = 6 * 60 * 60; // sessions self-destruct after 6 hours

const URL_ENV = ['KV_REST_API_URL', 'UPSTASH_REDIS_REST_URL'];
const TOKEN_ENV = ['KV_REST_API_TOKEN', 'UPSTASH_REDIS_REST_TOKEN'];

const pick = (names) => { for (const n of names) if (process.env[n]) return process.env[n]; return null; };

const kvUrl = () => pick(URL_ENV);
const kvToken = () => pick(TOKEN_ENV);

/** True when a real KV store is wired up. */
function isPersistent() { return !!(kvUrl() && kvToken()); }

/* ---------- in-memory fallback ---------- */
const memory = new Map(); // key -> { value, expiresAt }

function memGet(key) {
  const hit = memory.get(key);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) { memory.delete(key); return null; }
  return hit.value;
}
function memSet(key, value) {
  memory.set(key, { value, expiresAt: Date.now() + TTL_SECONDS * 1000 });
  // opportunistic sweep so a long-lived dev server can't grow without bound
  if (memory.size > 500) {
    const now = Date.now();
    for (const [k, v] of memory) if (v.expiresAt < now) memory.delete(k);
  }
}

/* ---------- Upstash REST ---------- */
async function kvFetch(path, options) {
  const res = await fetch(`${kvUrl()}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${kvToken()}`, ...(options && options.headers) },
  });
  if (!res.ok) throw new Error(`kv ${res.status}`);
  return res.json();
}

async function getRoom(code) {
  const key = `room:${code}`;
  if (!isPersistent()) return memGet(key);
  try {
    const out = await kvFetch(`/get/${encodeURIComponent(key)}`, { method: 'GET' });
    if (!out || out.result == null) return null;
    return typeof out.result === 'string' ? JSON.parse(out.result) : out.result;
  } catch (e) {
    return memGet(key); // never let a KV blip take the game down
  }
}

async function setRoom(code, room) {
  const key = `room:${code}`;
  memSet(key, room); // always keep the local copy as a warm fallback
  if (!isPersistent()) return;
  try {
    await kvFetch(`/set/${encodeURIComponent(key)}?EX=${TTL_SECONDS}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(room),
    });
  } catch (e) { /* in-memory copy already written */ }
}

module.exports = { getRoom, setRoom, isPersistent, TTL_SECONDS };
