# Escape the Night 🌙

Five browser-based virtual escape rooms for remote teams, built as point-and-click
adventures on one shared engine. One person shares their screen and drives;
everyone else joins on their phones by scanning a QR code, so the crew can
split up and work different puzzles at once. Pick a scenario, muster your crew,
and race the clock.

| Scenario | Setting | The thing you never see |
|----------|---------|--------------------------|
| 🏝️ **The Wreck of the Eldermoor** | Shipwreck on an uncharted island | Something pacing the treeline |
| 🚀 **Derelict: The Prospero** | Dead colony ship, 40 years off course | Something living in the vents |
| ⚡ **Castle Vorstag** | The Baron's castle, slab empty | Something dragging its feet in the halls |
| ❄️ **Station Erebus** | Silent Antarctic research station | Something that thawed out of core E-9 |
| 🚂 **The Midnight Special** | A 1927 express that never arrives | The Conductor, punching tickets nobody bought |

Every scenario: 4 rooms, 17 puzzles, illustrated animated scenes (SVG parallax,
fog, snow, fireflies, film grain), discoverable glowing hotspots, an unseen
monster delivered through narrative beats, and a fully synthesized WebAudio
soundscape with a distinct signature per room (surf and gulls; reactor hum and
sonar pings; thunder and organ; blizzard and generator chug; rail clack and far
whistles). No image or audio files — everything is generated in the browser.

**How the puzzles work.** *The Wreck of the Eldermoor* is built the way a
physical escape room is: locks that look like locks, and whatever opens each
one somewhere else in the room. A padlock with four wheels ringed in four
colours — and, along the hull, a net of glass floats in the same four colours.
A compass you steer through seven legs — and a torn chart whose course has
seven. Nothing is typed. Wheels are turned, scraps swapped, clock hands set,
breakers thrown, a lantern swept across dark water; no lock carries
instructions, and no clue says which lock it belongs to. Expect to be properly
stuck now and then: a hint or two per room is normal.

The other four scenarios are being rebuilt the same way, one at a time. Until
each is, it plays as before — clue documents, ciphers and deductions — with
its own palette, so a second scenario does not repeat the first:

