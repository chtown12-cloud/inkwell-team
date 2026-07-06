/* ============================================================
   SCENARIO: THE MIDNIGHT SPECIAL (1927 ghost train)
   The overnight express stopped at a station that isn't on
   the line. The other passengers are gone. The Conductor
   still walks the corridor, punching tickets nobody bought.
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
<!-- steamer trunks -->
<g id="art-trunks">
${[['PEMBERTON',480,700,-3],['ROSSITER',650,730,2],['CARMODY',820,700,-2],['WHITAKER',990,732,3],['KESTREL',1160,702,-3],['HARGREAVES',1330,730,2]].map(([nm,x,y,r])=>
 `<g transform="rotate(${r} ${x} ${y})">
  <rect x="${x-70}" y="${y-52}" width="140" height="94" rx="10" fill="#4a2f1a" stroke="#2c1c0e" stroke-width="4"/>
  <line x1="${x-70}" y1="${y-6}" x2="${x+70}" y2="${y-6}" stroke="#2c1c0e" stroke-width="5"/>
  ${[-38,0,38].map(dx=>`<rect x="${x+dx-5}" y="${y-52}" width="10" height="94" fill="#8a6a3a"/>`).join('')}
  <rect x="${x-34}" y="${y+8}" width="68" height="22" rx="3" fill="#d9cba6"/>
  <text x="${x}" y="${y+23}" text-anchor="middle" font-family="Special Elite" font-size="9" fill="#3a2d1c">${nm}</text></g>`).join('')}
</g>
<!-- the fare card, framed on the wall -->
<g id="art-farecard">
  <rect x="640" y="200" width="120" height="150" fill="#d9cba6" stroke="#5c4423" stroke-width="7" transform="rotate(-2 700 275)"/>
  <text x="700" y="232" text-anchor="middle" font-family="Special Elite" font-size="10" fill="#7a2a1a" transform="rotate(-2 700 275)">FARE CARD</text>
  ${[0,1,2,3,4].map(i=>`<line x1="656" y1="${250+i*18}" x2="744" y2="${247+i*18}" stroke="#5a4a34" stroke-width="3" transform="rotate(-2 700 275)"/>`).join('')}
</g>
<!-- porter's desk -->
<g id="art-desk">
  <rect x="430" y="440" width="240" height="18" fill="#5c4423"/>
  <rect x="446" y="458" width="208" height="120" fill="#3a2a1a"/>
  <rect x="470" y="400" width="90" height="40" rx="4" fill="#2c1c0e"/>
  <circle cx="515" cy="420" r="12" fill="#c9a04a"/>
  <path d="M580 414 l60 -10 4 22 -60 10z" fill="#d9cba6"/>
</g>
<!-- mail cage -->
<g id="art-mailcage">
  <rect x="1140" y="220" width="300" height="360" fill="#100a06" stroke="#5c4423" stroke-width="8"/>
  ${[0,1,2,3,4,5,6].map(i=>`<line x1="${1162+i*40}" y1="220" x2="${1162+i*40}" y2="580" stroke="#5c4423" stroke-width="4"/>`).join('')}
  ${[0,1,2].map(i=>`<line x1="1140" y1="${290+i*100}" x2="1440" y2="${290+i*100}" stroke="#5c4423" stroke-width="4"/>`).join('')}
  ${[0,1,2].map(i=>`<path d="M${1180+i*80} 580 q-6 -50 24 -56 q30 6 24 56z" fill="#8a7448"/>`).join('')}
  <rect x="1250" y="420" width="70" height="90" fill="#0d0805" stroke="#c9a04a" stroke-width="3"/>
</g>
<!-- waybill on clip -->
<g id="el-waybill">
  <rect x="900" y="300" width="110" height="150" fill="#d9cba6" transform="rotate(-2 955 375)"/>
  <text x="955" y="330" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#7a2a1a" transform="rotate(-2 955 375)">WAYBILL</text>
  ${[0,1,2,3,4].map(i=>`<line x1="916" y1="${348+i*20}" x2="996" y2="${344+i*20}" stroke="#5a4a34" stroke-width="3" transform="rotate(-2 955 375)"/>`).join('')}
  <circle cx="955" cy="302" r="5" fill="#8a6a3a"/>
</g>
<!-- crates -->
<g>
  ${[0,1].map(i=>`<rect x="${540+i*130}" y="${606-i*40}" width="110" height="${90+i*40}" fill="#4a3520" stroke="#2c1c0e" stroke-width="4"/>`).join('')}
  <text x="600" y="660" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#8a6a3a">HALIFAX</text>
</g>
<!-- a top hat, left on a crate -->
<g><ellipse cx="710" cy="600" rx="34" ry="8" fill="#0d0805"/><rect x="688" y="560" width="44" height="40" rx="4" fill="#100a06"/></g>
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
  <text x="${195+i*330}" y="288" text-anchor="middle" font-family="Special Elite" font-size="22" fill="#3a2d1c">${i+1}</text>
</g>`).join('')}
<!-- cabin 3 stands ajar, gramophone light inside -->
<rect x="782" y="226" width="90" height="370" fill="#0d0805"/>
<ellipse class="flick" cx="822" cy="480" rx="60" ry="90" fill="#c9a04a" opacity=".12"/>
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
<!-- gramophone in cabin 3 -->
<g id="art-gramophone">
  <rect x="790" y="470" width="80" height="70" fill="#3a2a16"/>
  <circle cx="830" cy="470" r="30" fill="#170f08" stroke="#5c4423" stroke-width="4"/>
  <path d="M840 450 q40 -40 60 -14 q12 18 -18 34" fill="#c9a04a" opacity=".9"/>
  <circle cx="830" cy="470" r="5" fill="#c9a04a"/>
</g>
<!-- the run-out groove panel (appears) -->
<g id="el-runout">
  <rect x="920" y="440" width="130 " height="110" rx="8" fill="#241a0c" stroke="#5c4423" stroke-width="5"/>
  <circle cx="985" cy="480" r="30" fill="#0d0805"/>
  ${[22,14].map(r=>`<circle cx="985" cy="480" r="${r}" fill="none" stroke="#3a2a16" stroke-width="2"/>`).join('')}
  <circle class="slowblink" cx="985" cy="528" r="6" fill="#ffd98c"/>
</g>
<!-- locked valise -->
<g id="el-valise">
  <rect x="360" y="680" width="150" height="90" rx="14" fill="#4a2f1a" stroke="#2c1c0e" stroke-width="5" transform="rotate(-4 435 725)"/>
  <rect x="410" y="668" width="50" height="16" rx="8" fill="#2c1c0e" transform="rotate(-4 435 725)"/>
  <rect x="415" y="700" width="40" height="26" rx="4" fill="#c9a04a" transform="rotate(-4 435 725)"/>
  <text x="435" y="800" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#8a6a3a">ZNK IRGYV...</text>
</g>
<!-- berth 13 door, different from the rest -->
<g id="el-berthlock">
  <rect x="1330" y="240" width="150" height="360" rx="6" fill="#241207" stroke="#170a04" stroke-width="8"/>
  <rect x="1360" y="270" width="90" height="60" rx="4" fill="#8a2418"/>
  <text x="1405" y="308" text-anchor="middle" font-family="Special Elite" font-size="22" fill="#e0cfa2">13</text>
  ${[0,1,2].map(i=>`<circle cx="${1380+i*24}" cy="450" r="9" fill="#0d0805" stroke="#c9a04a" stroke-width="3"/>`).join('')}
</g>
<!-- diary on the carpet -->
<g id="art-diary">
  <path d="M600 780 l70 -12 8 34 -70 13z" fill="#d9cba6" transform="rotate(6 635 795)"/>
  <path d="M670 768 l64 8 -3 34 -64 -8z" fill="#cfc0a0" transform="rotate(6 635 795)"/>
</g>
<!-- punched tickets scattered -->
${[[980,700,-10],[1060,740,14],[1150,700,-4]].map(([x,y,r])=>`<g transform="rotate(${r} ${x} ${y})"><rect x="${x-26}" y="${y-14}" width="52" height="28" rx="4" fill="#d9cba6"/><circle cx="${x+12}" cy="${y}" r="4" fill="#2c1f14"/></g>`).join('')}
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
<!-- chef's board -->
<g>
  <rect x="1050" y="310" width="100" height="140" fill="#241a0c" stroke="#3a2a16" stroke-width="5"/>
  <text x="1100" y="340" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#d9cba6">TONIGHT</text>
  ${[0,1,2].map(i=>`<line x1="1066" y1="${360+i*24}" x2="1134" y2="${360+i*24}" stroke="#8a6a3a" stroke-width="3"/>`).join('')}
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
</g>`).join('')}
</g>
<!-- the till -->
<g id="el-till">
  <rect x="1360" y="480" width="130 " height="100" rx="8" fill="#3a2416" stroke="#241a0c" stroke-width="5"/>
  <rect x="1376" y="496" width="98" height="34" rx="4" fill="#0d0805"/>
  <text class="flick" x="1425" y="520" text-anchor="middle" font-family="Special Elite" font-size="16" fill="#c9a04a">£ --.-</text>
  ${[0,1,2].map(i=>`<circle cx="${1392+i*32}" cy="552" r="9" fill="#c9a04a"/>`).join('')}
</g>
<!-- kitchen service hatch + bell -->
<g id="el-servicebell">
  <rect x="60" y="330" width="180" height="150" fill="#0d0805" stroke="#5c4423" stroke-width="7"/>
  <rect x="76" y="346" width="148" height="90" fill="#170f08"/>
  <path d="M130 452 a18 18 0 0 1 36 0 l4 14 h-44z" fill="#c9a04a"/>
  <circle id="bell-lamp" cx="148" cy="478" r="8" fill="#ffdf9c" opacity=".1"/>
  <text x="150" y="510" text-anchor="middle" font-family="Special Elite" font-size="10" fill="#8a6a3a">SERVICE</text>
</g>
<!-- abandoned violin on a chair -->
<g>
  <rect x="530" y="700 " width="70" height="90" rx="8" fill="#3a2416"/>
  <path d="M545 700 q-10 -34 14 -44 q-16 -8 -8 -26 q22 -10 30 8 q8 -6 14 2 q-22 44 -50 60z" fill="#8a4a24"/>
  <line x1="551" y1="630" x2="583" y2="666" stroke="#170f08" stroke-width="2.5"/>
</g>
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
<!-- brake & levers -->
<g>
  <rect x="180" y="430" width="16" height="180" fill="#3a2a16" transform="rotate(-14 188 520)"/>
  <circle cx="166" cy="424" r="16" fill="#8a2418"/>
  <rect x="260" y="450" width="14" height="160" fill="#3a2a16" transform="rotate(8 267 530)"/>
  <circle cx="276" cy="446" r="13" fill="#c9a04a"/>
</g>
<!-- fire drill card -->
<g id="el-fireboxcard">
  <rect x="440" y="480" width="120" height="160" rx="6" fill="#d9cba6" transform="rotate(-4 500 560)"/>
  <text x="500" y="512" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#7a2a1a" transform="rotate(-4 500 560)">FIRE DRILL</text>
  ${[0,1,2,3,4].map(i=>`<line x1="458" y1="${530+i*20}" x2="542" y2="${526+i*20}" stroke="#5a4a34" stroke-width="3" transform="rotate(-4 500 560)"/>`).join('')}
</g>
<!-- signal lantern case -->
<g id="el-lantern">
  <rect x="1120" y="480" width="130" height="150" rx="10" fill="#241a0c" stroke="#5c4423" stroke-width="6"/>
  <rect x="1150" y="510" width="70" height="80" rx="8" fill="#0d0805" stroke="#c9a04a" stroke-width="4"/>
  <circle class="flick" cx="1185" cy="550" r="18" fill="#8a2418"/>
  <circle cx="1185" cy="466" r="8" fill="#c9a04a"/>
</g>
<!-- timetable board -->
<g id="el-timetable">
  <rect x="1300" y="180" width="220" height="240" fill="#241a0c" stroke="#3a2a16" stroke-width="7"/>
  <text x="1410" y="214" text-anchor="middle" font-family="Special Elite" font-size="14" fill="#d9cba6">TIME TABLE</text>
  ${[0,1,2,3,4,5].map(i=>`<line x1="1320" y1="${234+i*28}" x2="${1500-((i%3)*20)}" y2="${234+i*28}" stroke="#8a6a3a" stroke-width="3"/>`).join('')}
</g>
<!-- coupling pins -->
<g id="el-coupling">
  <rect x="1300" y="640" width="220 " height="160" rx="12" fill="#2c1c10" stroke="#170f08" stroke-width="7"/>
  ${[0,1,2,3].map(i=>`<g><rect x="${1322+i*52}" y="668" width="34" height="76" rx="8" fill="#170f08" stroke="#c9a04a" stroke-width="3"/>
   <text x="${1339+i*52}" y="712" text-anchor="middle" font-size="15" fill="#e0cfa2">${'★✚●■'[i]}</text></g>`).join('')}
  <text x="1410" y="774" text-anchor="middle" font-family="Special Elite" font-size="10" fill="#8a6a3a">PULLED IN REVERSE</text>
</g>
<!-- whistle pull (final) -->
<g id="el-whistle">
  <rect x="80" y="640 " width="240" height="180" rx="14" fill="#241a0c" stroke="#5c4423" stroke-width="6"/>
  <line x1="160" y1="660" x2="160" y2="600" stroke="#c9a04a" stroke-width="8"/>
  <circle cx="160" cy="592" r="14" fill="#c9a04a"/>
  <ellipse class="steam" cx="160" cy="560" rx="18" ry="9" fill="#c8ccda" opacity=".4"/>
  <rect x="200" y="680" width="100" height="60" rx="8" fill="#0d0805"/>
  ${[0,1,2].map(i=>`<circle class="slowblink" cx="${226+i*26}" cy="710" r="8" fill="#ffd98c" style="animation-delay:${i*.4}s"/>`).join('')}
</g>
<!-- the conductor's punch, hanging by the door -->
<g><line x1="1080" y1="440" x2="1080" y2="470" stroke="#170f08" stroke-width="3"/>
<path d="M1068 470 q12 -10 24 0 l-4 26 q-8 6 -16 0z" fill="#8a8a92"/></g>
</svg>`;

const WRONG_BEATS=[
  "From the far end of the corridor: the crisp, unhurried CLICK of a ticket punch. One seat closer than last time.",
  "The gas lamps dim in sequence, front of the car to back — the way they do when someone walks past them.",
  "In the window's reflection, for half a heartbeat, every seat in the car is occupied. Then they're not.",
  "The train slows — almost stops — then hauls forward again, as though something climbed aboard.",
  "A voice two cars back, muffled and courteous: “Tickets, please.” Nobody answers it anymore."
];
const WRONG_SOUNDS=['clank','hiss','knock','clank','bell'];

const ROOMS=[
/* ============ ROOM 1 — THE BAGGAGE CAR ============ */
{
  id:'baggage', name:'Room 1 — The Baggage Car', scene:'baggage',
  intro:"You woke between stations to an empty train. The baggage car is the way forward — and everyone's luggage is still here.",
  objective:"Work toward the front of the train — <b>glowing rings</b> mark what the passengers left behind.",
  entryBeat:"Six trunks, packed for six passengers you dined with at eight o'clock. The dust on the latches says the trunks have been here for years.",
  entrySound:'clack',
  completeText:"The forward door unbolts. Through it, the sleeper corridor sways gently — and at its far end, a shape in a peaked cap turns, unhurried, into a cabin that has no floor number.",
  chain:"Trunk tags: book cipher (line·word into the Standing Orders) spells PORTER → the porter's desk pairs punch-marks with classes; the fare card gives the order (first class down to freight) → 8253 → mail cage riddle (TIME) — “on this train it runs backward” = EMIT → the waybill cross-references Halifax crates, crates remaining, and the mail sacks → 49.",
  objects:[
    { id:'trunks', icon:'🧳', name:'Steamer Trunks', pos:{x:26,y:66,w:66,h:18},
      desc:"Six steamer trunks in a luggage row. Each shipping tag carries a pair of numbers — a LINE and a WORD — keyed to the company's Standing Orders bolted to the wall above them:\n\n1. All passengers present tickets promptly on request.\n2. Passengers of the overnight service remain seated.\n3. Refreshments are served rearward, then removed.\n4. The evening express tolerates no exceptions ever.\n\nTAGS (line·word):  1·2   ·   2·4   ·   3·1   ·   4·4   ·   4·2   ·   3·4\n\nA stencil on the rack rail explains the tags: “EACH TAG NAMES A WORD. THE WORD'S FIRST LETTER IS YOURS.”",
      puzzle:{
        prompt:"The trunks hide a word. Whose desk should you search?",
        placeholder:"SIX LETTERS", answers:['PORTER'],
        hints:[
          "It's a book cipher: each pair points at a word in the Standing Orders (line, then word number). Take that word's FIRST letter.",
          "1·2 = line 1, word 2 = “passengers” = P.  2·4 = “overnight” = O.  3·1 = “Refreshments” = R.",
          "1·2 P, 2·4 O, 3·1 R, 4·4 “tolerates” T, 4·2 “evening” E, 3·4 “rearward” R — the PORTER's desk."
        ],
        solvedText:"P-O-R-T-E-R. The porter's desk — cash box locked at four digits, ledger open, chair still warm. You choose not to dwell on the chair."
      }
    },
    { id:'farecard', icon:'🎫', name:'The Fare Card', pos:{x:38,y:20,w:10,h:22},
      desc:"The company fare card, framed on the wall above the porter's desk:\n\n“GREAT NORTHERN & COASTAL RAILWAY —\nFARES SHALL BE RECKONED, AND TAKINGS COUNTED,\nFROM FIRST CLASS DOWN TO FREIGHT.\nNO EXCEPTIONS. NO REFUNDS.\nNO PASSAGE WITHOUT A PUNCHED TICKET.”\n\nSomeone has underlined the last line. The ink is fresh." },
    { id:'desk', icon:'🗃️', name:"The Porter's Desk", pos:{x:28,y:44,w:15,h:18},
      desc:"The porter's cash box wears a 4-digit lock. His punch-mark chart is pasted to the desk — four punch shapes, each with a takings figure, in no particular order:\n\n★ 8      ✚ 2      ● 5      ■ 3\n\nAnd the company chart beside it pairs punches with classes:\n\n★ FIRST CLASS   ✚ SECOND CLASS   ● THIRD CLASS   ■ FREIGHT\n\nDigits, but no sequence. The company counted its money in one fixed order — every porter knew it by heart, and the rule is posted somewhere in this car.",
      puzzle:{
        prompt:"Enter the 4-digit code.", placeholder:"0000", answers:['8253'],
        hints:[
          "You need the classes in the official order — read the framed FARE CARD on the wall above the desk.",
          "The fare card: “COUNT THE TAKINGS FROM FIRST CLASS DOWN TO FREIGHT.”",
          "★8 ✚2 ●5 ■3 → enter 8253."
        ],
        solvedText:"8-2-5-3 and the cash box opens. Inside: no money — only a conductor's pocket watch, stopped dead, and a single ticket stamped with one word, the stamp mirrored: EMIT… no. Read it from the other side: TIME.",
        solveBeat:"The stopped watch in your hand ticks once. Only once. As if something, somewhere, allowed the train one more second.",
        beatSound:'clank'
      }
    },
    { id:'mailcage', icon:'📮', name:'The Mail Cage', pos:{x:70,y:24,w:20,h:42},
      desc:"The mail cage is locked with a 4-letter dial. A riddle is engraved on the frame, in the flourished hand of a company that took pride in such things:\n\n“I am taken, kept, lost, and killed,\nyet no hand has ever touched me.\nWhat am I?”\n\nAnd punched below it, crooked, recent:\n\n“ON THIS TRAIN, IT RUNS BACKWARD.”",
      puzzle:{
        prompt:"Set the four letter dials.", placeholder:"FOUR LETTERS", answers:['EMIT'],
        hints:[
          "Solve the riddle first — something taken, kept, lost and killed without being touched.",
          "The riddle's answer is TIME — the mirrored ticket agrees. On this train, it runs backward.",
          "TIME reversed is EMIT. Enter EMIT."
        ],
        solvedText:"E-M-I-T — time, running backward, like everything aboard tonight. The cage opens on three mail sacks, all full, all addressed to towns that stopped existing before you were born."
      }
    },
    { id:'waybill', icon:'📄', name:'The Waybill', pos:{x:54,y:31,w:10,h:19}, hiddenUntil:'mailcage',
      desc:"The car's waybill hangs clipped inside the cage, next to the forward door and its 2-digit lock. The bill reads:\n\n“FORWARD DOOR — first figure: crates loaded at Halifax, LESS the crates still standing in this car. Second figure: the mail sacks, TRIPLED.”\n\nThe manifest line above it: “ELEVEN crates loaded at Halifax.” You count the car: SEVEN remain.",
      puzzle:{
        prompt:"Enter the 2-digit code.", placeholder:"TWO DIGITS", answers:['49'],
        hints:[
          "Two numbers are on the bill and in this car; the third you just uncaged.",
          "11 loaded minus 7 remaining is 4. Three mail sacks, tripled, is 9.",
          "4 then 9 — enter 49."
        ],
        solvedText:"4-9. The forward bolt slides — and from the corridor beyond, faint and courteous, comes the click of a ticket punch, testing itself.",
        solveBeat:"Behind you in the baggage car, one trunk latch pops open. Just one. As if something wanted you to know which passenger it kept.",
        beatSound:'knock'
      }
    }
  ]
},
/* ============ ROOM 2 — THE SLEEPER CORRIDOR ============ */
{
  id:'sleeper', name:'Room 2 — The Sleeper Corridor', scene:'sleeper',
  intro:"Four cabins, all made up for the night. Cabin 3 stands ajar, and a gramophone is playing to nobody.",
  objective:"The passengers' things remember more than the passengers. Find the record's speed — then <b>listen to the groove.</b>",
  entryBeat:"Every cabin's berth is turned down, and on every pillow sits a ticket, neatly punched. You did not hear him pass. You never hear him pass.",
  entrySound:'clack',
  completeText:"Berth 13's door swings open on an empty room and a cold draft moving toward the dining car. You follow it, because the alternative is staying.",
  chain:"Passenger diary (“he played it at 78, only ever the fourth song”) → set the gramophone to 78.4 → the run-out groove clicks morse = WRONG STOP → the valise rail-fence cipher (two rails, BAERK) = BRAKE → berth 13 boarding-order logic (seat 7 between, 2 before 6) = 276.",
  objects:[
    { id:'diary', icon:'📔', name:"A Passenger's Diary", pos:{x:36,y:82,w:11,h:12},
      desc:"A lady's travel diary, dropped open on the runner:\n\n“The man in Cabin 3 plays his gramophone at all hours. Always at 78, and only ever the FOURTH song on the record — he lifts the needle back, again and again.”\n\n“I asked the Conductor to speak to him. The Conductor said — and I am sure I misheard — that Cabin 3 has been empty since the accident.”" },
    { id:'gramophone', icon:'📻', name:'The Gramophone', pos:{x:48,y:48,w:12,h:16},
      desc:"Cabin 3's gramophone, brass horn dented, turntable waiting. The speed dial is a strange aftermarket thing — speed, then a point, then the track.\n\nThe diary said he only ever played one song.",
      puzzle:{
        type:'dial',
        prompt:"Set the speed and track, then DROP THE NEEDLE.",
        answers:['784'],
        dial:{min:600,max:900,div:10,target:784,pad:4,meter:'GROOVE TRACKING',lock:'DROP THE NEEDLE',miss:'the needle skates across dead wax.',nearMorse:'.-- .-. --- -. --.  ... - --- .--.'},
        hints:[
          "The diary gives both parts: the speed, then the song he replayed.",
          "He played it at 78 — and only ever the FOURTH song. Speed, point, track.",
          "Set the dial to exactly 78.4 and drop the needle."
        ],
        solvedText:"At 78.4 the fourth song swells — a waltz, beautiful and wrong — and then the needle rides past the music into the RUN-OUT GROOVE, where someone has cut clicks into the wax by hand. Long clicks and short."
      }
    },
    { id:'runout', icon:'💿', name:'The Run-Out Groove', pos:{x:57,y:47,w:10,h:15}, hiddenUntil:'gramophone',
      desc:"The run-out groove clicks the same message, around and around — two words, nine letters, carved into the record by hand:\n\n·−−  ·−·  −−−  −·  −−·\n\n···  −  −−−  ·−−·\n\nDivide the letters among the crew and call them out.",
      puzzle:{
        prompt:"Decode the groove (two words).",
        placeholder:"TWO WORDS", answers:['WRONGSTOP'],
        morse:'.-- .-. --- -. --.  ... - --- .--.',
        hints:[
          "Nine letters, two words. ·−− is W. Split the groups among the crew.",
          "First word: W, R, O… five letters. Second starts ··· = S.",
          "·−− ·−· −−− −· −−· is WRONG. ··· − −−− ·−−· is STOP. Enter WRONGSTOP."
        ],
        solvedText:"WRONG STOP. Cut into shellac by a man who wanted the next passenger to know: whatever station this train pulls into tonight, do not get off. Stay aboard. Reach the engine.",
        solveBeat:"Outside the windows, lights slide past — a platform, lamp posts, figures standing in rows. Every figure turns its head with the train, in unison, as you pass.",
        beatSound:'hiss'
      }
    },
    { id:'valise', icon:'💼', name:'The Locked Valise', pos:{x:21,y:73,w:12,h:15}, hiddenUntil:'runout',
      desc:"A gentleman's valise, banded shut. Someone has scratched a zigzag and five letters into the lock plate:\n\nZIGZAG CIPHER · TWO RAILS\nBAERK\n\n“Written up and down two rails, then read straight off — top rail first. Put it back on the rails to read it true.”",
      puzzle:{
        prompt:"Enter the deciphered word.", placeholder:"FIVE LETTERS", answers:['BRAKE'],
        hints:[
          "Rail-fence, two rails: the first 3 letters (BAE) were the TOP rail, the last 2 (RK) the bottom rail.",
          "Interleave them — top, bottom, top, bottom, top: B, R, A, K, E.",
          "It spells BRAKE. THE CLASP OPENS TO: BRAKE."
        ],
        solvedText:"B-R-A-K-E. The valise opens on a railwayman's kit hidden under evening clothes: a brakeman's badge, berth 13's calibration card — and a revolver with six spent shells. Whatever he tried first, it wasn't puzzles."
      }
    },
    { id:'berthlock', icon:'🚪', name:'Berth 13', pos:{x:82,y:26,w:11,h:42}, hiddenUntil:'valise',
      desc:"Berth 13 — the cabin that isn't on the car plan — locked at 3 digits. Three punched ticket stubs are pinned to the door — SEAT 2, SEAT 6, SEAT 7 — above the brakeman's memory-note:\n\n“The lock takes the three seats in BOARDING order.\nSeat 7 boarded BETWEEN the other two.\nSeat 2 boarded somewhere BEFORE seat 6.”\n\nAnd scrawled under it: “REMEMBER THE RECORD. THE JUNCTION WILL ASK.”",
      puzzle:{
        prompt:"Work out the boarding order of seats 2, 6 and 7, then enter the three digits.", placeholder:"000", answers:['276'],
        hints:[
          "Seat 7 boarded between the other two — so 7 is the MIDDLE digit, never first or last.",
          "That leaves 2 and 6 for the ends, and seat 2 boarded before seat 6.",
          "2, then 7, then 6 — enter 276."
        ],
        solvedText:"2-7-6. The lock gives — and berth 13 is empty except for a conductor's uniform laid out on the bunk like a shed skin, cap on the pillow, punch on the nightstand. The punch is still warm.",
        solveBeat:"From the corridor behind you — from a spot each of you would swear was empty a breath ago — comes one soft, courteous cough.",
        beatSound:'knock'
      }
    }
  ]
},
/* ============ ROOM 3 — THE DINING CAR ============ */
{
  id:'dining', name:'Room 3 — The Dining Car', scene:'dining',
  relay:{el:'bell-lamp',seq:'.- --. .- .. -.',after:'till'},
  intro:"Every table is set for supper. The kitchen bell rings for orders no one is taking.",
  objective:"Cross the dining car and settle the house's accounts. <b>Mind the mirror.</b>",
  entryBeat:"Three tables are set with plates still steaming. The train has been abandoned for hours. Somebody keeps cooking.",
  entrySound:'bell',
  completeText:"The service door to the tender swings wide. Behind you, in the dining car, a chair scrapes politely back into place — supper, apparently, is over.",
  chain:"Chef's board riddle = MIRROR → table settings: clear only PERFECT-SQUARE covers; survivors spell HUNGRY → the till chit addition ($3.85) = 385 → the kitchen service bell rings morse = AGAIN.",
  objects:[
    { id:'menu', icon:'🍽️', name:"The Chef's Board", pos:{x:64,y:33,w:8,h:18},
      desc:"Tonight's menu, chalked in a strong hand that failed at the dessert line. Under the entrées, a riddle — the chef's game with the waiters, every service:\n\n“I show you the whole car.\nI seat a second party opposite yours.\nNo guest of mine has ever paid,\nand no guest of mine has ever left.\nWhat am I?”",
      puzzle:{
        prompt:"What is the chef pointing you at?", placeholder:"ANSWER", answers:['MIRROR','THEMIRROR','BARMIRROR'],
        hints:[
          "It's behind the bar, and you've been avoiding looking at it since you walked in.",
          "It seats a second dining car opposite this one, full of guests who never pay and never leave.",
          "The MIRROR. Go and look. Look carefully at the tables."
        ],
        solvedText:"The bar MIRROR. In the glass, the same car looks back — but in the reflection, the place settings are subtly different. Someone has been keeping score in there. Count the silver, table by table.",
        solveBeat:"In the mirror — only in the mirror — the service door at the far end stands open. You turn. Here, it is closed.",
        beatSound:'hiss'
      }
    },
    { id:'tables', icon:'🍴', name:'The Table Settings', pos:{x:10,y:60,w:56,h:16}, hiddenUntil:'menu',
      desc:"Eight settings across the dining car, each place card stamped with a cover number. Reading front of the car to back:\n\nH — 4\nS — 3\nU — 9\nN — 1\nO — 2\nG — 4\nR — 9\nY — 1\n\nThe etiquette card in the mirror's frame: “A HONEST HOUSE SEATS ONLY SQUARE COMPANY. CLEAR EVERY SETTING WHOSE NUMBER IS A PERFECT SQUARE (1, 4, 9, 16…).”",
      puzzle:{
        prompt:"Which settings get cleared? Enter their letters in order.", placeholder:"LETTERS", answers:['HUNGRY'],
        hints:[
          "A perfect square is some whole number times itself: 1(=1×1), 4(=2×2), 9(=3×3). Check each cover; split the tables among the crew.",
          "Drop the non-squares — S(3) and O(2). Keep 4, 9, 1 and read the survivors front to back.",
          "H(4) U(9) N(1) G(4) R(9) Y(1) are perfect squares — the cleared settings spell HUNGRY."
        ],
        solvedText:"H-U-N-G-R-Y. The word sits on the table linen like a spill. In the mirror, you'd swear the cleared seats are no longer empty — and every one of the seated shapes is facing the kitchen.",
        solveBeat:"The kitchen's serving hatch slides up two inches. Steam drifts out. Nothing looks through. It doesn't need to.",
        beatSound:'clank'
      }
    },
    { id:'till', icon:'🧾', name:'The Till', pos:{x:84,y:52,w:10,h:14}, hiddenUntil:'tables',
      desc:"The bar till, locked at 3 digits. Three unpaid chits still hang on the spike beside it:\n\nTABLE 2 — 85¢\nTABLE 5 — $1.15\nTABLE 7 — $1.85\n\nThe head waiter's tag on the drawer: “THE TILL OPENS ON THE NIGHT'S TOTAL — DOLLARS, THEN CENTS.”",
      puzzle:{
        prompt:"Add up the three chits and enter the total as three digits (dollars, then cents).", placeholder:"000", answers:['385'],
        hints:[
          "Straight addition — split the chits among the crew and check each other.",
          "85¢ + $1.15 = $2.00 even. Now add the last chit.",
          "$2.00 + $1.85 = $3.85 → enter 385."
        ],
        solvedText:"3-8-5. The till opens on stacks of fares — every note crisp, every coin bright, and every date on every coin the same year: this one. The house always balances. That's the horror of it.",
        solveBeat:null
      }
    },
    { id:'servicebell', icon:'🛎️', name:'The Service Bell', pos:{x:3,y:36,w:13,h:22}, hiddenUntil:'till',
      desc:"The kitchen's service bell begins to ring from the empty galley — short rings and long, patient, repeating. The tender door's 5-letter lock waits.\n\n·−   −−·   ·−   ··   −·",
      puzzle:{
        prompt:"Enter the 5-letter word the bell is ringing.", placeholder:"5 LETTERS", answers:['AGAIN'],
        morse:'.- --. .- .. -.', morseLocked:'till',
        hints:[
          "Long and short rings — five letters, standard code. Call them out as a team.",
          "·− is A, and it opens AND closes the word. −−· is G.",
          "·− −−· ·− ·· −· spells AGAIN. It has done all this before. It will do it again."
        ],
        solvedText:"A-G-A-I-N. The bell stops mid-ring, satisfied. The tender door unbolts — and you understand, finally, that the train doesn't want prisoners. It wants STAFF. Move.",
        solveBeat:"As the door opens, every place setting in the car — in the room, not the mirror — is suddenly, silently, cleared.",
        beatSound:'bell'
      }
    }
  ]
},
/* ============ ROOM 4 — THE LOCOMOTIVE ============ */
{
  id:'locomotive', name:'Room 4 — The Locomotive', scene:'locomotive',
  intro:"The cab is empty, the firebox is roaring, and the junction to the living line is coming up fast.",
  objective:"Feed the fire, prove the drill, and <b>whistle the switchman</b> — miss the junction and the Special keeps its schedule forever.",
  entryBeat:"The coal in the tender is full — forty years of night runs, and the coal never falls. On the throttle, a gloved handprint in the soot. The glove had six fingers.",
  entrySound:'chug',
  completeText:"",
  chain:"Fire drill tags with positional constraints → unique order C-B-E-D-A → signal lantern case: “the junction listens at TWICE the record” = 78.4×2 = 156.8 → 1568 → timetable: only the 4:45 junction is manned before the line 'ends' at 6:00; minus 65 min = 3:40 → coupling pins: takings counted forward, pulled in reverse = 3528 → whistle the distress pattern (SOS) → THE JUNCTION.",
  objects:[
    { id:'firebox', icon:'🔥', name:'The Firebox Drill', pos:{x:26,y:52,w:11,h:22},
      desc:"The company fire drill, five steps on five soot-stained tags, scattered across the footplate:\n\nTAG A — “Release the brake only after the injector is set.”\n\nTAG B — “Feed the firebox SECOND.”\n\nTAG C — “Break the coal before the firebox is fed.”\n\nTAG D — “Set the injector — never right before or right after feeding the firebox.”\n\nTAG E — “Open the dampers. Exactly one task passes between breaking coal and opening the dampers.”",
      puzzle:{
        prompt:"Enter the five tag letters in drill order.", placeholder:"FIVE LETTERS", answers:['CBEDA'],
        hints:[
          "One tag names an exact slot. Fix the firebox feed, then see what must come before it.",
          "Feeding is 2nd; breaking coal comes before it — 1st. 'Exactly one task between breaking coal and the dampers' puts the dampers 3rd. Where can the injector legally sit?",
          "The injector can't touch slot 1 or 3 (adjacent to the feed in slot 2)… slot 4. The brake releases last: 5th. C-B-E-D-A."
        ],
        solvedText:"Coal, feed, dampers, injector, brake. The Special surges under your feet, eager — too eager — and the pressure needles climb toward the junction like they know the way.",
        solveBeat:"The train's whistle sounds, far above you. Nobody pulled it. It sounded… pleased.",
        beatSound:'whistle'
      }
    },
    { id:'lantern', icon:'🏮', name:'The Signal Lantern Case', pos:{x:69,y:52,w:9,h:19},
      desc:"The signal lantern is locked in its case, 4 digits, stencilled with the brakeman's rule:\n\n“THE SPECIAL SINGS ON ITS OWN NUMBER.\nTHE JUNCTION LISTENS AT TWICE IT.”\n\nThe berth 13 card said it too: remember the record.",
      puzzle:{
        prompt:"Enter the 4-digit code.", placeholder:"0000", answers:['1568'],
        hints:[
          "You set the Special's number yourself — on the gramophone, back in Cabin 3.",
          "The record played at 78.4. The junction listens at twice it.",
          "78.4 × 2 = 156.8 → enter 1568."
        ],
        solvedText:"156.8 — twice the dead man's waltz. The case opens on the signal lantern, its red lens polished bright by hands that wanted, very much, for someone to finally use it."
      }
    },
    { id:'timetable', icon:'🕰️', name:'The Timetable', pos:{x:80,y:18,w:15,h:28}, hiddenUntil:'lantern',
      desc:"The company timetable, annotated in the brakeman's hand:\n\n“JUNCTIONS TONIGHT —\n3:15 · MILE 40 — switch unmanned\n4:45 · MILE 62 — switchman on duty\n7:05 · MILE 90 — switchman on duty\n\nTHE PRINTED LINE ENDS AT 6:00. THERE IS NO 6:01 IN THIS BOOK.\nSIGNAL THE SWITCHMAN 65 MINUTES BEFORE THE JUNCTION.”",
      puzzle:{
        prompt:"Set the signal time (hour then minutes, e.g. 730).", placeholder:"H:MM", answers:['340','0340'],
        hints:[
          "Two filters: somebody has to be manning the switch, and the line itself ends at 6:00.",
          "3:15 is unmanned. 7:05 is after the book runs out of minutes — there is no 7:05 on this line. That leaves 4:45 — count back 65 minutes.",
          "4:45 minus 1:05 is 3:40. Enter 340."
        ],
        solvedText:"3:40. You mark the time against the dead conductor's watch — which has started, quietly, to tick again. It wants to make the junction too."
      }
    },
    { id:'coupling', icon:'🔗', name:'The Coupling Pins', pos:{x:80,y:70,w:15,h:20}, hiddenUntil:'timetable',
      desc:"To make the junction light enough, the ghost cars have to go. The coupling release wears four punch-glyph tumblers — the porter's marks, in the fare card's order:\n\n★   ✚   ●   ■\n\nStamped beneath:\n\n“TAKINGS COUNTED FORWARD.\nPINS PULLED IN REVERSE.”",
      puzzle:{
        prompt:"Enter the 4-digit release.", placeholder:"0000", answers:['3528'],
        hints:[
          "You counted the takings forward once already — the porter's cash box in the baggage car.",
          "The cash box opened on 8253. The pins pull in reverse.",
          "8253 backward is 3528. Enter 3528."
        ],
        solvedText:"3-5-2-8 — the night's accounts, run backward, the way this train keeps all its books. The pins drop, the dead cars sigh loose — and in the cab it is suddenly, mercifully, just you and the engine.",
        solveBeat:"From the receding dark behind the last coach, a lantern swings side to side — the old signal. Not a warning. A farewell from staff to staff.",
        beatSound:'bell'
      }
    },
    { id:'whistle', icon:'🚂', name:'Whistle & Lamp', pos:{x:6,y:69,w:16,h:22}, hiddenUntil:'coupling',
      desc:"The whistle cord and the signal lantern, rigged together the brakeman's way: short blasts and long. One pattern every switchman on the living line still drills by — the oldest call there is.\n\nGet it right, and the switch throws. Get it wrong, and the Special sails past the junction into the timetable's blank pages.",
      puzzle:{
        type:'signal',
        labels:{short:'🚂 SHORT BLAST ·',long:'🚂 LONG BLAST −',reset:'LET THE STEAM DIE',send:'🔔 SIGNAL THE JUNCTION'},
        missText:'The whistle garbles it. Far ahead, the switch lamp stays red.',
        prompt:"Sound the distress pattern, then SIGNAL THE JUNCTION. (Watch the steam above the cab.)",
        answers:['...---...'],
        hints:[
          "Three letters every switchman knows.",
          "S is three shorts. O is three longs. Spell the distress call.",
          "Short short short, long long long, short short short — SOS."
        ],
        solvedText:""
      }
    }
  ]
}
];

