/* The drawings, and the one mechanic you work by hand.

   A figure is the clue now, so a figure that renders at zero height, runs off
   the side of a phone, or pushes the answer box past the fold is not a style
   problem — it is an unsolvable puzzle. And the cipher disc has to be checked
   by turning it: this project has been bitten before by a test that drove a
   mechanic through its answer box and passed while the mechanic was broken.

   Needs the dev server:  node dev-server.js &  then  node tests/figures.js
*/
const { chromium, devices } = require('playwright');

const BASE = 'http://localhost:8787';
const SCENARIOS = process.argv.slice(2).length ? process.argv.slice(2)
  : ['eldermoor', 'prospero', 'vorstag', 'erebus', 'midnight'];

let fails = 0;
const ok = (l, c, x) => { console.log((c ? '  ok   ' : '  FAIL ') + l + (x && !c ? '\n         ' + x : '')); if (!c) fails++; };

const clearBeat = async (p) => {
  for (let i = 0; i < 10; i++) {
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
  // the director's intrusions raise a veil over the board; not this test's job
  await p.evaluate(() => { S.staged = { arrival: 1, squeeze: 1, midroom: 1 }; });
}

/** Open an object with its drawing showing, whatever gate it sits behind. */
async function show(p, room, id) {
  await p.evaluate(({ room, id }) => {
    if (S.roomIndex !== room) enterRoom(room);
    const o = ACTIVE.rooms[room].objects.find(x => x.id === id);
    if (o.revealedBy) S.solved.add(o.revealedBy);     // reveal art needs its trigger
    closeModal();
  }, { room, id });
  if (await p.locator('#enter-room-btn').count()) {
    await p.click('#enter-room-btn', { force: true });
    await clearBeat(p);
  }
  await p.evaluate((id) => openModal(id), id);
  await p.waitForSelector('#modal h3', { timeout: 6000 });
}

/** Measure the drawing against the modal it has to live inside. */
const measure = (p) => p.evaluate(() => {
  const svg = document.querySelector('#modal .obj-fig svg');
  if (!svg) return null;
  const f = svg.getBoundingClientRect();
  const m = document.getElementById('modal').getBoundingClientRect();
  const ctrl = document.querySelector('#answer-input, .pad-key.go, #sel-grid, #dial-lock, #ord-list, .big-btn');
  return {
    w: Math.round(f.width), h: Math.round(f.height),
    // the drawing must sit within the card on both sides
    inside: f.left >= m.left - 1 && f.right <= m.right + 1,
    spill: Math.round(Math.max(m.left - f.left, f.right - m.right)),
    hasControl: !!ctrl,
    modalH: Math.round(m.height), viewH: window.innerHeight,
  };
});

(async () => {
  const browser = await chromium.launch();
  const errs = [];

  for (const scenario of SCENARIOS) {
    const desk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    desk.on('pageerror', e => errs.push(`${scenario} desktop: ${e.message}`));
    await start(desk, scenario);

    const drawn = await desk.evaluate(() => ACTIVE.rooms.flatMap((r, ri) =>
      r.objects.filter(o => o.figure || o.revealFigure).map(o => ({ room: ri, id: o.id }))));

    if (!drawn.length) { await desk.close(); continue; }
    console.log(`--- ${scenario}: ${drawn.length} drawings ---`);

    for (const { room, id } of drawn) {
      await show(desk, room, id);
      const m = await measure(desk);
      ok(`${id} draws`, m && m.w > 60 && m.h > 40, m ? `${m.w}x${m.h}` : 'no svg in the modal');
      ok(`${id} stays inside the card`, m && m.inside, m ? `spills ${m.spill}px` : '');
    }
    await desk.close();

    /* the same drawings on a phone, where the answer box has to survive */
    const ctx = await browser.newContext({ ...devices['iPhone 12'], hasTouch: true });
    const ph = await ctx.newPage();
    ph.on('pageerror', e => errs.push(`${scenario} phone: ${e.message}`));
    await start(ph, scenario);
    let worst = null, spilled = [];
    for (const { room, id } of drawn) {
      await show(ph, room, id);
      const m = await measure(ph);
      if (!m) { ok(`${id} draws on a phone`, false, 'no svg'); continue; }
      if (!m.inside) spilled.push(`${id} by ${m.spill}px`);
      if (!worst || m.h > worst.h) worst = { id, ...m };
    }
    ok(`all ${drawn.length} drawings fit the width of a phone`, !spilled.length, spilled.join(', '));
    ok(`the tallest drawing leaves room to answer (${worst.id}, ${worst.h}px of ${worst.viewH})`,
      worst.h < worst.viewH * 0.55 && worst.hasControl,
      `${worst.h}px tall in a ${worst.viewH}px window, control present: ${worst.hasControl}`);
    await ctx.close();
  }

  /* ---------------------------------------------- the disc, turned by hand */
  const d = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  d.on('pageerror', e => errs.push('disc: ' + e.message));
  await start(d, 'eldermoor');
  await show(d, 1, 'hatch');
  console.log('\n--- the cipher disc is worked, not typed ---');

  ok('it starts somewhere wrong', await d.evaluate(() =>
    document.getElementById('disc-read').textContent.trim() !== 'WHAT KEEPS IT OUT IS THE STORM'));

  const readAt = async (n) => d.evaluate((n) => {
    const s = document.getElementById('disc-slider');
    s.value = n; s.dispatchEvent(new Event('input', { bubbles: true }));
    return document.getElementById('disc-read').textContent.trim();
  }, n);

  ok('turning the ring changes what it says', (await readAt(1)) !== (await readAt(2)));
  const plain = await readAt(3);
  ok('and at the right setting it says something', plain === 'WHAT KEEPS IT OUT IS THE STORM', plain);
  ok('the ring really moves with it', await d.evaluate(() =>
    /rotate\(/.test(getComputedStyle(document.getElementById('disc-inner')).transform)
    || document.getElementById('disc-inner').style.transform.includes('rotate')));
  ok('and it goes wrong again if you keep turning', (await readAt(4)) !== plain);

  // the nudge buttons are what a finger uses
  const before = await d.evaluate(() => +document.getElementById('disc-slider').value);
  await d.click('.dial-fine:has-text("↻")');
  const after = await d.evaluate(() => +document.getElementById('disc-slider').value);
  ok('the nudge button steps the ring', after === (before + 1) % 26, `${before} -> ${after}`);
  await d.close();

  /* a finger on the disc, on a phone */
  const pctx = await browser.newContext({ ...devices['iPhone 12'], hasTouch: true });
  const pp = await pctx.newPage();
  pp.on('pageerror', e => errs.push('disc phone: ' + e.message));
  await start(pp, 'eldermoor');
  await show(pp, 1, 'hatch');
  const t0 = await pp.evaluate(() => +document.getElementById('disc-slider').value);
  await pp.locator('.dial-fine:has-text("↻")').tap();
  await pp.locator('.dial-fine:has-text("↻")').tap();
  const t1 = await pp.evaluate(() => +document.getElementById('disc-slider').value);
  ok('a finger can turn it', t1 === (t0 + 2) % 26, `${t0} -> ${t1}`);
  ok('and the ring is a comfortable size on a phone', await pp.evaluate(() => {
    const r = document.querySelector('.disc-wrap svg').getBoundingClientRect();
    return r.width > 180 && r.width <= window.innerWidth;
  }));
  await pctx.close();

  console.log('\nJS errors:', errs.length ? errs.slice(0, 5) : 'none');
  await browser.close();
  if (fails || errs.length) { console.log(`\n${fails} FAILURES`); process.exit(1); }
  console.log('\nthe drawings carry, and the disc turns');
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
