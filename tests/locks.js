/* The locks, worked the wrong way on purpose.

   playthrough.js proves every lock opens when it is worked right. This is
   the other half: that each kind of lock behaves like a thing in your hands.
   Wheels wrap, a wrong try holds and costs five seconds, a half-set lock is
   as you left it when you come back, a thing waiting on power stays dead,
   the lantern shows nothing until you have it and moves when you move it.

   And the drawings, because on this grammar a drawing IS the clue: every
   object has to be standing in the room where its ring is, and every
   close-up has to arrive at a size somebody can read — on the shared screen
   and on a phone.

   Runs against every scenario on the reset grammar, from its own data.

   Needs the dev server:  node dev-server.js &  then  node tests/locks.js
*/
const { launch, devices } = require('./browser');

const BASE = 'http://localhost:8787';
const ASKED = process.argv.slice(2);
const QUICK = { timeout: 5000 };       // a control that is there is there at once

let fails = 0;
const ok = (l, c, x) => { console.log((c ? '  ok   ' : '  FAIL ') + l + (x && !c ? '\n         ' + x : '')); if (!c) fails++; };
/** Collect per-object problems under one line, so a clean run is short and a broken one says where. */
function tally() {
  const bad = []; let n = 0;
  return { hit: (c, what) => { n++; if (!c) bad.push(what); }, report: (label) => ok(`${label} (${n})`, !bad.length, bad.slice(0, 6).join('; ')), n: () => n };
}

const clearBeat = async (p) => {
  for (let i = 0; i < 12; i++) {
    if (!(await p.evaluate(() => typeof beatShowing !== 'undefined' && beatShowing))) return;
    await p.click('#beatveil', { force: true });
    await p.waitForTimeout(120);
  }
};
async function start(p, scenario) {
  await p.goto(BASE + '/?s=' + scenario);
  await p.fill('#team-name', 'Krakens');
  await p.click('#start-btn');
  await p.waitForTimeout(500);
  if (await p.isVisible('#qr-panel')) await p.click('#qr-done', { force: true });
  await p.waitForSelector('#enter-room-btn', { timeout: 8000 });
  await p.click('#enter-room-btn');
  await clearBeat(p);
  // The director's intrusions, and the story beat every third wrong try
  // earns, raise a veil over the board. Neither is this test's job (they have
  // onescreen.js), and this test gets a great many things wrong on purpose.
  await p.evaluate(() => { S.staged = { arrival: 1, squeeze: 1, midroom: 1 }; showBeat = function () {}; });
}
async function goRoom(p, room) {
  await p.evaluate((room) => { closeModal(); if (S.roomIndex !== room) enterRoom(room); }, room);
  if (await p.locator('#enter-room-btn').count()) { await p.click('#enter-room-btn', { force: true }); await clearBeat(p); }
}
/**
 * Put an object in front of the player in a known state, with nothing left
 * over from the last test: the lock's own working state is wiped, and what
 * it needs is open (or, for `dead`, still shut).
 */
async function face(p, room, id, state = 'live') {
  await goRoom(p, room);
  await p.evaluate(({ room, id, state }) => {
    const objs = ACTIVE.rooms[room].objects, o = objs.find(x => x.id === id);
    objs.forEach(x => S.solved.delete(x.id));
    LOCKS.reset();
    if (o.hiddenUntil) S.solved.add(o.hiddenUntil);
    if (state !== 'dead') [].concat(o.needs || []).forEach(d => S.solved.add(d));
    // a lantern or a card comes out of some other lock: have it, unless told not to
    const gear = [o.lens, o.tool, o.puzzle && o.puzzle.lens].filter(g => g && g.needs).map(g => g.needs);
    if (state !== 'bare') gear.forEach(g => S.solved.add(g));
    if (state === 'open') S.solved.add(id);
    renderHotspots();
    openModal(id);
  }, { room, id, state });
  await p.waitForSelector('#modal h3', { timeout: 6000 });
  await p.waitForTimeout(60);
}
const reopen = async (p, id) => { await p.evaluate((id) => { closeModal(); openModal(id); }, id); await p.waitForSelector('#modal h3'); };
const isOpen = (p, id) => p.evaluate((id) => S.solved.has(id), id);
const penalty = (p) => p.evaluate(() => S.penaltySec);
const failed = (p) => p.locator('.feedback.bad').count().then(n => n > 0);

