# How these puzzles are built

This is the third standard this game has had. The first two each fixed what
was wrong with the one before and each still produced puzzles nobody loved, so
the reasons are written down here along with the rules.

## What went wrong, three times

**First, the props told you what to do.** A lock on the beach was engraved
*NAME ME AS THE EBB WOULD SPEAK IT — BACKWARD.* Solve the riddle, get TIDE,
type EDIT. The reversal was not deduced, it was announced — the designer
reaching through the scenery.

**Second, it was one game in five costumes.** Every scenario's first room was
*word-index → 4-digit code → riddle → sum*, and every last room was *order
five tags → double a number → subtract minutes → reverse a code*.

**Third — after both of those were fixed — every puzzle was still a riddle
sealed inside one pop-up.** An inscription stated a rule made up for the
occasion (*a stone bears you only while its sides outnumber its moss*) and you
applied it to a picture in the same view, then typed what came out. There was
nothing to find and nothing to connect, and a rule that exists only because a
plaque says so feels arbitrary however fairly it is worded. Worse, it had no
difficulty dial: state the rule and the puzzle is a chore, leave it out and it
is a guess.

What all three have in common is that the puzzle lived in *text*. So now it
doesn't.

## The grammar

**1. A lock looks like a lock.** Its face shows the shape of its answer — four
wheels ringed in four colours, seven empty slots on a compass, two clock
hands, a row of levers — and nothing else. A lock never carries a prompt.

**2. The key is somewhere else.** No lock holds its own solution. Whatever
goes on the wheels is on another object in the room (`puzzle.from` names
which), and noticing that the two belong together *is* the puzzle.

**3. The match is something you can see.** Lock and clue share a signature:
the same four colours, the same six little pictures, the same number of slots.
No sentence says they go together.

**4. Almost no text.** A name and a line of description — what the thing is,
never what to do with it. Lettering on a prop is fine (a tag, a dial legend, a
number in the corner of a photograph). A table written out in prose is a
drawing that was never drawn.

**5. Obvious in hindsight.** Every solution is one sentence a player would say
out loud: *"the floats are the same colours as the rings — count them."* If
explaining it takes a paragraph, it is two puzzles or it is wrong.

**6. Harder by layering, never by hiding.** A later lock needs two steps: a
clue read through a second prop (a legend, a mirror, a cut card, a compass
rose that does not point up the page), or two clues that only mean something
together. The premise is never the hidden part.

**7. One answer you can defend.** If two readings of a clue are both
reasonable, either the clue is redrawn until only one is, or the lock takes
both. The tide clock on the cove winch opens for any time the sea is over the
reef, because any of them is right.

**8. No way round the clue.** If a sensible guess opens the lock without the
thing it is supposed to need, that thing is dead weight. (The first tide card
had one sea on it, and "high water" opened the winch without anybody looking
up. Now it has three, one for each moon.)

**9. Hands on.** Wheels are turned, arrows pressed, scraps swapped, hands set,
switches thrown, a dial swept, a lantern moved. Nothing is typed.

**10. Nothing is dead.** Every clue opens something. There are no red
herrings and no hotspots that are only scenery.

**11. Hints narrow, they do not leap.** The first says where to look, the
second says what connects to what, the third says the answer.

`tests/audit.js` enforces what it can of this: 2, 4, 10 and 11 outright, that
a room can actually be finished from what is in hand, and that every lock is
built so its own face can show its answer. The rest takes a person.

## What a room is made of

An object is either a **clue** or a **lock**.

A clue is a drawing (`figure`). Some let you do something to them: sweep a
light over them (`lens`), lay a cut card or a wheel on them and turn it
(`tool: turn`, by quarters or by any number of `steps`), turn them over
(`flip`), play them (`listen`), or stand and watch them run through
something — a lamp through its colours, a knocking through its counts
(`pulse`).

A lock is a `puzzle` of one of these kinds:

