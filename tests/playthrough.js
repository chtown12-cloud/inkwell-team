/* Full playthrough of all five scenarios, start to victory.

   Solves every puzzle in chain order, takes the hint and wrong-answer
   penalties on the first one to check the clock maths, presses the scenario's
   own final button, and confirms the score card and victory screen. The
   tables below are the answer key. */
const { chromium } = require('playwright');

const BASE = 'http://localhost:8787';

const SOLUTIONS = {
  eldermoor: {
    finalButton: 'LAUNCH ⛵',
    emoji: '🐙', victoryText: 'THE RAFT IS AWAY', finale: ['signal', 'SIGNAL'],
    rooms: [
      [['driftwood', 'SAIL'], ['crate', '8513'], ['box', 'SALT'], ['chart', '54']],
      [['radio', 'DIAL:1215'], ['broadcast', 'LOOK UNDER'], ['hatch', 'STORM'], ['transmitter', '394']],
      [['tree', 'RIVER'], ['stones', 'DROWN'], ['pack', '693'], ['gate', 'SIMUL']],
      [['raftkit', 'ORDER:BDAEC'], ['locker', '2430'], ['tide', '510'], ['winch', '3158']],
    ],
  },
  prospero: {
    finalButton: 'LAUNCH THE POD 🚀',
    emoji: '👾', victoryText: 'THE POD IS AWAY', finale: ['thrusters', 'PANEL:LOCKED|PRESSURE|RELEASE'],
    rooms: [
      [['pods', 'LOCKER'], ['locker', '6942'], ['terminal', 'BURN'], ['manifest', '34']],
      [['antenna', 'DIAL:4715'], ['beacon', 'SEAL VENTS'], ['console', 'GAMMA'], ['reactor', '651']],
      [['vines', 'VENT'], ['trays', 'STARVE'], ['pumps', '642'], ['airlock', 'PURGE']],
      [['checklist', 'ORDER:EBDAC'], ['fuelpanel', '9430'], ['window', '435'], ['clamps', '2496']],
    ],
  },
  vorstag: {
    finalButton: 'RIDE THE LIGHTNING ⚡',
    emoji: '🧟', victoryText: 'THE GATE IS OPEN', finale: ['rod', 'HOLD'],
    rooms: [
      [['crests', 'WELL'], ['well', '9357'], ['doors', 'NOCTIS'], ['ledger', '56']],
      [['organ', 'DIAL:1193'], ['chimes', 'STAY INSIDE'], ['folio', 'SPARK'], ['orrery', '763']],
      [['slab', 'LIGHTNING'], ['jars', 'RISEN'], ['switchboard', '624'], ['dumbwaiter', 'ALIVE']],
      [['rig', 'ORDER:EADCB'], ['fusebox', '2386'], ['barometer', '1040'], ['portcullis', '7539']],
    ],
  },
  erebus: {
    finalButton: 'CALL THE PLANE 🛩️',
    emoji: '🐧', victoryText: null, finale: ['runway', 'DIAL:1764'],
    rooms: [
      [['flags', 'GARAGE'], ['garage', '6841'], ['maindoor', 'SOUTH'], ['noticeboard', '73']],
      [['shortwave', 'DIAL:882'], ['recorder', 'MELT NOTHING'], ['footlocker', 'FROST'], ['genpanel', '842']],
      [['coreE9', 'ICE'], ['cores', 'BURIED'], ['coldsafe', '936'], ['intercom', 'BELOW']],
      [['genstart', 'ORDER:DEBAC'], ['lockbox', '1764'], ['weather', '530'], ['flarebox', '1486']],
    ],
  },
  midnight: {
    finalButton: 'MAKE THE JUNCTION 🚂',
    emoji: '🎩', victoryText: null, finale: ['whistle', 'SIMUL'],
    rooms: [
      [['trunks', 'PORTER'], ['desk', '8253'], ['mailcage', 'COAL'], ['waybill', '49']],
      [['gramophone', 'DIAL:784'], ['runout', 'WRONG STOP'], ['valise', 'BRAKE'], ['berthlock', '276']],
      [['menu', 'MIRROR'], ['tables', 'HUNGRY'], ['till', '385'], ['servicebell', 'AGAIN']],
      [['firebox', 'ORDER:CBEDA'], ['lantern', '1568'], ['timetable', '340'], ['coupling', '3528']],
    ],
  },
};