/* ---------------------------------------------------------------- the kinds */
const KINDS = {
  async combo(p, o, t) {
    const n = await p.locator('.lk-wheel').count();
    t.hit(n === o.want.length, `${o.id}: ${n} wheels for an answer ${o.want.length} long`);
    if (o.rings) t.hit((await p.locator('.lk-wheel.ringed').count()) === o.rings, `${o.id}: not every marked wheel wears its ring`);
    const v0 = await p.getAttribute('.lk-wheel[data-w="0"]', 'data-v');
    for (let i = 0; i < o.faces; i++) await p.click('.lk-wheel[data-w="0"] .lk-step.up');
    t.hit((await p.getAttribute('.lk-wheel[data-w="0"]', 'data-v')) === v0, `${o.id}: a wheel does not come back round after ${o.faces} clicks`);
    await p.click('.lk-wheel[data-w="0"] .lk-step.dn');
    const back = await p.getAttribute('.lk-wheel[data-w="0"]', 'data-v');
    t.hit(back !== v0, `${o.id}: the down arrow does nothing`);
    await p.click('.lk-wheel[data-w="0"] .lk-face');                 // the face itself is a button too
    t.hit((await p.getAttribute('.lk-wheel[data-w="0"]', 'data-v')) === v0, `${o.id}: tapping the face does not step it on`);
    await p.click('.lk-wheel[data-w="1"] .lk-step.up');
    const left = await p.getAttribute('.lk-wheel[data-w="1"]', 'data-v');
    await reopen(p, o.id);
    t.hit((await p.getAttribute('.lk-wheel[data-w="1"]', 'data-v')) === left, `${o.id}: forgets where its wheels were when you walk away`);
    const at = await p.evaluate(() => [...document.querySelectorAll('.lk-wheel')].map(w => w.dataset.v));
    if (at.join() === o.want.join()) await p.click('.lk-wheel[data-w="0"] .lk-step.up');
    const before = await penalty(p);
    await p.click('.lk-try');
    t.hit(!(await isOpen(p, o.id)) && await failed(p), `${o.id}: opened, or said nothing, on a wrong combination`);
    t.hit((await penalty(p)) === before + 5, `${o.id}: a wrong try did not cost five seconds`);
  },
  async dirpad(p, o, t) {
    const wrong = /^N+$/.test(o.want) ? 'S' : 'N';
    await p.click(`.lk-d[data-dir="${wrong}"]`);
    t.hit((await p.locator('#lk-slots i.set').count()) === 1, `${o.id}: a press does not fill a slot`);
    await p.click('.lk-clear');
    t.hit((await p.locator('#lk-slots i.set').count()) === 0, `${o.id}: "start again" leaves presses behind`);
    await p.click(`.lk-d[data-dir="${wrong}"]`);
    await reopen(p, o.id);
    t.hit((await p.locator('#lk-slots i.set').count()) === 1, `${o.id}: forgets its presses when you walk away`);
    const before = await penalty(p);
    for (let i = 1; i < o.want.length; i++) await p.click(`.lk-d[data-dir="${wrong}"]`);
    t.hit(!(await isOpen(p, o.id)) && await failed(p), `${o.id}: opened, or said nothing, on a wrong course`);
    t.hit((await penalty(p)) === before + 5, `${o.id}: a wrong run did not cost five seconds`);
    await p.waitForFunction(() => document.querySelectorAll('#lk-slots i.set').length === 0, null, { timeout: 3000 }).catch(() => {});
    t.hit((await p.locator('#lk-slots i.set').count()) === 0, `${o.id}: a wrong run is not cleared for the next one`);
  },
  async clock(p, o, t) {
    const read = () => p.evaluate(() => { const c = document.getElementById('lk-clock'); return c.dataset.h + ':' + String(c.dataset.m).padStart(2, '0'); });
    const t0 = await read();
    for (let i = 0; i < 12; i++) await p.click('.ck-btn[data-k="h+"]');
    for (let i = 0; i < 60 / o.step; i++) await p.click('.ck-btn[data-k="m+"]');
    t.hit((await read()) === t0, `${o.id}: the hands do not come back round`);
    await p.click('.ck-btn[data-k="h-"]'); await p.click('.ck-btn[data-k="m-"]');
    const moved = await read();
    t.hit(moved !== t0, `${o.id}: the hands do not go back`);
    await reopen(p, o.id);
    t.hit((await read()) === moved, `${o.id}: forgets where its hands were when you walk away`);
    const set = async (hm) => {
      const [h, m] = hm.split(':').map(Number);
      await p.waitForSelector('#modal #lk-clock');
      for (let k = 0; k < 13; k++) { if (+(await p.getAttribute('#lk-clock', 'data-h')) === h) break; await p.click('#modal .ck-btn[data-k="h+"]'); }
      for (let k = 0; k < 13; k++) { if (+(await p.getAttribute('#lk-clock', 'data-m')) === m) break; await p.click('#modal .ck-btn[data-k="m+"]'); }
    };
    const before = await penalty(p);
    for (const wrong of o.justOutside) {
      await set(wrong); await p.click('.lk-try');
      t.hit(!(await isOpen(p, o.id)) && await failed(p), `${o.id}: opened at ${wrong}`);
    }
    t.hit((await penalty(p)) === before + 5 * o.justOutside.length, `${o.id}: wrong times did not cost five seconds each`);
    // A lock that takes a span of times: both ends of it by the lock's own
    // rule, and then one end by hand. (Only one: an opened lock stays opened —
    // the session store puts a solve straight back, as it should.)
    for (const right of o.justInside) {
      t.hit(await p.evaluate(({ id, right }) => LOCKS.accepts(currentRoom().objects.find(x => x.id === id).puzzle, right) === true, { id: o.id, right }),
        `${o.id}: would hold at ${right}, which is inside what it accepts`);
    }
    if (o.justInside.length) {
      await set(o.justInside[o.justInside.length - 1]); await p.click('.lk-try');
      t.hit(await isOpen(p, o.id), `${o.id}: held at ${o.justInside[o.justInside.length - 1]}, the last minute of its window`);
    }
  },
  async toggle(p, o, t) {
    const key = `#modal .lock [data-key="${o.keys[0]}"]`;
    const was = await p.evaluate((k) => document.querySelector(k).classList.contains('on'), key);
    await p.click(key, { force: true });
    t.hit((await p.evaluate((k) => document.querySelector(k).classList.contains('on'), key)) !== was, `${o.id}: a switch does not move`);
    await reopen(p, o.id);
    t.hit((await p.evaluate((k) => document.querySelector(k).classList.contains('on'), key)) !== was, `${o.id}: forgets its switches when you walk away`);
    await p.click(key, { force: true });
    const before = await penalty(p);
    await p.click('.lk-try');                                       // as found, which the audit guarantees is not the answer
    t.hit(!(await isOpen(p, o.id)) && await failed(p), `${o.id}: opened, or said nothing, as it was found`);
    t.hit((await penalty(p)) === before + 5, `${o.id}: a wrong try did not cost five seconds`);
  },
  async press(p, o, t) {
    const key = (k) => `#modal .lock [data-key="${k}"]`;
    await p.click(key(o.want[0]), { force: true });
    t.hit((await p.locator('#lk-slots i.set').count()) === 1, `${o.id}: a press does not fill a slot`);
    if (!o.repeat) {
      await p.click(key(o.want[0]), { force: true });
      t.hit((await p.locator('#lk-slots i.set').count()) === 1, `${o.id}: the same thing can be pressed twice`);
    }
    await p.click('#modal .lk-clear', { force: true });
    t.hit((await p.locator('#lk-slots i.set').count()) === 0, `${o.id}: "start again" leaves presses behind`);
    // a full run that is wrong: the right things in the wrong order, or one thing all the way
    const wrong = o.repeat ? o.want.map(() => o.want.find(k => k !== o.want[0]) || o.want[0]) : o.want.slice().reverse();
    if (wrong.join() !== o.want.join()) {
      const before = await penalty(p);
      for (const k of wrong) { await p.click(key(k), { force: true }); await p.waitForTimeout(30); }
      t.hit(!(await isOpen(p, o.id)) && await failed(p), `${o.id}: opened, or said nothing, on a wrong run`);
      t.hit((await penalty(p)) === before + 5, `${o.id}: a wrong run did not cost five seconds`);
      await p.waitForFunction(() => document.querySelectorAll('#lk-slots i.set').length === 0, null, { timeout: 3000 }).catch(() => {});
      t.hit((await p.locator('#lk-slots i.set').count()) === 0, `${o.id}: a wrong run is not cleared for the next one`);
    }
  },
  async tiles(p, o, t) {
    const at = () => p.evaluate(() => [...document.querySelectorAll('.lk-tile')].map(x => x.dataset.piece));
    const a0 = await at();
    // two slots whose swap cannot finish the picture by accident
    let i = 0, j = 1;
    for (let a = 0; a < a0.length && j === 1; a++) for (let b = a + 1; b < a0.length; b++) {
      const s = a0.slice(); [s[a], s[b]] = [s[b], s[a]];
      if (s.join() !== o.want.join()) { i = a; j = b; a = a0.length; break; }
    }
    await p.click(`.lk-tile[data-slot="${i}"]`);
    t.hit((await p.locator('.lk-tile.picked').count()) === 1, `${o.id}: a tapped piece is not shown as picked up`);
    await p.click(`.lk-tile[data-slot="${i}"]`);
    t.hit((await at()).join() === a0.join() && (await p.locator('.lk-tile.picked').count()) === 0, `${o.id}: tapping a piece twice does not put it back`);
    await p.click(`.lk-tile[data-slot="${i}"]`); await p.click(`.lk-tile[data-slot="${j}"]`);
    const a1 = await at();
    t.hit(a1[i] === a0[j] && a1[j] === a0[i], `${o.id}: two tapped pieces do not change places`);
    await reopen(p, o.id);
    t.hit((await at()).join() === a1.join(), `${o.id}: forgets its layout when you walk away`);
    await p.waitForTimeout(700);
    t.hit(!(await isOpen(p, o.id)), `${o.id}: opened with the picture still wrong`);
    const box = await p.evaluate(() => { const g = document.getElementById('lk-tiles').getBoundingClientRect(); return { w: g.width, h: g.height, bottom: g.bottom, vh: innerHeight }; });
    t.hit(box.w >= 300 && box.bottom <= box.vh, `${o.id}: the pieces are ${Math.round(box.w)}px across, bottom at ${Math.round(box.bottom)} of ${box.vh}`);
  },
  async tune(p, o, t) {
    const move = (v) => p.evaluate((v) => { const s = document.getElementById('tune-slider'); s.value = v; s.dispatchEvent(new Event('input', { bubbles: true })); }, v);
    const lit = () => p.evaluate(() => document.querySelectorAll('#tn-meter i.on').length);
    await move(o.far);
    const cold = await lit();
    await move(o.near);
    const warm = await lit();
    await move(o.want);
    const peak = await p.evaluate(() => document.getElementById('tn-meter').classList.contains('peak'));
    t.hit(cold < warm && peak, `${o.id}: the meter does not climb as the dial closes in (${cold}, ${warm}, peak ${peak})`);
    await move(o.far);                                                // swept through, not held
    await p.waitForTimeout(1100);
    t.hit(!(await isOpen(p, o.id)), `${o.id}: opened on a dial that only passed through`);
  },
  async levels(p, o, t) {
    const at = () => p.evaluate(() => [...document.querySelectorAll('.lk-col')].map(c => +c.dataset.v));
    const put = async (c, l) => { if ((await at())[c] !== l) await p.click(l ? `.lk-cell[data-c="${c}"][data-l="${l}"]` : `.lk-cell.base[data-c="${c}"]`); };
    t.hit((await at()).length === o.want.length, `${o.id}: ${(await at()).length} columns for an answer ${o.want.length} long`);
    await put(0, o.max);
    t.hit((await at())[0] === o.max, `${o.id}: a column does not go where it is put`);
    await p.click(`.lk-cell[data-c="0"][data-l="${o.max}"]`);       // the top of what is there: down one
    t.hit((await at())[0] === o.max - 1, `${o.id}: tapping the top of a column does not take it down one`);
    await put(0, 0);
    t.hit((await at())[0] === 0, `${o.id}: a column cannot be emptied`);
    // every column right but the first, which is one out
    const off = +o.want[0] === o.max ? o.max - 1 : +o.want[0] + 1;
    await put(0, off);
    await reopen(p, o.id);
    t.hit((await at())[0] === off, `${o.id}: forgets its levels when you walk away`);
    for (let c = 1; c < o.want.length; c++) await put(c, +o.want[c]);
    const before = await penalty(p);
    await p.click('.lk-try');
    t.hit(!(await isOpen(p, o.id)) && await failed(p), `${o.id}: opened, or said nothing, with one column a step out`);
    t.hit((await penalty(p)) === before + 5, `${o.id}: a wrong try did not cost five seconds`);
  },
  async keypad(p, o, t) {
    const shown = () => p.evaluate(() => [...document.querySelectorAll('#pad-display i')].map(i => i.textContent).join(''));
    const n = o.want.length, d = o.want[0] === '1' ? '2' : '1';
    t.hit((await p.locator('#pad-display i').count()) === n, `${o.id}: the display has not got ${n} places`);
    await p.click(`.pad-key[data-k="${d}"]`);
    t.hit((await shown()) === d, `${o.id}: a key pressed does not show`);
    const before = await penalty(p);
    await p.click('.pad-key.go');                                     // the tick, with places still empty
    t.hit(!(await isOpen(p, o.id)) && (await penalty(p)) === before && (await shown()) === d, `${o.id}: the tick counts as a try before every place is filled`);
    await p.click('.pad-key.del');
    t.hit((await shown()) === '', `${o.id}: the back key does not take a digit off`);
    for (let i = 0; i < n + 2; i++) await p.click(`.pad-key[data-k="${d}"]`);
    t.hit((await shown()).length === n, `${o.id}: takes more digits than it has places`);
    await reopen(p, o.id);
    t.hit((await shown()).length === n, `${o.id}: forgets what was keyed when you walk away`);
    await p.click('.pad-key.go');
    t.hit(!(await isOpen(p, o.id)) && await failed(p), `${o.id}: opened, or said nothing, on a wrong number`);
    t.hit((await penalty(p)) === before + 5, `${o.id}: a wrong number did not cost five seconds`);
    t.hit((await shown()) === '', `${o.id}: a wrong number is not cleared for the next one`);
  },
  async hold(p, o, t) {
    const v = () => p.evaluate(() => +document.getElementById('lk-hold').dataset.v);
    const b = await p.locator('#hold-btn').boundingBox();
    await p.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
    await p.mouse.down();
    await p.waitForFunction(() => +document.getElementById('lk-hold').dataset.v > 0.4, null, { timeout: 4000 }).catch(() => {});
    const short = await v();
    t.hit(short > 0.4, `${o.id}: holding does not bring the gauge up`);
    const before = await penalty(p);
    await p.mouse.up();                                               // let go far too soon
    t.hit(!(await isOpen(p, o.id)) && await failed(p), `${o.id}: opened, or said nothing, let go at ${short.toFixed(1)}`);
    t.hit((await penalty(p)) === before + 5, `${o.id}: a short hold did not cost five seconds`);
    await p.waitForFunction((was) => +document.getElementById('lk-hold').dataset.v < was / 2, short, { timeout: 4000 }).catch(() => {});
    t.hit((await v()) < short / 2, `${o.id}: the gauge does not fall back once you let go`);
    await p.mouse.down();                                             // and now straight through the mark
    await p.waitForFunction((past) => +document.getElementById('lk-hold').dataset.v > past, o.past, { timeout: 12000 }).catch(() => {});
    await p.mouse.up();
    t.hit(!(await isOpen(p, o.id)), `${o.id}: opened when held past ${o.past}`);
    t.hit((await penalty(p)) === before + 10, `${o.id}: a long hold did not cost five seconds`);
  },
  async simul() {},
};

