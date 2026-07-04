# The Wreck of the Eldermoor 🏝️

A browser-based virtual escape room for remote teams, built as a point-and-click
adventure. One person shares their screen and drives; everyone else collaborates
over a video call. Four rooms, 17 puzzles, a 45-minute countdown, and something
in the treeline that you never quite see.

Every room is a full illustrated, animated scene (layered SVG with mouse
parallax, drifting fog, fireflies, film grain, a storm-lashed title screen) with
discoverable glowing hotspots instead of menus. The soundscape is synthesized
live with the WebAudio API — ocean surf, wind, a low dread-drone that deepens
room by room, knocks on the station wall, morse code you can actually *hear*,
a radio dial you tune through static by ear, flares that streak up over the
cove, and a heartbeat when the clock drops under five minutes. No image or
audio files: everything is generated in the browser.

**Difficulty design (built for a crew of ~5):** no answer is readable from a
single object. Every puzzle either combines two or three separate clue sources,
hides its rule until someone induces it, or carries enough raw workload (morse
decoding, stone-by-stone checks, constraint deduction) that the crew should
split it up and compare notes. Expect several minutes of genuine argument per
puzzle in the later rooms.

## How to run it

Open `index.html` in any modern browser — **sound on, fullscreen recommended**.
No server, no build step, no dependencies except Google Fonts loaded from a CDN
(the game still works offline, just with fallback fonts). A `vercel.json` is
included so the repo deploys as a static site.

Multiple teams can compete by opening the game in separate browser tabs or on
separate machines and comparing the shareable score text at the end.

## Rules at a glance

- Countdown starts at **45:00**. Timer pulses red under 5 minutes.
- Each puzzle has up to **3 hints**, each costing **+30 seconds**.
- Wrong answers cost **+5 seconds**.
- If time runs out you can press on in overtime (rating capped) or restart.
- Final screen shows total time, hints, penalties, a rating, and a
  copy-to-clipboard result block for comparing over chat.

## Facilitator setup

On the **start screen only**, a small "🔑 Game Master" button in the bottom-right
corner opens the full answer key (every answer, chain, and hint). It disappears
the moment the game starts, so screen-share safely — just don't open it in
front of the players.

---

# GAME MASTER REFERENCE CARD

Screenshot this section (or the in-game Game Master panel) before handing the
game to players.

## ROOM 1 — THE BEACH (warm-up, multi-source)

**Chain:** Plank tally-strokes index into carved words → SAIL → sail pairs each
shape with a wind letter → hull keel plate: "READ THE WIND SUNWISE FROM NORTH"
(N,E,S,W) → crate digits in that order → crate holds mirror-stamped key TIDE →
box riddle answers TIDE, engraving says speak it backward → box holds chart →
chart cross-references hull muster, drift days, crate manifest.

| # | Puzzle | Answer | Logic |
|---|--------|--------|-------|
| 1 | Driftwood Planks | **SAIL** | CASTAWAY(3rd)=S, GALE(2nd)=A, ADRIFT(4th)=I, SALVAGE(3rd)=L |
| 2 | Cargo Crate | **8513** | Winds N,E,S,W (hull rule) → ▲8, ■5, ◆1, ●3 (sail pairs shapes↔winds) |
| 3 | Weatherproof Box | **EDIT** | Riddle = TIDE; "name me as the ebb would — backward" → EDIT |
| 4 | Chart Fragment | **54** | N: (12 souls − 4 struck) − 3 days adrift = 5; E: 2 unbroken crates × 2 = 4 |

## ROOM 2 — THE RADIO STATION (medium, listen + deduce)

