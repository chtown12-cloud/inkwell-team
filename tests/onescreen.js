/* One screen. No scroll.

   The examine view is the whole game on a shared screen: a title, a drawing,
   and the thing you type into. If any of it runs past the bottom of the
   window, a room full of people reads half a clue and starts guessing — and
   nobody scrolls a screen they are not holding. So this opens every object in
   every scenario at several window shapes and checks three things that are
   each a real bug we have shipped:

     - the card fits inside the window and nothing scrolls;
     - three revealed hints do not push it out of the window;
     - a story beat raised mid-puzzle is held rather than dropped on top of
       the clue, and lands the moment the puzzle is closed.

   And one more, which is not about scrolling but about the same layer: the
   gate card between rooms is never allowed to stack, because a card nobody
   dismissed used to reappear under the next one.

   Needs the dev server:  node dev-server.js &  then  node tests/onescreen.js
*/
const { chromium, devices } = require('playwright');

const BASE = 'http://localhost:8787';
const SCENARIOS = process.argv.slice(2).length ? process.argv.slice(2)
  : ['eldermoor', 'prospero', 'vorstag', 'erebus', 'midnight'];
const SHAPES = [
  { width: 1440, height: 900, name: 'laptop' },
  { width: 1920, height: 1080, name: 'projector' },
  { width: 1280, height: 720, name: 'small screen' },
];

let fails = 0;
const ok = (l, c, x) => { console.log((c ? '  ok   ' : '  FAIL ') + l + (x && !c ? '\n         ' + x : '')); if (!c) fails++; };

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
  await p.evaluate(() => { S.staged = { arrival: 1, squeeze: 1, midroom: 1 }; });
}

/**
 * Open an object with whatever gate it sits behind already lifted.
 * `state` picks which face of it: 'live' as a player first works it, 'dead'
 * while the thing it needs is still shut, 'open' once it has been solved and
 * is showing what was inside.
 */
async function show(p, room, id, state = 'live') {
  await p.evaluate(({ room, id, state }) => {
    if (S.roomIndex !== room) enterRoom(room);
    const o = ACTIVE.rooms[room].objects.find(x => x.id === id);
    if (o.revealedBy) S.solved.add(o.revealedBy);
    if (o.needs) { if (state === 'dead') S.solved.delete(o.needs); else S.solved.add(o.needs); }
    if (state === 'open') S.solved.add(id); else S.solved.delete(id);
    closeModal();
  }, { room, id, state });
  if (await p.locator('#enter-room-btn').count()) {
    await p.click('#enter-room-btn', { force: true });
    await clearBeat(p);
  }
  await p.evaluate((id) => openModal(id), id);
  await p.waitForSelector('#modal h3', { timeout: 6000 });
}

/** Does anything run off the screen, or scroll? */
const fit = (p) => p.evaluate(() => {
  const m = document.getElementById('modal'), ov = document.getElementById('overlay');
  const r = m.getBoundingClientRect();
  return {
    over: Math.round(Math.max(0, -r.top, r.bottom - innerHeight, -r.left, r.right - innerWidth)),
    ovScroll: ov.scrollHeight - ov.clientHeight,
    docScroll: document.documentElement.scrollHeight - innerHeight,
    zoom: parseFloat(m.style.zoom || '1'),
    h: Math.round(r.height), vh: innerHeight,
  };
});

