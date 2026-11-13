/* ============================================================
   SCENARIO: THE MIDNIGHT SPECIAL (1927 ghost train)
   The overnight express stopped at a station that isn't on the
   line. The other passengers are gone. The Conductor still walks
   the corridor, punching tickets nobody bought. Get to the engine
   and make the junction before he reaches you.

   Built on the reset grammar (see PUZZLES.md): locks that look like locks,
   and whatever opens them somewhere else in the room. Each object carries
   its own art into the room as `sprite`; the backdrops below are only the
   place.
   ============================================================ */
(function(){
const SCENES={};

/* ---------- Room 1: The Baggage Car ---------- */
SCENES.baggage=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="mWall" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#241a12"/><stop offset="1" stop-color="#3a2a1a"/></linearGradient>
 <linearGradient id="mFloor" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#2c1f14"/><stop offset="1" stop-color="#170f08"/></linearGradient>
 <radialGradient id="mLamp"><stop offset="0" stop-color="#ffd98c" stop-opacity=".3"/><stop offset="1" stop-color="#ffd98c" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="640" fill="url(#mWall)"/>
${[0,1,2,3,4,5,6,7].map(i=>`<line x1="${i*210}" y1="0" x2="${i*210}" y2="640" stroke="#170f08" stroke-width="4" opacity=".6"/>`).join('')}
<rect y="640" width="1600" height="260" fill="url(#mFloor)"/>
${[0,1,2,3,4,5].map(i=>`<line x1="${i*300-100}" y1="640" x2="${i*340-200}" y2="900" stroke="#0d0805" stroke-width="5"/>`).join('')}
<!-- sliding door open on rushing night -->
<g>
  <rect x="80" y="150" width="290" height="430" fill="#05070d" stroke="#4a3520" stroke-width="12"/>
  ${[0,1,2,3,4].map(i=>`<line class="railstripe" x1="90" y1="${210+i*80}" x2="360" y2="${216+i*80}" stroke="#8f86a8" stroke-width="2" stroke-dasharray="40 80" opacity=".5"/>`).join('')}
  <circle class="tw" cx="150" cy="230" r="2.5" fill="#ffd98c"/>
  <circle class="tw" cx="300" cy="320" r="2" fill="#ffd98c" style="animation-delay:1.4s"/>
  <rect x="360" y="150" width="18" height="430" fill="#4a3520"/>
</g>
<!-- swinging oil lamp -->
<g class="lampswing">
  <line x1="800" y1="0" x2="800" y2="110" stroke="#170f08" stroke-width="6"/>
  <path d="M778 110 h44 l10 22 h-64z" fill="#5c4423"/>
  <circle class="flick" cx="800" cy="146" r="13" fill="#ffd98c"/>
  <circle cx="800" cy="146" r="90" fill="url(#mLamp)"/>
</g>
<!--SPRITES-->
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-baggage" cx="230" cy="210" r="6" fill="#ffd98c" opacity=".12"/>
<circle cx="230" cy="210" r="20" fill="#ffd98c" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-baggage" class="surge" cx="240" cy="430" rx="96" ry="70" fill="#ffb45e" opacity="0"/>
<!-- embers off the stack, blown back past the open door -->
<circle class="emberfly" cx="330" cy="520" r="2.6" fill="#ffb45e" opacity=".8" style="animation-delay:1s"/>
<circle class="emberfly" cx="300" cy="560" r="2" fill="#ff9b4e" opacity=".7" style="animation-delay:5s"/>
<circle class="emberfly" cx="352" cy="500" r="2.2" fill="#ffd08a" opacity=".6" style="animation-delay:9s"/>
<circle class="emberfly" cx="316" cy="540" r="2.4" fill="#ffd08a" opacity=".65" style="animation-delay:13s"/>
<circle class="emberfly" cx="344" cy="574" r="1.8" fill="#ff8a3e" opacity=".55" style="animation-delay:17s"/>
<!-- cobwebs in the corners of a van nobody has opened in years -->
<g opacity=".14" class="sway" style="transform-origin:1600px 0"><path d="M1600 24 q-74 32 -110 92 M1600 88 q-64 6 -110 26" stroke="#d9cba6" stroke-width="2" fill="none"/></g>
<g opacity=".1" class="sway" style="animation-delay:2.4s;transform-origin:0 0"><path d="M0 20 q56 24 84 74" stroke="#d9cba6" stroke-width="2" fill="none"/></g>
<circle class="sparkle" cx="560" cy="60" r="2" fill="#d9cba6" style="animation-delay:0.0s"/><circle class="sparkle" cx="690" cy="103" r="2" fill="#d9cba6" style="animation-delay:0.9s"/><circle class="sparkle" cx="820" cy="86" r="2" fill="#d9cba6" style="animation-delay:1.8s"/><circle class="sparkle" cx="950" cy="69" r="2" fill="#d9cba6" style="animation-delay:2.7s"/><circle class="sparkle" cx="1080" cy="112" r="2" fill="#d9cba6" style="animation-delay:3.6s"/><circle class="sparkle" cx="1210" cy="95" r="2" fill="#d9cba6" style="animation-delay:4.5s"/><circle class="sparkle" cx="1340" cy="78" r="2" fill="#d9cba6" style="animation-delay:0.40000000000000036s"/></g>
</svg>`;

/* ---------- Room 2: The Sleeper Corridor ---------- */
SCENES.sleeper=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="mS" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#2a1d12"/><stop offset="1" stop-color="#40301c"/></linearGradient>
 <linearGradient id="mCarpet" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#5c2430"/><stop offset="1" stop-color="#3a1620"/></linearGradient>
</defs>
<rect width="1600" height="640" fill="url(#mS)"/>
<!-- corridor perspective: cabin doors left, windows right -->
${[0,1,2,3].map(i=>`<g>
  <rect x="${120+i*330}" y="220" width="150" height="380" rx="6" fill="#3a2a16" stroke="#241a0c" stroke-width="6"/>
  <circle cx="${252+i*330}" cy="420" r="7" fill="#c9a04a"/>
  <rect x="${150+i*330}" y="250" width="90" height="60" rx="4" fill="#d9cba6"/>
  <text x="${195+i*330}" y="288" text-anchor="middle" font-family="Special Elite" font-size="22" fill="#3a2d1c">${[10,11,12,14][i]}</text>
</g>`).join('')}
<!-- window strip along the top with passing lights -->
<g>
  <rect x="0" y="60" width="1600" height="120" fill="#05070d" stroke="#241a0c" stroke-width="8"/>
  ${[0,1,2,3,4,5,6,7].map(i=>`<line class="railstripe" x1="${i*210}" y1="${90+(i%3)*24}" x2="${i*210+140}" y2="${92+(i%3)*24}" stroke="#8f86a8" stroke-width="2" stroke-dasharray="30 90" opacity=".45"/>`).join('')}
  <circle class="tw" cx="380" cy="100" r="2.5" fill="#ffd98c"/>
  <circle class="tw" cx="1180" cy="130" r="2" fill="#ffd98c" style="animation-delay:1.2s"/>
  ${[0,1,2,3,4,5,6].map(i=>`<line x1="${230+i*230}" y1="60" x2="${230+i*230}" y2="180" stroke="#241a0c" stroke-width="7"/>`).join('')}
</g>
<!-- runner carpet -->
<rect y="640" width="1600" height="260" fill="#2c1f14"/>
<path d="M200 640 L1400 640 L1560 900 L40 900z" fill="url(#mCarpet)"/>
<path d="M240 660 L1360 660 M300 700 L1300 700" stroke="#c9a04a" stroke-width="3" opacity=".4"/>
<!--SPRITES-->
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-sleeper" cx="230" cy="210" r="6" fill="#ffd98c" opacity=".12"/>
<circle cx="230" cy="210" r="20" fill="#ffd98c" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-sleeper" class="surge" cx="270" cy="430" rx="96" ry="70" fill="#ffb45e" opacity="0"/>
<!-- telegraph poles and treeline going past the windows -->
<rect class="rushpast" x="100" y="70" width="6" height="104" fill="#39435a" opacity=".5" style="animation-delay:0.0s;animation-duration:3.4s"/><rect class="rushpast" x="280" y="70" width="6" height="104" fill="#39435a" opacity=".5" style="animation-delay:0.8s;animation-duration:4.3s"/><rect class="rushpast" x="460" y="70" width="6" height="104" fill="#39435a" opacity=".5" style="animation-delay:1.6s;animation-duration:5.2s"/><rect class="rushpast" x="640" y="70" width="6" height="104" fill="#39435a" opacity=".5" style="animation-delay:2.4000000000000004s;animation-duration:3.4s"/><rect class="rushpast" x="820" y="70" width="6" height="104" fill="#39435a" opacity=".5" style="animation-delay:3.2s;animation-duration:4.3s"/><rect class="rushpast" x="1000" y="70" width="6" height="104" fill="#39435a" opacity=".5" style="animation-delay:4.0s;animation-duration:5.2s"/><rect class="rushpast" x="1180" y="70" width="6" height="104" fill="#39435a" opacity=".5" style="animation-delay:4.800000000000001s;animation-duration:3.4s"/>
<path class="rushpast" d="M140 172 l16 -36 l16 36z" fill="#263a34" opacity=".5" style="animation-delay:0.0s;animation-duration:4s"/><path class="rushpast" d="M370 172 l16 -36 l16 36z" fill="#263a34" opacity=".5" style="animation-delay:1.2s;animation-duration:5s"/><path class="rushpast" d="M600 172 l16 -36 l16 36z" fill="#263a34" opacity=".5" style="animation-delay:2.4s;animation-duration:4s"/><path class="rushpast" d="M830 172 l16 -36 l16 36z" fill="#263a34" opacity=".5" style="animation-delay:3.5999999999999996s;animation-duration:5s"/><path class="rushpast" d="M1060 172 l16 -36 l16 36z" fill="#263a34" opacity=".5" style="animation-delay:4.8s;animation-duration:4s"/><path class="rushpast" d="M1290 172 l16 -36 l16 36z" fill="#263a34" opacity=".5" style="animation-delay:0.0s;animation-duration:5s"/>
<circle cx="1300" cy="104" r="22" fill="#f0e6c8" opacity=".2"/>
<!-- the corridor curtains never quite settle -->
<g class="sway" style="transform-origin:60px 300px"><path d="M40 300 q22 90 6 190 l-30 0 q16 -100 -4 -190z" fill="#3a1620" opacity=".5"/></g></g>
</svg>`;

/* ---------- Room 3: The Dining Car ---------- */
SCENES.dining=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="mD" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#2a1a14"/><stop offset="1" stop-color="#442c1c"/></linearGradient>
 <radialGradient id="mGlow"><stop offset="0" stop-color="#ffd98c" stop-opacity=".22"/><stop offset="1" stop-color="#ffd98c" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="640" fill="url(#mD)"/>
<rect y="640" width="1600" height="260" fill="#20140c"/>
${[0,1,2,3,4,5].map(i=>`<line x1="${i*300-80}" y1="640" x2="${i*340-180}" y2="900" stroke="#0d0805" stroke-width="5"/>`).join('')}
<!-- windows with night and speed lines -->
${[0,1,2].map(i=>`<g>
  <rect x="${140+i*520}" y="120" width="300" height="160" rx="10" fill="#05070d" stroke="#241a0c" stroke-width="9"/>
  <line class="railstripe" x1="${150+i*520}" y1="${170+(i%2)*40}" x2="${430+i*520}" y2="${174+(i%2)*40}" stroke="#8f86a8" stroke-width="2" stroke-dasharray="36 90" opacity=".5"/>
  <circle class="tw" cx="${240+i*520}" cy="${160+(i%2)*60}" r="2" fill="#ffd98c" style="animation-delay:${i*.9}s"/>
</g>`).join('')}
<!-- swaying chandeliers -->
${[420,880,1340].map((x,i)=>`<g class="lampswing" style="animation-delay:${i*.7}s">
  <line x1="${x}" y1="0" x2="${x}" y2="70" stroke="#170f08" stroke-width="5"/>
  <path d="M${x-30} 70 h60 l8 18 h-76z" fill="#5c4423"/>
  ${[-18,0,18].map(dx=>`<path class="flame" d="M${x+dx} 64 q-4 -10 0 -16 q4 8 0 16z" fill="#ffd98c"/>`).join('')}
  <circle cx="${x}" cy="80" r="80" fill="url(#mGlow)"/>
</g>`).join('')}
<!-- the bar and its mirror -->
<g id="art-menu">
  <rect x="1180" y="300" width="360 " height="120" rx="8" fill="#0d0805" stroke="#5c4423" stroke-width="6"/>
  <rect x="1200" y="316" width="320" height="88" fill="#1c2430" opacity=".9"/>
  <path d="M1220 330 l60 60 M1260 324 l80 78" stroke="#8f9cb0" stroke-width="3" opacity=".4"/>
  <rect x="1180" y="430" width="360" height="26" fill="#5c4423"/>
  ${[0,1,2].map(i=>`<g><path d="M${1240+i*90} 430 v-26 q0 -10 10 -10 q10 0 10 10 v26z" fill="#3a2416" opacity=".9"/></g>`).join('')}
</g>
<!-- dining tables with settings -->
<g id="el-tables">
${[[300,640],[640,640],[980,660]].map(([x,y],t)=>`<g>
  <rect x="${x-120}" y="${y-90}" width="240" height="16" fill="#5c4423"/>
  <path d="M${x-120} ${y-74} l 240 0 20 60 -280 0z" fill="#e8e0cf" opacity=".92"/>
  <rect x="${x-8}" y="${y-160}" width="16" height="70" fill="#3a2a16"/>
  ${[-70,0,70].map((dx,i)=>`<g><circle cx="${x+dx}" cy="${y-34}" r="17" fill="#d9cba6"/>
   <line x1="${x+dx-26}" y1="${y-48}" x2="${x+dx-26}" y2="${y-20}" stroke="#8a8a8a" stroke-width="3"/>
   <line x1="${x+dx+26}" y1="${y-48}" x2="${x+dx+26}" y2="${y-20}" stroke="#8a8a8a" stroke-width="3"/></g>`).join('')}
  <ellipse class="steam" cx="${x}" cy="${y-52}" rx="22" ry="8" fill="#ffe9c9" opacity=".2" style="animation-delay:${t*1.7}s"/>
  <ellipse class="steam" cx="${x-70}" cy="${y-52}" rx="15" ry="6" fill="#ffe9c9" opacity=".15" style="animation-delay:${t*1.7+2.4}s"/>
  <ellipse class="steam" cx="${x+70}" cy="${y-52}" rx="15" ry="6" fill="#ffe9c9" opacity=".14" style="animation-delay:${t*1.7+4.1}s"/>
</g>`).join('')}
</g>
<!--SPRITES-->
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-dining" cx="420" cy="210" r="6" fill="#ffd98c" opacity=".12"/>
<circle cx="420" cy="210" r="20" fill="#ffd98c" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-dining" class="surge" cx="1220" cy="710" rx="96" ry="70" fill="#ffb45e" opacity="0"/>
<!-- dust turning over in the chandelier light -->
<circle class="sparkle" cx="386" cy="74" r="2.4" fill="#ffe9c9" style="animation-delay:0.0s"/><circle class="sparkle" cx="450" cy="97" r="2.4" fill="#ffe9c9" style="animation-delay:0.8s"/><circle class="sparkle" cx="840" cy="120" r="2.4" fill="#ffe9c9" style="animation-delay:1.6s"/><circle class="sparkle" cx="906" cy="89" r="2.4" fill="#ffe9c9" style="animation-delay:2.4000000000000004s"/><circle class="sparkle" cx="1310" cy="112" r="2.4" fill="#ffe9c9" style="animation-delay:3.2s"/><circle class="sparkle" cx="1374" cy="81" r="2.4" fill="#ffe9c9" style="animation-delay:4.0s"/><circle class="sparkle" cx="424" cy="104" r="2.4" fill="#ffe9c9" style="animation-delay:4.800000000000001s"/><circle class="sparkle" cx="940" cy="127" r="2.4" fill="#ffe9c9" style="animation-delay:0.6000000000000005s"/>
<!-- a moth that has found the only warm thing on this train -->
<ellipse class="batfly" cx="300" cy="112" rx="6" ry="3.4" fill="#d9cba6" opacity=".45"/>
<ellipse class="batfly" cx="300" cy="132" rx="4.6" ry="2.6" fill="#d9cba6" opacity=".32" style="animation-delay:6s"/>
<g class="sway" style="transform-origin:1560px 200px"><path d="M1544 200 q20 80 6 168 l-26 0 q14 -88 -4 -168z" fill="#3a1620" opacity=".45"/></g></g>
</svg>`;

/* ---------- Room 4: The Locomotive ---------- */
SCENES.locomotive=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="mL" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#1a120c"/><stop offset="1" stop-color="#2c1c10"/></linearGradient>
 <radialGradient id="mFire"><stop offset="0" stop-color="#ff9a3a" stop-opacity=".55"/><stop offset="1" stop-color="#ff9a3a" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#mL)"/>
<!-- cab front window: converging rails in the dark -->
<g>
  <rect x="540" y="80" width="520" height="300" rx="14" fill="#05070d" stroke="#3a2a16" stroke-width="12"/>
  <path d="M700 380 L790 120 M900 380 L810 120" stroke="#5c6478" stroke-width="4"/>
  ${[0,1,2,3,4].map(i=>{const t=i/5;const y=370-t*230;const w=(1-t)*170+16;return `<line class="railstripe" x1="${800-w/2}" y1="${y}" x2="${800+w/2}" y2="${y}" stroke="#46506a" stroke-width="${4-t*2.4}" stroke-dasharray="20 30"/>`;}).join('')}
  <circle class="slowblink" cx="800" cy="130" r="5" fill="#8a2418"/>
  <ellipse class="steam" cx="640" cy="180" rx="30" ry="14" fill="#8f86a8" opacity=".25"/>
  <ellipse class="steam" cx="960" cy="200" rx="26" ry="12" fill="#8f86a8" opacity=".2" style="animation-delay:2s"/>
</g>
<!-- firebox -->
<g id="art-firebox">
  <rect x="620" y="560" width="360 " height="280" rx="16" fill="#2c1c10" stroke="#170f08" stroke-width="8"/>
  <circle cx="800" cy="700" r="150" fill="url(#mFire)"/>
  <path d="M680 620 h240 v160 h-240z" fill="#0d0805"/>
  <path class="flame" d="M720 780 q-16 -70 24 -100 q8 40 34 50 q-8 -60 30 -86 q6 66 34 88 q18 20 8 48z" fill="#ff9a3a"/>
  <path class="flame" d="M750 780 q-6 -40 18 -62 q14 34 6 62z" fill="#ffd98c" style="animation-delay:.18s"/>
  ${[0,1].map(i=>`<line x1="${700+i*200}" y1="620" x2="${700+i*200}" y2="780" stroke="#170f08" stroke-width="10"/>`).join('')}
</g>
<!-- gauge cluster -->
<g>
  ${[0,1,2].map(i=>`<g><circle cx="${300+i*110}" cy="${240+(i%2)*20}" r="42" fill="#241a0c" stroke="#c9a04a" stroke-width="5"/>
   <line class="flick" x1="${300+i*110}" y1="${240+(i%2)*20}" x2="${328+i*110}" y2="${216+(i%2)*20}" stroke="#e0cfa2" stroke-width="4" style="animation-delay:${i*.4}s"/></g>`).join('')}
</g>
<!--SPRITES-->
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-locomotive" cx="230" cy="210" r="6" fill="#ffd98c" opacity=".12"/>
<circle cx="230" cy="210" r="20" fill="#ffd98c" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-locomotive" class="surge" cx="850" cy="430" rx="96" ry="70" fill="#ffb45e" opacity="0"/>
<!-- the firebox throwing its own weather -->
<circle class="emberfly" cx="820" cy="660" r="3" fill="#ffb45e" opacity=".85" style="animation-delay:.5s"/>
<circle class="emberfly" cx="880" cy="680" r="2.4" fill="#ff9b4e" opacity=".75" style="animation-delay:3s"/>
<circle class="emberfly" cx="760" cy="640" r="2.6" fill="#ffd08a" opacity=".7" style="animation-delay:6.5s"/>
<circle class="emberfly" cx="920" cy="700" r="2" fill="#ff8a3e" opacity=".65" style="animation-delay:9.5s"/>
<circle class="emberfly" cx="860" cy="620" r="2.2" fill="#ffd08a" opacity=".6" style="animation-delay:12.5s"/>
<!-- steam blowing back across the front window -->
<ellipse class="steam" cx="620" cy="300" rx="46" ry="14" fill="#cfd8e8" opacity=".08"/>
<ellipse class="steam" cx="980" cy="320" rx="38" ry="12" fill="#cfd8e8" opacity=".07" style="animation-delay:3.5s"/>

<g class="lampswing" style="transform-origin:200px 0"><line x1="200" y1="0" x2="200" y2="74" stroke="#170f08" stroke-width="4"/>
  <circle class="flick" cx="200" cy="88" r="11" fill="#ffd98c" opacity=".6"/>
  <circle cx="200" cy="88" r="54" fill="#ffd98c" opacity=".06"/></g>
<circle class="emberfly" cx="700" cy="640" r="2.2" fill="#ffb45e" opacity=".7" style="animation-delay:15s"/>
<ellipse class="steam" cx="400" cy="150" rx="46" ry="14" fill="#cfd8e8" opacity=".07"/>
<circle class="sparkle" cx="560" cy="40" r="2.2" fill="#c9a878" style="animation-delay:0.0s"/><circle class="sparkle" cx="700" cy="71" r="2.2" fill="#c9a878" style="animation-delay:0.9s"/><circle class="sparkle" cx="840" cy="102" r="2.2" fill="#c9a878" style="animation-delay:1.8s"/><circle class="sparkle" cx="980" cy="63" r="2.2" fill="#c9a878" style="animation-delay:2.7s"/><circle class="sparkle" cx="1120" cy="94" r="2.2" fill="#c9a878" style="animation-delay:3.6s"/><circle class="sparkle" cx="1260" cy="55" r="2.2" fill="#c9a878" style="animation-delay:4.5s"/><circle class="sparkle" cx="1400" cy="86" r="2.2" fill="#c9a878" style="animation-delay:0.40000000000000036s"/></g>
</svg>`;

const WRONG_BEATS=[
  "From the far end of the corridor: the crisp, unhurried CLICK of a ticket punch. One seat closer than last time.",
  "The gas lamps dim in sequence, front of the car to back — the way they do when someone walks past them.",
  "In the window's reflection, for half a heartbeat, every seat in the car is occupied. Then they're not.",
  "The train slows — almost stops — then hauls forward again, as though something climbed aboard.",
  "A voice two cars back, muffled and courteous: “Tickets, please.” Nobody answers it anymore."
];
const WRONG_SOUNDS=['clank','hiss','knock','clank','bell'];

/* ============================================================
   THE DRAWINGS, AND THE ROOMS THEY STAND IN

   Every prop is drawn once and used twice: large in the close-up, and small
   standing in the room, so what you can see from across the car is exactly
   what you read when you lean in.
   ============================================================ */
const C = ART.COL, I = ART.INK, W = ART.words, GL = ART.glyph;

/* ============================================================
   ROOM 1 — THE BAGGAGE CAR
   The line is framed on the wall, station by station, and wherever
   the Midnight Special stops it carries the train's crescent. Four
   trunks wait to be put off, each labelled for its station; the mail
   cage wants their straps in the order they leave the train. Inside
   are the night's collected tickets, and only some of them carry the
   Conductor's own punch. The gangway out wants a ticket punched for
   every stop.
   ============================================================ */
const M = { wall: '#241a12', wood: '#4a3520', woodDark: '#2c1c0e', woodLip: '#6a4a2a', brass: '#c9a04a', brassDark: '#7d6126',
            paper: '#d9cba6', paperDark: '#b9a57c', ink: '#2c1c0e', night: '#05070d', lamp: '#ffd98c', red: '#7a2a1a', iron: '#3a3430' };

/* ---- the line: ten stations from the terminus to the junction ---- */
const LINE = ['crown', 'anchor', 'bell', 'key', 'tower', 'star', 'mountain', 'leaf', 'fish', 'flag'];
const STOPS = ['anchor', 'key', 'star', 'leaf', 'fish'];               // where the Midnight Special stops
const LINE_AT = [[56, 254], [118, 186], [184, 128], [258, 150], [314, 222], [382, 252], [446, 204], [488, 132], [540, 168], [566, 246]];
// a disc with a second disc of the same size, shifted right, taken out of it: the horns point right
const crescent = (x, y, r, fill) => { const hx = (x + r * 0.3).toFixed(1), t = (y - r * 0.954).toFixed(1), b = (y + r * 0.954).toFixed(1);
  return `<path d="M${hx} ${t}A${r} ${r} 0 1 0 ${hx} ${b}A${r} ${r} 0 0 1 ${hx} ${t}Z" fill="${fill}"/>`; };
const roundel = (name, x, y, r = 22) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${M.paper}" stroke="${M.ink}" stroke-width="4"/>` + GL(name, x - r * 0.62, y - r * 0.62, r * 1.24, M.ink);
const mapArt = { w: 600, h: 360, body: (() => {
  let b = `<rect width="600" height="360" fill="${M.woodDark}"/><rect x="12" y="12" width="576" height="336" fill="${M.paper}"/>`
    + `<rect x="22" y="22" width="556" height="316" fill="none" stroke="${M.paperDark}" stroke-width="2"/>`;
  // the line, and at its far end the junction, forking
  b += `<path d="M${LINE_AT.map(p => p.join(' ')).join('L')}" stroke="${M.ink}" stroke-width="9" fill="none" stroke-linejoin="round"/>`
    + `<path d="M566 246L582 218M566 246L582 276" stroke="${M.ink}" stroke-width="9" fill="none" stroke-linecap="round"/>`;
  LINE.forEach((s, i) => {
    const [x, y] = LINE_AT[i];
    b += roundel(s, x, y);
    if (STOPS.includes(s)) b += crescent(x + 26, y - 30, 11, M.brassDark);
  });
  // the key in the corner: the crescent is the Midnight Special
  b += crescent(470, 304, 12, M.brassDark) + `<path d="M490 304H516" stroke="${M.ink}" stroke-width="3"/>`
    + `<rect x="522" y="292" width="40" height="22" rx="4" fill="${M.ink}"/><circle cx="530" cy="318" r="4" fill="${M.ink}"/><circle cx="554" cy="318" r="4" fill="${M.ink}"/><rect x="546" y="284" width="8" height="10" fill="${M.ink}"/>`;
  return b;
})() };

/* ---- the trunks, each strapped in its colour and labelled for its station ---- */
const TRUNKS = [['red', 'star'], ['yellow', 'fish'], ['blue', 'anchor'], ['green', 'key']];      // as they stand, left to right
const DROP = TRUNKS.slice().sort((a, b) => LINE.indexOf(a[1]) - LINE.indexOf(b[1])).map(t => t[0]);
const trunksArt = { w: 880, h: 300, body: (() => {
  let b = '';
  TRUNKS.forEach(([col, to], i) => {
    const x = 30 + i * 214, y = 70 + (i % 2) * 18, w = 190, h = 180 - (i % 2) * 18;
    b += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${M.wood}" stroke="${M.woodDark}" stroke-width="5"/>`
      + `<path d="M${x} ${y + 44}H${x + w}" stroke="${M.woodDark}" stroke-width="5"/>`
      + [0.16, 0.84].map(f => `<rect x="${x + w * f - 7}" y="${y}" width="14" height="${h}" fill="${M.brassDark}" opacity=".7"/>`).join('')
      + `<rect x="${x + w / 2 - 16}" y="${y}" width="32" height="${h}" fill="${C[col]}" stroke="${M.woodDark}" stroke-width="3"/>`
      + `<rect x="${x + w / 2 - 22}" y="${y + 52}" width="44" height="30" rx="4" fill="${M.brass}" stroke="${M.woodDark}" stroke-width="3"/>`
      + `<path d="M${x + w / 2 - 24} ${y - 2}q24 -26 48 0" stroke="${M.woodDark}" stroke-width="7" fill="none"/>`;
    // the label, tied to the handle by its string
    b += `<path d="M${x + w / 2 + 10} ${y - 10}L${x + w / 2 + 52} ${y - 40}" stroke="${M.paperDark}" stroke-width="3"/>`
      + `<rect x="${x + w / 2 + 36}" y="${y - 70}" width="64" height="58" rx="6" fill="${M.paper}" stroke="${M.ink}" stroke-width="3" transform="rotate(${8 - i * 5} ${x + w / 2 + 68} ${y - 41})"/>`
      + roundel(to, x + w / 2 + 68, y - 41, 20);
  });
  return b;
})() };

/* ---- the mail cage, and the tickets collected inside it ---- */
const cagePlate = ART.svg(560, 90, `<rect width="560" height="90" rx="10" fill="${M.woodDark}"/>`
  + crescent(40, 45, 16, M.brass) + `<path d="M62 45H520" stroke="${M.paper}" stroke-width="6"/><path d="M520 45L548 22M520 45L548 68" stroke="${M.paper}" stroke-width="6" stroke-linecap="round"/>`
  + [0, 1, 2, 3].map(i => `<circle cx="${130 + i * 110}" cy="45" r="16" fill="${M.woodDark}" stroke="${M.paper}" stroke-width="5"/>` + W(130 + i * 110, 52, String(i + 1), { size: 20, fill: M.paper, weight: 700, face: 'num' })).join(''));
function cageBody(st) {
  let b = `<rect x="8" y="8" width="264" height="354" fill="#100a06" stroke="${M.woodLip}" stroke-width="8"/>`;
  if (!st.solved) b += Array.from({ length: 6 }, (_, i) => `<path d="M${44 + i * 40} 8V362" stroke="${M.woodLip}" stroke-width="4"/>`).join('')
    + [80, 180, 280].map(y => `<path d="M8 ${y}H272" stroke="${M.woodLip}" stroke-width="4"/>`).join('');
  else b += `<path d="M8 8L-30 22V350L8 362Z" fill="#1a120a" stroke="${M.woodLip}" stroke-width="5"/>` + Array.from({ length: 3 }, (_, i) => `<path d="M${-22 + i * 10} 20V352" stroke="${M.woodLip}" stroke-width="3"/>`).join('');
  b += [0, 1, 2].map(i => `<path d="M${50 + i * 80} 362q-6 -50 24 -56q30 6 24 56Z" fill="#8a7448"/>`).join('')
    + `<rect x="100" y="200" width="80" height="62" rx="4" fill="${M.woodDark}" stroke="${M.brass}" stroke-width="3"/>`
    + [0, 1, 2, 3].map(i => `<rect x="${110 + i * 16}" y="212" width="11" height="38" rx="2" fill="${M.paperDark}"/>`).join('');
  return b;
}
const TICKETS = [   // destination, seat, the shape its punch left
  ['anchor', 7, 'crescent'], ['key', 2, 'star'], ['star', 5, 'crescent'], ['leaf', 9, 'diamond'], ['fish', 4, 'crescent'], ['bell', 8, 'heart'],
];
const punchHole = (shape, x, y, r) => shape === 'crescent' ? crescent(x, y, r, '#120c08')
  : shape === 'star' ? GL('star', x - r * 1.2, y - r * 1.2, r * 2.4, '#120c08')
  : shape === 'diamond' ? `<path d="M${x} ${y - r * 1.2}L${x + r} ${y}L${x} ${y + r * 1.2}L${x - r} ${y}Z" fill="#120c08"/>`
  : GL('heart', x - r * 1.2, y - r * 1.2, r * 2.4, '#120c08');
const ticketCard = (to, seat, shape, x, y, tint) => `<g transform="translate(${x} ${y})"><rect width="190" height="112" rx="8" fill="${tint}" stroke="${M.ink}" stroke-width="3"/>`
  + `<path d="M132 8V104" stroke="${M.ink}" stroke-width="2" stroke-dasharray="5 5"/>` + roundel(to, 40, 56, 24)
  + W(98, 74, String(seat), { size: 46, fill: M.ink, weight: 700, face: 'num' }) + punchHole(shape, 162, 56, 13) + `</g>`;
const ticketsFig = ART.svg(640, 290, `<rect width="640" height="290" fill="${M.woodDark}"/>`
  + TICKETS.map(([to, seat, shape], i) => ticketCard(to, seat, shape, 18 + (i % 3) * 206, 26 + Math.floor(i / 3) * 132, ['#e8dcc0', '#d8e0c8', '#e8d0c8'][i % 3])).join(''));

/* ---- the Conductor's punch, hanging by the gangway ---- */
const punchArt = { w: 360, h: 300, body: `<rect width="360" height="300" fill="${M.wall}"/><circle cx="180" cy="22" r="7" fill="${M.brass}"/>`
  + `<path d="M180 26L150 70M180 26L210 70" stroke="${M.brassDark}" stroke-width="4"/>`
  + `<path d="M150 70L120 230Q118 250 136 252L150 252L172 96Z" fill="${M.iron}" stroke="#141010" stroke-width="4"/>`
  + `<path d="M210 70L240 230Q242 250 224 252L210 252L188 96Z" fill="${M.iron}" stroke="#141010" stroke-width="4"/>`
  + `<circle cx="180" cy="96" r="12" fill="${M.brass}" stroke="#141010" stroke-width="3"/>`
  + `<rect x="138" y="56" width="84" height="30" rx="6" fill="${M.iron}" stroke="#141010" stroke-width="4"/>` + crescent(180, 71, 11, M.lamp)
  // and on the floor, what it has cut
  + [[60, 270, -20], [96, 284, 30], [282, 276, 10], [316, 262, -40], [250, 290, 60]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})">${crescent(x, y, 7, M.paper)}</g>`).join('') };
const punchSprite = `<circle cx="180" cy="22" r="7" fill="${M.brass}"/><path d="M180 26L150 70M180 26L210 70" stroke="${M.brassDark}" stroke-width="5"/>`
  + `<path d="M150 70L120 230Q118 250 136 252L150 252L172 96Z" fill="${M.iron}" stroke="#141010" stroke-width="5"/><path d="M210 70L240 230Q242 250 224 252L210 252L188 96Z" fill="${M.iron}" stroke="#141010" stroke-width="5"/>`
  + `<rect x="138" y="56" width="84" height="30" rx="6" fill="${M.iron}" stroke="#141010" stroke-width="5"/>`;

/* ---- the porter's strongbox ---- */
const SAFE_MARKS = ['fish', 'anchor', 'star'];
const SAFE = SAFE_MARKS.map(s => String(TICKETS.find(t => t[0] === s && t[2] === 'crescent')[1]));
function strongboxBody(st) {
  let b = `<rect x="10" y="30" width="130" height="84" rx="6" fill="${M.iron}" stroke="#141010" stroke-width="4"/>`;
  if (st.solved) b += `<path d="M10 36L24 2H126L140 36Z" fill="#4a4440" stroke="#141010" stroke-width="4"/><rect x="18" y="40" width="114" height="20" fill="#0c0806"/>`;
  else b += `<rect x="10" y="24" width="130" height="18" rx="4" fill="#4a4440" stroke="#141010" stroke-width="4"/>` + [0, 1, 2].map(i => `<rect x="${44 + i * 22}" y="56" width="16" height="30" rx="3" fill="${M.brass}" stroke="#141010" stroke-width="2"/>`).join('');
  return b + [26, 124].map(x => `<circle cx="${x}" cy="100" r="5" fill="${M.brassDark}"/>`).join('');
}
const porterPunch = ART.svg(420, 200, `<rect width="420" height="200" fill="${M.woodDark}"/>`
  + `<path d="M60 100L300 70Q330 66 332 86L334 96Q330 112 300 110L80 112Z" fill="#6a6460" stroke="#141010" stroke-width="4"/>`
  + `<path d="M60 112L300 136Q330 140 332 120" fill="none" stroke="#141010" stroke-width="4"/><path d="M60 112L300 140Q326 144 330 128L300 122L80 116Z" fill="#5a5450" stroke="#141010" stroke-width="3"/>`
  + `<circle cx="318" cy="98" r="9" fill="#141010"/><circle cx="72" cy="106" r="10" fill="${M.brass}" stroke="#141010" stroke-width="3"/>`);

/* ---- the gangway door, and the ticket its barrier wants punched ---- */
const TICKET_BOXES = ['key', 'fish', 'crown', 'star', 'bell', 'leaf', 'tower', 'anchor', 'flag', 'mountain'];
const gangTicket = (keys) => {
  let b = `<rect width="620" height="330" fill="${M.woodDark}"/><rect x="20" y="20" width="580" height="290" rx="14" fill="#e8dcc0" stroke="${M.ink}" stroke-width="4"/>`
    + crescent(60, 64, 18, M.brassDark) + `<path d="M96 64H560" stroke="${M.paperDark}" stroke-width="3"/>`;
  TICKET_BOXES.forEach((s, i) => {
    const x = 50 + (i % 5) * 108, y = 100 + Math.floor(i / 5) * 102;
    const box = `<rect x="${x}" y="${y}" width="92" height="88" rx="8" fill="${M.paper}" stroke="${M.ink}" stroke-width="3"/>` + roundel(s, x + 46, y + 44, 30);
    b += keys ? `<g data-key="${s}">${box}<g class="sw-on"><circle cx="${x + 46}" cy="${y + 44}" r="18" fill="#120c08"/></g></g>` : box;
  });
  return b;
};
function gangwayBody(st) {
  let b = `<rect x="6" y="6" width="118" height="438" rx="6" fill="${M.woodDark}" stroke="${M.woodLip}" stroke-width="6"/>`;
  if (st.solved) b += `<rect x="14" y="14" width="102" height="422" fill="#0a0706"/><rect x="40" y="80" width="50" height="40" fill="${M.lamp}" opacity=".18"/>`
    + `<path d="M14 14L44 30V420L14 436Z" fill="${M.wood}" stroke="${M.woodDark}" stroke-width="3"/>`;
  else b += `<rect x="14" y="14" width="102" height="422" fill="${M.wood}"/><rect x="30" y="40" width="70" height="90" fill="${M.night}" stroke="${M.woodLip}" stroke-width="5"/>`
    + `<rect x="34" y="200" width="62" height="34" rx="4" fill="#e8dcc0" stroke="${M.ink}" stroke-width="2"/>` + crescent(46, 217, 6, M.brassDark)
    + `<circle cx="104" cy="250" r="7" fill="${M.brass}"/>`;
  return b;
}

const POS1 = {
  linemap:   { x: 29.4,  y: 16.7, w: 25,    h: 26.7 },
  trunks:    { x: 26.25, y: 67.8, w: 30,    h: 22.2 },
  mailcage:  { x: 66.25, y: 24.4, w: 17.5,  h: 41.1 },
  punch:     { x: 85.6,  y: 33.3, w: 4.4,   h: 13.3 },
  strongbox: { x: 60,    y: 71.1, w: 9.4,   h: 13.3 },
  gangway:   { x: 91.25, y: 21.1, w: 8.1,   h: 50 },
};

const ROOM1 = {
  id:'baggage', name:'Room 1 — The Baggage Car', scene:'baggage', stageFx:'rocking',
  relays:[{el:'rl-baggage',mode:'pulse',period:3.6}],
  wrongSound:'clack',
  wrongVfx:'shadow',
  intro:"You wake on a mail sack. The train is moving fast, and every station going past the open door is dark.",
  objective:"Get forward through the train — <b>glowing rings</b> mark what you can look at. Whatever opens a lock is somewhere else in this car.",
  entryBeat:"Somewhere ahead, a ticket punch clicks. Then again, closer. The Conductor is working his way down the train.",
  entrySound:'clack',
  completeText:"The barrier takes your ticket and the gangway door swings in on a corridor of sleeping-car doors. Behind you, a punch clicks once, very close.",
  chain:`The line on the wall runs ${LINE.join(', ')}, with the special's crescent at ${STOPS.join(', ')}; the four trunks are strapped ${TRUNKS.map(([c, s]) => `${c} for ${s}`).join(', ')}, so they come off ${DROP.join(', ')} → the mail cage holds the night's tickets, three of them punched with the Conductor's crescent (the punch hangs by the gangway): ${TICKETS.filter(t => t[2] === 'crescent').map(t => `${t[0]} seat ${t[1]}`).join(', ')} → the strongbox's wheels are marked ${SAFE_MARKS.join(', ')}: ${SAFE.join(', ')} → it holds the porter's punch, and the gangway barrier wants a ticket punched at every crescent stop: ${STOPS.join(', ')}.`,
  objects:[
    { id:'linemap', icon:'🗺️', name:'The Line', pos:POS1.linemap,
      desc:"The line, framed on the wall, station by station from the terminus to the junction.",
      figure:ART.svg(mapArt.w, mapArt.h, mapArt.body),
      sprite:ART.sprite(POS1.linemap, mapArt.w, mapArt.h, mapArt.body) },
    { id:'trunks', icon:'🧳', name:'Steamer Trunks', pos:POS1.trunks,
      desc:"Four trunks waiting to be put off, each strapped in a colour and labelled for its station.",
      figure:ART.svg(trunksArt.w, trunksArt.h, `<rect width="880" height="300" fill="#1a120a"/>` + trunksArt.body),
      sprite:ART.sprite(POS1.trunks, trunksArt.w, trunksArt.h, trunksArt.body) },
    { id:'mailcage', icon:'📮', name:'The Mail Cage', pos:POS1.mailcage,
      desc:"The cage's tag board: four tags to set, for the trunks that leave this car, first off to last.",
      sprite:st=>ART.sprite(POS1.mailcage, 280, 370, cageBody(st)),
      puzzle:{ type:'combo', from:['trunks', 'linemap'], plate:cagePlate, wheels:[1, 2, 3, 4].map(n=>({ faces:{ colors:['red', 'yellow', 'blue', 'green', 'white', 'black'] }, mark:{ text:String(n) } })), answer:DROP, tryLabel:'SET THE TAGS',
        miss:"The cage stays locked. Those would go off at the wrong stations.",
        hints:[
          "Four tags for four trunks, first off to last. Each trunk is labelled with a station, and the line on the wall shows where each station comes.",
          "Find each trunk's station on the line. The one nearest the terminus comes off first. Set its strap colour on the first wheel, and so on.",
          `Anchor, key, star, fish: ${DROP.join(', ')}.`
        ],
        solvedText:"The tags drop into place and the cage door swings open. On the shelf inside, the guard's ticket box: every ticket collected tonight.",
        inside:{ name:"The night's tickets", figure:ticketsFig } } },
    { id:'punch', icon:'🎫', name:"The Conductor's Punch", pos:POS1.punch,
      desc:"His punch, hung on its nail by the gangway, still warm. Every conductor's punch cuts its own shape.",
      figure:ART.svg(punchArt.w, punchArt.h, punchArt.body),
      sprite:ART.sprite(POS1.punch, punchArt.w, punchArt.h, punchSprite) },
    { id:'strongbox', icon:'🧰', name:'Strongbox', pos:POS1.strongbox,
      desc:"The porter's strongbox. Three number wheels, each with a station's picture over it.",
      sprite:st=>ART.sprite(POS1.strongbox, 150, 120, strongboxBody(st)),
      puzzle:{ type:'combo', from:['mailcage', 'punch'], wheels:SAFE_MARKS.map(g=>({ mark:{ glyph:g } })), answer:SAFE, tryLabel:'OPEN IT',
        miss:"The lid won't lift.",
        hints:[
          "Three wheels, each under a station. The tickets from the mail cage each name a station and a seat.",
          "Only some of those tickets were punched by him: his punch, by the gangway, cuts a crescent. Use the crescent tickets, and read each one's seat.",
          `Fish ${SAFE[0]}, anchor ${SAFE[1]}, star ${SAFE[2]}: ${SAFE.join(', ')}.`
        ],
        solvedText:"Inside, under a cash bag nobody has counted since 1927: the porter's own ticket punch.",
        inside:{ name:"The porter's punch", figure:porterPunch } } },
    { id:'gangway', icon:'🚪', name:'Gangway Door', pos:POS1.gangway, needs:'strongbox',
      desc:"The barrier on the gangway door holds a blank ticket. Punch it for the journey: every station this train stops at.",
      deadDesc:"The barrier on the gangway door holds a blank ticket, and won't open for one that hasn't been punched. You have nothing to punch it with.",
      deadFigure:ART.svg(620, 330, gangTicket(false)),
      sprite:st=>ART.sprite(POS1.gangway, 130, 450, gangwayBody(st)),
      puzzle:{ type:'toggle', from:['linemap'], figure:ART.svg(620, 330, gangTicket(true)), answer:STOPS, tryLabel:'HAND IT OVER',
        gm:'punch anchor, key, star, leaf and fish: the five stations with the crescent beside them on the line',
        miss:"The barrier pushes the ticket back out. That isn't this train's journey.",
        hints:[
          "The ticket wants a hole for every station this train stops at. The line on the wall marks them.",
          "On the line, the crescent beside a station is the Midnight Special stopping there (the key in the corner says so). Punch those five, and nothing else.",
          "Anchor, key, star, leaf and fish."
        ],
        solvedText:"The barrier clicks, and the gangway door unlatches." } },
  ]
};

/* ============================================================
   ROOM 2 — THE SLEEPER CORRIDOR
   Berths 10, 11, 12, 14 — and at the end of the car, a berth 13 that
   should not be there. Its passenger hung her coat outside with her
   ticket in the pocket and a card on the door asking to be woken for
   her stop; the timetable on the wall says when that is. Inside, her
   gramophone turns at the wrong speed. Bring it up until her song
   comes clear, and ring it on the attendant's bells.
   ============================================================ */

/* ---- the timetable: the line's stations down the side, four trains across ---- */
const TRAINS = ['sun', 'moon', 'comet', 'planet'];
const TIMES = {
  sun:    ['6:05', '6:20', '6:31', '6:44', '6:58', '7:10', '7:26', '7:41', '7:55', '8:09'],
  moon:   ['11:50', '12:14', '', '12:52', '', '1:31', '', '2:35', '3:02', ''],
  comet:  ['9:40', '', '10:02', '', '10:30', '', '', '11:05', '', '11:30'],
  planet: ['4:10', '4:24', '4:37', '4:49', '5:03', '5:16', '5:31', '5:45', '5:58', '6:12'],
};
const HER_STOP = 'leaf';
const WAKE = TIMES.moon[LINE.indexOf(HER_STOP)];
const timetableArt = { w: 440, h: 620, body: (() => {
  let b = `<rect width="440" height="620" fill="${M.woodDark}"/><rect x="12" y="12" width="416" height="596" fill="${M.paper}"/>`
    + `<path d="M24 84H416M104 24V596" stroke="${M.ink}" stroke-width="3"/>`;
  TRAINS.forEach((t, j) => {
    const x = 146 + j * 80;
    b += t === 'moon' ? `<circle cx="${x}" cy="52" r="24" fill="${M.paper}" stroke="${M.ink}" stroke-width="3"/>` + crescent(x - 4, 52, 15, M.ink)
      : roundel(t, x, 52, 24);
    if (j) b += `<path d="M${x - 40} 24V596" stroke="${M.paperDark}" stroke-width="2"/>`;
  });
  LINE.forEach((s, i) => {
    const y = 120 + i * 50;
    b += roundel(s, 62, y, 20) + (i ? `<path d="M24 ${y - 25}H416" stroke="${M.paperDark}" stroke-width="1.5"/>` : '');
    TRAINS.forEach((t, j) => {
      const v = TIMES[t][i], x = 146 + j * 80;
      b += v ? W(x, y + 7, v, { size: 20, fill: M.ink, weight: 700, face: 'num' }) : `<path d="M${x - 12} ${y}H${x + 12}" stroke="${M.ink}" stroke-width="3"/>`;
    });
  });
  return b;
})() };

/* ---- her coat, on the hook by berth 13, and the ticket in its pocket ---- */
const herTicket = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect width="190" height="112" rx="8" fill="#e8d0c8" stroke="${M.ink}" stroke-width="3"/>`
  + `<path d="M132 8V104" stroke="${M.ink}" stroke-width="2" stroke-dasharray="5 5"/>` + roundel(HER_STOP, 40, 56, 24)
  + W(98, 74, '13', { size: 40, fill: M.ink, weight: 700, face: 'num' }) + crescent(162, 56, 13, '#120c08') + `</g>`;
const coatBody = `<circle cx="70" cy="18" r="8" fill="${M.brass}"/><path d="M70 24Q40 30 30 70L14 300Q12 318 30 318H110Q128 318 126 300L110 70Q100 30 70 24Z" fill="#3a1620" stroke="#1a0a0e" stroke-width="4"/>`
  + `<path d="M70 26L56 120M70 26L84 120" stroke="#1a0a0e" stroke-width="3"/><path d="M70 120V318" stroke="#1a0a0e" stroke-width="3"/>`
  + [150, 190, 230].map(y => `<circle cx="80" cy="${y}" r="4" fill="${M.brass}"/>`).join('')
  + `<path d="M26 220H62V244H26Z" fill="#2a0e14" stroke="#1a0a0e" stroke-width="3"/><rect x="34" y="206" width="22" height="20" rx="2" fill="#e8d0c8" transform="rotate(-12 45 216)"/>`;
const coatArt = { w: 460, h: 340, body: `<rect width="460" height="340" fill="${M.wall}"/>` + coatBody + herTicket(170, 110, 1.4) };

/* ---- berth 13, with the card on its door ---- */
function berthBody(st) {
  let b = `<rect x="6" y="6" width="138" height="358" rx="6" fill="#241207" stroke="#170a04" stroke-width="8"/>`;
  if (st.solved) {
    b += `<rect x="14" y="14" width="122" height="342" fill="#120a06"/><ellipse cx="80" cy="260" rx="60" ry="90" fill="${M.brass}" opacity=".12"/>`
      + `<rect x="18" y="300" width="114" height="50" fill="#3a2a16"/><path d="M14 14L-14 30V340L14 356Z" fill="#2c160a" stroke="#170a04" stroke-width="4"/>`;
  } else {
    b += `<rect x="34" y="30" width="80" height="54" rx="4" fill="#8a2418"/>` + W(74, 68, '13', { size: 30, fill: '#e0cfa2', weight: 700, face: 'num' })
      + `<circle cx="126" cy="200" r="7" fill="${M.brass}"/><path d="M74 108L54 132M74 108L94 132" stroke="${M.paperDark}" stroke-width="2"/>`
      + `<rect x="40" y="130" width="68" height="92" rx="5" fill="${M.paper}" stroke="${M.ink}" stroke-width="2"/>`
      + ART.clockFace(74, 168, 24, 12, 0, { face: '#f2ead2', ink: '#1c1408', rim: M.ink, hands: false })
      + `<path d="M58 206h32" stroke="${M.ink}" stroke-width="2"/>`;
  }
  return b;
}

/* ---- her gramophone, and her record ---- */
function gramBody(st) {
  return `<rect x="6" y="64" width="64" height="40" fill="#3a2a16" stroke="#170a04" stroke-width="3"/><ellipse cx="38" cy="64" rx="30" ry="6" fill="#120a06"/>`
    + `<path d="M38 60L52 30Q60 4 78 6L80 40Q64 34 52 38Z" fill="${M.brass}" stroke="${M.brassDark}" stroke-width="2"/>`
    + (st.solved ? `<path d="M80 14q8 -6 14 0M84 26q8 -6 14 0" stroke="${M.lamp}" stroke-width="2" fill="none"/>` : '');
}
const BELLS = ['10', '11', '12', '14', '15', '16'];
const BELL_TONE = { 10: 392, 11: 440, 12: 523, 14: 587, 15: 659, 16: 784 };
const HER_SONG = ['12', '15', '11', '16', '14'];
const recordFig = ART.svg(420, 300, `<rect width="420" height="300" fill="${M.woodDark}"/><circle cx="210" cy="150" r="128" fill="#0c0806"/>`
  + [110, 92, 74].map(r => `<circle cx="210" cy="150" r="${r}" fill="none" stroke="#2a201a" stroke-width="2"/>`).join('')
  + `<circle cx="210" cy="150" r="44" fill="#8a2418"/>` + crescent(206, 150, 18, M.paper) + `<circle cx="210" cy="150" r="4" fill="#0c0806"/>`);

/* ---- the attendant's call bells, at the end of the car ---- */
const bellBoard = (keys) => {
  let b = `<rect width="300" height="460" fill="${M.wall}"/><rect x="30" y="20" width="240" height="420" rx="14" fill="${M.brassDark}" stroke="#3a2a10" stroke-width="5"/>`
    + `<rect x="44" y="34" width="212" height="392" rx="10" fill="${M.brass}"/>`;
  BELLS.forEach((n, i) => {
    const x = 100 + (i % 2) * 100, y = 90 + Math.floor(i / 2) * 120;
    const push = `<circle cx="${x}" cy="${y}" r="34" fill="${M.woodDark}" stroke="#3a2a10" stroke-width="4"/><circle cx="${x}" cy="${y}" r="22" fill="#e8dcc0"/>`
      + W(x, y + 58, n, { size: 26, fill: M.ink, weight: 700, face: 'num' });
    b += keys ? `<g data-key="${n}" data-x="${x}" data-y="${y}">${push}</g>` : push;
  });
  return b;
};

const POS2 = {
  timetable:  { x: 37.75, y: 25.6, w: 10.4,  h: 26.7 },
  coat:       { x: 78.9,  y: 33.3, w: 4.1,   h: 24.4 },
  berth13:    { x: 83.4,  y: 25.6, w: 9.4,   h: 41.1 },
  gramophone: { x: 85.6,  y: 45.6, w: 5.6,   h: 12.2 },
  bellpanel:  { x: 93.75, y: 27.8, w: 5.6,   h: 18.9 },
};

const ROOM2 = {
  id:'sleeper', name:'Room 2 — The Sleeper Corridor', scene:'sleeper', stageFx:'rocking',
  relays:[{el:'rl-sleeper',mode:'pulse',period:4.2}],
  wrongSound:'creak',
  wrongVfx:'shadow',
  intro:"Berths 10, 11, 12 and 14. And at the end of the car, a door there is no number for.",
  objective:"The dining car door is bolted from the far side. Whatever opens a lock is somewhere else in this corridor.",
  entryBeat:"Every berth is made up and every berth is empty. Behind the door at the end, a gramophone is playing at the wrong speed.",
  entrySound:'creak',
  completeText:"The last bell rings, and far off a bolt slides back. The dining car door opens on candlelight and laid tables, and a smell of dinner that has been keeping warm since 1927.",
  chain:`Her coat hangs outside berth 13 with her ticket in the pocket: ${HER_STOP}, punched with the crescent; the timetable's crescent column has the special at ${HER_STOP} at ${WAKE}, so the card on her door is set to ${WAKE} (anything from 2:25 counts as waking her in time) → inside, her gramophone runs slow until it is brought up to 78 → her record's five notes are the call bells for berths ${HER_SONG.join(', ')}, rung in that order.`,
  objects:[
    { id:'timetable', icon:'🕰️', name:'Timetable', pos:POS2.timetable,
      desc:"The line's timetable: every station down the side, and four trains across the top, each with its emblem.",
      figure:ART.svg(timetableArt.w, timetableArt.h, timetableArt.body),
      sprite:ART.sprite(POS2.timetable, timetableArt.w, timetableArt.h, timetableArt.body) },
    { id:'coat', icon:'🧥', name:'Her Coat', pos:POS2.coat,
      desc:"A travelling coat on the hook outside berth 13. There is a ticket in the pocket.",
      figure:ART.svg(coatArt.w, coatArt.h, coatArt.body),
      sprite:ART.sprite(POS2.coat, 140, 330, coatBody) },
    { id:'berth13', icon:'🚪', name:'Berth 13', pos:POS2.berth13,
      desc:"A card on the door: wake me for my stop. Its little clock is set to nothing.",
      sprite:st=>ART.sprite(POS2.berth13, 150, 370, berthBody(st)),
      puzzle:{ type:'clock', from:['coat', 'timetable'], start:{h:12,m:0}, answer:WAKE, window:['2:25', WAKE], tryLabel:'SET THE CARD',
        miss:"The door stays shut. She would sleep straight through her stop.",
        hints:[
          "She wants waking for her stop. Her ticket, in the coat on the hook, says where she is going.",
          "Find her station down the side of the timetable, and the Midnight Special's column across the top: the crescent. Where they meet is when she arrives.",
          `She is going to the leaf station, and the special is there at ${WAKE}.`
        ],
        solvedText:"The card turns on its string and the door of berth 13 swings in. The bed is made. On the table, her gramophone is still turning." } },
    { id:'gramophone', icon:'📀', name:'Her Gramophone', pos:POS2.gramophone, hiddenUntil:'berth13',
      desc:"Her record, dragging round far too slowly. Bring it up to speed until her song comes clear.",
      sprite:st=>ART.sprite(POS2.gramophone, 90, 110, gramBody(st)),
      puzzle:{ type:'tune', min:16, max:90, step:1, start:24, at:78, tol:1, unit:'rpm',
        hints:[
          "Turn the speed up slowly and listen: the record drags, then wobbles, then plays.",
          "Gramophones of her day ran fast, well past seventy.",
          "It plays true at 78."
        ],
        solvedText:"At 78 the song comes clear: five notes, over and over, like somebody ringing for service.",
        inside:{ name:'Her record', figure:recordFig, tool:{ type:'listen', notes:HER_SONG.map(n => BELL_TONE[n]), label:'play her song' } } } },
    { id:'bellpanel', icon:'🛎️', name:'Call Bells', pos:POS2.bellpanel,
      desc:"The attendant's bell push for each berth. The dining car door is bolted from the far side, and somebody over there is listening.",
      sprite:ART.sprite(POS2.bellpanel, 300, 460, bellBoard(false)),
      puzzle:{ type:'press', from:['gramophone'], slots:5, answer:HER_SONG, tones:BELL_TONE, figure:ART.svg(300, 460, bellBoard(true)),
        echo:Object.fromEntries(BELLS.map(n => [n, n])),
        miss:"The bells ring out down the car, and nothing answers.",
        hints:[
          "Five rings on six bells, and each bell has its own note. Her record plays five notes.",
          "Play her song, then press each bell to hear its note. Match them one by one: the first note of the song is the first bell to ring.",
          `Berths ${HER_SONG.join(', ')}.`
        ],
        solvedText:"The fifth bell rings, and at the end of the car a bolt slides back. Nobody is there to have drawn it." } },
  ]
};

/* ============================================================
   ROOM 3 — THE DINING CAR
   Tonight's last bill is still on the spike by the till, and the
   chef's board says what everything cost. The till holds the barman's
   card for the house cocktail, drawn bottle by bottle; the bottles on
   the bar each wear a letter, and the spirits cabinet wants them in the
   order they are poured. The steward's key in the cabinet turns the
   vestibule clock — which only opens at the hour on the platform clock
   of the station that keeps sliding past the window.
   ============================================================ */

/* ---- the chef's board, and the last order ---- */
const dish = {
  soup: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-30 0H30Q28 26 0 28Q-28 26 -30 0Z" fill="${M.paper}"/><path d="M-34 0H34" stroke="${M.paper}" stroke-width="4"/>`
    + `<path d="M-10 -8q-6 -10 0 -18M4 -8q-6 -10 0 -18" stroke="${M.paper}" stroke-width="3" fill="none" stroke-linecap="round"/></g>`,
  fish: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="8" rx="36" ry="10" fill="none" stroke="${M.paper}" stroke-width="3"/>${GL('fish', -20, -18, 40, M.paper)}</g>`,
  pie: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-32 12H32L26 -2H-26Z" fill="${M.paper}"/><path d="M-26 -2Q0 -26 26 -2Z" fill="${M.paper}" opacity=".8"/>`
    + `<path d="M-10 -10l4 6M4 -12l2 7" stroke="${M.woodDark}" stroke-width="3"/></g>`,
  pudding: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-26 12H26Q24 -24 0 -24Q-24 -24 -26 12Z" fill="${M.paper}"/><path d="M-12 -22l-4 -10M12 -22l4 -10M0 -24v-10" stroke="${M.paper}" stroke-width="4" stroke-linecap="round"/></g>`,
  tea: (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-20 -14H18V4Q18 16 0 16Q-20 16 -20 4Z" fill="${M.paper}"/><path d="M18 -8q14 0 12 10t-12 6" stroke="${M.paper}" stroke-width="4" fill="none"/>`
    + `<path d="M-30 18H28" stroke="${M.paper}" stroke-width="4"/></g>`,
};
const MENU = [['soup', 30], ['fish', 85], ['pie', 60], ['pudding', 25], ['tea', 10]];
const ORDER = { soup: 2, fish: 1, pie: 2, tea: 3 };
const BILL = String(MENU.reduce((t, [d, p]) => t + (ORDER[d] || 0) * p, 0));
const menuArt = { w: 420, h: 560, body: `<rect width="420" height="560" fill="#3a2a16"/><rect x="18" y="18" width="384" height="524" fill="#1c241e"/>`
  + crescent(210, 62, 22, M.brass) + `<path d="M60 100H360" stroke="${M.paper}" stroke-width="2" opacity=".5"/>`
  + MENU.map(([d, p], i) => dish[d](120, 156 + i * 86, 1.15) + `<path d="M180 ${158 + i * 86}H262" stroke="${M.paper}" stroke-width="2" stroke-dasharray="3 7" opacity=".6"/>`
    + W(318, 170 + i * 86, String(p), { size: 40, fill: M.paper, weight: 700, face: 'num' })).join('') };
const tally = (n, x, y) => { let b = ''; for (let k = 0; k < n; k++) b += `<path d="M${x + k * 14} ${y - 22}L${x + k * 14 - 3} ${y + 22}" stroke="${M.ink}" stroke-width="5" stroke-linecap="round"/>`; return b; };
const slipArt = { w: 360, h: 470, body: `<rect width="360" height="470" fill="${M.woodDark}"/><path d="M40 20H320V430L300 450L280 430L260 450L240 430L220 450L200 430L180 450L160 430L140 450L120 430L100 450L80 430L60 450L40 430Z" fill="#efe6cc" stroke="${M.ink}" stroke-width="3"/>`
  + `<circle cx="180" cy="46" r="8" fill="${M.woodDark}"/>`
  + Object.keys(ORDER).map((d, i) => dish[d](110, 112 + i * 84, 0.95).replace(new RegExp(M.paper, 'g'), M.ink) + tally(ORDER[d], 196, 112 + i * 84)).join('') };

/* ---- the till ---- */
function tillBody(st) {
  let b = `<rect x="6" y="20" width="118" height="80" rx="8" fill="#3a2416" stroke="#241a0c" stroke-width="4"/><rect x="18" y="30" width="94" height="28" rx="4" fill="#0d0805"/>`;
  b += st.solved ? `<rect x="14" y="96" width="102" height="18" fill="#241a0c"/><rect x="20" y="104" width="90" height="10" fill="${M.paper}"/>` + W(65, 50, BILL, { size: 18, fill: M.brass, weight: 700, face: 'num' })
    : [0, 1, 2].map(i => `<circle cx="${32 + i * 32}" cy="78" r="9" fill="${M.brass}"/>`).join('');
  return b;
}

/* ---- the bottles on the bar, and the card for the house cocktail ---- */
const BOTTLE = {   // a silhouette for every bottle on the shelf
  slim: (x, b, h) => `M${x - 14} ${b}V${b - h * 0.62}Q${x - 14} ${b - h * 0.74} ${x - 6} ${b - h * 0.8}V${b - h}H${x + 6}V${b - h * 0.8}Q${x + 14} ${b - h * 0.74} ${x + 14} ${b - h * 0.62}V${b}Z`,
  flask: (x, b, h) => `M${x - 30} ${b - 26}Q${x - 30} ${b} ${x} ${b}Q${x + 30} ${b} ${x + 30} ${b - 26}Q${x + 30} ${b - h * 0.62} ${x + 6} ${b - h * 0.7}V${b - h}H${x - 6}V${b - h * 0.7}Q${x - 30} ${b - h * 0.62} ${x - 30} ${b - 26}Z`,
  square: (x, b, h) => `M${x - 24} ${b}V${b - h * 0.7}L${x - 8} ${b - h * 0.78}V${b - h}H${x + 8}V${b - h * 0.78}L${x + 24} ${b - h * 0.7}V${b}Z`,
  long: (x, b, h) => `M${x - 20} ${b}V${b - h * 0.42}Q${x - 20} ${b - h * 0.52} ${x - 5} ${b - h * 0.56}V${b - h}H${x + 5}V${b - h * 0.56}Q${x + 20} ${b - h * 0.52} ${x + 20} ${b - h * 0.42}V${b}Z`,
  decanter: (x, b, h) => `M${x - 34} ${b}L${x - 22} ${b - h * 0.5}L${x - 8} ${b - h * 0.62}V${b - h * 0.8}H${x + 8}V${b - h * 0.62}L${x + 22} ${b - h * 0.5}L${x + 34} ${b}Z`,
  stubby: (x, b, h) => `M${x - 22} ${b}V${b - h * 0.5}Q${x - 22} ${b - h * 0.62} ${x - 8} ${b - h * 0.66}V${b - h * 0.86}H${x + 8}V${b - h * 0.66}Q${x + 22} ${b - h * 0.62} ${x + 22} ${b - h * 0.5}V${b}Z`,
};
const SHELF = [['long', 'H', '#3a6a3a'], ['flask', 'I', '#8a4a24'], ['slim', 'T', '#5a2a4a'], ['decanter', 'S', '#b08a3a'], ['square', 'N', '#2a4a5a'], ['stubby', 'G', '#4a3a2a']];
const POUR = ['square', 'flask', 'stubby', 'long', 'slim'];                     // the card's order
const CABINET = POUR.map(sh => SHELF.find(x => x[0] === sh)[1]);
const BOTTLE_H = { slim: 150, flask: 126, square: 132, long: 156, decanter: 112, stubby: 100 };
const bottlesBody = (() => {
  let b = `<rect x="0" y="176" width="680" height="16" fill="${M.woodLip}"/>`;
  SHELF.forEach(([sh, letter, glass], i) => {
    const x = 62 + i * 112, base = 176;
    b += `<path d="${BOTTLE[sh](x, base, BOTTLE_H[sh])}" fill="${glass}" stroke="#120c08" stroke-width="3"/>`
      + `<rect x="${x - 15}" y="${base - 66}" width="30" height="36" rx="3" fill="${M.paper}" stroke="#120c08" stroke-width="2"/>`
      + W(x, base - 39, letter, { size: 24, fill: M.ink, weight: 700, face: 'num' });
  });
  return b;
})();
const cocktailCard = ART.svg(640, 260, `<rect width="640" height="260" fill="${M.woodDark}"/><rect x="20" y="20" width="600" height="220" rx="10" fill="#efe6cc" stroke="${M.ink}" stroke-width="3"/>`
  + crescent(56, 60, 18, M.brassDark) + `<path d="M90 60H590" stroke="${M.paperDark}" stroke-width="2"/>`
  + POUR.map((sh, i) => {
    const x = 104 + i * 108;
    return `<path d="${BOTTLE[sh](x, 214, BOTTLE_H[sh] * 0.82)}" fill="${M.ink}"/>` + (i < POUR.length - 1 ? `<path d="M${x + 38} 160h22M${x + 54} 154l6 6l-6 6" stroke="${M.ink}" stroke-width="3" fill="none"/>` : '');
  }).join(''));
function cabinetBody(st) {
  let b = `<rect x="6" y="6" width="108" height="108" rx="6" fill="${M.wood}" stroke="${M.woodDark}" stroke-width="5"/>`;
  if (st.solved) b += `<rect x="14" y="14" width="92" height="92" fill="#120c08"/><path d="M14 14L-10 24V100L14 106Z" fill="${M.wood}" stroke="${M.woodDark}" stroke-width="3"/>`;
  else b += `<path d="M60 10V110" stroke="${M.woodDark}" stroke-width="3"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${20 + i * 17}" y="50" width="12" height="22" rx="2" fill="${M.brass}"/>`).join('');
  return b;
}
const stewardKey = ART.svg(420, 200, `<rect width="420" height="200" fill="${M.woodDark}"/><circle cx="110" cy="100" r="40" fill="none" stroke="${M.brass}" stroke-width="14"/>`
  + `<rect x="146" y="92" width="200" height="16" rx="4" fill="${M.brass}"/><path d="M300 108v26M330 108v18" stroke="${M.brass}" stroke-width="12"/>` + crescent(110, 100, 16, M.brass));

/* ---- the window, and the station that keeps going past it ---- */
const GHOST_TIME = '3:10';
const windowBody = `<defs><clipPath id="pane"><rect x="20" y="20" width="560" height="280"/></clipPath></defs>`
  + `<rect width="600" height="320" rx="14" fill="#241a0c"/><rect x="20" y="20" width="560" height="280" fill="#05070d"/>`
  + `<g clip-path="url(#pane)"><g class="passby">`
  + `<rect x="0" y="236" width="600" height="64" fill="#3a2e1c"/><rect x="0" y="230" width="600" height="8" fill="#8a7448"/>`
  + `<ellipse cx="300" cy="200" rx="300" ry="110" fill="${M.lamp}" opacity=".12"/>`
  + [90, 510].map(x => `<rect x="${x - 4}" y="70" width="8" height="166" fill="#1a1410"/><circle cx="${x}" cy="66" r="12" fill="${M.lamp}"/>`).join('')
  + `<rect x="296" y="196" width="8" height="40" fill="#1a1410"/>` + ART.clockFace(300, 128, 66, 3, 10, { face: '#f2ead2', ink: '#1c1408', rim: '#1a1410' })
  + `<circle cx="186" cy="160" r="30" fill="${M.paper}" stroke="#8a2418" stroke-width="7"/>` + GL('eye', 168, 142, 36, M.ink)
  + `<rect x="410" y="150" width="34" height="80" fill="#1a1410"/><rect x="416" y="160" width="22" height="22" fill="${M.lamp}" opacity=".5"/>`
  + `</g></g>`;

/* ---- the vestibule door, and its clock ---- */
function vestibuleBody(st) {
  let b = `<rect x="6" y="6" width="158" height="358" rx="6" fill="#241207" stroke="#170a04" stroke-width="6"/>`;
  if (st.solved) b += `<rect x="14" y="70" width="142" height="288" fill="#0a0706"/><rect x="40" y="110" width="90" height="70" fill="#ff9b4e" opacity=".2"/>`
    + `<path d="M14 70L40 82V348L14 358Z" fill="#2c160a" stroke="#170a04" stroke-width="3"/>`;
  else b += `<rect x="14" y="70" width="142" height="288" fill="#3a2214"/><rect x="40" y="96" width="90" height="100" rx="6" fill="#120c08" stroke="${M.brass}" stroke-width="3"/>`
    + `<circle cx="140" cy="250" r="7" fill="${M.brass}"/><rect x="124" y="270" width="20" height="26" rx="3" fill="#120c08" stroke="${M.brass}" stroke-width="2"/>`;
  return b + ART.clockFace(85, 38, 28, 12, 0, { face: st.live ? '#f2ead2' : '#6a5a4a', ink: '#1c1408', rim: M.brass });
}

const POS3 = {
  menu:      { x: 65,    y: 33.3, w: 7.5,   h: 17.8 },
  slip:      { x: 81.9,  y: 52.2, w: 3.2,   h: 10 },
  till:      { x: 85,    y: 53.3, w: 8.1,   h: 11.1 },
  bottles:   { x: 74.4,  y: 36.7, w: 21.25, h: 11.1 },
  cabinet:   { x: 73.75, y: 52.2, w: 7.5,   h: 13.3 },
  window:    { x: 41.25, y: 13.3, w: 18.75, h: 17.8 },
  vestibule: { x: 1.9,   y: 27.8, w: 10.6,  h: 41.1 },
};

const ROOM3 = {
  id:'dining', name:'Room 3 — The Dining Car', scene:'dining', stageFx:'rocking',
  relays:[{el:'rl-dining',mode:'pulse',period:3.2}],
  wrongSound:'bell',
  wrongVfx:'flash',
  intro:"The tables are laid, the soup is hot, and every chair is pushed back as if its diner has only just stood up.",
  objective:"Get through the vestibule to the engine. Whatever opens a lock is somewhere else in this car.",
  entryBeat:"Outside the window a lit platform slides past, and is gone. A minute later, the same platform slides past again.",
  entrySound:'bell',
  completeText:"The vestibule clock strikes, once, and the door opens on coal dust and firelight. Behind you every chair in the dining car scrapes back at the same moment.",
  chain:`The last bill on the spike is ${Object.entries(ORDER).map(([d, n]) => `${n} ${d}`).join(', ')}, and the chef's board prices them ${MENU.map(([d, p]) => `${d} ${p}`).join(', ')}: ${BILL} → the till holds the house cocktail's card, five bottles drawn in the order they are poured; the bottles on the bar wear the letters ${SHELF.map(([sh, l]) => `${l} (${sh})`).join(', ')}, so the spirits cabinet takes ${CABINET.join('')} → it holds the steward's key, which wakes the vestibule clock, and the platform clock of the station that keeps going past the window says ${GHOST_TIME}.`,
  objects:[
    { id:'menu', icon:'📋', name:"The Chef's Board", pos:POS3.menu,
      desc:"Tonight's dinner, in chalk, and what each thing costs.",
      figure:ART.svg(menuArt.w, menuArt.h, menuArt.body),
      sprite:ART.sprite(POS3.menu, menuArt.w, menuArt.h, menuArt.body) },
    { id:'slip', icon:'🧾', name:'The Last Order', pos:POS3.slip,
      desc:"The last order of the night, still on the spike by the till.",
      figure:ART.svg(slipArt.w, slipArt.h, slipArt.body),
      sprite:ART.sprite(POS3.slip, slipArt.w, slipArt.h, slipArt.body) },
    { id:'till', icon:'💷', name:'The Till', pos:POS3.till,
      desc:"The till won't open until tonight's last bill is rung up.",
      sprite:st=>ART.sprite(POS3.till, 130, 120, tillBody(st)),
      puzzle:{ type:'keypad', from:['slip', 'menu'], answer:BILL,
        miss:"The till rings, and the drawer stays shut. That isn't what they owed.",
        hints:[
          "The till wants the last bill. The order on the spike says what the table had; the chef's board says what each thing cost.",
          "Count each dish's strokes on the slip, multiply by its price on the board, and add the lot.",
          `Two soups 60, one fish 85, two pies 120, three teas 30: ${BILL}.`
        ],
        solvedText:"The drawer springs open. Under the coins, the barman's card for the house cocktail.",
        inside:{ name:'The house cocktail', figure:cocktailCard } } },
    { id:'bottles', icon:'🍾', name:'The Bar', pos:POS3.bottles,
      desc:"Six bottles on the bar, no two the same shape, each with a letter on its label.",
      figure:ART.svg(680, 200, `<rect width="680" height="200" fill="#1c2430"/>` + bottlesBody),
      sprite:ART.sprite(POS3.bottles, 680, 200, bottlesBody) },
    { id:'cabinet', icon:'🗄️', name:'Spirits Cabinet', pos:POS3.cabinet,
      desc:"The steward's spirits cabinet. Five letter wheels.",
      sprite:st=>ART.sprite(POS3.cabinet, 120, 120, cabinetBody(st)),
      puzzle:{ type:'combo', from:['till', 'bottles'], wheels:5, faces:'ACEGHINORSTW', answer:CABINET.join(''), tryLabel:'OPEN IT',
        miss:"The cabinet stays locked.",
        hints:[
          "Five letters, and five bottles on the barman's card from the till. The bottles on the bar each wear a letter.",
          "Match each shape on the card to the bottle on the bar with the same outline, and take its letter, in the card's order.",
          `Square, flask, stubby, long, slim: ${CABINET.join('')}.`
        ],
        solvedText:"The cabinet opens on bottles nobody has touched since 1927, and on its hook, the steward's key.",
        inside:{ name:"The steward's key", figure:stewardKey } } },
    { id:'window', icon:'🪟', name:'The Window', pos:POS3.window,
      desc:"Night, and every so often a lit platform slides past: the same station every time. It is not on the line.",
      figure:ART.svg(600, 320, windowBody),
      sprite:ART.sprite(POS3.window, 600, 320, windowBody) },
    { id:'vestibule', icon:'🚪', name:'Vestibule Door', pos:POS3.vestibule, needs:'cabinet',
      desc:"The steward's key is in the vestibule clock. The door opens only at the hour the clock is set to, and only if it is the right one.",
      deadDesc:"The door to the engine is bolted, and its clock is locked behind a little brass door with a keyhole.",
      deadFigure:st=>ART.svg(170, 370, vestibuleBody(st)),
      sprite:st=>ART.sprite(POS3.vestibule, 170, 370, vestibuleBody(st)),
      puzzle:{ type:'clock', from:['window'], start:{h:12,m:0}, answer:GHOST_TIME, tryLabel:'SET THE CLOCK',
        miss:"The clock ticks on, and the door stays shut. That is not the hour this train keeps.",
        hints:[
          "The clock wants an hour. Every clock on this train stopped; one outside didn't.",
          "Watch the window: the station that slides past has a big clock on its platform. It is always the same time there.",
          `Its clock says ${GHOST_TIME}.`
        ],
        solvedText:"The clock strikes, and the bolts draw back." } },
  ]
};

/* ============================================================
   ROOM 4 — THE LOCOMOTIVE
   Nobody is driving. The junction is coming up, and the ground frame
   that sets it is in reach of the cab steps: ten levers, red for
   signals, black for points, white for spare. The diagram shows what
   each lever works, and the driver's route card shows where this train
   should have gone. Set the road home, then whistle and go — two pairs
   of hands at once.
   ============================================================ */

/* ---- the junction, as the diagram draws it ---- */
// Points: a black lever. Pulled, it throws the point to the road drawn with a gap at the blade.
// Signals: a red lever. Pulled, the arm drops and the road past it is clear.
const LEVER_KIND = { 1: 'signal', 2: 'point', 3: 'signal', 4: 'signal', 5: 'point', 6: 'spare', 7: 'point', 8: 'signal', 9: 'spare', 10: 'spare' };
const HOME = 'crown';
const ROAD_HOME = ['1', '2', '5', '4'];                 // the entry signal, both points reversed, the home signal
const ink = '#1c140c', track = (d, w = 10) => `<path d="${d}" stroke="${ink}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const leverTag = (n, x, y) => `<circle cx="${x}" cy="${y}" r="16" fill="${LEVER_KIND[n] === 'signal' ? '#a3322a' : ink}" stroke="${M.paper}" stroke-width="2"/>`
  + W(x, y + 6, String(n), { size: 17, fill: M.paper, weight: 700, face: 'num' });
// a signal post standing up from its road (dir -1) or hanging below it (dir 1), its arm, and its lever's number
const semaphore = (x, y, n, dir = -1) => { const end = y + dir * 46;
  return `<path d="M${x} ${y}V${end}" stroke="${ink}" stroke-width="4"/><rect x="${x}" y="${end - 4}" width="30" height="9" fill="#a3322a" stroke="${ink}" stroke-width="2"/>` + leverTag(n, x - 2, y + dir * 70); };
const bufferStop = (x, y) => `<path d="M${x} ${y - 16}V${y + 16}M${x + 8} ${y - 16}V${y + 16}" stroke="${ink}" stroke-width="6"/>`;
const diagramArt = { w: 760, h: 456, body: (() => {
  let b = `<rect width="760" height="456" fill="${M.woodDark}"/><rect x="14" y="14" width="732" height="428" fill="#e6dcc0"/>`;
  // the main line in from the left, straight through to the mountains: every point's normal road is the unbroken one
  b += track('M30 320H690');
  // point 2: its reverse road climbs to the upper line, drawn with a gap where it leaves
  b += track('M222 298L286 200H620') + leverTag(2, 196, 352);
  // point 5, on the upper line: straight on to the station that is not on the line; its reverse road climbs to the top
  b += track('M402 182L458 92H620') + leverTag(5, 380, 226);
  // point 7, on the main line: its reverse road drops toward a bridge that is gone
  b += track('M522 342L566 410H600') + bufferStop(606, 410) + leverTag(7, 506, 292);
  // where each road goes
  b += roundel(HOME, 652, 92, 24) + roundel('eye', 652, 200, 24) + roundel('mountain', 722, 320, 24) + roundel('wave', 640, 410, 24);
  // the signals, each beside the road it guards
  b += semaphore(90, 310, 1) + semaphore(580, 102, 4, 1) + semaphore(580, 210, 3, 1) + semaphore(682, 330, 8, 1);
  // the key: a black disc is a point, a red one a signal
  b += `<rect x="30" y="384" width="150" height="46" rx="6" fill="none" stroke="${M.paperDark}" stroke-width="2"/>`
    + `<circle cx="54" cy="407" r="11" fill="${ink}"/><path d="M70 412H104M76 404L96 392" stroke="${ink}" stroke-width="4" fill="none"/>`
    + `<circle cx="128" cy="407" r="11" fill="#a3322a"/><path d="M146 418V398" stroke="${ink}" stroke-width="3"/><rect x="146" y="398" width="20" height="6" fill="#a3322a"/>`;
  return b;
})() };

/* ---- the driver's route card ---- */
const routeArt = { w: 400, h: 500, body: `<rect width="400" height="500" fill="${M.woodDark}"/><rect x="20" y="20" width="360" height="460" rx="10" fill="#efe6cc" stroke="${M.ink}" stroke-width="3"/>`
  + crescent(200, 110, 46, M.brassDark)
  + `<path d="M200 182V300" stroke="${M.ink}" stroke-width="8" stroke-dasharray="18 12"/><path d="M176 290L200 322L224 290" stroke="${M.ink}" stroke-width="8" fill="none" stroke-linejoin="round"/>`
  + roundel(HOME, 200, 392, 50) };

/* ---- the ground frame ---- */
const frame = (keys, pulled = []) => {
  // the frame stands against the whitewashed boards of its hut, so a black lever shows as plainly as a red one
  let b = `<rect width="760" height="420" fill="#a89c80"/>` + Array.from({ length: 7 }, (_, i) => `<path d="M0 ${30 + i * 56}H760" stroke="#8e8268" stroke-width="3"/>`).join('')
    + `<rect x="20" y="300" width="720" height="40" rx="6" fill="#3a2a16" stroke="#120c08" stroke-width="4"/>`;
  for (let n = 1; n <= 10; n++) {
    const x = 70 + (n - 1) * 69, kind = LEVER_KIND[n], col = kind === 'signal' ? '#a3322a' : kind === 'point' ? '#1c140c' : '#e6dcc0';
    const rod = (d) => `<path d="${d}" stroke="#2a2018" stroke-width="22" stroke-linecap="round"/><path d="${d}" stroke="${col}" stroke-width="15" stroke-linecap="round"/><path d="${d}" stroke="#fff" stroke-opacity=".18" stroke-width="4"/>`;
    const upright = rod(`M${x} 300V90`) + `<rect x="${x - 14}" y="80" width="28" height="18" rx="6" fill="#5a5a62" stroke="#2a2018" stroke-width="2"/>`;
    const over = rod(`M${x} 300L${x - 70} 110`) + `<rect x="${x - 84}" y="98" width="28" height="18" rx="6" fill="#5a5a62" stroke="#2a2018" stroke-width="2" transform="rotate(-20 ${x - 70} 107)"/>`;
    const plate = `<rect x="${x - 24}" y="346" width="48" height="40" rx="5" fill="${M.brass}" stroke="#120c08" stroke-width="3"/>` + W(x, 374, String(n), { size: 22, fill: '#120c08', weight: 700, face: 'num' });
    b += keys ? `<g data-key="${n}"><rect x="${x - 34}" y="70" width="68" height="330" fill="#000" opacity="0"/><g class="sw-off">${upright}</g><g class="sw-on">${over}</g>${plate}</g>`
      : (pulled.includes(String(n)) ? over : upright) + plate;
  }
  return b;
};

/* ---- the whistle, and the regulator ---- */
function whistleBody(st) {
  let b = `<rect x="10" y="80" width="220" height="170" rx="14" fill="#241a0c" stroke="#5c4423" stroke-width="6"/>`
    + `<path d="M70 96V30" stroke="${M.brass}" stroke-width="8"/><circle cx="70" cy="24" r="14" fill="${M.brass}"/><path d="M70 30q30 -10 60 4" stroke="#8a7448" stroke-width="3" fill="none"/>`
    + `<path d="M160 230L190 120" stroke="#3a2a16" stroke-width="16" stroke-linecap="round"/><circle cx="192" cy="114" r="14" fill="#a3322a"/>`
    + `<rect x="120" y="150" width="90" height="56" rx="8" fill="#0d0805"/>`;
  if (st.live) b += `<ellipse class="steam" cx="70" cy="0" rx="20" ry="10" fill="#c8ccda" opacity=".45"/>`;
  return b;
}

const POS4 = {
  routecard: { x: 27.5,  y: 13.3, w: 5,     h: 11.1 },
  diagram:   { x: 72.5,  y: 14.4, w: 23.75, h: 25.3 },
  levers:    { x: 72.5,  y: 56.7, w: 23.75, h: 32.8 },
  whistle:   { x: 4.4,   y: 54.4, w: 15,    h: 28.9 },
};

const ROOM4 = {
  id:'locomotive', name:'Room 4 — The Locomotive', scene:'locomotive', stageFx:'rocking',
  relays:[{el:'rl-locomotive',mode:'pulse',period:2.4}],
  wrongSound:'clank',
  wrongVfx:'sparks',
  intro:"The cab is empty, the fire is roaring, and the regulator is wide open. The junction is coming up fast.",
  objective:"Set the road home at the junction, then <b>whistle and go</b>. Whatever opens a lock is somewhere else in this cab.",
  entryBeat:"Nobody is driving. The firebox door swings open and shut on its own, feeding the fire, and the punch clicks once in the tender behind you.",
  entrySound:'clank',
  completeText:"The whistle screams, the points clatter under the wheels, and the Special leans onto the road home.",
  chain:`The driver's route card shows this train, the crescent, going home to the crown: the terminus. On the diagram the road to the crown leaves the main line at point 2 and climbs again at point 5, both on the roads drawn with a gap (reverse), past signal 1 at the entry and signal 4 at the top; the ground frame wants exactly levers ${ROAD_HOME.slice().sort((a, b) => a - b).join(', ')} pulled → then the whistle and the regulator together.`,
  objects:[
    { id:'routecard', icon:'🪪', name:"The Driver's Route Card", pos:POS4.routecard,
      desc:"Pinned by the cab window: where this train goes at the junction.",
      figure:ART.svg(routeArt.w, routeArt.h, routeArt.body),
      sprite:ART.sprite(POS4.routecard, routeArt.w, routeArt.h, routeArt.body) },
    { id:'diagram', icon:'🗺️', name:'The Junction Diagram', pos:POS4.diagram,
      desc:"The junction, and the ground frame's levers by number: what each one works, and where each road goes.",
      figure:ART.svg(diagramArt.w, diagramArt.h, diagramArt.body),
      sprite:ART.sprite(POS4.diagram, diagramArt.w, diagramArt.h, diagramArt.body) },
    { id:'levers', icon:'🎚️', name:'Ground Frame', pos:POS4.levers,
      desc:"Ten levers, in reach of the cab steps: red for signals, black for points, white for spare. Pull the ones that set the road.",
      sprite:st=>ART.sprite(POS4.levers, 760, 420, frame(false, st.solved ? ROAD_HOME : [])),
      puzzle:{ type:'toggle', from:['diagram', 'routecard'], figure:ART.svg(760, 420, frame(true)), answer:ROAD_HOME, tryLabel:'SET THE ROAD',
        gm:'pull levers 1, 2, 4 and 5: the entry signal, both points to their reverse roads, and the signal for the road to the crown',
        miss:"The frame locks solid. That road does not lead home, or a signal is wrong.",
        hints:[
          "The route card shows where this train should go: up the junction to the crown, the terminus. The diagram shows which lever works which point and which signal.",
          "Follow the road from the left to the crown. Where it leaves the straight line, the point must be pulled over (the road drawn with a gap). Every signal it passes must be pulled off too. Leave everything else alone.",
          "Pull levers 1, 2, 4 and 5."
        ],
        solvedText:"The levers go over with a long iron groan, and out in the dark ahead, the points swing for home." } },
    { id:'whistle', icon:'🚂', name:'Whistle & Regulator', pos:POS4.whistle, needs:'levers',
      desc:"The road is set. Somebody on the whistle cord, somebody on the regulator, at the same moment.",
      deadDesc:"The whistle and the regulator. Go now and the train takes whatever road the junction is set to.",
      deadFigure:st=>ART.svg(240, 260, whistleBody(st)),
      sprite:st=>ART.sprite(POS4.whistle, 240, 260, whistleBody(st)),
      puzzle:{ type:'simul',
        stations:[{id:'loco-whistle',label:'Whistle Cord',icon:'📯'},{id:'loco-regulator',label:'Regulator',icon:'🎚️'}],
        need:2, pullLabel:'WHISTLE AND GO',
        hints:[
          "This takes two pairs of hands at once. Anyone on a phone can take the whistle or the regulator.",
          "Split up: one of you on the whistle cord, one on the regulator.",
          "Once both show somebody in place, press WHISTLE AND GO."
        ] } },
  ]
};

