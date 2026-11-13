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

Every scenario: 4 rooms, 10 to 17 locks, illustrated animated scenes (SVG parallax,
fog, snow, fireflies, film grain), discoverable glowing hotspots, an unseen
monster delivered through narrative beats, and a fully synthesized WebAudio
soundscape with a distinct signature per room (surf and gulls; reactor hum and
sonar pings; thunder and organ; blizzard and generator chug; rail clack and far
whistles). No image or audio files — everything is generated in the browser.

**How the puzzles work.** Every scenario is built the way a physical escape room is: locks that look like
locks, and whatever opens each one somewhere else in the room. A padlock with
four wheels ringed in four colours — and, along the hull, a net of glass
floats in the same four colours. A lift that wants five digits — written
twice in the cryo bay, frosted over on the pods and cracked across on a
terminal, and whole in neither place. Nothing is typed. Wheels are turned,
scraps swapped, clock hands set, breakers thrown, a lantern swept across dark
water, reactor rods raised, a burn held to the mark, a tune played on an organ,
an opera glass held up to a painted ceiling, new snow swept off a trail of boot
prints, a thermal camera held over a keypad, a junction's road set on a ground
frame; no lock carries
instructions, and no clue says which lock it belongs to. An open lock changes
the room, not just its own close-up. Expect to be properly stuck now and
then: a hint or two per room is normal.

The rules are written down in
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
| 1 · The Cryo Bay | locker **7385** (bolt, snowflake, trefoil, drop: each picture's pipe colour, then that colour's number on the crate) → terminal: **snowflake, medic, kettle, leaf, antenna, bulb, lift** (the one way through the evacuation plan) → lift **39567** (pods 1, 2, 3, 5, 6: top half of each digit on the terminal, bottom half on the pod) |
| 2 · The Bridge | log **ORBIT** (the five worn keys) → helm **crown, key, fish, snake** (the four ringed constellations, named from the chart) → comms **blue, yellow, red, blue, green, yellow** (the speaker's lamp) → chronometer **8:00** (star wheel turned to match the sky; read the pointer) → reactor rods **4, 2, 5, 1, 3** (red, yellow, green, blue, white, off the core scope) |
| 3 · Hydroponics | specimen case **vine, mushroom, branch, flower, leaf** (ranked by height) → seed vault **7234** (leaf 7, vine 2, mushroom 3, flower 4, from the weigh log) → manifold: bed 1 **yellow + blue**, bed 2 **red + yellow**, bed 3 **red + blue** (to mix the feed card's green, orange, purple) → airlock **3524** (the knocks in the vent) |
| 4 · The Escape Pod Bay | clamp release **up, right, down, up, left, down** (the tags, one to six) → tanks **white 5, orange 4, blue 2** (the three-engine row, matched by cap colour) → door timer **4:35** (station five marks out, bay clock at 11:35) → ignition: hold to **6.4** and let go |

## ⚡ Castle Vorstag

| Room | Answers |
|------|---------|
| 1 · The Gatehouse Court | well face **right, down, left, left, up, right** (the six gargoyles' gazes) → strongbox **crown, key, tower, raven** (what each row of the shield wall is missing) → keep door pins **3, 4, 1, 5, 2** (the raven key's teeth, tip first from the right-hand keyhole) |
| 2 · The Library | cabinet **CAGED** (the white pieces' columns) → organ pipes **2, 5, 1, 3, 4, 5, 2** counted from the left (the music box: short tooth, short pipe) → lectern **9376** (the missing volumes by ribbon: gold IX, red III, green VII, blue VI) → orrery **snake, crab, raven, beetle** (sun, moon, star, comet, through the opera glass) |
| 3 · The Laboratory | locker **6284** (the four gauges) → jars **green, yellow, purple, red, blue**, feather to anvil (the chalkboard's weighings) → dumbwaiter **blue, red, yellow, green** (the slab's clamps at head, heart, hand, foot) |
| 4 · The Tower | winch **anticlockwise, clockwise, still, anticlockwise, anticlockwise, clockwise** (sun, moon, star, bell, crown, key, off the gear train) → capacitor **4, 1, 3** (red, yellow, blue: the photograph is a negative) → great clock **8:05** (the church clock, the right way up) → rod: sweep to **73** |

## ❄️ Station Erebus

| Room | Answers |
|------|---------|
| 1 · The Perimeter | sign-out tags **hole, snowcat, antenna, drum** (zigzag, chevrons, bars, dots: sweep the new snow off the boot prints and follow each tread) → snowcat **2834** (the full drums, sunk in the snow, left to right) → storm door **4:30** (the mast's shadow halfway between 16 and 17) |
| 2 · Crew Quarters | foot locker **white, red, black, yellow** (fish, crab, penguin, bird: each player's two dice from the start, ladders and snakes taken) → generator room door **3, 8, 1, 6, 9** (the warm prints through the thermal camera, faintest first) → generator panel **red 5, yellow 2, green 4, blue 1** (the day tanks' fuel, glowing through the camera) |
| 3 · The Ice Core Lab | cold safe **187** (E-9's piece found in the core log, its red arrow pointing up) → airlock **diatom, beetle, amoeba** (wells one, two and three under the microscope, each sharp at its own turn of the knob) |
| 4 · The Radio Tower | flare box **250** (the sock streams toward 70; the wind comes from the other side) → runway: the T's **crossbar across the left (west) end, its stem along the middle row** |

## 🚂 The Midnight Special

| Room | Answers |
|------|---------|
| 1 · The Baggage Car | mail cage **blue, green, red, yellow** (the trunks in the order their stations come on the line: anchor, key, star, fish) → strongbox **4, 7, 5** (seats on the tickets punched with the Conductor's crescent: fish, anchor, star) → gangway ticket punched at **anchor, key, star, leaf, fish** (the crescent stops on the line) |
| 2 · The Sleeper Corridor | berth 13 card **2:35** (her ticket says leaf; the timetable's crescent column; anything from 2:25 wakes her in time) → gramophone up to **78** → call bells **12, 15, 11, 16, 14** (her record's five notes) |
| 3 · The Dining Car | till **295** (two soups, a fish, two pies, three teas) → spirits cabinet **NIGHT** (the cocktail card's bottles in pouring order: square, flask, stubby, long, slim) → vestibule clock **3:10** (the platform clock of the station that keeps going past) |
| 4 · The Locomotive | ground frame levers **1, 2, 4 and 5** pulled (the entry signal, both points over, the home signal: the road to the crown) → whistle and regulator together |

Room transitions hold on a title card until the team clicks ENTER.

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
  lamps, endings, GM panel).
- **`lib/locks.js`** — the locks you work with your hands: wheels, a compass
  pad, clock hands, levers, things pressed in order, a picture in pieces, a
  dial swept through static, rods and tanks, a keypad, a handle held against a
  gauge — plus what a clue can let you do to it (a lantern, a card or a wheel
  you turn, something to play, something to watch). Each keeps its working
  state, so a half-set lock is as you left it.
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
  API, then single-screen play. Every call fails soft. One rule holds on every
  tier: the session's state is never handed to the game from inside the call
  that changed it. Firebase would — it raises a page's own write back at it
  before the write returns — and the game being re-entered half way through a
  button press is how the shared screen once walked from room 1 into room 3.
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