(async () => {
  const browser = await chromium.launch();
  const errs = [];

  for (const scenario of SCENARIOS) {
    console.log(`--- ${scenario} ---`);
    for (const shape of SHAPES) {
      const p = await browser.newPage({ viewport: { width: shape.width, height: shape.height } });
      p.on('pageerror', e => errs.push(`${scenario} ${shape.name}: ${e.message}`));
      await start(p, scenario);

      /* On the reset grammar an object has up to three faces: the lock as it
         is worked, the same thing standing dead, and the lock open with what
         was inside it — which is usually the biggest drawing in the room. */
      const all = await p.evaluate(() => ACTIVE.rooms.flatMap((r, ri) => r.objects.flatMap(o => {
        const faces = [{ room: ri, id: o.id, state: 'live' }];
        if (ACTIVE.classic && o.needs) faces.push({ room: ri, id: o.id, state: 'dead' });
        if (ACTIVE.classic && o.puzzle) faces.push({ room: ri, id: o.id, state: 'open' });
        return faces;
      })));

      const spill = [], scrolled = [], squashed = [];
      for (const { room, id, state } of all) {
        await show(p, room, id, state);
        const f = await fit(p);
        const tag = state === 'live' ? id : `${id} (${state})`;
        if (f.over > 1) spill.push(`${tag} by ${f.over}px`);
        if (f.ovScroll > 1 || f.docScroll > 1) scrolled.push(`${tag} (${f.ovScroll}/${f.docScroll})`);
        // the shrink is the safety net; needing it hard means the layout lost
        if (f.zoom < 0.82) squashed.push(`${tag} at ${f.zoom}`);
      }
      ok(`${shape.name}: ${all.length} views all fit the window`, !spill.length, spill.slice(0, 5).join(', '));
      ok(`${shape.name}: nothing scrolls`, !scrolled.length, scrolled.slice(0, 5).join(', '));
      ok(`${shape.name}: nothing has to be shrunk to make it`, !squashed.length, squashed.slice(0, 5).join(', '));

      /* three hints is the tallest a puzzle ever gets. Forget the solves the
         sweep above handed out, or the first puzzle comes up already answered
         and there is nothing to ask for a hint on. */
      const first = await p.evaluate(() => {
        S.solved.clear(); S.hintsShown = {};
        const o = ACTIVE.rooms[0].objects.find(x => x.puzzle && !x.hiddenUntil && !x.needs);
        return o && o.id;
      });
      if (first) {
        await show(p, 0, first);
        for (let i = 0; i < 3; i++) { await p.click('.hint-btn', { force: true }); await p.waitForTimeout(160); }
        const f = await fit(p);
        ok(`${shape.name}: ${first} with all three hints still fits`,
          f.over <= 1 && f.ovScroll <= 1, `over ${f.over}px, scroll ${f.ovScroll}`);
      }
      await p.close();
    }
  }

  /* ------------------------------------- a beat never lands on top of a clue */
  console.log('\n--- a story beat waits its turn ---');
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('pageerror', e => errs.push('beat: ' + e.message));
  await start(p, 'eldermoor');
  const anyLock = await p.evaluate(() => ACTIVE.rooms[0].objects.find(o => o.puzzle && !o.hiddenUntil && !o.needs).id);
  await show(p, 0, anyLock);
  await p.evaluate(() => showBeat('Something moves in the treeline.', null));
  await p.waitForTimeout(250);
  ok('raised mid-puzzle, it is held rather than shown',
    await p.evaluate(() => !beatShowing && !document.getElementById('beat').classList.contains('show')));
  ok('and the clue is still readable', await p.evaluate(() => {
    const h = document.querySelector('#modal h3').getBoundingClientRect();
    const b = document.getElementById('beat').getBoundingClientRect();
    const hidden = getComputedStyle(document.getElementById('beat')).opacity === '0';
    return hidden || b.bottom < h.top || b.top > h.bottom;
  }));
  await p.evaluate(() => closeModal());
  await p.waitForTimeout(300);
  ok('and it lands the moment they look up', await p.evaluate(() =>
    beatShowing && document.querySelector('#beat .beat-line').textContent.startsWith('Something moves')));
  await clearBeat(p);

  /* ------------------------------------------- the gate card never stacks */
  console.log('\n--- one gate card, always ---');
  await p.evaluate(() => { enterRoom(1); enterRoom(2); });
  await p.waitForTimeout(120);
  const cards = await p.evaluate(() => [...document.querySelectorAll('#card-root > *')]
    .map(c => (c.querySelector('h2') || {}).textContent));
  ok(`two rooms landing together leave one card (${JSON.stringify(cards)})`, cards.length === 1,
    `${cards.length} cards: ${JSON.stringify(cards)}`);
  await p.click('#enter-room-btn', { force: true });
  await p.waitForTimeout(200);
  ok('and pressing ENTER leaves none behind',
    await p.evaluate(() => document.querySelectorAll('#card-root > *').length === 0));
  await p.close();

  /* --------------------------------------------- the phone keeps its card */
  const ctx = await browser.newContext({ ...devices['iPhone 12'], hasTouch: true });
  const ph = await ctx.newPage();
  ph.on('pageerror', e => errs.push('phone: ' + e.message));
  await start(ph, 'eldermoor');
  await ph.evaluate(() => { S.isPhone = true; document.body.classList.add('phone'); });
  await show(ph, 0, await ph.evaluate(() => ACTIVE.rooms[0].objects.find(o => o.puzzle && !o.hiddenUntil && !o.needs).id));
  ok('a phone still scrolls its card, as it should', await ph.evaluate(() => {
    const ov = getComputedStyle(document.getElementById('overlay'));
    return ov.overflowY === 'auto' || ov.overflowY === 'scroll';
  }));
  ok('and is never shrunk to fit: a card in the hand is read at full size', await ph.evaluate(() =>
    parseFloat(document.getElementById('modal').style.zoom || '1') === 1));
  ok('and nothing on it runs off the side', await ph.evaluate(() =>
    document.documentElement.scrollWidth <= innerWidth + 1 &&
    [...document.querySelectorAll('#modal .lock, #modal .obj-fig, #modal .lk-try')].every(e => {
      const r = e.getBoundingClientRect(); return r.left >= -1 && r.right <= innerWidth + 1;
    })));
  await ctx.close();

  console.log('\nJS errors:', errs.length ? errs.slice(0, 5) : 'none');
  await browser.close();
  if (fails || errs.length) { console.log(`\n${fails} FAILURES`); process.exit(1); }
  console.log('\nit all fits on one screen');
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
