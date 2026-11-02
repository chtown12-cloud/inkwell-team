/* The puzzle standard, enforced.

   PUZZLES.md says what every puzzle has to do. Most of it is a judgement
   call, but four things are checkable, and all four of them were broken
   somewhere in the game before the rebuild:

     1. No prop states the method. The old locks said NAME ME AS THE EBB
        WOULD SPEAK IT — BACKWARD, THE GATE WINDS BACK, PINS PULLED IN
        REVERSE, and the junction listened at TWICE the record.
     2. Every puzzle carries a prompt, three hints and solved text.
     3. Gating points at objects that exist in the same room.
     4. room.chain matches the puzzles. It is the only place the whole
        solution is written down and players are shown it on the end card,
        so a stale chain is a bug.

   Run with: node tests/audit.js
*/
const fs = require('fs');
const vm = require('vm');
const path = require('path');

const SCENARIOS = ['eldermoor', 'prospero', 'vorstag', 'erebus', 'midnight'];
const root = path.join(__dirname, '..');

const loaded = [];
globalThis.registerScenario = (s) => loaded.push(s);
for (const id of SCENARIOS) {
  vm.runInThisContext(fs.readFileSync(path.join(root, 'scenarios', id + '.js'), 'utf8'), { filename: id });
}

let fails = 0;
const fail = (where, msg) => { console.log(`  FAIL  ${where}\n        ${msg}`); fails++; };

/* 1 ─────────────────────────────────────────── nothing states the method */

// Phrases that only ever appear when a prop is telling the player which
// transformation to apply. Each of these was live in the game before.
const BANNED = [
  /runs? backward/i, /speak it\s*[—-]?\s*backward/i, /\bbackwards?\b(?!\s*(?:into|through))/i,
  /\bin reverse\b/i, /\breversed\b/i, /winds? back\b/i,
  /twice it\b/i, /twice the (?:band|dish|record|station|stop)\b/i,
  /\bdoubled\b/i, /\btripled\b/i, /wrong way round/i,
  /the other way\b/i, /set it right\b/i, /read straight down\b/i,
];
// Prose is allowed to describe motion; only clue-bearing fields are checked.
const ALLOW = [
  /mist rips backward into the recyclers/i,   // describing a purge, not a method
];

function scanText(where, text) {
  if (!text) return;
  for (const re of BANNED) {
    const m = text.match(re);
    if (!m) continue;
    if (ALLOW.some(a => a.test(text))) continue;
    fail(where, `says "${m[0]}" — a prop stating the method: ${text.slice(Math.max(0, m.index - 60), m.index + 60).replace(/\n/g, ' ')}`);
  }
}

/* 4 ───────────────────────── the chain agrees with the puzzles it describes */
const squash = (s) => String(s).toUpperCase().replace(/[^A-Z0-9]/g, '');

console.log('--- every scenario ---');
for (const s of loaded) {
  const ids = new Set();
  let puzzles = 0;

  s.rooms.forEach((room, ri) => {
    const where = `${s.id} R${ri + 1}`;
    const here = new Set(room.objects.map(o => o.id));
    const chain = squash(room.chain || '');
    if (!room.chain) fail(where, 'has no chain documented');

    scanText(`${where} chain`, room.chain);

    room.objects.forEach(o => {
      const at = `${where} [${o.id}]`;
      if (ids.has(o.id)) fail(at, 'duplicate object id in this scenario');
      ids.add(o.id);

      scanText(`${at} desc`, o.desc);
      scanText(`${at} revealDesc`, o.revealDesc);

      /* 3 ── gating points somewhere real */
      for (const key of ['hiddenUntil', 'revealedBy']) {
        if (o[key] && !here.has(o[key])) fail(at, `${key}:'${o[key]}' is not an object in this room`);
        if (o[key] === o.id) fail(at, `${key} points at itself`);
      }

      const p = o.puzzle;
      if (!p) return;
      puzzles++;

      scanText(`${at} prompt`, p.prompt);
      (p.hints || []).forEach((h, i) => scanText(`${at} hint ${i + 1}`, h));
      scanText(`${at} solvedText`, p.solvedText);

      /* 2 ── every puzzle is fully furnished */
      if (!p.prompt) fail(at, 'has no prompt');
      if (!p.hints || p.hints.length !== 3) fail(at, `has ${(p.hints || []).length} hints, expected 3`);
      (p.hints || []).forEach((h, i) => {
        if (!h || h.length < 20) fail(at, `hint ${i + 1} is too short to narrow anything`);
      });
      // The finale ends the game outright, so it has nothing to say afterwards.
      const isFinale = room === s.rooms[s.rooms.length - 1]
        && room.objects[room.objects.length - 1].id === o.id;
      if (!isFinale && !p.solvedText) fail(at, 'has no solved text');

      /* 4 ── the answer appears in the room's chain.
         A control panel's answer is several settings rather than one word,
         so each setting has to be documented, not the run-on of all three. */
      const ans = (p.answers || [])[0];
      for (const part of String(ans || '').split('|')) {
        if (part && !chain.includes(squash(part))) {
          fail(at, `answer ${part} does not appear in the room's chain — one of them is stale`);
        }
      }
    });
  });

  console.log(`  ok    ${s.id}: ${s.rooms.length} rooms, ${puzzles} puzzles, ${ids.size} objects`);
}

/* The five must not collapse back into one game in five costumes. This only
   measures the slot profile, which is a floor rather than a ceiling — what
   actually keeps them apart is the mechanics table in PUZZLES.md, and that
   one needs a human. */
console.log('\n--- slot profiles (a floor, not a ceiling: see PUZZLES.md) ---');
const shapes = loaded.map(s => [s.id, s.rooms.map(r =>
  r.objects.filter(o => o.puzzle).map(o => o.puzzle.type || 'text').join('-')).join('|')]);
const seen = new Map();
for (const [id, shape] of shapes) {
  console.log(`  ${id.padEnd(10)} ${shape}`);
  if (seen.has(shape)) fail(id, `has the same puzzle-type profile as ${seen.get(shape)}`);
  seen.set(shape, id);
}

const finales = loaded.map(s => {
  const last = s.rooms[s.rooms.length - 1];
  const o = last.objects[last.objects.length - 1];
  return [s.id, (o.puzzle && (o.puzzle.type || 'text')) + ':' + ((o.puzzle && o.puzzle.answers) || [''])[0]];
});
const fseen = new Map();
for (const [id, f] of finales) {
  if (fseen.has(f)) fail(id, `ends exactly like ${fseen.get(f)}`);
  fseen.set(f, id);
}
console.log(`  ${fseen.size} of ${finales.length} finales are distinct`);

const total = loaded.reduce((n, s) => n + s.rooms.reduce((m, r) => m + r.objects.filter(o => o.puzzle).length, 0), 0);
console.log(fails ? `\n${fails} FAILURES` : `\nall ${total} puzzles meet the standard`);
process.exit(fails ? 1 : 0);
