# Tests

Five checks, all run straight from the repo with no build step.

```sh
node tests/audit.js                 # static: the puzzle standard, enforced
node dev-server.js &                # serves the game on :8787
node tests/playthrough.js           # live: all five scenarios, start to victory
node tests/playthrough.js vorstag   # …or just one
node tests/locks.js                 # live: every lock worked wrong on purpose, every drawing measured
node tests/camera.js eldermoor      # live: the examine camera, at three window shapes
node tests/onescreen.js             # live: nothing scrolls, at three window shapes
```

**`audit.js`** loads the five scenario files and checks what PUZZLES.md can
check mechanically. For a scenario on the reset grammar that is: every lock
names where its answer comes from and it is never itself; every clue opens
something; nothing carries a prompt and no description holds the answer; each
lock is built so its own face can show its answer (enough wheels, a time that
can be set in five-minute steps, a start that is not already solved); three
hints, the third of which says the answer; every answer in the room's `chain`,
which players are shown on the end card; and — the one that matters most —
that the room can actually be finished, opening locks only from what is
visible and what has already come out of an open one. It prints that order for
every room. It also holds a scenario to no more than two of any kind of lock,
and all five to different shapes and different endings. Scenarios not yet
rebuilt are checked against the standard they were built under. It needs
nothing but node.

**`playthrough.js`** drives a real browser through every scenario from the
title to the score card. On the reset grammar it has no answer key: it reads
each lock's answer out of the scenario's own data and opens the lock by hand —
turning wheels, pressing the compass, swapping scraps, setting clock hands —
in the order the room allows, looking first at every object the lock says its
answer comes from. Along the way it checks that nothing hidden is in the room
early and nothing dead can be worked early, takes a wrong try and two hints on
the first lock to check the clock maths, and presses the scenario's own final
button. The four scenarios not yet rebuilt are still played from the table at
the top of the file. Needs Playwright and the dev server.

**`locks.js`** is the other half of that: each kind of lock worked *wrong*.
Wheels come back round; the face is a button too; a wrong try holds and costs
five seconds; a wrong run on the compass clears itself; a lock you walk away
from is as you left it; the tide clock holds one step either side of the span
it accepts; the picture does not open while it is still wrong; the dial does
not open for a sweep that only passes through. Then the tools — the lantern
shows nothing until you have it and goes where you point it, the cut card
turns and stays turned — and the drawings: every object is standing in the
room under its own ring, a lock drawn open looks different once it is, and
every close-up arrives big enough to read on the shared screen and on a phone
without running off the side. It runs on whichever scenarios are on the reset
grammar, from their own data.

**`camera.js`** drives every object in a scenario at three window shapes and
checks the geometry rather than the look: that leaning in never shows more of
the black behind the board than standing back does (the board is a contain-fit,
so it letterboxes by design — that is the bar, not full coverage), that the
spotlight lands on the object *after* clamping rather than where the camera was
aimed, that a small object is pushed in on harder than a big one, that nobody
who asked for less motion gets a camera move, and that a phone gets no camera
at all and keeps the card it already had.

**`onescreen.js`** opens every object in every scenario at three window shapes
— on the reset grammar, every *face* of every object: the lock as it is
worked, the same thing standing dead, and the lock open with what was inside
it — and checks that it fits inside the window, that neither the examine layer
nor the document scrolls, and that it never has to be shrunk to manage it. A
room of six reads what is on the screen and nobody scrolls a screen they are
not holding. It also checks the two cases that broke it in play: a puzzle with
all three hints revealed, which is the tallest a puzzle ever gets, and a story
beat raised mid-puzzle, which has to wait rather than land on top of the clue.
One check there is not about scrolling but about the same layer: two rooms
arriving together must leave one gate card, not a stack.

The live suites work the game the way a player must rather than by driving
state directly, so they fail if a mechanic breaks, not just if an answer
changes. One consequence worth knowing when writing a new check: a lock that
has genuinely been opened cannot be un-opened by deleting it from `S.solved`.
The session store puts the solve straight back on its next tick, as it should
— that is what keeps a refreshed screen and a late phone in step.