| kind | what your hands do | the answer is |
|---|---|---|
| `combo` | turn wheels of digits, letters, colours or pictures; each wheel can wear a marker | one face per wheel |
| `dirpad` | press N, E, S, W into a row of slots | a course |
| `clock` | set two hands, five minutes at a time | a time (or a span of times: `window`) |
| `toggle` | throw levers, or switches drawn into a picture | which are on |
| `press` | press keys, or parts of a picture, in order | a sequence |
| `tiles` | tap two pieces to swap them | the picture, whole |
| `tune` | sweep a dial until the meter peaks | found, not looked up |
| `levels` | set rods or tanks to a height, each under its own marker | one height per column |
| `keypad` | key in a number, then the tick | the number |
| `hold` | hold a handle while a gauge climbs, and let go | where you let go |
| `simul` | two people, two places, at once | everyone there |

What comes out of an open lock is its `inside`: another drawing, which is
then a clue for something else. Two more things shape the order of a room.
`hiddenUntil` keeps an object out of the room until a lock is open (the chart
is in the chest). `needs` leaves it standing there, visibly dead, until
something else has happened (the receiver before the breakers are thrown) —
which is better than hiding it whenever the player should be able to see what
they are working towards. `needs` can name several locks, and then the thing
that is waiting should say which of them are in: the ignition console in the
pod bay wears a lamp for each.

An open lock should change the room, not just its own close-up. A drawing is
given its own state (`solved`, `live`) and the state of any lock it `needs`
or says it `watches`, so the pod lets go of its clamps when the lever across
the bay is thrown. The one prop whose open state repaints something large at
the back of the room (the bay doors) is drawn `behind` the others.

### Drawn once, placed twice

Every object is drawn into the room itself (`sprite`) from the same drawing as
its close-up, so what you can see from across the beach is exactly what you
count when you lean in — the net has the same floats in the same places at
both sizes. The backdrops are only the place. `lib/art.js` is the kit:
`ART.svg` for a close-up, `ART.sprite` for the same thing in the room,
`ART.inset` to set one drawing inside another, `ART.glyph` for the shared
picture alphabet.

## Keeping the five distinct

Within a scenario no kind of lock appears more than twice (wheels of digits
and wheels of colours count as different kinds), and no two scenarios may have
the same shape lock-for-lock or end the same way. The audit checks both. What
it cannot check is that the *step* is different each time — counting, decoding
with a legend, tracing, reassembling, reading a mirror — so that is tabled
here, and a new puzzle is checked against the table before it is built.

### Eldermoor (the wreck)

| | lock | what you find | the step |
|---|---|---|---|
| R1 | crate — 4 digit wheels, ringed in colours | glass floats in a net | count by colour |
| | chest — 5 letter wheels | flags on the mast + a page from the signal book | decode with a legend |
| | chart — six scraps | (itself) | reassemble |
| | binnacle — compass pad, 7 slots | the chart's course, and its compass rose | follow a route on a map that is not north-up |
| R2 | breakers — 7 levers | a card of what the generator can carry + cables on the wall | trace a tangle |
| | receiver — a dial | (itself; dead until the breakers are in) | sweep and listen |
| | drawer — 5 letter wheels | the tape it prints + the code poster | decode sound |
| | hatch — a clock | the operator's day, drawn | match the picture, read the time |
| | transmitter — 4 colour wheels | a photograph taken in the window | read a reflection |
| R3 | pack — 6 picture tabs | two frames from a trail camera | spot the difference |
| | stones — press 5 of 8 | the lantern from the pack | light shows what is hidden |
| | gate box — 4 picture wheels | carvings on a tree + the cut card from the pack | lay a mask and turn it |
| | gate — two winches | (the crew) | be in two places at once |
| R4 | flare locker — 5 digit wheels | five photographs, numbered | put a story in order |
| | raft — five logs | the same photographs | match a silhouette |
| | winch — a tide clock | a tide card + the moon over the cove | pick the right curve, read a graph |
| | flares — short and long, 9 slots | a strip torn from the code chart | know what to say |

### Prospero (the ship)

