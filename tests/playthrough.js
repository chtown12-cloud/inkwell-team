/* Full playthrough of all five scenarios, start to victory.

   A scenario on the reset grammar needs no answer key here: the test reads
   each lock's answer out of the scenario's own data and then opens the lock
   BY HAND — turning the wheels, pressing the compass, swapping the scraps —
   in the order the room allows, looking first at everything the lock says
   its answer comes from. It takes a wrong try and two hints on the first
   lock to check the clock maths, makes sure nothing that should be dead or
   hidden can be worked early, presses the scenario's own final button, and
   confirms the score card and the chains.

   The four scenarios not yet rebuilt are still played from the table below.
*/
const { launch } = require('./browser');

const BASE = 'http://localhost:8787';
const ALL = ['eldermoor', 'prospero', 'vorstag', 'erebus', 'midnight'];

const SOLUTIONS = {
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

const only = process.argv.slice(2).filter(a => ALL.includes(a));
const RUN = only.length ? only : ALL;

/* ---------- what both kinds of run share ---------- */
function helpers(page) {
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
  const closeObj = async () => {
    if (await page.evaluate(() => !document.getElementById('overlay').classList.contains('hidden'))) await clickThrough('.close-x');
    await page.waitForFunction(() => document.getElementById('overlay').classList.contains('hidden'), null, { timeout: 4000 });
  };
  return { clearBeat, clickThrough, openObj, closeObj };
}

async function begin(page, id, emoji) {
  await page.goto(BASE + '/?s=' + id);
  await page.fill('#team-name', 'The Krakens');
  if (emoji) await page.click(`[data-emoji="${emoji}"]`).catch(() => {});
  await page.click('#start-btn');
  await page.waitForTimeout(600);
  if (await page.isVisible('#qr-panel')) await page.click('#qr-done', { force: true });
  await page.waitForSelector('#enter-room-btn', { timeout: 6000 });
  await page.click('#enter-room-btn');
}

/* ======================================================================
   THE RESET GRAMMAR: every lock opened by hand, from the data's own answers
   ====================================================================== */

/** The next lock a player could actually open: visible, live, and with every source of its answer in hand. */
const nextLock = (page) => page.evaluate(() => {
  const room = currentRoom();
  const byId = Object.fromEntries(room.objects.map(o => [o.id, o]));
  const inHand = (f) => { const s = byId[f]; return !!s && objVisible(s) && (s.puzzle ? S.solved.has(f) : objLive(s)); };
  const o = room.objects.find(o => o.puzzle && !S.solved.has(o.id) && objVisible(o) && objLive(o) && (o.puzzle.from || []).every(inHand));
  if (!o) return null;
  const p = o.puzzle;
  const faces = LOCKS.normFaces((p.wheels && p.wheels[0] && p.wheels[0].faces) || p.faces);
  return {
    id: o.id, type: p.type, from: p.from || [],
    want: p.type === 'combo' ? LOCKS.asList(p.answer, faces)
      : p.type === 'tiles' ? (p.answer ? LOCKS.asList(p.answer) : Array.from({ length: p.cols * p.rows }, (_, i) => String(i)))
      : p.type === 'tune' ? p.at
      : (p.type === 'toggle' || p.type === 'press') ? LOCKS.asList(p.answer)
      : p.type === 'levels' ? LOCKS.asList(p.answer).map(Number)
      : p.type === 'hold' ? p.target
      : String(p.answer),
    slots: p.slots, repeat: !!p.repeat, inside: !!p.inside, says: !!p.solvedText,
    // what must not be workable until this lock is open
    waitsOnThis: room.objects.filter(x => [].concat(x.needs || []).includes(o.id)).map(x => x.id),
    hiddenByThis: room.objects.filter(x => x.hiddenUntil === o.id).map(x => x.id),
  };
});

/** One wrong attempt, made the way a player would make it. Returns false where a lock cannot be got wrong. */
async function fumble(page, lock) {
  const t = lock.type;
  if (t === 'combo') {
    const at = await page.evaluate(() => [...document.querySelectorAll('.lk-wheel')].map(w => w.dataset.v));
    if (at.join() === lock.want.join()) await page.click('.lk-wheel[data-w="0"] .lk-step.up');
    await page.click('.lk-try');
  } else if (t === 'clock' || t === 'toggle' || t === 'levels') {
    await page.click('.lk-try');
  } else if (t === 'keypad') {
    const d = lock.want[0] === '1' ? '2' : '1';
    for (let i = 0; i < lock.want.length; i++) await page.click(`.pad-key[data-k="${d}"]`);
    await page.click('.pad-key.go');
  } else if (t === 'dirpad') {
    const d = /^N+$/.test(lock.want) ? 'S' : 'N';
    for (let i = 0; i < lock.want.length; i++) await page.click(`.lk-d[data-dir="${d}"]`);
  } else if (t === 'press' && lock.repeat) {
    const k = lock.want.every(x => x === lock.want[0]) ? null : lock.want[0];
    if (!k) return false;
    for (let i = 0; i < lock.want.length; i++) await page.click(`#modal .lock [data-key="${k}"]`, { force: true });
  } else if (t === 'press') {
    for (const k of lock.want.slice().reverse()) await page.click(`#modal .lock [data-key="${k}"]`, { force: true });
  } else return false;
  await page.waitForSelector('.feedback.bad', { timeout: 4000 });
  return true;
}

/** Open it with your hands. */
async function work(page, lock) {
  const t = lock.type;
  if (t === 'combo') {
    for (let i = 0; i < lock.want.length; i++) {
      for (let k = 0; k < 40; k++) {
        if ((await page.getAttribute(`.lk-wheel[data-w="${i}"]`, 'data-v')) === lock.want[i]) break;
        await page.click(`.lk-wheel[data-w="${i}"] .lk-step.up`);
      }
    }
    await page.click('.lk-try');
  } else if (t === 'dirpad') {
    for (const d of lock.want.split('')) await page.click(`.lk-d[data-dir="${d}"]`);
  } else if (t === 'clock') {
    const [h, m] = lock.want.split(':').map(Number);
    for (let k = 0; k < 13; k++) { if (+(await page.getAttribute('#lk-clock', 'data-h')) === h) break; await page.click('.ck-btn[data-k="h+"]'); }
    for (let k = 0; k < 13; k++) { if (+(await page.getAttribute('#lk-clock', 'data-m')) === m) break; await page.click('.ck-btn[data-k="m+"]'); }
    await page.click('.lk-try');
  } else if (t === 'toggle') {
    // every switch to where it has to be, whichever way it started
    const all = await page.evaluate(() => [...document.querySelectorAll('#modal .lock [data-key]')].map(e => [e.dataset.key, e.classList.contains('on')]));
    for (const [k, on] of all) if (on !== lock.want.includes(k)) await page.click(`#modal .lock [data-key="${k}"]`, { force: true });
    await page.click('.lk-try');
  } else if (t === 'press') {
    // a wrong run may still be on the pad
    if (await page.locator('#modal .lk-clear').count()) await page.click('#modal .lk-clear', { force: true });
    for (const k of lock.want) { await page.click(`#modal .lock [data-key="${k}"]`, { force: true }); await page.waitForTimeout(40); }
  } else if (t === 'tiles') {
    for (let i = 0; i < lock.want.length; i++) {
      const at = await page.evaluate(() => [...document.querySelectorAll('.lk-tile')].map(x => x.dataset.piece));
      if (at[i] === lock.want[i]) continue;
      await page.click(`.lk-tile[data-slot="${i}"]`);
      await page.click(`.lk-tile[data-slot="${at.indexOf(lock.want[i])}"]`);
    }
  } else if (t === 'levels') {
    for (let i = 0; i < lock.want.length; i++) {
      if (+(await page.getAttribute(`.lk-col[data-c="${i}"]`, 'data-v')) === lock.want[i]) continue;
      await page.click(`.lk-cell[data-c="${i}"][data-l="${lock.want[i]}"]`);
    }
    await page.click('.lk-try');
  } else if (t === 'hold' && await page.locator('#lk-hold').count()) {
    // genuinely hold it and let go on the number, the way a player must
    await page.evaluate((target) => new Promise((done) => {
      const btn = document.getElementById('hold-btn'), box = document.getElementById('lk-hold');
      btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
      const watch = setInterval(() => {
        if (+box.dataset.v < target) return;
        clearInterval(watch);
        btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
        done();
      }, 10);
    }), lock.want);
  } else if (t === 'tune') {
    await page.evaluate((v) => { const s = document.getElementById('tune-slider'); s.value = v; s.dispatchEvent(new Event('input', { bubbles: true })); }, lock.want);
  } else if (t === 'simul') {
    await page.click('#simul-pull', { force: true });
  } else if (t === 'keypad') {
    for (const d of lock.want.split('')) await page.click(`.pad-key[data-k="${d}"]`, { force: true });
    await page.click('.pad-key.go', { force: true });
  } else if (t === 'hold') {
    await page.evaluate(() => new Promise((done) => {
      const btn = document.getElementById('hold-btn');
      btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }));
      const target = currentRoom().objects.find(o => o.puzzle && o.puzzle.type === 'hold').puzzle.hold.target;
      const watch = setInterval(() => {
        if (holdVal < target) return;
        clearInterval(watch);
        btn.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
        done();
      }, 20);
    }));
  } else throw new Error(`no hands for a ${t} lock`);
}

