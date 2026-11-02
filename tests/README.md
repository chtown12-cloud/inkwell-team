# Tests

Two checks, both run straight from the repo with no build step.

```sh
node tests/audit.js                 # static: the puzzle standard, enforced
node dev-server.js &                # serves the game on :8787
node tests/playthrough.js           # live: all five scenarios, start to victory
node tests/playthrough.js vorstag   # …or just one
node tests/figures.js eldermoor     # live: the drawings, and the disc turned by hand
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

Both live suites solve the interaction puzzles the way a player must rather
than by driving state directly — they drag the order tags into place, hold the
lightning switch and let go on the number, tap the rack chips and turn the
ring — so they fail if the mechanic breaks, not just if the answer changes.
