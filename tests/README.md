# Tests

Five checks, all run straight from the repo with no build step.

```sh
node tests/audit.js                 # static: the puzzle standard, enforced
node dev-server.js &                # serves the game on :8787
node tests/playthrough.js           # live: all five scenarios, start to victory
node tests/playthrough.js vorstag   # …or just one
node tests/figures.js eldermoor     # live: the drawings, and the disc turned by hand
node tests/camera.js eldermoor      # live: the examine camera, at three window shapes
node tests/onescreen.js             # live: nothing scrolls, at three window shapes
```

**`audit.js`** loads the five scenario files and checks what PUZZLES.md can
check mechanically: that no prop states its own method, that every puzzle has
a prompt, three hints and solved text, that `hiddenUntil` and `revealedBy`
point at objects in the same room, and that every answer appears in its room's
`chain` — the chain is shown to players on the end card, so a stale one is a
bug. It needs nothing but node.

**`playthrough.js`** drives a real browser through every puzzle in every
scenario in chain order, takes the wrong-answer and hint penalties on the
first puzzle to check the clock maths, presses each scenario's final button,
and confirms the score card. It needs Playwright and the dev server. The
answer key for all 85 puzzles is the table at the top of the file.

**`figures.js`** opens every object carrying a drawing at desktop and at phone
width and checks the drawing actually renders, stays inside the card, and
leaves room to reach the answer box. It also turns the cipher disc rather than
typing past it: the ring moves, the line decodes at one setting and nowhere
else, and a finger can work the nudge buttons.

**`camera.js`** drives every object in a scenario at three window shapes and
checks the geometry rather than the look: that leaning in never shows more of
the black behind the board than standing back does (the board is a contain-fit,
so it letterboxes by design — that is the bar, not full coverage), that the
spotlight lands on the object *after* clamping rather than where the camera was
aimed, that a small object is pushed in on harder than a big one, that nobody
who asked for less motion gets a camera move, and that a phone gets no camera
at all and keeps the card it already had.

**`onescreen.js`** opens every object in every scenario at three window shapes
and checks that the card fits inside the window, that neither the examine
layer nor the document scrolls, and that it never has to be shrunk to manage
it — a room of six reads what is on the screen and nobody scrolls a screen
they are not holding. It also checks the two cases that broke it in play: a
puzzle with all three hints revealed, which is the tallest a puzzle ever gets,
and a story beat raised mid-puzzle, which has to wait rather than land on top
of the clue. One check there is not about scrolling but about the same layer:
two rooms arriving together must leave one gate card, not a stack.

The live suites solve the interaction puzzles the way a player must rather
than by driving state directly — they drag the order tags into place, hold the
lightning switch and let go on the number, tap the rack chips and turn the
ring — so they fail if the mechanic breaks, not just if the answer changes.
