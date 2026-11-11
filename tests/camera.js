/* The examine camera.

   Examining something pushes the stage in on it instead of opening a window
   over it. Three things can go wrong and all three are invisible until a team
   hits them mid-game:

     - the stage pulls away from an edge and shows the black behind it, which
       happens to objects near the corners of the 1600x900 board;
     - the spotlight ends up somewhere the object isn't, because the focus was
       clamped after the light was aimed;
     - the camera runs on a phone, which has no stage at all.

   So this drives every object in a scenario, at several window shapes, and
   checks the geometry rather than the look.

   Needs the dev server:  node dev-server.js &  then  node tests/camera.js
*/
const { chromium, devices } = require('playwright');

const BASE = 'http://localhost:8787';
const SCENARIOS = process.argv.slice(2).length ? process.argv.slice(2) : ['eldermoor'];
const SHAPES = [
  { width: 1440, height: 900, name: 'laptop' },
  { width: 1920, height: 1080, name: 'projector' },
  { width: 1100, height: 1000, name: 'tall window' },
];

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
  await p.evaluate(() => { S.staged = { arrival: 1, squeeze: 1, midroom: 1 }; });
}

/** The stage's box, the spotlight, and where the focused object actually is. */
const look = (p) => p.evaluate(() => {
  const st = document.getElementById('stage').getBoundingClientRect();
  const cs = getComputedStyle(document.documentElement);
  const pct = (v, of) => v.endsWith('%') ? parseFloat(v) / 100 * of : NaN;
  return {
    stage: { l: st.left, t: st.top, r: st.right, b: st.bottom },
    /* The board is a contain-fit, so a 16:9 stage in a 11:10 window letterboxes
       by design — `covers` is not the bar. What matters is that leaning in
       never shows MORE of the black than standing back did. */
    worstEdge: Math.round(Math.max(0, st.left, st.top, innerWidth - st.right, innerHeight - st.bottom)),
    centred: Math.abs((st.left + st.right) / 2 - innerWidth / 2) < 1.5
      && Math.abs((st.top + st.bottom) / 2 - innerHeight / 2) < 1.5,
    zoomed: !!camFocus,
    k: camFocus ? +camFocus.k.toFixed(2) : null,
    light: camFocus ? {
      x: pct(cs.getPropertyValue('--fx').trim(), innerWidth),
      y: pct(cs.getPropertyValue('--fy').trim(), innerHeight),
    } : null,
    focusOnScreen: camFocus ? stageToScreen(camFocus.x, camFocus.y) : null,
    transform: document.getElementById('stage').style.transform,
    vw: innerWidth, vh: innerHeight,
  };
});