const only = process.argv.slice(2).filter(a => SOLUTIONS[a]);
const RUN = only.length ? only : Object.keys(SOLUTIONS);

async function run(page, id) {
  const spec = SOLUTIONS[id];
  await page.goto(BASE + '/?s=' + id);
  await page.fill('#team-name', 'The Krakens');
  await page.click(`[data-emoji="${spec.emoji}"]`).catch(() => {});
  await page.click('#start-btn');
  await page.waitForTimeout(600);
  if (await page.isVisible('#qr-panel')) await page.click('#qr-done', { force: true });
  await page.waitForSelector('#enter-room-btn', { timeout: 6000 });
  await page.click('#enter-room-btn');

  // Story beats wait for a click now, and their catcher covers the board.
  const clearBeat = async () => {
    for (let i = 0; i < 10; i++) {
      if (!(await page.evaluate(() => typeof beatShowing !== 'undefined' && beatShowing))) return;
      await page.click('#beatveil', { force: true });
      await page.waitForTimeout(140);
    }
    throw new Error('a story beat would not dismiss');
  };
  /* A scripted intrusion can raise the beat veil at any moment, including
     between clearing the beats and landing a click. Clear and retry rather
     than racing it. */
  const clickThrough = async (sel, tries = 6) => {
    for (let i = 0; i < tries; i++) {
      await clearBeat();
      try {
        await page.click(sel, { force: true, timeout: 4000 });
        return;
      } catch (e) {
        if (i === tries - 1) throw e;
        await page.waitForTimeout(200);
      }
    }
  };
  /* Any team-mate's sync re-renders the hotspot layer, so a hotspot can be
     swapped out between resolving the locator and landing the click. Treat
     opening an object as one retryable unit rather than three steps that
     each have to win a race. */
  const openObj = async (oid, tries = 6) => {
    for (let i = 0; i < tries; i++) {
      try {
        await clearBeat();
        await page.waitForSelector(`[data-obj="${oid}"]`, { timeout: 8000 });
        await page.click(`[data-obj="${oid}"]`, { force: true, timeout: 4000 });
        await page.waitForSelector('#modal h3', { timeout: 4000 });
        return;
      } catch (e) {
        if (i === tries - 1) throw new Error(`could not open ${oid}: ${e.message}`);
        await page.waitForTimeout(250);
      }
    }
  };
  const solve = async (oid, ans) => {
    await openObj(oid);
    if (ans === 'SIMUL') {
      await page.click('#simul-pull', { force: true });
    } else if (ans === 'SIGNAL') {
      for (const ch of ['.', '.', '.', '-', '-', '-', '.', '.', '.']) await page.evaluate((c) => signalAdd(c), ch);
      await page.evaluate((o) => signalSend(o), oid);
    } else if (ans.startsWith('PANEL:')) {
      for (const want of ans.slice(6).split('|')) {
        await page.click(`.pan-opt:text-is("${want}")`, { force: true });
      }
      await page.click('button:has-text("COMMIT")', { force: true });
    } else if (ans === 'HOLD') {
      // genuinely hold the control and let go on the number, the way a player
      // must — driving holdVal directly would prove nothing about the mechanic
      await page.evaluate(() => new Promise((done) => {
        const btn = document.getElementById('hold-btn');
        btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
        const target = ACTIVE.rooms[S.roomIndex].objects.find(o => o.puzzle && o.puzzle.type === 'hold').puzzle.hold.target;
        const watch = setInterval(() => {
          if (holdVal < target) return;
          clearInterval(watch);
          btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
          done();
        }, 20);
      }));
    } else if (ans.startsWith('ORDER:')) {
      // arrange the tags by hand, the way a player would
      const want = ans.slice(6).split('');
      for (let pos = 0; pos < want.length; pos++) {
        for (let guard = 0; guard < 8; guard++) {
          const at = await page.evaluate(() => [...document.querySelectorAll('#ord-list .ord-item')].map(li => li.dataset.ch));
          if (at[pos] === want[pos]) break;
          const from = at.indexOf(want[pos]);
          await page.click(`#ord-list .ord-item:nth-child(${from + 1}) .ord-up`, { force: true });
          await page.waitForTimeout(60);
        }
      }
      await page.click('button:has-text("LOCK THIS ORDER")', { force: true });
    } else if (ans.startsWith('DIAL:')) {
      const v = ans.split(':')[1];
      await page.evaluate((val) => {
        const s = document.getElementById('dial-slider'); s.value = val; s.dispatchEvent(new Event('input', { bubbles: true }));
        document.querySelectorAll('.knob-slider').forEach(k => { k.value = k.dataset.target; k.dispatchEvent(new Event('input', { bubbles: true })); });
      }, v);
      await page.click('#dial-lock', { force: true });
    } else if (await page.locator('#pad-grid').count()) {
      // a combination lock: key it in
      for (const d of ans.split('')) await page.click(`.pad-key[data-k="${d}"]`, { force: true });
      await page.click('.pad-key.go', { force: true });
    } else if (await page.locator('#sel-grid').count()) {
      // a rack: tap the ones the rule keeps, in rack order
      for (const ch of ans.split('')) await page.click(`.sel-chip:has(.sel-letter:text-is("${ch}"))`, { force: true });
      await page.click('button:has-text("THESE"), button:has-text("HARVEST"), button:has-text("CLEAR")', { force: true });
    } else {
      await page.fill('#answer-input', ans);
      await page.click('.answer-row button', { force: true });
    }
    const ended = await Promise.race([
      page.waitForSelector('.solved-note', { timeout: 12000 }).then(() => 'solved'),
      page.waitForSelector('.end-card', { timeout: 12000 }).then(() => 'victory'),
    ]);
    if (ended === 'victory') return;          // an auto-launch beat us to it
    await clickThrough('.close-x');
  };

  // penalties on the first puzzle: wrong(5) + hint1(30) + hint2(60) = 1:35
  const first = spec.rooms[0][0];
  await openObj(first[0]);
  await page.fill('#answer-input', 'XYZZY');
  await clickThrough('.answer-row button');
  await page.waitForSelector('.feedback.bad');
  await clearBeat();
  await clickThrough('.hint-btn'); await page.waitForSelector('.hint-text');
  await clickThrough('.hint-btn');
  await page.waitForFunction(() => document.querySelectorAll('.hint-text').length === 2);
  await clickThrough('.close-x');
  const pen = (await page.textContent('#stat-pen')).trim();
  if (pen !== '+1:35') throw new Error(`[${id}] expected +1:35 penalties, got ${pen}`);

  let puzzles = 0;
  for (let r = 0; r < spec.rooms.length; r++) {
    for (const [oid, ans] of spec.rooms[r]) { await solve(oid, ans); puzzles++; }
    if (r < 3) {
      await clickThrough('#continue-btn');
      await page.waitForSelector('#enter-room-btn', { timeout: 6000 });
      await clickThrough('#enter-room-btn');
    }
  }
  // The last lock being open is not the same as being out: the room card now
  // comes up with the scenario's own button on it, and somebody presses it.
  await solve(spec.finale[0], spec.finale[1]);
  if (!(await page.locator('.end-card').count())) {
    await page.waitForSelector('#room-complete:not(.hidden)', { timeout: 9000 });
    const label = (await page.textContent('#continue-btn')).trim();
    if (!spec.finalButton || label !== spec.finalButton) {
      throw new Error(`[${id}] expected the final button to read ${spec.finalButton}, got ${label}`);
    }
    const note = (await page.textContent('#room-complete-text')).trim();
    if (note.length < 40) throw new Error(`[${id}] the last room says nothing before you leave`);
    await clickThrough('#continue-btn');
  }
  await page.waitForSelector('.end-card', { timeout: 12000 });
  const card = await page.textContent('.end-card');
  if (spec.victoryText && !card.includes(spec.victoryText)) throw new Error(`[${id}] no victory text`);
  if (!/How it all fitted together/i.test(card)) throw new Error(`[${id}] the chains were not shown`);
  console.log(`✅ ${id}: full playthrough passed (${puzzles} puzzles, penalties ${pen}, score card + chains OK)`);
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 810 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  for (const id of RUN) await run(page, id);
  if (errs.length) { console.error('JS errors:', errs.slice(0, 5)); process.exit(1); }
  await browser.close();
  console.log('ALL REQUESTED SCENARIOS PASSED');
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