const ROOMS = [ROOM1, ROOM2, ROOM3, ROOM4];

registerScenario({
  id:'midnight', classic:true,
  title:'The Midnight Special',
  sub:'1927 · the overnight express · a stop that isn’t on the line',
  tagline:'An empty express, supper still steaming, and a Conductor who punches tickets nobody bought.',
  icon:'🚂',
  card:`<svg viewBox="0 0 300 130" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="cgM" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0a0a14"/><stop offset="1" stop-color="#241a12"/></linearGradient></defs>
    <rect width="300" height="130" fill="url(#cgM)"/>
    ${[0,1,2].map(i=>`<line class="railstripe" x1="0" y1="${30+i*16}" x2="300" y2="${32+i*16}" stroke="#8f86a8" stroke-width="1.5" stroke-dasharray="26 60" opacity=".4"/>`).join('')}
    <rect x="40" y="70" width="200" height="40" rx="8" fill="#241207"/>
    ${[0,1,2,3].map(i=>`<rect class="flick" x="${58+i*48}" y="80" width="22" height="16" rx="3" fill="#c9a04a" opacity=".85" style="animation-delay:${i*.4}s"/>`).join('')}
    <circle cx="70" cy="114" r="9" fill="none" stroke="#0d0805" stroke-width="4"/>
    <circle cx="210" cy="114" r="9" fill="none" stroke="#0d0805" stroke-width="4"/>
    <ellipse class="steam" cx="52" cy="60" rx="12" ry="6" fill="#8f86a8" opacity=".35"/>
  </svg>`,
  titleFx:'rails', titleLightning:false,
  titleArt:`<svg viewBox="0 0 560 200">
    ${[0,1,2,3].map(i=>`<line class="railstripe" x1="0" y1="${40+i*20}" x2="560" y2="${42+i*20}" stroke="#8f86a8" stroke-width="1.5" stroke-dasharray="30 70" opacity=".35"/>`).join('')}
    <rect x="80" y="120" width="400" height="56" rx="10" fill="#241207"/>
    ${[0,1,2,3,4,5].map(i=>`<rect class="flick" x="${108+i*62}" y="134" width="30" height="22" rx="4" fill="#c9a04a" opacity=".85" style="animation-delay:${i*.35}s"/>`).join('')}
    <rect x="52" y="96" width="70" height="80" rx="8" fill="#170f08"/>
    <circle class="slowblink" cx="87" cy="120" r="8" fill="#ffd98c"/>
    ${[130,230,330,430].map(x=>`<circle cx="${x}" cy="182" r="12" fill="none" stroke="#0d0805" stroke-width="5"/>`).join('')}
    <ellipse class="steam" cx="70" cy="80" rx="20" ry="9" fill="#8f86a8" opacity=".4"/>
    <ellipse class="steam" cx="96" cy="66" rx="14" ry="7" fill="#8f86a8" opacity=".3" style="animation-delay:1.6s"/>
  </svg>`,
  story:[
    "The Midnight Special left the terminus at 11:50 with a full first class, a string quartet, and hot supper service. You woke at a station stop that appears on no timetable — and you are, as far as you can tell, the only souls left aboard.",
    "The supper is still steaming. The berths are turned down. And somewhere down the corridor, patient as arithmetic, a ticket punch clicks — the Conductor, keeping accounts for a company that closed its books in 1887.",
    "There is one junction left where this line still touches the living one. Reach the locomotive, set the road home at the junction, and whistle for it — before the timetable runs out of minutes. And whatever you hear behind you: your ticket is <em>not</em> ready."
  ],
  begin:'🚂 BEGIN — 45:00', finalButton:'MAKE THE JUNCTION 🚂',
  emojis:['🚂','🎩','🕰️','🎻','🥃','🎫','🌙','🔔','🧳','🪞','🐈‍⬛','💀'],
  ratings:['🏆 Master of the Line','🚂 First-Class Escapist','🎫 Coach Passenger','🛟 Barely Made the Junction','🌙 Riding Forever'],
  shareTitle:'ESCAPED THE MIDNIGHT SPECIAL!',
  victoryTitle:'🚂 THE JUNCTION IS YOURS',
  victoryProse:`The whistle screams into the dark, the points clatter under the wheels, and the Special leans off the dead line onto the living one hard enough to throw sparks past the windows.<br><br>
    Dawn comes up like a held breath released. Far behind you, on the dead line, a station that is not on any map stands lit for a moment — and on its platform a lantern swings side to side, and a gloved hand raises a ticket punch in salute. Accounts settled. Passage paid.<br><br>
    The next station has a name you recognize. You have never been so glad to hear a timetable read aloud.`,
  gameOverProse:`Somewhere behind you a clock finishes striking six, and the timetable simply… ends.<br><br>The Special glides on into the blank pages, smooth as sleep. Down the corridor, the ticket punch begins — unhurried, patient — to click its way toward the cab.`,
  flare:{x:160,y:560,hue:[255,215,140]},
  ambience:[
    {drone:.04, hum:.03, wind:.03},
    {drone:.04, hum:.03, wind:.025},
    {drone:.045, hum:.035, wind:.02},
    {drone:.06, hum:.05, wind:.05}
  ],
  fx:['soot','soot','pollen','embers'],
  events:[
    [{s:'clack',p:.65},{s:'creak',p:.3,v:'shadow'}],
    [{s:'clack',p:.65},{s:'crackle',p:.22,v:'sparks'}],
    [{s:'clack',p:.6},{s:'bell',p:.14}],
    [{s:'chug',p:.5,v:'shake'},{s:'whistlefar',p:.2,v:'dim'}]
  ],
  // shown free of charge when a team has gone quiet for a while
  nudges:[
    "The car sways over a joint in the rails. {it} slides into view.",
    "A door swings on its latch somewhere down the corridor. You think of {it}.",
    "Cutlery shivers on the tables. Your eye goes to {it}.",
    "The firebox roars and settles. {it} is the thing still waiting."
  ],
  // Three times a game something happens TO the team rather than around
  // them: the lights fail, something crosses the room, and a clue they had
  // already settled turns up disturbed.
  intrusions:{
    squeeze:'The lights fail the length of the train. For a while there is only the rail joints underneath you, counting.',
    arrival:'A figure passes the corridor glass, walking the other way. The train is doing sixty.',
    midroom:'The setting you had already laid out has been turned back. The table is exactly as it was before you touched it.'
  },
  // One wording for every lock in this fiction: a salt-seized crate and a
  // frozen hut safe do not fail the same way.
  padMiss:'The brass does not click. The carriage sways on.', padHow:'Key in the figures. A wrong set only costs 5 seconds of track.',
  wrongBeats:WRONG_BEATS, wrongSounds:WRONG_SOUNDS,
  scenes:SCENES, rooms:ROOMS
});
})();
