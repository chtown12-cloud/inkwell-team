/* The puzzle standard, enforced.

   PUZZLES.md says what a puzzle in this game is. Most of that is taste, but a
   surprising amount of it can be checked, and every check below is here
   because the game broke that way at least once.

   A scenario on the reset grammar (classic:true) is held to this:

     1. THE KEY IS SOMEWHERE ELSE. Every lock names where its answer comes
        from (puzzle.from), and it is never the lock itself.
     2. NOTHING IS DEAD. Every clue in a room opens something.
     3. ALMOST NO TEXT. A lock has no prompt. Descriptions are a line, and
        never contain the answer.
     4. THE ROOM CAN BE WON. Working only from what is visible and what has
        already come out of an open lock, every lock can be opened.
     5. A LOCK IS BUILT RIGHT. Its answer is something its own face can show.
     6. HINTS LAND. Three of them, and the third says the answer.
     7. THE CHAIN IS TRUE. room.chain is the only place the whole solution is
        written down, and players are shown it on the end card.
     8. FIVE GAMES, NOT ONE IN FIVE COSTUMES. No kind of lock more than twice
        in a scenario; no two scenarios with the same shape or the same ending.

   Every scenario is built on this grammar; one that is not fails outright.

   Run with: node tests/audit.js
*/
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const SCENARIOS = ['eldermoor', 'prospero', 'vorstag', 'erebus', 'midnight'];
const root = path.join(__dirname, '..');

const loaded = [];
globalThis.registerScenario = (s) => loaded.push(s);
// the scenarios build their drawings at load, so the kits come first
for (const lib of ['art']) {
  const f = path.join(root, 'lib', lib + '.js');
  if (fs.existsSync(f)) vm.runInThisContext(fs.readFileSync(f, 'utf8'), { filename: lib });
}
const SOURCE = {};
for (const id of SCENARIOS) {
  SOURCE[id] = fs.readFileSync(path.join(root, 'scenarios', id + '.js'), 'utf8');
  vm.runInThisContext(SOURCE[id], { filename: id });
}

let fails = 0;
const fail = (where, msg) => { console.log(`  FAIL  ${where}\n        ${msg}`); fails++; };

/* A scenario is one file, and its rooms are written one after another in it. Two drawing functions with the
   same name do not collide out loud: the later one quietly replaces the earlier, and a room is drawn with
   another room's prop. (The jungle gate once wore the launch winch's clock for exactly this reason.) */
for (const id of SCENARIOS) {
  const seen = {}, twice = new Set();
  for (const m of SOURCE[id].matchAll(/^function\s+([A-Za-z_$][\w$]*)/gm)) { if (seen[m[1]]) twice.add(m[1]); seen[m[1]] = true; }
  twice.forEach(name => fail(id, `two functions are both called ${name}: the second silently replaces the first`));
}
const squash = (s) => String(s).toUpperCase().replace(/[^A-Z0-9]/g, '');
const list = (a) => Array.isArray(a) ? a.map(String) : String(a == null ? '' : a).split('');

/* ======================================================================
   THE RESET GRAMMAR
   ====================================================================== */

const HANDS_ON = new Set(['combo', 'dirpad', 'clock', 'toggle', 'press', 'tiles', 'tune', 'levels', 'keypad', 'hold', 'simul']);
// locks that are their own puzzle: nothing has to be carried to them
const SELF_CONTAINED = new Set(['tune', 'simul', 'hold']);
const DESC_MAX = 170, SOLVED_MAX = 260;

/** What is on the wheels, so that digits and colours count as different locks. */
function faceKind(p) {
  const f = (p.wheels && p.wheels[0] && p.wheels[0].faces) || p.faces;
  if (!f) return 'digits';
  if (typeof f === 'string') return /^\d+$/.test(f) ? 'digits' : 'letters';
  if (f.colors) return 'colours';
  if (f.glyphs) return 'pictures';
  return 'faces';
}
const kindOf = (p) => p.type === 'combo' ? 'combo/' + faceKind(p) : p.type;