async function runClassic(page, id) {
  const { clearBeat, clickThrough, openObj, closeObj } = helpers(page);
  await begin(page, id);
  const game = await page.evaluate(() => ({ rooms: ACTIVE.rooms.length, finalButton: ACTIVE.finalButton, victory: ACTIVE.victoryTitle }));
  const isOpen = (oid) => page.evaluate((o) => S.solved.has(o), oid);
  let locks = 0, looked = 0, pen = null;

  for (let r = 0; r < game.rooms; r++) {
    for (let guard = 0; guard < 40; guard++) {
      const lock = await nextLock(page);
      if (!lock) break;

      // nothing that waits on this lock can be worked yet, and nothing it hides can be seen
      for (const h of lock.hiddenByThis) {
        if (await page.locator(`[data-obj="${h}"]`).count()) throw new Error(`[${id}] ${h} is in the room before ${lock.id} is open`);
      }
      for (const w of lock.waitsOnThis) {
        await openObj(w);
        if (await page.locator('#modal .lock, #modal .puzzle-box').count()) throw new Error(`[${id}] ${w} can be worked before ${lock.id} is open`);
        await closeObj();
      }

      // look at everything the lock says its answer comes from
      for (const f of lock.from) {
        await openObj(f);
        if (!(await page.locator('#modal .obj-fig svg').count())) throw new Error(`[${id}] ${f} is named as a source for ${lock.id} but shows nothing`);
        await closeObj(); looked++;
      }

      await openObj(lock.id);
      await page.waitForSelector('#modal .lock, #modal .puzzle-box', { timeout: 5000 });

      if (pen === null) {
        // penalties on the first lock: wrong(5) + hint1(30) + hint2(60) = 1:35
        const fumbled = await fumble(page, lock);
        await clearBeat();
        await clickThrough('.hint-btn'); await page.waitForSelector('.hint-text');
        await clickThrough('.hint-btn');
        await page.waitForFunction(() => document.querySelectorAll('.hint-text').length === 2);
        pen = (await page.textContent('#stat-pen')).trim();
        const want = fumbled ? '+1:35' : '+1:30';
        if (pen !== want) throw new Error(`[${id}] expected ${want} penalties, got ${pen}`);
        if (await isOpen(lock.id)) throw new Error(`[${id}] ${lock.id} opened on a wrong try`);
      }

      await work(page, lock);
      const ok = await page.waitForFunction((o) => S.solved.has(o), lock.id, { timeout: 8000 }).then(() => true).catch(() => false);
      if (!ok) throw new Error(`[${id}] R${r + 1} ${lock.id} (${lock.type}) did not open`);
      locks++;

      // an open lock shows what was in it; one with nothing to show gets out of the way
      if (lock.inside || lock.says) {
        await page.waitForSelector('#modal .obj-desc.won', { timeout: 4000 });
        if (lock.inside && !(await page.locator('#modal .inside svg').count())) throw new Error(`[${id}] ${lock.id} opened on nothing`);
      }
      await closeObj();
      for (const h of lock.hiddenByThis) await page.waitForSelector(`[data-obj="${h}"]`, { timeout: 4000 });
    }
    const left = await page.evaluate(() => currentRoom().objects.filter(o => o.puzzle && !S.solved.has(o.id)).map(o => o.id));
    if (left.length) throw new Error(`[${id}] R${r + 1} cannot be finished: ${left.join(', ')} never became openable`);

    await page.waitForSelector('#room-complete:not(.hidden)', { timeout: 9000 });
    if (r < game.rooms - 1) {
      await clickThrough('#continue-btn');
      await page.waitForSelector('#enter-room-btn', { timeout: 6000 });
      await clickThrough('#enter-room-btn');
    }
  }

  // The last lock being open is not the same as being out: the room card
  // comes up with the scenario's own button on it, and somebody presses it.
  if (!(await page.locator('.end-card').count())) {
    const label = (await page.textContent('#continue-btn')).trim();
    if (!game.finalButton || label !== game.finalButton) throw new Error(`[${id}] expected the final button to read ${game.finalButton}, got ${label}`);
    const note = (await page.textContent('#room-complete-text')).trim();
    if (note.length < 40) throw new Error(`[${id}] the last room says nothing before you leave`);
    await clickThrough('#continue-btn');
  }
  await page.waitForSelector('.end-card', { timeout: 12000 });
  const card = await page.textContent('.end-card');
  const title = String(game.victory || '').replace(/[^A-Za-z ]/g, '').trim();
  if (title && !card.includes(title)) throw new Error(`[${id}] no victory text`);
  if (!/How it all fitted together/i.test(card)) throw new Error(`[${id}] the chains were not shown`);
  console.log(`✅ ${id}: opened by hand (${locks} locks, ${looked} looks at where the answers come from, penalties ${pen}, score card + chains OK)`);
}

/* ======================================================================
   NOT YET REBUILT: played from the table at the top
   ====================================================================== */
async function run(page, id) {
  const spec = SOLUTIONS[id];
  const { clearBeat, clickThrough, openObj } = helpers(page);
  await begin(page, id, spec.emoji);

  const solve = async (oid, ans) => {
    await openObj(oid);
    if (ans === 'SIMUL') {
      await page.click('#simul-pull', { force: true });
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
  const browser = await launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 810 } });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  for (const id of RUN) {
    await page.goto(BASE + '/?s=' + id);
    const classic = await page.evaluate((id) => !!SCENARIOS.find(s => s.id === id).classic, id);
    await (classic ? runClassic(page, id) : run(page, id));
  }
  if (errs.length) { console.error('JS errors:', errs.slice(0, 5)); process.exit(1); }
  await browser.close();
  console.log('ALL REQUESTED SCENARIOS PASSED');
})().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
