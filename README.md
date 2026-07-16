# Escape the Night 🌙

Five browser-based virtual escape rooms for remote teams, built as point-and-click
adventures on one shared engine. One person shares their screen and drives;
everyone else collaborates over a video call. Pick a scenario on the first
screen, muster your crew (team name + emoji), and race the 45-minute clock.

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

The only mechanics deliberately shared by all five — because they're the
game's signature co-op moments — are the audible **morse** decodes (teams
look up the morse alphabet themselves), the tuning **dial**, the
**scheduling-constraint** drill, the doubled/reversed **callbacks**, and the
SOS finale.

## How to run it

Open `index.html` in any modern browser — **sound on, fullscreen recommended**.
No server, no build step; Google Fonts is the only CDN dependency, and a
`vercel.json` is included for static deployment. Deep-link a team straight to a
scenario with `?s=eldermoor`, `?s=prospero`, `?s=vorstag`, `?s=erebus`, or
`?s=midnight` — handy when multiple teams race different (or the same)
scenarios in separate tabs and compare the shareable score text afterward.

## Rules at a glance

- Countdown starts at **45:00**; the timer pulses red under 5 minutes.
- Up to 3 hints per puzzle, escalating: **+0:30, then +1:00, then +2:00**
  (the cost is shown on the button before you commit).
- Wrong answers cost **+0:05**.
- Time out → continue in overtime (rating capped) or restart.
- Victory screen: team emoji + name + finishing time, full stats, themed
  rating, and a copy-to-clipboard results block.

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
| 3 · The Jungle Path | RIVER → DROWN (sides > moss) → **693** (algebra) → LEAVE (lamp morse) |
| 4 · The Escape Raft | BDAEC (scheduling) → **2430** (121.5 × 2) → **510** (6:40 tide − 90 min) → **3158** (8513 reversed) → SOS flares |

## 🚀 Derelict: The Prospero

| Room | Answers |
|------|---------|
| 1 · The Cryo Bay | LOCKER (acrostic of pod logs) → **6942** (shutdown order: reactor/power/water/cryo) → RATS (STAR inside-out) → **34** (9 souls − 6 pods; 2 cores × 2) |
| 2 · The Bridge | tune **47.15** (Day 47 + 15 scratches) → SEAL VENTS (morse) → GAMMA (binary 5-bit) → **651** (rod-seating logic) |
| 3 · Hydroponics | VENT → STARVE (prime seed counts) → **642** (priming: 6, −2 each pump) → PURGE (airlock morse) |
| 4 · The Escape Pod Bay | EBDAC (scheduling, oxygen 3rd) → **9430** (47.15 × 2) → **435** (5:20 pass − 45 min) → **2496** (6942 reversed) → SOS thrusters |

## ⚡ Castle Vorstag

| Room | Answers |
|------|---------|
| 1 · The Gatehouse Court | WELL (anagram of L,W,L,E) → **9357** (seasons from spring: ⚘✠♜☾) → NOCTIS (NIGHT in the old tongue) → **56** (11 guests − 6 wolves; 3 dead candles × 2) |
| 2 · The Library | organ stop **119.3** (hymn CXIX + third verse) → STAY INSIDE (chime morse) → SPARK (Atbash mirror) → **763** (Roman weights VII·VI·III, heaviest first) |
| 3 · The Laboratory | LIGHTNING → RISEN (odd charges) → **624** (even digits, product 48) → ALIVE (dumbwaiter bell morse) |
| 4 · The Tower | EADCB (scheduling, capacitor 2nd) → **2386** (119.3 × 2) → **1040** (11:30 strike − 50 min) → **7539** (9357 reversed) → SOS lamp |

## ❄️ Station Erebus

| Room | Answers |
|------|---------|
| 1 · The Perimeter | GARAGE (A1Z26 channel №) → **6841** (resupply order: food/fuel/medical/flares) → SOUTH (riddle = NORTH, "we drilled the other way") → **73** (14 bunks − 7 rotated; 3 full drums) |
| 2 · Crew Quarters | tune **88.2** (day 88 + 2 radio checks) → MELT NOTHING (tape morse) → FROST (Vigenère, key ICE) → **842** (halving chain, Σ14) |
| 3 · The Ice Core Lab | ICE → BURIED (even depths) → **936** (multiples of 3: 9=3+6) → BELOW (intercom morse) |
| 4 · The Radio Tower | DEBAC (scheduling, plugs 2nd) → **1764** (88.2 × 2) → **530** (6:10 window − 40 min) → **1486** (6841 reversed) → SOS drum line |

## 🚂 The Midnight Special

| Room | Answers |
|------|---------|
| 1 · The Baggage Car | PORTER (book cipher, line·word) → **8253** (takings, first class → freight) → EMIT (TIME backward) → **49** (11 − 7 crates; 3 sacks × 3) |
| 2 · The Sleeper Corridor | gramophone **78.4** (78 rpm + fourth song) → WRONG STOP (run-out groove morse) → BRAKE (rail fence) → **276** (boarding order: 7 between, 2 before 6) |
| 3 · The Dining Car | MIRROR → HUNGRY (perfect-square covers) → **385** (chits total $3.85) → AGAIN (service bell morse) |
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
- **`scenarios/*.js`** — one file per scenario, self-registering via
  `registerScenario({...})`: metadata, title art, story, emojis, ratings,
  victory/game-over prose, ambience presets, ambient sound events, wrong-answer
  beats, four SVG scene builders, and the `rooms` array (puzzles, hints,
  hotspot coordinates in % of the 1600×900 stage). Chaining uses `hiddenUntil`
  / `revealedBy`; answers are normalized to A–Z0–9.

Adding a sixth scenario = one new file in `scenarios/` plus one `<script>` tag
in `index.html`.