/** Something that turns: it turns, stays turned, comes back round after its own number of steps, and undoes. */
async function turns(p, id, steps, t, back) {
  const at = () => p.evaluate(() => document.getElementById('turn-card').getAttribute('transform'));
  const t0 = await at();
  await p.click('#modal [data-turn="1"]');
  const t1 = await at();
  t.hit(t1 !== t0, `${id}: it does not turn`);
  await back();
  t.hit((await at()) === t1, `${id}: forgets how it was lying when you walk away`);
  for (let i = 1; i < steps; i++) await p.click('#modal [data-turn="1"]');
  t.hit((await at()) === t0, `${id}: ${steps} turns do not bring it back round`);
  await p.click('#modal [data-turn="-1"]'); await p.click('#modal [data-turn="1"]');
  t.hit((await at()) === t0, `${id}: turning back does not undo turning`);
}
/** Something that pulses: watch it for a few seconds and it must be seen both lit and dark, in the colours it claims. */
async function pulses(p, id, tool, t) {
  const seen = await p.evaluate((ms) => new Promise((done) => {
    const lamp = document.querySelector('#modal .pulse-lamp'), out = { lamp: !!lamp, on: 0, off: 0, colours: [] };
    if (!lamp) return done(out);
    const t0 = performance.now();
    const look = () => {
      if (lamp.classList.contains('on')) { out.on++; const c = lamp.style.getPropertyValue('--lamp'); if (c && !out.colours.includes(c)) out.colours.push(c); }
      else out.off++;
      if (performance.now() - t0 < ms) setTimeout(look, 40); else done(out);
    };
    look();
  }), tool.watch);
  t.hit(seen.lamp, `${id}: nothing in the drawing to pulse`);
  t.hit(seen.on > 0 && seen.off > 0, `${id}: watched for ${tool.watch}ms and saw it ${seen.on ? 'never go dark' : 'never light'}`);
  if (tool.colours > 1) t.hit(seen.colours.length === tool.colours, `${id}: showed ${seen.colours.length} colours of its ${tool.colours}`);
}

