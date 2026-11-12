/* The shared session, on both transports: a screen and a phone play every
   scenario room by room, and the test checks they are always in the SAME room,
   that every room is visited once and in order, and that the ending happens
   once.

   Why this suite exists. On the deployed site a game is synced through
   Firebase, and Firebase hands a page its own write back from inside the call
   that made it (see fake-firebase.js). The game's Continue button told the
   session "room 2", was handed "room 2" on the spot, went there — and then,
   still inside the same click, went to "the next room" from where it now
   stood. Room 3 on the screen, room 2 on every phone, and no way back. The
   other suites run on the dev server's REST path, which answers a tick later,
   so they could not see it.

     node dev-server.js &            # port 8787
     node tests/sync.js [scenario …]
*/
const { launch } = require('./browser');
const path = require('path');

const BASE = 'http://localhost:8787';
const ALL = ['eldermoor', 'prospero', 'vorstag', 'erebus', 'midnight'];
const TRANSPORTS = ['firebase', 'api'];
const FAKE = path.join(__dirname, 'fake-firebase.js');

let failed = 0;
const fail = (where, msg) => { failed++; console.log(`  FAIL  ${where}: ${msg}`); };
const ok = (where, msg) => console.log(`  ok    ${where}: ${msg}`);

/** Wait until an expression in the page is truthy; false if it never is. */
const until = (page, fn, arg, ms = 4000) => page.waitForFunction(fn, arg, { timeout: ms }).then(() => true, () => false);