function faceIds(p) {
  const f = (p.wheels && p.wheels[0] && p.wheels[0].faces) || p.faces || '0123456789';
  if (typeof f === 'string') return f.split('');
  if (f.colors) return f.colors;
  if (f.glyphs) return f.glyphs;
  return f.map(x => typeof x === 'string' ? x : x.id);
}
const minutes = (t) => { const [h, m] = String(t).split(':').map(Number); return (h % 12) * 60 + m; };

/** 5 ── the answer is something this lock's own face can show */
function checkBuilt(at, o) {
  const p = o.puzzle;
  if (p.type === 'combo') {
    const n = Array.isArray(p.wheels) ? p.wheels.length : p.wheels;
    const ans = Array.isArray(p.answer) ? p.answer.map(String) : (faceIds(p).some(f => String(f).length > 1) ? null : String(p.answer).split(''));
    if (!ans) return fail(at, 'a combo with named faces needs its answer as a list');
    if (ans.length !== n) fail(at, `has ${n} wheels and an answer ${ans.length} long`);
    const faces = new Set(faceIds(p).map(String));
    ans.forEach(a => { if (!faces.has(a)) fail(at, `answer needs "${a}", which is on none of its wheels`); });
    // What makes a lock worth opening properly is how many ways it can be set, not how many faces one wheel has:
    // six clutches of three settings are 729 ways, four wheels of four are only 256.
    const ways = Math.pow(faces.size, n);
    if (ways < 500) fail(at, `can only be set ${ways} ways (${faces.size} faces on ${n} wheels) — a patient team would just try them all`);
  } else if (p.type === 'dirpad') {
    if (!/^[NESW]+$/.test(String(p.answer))) fail(at, 'a compass pad takes only N, E, S and W');
    if (String(p.answer).length !== p.slots) fail(at, `has ${p.slots} slots and an answer ${String(p.answer).length} long`);
  } else if (p.type === 'clock') {
    const step = p.step || 5;
    if (!/^\d{1,2}:\d\d$/.test(String(p.answer))) return fail(at, `answer "${p.answer}" is not a time`);
    if (minutes(p.answer) % step) fail(at, `answer ${p.answer} cannot be set in ${step}-minute steps`);
    if (p.window) {
      const [a, b] = p.window.map(minutes);
      if (!(a <= minutes(p.answer) && minutes(p.answer) <= b)) fail(at, `answer ${p.answer} is outside its own window ${p.window.join('–')}`);
      if (b - a > 90) fail(at, `opens for any time across ${(b - a)} minutes — that is not a lock`);
    }
    const st = p.start || { h: 12, m: 0 };
    if (st.h + ':' + String(st.m).padStart(2, '0') === String(p.answer)) fail(at, 'starts already set to its answer');
  } else if (p.type === 'toggle') {
    const keys = p.keys ? faceIds({ faces: p.keys }).map(String) : null;
    const ans = list(p.answer), start = list(p.start || []);
    if (keys) ans.forEach(a => { if (!keys.includes(a)) fail(at, `answer switch "${a}" is not on the board`); });
    if (!ans.length) fail(at, 'has nothing switched on in its answer');
    if (ans.slice().sort().join() === start.slice().sort().join()) fail(at, 'starts already set to its answer');
  } else if (p.type === 'press') {
    const ans = list(p.answer);
    if (p.slots && ans.length !== p.slots) fail(at, `has ${p.slots} slots and an answer ${ans.length} long`);
    if (p.keys) { const keys = faceIds({ faces: p.keys }).map(String); ans.forEach(a => { if (!keys.includes(a)) fail(at, `answer press "${a}" is not a key it has`); }); }
    if (!p.repeat && new Set(ans).size !== ans.length) fail(at, 'presses the same thing twice, but is not marked repeat');
    if (!p.keys && !p.figure) fail(at, 'has neither keys nor a drawing to press');
  } else if (p.type === 'tiles') {
    const n = p.pieces ? p.pieces.length : p.cols * p.rows;
    const want = p.pieces ? list(p.answer) : Array.from({ length: n }, (_, i) => String(i));
    const start = list(p.start || []);
    if (start.length !== n) fail(at, `lays out ${start.length} pieces of ${n}`);
    if (start.slice().sort().join() !== want.slice().sort().join()) fail(at, 'starts with pieces that are not its own');
    if (start.join() === want.join()) fail(at, 'starts already solved');
    if (!p.pieces && !(p.picture && p.picture.body)) fail(at, 'has no picture to cut up');
  } else if (p.type === 'levels') {
    const n = Array.isArray(p.cols) ? p.cols.length : p.cols, max = p.max || 5, ans = list(p.answer).map(Number), start = (p.start || []).map(Number);
    if (ans.length !== n) fail(at, `has ${n} columns and an answer ${ans.length} long`);
    ans.forEach(a => { if (!(a >= 0 && a <= max)) fail(at, `answer wants a column at ${a}, but they only go to ${max}`); });
    if (ans.every((a, i) => a === (start[i] || 0))) fail(at, 'starts already set to its answer');
    if (new Set(ans).size < 2) fail(at, 'wants every column at the same height — that is not a setting, it is a switch');
  } else if (p.type === 'keypad') {
    if (!/^\d{3,8}$/.test(String(p.answer))) fail(at, `answer "${p.answer}" is not something a number pad can key`);
  } else if (p.type === 'hold') {
    const max = p.max || 10;
    if (!(p.target > 0.15 * max && p.target < 0.95 * max)) fail(at, `is to be held at ${p.target}, too near the end of a gauge that runs to ${max}`);
  } else if (p.type === 'tune') {
    if (!(p.at > p.min && p.at < p.max)) fail(at, `sits at ${p.at}, off its own dial (${p.min}–${p.max})`);
    if (Math.abs((p.start != null ? p.start : p.min) - p.at) <= (p.tol || 0.3)) fail(at, 'starts already tuned');
  }
}