(async () => {
  const browser = await launch();
  const errs = [];

  // which scenarios are on the reset grammar is the game's own business
  const probe = await browser.newPage();
  await probe.goto(BASE + '/');
  const classic = await probe.evaluate(() => SCENARIOS.filter(s => s.classic).map(s => s.id));
  await probe.close();
  const RUN = ASKED.length ? ASKED.filter(a => classic.includes(a)) : classic;
  if (!RUN.length) { console.log('nothing on the reset grammar to test'); process.exit(ASKED.length ? 1 : 0); }

  for (const scenario of RUN) {
    console.log(`--- ${scenario} ---`);
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    p.on('pageerror', e => errs.push(`${scenario}: ${e.message}`));
    await start(p, scenario);

    const all = await p.evaluate(() => ACTIVE.rooms.flatMap((r, room) => r.objects.map(o => {
      const pz = o.puzzle || null, base = { room, id: o.id, pos: o.pos, lock: !!pz, type: pz && pz.type, needs: o.needs ? [].concat(o.needs).join(' and ') : null, hiddenUntil: o.hiddenUntil || null };
      base.fnSprite = typeof o.sprite === 'function';
      base.lens = (o.lens || (pz && pz.lens)) ? { needs: (o.lens || pz.lens).needs || null } : null;
      // long enough to see a sequence through once, whatever its pace
      const tool = (t) => !t ? null : { type: t.type, needs: t.needs || null, steps: t.steps || 4, colours: t.seq ? new Set(t.seq).size : 0,
        watch: 900 + (t.seq ? t.seq.length * ((t.on || 430) + (t.gap || 250)) : (t.groups || []).reduce((a, n) => a + n * ((t.on || 150) + (t.gap || 240)) + (t.pause || 950), 0)) };
      base.tool = tool(o.tool);
      base.inside = !!(pz && pz.inside);
      base.insideTool = pz && pz.inside && pz.inside.tool ? pz.inside.tool.type : null;
      base.insideGear = tool(pz && pz.inside && pz.inside.tool);
      if (!pz) return base;
      const faces = LOCKS.normFaces((pz.wheels && pz.wheels[0] && pz.wheels[0].faces) || pz.faces);
      const mins = (t) => { const [h, m] = String(t).split(':').map(Number); return (h % 12) * 60 + m; };
      const hm = (n) => { n = (n + 720) % 720; const h = Math.floor(n / 60) || 12; return h + ':' + String(n % 60).padStart(2, '0'); };
      if (pz.type === 'combo') Object.assign(base, { want: LOCKS.asList(pz.answer, faces), faces: faces.length, rings: Array.isArray(pz.wheels) ? pz.wheels.filter(w => w.mark && w.mark.color).length : 0 });
      else if (pz.type === 'clock') {
        const step = pz.step || 5, [a, b] = (pz.window || [pz.answer, pz.answer]).map(mins);
        Object.assign(base, { want: String(pz.answer), step, justOutside: [hm(a - step), hm(b + step)], justInside: a === b ? [] : [hm(a), hm(b)] });
      } else if (pz.type === 'toggle') Object.assign(base, { want: LOCKS.asList(pz.answer), keys: pz.keys ? LOCKS.normFaces(pz.keys).map(k => String(k.id)) : LOCKS.asList(pz.answer) });
      else if (pz.type === 'press') Object.assign(base, { want: LOCKS.asList(pz.answer), repeat: !!pz.repeat });
      else if (pz.type === 'tiles') Object.assign(base, { want: pz.answer ? LOCKS.asList(pz.answer) : Array.from({ length: pz.cols * pz.rows }, (_, i) => String(i)) });
      else if (pz.type === 'tune') Object.assign(base, { want: pz.at, far: pz.at - (pz.max - pz.min) * 0.45 < pz.min ? pz.max : pz.min, near: pz.at + (pz.max - pz.min) * 0.05 });
      else if (pz.type === 'levels') Object.assign(base, { want: LOCKS.asList(pz.answer).map(String), max: pz.max || 5 });
      else if (pz.type === 'hold') Object.assign(base, { want: String(pz.target), past: Math.min((pz.max || 10) - 0.2, pz.target + (pz.tol || 0.3) + 0.6) });
      else base.want = String(pz.answer || '');
      return base;
    })));

    /* ---- every object stands in the room, where its ring is ---- */
    const standing = tally(), changes = tally();
    for (let room = 0; room < 4; room++) {
      const here = all.filter(o => o.room === room);
      if (!here.length) continue;
      await goRoom(p, room);
      await p.evaluate((room) => { ACTIVE.rooms[room].objects.forEach(o => { S.solved.delete(o.id); }); ACTIVE.rooms[room].objects.forEach(o => { if (o.hiddenUntil) S.solved.add(o.hiddenUntil); }); renderScene(); renderHotspots(); }, room);
      const boxes = await p.evaluate((ids) => ids.map(id => {
        const el = document.getElementById('el-' + id);
        if (!el) return null;
        const b = el.getBBox();
        return { x: b.x, y: b.y, w: b.width, h: b.height, html: el.innerHTML.length };
      }), here.map(o => o.id));
      here.forEach((o, i) => {
        const b = boxes[i], px = o.pos.x * 16, py = o.pos.y * 9, pw = o.pos.w * 16, ph = o.pos.h * 9;
        if (!b) return standing.hit(false, `${o.id} is not drawn in the room`);
        const cx = b.x + b.w / 2, cy = b.y + b.h / 2;
        standing.hit(b.w > 8 && b.h > 8, `${o.id} is drawn ${Math.round(b.w)}x${Math.round(b.h)}`);
        standing.hit(cx > px - pw * 0.3 && cx < px + pw * 1.3 && cy > py - ph * 0.3 && cy < py + ph * 1.3,
          `${o.id} is drawn around (${Math.round(cx)},${Math.round(cy)}) but its ring is at (${Math.round(px + pw / 2)},${Math.round(py + ph / 2)})`);
      });
      // a thing that is drawn differently once open has to actually change in the room
      for (const o of here.filter(o => o.lock && o.fnSprite)) {
        const [a, b] = await p.evaluate((id) => {
          const el = document.getElementById('el-' + id), was = S.solved.has(id);
          S.solved.delete(id); renderHotspots();
          const shut = el.innerHTML;
          S.solved.add(id); renderHotspots();
          const open = el.innerHTML;
          if (!was) { S.solved.delete(id); renderHotspots(); }
          return [shut, open];
        }, o.id);
        changes.hit(a !== b, `${o.id} looks the same in the room open as shut`);
      }
    }
    standing.report('every object is drawn in the room, under its own ring');
    changes.report('a lock that is drawn open looks different once it is');

    /* ---- every close-up arrives at a size you can read ---- */
    const readable = tally(), dead = tally(), inside = tally();
    for (const o of all) {
      if (!o.lock) {
        await face(p, o.room, o.id);
        const f = await p.evaluate(() => { const s = document.querySelector('#modal .obj-fig svg'); if (!s) return null; const r = s.getBoundingClientRect(); return { w: r.width, h: r.height, right: r.right, bottom: r.bottom, vw: innerWidth, vh: innerHeight }; });
        readable.hit(!!f && f.w >= 280 && f.h >= 150 && f.right <= f.vw && f.bottom <= f.vh, `${o.id} draws at ${f ? Math.round(f.w) + 'x' + Math.round(f.h) : 'nothing'}`);
      }
      if (o.needs) {
        await face(p, o.room, o.id, 'dead');
        dead.hit((await p.locator('#modal .lock, #modal .puzzle-box, #modal .hint-btn').count()) === 0, `${o.id} can be worked while ${o.needs} is still shut`);
        dead.hit((await p.textContent('#modal .obj-desc')).trim().length > 20, `${o.id} has nothing to say while it is dead`);
      }
      if (o.inside) {
        await face(p, o.room, o.id, 'open');
        const f = await p.evaluate(() => { const s = document.querySelector('#modal .inside svg'); if (!s) return null; const r = s.getBoundingClientRect(); return { w: r.width, h: r.height, bottom: r.bottom, vh: innerHeight }; });
        inside.hit(!!f && f.w >= 280 && f.h >= 100 && f.bottom <= f.vh, `${o.id} opens on ${f ? Math.round(f.w) + 'x' + Math.round(f.h) : 'nothing'}`);
        if (o.insideTool === 'listen') inside.hit((await p.locator('#modal [data-listen], #modal [data-notes]').count()) === 1, `${o.id}: nothing to play what came out of it`);
      }
    }
    readable.report('every clue draws big enough to read, inside the screen');
    if (dead.n()) dead.report('a thing waiting on something else cannot be worked, and says so');
    inside.report('every lock with something in it shows it once open');

    /* ---- each kind of lock, worked wrong ---- */
    const byKind = {};
    all.filter(o => o.lock).forEach(o => (byKind[o.type] = byKind[o.type] || []).push(o));
    for (const [kind, locks] of Object.entries(byKind)) {
      if (!KINDS[kind]) { ok(`${kind}: has a test`, false, 'no checks written for this kind of lock'); continue; }
      const t = tally();
      for (const o of locks) {
        await face(p, o.room, o.id);
        // a lock that will not even be worked is a finding about that lock, not a crash
        try { await KINDS[kind](p, o, t); }
        catch (e) { t.hit(false, `${o.id}: could not be worked at all — ${e.message.split('\n')[0]}`); }
      }
      if (t.n()) t.report(`${kind}: ${locks.map(o => o.id).join(', ')} behave like things in your hands`);
    }

    /* ---- the lantern ---- */
    const lit = tally();
    for (const o of all.filter(o => o.lens)) {
      if (o.lens.needs) {
        await face(p, o.room, o.id, 'bare');
        lit.hit((await p.locator('#modal svg[data-lens="0"]').count()) === 1 && (await p.locator('#modal .lens-hid').count()) === 0,
          `${o.id} gives up what is hidden before you have the light`);
      }
      await face(p, o.room, o.id);
      lit.hit((await p.locator('#modal svg[data-lens="1"] .lens-hid').count()) === 1, `${o.id} has nothing under the light`);
      const box = await p.locator('#modal svg[data-lens="1"]').boundingBox();
      await p.mouse.move(box.x + box.width * 0.3, box.y + box.height * 0.5);
      const a = await p.evaluate(() => document.querySelector('#modal .lens-c').getAttribute('cx'));
      await p.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.5);
      const b = await p.evaluate(() => document.querySelector('#modal .lens-c').getAttribute('cx'));
      lit.hit(+b > +a + 20, `${o.id}: the light does not follow the hand (${a} → ${b})`);
    }
    if (lit.n()) lit.report('the lantern shows nothing until you have it, and goes where you point it');

    /* ---- things you can turn, flip, play, or watch ---- */
    const tools = tally();
    for (const o of all.filter(o => o.tool)) {
      if (o.tool.needs) {
        await face(p, o.room, o.id, 'bare');
        tools.hit((await p.locator('#modal .tool-btn').count()) === 0, `${o.id} can be worked before you have what it takes`);
      }
      await face(p, o.room, o.id);
      if (o.tool.type === 'turn') await turns(p, o.id, o.tool.steps, tools, () => reopen(p, o.id));
      else if (o.tool.type === 'pulse') await pulses(p, o.id, o.tool, tools);
      else if (o.tool.type === 'flip') {
        const fig = () => p.evaluate(() => document.querySelector('#modal .obj-fig').innerHTML.length);
        const a = await fig();
        await p.click('#modal [data-flip]'); await p.waitForTimeout(80);
        tools.hit((await fig()) !== a, `${o.id}: turning it over shows the same side`);
      } else if (o.tool.type === 'listen') {
        tools.hit((await p.locator('#modal [data-listen], #modal [data-notes]').count()) === 1, `${o.id}: nothing to press to hear it`);
        await p.click('#modal [data-listen], #modal [data-notes]');
      }
    }
    // and whatever came out of a lock: the same thing in your hands
    for (const o of all.filter(o => o.insideGear)) {
      await face(p, o.room, o.id, 'open');
      if (o.insideGear.type === 'turn') await turns(p, `${o.id} (what was inside)`, o.insideGear.steps, tools, () => reopen(p, o.id));
      else if (o.insideGear.type === 'pulse') await pulses(p, `${o.id} (what was inside)`, o.insideGear, tools);
    }
    if (tools.n()) tools.report('what can be turned turns and stays turned; what pulses, pulses');
    await p.close();

    /* ---- and in the hand ---- */
    const ctx = await browser.newContext({ ...devices['iPhone 12'], hasTouch: true });
    const ph = await ctx.newPage();
    ph.on('pageerror', e => errs.push(`${scenario} phone: ${e.message}`));
    await start(ph, scenario);
    await ph.evaluate(() => { S.isPhone = true; document.body.classList.add('phone'); });
    const hand = tally();
    for (const o of all) {
      for (const state of o.lock ? (o.inside ? ['live', 'open'] : ['live']) : ['live']) {
        await ph.evaluate(({ o, state }) => {
          S.roomIndex = o.room;
          const objs = ACTIVE.rooms[o.room].objects, ob = objs.find(x => x.id === o.id);
          objs.forEach(x => S.solved.delete(x.id));
          [].concat(ob.needs || []).forEach(d => S.solved.add(d));
          if (state === 'open') S.solved.add(o.id);
          openModal(o.id);
        }, { o, state });
        await ph.waitForSelector('#modal h3');
        const m = await ph.evaluate(() => {
          const vw = innerWidth;
          const wide = [...document.querySelectorAll('#modal .lock > *, #modal .obj-fig, #modal .obj-fig svg, #modal .lk-try')]
            .map(e => e.getBoundingClientRect()).filter(r => r.width > 0);
          const fig = document.querySelector('#modal .obj-fig svg, #modal .lock-fig svg, #modal .lk-combo, #modal .lk-dir, #modal .lk-clock, #modal .lk-levers, #modal .lk-keys, #modal .lk-tiles, #modal .lk-tune, #modal .lk-levels, #modal .lk-pad, #modal .lk-hold');
          const fr = fig ? fig.getBoundingClientRect() : null;
          return { spill: wide.some(r => r.left < -1 || r.right > vw + 1), side: document.documentElement.scrollWidth > vw + 1, w: fr ? fr.width : 0, vw };
        });
        const tag = state === 'live' ? o.id : `${o.id} (${state})`;
        hand.hit(!m.spill && !m.side, `${tag} runs off the side of a phone`);
        if (!o.needs || state !== 'live' || true) hand.hit(m.w >= Math.min(220, m.vw * 0.55) || o.type === 'simul', `${tag} is only ${Math.round(m.w)}px across on a phone`);
      }
    }
    hand.report('on a phone, every lock and drawing fits the width and is big enough to work');
    await ctx.close();
  }

  console.log('\nJS errors:', errs.length ? errs.slice(0, 5) : 'none');
  await browser.close();
  if (fails || errs.length) { console.log(`\n${fails} FAILURES`); process.exit(1); }
  console.log('\nevery lock behaves like a thing in your hands');
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