async function play(browser, id, transport) {
  const tag = `${id} / ${transport}`;
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  // never the real SDK, and never the real database, whatever machine this runs on
  await ctx.route(/gstatic\.com|firebaseio\.com|firebasedatabase\.app/, (r) => r.abort());
  if (transport === 'firebase') await ctx.addInitScript({ path: FAKE });
  const errors = [];

  const screen = await ctx.newPage();
  screen.on('pageerror', (e) => errors.push('screen: ' + e.message));
  await screen.goto(BASE + '/?s=' + id);
  // Count what the screen actually does, at the two places the bug showed.
  await screen.evaluate(() => {
    window.__entered = []; window.__wins = 0;
    const enter = window.enterRoom, win = window.victory;
    window.enterRoom = function (i) { window.__entered.push(i); return enter.apply(this, arguments); };
    window.victory = function () { window.__wins++; return win.apply(this, arguments); };
    window.showBeat = () => {};          // story beats veil the screen; they are not what is being tested
  });
  await screen.fill('#team-name', 'The Krakens');
  await screen.click('#start-btn');
  if (!await until(screen, () => !!S.code)) { fail(tag, 'no shared session was opened'); await ctx.close(); return; }
  const mode = await screen.evaluate(() => NET.mode);
  if (mode !== transport) { fail(tag, `expected the ${transport} transport, the game chose ${mode}`); await ctx.close(); return; }
  await screen.waitForTimeout(300);
  if (await screen.isVisible('#qr-panel')) await screen.click('#qr-done', { force: true });
  const code = await screen.evaluate(() => S.code);

  const phone = await ctx.newPage();
  phone.on('pageerror', (e) => errors.push('phone: ' + e.message));
  await phone.setViewportSize({ width: 390, height: 800 });
  await phone.goto(BASE + '/?join=' + code);
  await phone.waitForSelector('#join-btn', { state: 'visible', timeout: 6000 });
  await phone.fill('#join-name', 'Mo');
  await phone.click('#join-btn');
  if (!await until(phone, () => S.started && S.isPhone)) { fail(tag, 'the phone could not join'); await ctx.close(); return; }
  await phone.evaluate(() => { window.showBeat = () => {}; });

  const rooms = await screen.evaluate(() => ACTIVE.rooms.map((r) => ({ name: r.name, locks: r.objects.filter((o) => o.puzzle).map((o) => o.id) })));
  const visited = [];
  let bad = false;

  for (let r = 0; r < rooms.length && !bad; r++) {
    const where = `${tag} room ${r + 1}`;
    // the screen: one card, and it is this room's
    const card = await screen.evaluate(() => ({
      cards: document.querySelectorAll('#card-root #room-card').length,
      title: (document.querySelector('#room-card h2') || {}).textContent || '',
      at: S.roomIndex, session: NET.state && NET.state.roomIndex,
    }));
    visited.push(card.at);
    if (card.at !== r) { fail(where, `the screen is in room ${card.at + 1} ("${card.title}")`); bad = true; break; }
    if (card.cards !== 1 || card.title !== rooms[r].name) { fail(where, `expected one card reading "${rooms[r].name}", found ${card.cards} reading "${card.title}"`); bad = true; break; }
    // the phone: in the same room, without being told twice
    if (!await until(phone, (want) => S.roomIndex === want, r)) {
      fail(where, `the phone is in room ${await phone.evaluate(() => S.roomIndex + 1)}`); bad = true; break;
    }
    if (!await until(screen, (want) => NET.state && NET.state.roomIndex === want, r)) {
      fail(where, `the session says room ${(await screen.evaluate(() => NET.state.roomIndex)) + 1}`); bad = true; break;
    }
    await screen.click('#enter-room-btn');

    // open every lock, the screen and the phone taking turns
    for (let i = 0; i < rooms[r].locks.length; i++) {
      const lock = rooms[r].locks[i], who = i % 2 ? phone : screen, other = i % 2 ? screen : phone;
      await who.evaluate((lockId) => { solvePuzzle(currentRoom().objects.find((o) => o.id === lockId)); closeModal(); }, lock);
      if (!await until(other, (lockId) => S.solved.has(lockId), lock)) { fail(where, `"${lock}" opened on one device and never reached the other`); bad = true; break; }
    }
    if (bad) break;
    if (!await until(screen, () => !document.getElementById('room-complete').classList.contains('hidden'))) { fail(where, 'every lock is open and the screen does not say so'); bad = true; break; }

    await screen.evaluate(() => { closeModal(); window.__entered.length = 0; });
    await screen.click('#continue-btn');
    await screen.waitForTimeout(250);        // long enough for a reply from either transport to land
    if (r < rooms.length - 1) {
      const entered = await screen.evaluate(() => window.__entered.slice());
      if (entered.length !== 1 || entered[0] !== r + 1) {
        fail(where, `one press of Continue entered room(s) ${entered.map((x) => x + 1).join(', then ') || 'none'} — expected room ${r + 2}, once`); bad = true;
      }
    } else {
      if (!await until(screen, () => S.finished)) { fail(where, 'the final button did not end the game'); bad = true; break; }
      await screen.waitForTimeout(400);
      const wins = await screen.evaluate(() => window.__wins);
      if (wins !== 1) { fail(where, `the ending ran ${wins} times on the screen`); bad = true; }
      if (!await until(phone, () => S.finished)) { fail(where, 'the phone never heard that the game was won'); bad = true; }
    }
  }

  if (!bad) {
    const want = rooms.map((_, i) => i).join(',');
    if (visited.join(',') !== want) fail(tag, `rooms visited: ${visited.map((x) => x + 1).join(' → ')}`);
    else if (errors.length) fail(tag, 'JS errors: ' + errors.join(' | '));
    else ok(tag, `rooms ${visited.map((x) => x + 1).join(' → ')} on the screen and the phone; one ending`);
  } else if (errors.length) console.log('        JS errors: ' + errors.join(' | '));
  await ctx.close();
}

(async () => {
  const want = process.argv.slice(2).filter((a) => ALL.includes(a));
  const browser = await launch();
  for (const transport of TRANSPORTS) {
    console.log(`--- ${transport === 'firebase' ? 'Firebase (what the deployed site uses)' : 'REST fallback (the dev server)'} ---`);
    for (const id of (want.length ? want : ALL)) await play(browser, id, transport);
  }
  await browser.close();
  console.log(failed ? `\n${failed} FAILED` : '\nA screen and a phone stay in step on both transports.');
  process.exit(failed ? 1 : 0);
})();