registerScenario({
  id:'midnight',
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
    "The Midnight Special left the platform at 11:58 with a full first class, a string quartet, and hot supper service. You woke at a station stop that appears on no timetable — and you are, as far as you can tell, the only souls left aboard.",
    "The supper is still steaming. The berths are turned down. And somewhere down the corridor, patient as arithmetic, a ticket punch clicks — the Conductor, keeping accounts for a company that closed its books in 1887.",
    "There is one junction left where this line still touches the living one. Reach the locomotive, make the Special light enough to turn, and whistle the switchman — before the timetable runs out of minutes. And whatever you hear behind you: your ticket is <em>not</em> ready."
  ],
  begin:'🚂 BEGIN — 45:00', finalButton:'MAKE THE JUNCTION 🚂',
  emojis:['🚂','🎩','🕰️','🎻','🥃','🎫','🌙','🔔','🧳','🪞','🐈‍⬛','💀'],
  ratings:['🏆 Master of the Line','🚂 First-Class Escapist','🎫 Coach Passenger','🛟 Barely Made the Junction','🌙 Riding Forever'],
  shareTitle:'ESCAPED THE MIDNIGHT SPECIAL!',
  victoryTitle:'🚂 THE JUNCTION IS YOURS',
  victoryProse:`Three short. Three long. Three short. The whistle hammers the old call into the dark, the switch lamp far ahead flips from red to white, and the Special slams onto the living line hard enough to throw sparks past the windows.<br><br>
    Dawn comes up like a held breath released. In the last car's window — the car you uncoupled, standing still on the dead line behind you — a lantern swings side to side, and a gloved hand raises a ticket punch in salute. Accounts settled. Passage paid.<br><br>
    The next station has a name you recognize. You have never been so glad to hear a timetable read aloud.`,
  gameOverProse:`Somewhere behind you a clock finishes striking six, and the timetable simply… ends.<br><br>The Special glides on into the blank pages, smooth as sleep. Down the corridor, the ticket punch begins — unhurried, patient — to click its way toward the cab.`,
  flare:{x:160,y:560,hue:[255,215,140]},
  ambience:[
    {drone:.04, hum:.03, wind:.03},
    {drone:.04, hum:.03, wind:.025},
    {drone:.045, hum:.035, wind:.02},
    {drone:.06, hum:.05, wind:.05}
  ],
  fx:['motes','motes','motes','embers'],
  events:[
    [{s:'clack',p:.65},{s:'creak',p:.3}],
    [{s:'clack',p:.65},{s:'crackle',p:.22}],
    [{s:'clack',p:.6},{s:'bell',p:.14}],
    [{s:'chug',p:.5},{s:'whistlefar',p:.2}]
  ],
  wrongBeats:WRONG_BEATS, wrongSounds:WRONG_SOUNDS,
  scenes:SCENES, rooms:ROOMS
});
})();
