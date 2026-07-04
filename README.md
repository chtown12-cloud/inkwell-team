# The Wreck of the Eldermoor 🏝️

A browser-based virtual escape room for remote teams. One person shares their
screen and drives; everyone else collaborates over a video call. Four rooms,
17 puzzles, a 45-minute countdown, and something in the treeline that you
never quite see.

## How to run it

Open `index.html` in any modern browser. That's it — no server, no build step,
no dependencies except Google Fonts loaded from a CDN (the game still works
offline, just with fallback fonts).

Multiple teams can compete by opening the file in separate browser tabs or on
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
file to players.

## ROOM 1 — THE BEACH (easy)

**Chain:** Driftwood anagram → sail reveals symbol order → crate stencils give
combo → crate key stamped TIDE → box riddle → box holds chart → chart math →
path to radio station.

| # | Puzzle | Answer |
|---|--------|--------|
| 1 | Driftwood Planks (anagram of L,I,A,S) | **SAIL** |
| 2 | Cargo Crate (sail order ▲●■◆ × crate stencils ▲8 ●3 ■5 ◆1) | **8351** |
| 3 | Weatherproof Box (moon/shore riddle; brass key stamped TIDE) | **TIDE** |
| 4 | Chart Fragment (12−4 souls north, 7−5 crates east) | **82** |

Hints:
- P1: (1) Four letters, four planks — un-shuffle them. (2) Rearrange L,I,A,S into something no ship moves without. (3) It's SAIL.
- P2: (1) The shapes have numbers; you're missing the order. (2) The torn sail shows the same shapes in order — read the crate numbers that way. (3) ▲8 ●3 ■5 ◆1 → 8351.
- P3: (1) Something the ocean does on a schedule. (2) Twice a day, moon-commanded… check the brass key. (3) TIDE.
- P4: (1) Two small calculations, north and east. (2) 12−4 souls; 7−5 crates. (3) 8 north, 2 east → 82.

## ROOM 2 — THE RADIO STATION (medium)

**Chain:** Logbook ("Day 121, entry 5 — the band is where the day meets the
entry") → tune radio to 121.5 → broadcast is morse for UNDER → rug hides floor
hatch → Caesar plate (shift 3) → STORM → hatch reveals transmitter → punch-card
sequences → 1331.

| # | Puzzle | Answer |
|---|--------|--------|
| 1 | Radio Receiver (frequency from logbook) | **1215** (121.5) |
| 2 | The Broadcast (morse ··− −· −·· · ·−·) | **UNDER** |
| 3 | Floor Hatch (Caesar +3: WKH ZKHHO RSHQV WR VWRUP) | **STORM** |
| 4 | Emergency Transmitter (1,1,2,3,5,8,__ and 25,27,29,__) | **1331** |

Hints:
- P1: (1) The number hides in the logbook's last entry. (2) Day 121, entry 5 — put them together. (3) Tune 121.5 → 1215.
- P2: (1) The wall poster pairs every dot/dash pattern with a letter. (2) Five letters; ··− is U. (3) UNDER.
- P3: (1) Every letter has been marched forward. (2) Caesar shift 3 — walk each letter three steps back. (3) VWRUP → STORM.
- P4: (1) Two patterns, two digits each. (2) Fibonacci; then +2 each. (3) 13 and 31 → 1331.

## ROOM 3 — THE JUNGLE PATH (medium-hard)

**Chain:** Tree riddle → RIVER → crossing stones ordered by polygon side-count
spell DARK → ranger's pack pace-math → 639 → pack holds morse crib + lamp →
far lamp blinks morse → RUN → gate opens to rope bridge and the cove.

| # | Puzzle | Answer |
|---|--------|--------|
| 1 | Carved Tree (bed/mouth/runs riddle) | **RIVER** |
| 2 | River Stones (order by sides: ▲3=D ■4=A ⬟5=R ⬢6=K) | **DARK** |
| 3 | Ranger's Pack (6 north, half=3 east, sum=9 south) | **639** |
| 4 | Gorge Gate (lamp morse ·−· ··− −·) | **RUN** |

Hints:
- P1: (1) A feature of the island, not a creature. (2) It has a bed, a mouth, and runs — water. (3) RIVER.
- P2: (1) Count each shape's sides. (2) Step fewest→most sides: 3,4,5,6. (3) D-A-R-K.
- P3: (1) Turn the directions into digits in order. (2) Six; half of six; six plus three. (3) 639.
- P4: (1) The light blinks with purpose. (2) Morse, 3 letters; the pack's crib sheet helps; ·−· is R. (3) RUN.

## ROOM 4 — THE ESCAPE RAFT (hard, with callbacks)

**Chain:** Assembly-tag logic → B-D-A-E-C → flare locker recalls Room 2's
emergency band → 1215 → tide table (90 min before 6:40 high tide) → 5:10 →
winch tumblers recall Room 1's sail/crate shapes → 8351 → fire flares in SOS
(interactive short/long buttons) → LAUNCH → victory screen.

| # | Puzzle | Answer |
|---|--------|--------|
| 1 | Raft Materials (build-order logic tags) | **BDAEC** |
| 2 | Flare Locker (callback: Room 2 frequency) | **1215** |
| 3 | Tide Table (6:40 − 1:30) | **510** |
| 4 | Launch Winch (callback: Room 1 crate code) | **8351** |
| 5 | Signal Flares (fire in pattern, then Send) | **··· −−− ···** (SOS) |

Hints:
- P1: (1) One tag is "first of all," one has "nothing after" — both ends found. (2) Logs, deck, mast, rudder, sail. (3) BDAEC.
- P2: (1) "An operator never forgets the emergency band" — you tuned it. (2) The logbook frequency, Room 2. (3) 1215.
- P3: (1) Work backwards from high tide. (2) 90 minutes before 6:40. (3) 5:10 → 510.
- P4: (1) You've opened something with these shapes before. (2) Sail order + crate numbers, Room 1. (3) 8351.
- P5: (1) Three letters every sailor knows. (2) S = 3 shorts, O = 3 longs. (3) short×3, long×3, short×3.

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

All puzzles, hints, flavor text, and narrative beats live in the `ROOMS` array
in `index.html`, with comments explaining the chaining keys (`hiddenUntil`,
`revealedBy`) and answer normalization. Adding a room means appending to that
array and adding one CSS accent block.