| Slot | Prospero | Vorstag | Erebus | Midnight |
|------|----------|---------|--------|----------|
| Room-1 opener | **acrostic** (phosphor burn-in) | **anagram** | **A1Z26** (№→letter) | **book cipher** (line·word) |
| Room-2 cipher | **binary** (5-bit) | **Atbash** (mirror) | **Vigenère** (key ICE) | **rail fence** (zigzag) |
| Room-2 deduction | **logic-grid** rod seating | **Roman-numeral** weighing | **halving-chain** rule | **boarding-order** logic |
| Room-3 filter | **number property** (primes) | **provenance** (the Baron's wax) | **date range** (before the store failed) | **cross-reference** (covers that settled) |
| Room-3 number lock | **countdown sequence** | **factor puzzle** (×48) | **multiples-of-three** | **money addition** |
| Signal code | **tap code** (knock pairs) | **pigpen** (masons' cipher) | **braille** (embossed dots) | **Cyrillic** (émigré's hand) |
| Co-op set piece | — | — | — | **whistle and lamp** together |

Each of those four uses its own real-world code for its two mid-game signal
decodes — prisoners' tap code, pigpen, braille, or phonetic Cyrillic — and
teams look the alphabet up themselves. The one mechanic they deliberately
share, because it is their signature co-op moment, is the two-stage tuning
**console**: the exact frequency comes from clues, then three trim knobs are
coaxed by watching the meter until the panel reads LOCKED IN.

The rules for both kinds of puzzle are written down in
[PUZZLES.md](PUZZLES.md), and the ones a machine can check are enforced by
`node tests/audit.js`.

## How to run it

Open `index.html` in any modern browser — **sound on, fullscreen recommended**.
No build step; Google Fonts is the only CDN dependency. Deep-link a team
straight to a scenario with `?s=eldermoor`, `?s=prospero`, `?s=vorstag`,
`?s=erebus`, or `?s=midnight`.

### Playing together on phones (recommended for groups)

One person shares their screen as usual. When the game starts it shows a **QR
code**: everyone else scans it and gets a condensed, playable view of the same
room on their own phone. Anyone can open a puzzle and solve it, and **the solve
lands for the whole team instantly**. The shared screen becomes the room — the
scene, the timer, the sound — and doubles as a dispatch board showing who is
working on what.

This fixes the biggest problem with virtual escape rooms: instead of five people
reading one screen over someone's shoulder, the crew can fan out exactly like a
physical room.

- Everyone can read every clue at their own pace.
- Opening a puzzle "seats" you at it: a token with your name and emoji glides
  across the shared screen to that clue, so the whole team can see who is
  working on what and who has drifted off.
- **Can't scan?** The hub has a code box — open the game's address and type the
  six characters shown on the screen. Same result as the QR.
- If the host's screen closes, phones notice within a second and offer to take
  over — on that phone, or on a laptop by opening the address and entering the
  code. Progress and the clock carry across untouched, and the warning clears
  itself if the host was only reloading.
- Nobody is ever locked out: any number of people can join the same puzzle, and
  one person **can** solve alone.
- The **Gorge Gate** in the island scenario is a *simultaneity lock* — two
  winches that must be manned at the same time by different people. Its
  requirement scales to your crew size, so a team of two or three is never stuck.

### Setting up live phone sync (one-time, ~2 minutes)

Sync runs on **Firebase Realtime Database** — the same database QuizDash uses
(project `quizdash-eba72`), under a separate `escape/` key so the two games can
never collide. Nothing else is needed: no server, no Vercel storage, no
serverless functions. Games are pushed over a websocket, so a solve appears on
every device immediately.

Because the game writes to a new key, the database rules need one addition:

**1.** Firebase console → your project → **Realtime Database → Rules**.

**2.** Add the `escape` block alongside the existing `rooms` block, so the rules
read:

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "rooms": {
      "$room": {
        ".read": true,
        ".write": true,
        "players": {
          "$pid": {
            "name": { ".validate": "newData.isString() && newData.val().length <= 24" }
          }
        }
      }
    },
    "escape": {
      "$game": {
        ".read": true,
        ".write": true,
        ".validate": "newData.hasChildren(['code'])",
        "code":       { ".validate": "newData.isString() && newData.val().length == 6" },
        "scenario":   { ".validate": "newData.isString() && newData.val().length <= 32" },
        "difficulty": { ".validate": "newData.isString() && newData.val().length <= 16" },
        "roomIndex":  { ".validate": "newData.isNumber() && newData.val() >= 0 && newData.val() <= 7" },
        "players": {
          "$i": {
            "name":  { ".validate": "newData.isString() && newData.val().length <= 20" },
            "emoji": { ".validate": "newData.isString() && newData.val().length <= 8" }
          }
        }
      }
    }
  }
}
```

**3.** Click **Publish**. That's it — start a game and the QR code works.

The panel that shows the QR code also shows the connection state, so you can
confirm it at a glance: **● live — solves sync instantly** means Firebase is
connected.

**If sync is ever unavailable** — rules not published yet, no network, or the
game opened straight off disk — it silently falls back: first to the bundled
REST API (only present if you deploy the `api/` folder somewhere that runs
serverless functions, e.g. Vercel), and finally to classic single-screen play.
Nothing ever hard-fails.

**Locally:** `node dev-server.js` runs the game on <http://localhost:8787> with
an in-memory store, so you can try phone play with no accounts or setup at all.

**A note on privacy:** the only things stored are a self-chosen nickname, an
emoji, which puzzle each person is sitting at, and which puzzles are solved. No
accounts, no cookies, no email, no analytics. The game never writes puzzle
answers or hint text to the database, and a finished game deletes itself when
the host closes the tab or hits Play Again.

**What it costs:** effectively nothing. A whole 45-minute game with five phones
moves on the order of **1 MB** — the session is about 1.5 KB and gets pushed to
each device whenever something changes. Firebase's free tier includes 10 GB of
downloads a month, which is roughly **ten thousand games**; on a paid plan the
rate is $1/GB, so a game costs about **a tenth of a cent**. Storage is
negligible and self-cleaning. The only free-tier limit worth knowing is 100
simultaneous connections — about 16 games running at the same moment.

### Difficulty

The title screen offers **Standard** (45:00, hints +0:30 / +1:00 / +2:00) and
**Relaxed** (60:00, first hint on each puzzle free, then +0:30 / +1:00). The
mode is recorded on the score card so runs stay comparable.

## Rules at a glance

- Countdown starts at **45:00** (Standard) or **60:00** (Relaxed); the timer
  pulses red under 5 minutes.
- Up to 3 hints per puzzle, escalating, with the cost shown on the button
  before you commit.
- Wrong answers cost **+0:05**.
- Time out → continue in overtime (rating capped) or restart.
- Victory screen: team emoji + name + finishing time, full stats, themed
  rating, and a downloadable PNG score card.

## Facilitator setup

On each scenario's **title screen only**, the 🔑 **Game Master** button opens
that scenario's complete answer key — every answer, chain, and hint with its
cost. It disappears once the game starts. The in-game panel renders from live
data, so it is always the canonical cheat sheet; the tables below are the
quick-reference version.

---

# GAME MASTER QUICK REFERENCE

Answers per scenario, in solve order. (Full chains and all hint text: in-game GM panel.)

## 🏝️ The Wreck of the Eldermoor

| Room | Answers |
|------|---------|
| 1 · The Beach | crate **2457** (glass floats, counted by ring colour: blue, red, white, yellow) → chest **CORAL** (the flags on the mast, read with the signal-book page) → the torn chart, pieced together → binnacle **W N W S W N N** (the chart's course; its rose puts north to the right) |
| 2 · The Radio Station | breakers **2, 5, 6** up (antenna, receiver, lamp — followed along the cables) → receiver tuned to **103.7** → drawer **RAVEN** (morse off the tape) → hatch clock **9:40** (the logbook) → plugs **blue, yellow, red, green** (the photograph is a reflection) |
| 3 · The Jungle Path | pack: **cairn, flower, branch** left up (what is still standing in the second trail-camera frame) → stones **1st, 3rd, 4th, 6th, 8th** (numbered, in the lantern's light) → gate box **snake, frog, moon, fish** (cut card on the carvings, missing corner to the nail) → Gorge Gate = **both winches at once** |
| 4 · The Escape Raft | flare locker **61835** (the photographs in the order they were taken) → logs: middling, longest, shortest, second longest, second shortest → winch clock **6:00** (the crescent moon's tide; anything from 5:30 to 6:30 opens it) → flares **· · · — — — · · ·** |

## 🚀 Derelict: The Prospero

| Room | Answers |
|------|---------|
| 1 · The Cryo Bay | LOCKER (acrostic of pod logs) → **6942** (shutdown order: reactor/power/water/cryo) → RATS (STAR backward) → **34** (9 souls − 6 pods; 2 cores × 2) |
| 2 · The Bridge | tune **47.15** (Day 47 + 15 scratches) → SEAL VENTS (tap code) → GAMMA (binary 5-bit) → **651** (rod-seating logic) |
| 3 · Hydroponics | VENT → STARVE (prime seed counts) → **642** (priming: 6, −2 each pump) → PURGE (airlock tap code) |
| 4 · The Escape Pod Bay | EBDAC (scheduling, oxygen 3rd) → **9430** (47.15 × 2) → **435** (5:20 pass − 45 min) → **2496** (6942 reversed) → SOS thrusters |

## ⚡ Castle Vorstag

| Room | Answers |
|------|---------|
| 1 · The Gatehouse Court | WELL (anagram of L,W,L,E) → **9357** (seasons from spring: ⚘✠♜☾) → NOCTIS (NIGHT in the old tongue) → **56** (11 guests − 6 wolves; 3 dead candles × 2) |
| 2 · The Library | organ stop **119.3** (hymn CXIX + third verse) → STAY INSIDE (pigpen vellum) → SPARK (Atbash mirror) → **763** (Roman weights VII·VI·III, heaviest first) |
| 3 · The Laboratory | LIGHTNING → RISEN (odd charges) → **624** (even digits, product 48) → ALIVE (pigpen card) |
| 4 · The Tower | EADCB (scheduling, capacitor 2nd) → **2386** (119.3 × 2) → **1040** (11:30 strike − 50 min) → **7539** (9357 reversed) → SOS lamp |

## ❄️ Station Erebus

| Room | Answers |
|------|---------|
| 1 · The Perimeter | GARAGE (A1Z26 channel №) → **6841** (resupply order: food/fuel/medical/flares) → SOUTH (riddle = NORTH, "we drilled the other way") → **73** (14 bunks − 7 rotated; 3 full drums) |
| 2 · Crew Quarters | tune **88.2** (day 88 + 2 radio checks) → MELT NOTHING (braille leader) → FROST (Vigenère, key ICE) → **842** (halving chain, Σ14) |
| 3 · The Ice Core Lab | ICE → BURIED (even depths) → **936** (multiples of 3: 9=3+6) → BELOW (braille fob) |
| 4 · The Radio Tower | DEBAC (scheduling, plugs 2nd) → **1764** (88.2 × 2) → **530** (6:10 window − 40 min) → **1486** (6841 reversed) → SOS drum line |

## 🚂 The Midnight Special

| Room | Answers |
|------|---------|
| 1 · The Baggage Car | PORTER (book cipher, line·word) → **8253** (takings, first class → freight) → EMIT (TIME backward) → **49** (11 − 7 crates; 3 sacks × 3) |
| 2 · The Sleeper Corridor | gramophone **78.4** (78 rpm + fourth song) → WRONG STOP (Cyrillic sleeve) → BRAKE (rail fence) → **276** (boarding order: 7 between, 2 before 6) |
| 3 · The Dining Car | MIRROR → HUNGRY (perfect-square covers) → **385** (chits total $3.85) → AGAIN (Cyrillic ticket) |
| 4 · The Locomotive | CBEDA (scheduling, feed 2nd) → **1568** (78.4 × 2) → **340** (4:45 junction − 65 min) → **3528** (8253 reversed) → SOS whistle |

Every deduction and number-lock puzzle in the four scenarios not yet rebuilt
has a solver-verified unique solution, and their scheduling drills have
verified unique orders. Room transitions hold on a title card until the team
clicks ENTER.

## Scoring / ratings

Thresholds are shared; the titles are themed per scenario (e.g. Master
Navigator / Flight Commander / Master Galvanist / Polar Legend / Master of the
Line):

| Tier | Condition |
|------|-----------|
| 🏆 top | ≤ 30:00 total and ≤ 3 hints |
| 2nd | ≤ 40:00 total |
| 3rd | ≤ 50:00 total |
| 4th | over 50:00 but within the clock |
| overtime | finished after the clock ran out |

(Total = play time + hint/wrong-answer penalties.)

## Code layout / modifying

- **`index.html`** — the scenario-agnostic engine: shared styles, WebAudio
  synth (beds + one-shot library), canvas FX (mist/motes/fireflies/snow/embers,
  flares, film grain, title backdrops: rain/stars/snow/rails), and the game
  logic (hub, hotspots, the examine view and its camera, timer, beats, relay
  lamps, endings, GM panel). It also still carries the typed puzzle kinds
  (`text`/`dial`/`order`/`panel`…) for the scenarios not yet rebuilt.
- **`lib/locks.js`** — the locks you work with your hands: wheels, a compass
  pad, clock hands, levers, things pressed in order, a picture in pieces, a
  dial swept through static — plus what a clue can let you do to it (a lantern,
  a cut card you turn, something to play). Each keeps its working state, so a
  half-set lock is as you left it.
- **`lib/art.js`** — the drawing kit the rebuilt scenarios draw their props
  with: one drawing serves as the close-up (`ART.svg`) and as the object
  standing in the room (`ART.sprite`), plus a shared picture alphabet
  (`ART.glyph`) so a lock's wheel and the carving it matches are the same
  shape.
- **`lib/qr.js`** — a self-contained QR encoder (byte mode, ECC level M,
  versions 1-10) used for the join code. No CDN, and no QR *image API* either,
  which would have meant sending your game URL to a third party.
- **`lib/net.js`** — the multiplayer transport, with three tiers tried in
  order: **Firebase Realtime Database** (websocket push), then the bundled REST
  API, then single-screen play. Every call fails soft.
- **`lib/session.js`** — the session rules (join, sit, solve, hint, advance) as
  one pure module. It runs *inside a Firebase transaction* on the client and
  *inside the request handler* on the server, so both transports enforce
  identical rules. `normalizeRoom()` absorbs Realtime Database's habit of
  dropping empty objects and arrays.
- **`lib/store.js` / `api/*.js`** — the optional REST fallback. It never sees an
  answer or a hint; it only records that an object was solved and who is sitting
  where. Every input is shape-validated, nothing it returns is treated as
  markup, and sessions expire after 6 hours.
- **`dev-server.js`** — local static + API server for development and tests.
- **`scenarios/*.js`** — one file per scenario, self-registering via
  `registerScenario({...})`: metadata, title art, story, emojis, ratings,
  victory/game-over prose, ambience presets, ambient sound events, wrong-answer
  beats, four SVG scene builders, and the `rooms` array (puzzles, hints,
  hotspot coordinates in % of the 1600×900 stage). Chaining uses `hiddenUntil`
  (not in the room yet), `needs` (there, but dead until something else is
  open) and, in the older scenarios, `revealedBy`. A rebuilt scenario sets
  `classic:true` and gives each object its own `sprite`; see
  [PUZZLES.md](PUZZLES.md) for the shape of a clue and a lock.

Adding a sixth scenario = one new file in `scenarios/` plus one `<script>` tag
in `index.html`.