/** How an answer would be said out loud, piece by piece, for looking it up in prose. */
function spoken(o) {
  const p = o.puzzle;
  if (p.type === 'tune') return { whole: [String(p.at)] };
  if (p.type === 'hold') return { whole: [String(p.target)] };
  if (p.answer == null) return {};
  if (Array.isArray(p.answer)) {
    const words = p.answer.map(String);
    // ids like "s3" or "b" are plumbing, not something a hint would say
    return words.every(w => /^[a-z]{3,}$/i.test(w) || /^\d+$/.test(w)) ? { words } : {};
  }
  const s = String(p.answer);
  return /^[A-Za-z0-9:]+$/.test(s) ? { whole: [s] } : {};
}
function saysIt(text, say) {
  if (say.whole) return say.whole.every(w => squash(text).includes(squash(w)));
  if (say.words) return say.words.every(w => new RegExp(`\\b${w}\\b`, 'i').test(text));
  return true;
}

function auditClassic(s) {
  const ids = new Set();
  const kinds = new Map();
  let locks = 0, clues = 0;

  s.rooms.forEach((room, ri) => {
    const where = `${s.id} R${ri + 1}`;
    const byId = new Map(room.objects.map(o => [o.id, o]));
    if (!room.chain) fail(where, 'has no chain documented');
    if (!room.objective) fail(where, 'has no objective');
    const used = new Set();

    room.objects.forEach(o => {
      const at = `${where} [${o.id}]`;
      if (ids.has(o.id)) fail(at, 'duplicate object id in this scenario');
      ids.add(o.id);
      const p = o.puzzle;

      /* the thing itself */
      if (!o.name || !o.icon) fail(at, 'has no name or no icon');
      if (!o.pos) fail(at, 'has no place in the room');
      else if (o.pos.x < 0 || o.pos.y < 0 || o.pos.x + o.pos.w > 100 || o.pos.y + o.pos.h > 100) fail(at, 'stands partly off the stage');
      if (!o.sprite) fail(at, 'is not drawn in the room (no sprite): what can be examined must be visible from across it');
      if (!p && !o.figure) fail(at, 'is neither a lock nor a clue: it has no puzzle and no drawing');
      for (const fig of [o.figure, p && p.inside && p.inside.figure, p && p.plate]) {
        if (!fig) continue;
        const tag = (/<svg[^>]*>/.exec(fig) || [''])[0];
        if (!/viewBox=/.test(tag)) fail(at, 'has a drawing with no viewBox, so it cannot scale');
        if (/\swidth=|\sheight=/.test(tag)) fail(at, 'has a drawing with a fixed size on its root svg');
        if (/<svg[^>]*\sx=/.test(fig.slice(tag.length))) fail(at, 'nests an <svg> inside a drawing — use ART.inset; a nested viewport clips translucent art on phones');
      }

      /* 3 ── almost no text */
      if (!o.desc) fail(at, 'has no description');
      if ((o.desc || '').length > DESC_MAX) fail(at, `description runs to ${o.desc.length} characters (${DESC_MAX} is a line and a half)`);
      if ((o.deadDesc || '').length > DESC_MAX) fail(at, `deadDesc runs to ${o.deadDesc.length} characters`);
      if (/\n/.test(o.desc || '')) fail(at, 'description has line breaks: a table in prose is a drawing that was never drawn');

      /* gating points somewhere real */
      for (const key of ['hiddenUntil', 'needs', 'watches']) {
        for (const dep of [].concat(o[key] || [])) {
          if (dep === o.id) fail(at, `${key} points at itself`);
          else if (!byId.has(dep)) fail(at, `${key}:'${dep}' is not an object in this room`);
          else if (!byId.get(dep).puzzle) fail(at, `${key}:'${dep}' is not a lock, so it can never be satisfied`);
        }
      }
      if (o.needs && !o.deadDesc) fail(at, 'can stand dead in the room but has nothing to say while it does (deadDesc)');
      // a drawing that says it follows other locks has to be one that can change
      if (o.watches && typeof o.sprite !== 'function') fail(at, 'watches other locks but is drawn the same whatever they do (sprite is not a function)');

      if (!p) { clues++; return; }
      locks++;
      const kind = kindOf(p);
      kinds.set(kind, (kinds.get(kind) || []).concat(o.id));

      if (!HANDS_ON.has(p.type)) fail(at, `is a "${p.type || 'text'}" puzzle: nothing on this grammar is typed`);
      if (p.prompt) fail(at, 'carries a prompt: a lock shows the shape of its answer, it does not explain itself');
      if ((p.solvedText || '').length > SOLVED_MAX) fail(at, `solved text runs to ${p.solvedText.length} characters`);

      /* 1 ── the key is somewhere else */
      const from = p.from || [];
      if (!from.length && !SELF_CONTAINED.has(p.type) && !(p.type === 'tiles' && !p.pieces)) {
        fail(at, 'does not say where its answer comes from (puzzle.from)');
      }
      from.forEach(f => {
        used.add(f);
        if (f === o.id) return fail(at, 'names itself as the source of its own answer');
        const src = byId.get(f);
        if (!src) return fail(at, `from:'${f}' is not an object in this room`);
        if (src.puzzle && !src.puzzle.inside) fail(at, `takes its answer from the lock '${f}', but nothing comes out of that lock (inside)`);
        if (!src.puzzle && !src.figure) fail(at, `takes its answer from '${f}', which has nothing to look at`);
      });

      /* the answer is not lying in the free text */
      const say = spoken(o);
      for (const [label, text] of [['description', o.desc], ['name', o.name], ['objective', room.objective], ['intro', room.intro]]) {
        if (!text || !say.whole) continue;
        if (say.whole.some(w => squash(w).length >= 3 && squash(text).includes(squash(w)))) fail(at, `answer is sitting in the ${label}`);
      }

      /* 5 ── built right */
      checkBuilt(at, o);

      /* 6 ── hints land */
      if (!p.hints || p.hints.length !== 3) fail(at, `has ${(p.hints || []).length} hints, expected 3`);
      (p.hints || []).forEach((h, i) => { if (!h || h.length < 20) fail(at, `hint ${i + 1} is too short to narrow anything`); });
      if (p.hints && p.hints[2] && !saysIt(p.hints[2], say)) fail(at, `third hint does not say the answer (${JSON.stringify(p.answer != null ? p.answer : p.at)})`);
      if (p.hints && p.hints[0] && say.whole && saysIt(p.hints[0], say) && squash(say.whole[0]).length >= 3) fail(at, 'first hint already gives the answer away');

      /* 7 ── the chain is true */
      if (room.chain && !saysIt(room.chain, say)) fail(at, `answer ${JSON.stringify(p.answer != null ? p.answer : p.at)} does not appear in the room's chain — one of them is stale`);

      const isFinale = room === s.rooms[s.rooms.length - 1] && room.objects[room.objects.length - 1].id === o.id;
      if (!isFinale && !p.solvedText) fail(at, 'has no solved text');
    });

    /* 2 ── nothing is dead */
    room.objects.forEach(o => {
      if (!o.puzzle && !used.has(o.id)) fail(`${where} [${o.id}]`, 'is a clue that no lock in the room uses');
    });

    /* 4 ── the room can be won, working only from what is in hand */
    const solved = new Set();
    const seen = (o) => !o.hiddenUntil || solved.has(o.hiddenUntil);
    const live = (o) => [].concat(o.needs || []).every(d => solved.has(d));
    const inHand = (f) => { const src = byId.get(f); return !!src && seen(src) && (src.puzzle ? solved.has(f) : live(src)); };
    const todo = room.objects.filter(o => o.puzzle);
    const waves = [];
    for (;;) {
      const open = todo.filter(o => !solved.has(o.id) && seen(o) && live(o) && (o.puzzle.from || []).every(inHand));
      if (!open.length) break;
      waves.push(open.map(o => o.id));
      open.forEach(o => solved.add(o.id));
    }
    const stuck = todo.filter(o => !solved.has(o.id)).map(o => o.id);
    if (stuck.length) fail(where, `cannot be finished: ${stuck.join(', ')} can never be opened from what is in hand`);
    room._waves = waves;
  });

  /* 8 ── variety inside the scenario */
  for (const [kind, where] of kinds) {
    if (where.length > 2) fail(s.id, `uses the ${kind} lock ${where.length} times (${where.join(', ')}): twice is the limit`);
  }
  if (kinds.size < 7) fail(s.id, `has only ${kinds.size} kinds of lock in the whole game`);

  console.log(`  ok    ${s.id}: ${s.rooms.length} rooms, ${locks} locks, ${clues} clues, ${kinds.size} kinds of lock`);
  s.rooms.forEach((room, ri) => console.log(`          R${ri + 1}  ${room._waves.map(w => w.join(' + ')).join('  →  ')}`));
  return locks;
}