(async () => {
  const browser = await chromium.launch();
  const errs = [];

  for (const scenario of SCENARIOS) {
    for (const shape of SHAPES) {
      const p = await browser.newPage({ viewport: { width: shape.width, height: shape.height } });
      p.on('pageerror', e => errs.push(`${scenario} ${shape.name}: ${e.message}`));
      await start(p, scenario);

      const wide = await look(p);
      ok(`${shape.name}: the wide shot is the board, centred`, wide.centred && !wide.zoomed,
        `letterbox ${wide.worstEdge}px, centred ${wide.centred}`);

      const all = await p.evaluate(() => ACTIVE.rooms.flatMap((r, ri) =>
        r.objects.map(o => ({ room: ri, id: o.id, w: o.pos.w, x: o.pos.x, y: o.pos.y }))));

      let blackEdge = [], lightOff = [], noZoom = [];
      for (const o of all) {
        await p.evaluate(({ room, id }) => {
          if (S.roomIndex !== room) enterRoom(room);
          const ob = ACTIVE.rooms[room].objects.find(x => x.id === id);
          if (ob.revealedBy) S.solved.add(ob.revealedBy);
          closeModal();
        }, o);
        if (await p.locator('#enter-room-btn').count()) {
          await p.click('#enter-room-btn', { force: true });
          await clearBeat(p);
        }
        await p.evaluate((id) => openModal(id), o.id);
        await p.waitForTimeout(700);          // let the push-in finish
        const m = await look(p);
        if (!m.zoomed) { noZoom.push(o.id); continue; }
        if (m.worstEdge > wide.worstEdge + 0.6) {
          blackEdge.push(`${o.id} shows ${m.worstEdge}px vs ${wide.worstEdge}px standing back (at ${o.x},${o.y})`);
        }
        // the light must be on the thing, wherever clamping actually put it
        const dx = Math.abs(m.light.x - m.focusOnScreen.x), dy = Math.abs(m.light.y - m.focusOnScreen.y);
        if (dx > 2 || dy > 2) lightOff.push(`${o.id} off by ${Math.round(Math.max(dx, dy))}px`);
        await p.evaluate(() => closeModal());
        await p.waitForTimeout(650);
      }
      ok(`${shape.name}: ${all.length} objects, none show more black than the wide shot`,
        !blackEdge.length, blackEdge.slice(0, 4).join(', '));
      ok(`${shape.name}: the spotlight lands on the object every time`,
        !lightOff.length, lightOff.slice(0, 4).join(', '));
      ok(`${shape.name}: every object gets a push-in`, !noZoom.length, noZoom.join(', '));

      // and it comes back — once the pull-out has actually finished. The move
      // takes .62s and the loop above only waits .65s, which is a coin toss on
      // a busy machine; this is a check on where the camera ends up, not on
      // how quickly the test can look.
      await p.waitForFunction(() => {
        const st = document.getElementById('stage').getBoundingClientRect();
        return Math.abs((st.left + st.right) / 2 - innerWidth / 2) < 1.5
          && Math.abs(st.width / 1600 - Math.min(innerWidth / 1600, innerHeight / 900)) < 0.002;
      }, null, { timeout: 4000 }).catch(() => {});
      const back = await look(p);
      ok(`${shape.name}: closing returns to the wide shot`,
        !back.zoomed && back.centred && back.worstEdge <= wide.worstEdge + 0.6,
        `zoomed ${back.zoomed}, letterbox ${back.worstEdge}px`);
      await p.close();
    }
  }

  /* ---------------------------------------------- the small object vs the big */
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  p.on('pageerror', e => errs.push('adaptive: ' + e.message));
  await start(p, 'eldermoor');
  console.log('\n--- the push-in adapts to what it is looking at ---');
  const zoomOf = async (id) => {
    await p.evaluate((i) => openModal(i), id);
    await p.waitForTimeout(650);
    const k = await p.evaluate(() => camFocus.k);
    await p.evaluate(() => closeModal());
    await p.waitForTimeout(600);
    return k;
  };
  const small = await zoomOf('chart');     // 9% wide
  const big = await zoomOf('hull');        // 22% wide
  ok(`a small thing is pushed in on harder than a big one (${small.toFixed(2)}x vs ${big.toFixed(2)}x)`,
    small > big + 0.4, `${small} vs ${big}`);
  ok('and neither runs past the cap', small <= 2.8001 && big >= 1.4999, `${small}, ${big}`);
  await p.close();

  /* ---------------------------------------------------------- reduced motion */
  const calm = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
  const cp = await calm.newPage();
  cp.on('pageerror', e => errs.push('calm: ' + e.message));
  await start(cp, 'eldermoor');
  await cp.evaluate(() => openModal('crate'));
  const calmT = await cp.evaluate(() => document.getElementById('stage').style.transition);
  ok('nobody who asked for less motion gets a camera move', calmT === 'none', calmT);
  await calm.close();

  /* --------------------------------------------------------------- the phone */
  const ctx = await browser.newContext({ ...devices['iPhone 12'], hasTouch: true });
  const ph = await ctx.newPage();
  ph.on('pageerror', e => errs.push('phone: ' + e.message));
  await start(ph, 'eldermoor');
  await ph.evaluate(() => { S.isPhone = true; document.body.classList.add('phone'); });
  await ph.evaluate(() => openModal('crate'));
  await ph.waitForTimeout(400);
  ok('a phone gets no camera at all', await ph.evaluate(() => !camFocus));
  ok('and keeps the card it already had', await ph.evaluate(() => {
    const m = getComputedStyle(document.getElementById('modal'));
    return m.borderTopWidth !== '0px' && parseFloat(m.borderTopLeftRadius) > 0;
  }));
  ok('wearing the right material', await ph.evaluate(() =>
    document.body.dataset.scenario === 'eldermoor'
    && getComputedStyle(document.body).getPropertyValue('--card').trim().length > 0));
  await ctx.close();

  console.log('\nJS errors:', errs.length ? errs.slice(0, 5) : 'none');
  await browser.close();
  if (fails || errs.length) { console.log(`\n${fails} FAILURES`); process.exit(1); }
  console.log('\nthe camera leans in, and never shows the edge of the world');
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
