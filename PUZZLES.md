# How these puzzles are built

Written after a pass that threw out every puzzle in the game and rebuilt them.
The old ones worked — teams solved them — but they read wrong, in a way worth
naming so it doesn't creep back.

## What went wrong the first time

A lock in Room 1 of the shipwreck was engraved:

> NAME ME AS THE EBB WOULD SPEAK IT — BACKWARD.

Solve the riddle, get TIDE, type EDIT. The reversal isn't deduced, it's
*announced* — the designer reaching through the scenery to tell you what to
type. Four of the five scenarios carried the same instruction in a different
accent ("on this train it runs backward", "the sea returns all things
reversed"), and every scenario reversed a second code in Room 4 as well. The
same went for doubling: five different props each said "twice the band".

Underneath that, all five scenarios were one game in five costumes. Room 1 was
always *word-index → symbol-paired 4-digit code → riddle answered backward →
cross-reference sum*. Room 4 was always *order five tags → double a number →
subtract minutes from a timetable → reverse an old code*. Playing a second
scenario meant solving the first one again in different clothes.

## The rules now

**1. The rule lives in the world.** Every transformation is carried by a prop
that would plausibly carry it: a conversion table, a legend, a procedure card,
a signature block, a key stamped with its own cut. If the prop can't exist for
its own reasons, the puzzle is wrong.

**2. No prop ever states the method.** Nothing says "reverse this", "double
this", "take the third letter". A mirror reverses. A tide table read from the
bottom runs backward because that's how an ebb reads. A reciprocal gear doubles
because that's what the gear does. If the only way to know the method is to be
told it, there is no puzzle.

**3. The clue names its own referents.** A sum that needs "the number of
crates" says *crates*, and the crates are countable in one place. No clue
relies on the team agreeing what a phrase means — "how many of us the sea
spared" is a judgement call, not a deduction.

**4. You can tell when you're right.** The answer clicks: it spells a word, it
matches a label somewhere else, it completes a pattern, it lands on a value the
prop itself confirms. Answers that are only "a number you computed and must
trust" get reworked.

**5. One new idea per puzzle.** No stacking a cipher on an index on an
arithmetic step. If a puzzle needs three moves, two of them are familiar.

**6. The split is natural.** Half the crew is on a phone. Each puzzle
decomposes into parts people can claim out loud — "you read the manifest, I'll
count the drums" — rather than one person reading everything to everyone.

**7. Hints narrow, never leap.** Hint 1 says where to look and what to pair.
Hint 2 names the method. Hint 3 does the arithmetic and gives the answer.

**8. The fiction pays for the mechanic.** Morse belongs on a radio, braille on
a tag a blind-fingered engineer reads in the dark, a book cipher in a library.
A code is only worth using where that world would really use it.

## Keeping the five distinct

Each scenario owns its mechanics. The table below is the contract — adding a
mechanic to one scenario means checking it isn't already another's signature.

| Slot | Eldermoor (wreck) | Prospero (ship) | Vorstag (castle) | Erebus (ice) | Midnight (train) |
|---|---|---|---|---|---|
| R1 opener | tacked letters + davit list | phosphor burn-in down the pod plates | shield anagram + well-house plaque | flag channel numbers (A=1) | book cipher + the porter's own working |
| R1 code lock | compass rose + the sail's wind marks | evacuation shutdown order | seasons tapestry + well rim | resupply notice + drum glyphs | fare card + punch chart |
| R1 word lock | jetty posts + a rising tide | quarantine tag + contamination scale | canonical hours + the gatekeeper's card | polar signpost + re-keying notice | nightly seal register + tag date |
| R1 number | ship's articles: signatures vs marks | watch bill: duty vs relief | ledger: departed vs not | sitrep + winter-over sheet | waybill: crates short, sacks aboard |
| R2 tuning | band plan narrowed by the dial's range | beacon register, one marked SILENT | hymn board + psalter verse | sked card matched on its hours | diary: speed and track |
| R2 code | morse | tap code | pigpen | braille | Cyrillic |
| R2 second | Caesar disc, ring spun | 5-bit binary | Atbash | Vigenère | rail fence |
| R2 deduction | lamps per correct dial | rod seating logic | numeral weights | halving chain | boarding order |
| R3 filter | **threshold** — sides beat moss | **number property** — prime seed counts | **provenance** — the Baron's own wax | **date range** — drilled before the store failed | **cross-reference** — covers that settled |
| R3 number | linked packing relations | countdown sequence | even factors of 48 on named ways | multiples of three | money addition |
| R4 order | the boatbuilder's reasons | the flight officer's reasons | the Baron's reasons | the engineer's reasons | the fireman's reasons |
| R4 locks | shelf count · lead-line soundings | pod-type table · release sequence | fuse chart · counterweight chain | approach plate · bins vs stock card | builder's plate · consist order |
| Finale | flare morse | thruster panel | lightning hold | runway dial | whistle and lamp together |

The R3 filters are deliberately five different *kinds* of test, not five
different number properties. That was the old failure mode: prime, odd, even
and perfect-square are the same puzzle wearing four hats.

## Writing a replacement

The shape of one puzzle in a scenario file:

```js
{ id:'crate', icon:'📦', name:'Cargo Crate', pos:{...},
  desc:"what you see, including the clue material this object carries",
  puzzle:{
    type:'keypad', prompt:"Enter the 4-digit combination.", answers:['8513'],
    hints:["where to look", "what the method is", "the arithmetic and the answer"],
    solvedText:"what opens, and what it hands you next",
  }
}
```

`room.chain` documents the whole room's logic in one line and is shown to
players on the end card. It must match the puzzles exactly — it's the only
place the full solution is written down, so a stale chain is a bug.
