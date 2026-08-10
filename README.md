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

**Difficulty (all five tuned for a crew of ~5):** no answer is readable from a
single object. Every puzzle combines two or three clue sources, hides its rule
until someone induces it, or carries enough workload that the crew should split
it up and compare notes.

**Distinct puzzle palettes.** The scenarios deliberately *don't* share solve
patterns — each has its own signature mechanics so playing a second scenario
feels fresh rather than repeating the first:

| Slot | Eldermoor | Prospero | Vorstag | Erebus | Midnight |
|------|-----------|----------|---------|--------|----------|
| Room-1 opener | letter-indexing | **acrostic** | **anagram** | **A1Z26** (№→letter) | **book cipher** (line·word) |
| Room-2 cipher | Caesar (shift 3) | **binary** (5-bit) | **Atbash** (mirror) | **Vigenère** (key ICE) | **rail fence** (zigzag) |
| Room-2 deduction | mastermind lamps | **logic-grid** rod seating | **Roman-numeral** weighing | **halving-chain** riddle | **boarding-order** logic |
| Room-3 filter | threshold (>) | **prime** counts | **odd** charges | **even** depths | **perfect-square** covers |
| Room-3 number lock | linked relations | **countdown sequence** | **factor riddle** (×48) | **multiples-of-three** | **money addition** |
| Co-op set piece | **simultaneity lock** (two winches) | — | — | — | — |
| Signal code | **morse** (its home turf) | **tap code** (knock pairs) | **pigpen** (masons' cipher) | **braille** (embossed dots) | **Cyrillic** (émigré's hand) |

Each scenario's two mid-game signal decodes use its own real-world code —
morse, prisoners' tap code, pigpen, braille, or phonetic Cyrillic — and teams
look the alphabet up themselves. The mechanics deliberately shared by all five
— because they're the game's signature co-op moments — are the two-stage
tuning **console** (the exact frequency comes from clues, then three trim
knobs are coaxed by watching the meter until the panel reads LOCKED IN), the
**scheduling-constraint** drill, the doubled/reversed **callbacks**, and the
SOS finale.

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
- Opening a puzzle "seats" you at it, so the team can see where everyone is.
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
| 1 · The Beach | SAIL → **8513** (winds N,E,S,W: hull rule + sail pairs) → EDIT (TIDE backward) → **54** |
| 2 · The Radio Station | tune **121.5** (day 121 + 5 sill gouges) → LOOK UNDER (morse) → STORM (Caesar 3) → **394** (lamp deduction) |
| 3 · The Jungle Path | two parallel threads: RIVER → DROWN (sides > moss), and **693** (algebra) → Gorge Gate = **simultaneity lock** (man both winches, then haul) |
| 4 · The Escape Raft | BDAEC (scheduling) → **2430** (121.5 × 2) → **510** (6:40 tide − 90 min) → **3158** (8513 reversed) → SOS flares |

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

Every deduction and number-lock puzzle above has a solver-verified unique
solution, and all five scheduling drills have verified unique orders. Room
transitions now hold on a title card until the team clicks ENTER.

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
  logic (hub, hotspots, modal, puzzle types `text`/`dial`/`signal`, timer,
  beats, relay lamps, endings, GM panel).
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
  / `revealedBy`; answers are normalized to A–Z0–9.

Adding a sixth scenario = one new file in `scenarios/` plus one `<script>` tag
in `index.html`.