/* ====================================================================== */

console.log('--- every scenario ---');
let total = 0;
for (const s of loaded) {
  if (!s.classic) { fail(s.id, 'is not built on the reset grammar (classic), and nothing else is audited any more'); continue; }
  total += auditClassic(s);
}

/* The five must not collapse back into one game in five costumes. This only
   measures the shape, which is a floor rather than a ceiling — what actually
   keeps them apart is the mechanics table in PUZZLES.md, and that one needs
   a human. */
console.log('\n--- shapes (a floor, not a ceiling: see PUZZLES.md) ---');
const kindLabel = (o) => o.puzzle.type ? kindOf(o.puzzle) : 'text';
const shapes = loaded.map(s => [s.id, s.rooms.map(r => r.objects.filter(o => o.puzzle).map(kindLabel).join('-')).join(' | ')]);
const seenShape = new Map();
for (const [id, shape] of shapes) {
  console.log(`  ${id.padEnd(10)} ${shape}`);
  if (seenShape.has(shape)) fail(id, `has the same lock-by-lock shape as ${seenShape.get(shape)}`);
  seenShape.set(shape, id);
}

const finales = loaded.map(s => {
  const last = s.rooms[s.rooms.length - 1];
  const o = last.objects[last.objects.length - 1];
  const p = o.puzzle || {};
  return [s.id, kindLabel(o) + ':' + JSON.stringify(p.answer != null ? p.answer : p.target != null ? p.target : (p.answers || [''])[0])];
});
const fseen = new Map();
for (const [id, f] of finales) {
  if (fseen.has(f)) fail(id, `ends exactly like ${fseen.get(f)}`);
  fseen.set(f, id);
}
console.log(`  ${fseen.size} of ${finales.length} finales are distinct`);

console.log(fails ? `\n${fails} FAILURES` : `\nall ${total} puzzles meet the standard`);
process.exit(fails ? 1 : 0);