**Chain:** Logbook ("the band is the day I stopped counting, then the point,
then the count of the knocks", last entry Day 121) + five gouges under the
window sill → tune 121.5 → broadcast is 10 letters of morse = LOOK UNDER →
rug hides hatch → Caesar plate with no stated shift (crack via WKH = THE,
shift 3) → STORM → transmitter calibration-lamp deduction → 394.

| # | Puzzle | Answer | Logic |
|---|--------|--------|-------|
| 1 | Radio Receiver | **121.5** | Day 121 (logbook) + point + 5 knocks (window gouges); sweep dial, LOCK IT IN |
| 2 | The Broadcast | **LOOK UNDER** | ·−·· −−− −−− −·− / ··− −· −·· · ·−· via the wall poster |
| 3 | Floor Hatch | **STORM** | WKH ZKHHO RSHQV WR: VWRUP — WKH=THE ⇒ shift 3 back |
| 4 | Emergency Transmitter | **394** | Mastermind-style: 123/456/925 one lit seated wrong, 612 dark, 839 two lit both wrong — unique solution 394 |

## ROOM 3 — THE JUNGLE PATH (medium-hard, divide the work)

**Chain:** Tree riddle = RIVER → eight stones, rule "sides must OUTNUMBER moss";
safe stones in crossing order spell DROWN → pack tag algebra = 693 → pack holds
morse crib + lamp → relay lamp blinks LEAVE → rope bridge.

| # | Puzzle | Answer | Logic |
|---|--------|--------|-------|
| 1 | Carved Tree | **RIVER** | Sings shallow, silent deep, grows with rain, swallows crews |
| 2 | River Crossing Stones | **DROWN** | Safe = sides > moss: D(5>2) R(6>1) O(4>2) W(5>3) N(6>4); B, E (3=3), A tip |
| 3 | Ranger's Pack | **693** | F=2L, M=F+L ⇒ M=3L; F+M+L=6L=18 ⇒ 6-9-3 |
| 4 | Gorge Gate | **LEAVE** | Lamp morse ·−·· · ·− ···− · |

## ROOM 4 — THE ESCAPE RAFT (hard, synthesis + callbacks)

**Chain:** Five tags with positional constraints → B-D-A-E-C → locker: "the
military listens at TWICE the band" = 121.5×2 → 2430 → tide table: only the
6:40/11 ft tide clears the 9-ft reef before dark, minus 90 min → 510 → winch:
"the sea returns all things reversed" → crate code 8513 backward → 3158 →
SOS flares → LAUNCH.

| # | Puzzle | Answer | Logic |
|---|--------|--------|-------|
| 1 | Raft Materials | **BDAEC** | D fixed 2nd; B<D ⇒ B 1st; one gap B→A ⇒ A 3rd; E not adjacent to D ⇒ E 4th; C after E ⇒ C 5th |
| 2 | Flare Locker | **2430** | Room 2 frequency 121.5 doubled = 243.0 (the real military UHF guard band) |
| 3 | Tide Table | **510** | 4:10 too shallow (8 ft), 9:55 after dark; 6:40 − 90 min = 5:10 |
| 4 | Launch Winch | **3158** | Crate code 8513 (Room 1) reversed |
| 5 | Signal Flares | **··· −−− ···** | Fire short×3, long×3, short×3, then SEND |

## Full hint text

Every puzzle has 3 progressive hints (+30 s each); the exact wording is in the
in-game Game Master panel (start screen → 🔑 Game Master), which renders the
live data, so it can never drift out of date. Use that panel as the canonical
cheat sheet.

## Scoring / ratings

| Rating | Condition |
|--------|-----------|
| 🏆 Master Navigator | ≤ 30:00 total and ≤ 3 hints |
| ⚓ Able Seafarer | ≤ 40:00 total |
| 🪢 Deck Hand | ≤ 50:00 total |
| 🛟 Barely Made It | over 50:00 but within the clock |
| 🌙 Rescued After Dark | finished in overtime |

(Total = play time + hint/wrong-answer penalties.)

## Modifying the game

`index.html` is organized into five commented sections: **AUDIO** (WebAudio
synth soundscape), **FX** (canvas particles + grain), **SCENES** (one SVG
builder per room), **DATA** (the `ROOMS` array — puzzles, hints, flavor text,
narrative beats, and hotspot coordinates in % of the 1600×900 stage), and
**ENGINE** (rendering, puzzle types, timer, endings). Chaining uses
`hiddenUntil` (object appears when that puzzle is solved) and `revealedBy`
(description upgrades when that puzzle is solved); answers are normalized to
A–Z0–9. Adding a room means a new entry in `ROOMS`, a scene builder in
`SCENES`, and an ambience preset.