| | lock | what you find | the step |
|---|---|---|---|
| R1 | locker — 4 digit wheels, each under a pictogram | a pipe run + the diamond on a cargo crate | chain two legends: picture to colour, colour to number |
| | terminal — nine keys, 7 presses, traced as you go | the evacuation plan | walk a maze by its landmarks |
| | lift — keypad, 5 digits | the terminal's cracked readout + the pods' frosted ones | put two halves together |
| R2 | log — 5 letter wheels | the captain's keyboard | read the wear |
| | helm — 4 picture wheels, numbered | the sky in the viewport + the star chart | name what you can see |
| | comms — colour keys, 6 presses | the speaker's lamp (dead until the helm answers) | watch, and repeat |
| | chronometer — a clock | the star wheel from the log + the viewport | turn a wheel until it matches the sky |
| | reactor — 5 rods under colour caps | the core scope (dead until comms is up) | read a round chart into a straight row |
| R3 | specimen case — 5 picture wheels, ranked | the specimen row | put in order by height |
| | seed vault — 4 digit wheels, each under a pictogram | the weigh log | solve the sums |
| | manifold — valves drawn into the pipework | the feed card from the case | mix colours, and watch the lines change |
| | airlock — keypad, 4 digits | whatever is in the vent | listen, and count |
| R4 | clamp release — a lever, 6 throws | the tags on the pod's four clamps | a numbered place is a direction |
| | fuel panel — 3 tanks under colour caps | the pod's engines + the fuelling table | find your row; go by colour, not by position |
| | door timer — a clock | the orbital screen + the bay clock | count the marks, add the hours |
| | ignition — a handle and a gauge | the burn card from the door timer | let go on the mark |

### The other three

Vorstag, Erebus and Midnight are being rebuilt on this grammar one at a
time. Until each one is, it is still built — and still audited — to the
standard before this one: the rule lives on a prop, no prop states the method,
and every answer is in the room's chain. Their mechanics, so that nothing
built for their successors repeats them by accident:

| Slot | Vorstag (castle) | Erebus (ice) | Midnight (train) |
|---|---|---|---|
| R1 opener | shield anagram + well-house plaque | flag channel numbers (A=1) | book cipher + the porter's own working |
| R1 code lock | seasons tapestry + well rim | resupply notice + drum glyphs | fare card + punch chart |
| R1 word lock | canonical hours + the gatekeeper's card | polar signpost + re-keying notice | nightly seal register + tag date |
| R1 number | ledger: departed vs not | sitrep + winter-over sheet | waybill: crates short, sacks aboard |
| R2 tuning | hymn board + psalter verse | sked card matched on its hours | diary: speed and track |
| R2 code | pigpen | braille | Cyrillic |
| R2 second | Atbash | Vigenère | rail fence |
| R2 deduction | numeral weights | halving chain | boarding order |
| R3 filter | **provenance** — the Baron's own wax | **date range** — drilled before the store failed | **cross-reference** — covers that settled |
| R3 number | even factors of 48 on named ways | multiples of three | money addition |
| R4 order | the Baron's reasons | the engineer's reasons | the fireman's reasons |
| R4 locks | fuse chart · counterweight chain | approach plate · bins vs stock card | builder's plate · consist order |
| Finale | lightning hold | runway dial | whistle and lamp together |

## Writing one

A clue and the lock it opens:

```js
{ id:'floats', icon:'🪢', name:'Net of Glass Floats', pos:POS.floats,
  desc:"A fishing net snagged along the hull, still heavy with the glass floats that held it up.",
  figure:ART.svg(netArt.w, netArt.h, netArt.body),                 // the close-up
  sprite:ART.sprite(POS.floats, netArt.w, netArt.h, netArt.body) } // the same drawing, in the room

{ id:'crate', icon:'📦', name:'Cargo Crate', pos:POS.crate,
  desc:"Iron-banded, salt-swollen, and still shut.",
  sprite:st => ART.sprite(POS.crate, 200, 150, crateBody(st.solved)),   // drawn open once it is
  puzzle:{ type:'combo', from:['floats'],
    wheels:[{mark:{color:'blue'}}, {mark:{color:'red'}}, {mark:{color:'white'}}, {mark:{color:'yellow'}}],
    answer:'2457',
    hints:["where to look", "what connects to what", "the answer"],
    solvedText:"what opens, in a line",
    inside:{ name:'From the signal book', figure:ART.svg(...) } } }     // the next clue
```

`room.chain` is the whole room in one sentence per lock, and is shown to
players on the end card. It is the only place the full solution is written
down, so it has to be true: the audit fails a room whose chain does not
contain every answer.
