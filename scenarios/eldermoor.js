/* ============================================================
   SCENARIO: THE WRECK OF THE ELDERMOOR — shipwreck island
   Data contract (all scenarios follow this shape):
     registerScenario({ id, title, sub, tagline, icon, card,
       titleFx, titleLightning, titleArt, story[], begin,
       finalButton, emojis[], ratings[5], shareTitle,
       victoryTitle, victoryProse, gameOverProse,
       flare:{x,y,hue}, ambience[4], fx[4], events[4],
       wrongBeats[], wrongSounds[], scenes:{...}, rooms:[4] });
   Rooms/puzzles use: hiddenUntil / revealedBy / revealSymbols,
   puzzle.type text|dial|signal, dial config, morse strings,
   room.relay for blinking scene lamps. Answers normalized A-Z0-9.
   ============================================================ */
(function(){
const SCENES={};
SCENES.beach=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="bSky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#0b232e"/><stop offset=".5" stop-color="#2e5058"/>
  <stop offset=".82" stop-color="#b96f36"/><stop offset="1" stop-color="#e09c55"/>
 </linearGradient>
 <linearGradient id="bSea" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#cf8f4d"/><stop offset=".3" stop-color="#3c6a68"/><stop offset="1" stop-color="#11313a"/>
 </linearGradient>
 <linearGradient id="bSand" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#b99763"/><stop offset="1" stop-color="#77593a"/>
 </linearGradient>
 <radialGradient id="bSun"><stop offset="0" stop-color="#ffe6b0" stop-opacity=".85"/><stop offset="1" stop-color="#ffca7a" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="580" fill="url(#bSky)"/>
<g class="plx" data-depth="5">
  <circle class="sunglow" cx="1160" cy="452" r="170" fill="url(#bSun)"/>
  <circle cx="1160" cy="452" r="56" fill="#ffd894"/>
  <ellipse class="cloud c1" cx="360" cy="170" rx="190" ry="24" fill="#173238" opacity=".6"/>
  <ellipse class="cloud c2" cx="880" cy="110" rx="250" ry="30" fill="#132a30" opacity=".55"/>
  <ellipse class="cloud c3" cx="1380" cy="240" rx="150" ry="18" fill="#173238" opacity=".5"/>
</g>
<rect y="475" width="1600" height="215" fill="url(#bSea)"/>
<!-- distant islet + gulls -->
<g class="plx" data-depth="6">
  <path d="M140 474 q44 -16 96 -7 q52 -8 96 7 l0 4 -192 0 z" fill="#16383f" opacity=".9"/>
  <path d="M196 464 q26 -10 50 -1 z" fill="#12333a"/>
</g>
<g class="cloud c2" stroke="#0c2027" stroke-width="4" fill="none" stroke-linecap="round">
  <path d="M520 150 q10 -11 20 0 q10 -11 20 0"/>
  <path d="M600 192 q8 -9 16 0 q8 -9 16 0"/>
  <path d="M462 214 q7 -8 14 0 q7 -8 14 0"/>
</g>
<g class="plx" data-depth="9">
  <path class="wave w1" d="M-100 552 Q100 538 300 552 T700 552 T1100 552 T1500 552 T1900 552 V600 H-100 Z" fill="#5b8d86" opacity=".5"/>
  <path class="wave w2" d="M-100 598 Q120 584 340 598 T780 598 T1220 598 T1700 598 V646 H-100 Z" fill="#79a99e" opacity=".45"/>
  <path class="wave w3" d="M-100 644 Q150 628 400 644 T900 644 T1400 644 T1900 644 V692 H-100 Z" fill="#e8dcc0" opacity=".32"/>
</g>
<path d="M0 636 Q400 606 800 638 T1600 626 V900 H0 Z" fill="url(#bSand)"/>
<!-- dark treeline creeping in from the left -->
<g class="plx" data-depth="3">
  <path d="M0 250 q90 -40 150 -10 q60 -50 130 -20 q40 -40 90 -5 l30 40 q-60 40 -130 45 q-90 40 -170 20 L0 340 Z" fill="#0c1f14" opacity=".92"/>
  <path d="M0 320 q120 -30 210 10 q80 0 120 40 l-40 60 q-120 20 -200 -10 L0 400 Z" fill="#081409"/>
</g>
<!-- long dragging prints toward the treeline -->
<g opacity=".5">
  ${[0,1,2,3,4,5].map(i=>`<ellipse cx="${560-i*74}" cy="${796-i*44}" rx="${26-i*2}" ry="${8-i*0.7}" fill="#4a3821" transform="rotate(${-24-i*3} ${560-i*74} ${796-i*44})"/>`).join('')}
</g>
<!-- palms -->
<g class="plx" data-depth="14">
  <g class="palm"><path d="M120 900 q-14 -180 30 -300" stroke="#241a10" stroke-width="26" fill="none"/>
    <g fill="#0f2416"><path d="M150 600 q-110 -60 -190 -20 q90 -18 190 20z"/><path d="M150 600 q-40 -110 -140 -130 q80 50 140 130z"/><path d="M150 600 q60 -100 160 -100 q-90 20 -160 100z"/><path d="M150 600 q110 -30 170 30 q-90 -20 -170 -30z"/><path d="M150 600 q10 -120 90 -160 q-50 70 -90 160z"/></g></g>
  <g class="palm p2"><path d="M1560 900 q30 -160 -20 -280" stroke="#241a10" stroke-width="22" fill="none"/>
    <g fill="#0f2416"><path d="M1540 620 q-110 -50 -180 -10 q95 -14 180 10z"/><path d="M1540 620 q-20 -110 -110 -140 q60 60 110 140z"/><path d="M1540 620 q70 -80 150 -70 q-80 10 -150 70z"/></g></g>
</g>
<!-- the wreck -->
<g id="art-hull">
  <path d="M1010 668 q40 -150 140 -185 l290 -68 q36 66 24 140 l-34 100 q-190 46 -420 13 z" fill="#221710"/>
  ${[0,1,2,3,4].map(i=>`<path d="M${1105+i*72} ${640-i*10} q10 -90 46 -128" stroke="#171008" stroke-width="9" fill="none"/>`).join('')}
  <rect x="1252" y="332" width="13" height="230" fill="#2a1d12" transform="rotate(16 1258 440)"/>
  <path class="flag" d="M1290 344 l58 14 -58 18 z" fill="#3c2a20"/>
  <ellipse cx="1210" cy="702" rx="240" ry="16" fill="#000" opacity=".28"/>
</g>
<!-- a gull crossing the bay, and a crab working the tideline -->
<g class="gullfly"><path d="M0 0 q10 -11 20 0 q10 -11 20 0" stroke="#0c2027" stroke-width="4" fill="none" stroke-linecap="round"/></g>
<g class="crabby">
  <g transform="translate(880 842)"><ellipse cx="0" cy="0" rx="16" ry="9" fill="#7a3a24"/>
  ${[-1,1].map(s=>`<path d="M${s*10} -4 q${s*10} -8 ${s*14} -2 M${s*13} 2 q${s*9} 2 ${s*12} 8 M${s*8} 6 q${s*8} 6 ${s*9} 12" stroke="#5c2a18" stroke-width="2.5" fill="none"/>`).join('')}
  <circle cx="-4" cy="-8" r="2" fill="#1c0f08"/><circle cx="4" cy="-8" r="2" fill="#1c0f08"/></g>
</g>
<!-- salvage scattered along the tideline -->
<g>
  <ellipse cx="800" cy="668" rx="430" ry="14" fill="#e8dcc0" opacity=".08"/>
  <path d="M580 664 q20 -9 44 0 q-18 11 -44 0z M1180 668 q16 -8 36 0 q-14 10 -36 0z M240 662 q14 -7 30 0 q-12 9 -30 0z" fill="#12331f" opacity=".85"/>
  <g transform="rotate(-22 1044 744)">
    <rect x="1038" y="686" width="11" height="88" rx="5" fill="#2a2e36"/>
    <path d="M1008 762 q36 34 72 0 l-12 -12 q-24 22 -48 0 z" fill="#2a2e36"/>
    <circle cx="1044" cy="680" r="10" fill="none" stroke="#2a2e36" stroke-width="7"/>
  </g>
  <ellipse cx="1046" cy="782" rx="86" ry="10" fill="#000" opacity=".14"/>
  <g transform="rotate(12 950 700)">
    <rect x="922" y="676" width="56" height="42" rx="10" fill="#5b452c"/>
    <line x1="922" y1="690" x2="978" y2="690" stroke="#3a2a18" stroke-width="4"/>
    <line x1="922" y1="704" x2="978" y2="704" stroke="#3a2a18" stroke-width="4"/>
  </g>
  <ellipse cx="352" cy="704" rx="34" ry="12" fill="#6a4f30"/>
  <ellipse cx="352" cy="701" rx="22" ry="7.5" fill="#7d6040"/>
  <ellipse cx="352" cy="699" rx="10" ry="3.5" fill="#6a4f30"/>
  <rect x="640" y="700" width="60" height="9" rx="4" fill="#6a4f30" transform="rotate(-7 670 704)"/>
  <rect x="1330" y="702" width="52" height="8" rx="4" fill="#5b452c" transform="rotate(9 1356 706)"/>
</g>
<!-- fallen rigging from the wreck -->
<path d="M1262 352 Q1180 480 1110 566 M1264 362 Q1330 470 1358 566" stroke="#171008" stroke-width="3" fill="none" opacity=".75"/>
<!-- driftwood planks with carved letters -->
<g id="art-driftwood">
  ${[['CASTAWAY','III',96,742,-8],['GALE','II',172,760,5],['ADRIFT','IIII',132,792,-3],['SALVAGE','III',214,788,10]].map(([w,t,x,y,r])=>
   `<g transform="rotate(${r} ${x} ${y})"><rect x="${x-40}" y="${y-11}" width="80" height="22" rx="5" fill="#6a4f30"/><rect x="${x-40}" y="${y-11}" width="80" height="7" rx="4" fill="#7d6040"/><text x="${x}" y="${y+2}" text-anchor="middle" font-family="Special Elite" font-size="9" fill="#2c1e0f">${w}</text><text x="${x}" y="${y+9}" text-anchor="middle" font-size="7" letter-spacing="1" fill="#2c1e0f">${t}</text></g>`).join('')}
</g>
<!-- torn sail on a rock -->
<g id="art-sail">
  <ellipse cx="430" cy="560" rx="90" ry="34" fill="#3a3128"/>
  <path d="M355 552 L470 420 L520 556 q-60 26 -165 -4z" fill="#cfc0a0"/>
  <path d="M420 470 l16 30 -30 4 z" fill="#8d7f62"/>
  <path d="M470 420 L520 556" stroke="#8d7f62" stroke-width="3" fill="none"/>
</g>
<!-- cargo crate with stencils -->
<g id="art-crate">
  <rect x="770" y="632" width="128" height="96" fill="#5b452c"/>
  <rect x="770" y="632" width="128" height="20" fill="#6d5436"/>
  <rect x="770" y="632" width="10" height="96" fill="#48371f"/><rect x="888" y="632" width="10" height="96" fill="#48371f"/>
  <text x="800" y="694" font-size="22" fill="#2c2010">■5</text><text x="852" y="694" font-size="22" fill="#2c2010">◆1</text>
  <text x="800" y="720" font-size="22" fill="#2c2010">▲8</text><text x="852" y="720" font-size="22" fill="#2c2010">●3</text>
</g>
<!-- weatherproof box -->
<g id="art-box">
  <rect x="1236" y="748" width="104" height="66" rx="8" fill="#4a2b25"/>
  <rect x="1236" y="748" width="104" height="18" rx="8" fill="#5c362d"/>
  <rect x="1276" y="760" width="24" height="20" fill="#a8862a"/>
</g>
<!-- chart (appears when box is opened) -->
<g id="el-chart">
  <rect x="672" y="788" width="96" height="40" rx="14" fill="#d9cba6" transform="rotate(-8 720 808)"/>
  <path d="M680 802 q40 -8 78 2" stroke="#7a5c34" stroke-width="2" fill="none"/>
</g>
<g class="atmo"><!-- more life on the wing and the water -->
<g class="gullfly" style="animation-delay:6s"><path d="M300 150 q16 -13 32 0 q-16 -7 -32 0" fill="#e8e4d8" opacity=".55"/></g>
<g class="gullfly" style="animation-delay:13s"><path d="M300 96 q11 -9 22 0 q-11 -5 -22 0" fill="#e8e4d8" opacity=".4"/></g>
<g class="drift" style="animation-delay:2s"><ellipse cx="1180" cy="120" rx="150" ry="20" fill="#f0d9b8" opacity=".10"/></g>
<g class="drift" style="animation-delay:9s"><ellipse cx="480" cy="182" rx="200" ry="17" fill="#f0d9b8" opacity=".08"/></g>
<!-- a sail on the far horizon, too distant to matter -->
<g class="shipdrift"><path d="M1418 392 l0 -30 l16 30z" fill="#e8e4d8" opacity=".3"/></g>
<!-- something breaks the shallows and is gone -->
<g class="finflick" style="animation-delay:5s"><path d="M960 428 l12 -16 l5 17z" fill="#0e2a30" opacity=".7"/></g>
<g class="finflick" style="animation-delay:21s"><path d="M700 418 l9 -12 l4 13z" fill="#0e2a30" opacity=".55"/></g>
<g class="crabby" style="animation-delay:14s"><ellipse cx="430" cy="806" rx="8" ry="6" fill="#8a4a34"/>
  <path d="M423 803 l-6 -5 M437 803 l6 -5" stroke="#8a4a34" stroke-width="2"/></g>

<g class="gullfly" style="animation-delay:19s"><path d="M300 200 q10 -8 20 0 q-10 -4 -20 0" fill="#e8e4d8" opacity=".35"/></g>
<g class="drift" style="animation-delay:16s"><ellipse cx="900" cy="60" rx="180" ry="14" fill="#f0d9b8" opacity=".07"/></g>
<g class="crabby" style="animation-delay:3s"><ellipse cx="1010" cy="862" rx="7" ry="5" fill="#7a4230"/>
  <path d="M1004 859 l-5 -4 M1016 859 l5 -4" stroke="#7a4230" stroke-width="2"/></g>
<g class="gust g2"><ellipse cx="0" cy="856" rx="120" ry="5" fill="#e8d8b8" opacity=".18"/></g>
<g class="gust g3"><ellipse cx="0" cy="880" rx="90" ry="4" fill="#e8d8b8" opacity=".14"/></g></g>
</svg>`;

SCENES.radio=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="rWall" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#0b1512"/><stop offset="1" stop-color="#15231e"/>
 </linearGradient>
 <linearGradient id="rFloor" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#2a2117"/><stop offset="1" stop-color="#171009"/>
 </linearGradient>
 <linearGradient id="rGlass" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#1c3a26"/><stop offset="1" stop-color="#0a1810"/>
 </linearGradient>
 <radialGradient id="rLamp"><stop offset="0" stop-color="#ffe9b0" stop-opacity=".22"/><stop offset="1" stop-color="#ffe9b0" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="620" fill="url(#rWall)"/>
<rect y="620" width="1600" height="280" fill="url(#rFloor)"/>
${[0,1,2,3,4,5,6,7].map(i=>`<line x1="${i*220-60}" y1="620" x2="${i*260-260}" y2="900" stroke="#0d0a06" stroke-width="5"/>`).join('')}
<line x1="0" y1="620" x2="1600" y2="620" stroke="#060503" stroke-width="7"/>
<!-- wall boards -->
${[0,1,2,3,4,5].map(i=>`<line x1="0" y1="${90+i*95}" x2="1600" y2="${90+i*95}" stroke="#08110d" stroke-width="3" opacity=".7"/>`).join('')}
<!-- wall details: stopped clock, marked calendar, cracks, cobwebs -->
<g>
  <g transform="rotate(-4 560 226)">
    <circle cx="560" cy="226" r="34" fill="#d9cba6" stroke="#2c2213" stroke-width="6"/>
    <line x1="560" y1="226" x2="560" y2="204" stroke="#2c2213" stroke-width="4"/>
    <line x1="560" y1="226" x2="577" y2="234" stroke="#2c2213" stroke-width="3"/>
    <circle cx="560" cy="226" r="3.5" fill="#2c2213"/>
  </g>
  <g transform="rotate(2 1150 262)">
    <rect x="1108" y="210" width="84" height="106" fill="#cbb489"/>
    <text x="1150" y="228" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#4a3517">DAY 121</text>
    ${[0,1,2,3].map(r=>[0,1,2,3].map(c=>`<line x1="${1118+c*17}" y1="${238+r*19}" x2="${1129+c*17}" y2="${250+r*19}" stroke="#7a3a2a" stroke-width="2.5"/>`).join('')).join('')}
  </g>
  <path d="M60 82 q60 30 40 92 M100 60 q30 42 72 52" stroke="#08110d" stroke-width="3" fill="none"/>
  <path d="M0 0 q60 10 92 48 M0 26 q42 8 64 36 M22 0 q20 26 54 42" stroke="#a8c2b0" stroke-width="1.5" fill="none" opacity=".14"/>
  <path d="M1600 62 q-52 4 -78 38 M1600 92 q-36 2 -54 26" stroke="#a8c2b0" stroke-width="1.5" fill="none" opacity=".12"/>
</g>
<!-- the back door, ajar on the dark -->
<g>
  <rect x="1396" y="298" width="122" height="322" fill="#241d13"/>
  <rect x="1396" y="298" width="34" height="322" fill="#070505"/>
  <rect x="1396" y="298" width="122" height="322" fill="none" stroke="#312817" stroke-width="8"/>
  <line x1="1436" y1="336" x2="1512" y2="386" stroke="#3a2f1c" stroke-width="10"/>
  <line x1="1436" y1="560" x2="1512" y2="504" stroke="#3a2f1c" stroke-width="10"/>
  <circle cx="1500" cy="464" r="6" fill="#6a5533"/>
  <text x="1462" y="290" text-anchor="middle" font-family="Special Elite" font-size="14" fill="#8fa596">ANTENNA →</text>
</g>
<!-- window with the passing shadow -->
<g id="art-window">
  <rect x="104" y="170" width="300" height="240" fill="#241d13"/>
  <rect x="118" y="184" width="272" height="212" fill="url(#rGlass)"/>
  <path d="M118 330 q50 -40 90 -18 q40 -34 80 -12 q50 -30 102 -6 l0 102 -272 0 z" fill="#07130b"/>
  <rect class="win-shadow" x="60" y="196" width="64" height="200" rx="26" fill="#020604" opacity="0"/>
  <rect x="118" y="282" width="272" height="9" fill="#241d13"/>
  <rect x="248" y="184" width="9" height="212" fill="#241d13"/>
  <rect x="104" y="170" width="300" height="240" fill="none" stroke="#312817" stroke-width="10"/>
  <path d="M120 196 l70 90" stroke="#a8c2b0" stroke-width="2" opacity=".12"/>
</g>
<!-- hanging lamp + light cone -->
<g class="lampswing">
  <line x1="800" y1="0" x2="800" y2="128" stroke="#161006" stroke-width="6"/>
  <path d="M770 128 h60 l14 26 h-88 z" fill="#2c2213"/>
  <circle class="flick" cx="800" cy="166" r="15" fill="#ffdf9c"/>
  <path d="M760 160 L560 620 H1040 L840 160 Z" fill="url(#rLamp)"/>
</g>
<!-- morse poster -->
<g id="art-poster">
  <rect x="1226" y="176" width="176" height="248" fill="#cbb489" transform="rotate(1.5 1314 300)"/>
  <text x="1314" y="208" text-anchor="middle" font-family="Special Elite" font-size="17" fill="#4a3517">MORSE CODE</text>
  ${[0,1,2,3,4,5,6,7].map(i=>`<text x="1246" y="${234+i*23}" font-family="Special Elite" font-size="12" fill="#5d4423">${['A ·−   B −···','E ·   H ····','N −·   O −−−','R ·−·   S ···','T −   U ··−','D −··   K −·−','M −−   I ··','W ·−−   G −−·'][i]}</text>`).join('')}
  <circle cx="1314" cy="182" r="4" fill="#6a5533"/>
</g>
<!-- desk -->
<rect x="420" y="540" width="860" height="26" fill="#4a3922"/>
<rect x="430" y="566" width="840" height="130" fill="#3a2c19"/>
<rect x="450" y="696" width="30" height="120" fill="#241a0e"/><rect x="1220" y="696" width="30" height="120" fill="#241a0e"/>
<!-- radio rack -->
<g id="art-radio">
  <rect x="620" y="360" width="440" height="182" rx="8" fill="#1d2a26" stroke="#3a4a44" stroke-width="4"/>
  <rect x="640" y="378" width="180" height="44" rx="4" fill="#06130a"/>
  <text class="flick" x="730" y="410" text-anchor="middle" font-family="Special Elite" font-size="28" fill="#8fe0a0" style="text-shadow:0 0 8px #4fda7c">---.-</text>
  <g class="glowdial">
    <circle cx="700" cy="482" r="32" fill="#0f1a14" stroke="#4a5a52" stroke-width="5"/>
    <line x1="700" y1="482" x2="716" y2="458" stroke="#8fe0a0" stroke-width="4"/>
    <circle class="flick" cx="836" cy="482" r="26" fill="#0f1a14" stroke="#4a5a52" stroke-width="5"/>
    <line x1="836" y1="482" x2="822" y2="462" stroke="#e0c48f" stroke-width="4"/>
  </g>
  <rect x="900" y="390" width="140" height="60" rx="4" fill="#0f1a14" stroke="#3a4a44" stroke-width="3"/>
  <path d="M910 436 q34 -40 60 -6 q30 -30 56 -4" stroke="#8fe0a0" stroke-width="2.5" fill="none" class="flick"/>
  ${[0,1,2,3,4].map(i=>`<circle cx="${906+i*32}" cy="512" r="7" fill="${i%2?'#3a4a44':'#5c4423'}"/>`).join('')}
</g>
<!-- speaker (the broadcast) -->
<g id="el-broadcast">
  <circle cx="512" cy="452" r="58" fill="#241d13" stroke="#3a2c19" stroke-width="8"/>
  ${[40,28,16].map(r=>`<circle cx="512" cy="452" r="${r}" fill="none" stroke="#0d0a06" stroke-width="6"/>`).join('')}
  <circle class="flick" cx="512" cy="452" r="7" fill="#8fe0a0"/>
</g>
<!-- logbook -->
<g id="art-logbook">
  <path d="M460 590 l90 -12 8 44 -90 14 z" fill="#d9cba6"/>
  <path d="M550 578 l86 8 -2 44 -88 -6 z" fill="#cfc0a0"/>
  ${[0,1,2].map(i=>`<line x1="472" y1="${596+i*11}" x2="538" y2="${588+i*11}" stroke="#7a5c34" stroke-width="2"/>`).join('')}
  <line x1="562" y1="592" x2="622" y2="596" stroke="#7a5c34" stroke-width="2"/>
</g>
<!-- desk clutter & cabling -->
<g>
  <rect x="1064" y="556" width="30" height="30" rx="4" fill="#5b6a62"/>
  <path d="M1094 562 q13 5 0 13" stroke="#5b6a62" stroke-width="5" fill="none"/>
  <path d="M690 566 l64 -8 6 26 -64 9 z" fill="#cfc0a0" transform="rotate(-5 720 578)"/>
  <path d="M756 574 l50 -5 4 20 -50 6 z" fill="#d9cba6" transform="rotate(3 780 584)"/>
  <path d="M1058 540 q42 62 26 142 M1062 540 q80 42 122 62" stroke="#0d0a06" stroke-width="5" fill="none"/>
  <path d="M1184 602 q120 -12 214 -64" stroke="#0d0a06" stroke-width="5" fill="none"/>
</g>
<!-- operator's chair, turned to the window -->
<g opacity=".9">
  <rect x="270" y="560" width="90" height="16" rx="6" fill="#241a0e"/>
  <rect x="278" y="470" width="20" height="100" rx="6" fill="#241a0e" transform="rotate(-14 288 520)"/>
  <rect x="268" y="576" width="14" height="110" fill="#171009"/><rect x="340" y="576" width="14" height="110" fill="#171009"/>
</g>
<!-- rug and (hidden) hatch -->
<g id="art-rug"><ellipse cx="800" cy="800" rx="190" ry="52" fill="#43261f"/><ellipse cx="800" cy="800" rx="150" ry="38" fill="none" stroke="#5c362d" stroke-width="7"/><ellipse cx="800" cy="800" rx="100" ry="24" fill="none" stroke="#5c362d" stroke-width="5"/></g>
<g id="el-hatch">
  <path d="M700 768 L900 768 L930 832 L670 832 Z" fill="#39413f" stroke="#20272a" stroke-width="6"/>
  <circle cx="800" cy="800" r="24" fill="none" stroke="#6a7a74" stroke-width="8"/>
  <line x1="776" y1="800" x2="824" y2="800" stroke="#6a7a74" stroke-width="7"/><line x1="800" y1="778" x2="800" y2="822" stroke="#6a7a74" stroke-width="7"/>
</g>
<!-- emergency transmitter below (hidden) -->
<g id="el-transmitter">
  <rect x="1130" y="726" width="180" height="110" rx="10" fill="#232c28" stroke="#3a4a44" stroke-width="5"/>
  ${[0,1,2].map(r=>[0,1,2].map(c=>`<rect class="flick" x="${1152+c*38}" y="${744+r*26}" width="26" height="16" rx="3" fill="#0f1a14" stroke="#4fda7c" stroke-width="1.5"/>`).join('')).join('')}
  <circle class="flick glowdial" cx="1284" cy="752" r="9" fill="#8fe0a0"/>
</g>
<g class="atmo"><!-- a moth worrying the one working lamp -->
<ellipse class="batfly" cx="1140" cy="96" rx="7" ry="4" fill="#d8c8a0" opacity=".5"/>
<g class="batfly" style="animation-delay:7s"><ellipse cx="1140" cy="118" rx="5" ry="3" fill="#d8c8a0" opacity=".35"/></g>
<!-- cobwebs stirring in the corners -->
<g opacity=".18" class="sway" style="transform-origin:0 0"><path d="M0 40 q60 26 92 78 M0 96 q52 4 92 22" stroke="#cfd8d2" stroke-width="2" fill="none"/></g>
<g opacity=".14" class="sway" style="animation-delay:3s;transform-origin:1600px 0"><path d="M1600 30 q-70 30 -104 86" stroke="#cfd8d2" stroke-width="2" fill="none"/></g>
<!-- dust turning slowly in the instrument glow -->
<circle class="sparkle" cx="240" cy="60" r="2" fill="#cfe6df" style="animation-delay:0.0s"/><circle class="sparkle" cx="390" cy="94" r="2" fill="#cfe6df" style="animation-delay:0.9s"/><circle class="sparkle" cx="540" cy="128" r="2" fill="#cfe6df" style="animation-delay:1.8s"/><circle class="sparkle" cx="690" cy="60" r="2" fill="#cfe6df" style="animation-delay:2.7s"/><circle class="sparkle" cx="840" cy="94" r="2" fill="#cfe6df" style="animation-delay:3.6s"/><circle class="sparkle" cx="990" cy="128" r="2" fill="#cfe6df" style="animation-delay:4.5s"/><circle class="sparkle" cx="1140" cy="60" r="2" fill="#cfe6df" style="animation-delay:0.40000000000000036s"/><circle class="sparkle" cx="1290" cy="94" r="2" fill="#cfe6df" style="animation-delay:1.2999999999999998s"/>
<circle class="dripdrop" cx="520" cy="40" r="3.4" fill="#bfe8ff" opacity=".45" style="animation-delay:4s"/>
<circle class="dripdrop" cx="900" cy="30" r="3" fill="#bfe8ff" opacity=".35" style="animation-delay:11s"/>
<g class="lampswing" style="transform-origin:1000px 0"><line x1="1000" y1="0" x2="1000" y2="86" stroke="#2a3a34" stroke-width="3"/>
  <circle class="flick" cx="1000" cy="98" r="10" fill="#ffd98c" opacity=".55"/>
  <circle cx="1000" cy="98" r="48" fill="#ffd98c" opacity=".05"/></g>
<ellipse class="fogdrift" cx="800" cy="884" rx="380" ry="16" fill="#9fd6c4" opacity=".05"/></g>
</svg>`;

SCENES.jungle=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="jSky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#16341f"/><stop offset="1" stop-color="#081a10"/>
 </linearGradient>
 <linearGradient id="jPath" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#3a2f1c"/><stop offset="1" stop-color="#5a4830"/>
 </linearGradient>
 <linearGradient id="jRiver" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#1a453c"/><stop offset="1" stop-color="#102e2a"/>
 </linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#jSky)"/>
<!-- god rays -->
<g opacity=".12">
  <polygon points="500,0 620,0 380,700 280,700" fill="#cfe8b0"/>
  <polygon points="900,0 990,0 840,600 760,600" fill="#cfe8b0"/>
  <polygon points="1250,0 1330,0 1200,500 1130,500" fill="#cfe8b0"/>
</g>
<!-- the gorge: a chasm, a rope bridge, the relay lamp -->
<g class="plx" data-depth="4">
  <!-- open air of the gap -->
  <rect x="668" y="118" width="272" height="302" fill="#10281c"/>
  <rect x="668" y="150" width="272" height="270" fill="#16341f" opacity=".45"/>
  <!-- far rim treeline across the gorge -->
  <path d="M668 118 h272 v44 q-70 30 -136 18 q-80 16 -136 -18 z" fill="#0e2415"/>
  <!-- mist rising out of the chasm -->
  <ellipse cx="760" cy="396" rx="92" ry="26" fill="#9fb8a8" opacity=".16"/>
  <ellipse cx="866" cy="362" rx="70" ry="20" fill="#9fb8a8" opacity=".13"/>
  <ellipse cx="804" cy="330" rx="104" ry="18" fill="#9fb8a8" opacity=".06"/>
  <!-- left cliff face -->
  <path d="M596 108 L710 128 L700 200 L716 268 L704 340 L718 420 L596 432 Z" fill="#06100a"/>
  <path d="M710 128 L700 200 L716 268 L704 340 L718 420" stroke="#26543a" stroke-width="3" fill="none" opacity=".8"/>
  <path d="M700 200 L716 268 M704 340 L718 420 M660 160 L668 250" stroke="#050d08" stroke-width="4" fill="none"/>
  <!-- right cliff face -->
  <path d="M1004 108 L896 130 L908 210 L892 280 L904 352 L890 420 L1004 434 Z" fill="#06100a"/>
  <path d="M896 130 L908 210 L892 280 L904 352 L890 420" stroke="#26543a" stroke-width="3" fill="none" opacity=".8"/>
  <path d="M908 210 L892 280 M904 352 L890 420 M948 164 L940 254" stroke="#050d08" stroke-width="4" fill="none"/>
  <!-- anchor posts, both rims -->
  <rect x="704" y="252" width="9" height="60" fill="#2c1d10"/>
  <rect x="893" y="246" width="9" height="60" fill="#2c1d10"/>
  <!-- sagging plank deck -->
  <path d="M710 306 Q805 340 898 300" stroke="#3a2a18" stroke-width="7" fill="none"/>
  ${[1,2,3,4,5,6,7,8].map(i=>{const t=i/9,x=710+t*188,y=(1-t)*(1-t)*306+2*(1-t)*t*340+t*t*300;return `<line x1="${x.toFixed(0)}" y1="${(y-3).toFixed(0)}" x2="${x.toFixed(0)}" y2="${(y+9).toFixed(0)}" stroke="#2c1d10" stroke-width="5"/>`;}).join('')}
  <!-- rope handrails + hangers -->
  <path d="M710 258 Q805 294 898 254" stroke="#3a2a18" stroke-width="3" fill="none"/>
  ${[1,3,5,7].map(i=>{const t=i/9,x=710+t*188,yd=(1-t)*(1-t)*306+2*(1-t)*t*340+t*t*300,yr=(1-t)*(1-t)*258+2*(1-t)*t*294+t*t*254;return `<line x1="${x.toFixed(0)}" y1="${yr.toFixed(0)}" x2="${x.toFixed(0)}" y2="${yd.toFixed(0)}" stroke="#2c1d10" stroke-width="2"/>`;}).join('')}
  <!-- a frayed rope dangling into the dark -->
  <path d="M760 316 q6 40 -4 78" stroke="#2c1d10" stroke-width="3" fill="none"/>
  <!-- the barred gate at the near end -->
  <rect x="692" y="248" width="8" height="84" fill="#2c1d10"/>
  <rect x="722" y="250" width="8" height="82" fill="#2c1d10"/>
  <line x1="688" y1="268" x2="736" y2="260" stroke="#2c1d10" stroke-width="9"/>
  <line x1="688" y1="296" x2="736" y2="288" stroke="#2c1d10" stroke-width="9"/>
  <rect x="698" y="272" width="28" height="17" rx="3" fill="#3a3d38"/>
  <circle cx="712" cy="280" r="4" fill="#171a15"/>
  <!-- relay lamp on the far post -->
  <circle id="gorge-lamp" cx="897" cy="238" r="7" fill="#ffdf9c" opacity=".08"/>
  <circle cx="897" cy="252" r="3.5" fill="#5c5236"/>
</g>
<!-- spur of trail climbing to the bridge -->
<path d="M792 560 L818 428 L838 428 L850 560 Z" fill="url(#jPath)" opacity=".45"/>
<!-- fog bands -->
<rect class="fogband" x="-200" y="360" width="2000" height="90" fill="#9fb8a8" opacity=".09" rx="45"/>
<rect class="fogband f2" x="-200" y="470" width="2000" height="70" fill="#9fb8a8" opacity=".07" rx="35"/>
<!-- path -->
<path d="M760 900 L900 900 L850 560 L800 560 Z" fill="url(#jPath)" opacity=".85"/>
<!-- far foliage -->
<g class="plx" data-depth="7" fill="#142c1b">
  <path d="M0 0 h420 q-30 140 -120 220 q-90 110 -60 240 L0 500 Z"/>
  <path d="M1600 0 h-430 q40 150 130 230 q80 100 60 220 l240 60 Z"/>
  <ellipse cx="560" cy="120" rx="200" ry="90"/>
  <ellipse cx="1120" cy="90" rx="230" ry="100"/>
</g>
<!-- eyes, deep in the growth: rare, brief -->
<g class="eyes"><circle cx="1296" cy="338" r="5" fill="#cfe3b0"/><circle cx="1322" cy="336" r="5" fill="#cfe3b0"/></g>
<!-- the carved tree -->
<g id="art-tree">
  <path d="M282 900 q-24 -300 6 -520 q10 -80 46 -110 q40 30 48 110 q26 220 4 520 z" fill="#2c1d10"/>
  ${[0,1,2,3].map(i=>`<path d="M${292+i*6} ${380+i*90} q30 ${8-i*4} 68 0" stroke="#0d0803" stroke-width="5" fill="none"/>`).join('')}
  <rect x="300" y="470" width="72" height="90" rx="8" fill="#2c1e0f"/>
  ${[0,1,2,3].map(i=>`<line x1="310" y1="${488+i*18}" x2="${348+(i%2)*14}" y2="${488+i*18}" stroke="#c9b384" stroke-width="3" opacity=".8"/>`).join('')}
  <g fill="#16321e"><path d="M330 268 q-130 -70 -230 -30 q110 -16 230 30z"/><path d="M330 268 q-40 -120 -150 -150 q80 60 150 150z"/><path d="M330 268 q80 -110 190 -104 q-100 24 -190 104z"/><path d="M330 268 q130 -30 200 40 q-110 -30 -200 -40z"/></g>
</g>
<!-- snapped branches -->
<g id="art-branches">
  <line x1="120" y1="420" x2="230" y2="480" stroke="#3a2a18" stroke-width="12"/>
  <line x1="230" y1="480" x2="252" y2="580" stroke="#3a2a18" stroke-width="9" transform="rotate(38 230 480)"/>
  <line x1="86" y1="520" x2="196" y2="560" stroke="#3a2a18" stroke-width="10"/>
  <line x1="196" y1="560" x2="210" y2="650" stroke="#3a2a18" stroke-width="8" transform="rotate(30 196 560)"/>
  <path d="M225 476 l14 -8 M191 556 l13 -7" stroke="#c9b384" stroke-width="4" opacity=".7"/>
</g>
<!-- the river -->
<g id="art-river">
  <path d="M0 640 Q400 610 800 648 T1600 636 L1600 730 Q1200 762 800 726 T0 738 Z" fill="url(#jRiver)"/>
  <path class="rivershine" d="M40 676 Q400 650 800 684 T1560 672" stroke="#3f7a6e" stroke-width="4" fill="none" stroke-dasharray="26 26" opacity=".6"/>
  <path class="rivershine" d="M80 706 Q460 680 860 710 T1580 700" stroke="#2c5a52" stroke-width="3" fill="none" stroke-dasharray="18 30" opacity=".5"/>
</g>
<!-- crossing stones (hidden until riddle) -->
<g id="el-stones">
  ${[['B','■',420,702,5],['D','⬟',518,678,2],['E','▲',616,704,3],['R','⬢',714,680,1],['O','■',812,706,2],['A','▲',910,682,4],['W','⬟',1008,704,3],['N','⬢',1106,680,4]].map(([ch,sh,x,y,m])=>
   `<g><ellipse cx="${x}" cy="${y}" rx="44" ry="19" fill="#3a3d38"/><ellipse cx="${x}" cy="${y-5}" rx="44" ry="17" fill="#565a52"/>
   <text x="${x-14}" y="${y}" text-anchor="middle" font-family="Special Elite" font-size="20" fill="#171a15">${ch}</text>
   <text x="${x+13}" y="${y+1}" text-anchor="middle" font-size="15" fill="#22261f">${sh}</text>
   ${Array.from({length:m},(_,i)=>`<circle cx="${x-26+i*13}" cy="${y+9}" r="3.2" fill="#2e4a2c"/>`).join('')}</g>`).join('')}
</g>
<!-- ranger's pack (hidden until stones) -->
<g id="el-pack">
  <path d="M1108 690 q-10 -70 44 -78 q56 -6 52 70 l-6 40 q-44 16 -84 0 z" fill="#2c3320"/>
  <rect x="1122" y="640" width="60" height="16" rx="8" fill="#1c2114"/>
  <rect x="1138" y="676" width="28" height="24" rx="4" fill="#454f2e"/>
  <circle cx="1152" cy="688" r="4" fill="#8a8250"/>
</g>
<!-- leaves drifting down through the canopy light -->
<g class="leaffall"><ellipse cx="480" cy="0" rx="9" ry="4" fill="#2f6a4a"/></g>
<g class="leaffall l2"><ellipse cx="1050" cy="0" rx="8" ry="4" fill="#3f7a52"/></g>
<!-- hanging vines -->
<g class="plx" data-depth="12" stroke="#122718" fill="none">
  <path d="M430 0 q-14 90 22 150 q10 30 -8 62" stroke-width="7"/>
  <path d="M1190 0 q16 70 -12 130 q-8 40 12 82" stroke-width="8"/>
  <path d="M1060 0 q-10 60 8 112" stroke-width="5"/>
  <path d="M545 0 q12 70 -6 122" stroke-width="5"/>
</g>
<g fill="#16321e">
  <ellipse cx="444" cy="214" rx="16" ry="7" transform="rotate(24 444 214)"/>
  <ellipse cx="1190" cy="214" rx="18" ry="8" transform="rotate(-18 1190 214)"/>
  <ellipse cx="1068" cy="114" rx="13" ry="6" transform="rotate(30 1068 114)"/>
  <ellipse cx="539" cy="124" rx="12" ry="6" transform="rotate(-24 539 124)"/>
</g>
<!-- roots at the carved tree's base -->
<path d="M292 900 q-30 -60 -64 -74 M336 900 q10 -52 44 -68 M306 878 q-14 -30 -42 -38" stroke="#2c1d10" stroke-width="10" fill="none"/>
<!-- faintly glowing mushrooms among the roots -->
<g>
  <circle cx="250" cy="836 " r="18" fill="#9fd0a0" opacity=".10"/>
  <circle cx="380" cy="850" r="14" fill="#9fd0a0" opacity=".09"/>
  <path d="M242 838 q8 -13 17 0 z" fill="#7ba883"/><rect x="249" y="838" width="4" height="10" fill="#5c7a5e"/>
  <path d="M373 852 q7 -11 15 0 z" fill="#7ba883"/><rect x="379" y="852" width="4" height="9" fill="#5c7a5e"/>
  <path d="M270 862 q6 -9 13 0 z" fill="#6d9a74"/><rect x="275" y="862" width="3" height="8" fill="#5c7a5e"/>
</g>
<!-- ferns crowding the river bank -->
<g stroke="#1d3a24" stroke-width="4" fill="none">
  ${[[120,640],[1300,632],[1440,700],[60,760]].map(([x,y])=>[-2,-1,0,1,2].map(k=>`<path d="M${x} ${y} q${k*18} -34 ${k*30} -52"/>`).join('')).join('')}
</g>
<!-- the antenna cable, still leading the way -->
<path d="M700 900 Q766 760 806 640 Q824 540 812 470 Q806 444 810 424" stroke="#101c12" stroke-width="6" fill="none" stroke-dasharray="18 9" opacity=".85"/>
<!-- near frame foliage -->
<g class="plx" data-depth="18" fill="#0c1a0f">
  <path d="M0 900 V520 q90 20 130 110 q60 30 70 130 q40 60 40 140 Z"/>
  <path d="M1600 900 V480 q-100 30 -140 130 q-70 40 -80 150 q-30 60 -40 140 Z"/>
  <path d="M0 0 h240 q-40 60 -140 80 L0 130 Z"/>
  <path d="M1600 0 h-260 q50 70 160 90 l100 50 Z"/>
</g>
<g class="atmo"><!-- canopy birds crossing, high and unbothered -->
<g class="gullfly" style="animation-delay:4s"><path d="M300 78 q12 -10 24 0 q-12 -5 -24 0" fill="#0d2418" opacity=".55"/></g>
<g class="gullfly" style="animation-delay:17s"><path d="M300 44 q9 -7 18 0 q-9 -4 -18 0" fill="#0d2418" opacity=".4"/></g>
<!-- more leaves letting go -->
<ellipse class="leaffall" cx="1180" cy="60" rx="9" ry="4" fill="#2f6a3a" opacity=".6" style="animation-delay:3s"/>
<ellipse class="leaffall" cx="380" cy="40" rx="7" ry="3.4" fill="#356f3f" opacity=".5" style="animation-delay:11s"/>
<ellipse class="leaffall" cx="880" cy="30" rx="8" ry="3.8" fill="#2a5f34" opacity=".55" style="animation-delay:19s"/>
<!-- ground mist creeping between the trunks -->
<ellipse class="fogdrift" cx="300" cy="866" rx="260" ry="24" fill="#9fd6c4" opacity=".07"/>
<ellipse class="fogdrift" cx="1240" cy="880" rx="300" ry="22" fill="#9fd6c4" opacity=".06" style="animation-delay:8s"/>
<!-- more fireflies deeper in -->
<circle class="sparkle" cx="1300" cy="300" r="2.6" fill="#bff08a" style="animation-delay:0.0s"/><circle class="sparkle" cx="1397" cy="361" r="2.6" fill="#bff08a" style="animation-delay:0.7s"/><circle class="sparkle" cx="1494" cy="422" r="2.6" fill="#bff08a" style="animation-delay:1.4s"/><circle class="sparkle" cx="1331" cy="483" r="2.6" fill="#bff08a" style="animation-delay:2.0999999999999996s"/><circle class="sparkle" cx="1428" cy="304" r="2.6" fill="#bff08a" style="animation-delay:2.8s"/><circle class="sparkle" cx="1525" cy="365" r="2.6" fill="#bff08a" style="animation-delay:3.5s"/><circle class="sparkle" cx="1362" cy="426" r="2.6" fill="#bff08a" style="animation-delay:0.1999999999999993s"/></g>
</svg>`;

SCENES.cove=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="cSky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#120b26"/><stop offset=".55" stop-color="#4a2440"/>
  <stop offset=".85" stop-color="#c06438"/><stop offset="1" stop-color="#d8824a"/>
 </linearGradient>
 <linearGradient id="cSea" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#a35a34"/><stop offset=".2" stop-color="#1a2436"/><stop offset="1" stop-color="#0a0f1c"/>
 </linearGradient>
 <linearGradient id="cSand" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#6a5136"/><stop offset="1" stop-color="#45331f"/>
 </linearGradient>
 <radialGradient id="cTorch"><stop offset="0" stop-color="#ffb45e" stop-opacity=".3"/><stop offset="1" stop-color="#ffb45e" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="520" fill="url(#cSky)"/>
${Array.from({length:30},(_,i)=>`<circle class="tw" cx="${(i*127+40)%1560}" cy="${(i*53)%260+16}" r="${1+(i%3)*.7}" fill="#ffe9c0" style="animation-delay:${(i*.63)%4.5}s"/>`).join('')}
<!-- a falling star over the cove -->
<g class="shootstar"><line x1="1350" y1="80" x2="1394" y2="62" stroke="#ffe9c0" stroke-width="2.5" stroke-linecap="round"/></g>
<!-- moon, horizon haze, bats -->
<g class="plx" data-depth="3">
  <circle cx="262" cy="148" r="60" fill="#f4e9c8" opacity=".07"/>
  <circle cx="262" cy="148" r="44" fill="#f4e9c8" opacity=".88"/>
  <circle cx="282" cy="138" r="38" fill="#1d112e"/>
  <ellipse cx="500" cy="400" rx="210" ry="6" fill="#2a1638" opacity=".38"/>
  <ellipse cx="1100" cy="422" rx="250" ry="5" fill="#2a1638" opacity=".34"/>
  <ellipse cx="820" cy="448" rx="320" ry="5" fill="#38203f" opacity=".38"/>
</g>
<g class="cloud c3" stroke="#0a0812" stroke-width="3.5" fill="none" stroke-linecap="round">
  <path d="M1240 192 q7 -9 14 0 q7 -9 14 0"/>
  <path d="M1306 152 q6 -8 12 0 q6 -8 12 0"/>
  <path d="M1180 130 q5 -7 10 0 q5 -7 10 0"/>
</g>
<rect y="470" width="1600" height="230" fill="url(#cSea)"/>
<line x1="0" y1="472" x2="1600" y2="472" stroke="#e8945a" stroke-width="3" opacity=".65"/>
<!-- the passing ship: a cluster of tiny lights, drifting -->
<g id="el-ship" class="shiplights">
  <rect x="1180" y="452" width="120" height="10" rx="4" fill="#05070d"/>
  ${[0,1,2,3].map(i=>`<circle class="tw" cx="${1196+i*28}" cy="${454}" r="3" fill="#ffd98c" style="animation-delay:${i*.9}s"/>`).join('')}
  <circle cx="1292" cy="444" r="2.5" fill="#8cd9c0"/>
</g>
<g class="plx" data-depth="8">
  <path class="wave w2" d="M-100 560 Q140 546 380 560 T860 560 T1340 560 T1820 560 V610 H-100 Z" fill="#1c2a40" opacity=".8"/>
  <path class="wave w1" d="M-100 615 Q180 602 460 615 T1020 615 T1580 615 T2140 615 V668 H-100 Z" fill="#26374f" opacity=".7"/>
</g>
<!-- cliffs framing the cove -->
<g class="plx" data-depth="4" fill="#0a0812">
  <path d="M0 0 V760 q120 -30 170 -160 q80 -70 60 -220 q60 -90 20 -230 L0 60 Z"/>
  <path d="M1600 0 V740 q-140 -40 -180 -180 q-70 -80 -50 -230 q-50 -80 -10 -220 l100 -60 Z"/>
</g>
<!-- sand -->
<path d="M0 700 Q460 660 900 700 T1600 690 V900 H0 Z" fill="#5c4630"/>
<!-- drag-marks, layered old over older -->
<g id="art-dragmarks" opacity=".55">
  ${[0,1,2,3].map(i=>`<path d="M${360+i*60} ${812+i*14} q140 ${-26-i*6} 320 0" stroke="#3a2c1c" stroke-width="${9-i}" fill="none"/>`).join('')}
  <rect x="560" y="768" width="18" height="42" rx="6" fill="#241a10" transform="rotate(-6 569 789)"/>
</g>
<!-- sea stacks catching the last light -->
<g>
  <path d="M148 470 l26 -72 q10 -17 22 0 l20 72 z" fill="#0a0812"/>
  <path d="M228 470 l14 -42 q8 -13 17 0 l12 42 z" fill="#0a0812"/>
  <line x1="154" y1="468" x2="212" y2="468" stroke="#e8945a" stroke-width="2" opacity=".5"/>
</g>
<!-- tide pools holding the sky -->
<ellipse cx="520" cy="772" rx="60" ry="12" fill="#1a2436" opacity=".8"/>
<ellipse cx="520" cy="770" rx="60" ry="12" fill="none" stroke="#e8945a" stroke-width="1.5" opacity=".3"/>
<ellipse cx="1240" cy="826" rx="80" ry="13" fill="#1a2436" opacity=".7"/>
<ellipse cx="1240" cy="824" rx="80" ry="13" fill="none" stroke="#e8945a" stroke-width="1.5" opacity=".22"/>
<!-- winch line run down to the raft -->
<path d="M1404 702 Q1150 764 880 704" stroke="#3a2a18" stroke-width="5" fill="none" stroke-dasharray="16 7" opacity=".9"/>
<!-- supplies staged by the locker -->
<g>
  <rect x="1006" y="686" width="54" height="46" fill="#4a3520"/>
  <rect x="1006" y="686" width="54" height="12" fill="#5b452c"/>
  <rect x="982" y="716" width="40" height="30" fill="#3a2a18" transform="rotate(-8 1002 731)"/>
</g>
<!-- folded tarp + driftwood -->
<path d="M556 722 l92 -14 30 26 -98 18 z" fill="#3f4a52" opacity=".9"/>
<rect x="298" y="758" width="70" height="9" rx="4" fill="#4a3520" transform="rotate(-6 333 762)"/>
<rect x="1330" y="782" width="60" height="8" rx="4" fill="#4a3520" transform="rotate(8 1360 786)"/>
<!-- torch light -->
<g>
  <rect x="384" y="600" width="12" height="130" fill="#2c1e0f"/>
  <circle cx="390" cy="580" r="120" fill="url(#cTorch)"/>
  <path class="flame" d="M390 604 q-22 -34 0 -66 q22 32 0 66z" fill="#ffb45e"/>
  <path class="flame" d="M390 600 q-12 -22 0 -40 q12 18 0 40z" fill="#ffe9b0"/>
</g>
<!-- raft materials -->
<g id="art-raftkit">
  ${[0,1,2,3].map(i=>`<rect x="${620+i*10}" y="${640+i*22}" width="240" height="20" rx="10" fill="${i%2?'#4a3520':'#5b452c'}" transform="rotate(${i%2?-3:2} 740 ${650+i*22})"/>`).join('')}
  <path d="M640 636 l180 -10 -20 -60 q-90 -14 -140 20 z" fill="#cfc0a0" opacity=".9"/>
  ${['A','B','C','D','E'].map((ch,i)=>`<g transform="rotate(${(i-2)*9} ${660+i*46} 748)"><rect x="${644+i*46}" y="736" width="32" height="24" rx="4" fill="#d9cba6"/><text x="${660+i*46}" y="754" text-anchor="middle" font-family="Special Elite" font-size="15" fill="#4a3517">${ch}</text></g>`).join('')}
</g>
<!-- flare locker -->
<g id="art-locker">
  <rect x="1090" y="646" width="150" height="104" rx="8" fill="#5c1f1a"/>
  <rect x="1090" y="646" width="150" height="26" rx="8" fill="#7a2a22"/>
  ${[0,1,2].map(i=>`<rect x="${1102+i*48}" y="652" width="22" height="98" fill="#c9a04a" opacity=".8"/>`).join('')}
  <rect x="1148" y="688" width="34" height="28" rx="4" fill="#20140f"/>
  <circle cx="1165" cy="702" r="8" fill="#0d0a06" stroke="#c9a04a" stroke-width="2"/>
</g>
<!-- tide table on a rock (hidden until locker) -->
<g id="el-tide">
  <ellipse cx="1300" cy="560" rx="70" ry="34" fill="#241d20"/>
  <rect x="1258" y="516" width="86" height="58" rx="4" fill="#d9cba6" transform="rotate(-7 1300 545)"/>
  ${[0,1,2].map(i=>`<line x1="1268" y1="${532+i*13}" x2="1330" y2="${528+i*13}" stroke="#7a5c34" stroke-width="2.5"/>`).join('')}
</g>
<!-- launch winch (hidden until tide) -->
<g id="el-winch">
  <rect x="1404" y="640" width="16" height="130" fill="#241a10"/>
  <circle cx="1412" cy="640" r="42" fill="#3a3d38" stroke="#20241f" stroke-width="6"/>
  ${[0,1,2,3,4,5,6,7].map(i=>`<line x1="1412" y1="640" x2="${Math.round(1412+52*Math.cos(i*Math.PI/4))}" y2="${Math.round(640+52*Math.sin(i*Math.PI/4))}" stroke="#20241f" stroke-width="7"/>`).join('')}
  <circle cx="1412" cy="640" r="12" fill="#c9a04a"/>
  <text x="1412" y="596" text-anchor="middle" font-size="20" fill="#e0cfa2">▲■◆●</text>
</g>
<!-- flare rack (hidden until winch) -->
<g id="el-signal">
  <path d="M820 470 l64 0 12 60 -88 0 z" fill="#241a10"/>
  ${[0,1,2].map(i=>`<g transform="rotate(${(i-1)*10} ${838+i*14} 470)"><rect x="${832+i*14}" y="418" width="12" height="54" rx="4" fill="#a83a28"/><rect x="${832+i*14}" y="412" width="12" height="10" rx="3" fill="#e0cfa2"/></g>`).join('')}
</g>
<g class="atmo"><!-- the sky does most of the work here -->
<g class="shoot" style="animation-delay:9s"><path d="M1080 120 l-100 62" stroke="#ffeccf" stroke-width="2.4" opacity=".85"/></g>
<g class="shoot" style="animation-delay:26s"><path d="M420 70 l-78 48" stroke="#ffeccf" stroke-width="2" opacity=".7"/></g>
<g class="drift" style="animation-delay:4s"><ellipse cx="500" cy="150" rx="230" ry="22" fill="#22384e" opacity=".3"/></g>
<g class="batfly" style="animation-delay:2s"><ellipse cx="1220" cy="200" rx="9" ry="4" fill="#0a0f14" opacity=".65"/></g>
<g class="batfly" style="animation-delay:11s"><ellipse cx="1300" cy="250" rx="7" ry="3" fill="#0a0f14" opacity=".5"/></g>
<!-- phosphorescence turning over out in the water (the sea runs y470-700) -->
<circle class="sparkle" cx="120" cy="560" r="3" fill="#7fe8d2" style="animation-delay:0.0s"/><circle class="sparkle" cx="300" cy="577" r="3" fill="#7fe8d2" style="animation-delay:0.8s"/><circle class="sparkle" cx="480" cy="594" r="3" fill="#7fe8d2" style="animation-delay:1.6s"/><circle class="sparkle" cx="660" cy="575" r="3" fill="#7fe8d2" style="animation-delay:2.4000000000000004s"/><circle class="sparkle" cx="980" cy="592" r="3" fill="#7fe8d2" style="animation-delay:3.2s"/><circle class="sparkle" cx="1150" cy="573" r="3" fill="#7fe8d2" style="animation-delay:4.0s"/></g>
</svg>`;

const WRONG_BEATS = [
  "Somewhere behind you, wet sand shifts under a weight that isn't the tide.",
  "Three slow knocks. Wood on wood. Then nothing.",
  "The birds have stopped. You didn't notice until just now.",
  "A long exhale — too long — from somewhere in the green.",
  "For a moment the light dims, as if something very tall passed between you and the sun."
];
const WRONG_SOUNDS = ['knock','knock','growl','growl','knock'];

const ROOMS = [
/* ================= ROOM 1 — THE BEACH ================= */
{
  id:'beach', name:'Room 1 — The Beach', scene:'beach', fx:'mist',
  intro:"Dawn. A graveyard of cargo and canvas. Find a way off this beach.",
  objective:"Explore the wreckage — <b>glowing rings</b> mark what you can examine. Nothing here explains itself: the clues live in different pieces of wreckage.",
  entryBeat:"As you take your first steps up the beach, the treeline goes quiet all at once — the way a room goes quiet when something walks in.",
  entrySound:null,
  completeText:"Chart in hand, you leave the wreck behind. Five paces north, four east, and a trail opens in the vines like a mouth.",
  chain:"Planks: tally-strokes index into each carved word, spelling SAIL → sail pairs each shape with a wind letter → hull keel plate rule: READ THE WIND SUNWISE FROM NORTH (N,E,S,W) → crate digits in that order = 8513 → crate holds mirror-stamped key TIDE → box riddle answers TIDE, engraving says speak it backward = EDIT → box holds chart → chart math cross-references hull muster (12−4), drift days (3) and crate manifest (2 unbroken, doubled) = 54.",
  objects:[
    { id:'hull', icon:'🚢', name:"Shattered Hull", pos:{x:69,y:52,w:22,h:24},
      desc:"What's left of the Eldermoor lies on its side, ribs open to the sky. Inside, the dark holds its breath. You call out. Your echo comes back a half-second too late, and slightly… wrong.\n\nBeneath the bow, the shipwright's compass rose is carved into the keel plate, its old rule still legible:\n\n“READ THE WIND SUNWISE — CLOCKWISE — FROM NORTH.”\n\nHigher on the beam, the muster: twelve names scratched by hand. Four have been struck through — recently, by the look of the cuts." },
    { id:'driftwood', icon:'🪵', name:'Driftwood Planks', pos:{x:4,y:78,w:12,h:14},
      desc:"Four planks from a lifeboat bench lie in a rough row. Into each, someone carved a word — and beside each word, a count of tally strokes:\n\nCASTAWAY — 3 strokes\nGALE — 2 strokes\nADRIFT — 4 strokes\nSALVAGE — 3 strokes\n\nA word and a number on each plank. The carver meant them to be read together.",
      puzzle:{
        prompt:"The planks hide a word. Where should you look next?",
        placeholder:"FOUR LETTERS", answers:['SAIL'],
        hints:[
          "Each plank has a word AND a number of strokes. The strokes point INTO the word.",
          "Take the letter at the stroke-count's position: CASTAWAY's 3rd letter, GALE's 2nd, ADRIFT's 4th, SALVAGE's 3rd.",
          "C-A-S… S. G-A… A. A-D-R-I… I. S-A-L… L. The answer is SAIL."
        ],
        solvedText:"S… A… I… L. Up the beach, the Eldermoor's torn mainsail is snagged across a rock — and now that you look properly, there's something painted along its edge."
      }
    },
    { id:'sail', icon:'⛵', name:'Torn Sail', pos:{x:23,y:53,w:12,h:16}, revealedBy:'driftwood',
      desc:"A great sheet of salt-stiff canvas, snagged on the rocks. It's crusted and folded on itself — you can't make anything of it yet. Maybe something else on the beach will tell you why it matters.",
      revealDesc:"You haul the canvas flat. Tar-painted loading marks pair each shape with a single letter — winds, by the look of them — but the pairs are scattered in no useful order:",
      revealSymbols:"● W &nbsp;&nbsp;▲ N &nbsp;&nbsp;◆ S &nbsp;&nbsp;■ E" },
    { id:'crate', icon:'📦', name:'Cargo Crate', pos:{x:46,y:72,w:11,h:14},
      desc:"A heavy cargo crate sits banded in iron, sealed with a 4-digit dial lock. Its lid is stencilled MANIFEST — ONE OF SEVEN, and around it in the sand five sister crates lie burst open on the rocks.\n\nOn its side, four shapes, each with a number — printed in no particular order:\n\n■ 5      ◆ 1      ▲ 8      ● 3\n\nNumbers, but no sequence. Something on this beach pairs these shapes with something else — and something else again gives the order.",
      puzzle:{
        prompt:"Enter the 4-digit combination.", placeholder:"0000", answers:['8513'],
        hints:[
          "Three pieces of wreckage must meet: the crate's numbers, the sail's pairings, and a rule carved on the wreck itself.",
          "The keel plate says READ THE WIND SUNWISE (CLOCKWISE) FROM NORTH — that's N, E, S, W. The sail tells you which shape belongs to which wind.",
          "N is ▲8, E is ■5, S is ◆1, W is ●3 → enter 8513."
        ],
        solvedText:"The lock falls open on 8-5-1-3. Inside, wrapped in oilcloth: a small brass key. A word is stamped into it — TIDE — but the stamp is mirrored, as if it were meant to be read from the other side of something.",
        solveBeat:"As the crate lid creaks open, something big shifts its weight in the treeline. One branch snaps. Then the silence resumes, heavier than before.",
        beatSound:'knock'
      }
    },
    { id:'box', icon:'🧰', name:'Weatherproof Box', pos:{x:75,y:82,w:10,h:10},
      desc:"A ship's weatherproof document box, bolted shut with a 4-letter combination lock. A riddle is engraved on the lid in fine script:\n\n“Twice each day I come, and twice I leave.\nThe moon commands me; no anchor holds me.\nI kiss the shore, then take it with me.”\n\nAnd beneath the riddle, in harder, deeper strokes:\n\n“NAME ME AS THE EBB WOULD SPEAK IT — BACKWARD.”",
      puzzle:{
        prompt:"Set the four letter dials.", placeholder:"FOUR LETTERS", answers:['EDIT'],
        hints:[
          "Solve the riddle first. Then do to the answer exactly what the second engraving says.",
          "The riddle's answer is TIDE — the mirrored key from the crate agrees. Now speak it as the ebb does: backward.",
          "TIDE reversed is EDIT. Enter EDIT."
        ],
        solvedText:"E-D-I-T — the tide, running backward, like everything on this island. The box sighs open. Inside: a torn nautical chart of this very island, annotated in a hurried hand."
      }
    },
    { id:'chart', icon:'🗺️', name:'Chart Fragment', pos:{x:41,y:88,w:9,h:8}, hiddenUntil:'box',
      desc:"The chart shows the island and a circled square: RADIO STN. A margin note, hurried: “Day three: land. God help us.”\n\nBelow it, sailing directions from the tallest palm — two numbers, each to be worked out from the wreck itself:\n\n“NORTH: how many of us the sea spared, minus the days we drifted.\n\nEAST: twice the number of crates that reached the sand unbroken.”\n\nThe muster is carved on the hull. The crates are here on the beach. The days are in the note above.",
      puzzle:{
        prompt:"Enter the paces: north digit, then east digit.", placeholder:"TWO DIGITS", answers:['54'],
        hints:[
          "Two small sums. Send one person to read the hull's muster and another to count the crates while you work out the days.",
          "NORTH: the hull's muster shows 12 names, 4 struck through — 8 spared — minus the 3 days adrift (this chart: “Day three: land”). EAST: the crate manifest says one of seven; five burst — 2 unbroken, doubled.",
          "North 8−3 = 5. East 2×2 = 4. Enter 54."
        ],
        solvedText:"Five north, four east from the tallest palm — and there it is: a trailhead cut into the jungle wall, and far up the ridge, the dull glint of an antenna.",
        solveBeat:"You count your paces aloud. On “four,” something in the undergrowth counts one pace with you. On “five,” it doesn't.",
        beatSound:'growl'
      }
    }
  ]
},
/* ================= ROOM 2 — THE RADIO STATION ================= */
{
  id:'radio', name:'Room 2 — The Radio Station', scene:'radio', fx:'motes',
  intro:"Dust hangs in the green glow of instruments that should not still have power.",
  objective:"The operator left everything you need — scattered. Read the whole room before you touch the dial. Then <b>listen</b>.",
  entryBeat:"The door swings shut behind you on its own. Rusted hinges don't do that quietly. This one did.",
  entrySound:'knock',
  completeText:"The transmitter hums, your distress call looping out to sea. A stencilled arrow on the equipment rack points to a back door: ANTENNA LINE — THIS WAY. The cable runs straight into the jungle.",
  chain:"Logbook: last entry is Day 121 — “the band is the day I stopped counting, then the point, then the count of the knocks” + window sill gouges (5 nightly knocks) → tune 121.5 → broadcast is 10 letters of morse = LOOK UNDER → rug hides floor hatch → Caesar plate with NO stated shift (crack via WKH = THE, shift 3) = STORM → transmitter: calibration-lamp deduction (mastermind-style, unique solution) = 394.",
  objects:[
    { id:'logbook', icon:'📖', name:"Operator's Logbook", pos:{x:29,y:63,w:11,h:9},
      desc:"Three final entries, in a deteriorating hand:\n\n“Day 119 — It watched the door all night. I did not open it.”\n\n“Day 120 — Found its marks beneath the window. I have stopped sleeping.”\n\n“Day 121 — It knocks each night now. Always the same count. If anyone finds this: the band is the day I stopped counting, then the point, then the count of the knocks. Listen. Then get—”\n\nThe entry stops there. The pen is still in the crease of the page." },
    { id:'window', icon:'🪟', name:'Salt-Crusted Window', pos:{x:6,y:19,w:19,h:27},
      desc:"The glass is fogged with years of salt. Through it, the clearing, the treeline, the ordinary green.\n\nIn the bottom corner of the pane, for just a moment, there is a shape. Tall. Patient. It's gone when you look directly at it.\n\nBeneath the sill, someone cut gouges into the wood — five of them, deep and evenly spaced. Under them, in pencil, barely legible:\n\n“every night. always five.”" },
    { id:'poster', icon:'📜', name:'Torn Code Poster', pos:{x:76,y:19,w:12,h:28},
      desc:"A yellowed training poster is pinned above the desk: INTERNATIONAL MORSE CODE.\n\nThe alphabet itself has been torn away — a ragged rectangle of bare wall where the letters used to be, as though the operator ripped it down in a hurry and took it with him.\n\nEvery radio operator alive knows the code by heart. Your crew will have to find it the modern way." },
    { id:'radio', icon:'📻', name:'Radio Receiver', pos:{x:39,y:40,w:27,h:20},
      desc:"The heart of the station: a wall of dials and meters, still warm, its panel light flickering like a failing heartbeat. A brass plate reads: EMERGENCY MONITORING STATION 7 — TUNE WITH CARE.\n\nStatic washes from the speaker like surf. The main tuning dial waits. The operator's note said the band is a number in two parts — a day, a point, and a count.",
      puzzle:{
        type:'dial',
        prompt:"Sweep the dial to the operator's frequency, then coax the trim knobs until the carrier locks.",
        answers:['1215'],
        dial:{min:880,max:1350,div:10,target:1215,nearMorse:'.-.. --- --- -.-  ..- -. -.. . .-.',
          knobs:[{label:'RF GAIN',target:62},{label:'BANDWIDTH',target:27},{label:'AERIAL TRIM',target:84}]},
        hints:[
          "The logbook gives you the whole number. Something else in this room counts what comes after the point.",
          "Day 121 was the last entry — the day he stopped counting. The five gouges beneath the window sill count the nightly knocks: that's your decimal.",
          "Tune to exactly 121.5, then work the three knobs one at a time — slowly — until the panel reads LOCKED IN."
        ],
        solvedText:"At 121.5 the static parts like a curtain. A recorded voice, looped for years, keys the same message over and over. The SPEAKER is carrying a signal now — go listen to it, and split the work: it's a long one."
      }
    },
    { id:'broadcast', icon:'📡', name:'The Broadcast', pos:{x:28,y:44,w:10,h:15}, hiddenUntil:'radio',
      desc:"The loop repeats every few seconds. Two words — ten letters, keyed slow and deliberate:\n\n·−··  −−−  −−−  −·−\n\n··−  −·  −··  ·  ·−·\n\nThe operator wanted this understood by whoever came after. Divide the letters among the crew and call them out.",
      puzzle:{
        prompt:"Decode the broadcast (two words).",
        placeholder:"TWO WORDS", answers:['LOOKUNDER'],
        morse:'.-.. --- --- -.-  ..- -. -.. . .-.',
        hints:[
          "Ten letters, two words, in international morse. Look up the code and split the groups among the crew.",
          "First word, four letters: ·−·· is L, −−− is O. Second word starts ··− = U.",
          "·−·· −−− −−− −·− is LOOK. ··− −· −·· · ·−· is UNDER. Enter LOOKUNDER."
        ],
        solvedText:"LOOK UNDER. The logbook's last line, finished at last. Your eyes drop to the floor — to the woven rug beneath the operator's desk. You drag it aside. A steel hatch, flush with the boards.",
        solveBeat:"As you copy the last letter, five slow knocks land on the outside of the station wall. Deliberate. Evenly spaced. Nobody on your crew is outside.",
        beatSound:'knock'
      }
    },
    { id:'hatch', icon:'🕳️', name:'Floor Hatch', pos:{x:44,y:85,w:12,h:11},
      desc:"You drag aside the woven rug under the operator's desk and find a steel hatch with a five-letter wheel lock. A brass plate riveted beside the wheel is stamped with what looks like nonsense:\n\nWKH  ZKHHO  RSHQV  WR:  VWRUP\n\nNo key. No alphabet. Just the nonsense — and the nagging feeling that it isn't nonsense at all.",
      puzzle:{
        prompt:"Set the wheel to the decoded word.", placeholder:"FIVE LETTERS", answers:['STORM'],
        hints:[
          "It isn't nonsense — every letter has been marched the same number of steps through the alphabet.",
          "That first three-letter word is almost certainly THE. Count how far W sits from T. Then walk every letter back that far.",
          "The shift is 3. VWRUP walks back to STORM. The plate reads: THE WHEEL OPENS TO: STORM."
        ],
        solvedText:"S-T-O-R-M. The wheel spins free and the hatch lifts on a narrow crawlspace — and a squat emergency transmitter on a battery bank, its keypad glowing faintly."
      }
    },
    { id:'transmitter', icon:'🔌', name:'Emergency Transmitter', pos:{x:69,y:79,w:13,h:14}, hiddenUntil:'hatch',
      desc:"The emergency transmitter wants a 3-digit arming code. A calibration card in the operator's hand is taped beside the keypad — five test codes, and what the panel lamps said to each:\n\n1 2 3 — one lamp lit, seated wrong\n4 5 6 — one lamp lit, seated wrong\n6 1 2 — all lamps dark\n9 2 5 — one lamp lit, seated wrong\n8 3 9 — two lamps lit, both seated wrong\n\n“A lit lamp: that digit is in the code. Seated true: right digit, right position. Seated wrong: right digit, wrong position.”\n\nBelow, tiny and urgent: “REMEMBER THE BAND. YOU WILL NEED IT AGAIN.”",
      puzzle:{
        prompt:"Enter the 3-digit arming code.", placeholder:"000", answers:['394'],
        hints:[
          "Work it like detectives: the all-dark row eliminates its three digits everywhere. Then ask what each 'one lamp' row can still mean.",
          "6, 1 and 2 are dead. So row one's lamp is the 3 — and it can't sit third. Row five lights two lamps: with 6 gone and only three slots, they must be 3 and 9 — and 9 can't sit third or first.",
          "3 first, 9 second — and the last row of logic forces 4 (not 5, or row four would light two lamps). The code is 394."
        ],
        solvedText:"3-9-4. The transmitter thumps to life and begins looping a distress call out to sea. MAYDAY, MAYDAY, MAYDAY. Someone, somewhere, might be listening. Now — the antenna cable runs out the back door and into the jungle. That's your path.",
        solveBeat:"The moment the distress call starts broadcasting, something outside answers it — one long, low sound from deep in the island, too slow to be any bird.",
        beatSound:'growl'
      }
    }
  ]
},
/* ================= ROOM 3 — THE JUNGLE PATH ================= */
{
  id:'jungle', name:'Room 3 — The Jungle Path', scene:'jungle', fx:'fireflies',
  relay:{el:'gorge-lamp',seq:'.-.. . .- ...- .',after:'stones'},
  intro:"The canopy closes overhead. Something large keeps pace with you, always just out of sight.",
  objective:"Follow the antenna cable through the interior. Keep moving. <b>Keep quiet.</b>",
  entryBeat:"Ten steps in, you find one of the operator's boots. Just the one. It has been placed, neatly, in the exact center of the path — facing back the way you came.",
  entrySound:'growl',
  completeText:"You cross the rope bridge at a dead sprint and cut the lines behind you. Below the cliffs lies a hidden cove — and stacked on the sand, under a tarp, materials for a raft. The operator planned an escape. You're going to finish it.",
  chain:"Two threads run in parallel: the tree riddle = RIVER → eight crossing stones (sides must outnumber moss) spell DROWN; independently the ranger's pack tag algebra (first = 2×last, middle = sum, total 18) = 693. Crossing reveals the gorge gate — a SIMULTANEITY lock: the crew must man both winches at once (2 per station, scaled down for small teams) and haul together.",
  objects:[
    { id:'branches', icon:'🌿', name:'Snapped Branches', pos:{x:6,y:47,w:12,h:22},
      desc:"The trail-side branches are broken inward, all along one side, at a height that makes your neck prickle. The breaks are fresh — sap still bleeding.\n\nWhatever walks here doesn't go around things. It goes through them. You keep your voices low from now on." },
    { id:'tree', icon:'🌴', name:'Carved Tree', pos:{x:17,y:48,w:9,h:26},
      desc:"A massive trunk, carved long ago, the letters darkened with tar so they'd survive the seasons:\n\n“I grow strong when it rains and starve in the sun.\nI sing loudest where I am shallow,\nand hold my breath where I run deep.\nI have swallowed stronger crews than yours whole —\nyet you must ask me for the crossing.”",
      puzzle:{
        prompt:"What must you find and ask for the crossing?", placeholder:"ANSWER", answers:['RIVER','ARIVER','THERIVER'],
        hints:[
          "Not a creature — something on this island you can hear right now, off to the left.",
          "It sings in the shallows, runs quiet and deep, swells with rain, and drowns sailors. Water, moving.",
          "The answer is RIVER. Head toward the sound of water."
        ],
        solvedText:"A river. You push through the ferns toward the sound and find it: fast, dark water — crossed by a line of flat marker stones. Eight of them. That seems like too many."
      }
    },
    { id:'stones', icon:'🪨', name:'River Crossing Stones', pos:{x:22,y:71,w:52,h:12}, hiddenUntil:'tree',
      desc:"Eight flat stones cross the black water. Each is chiseled with a letter and a shape, and each wears patches of moss. Reading left to right from your bank:\n\nB — square (4 sides), 5 moss patches\nD — pentagon (5 sides), 2 moss patches\nE — triangle (3 sides), 3 moss patches\nR — hexagon (6 sides), 1 moss patch\nO — square (4 sides), 2 moss patches\nA — triangle (3 sides), 4 moss patches\nW — pentagon (5 sides), 3 moss patches\nN — hexagon (6 sides), 4 moss patches\n\nA mossy carving on the bank warns:\n\n“Only a stone whose sides outnumber its moss will bear your weight. Name the stones that hold, in order, and the river lets you pass.”",
      puzzle:{
        prompt:"Which stones hold? Enter their letters in crossing order.", placeholder:"LETTERS", answers:['DROWN'],
        hints:[
          "Judge every stone: does its shape's side-count strictly beat its moss count? Split the eight stones among the crew.",
          "Equal doesn't count — E (3 sides, 3 moss) tips. Keep only sides > moss, then read the survivors left to right.",
          "D (5>2), R (6>1), O (4>2), W (5>3), N (6>4). The crossing spells DROWN."
        ],
        solvedText:"D… R… O… W… N. Every safe stone holds. It isn't until the far bank that somebody says the word the river just made you spell — and nobody laughs. Ahead, half-buried in ferns: a ranger's pack.",
        solveBeat:"Halfway across, the river goes strangely quiet upstream — the sound of water breaking around something that has stepped into the current behind you. You do not turn around.",
        beatSound:'growl'
      }
    },
    { id:'pack', icon:'🎒', name:"Ranger's Pack", pos:{x:67,y:69,w:9,h:13},
      desc:"A weathered ranger's pack lies dropped beside the path, sealed with a 3-digit padlock. A waterproof tag hangs from the zip, the writing still legible:\n\n“Three digits guard my cache.\nThe first is twice the last.\nThe middle is the sum of the other two.\nAll three together make eighteen.”",
      puzzle:{
        prompt:"Enter the 3-digit code.", placeholder:"000", answers:['693'],
        hints:[
          "Turn the tag into equations. Call the digits F, M, L — one person writes, one checks.",
          "F = 2×L and M = F+L, so M = 3×L. Then F+M+L = 6×L = 18.",
          "L = 3, F = 6, M = 9. Enter 693."
        ],
        solvedText:"6-9-3. Inside: a machete and a battery signal lamp, its shutter trigger worn smooth from use. Why would a ranger carry a lamp built for sending code?"
      }
    },
    { id:'gate', icon:'🌉', name:'Gorge Gate', pos:{x:43,y:22,w:15,h:18}, hiddenUntil:'stones',
      desc:"The trail ends at a deep gorge spanned by an old rope bridge. The gate is barred by a counterweight beam, and the two winches that lift it stand at opposite ends of the platform — far too far apart for one pair of hands.\n\nAcross the gorge an automated signal lamp blinks the same five letters over and over, faster each time: ·−·· · ·− ···− · . You do not need to decode it twice.",
      puzzle:{
        type:'simul',
        stations:[{id:'gate-port',label:'Port Winch',icon:'⚓'},{id:'gate-star',label:'Starboard Winch',icon:'⚓'}],
        need:2,
        pullLabel:'HAUL ON THREE',
        prompt:"The beam only lifts if both winches turn together. Get the crew onto the winches, then haul.",
        hints:[
          "This one isn't a riddle — it needs people in two places at once. Anyone on a phone can take a station.",
          "Split the crew between the port winch and the starboard winch.",
          "Once both stations show they're manned, press HAUL ON THREE."
        ],
        solvedText:"The beam lifts a foot, then two, then swings clear — and at that exact moment the undergrowth behind you erupts. You don't look. You run, boots hammering the planks, the whole bridge bucking under something that steps onto it behind you."
      }
    }
  ]
},
/* ================= ROOM 4 — THE ESCAPE RAFT ================= */
{
  id:'raft', name:'Room 4 — The Escape Raft', scene:'cove', fx:'mist',
  intro:"Dusk. One chance to build, signal, and launch.",
  objective:"The operator staged an escape and never used it. <b>Finish it.</b> The ship's lights are already on the horizon.",
  entryBeat:"Fresh prints circle the raft materials — the same long, dragging prints from the beach where you started. It has been here. It has been waiting to see if you'd make it this far.",
  entrySound:'knock',
  completeText:"",
  chain:"Five tags with positional constraints (deck is 2nd; logs before deck; exactly one task between logs and mast; rudder never adjacent to the deck; sail after rudder) → unique order B-D-A-E-C → flare locker: “the military listens at TWICE the band” = 121.5×2 = 243.0 → 2430 → tide table: three highs, but only 6:40 (11 ft) clears the 9-ft reef before dark; minus 90 min = 5:10 → 510 → winch: the sail's order, but “the sea returns all things reversed” → 8513 backward = 3158 → fire flares in SOS (···−−−···) → LAUNCH.",
  objects:[
    { id:'dragmarks', icon:'👣', name:'Drag-Marks in the Sand', pos:{x:24,y:87,w:16,h:9},
      desc:"Long furrows circle the cove, the same as the beach at dawn — but here they're layered dozens deep, old over older, like a patrol route walked for years.\n\nAt the center of the pattern, planted upright in the sand: the operator's other boot.\n\nBuild fast." },
    { id:'raftkit', icon:'🛶', name:'Raft Materials', pos:{x:39,y:75,w:18,h:16},
      desc:"The operator staged everything and labeled each step with a tag — but the tags have scattered in the wind, and they read like a dead man's riddle:\n\nTAG A — “Raise the mast. Exactly one task must pass between lashing the logs and raising the mast, or the lashings slip.”\n\nTAG B — “Lash the logs before the deck is laid.”\n\nTAG C — “Rig the sail only once the rudder is true.”\n\nTAG D — “Lay the deck second. The logs will have settled by then.”\n\nTAG E — “Never fix the rudder right before or right after laying the deck. The hull can't take the strain.”",
      puzzle:{
        prompt:"Enter the five tag letters in build order.", placeholder:"FIVE LETTERS", answers:['BDAEC'],
        hints:[
          "One tag names an exact position — pin that down first, then see what must come before it.",
          "Deck is 2nd, and logs come before the deck, so logs are 1st. 'Exactly one task between logs and mast' puts the mast 3rd. Now where can the rudder legally sit?",
          "The rudder can't touch slot 1 or 3 (both adjacent to the deck in slot 2), and the sail must follow it: rudder 4th, sail 5th. Enter BDAEC."
        ],
        solvedText:"Logs, deck, mast, rudder, sail. It comes together fast under ten hands — an ugly, beautiful, seaworthy-enough raft. Now you need the flares and the tide.",
        solveBeat:"As the mast goes up, from the clifftop above the cove comes a sound like slow applause — two heavy limbs striking together. Once. Twice. Then nothing.",
        beatSound:'knock'
      }
    },
    { id:'locker', icon:'🧨', name:'Flare Locker', pos:{x:66,y:73,w:12,h:14},
      desc:"A steel flare locker, painted with fading emergency stripes, sealed with a 4-digit lock. The plaque riveted to the lid reads:\n\n“PROPERTY OF STATION 7.\nAN OPERATOR NEVER FORGETS THE EMERGENCY BAND —\nAND THE MILITARY LISTENS AT TWICE IT.”",
      puzzle:{
        prompt:"Enter the 4-digit code.", placeholder:"0000", answers:['2430'],
        hints:[
          "You knew the emergency band once — you tuned to it yourself, back in the station. But the plaque wants where the military listens.",
          "Twice the band. Take the frequency from the radio room and double it.",
          "121.5 × 2 = 243.0. Enter 2430."
        ],
        solvedText:"243.0 — twice the band that started all this. The locker opens on a bundle of signal flares, dry and intact, and beneath them a laminated tide table for the cove.",
        solveBeat:null
      }
    },
    { id:'tide', icon:'🌊', name:'Tide Table & Winch Notes', pos:{x:77,y:56,w:9,h:11}, hiddenUntil:'locker',
      desc:"The laminated card, in the operator's neat hand:\n\n“COVE TIDES —\nLOW  1:05 … 2 FT\nHIGH 4:10 … 8 FT\nHIGH 6:40 … 11 FT\nHIGH 9:55 … 9 FT (after dark)\n\nThe reef needs nine feet or better to clear.\nWe must not be on the water in the dark. Not here.\nSet the winch timer to launch 90 minutes before the tide we can survive.”",
      puzzle:{
        prompt:"Set the launch time (hour then minutes, e.g. 730).", placeholder:"H:MM", answers:['510','0510'],
        hints:[
          "Two filters: the reef's depth, and the dark. Only one high tide passes both.",
          "4:10 is only 8 feet — the raft grounds. 9:55 clears the reef but it's after dark, and the card is very clear about the dark. That leaves 6:40 — now count back 90 minutes.",
          "6:40 minus 1:30 is 5:10. Enter 510."
        ],
        solvedText:"5:10. The timer arms with a clunk — and the brass key from the beach, the one stamped TIDE, turns smoothly in the winch housing, as if the whole island had been one machine waiting for you to wind it."
      }
    },
    { id:'winch', icon:'⚙️', name:'Launch Winch Tumblers', pos:{x:85,y:67,w:10,h:16}, hiddenUntil:'tide',
      desc:"The winch release is guarded by four numbered tumblers — and above them, chiseled deep into the rock, four familiar shapes in a familiar order:\n\n▲   ■   ◆   ●\n\nBeneath them:\n\n“THE SAIL ORDERED THEM ONCE.\nTHE SEA RETURNS ALL THINGS REVERSED.”\n\nYou've seen these shapes before. On a beach. A lifetime ago this morning.",
      puzzle:{
        prompt:"Enter the 4-digit release code.", placeholder:"0000", answers:['3158'],
        hints:[
          "The shapes are in the sail's wind order — the same order that opened the crate. But read the second line of the carving again.",
          "The crate opened on 8-5-1-3. The sea returns all things reversed.",
          "8513 backward is 3158. Enter 3158."
        ],
        solvedText:"3-1-5-8 — the beach code, coming back to you the way the tide brings everything back. The release lever frees with a heavy CLACK. All that's left is to bring that ship — fire the flares in a signal no sailor on Earth can ignore.",
        solveBeat:"From the treeline at the cove's edge, for the first time, you hear it breathe. It is very close now. It has stopped hiding.",
        beatSound:'growl'
      }
    },
    { id:'signal', icon:'🔥', name:'Fire the Signal Flares', pos:{x:49,y:47,w:11,h:14}, hiddenUntil:'winch',
      desc:"The flare rack holds nine flares: enough for one message. Short bursts and long burns — the oldest distress signal there is. Get the pattern right and that ship WILL turn.\n\nGet it wrong, and you've lit yourself up for something other than rescue.",
      puzzle:{
        type:'signal',
        labels:{short:'🔥 SHORT BURST ·',long:'🔥 LONG BURN −',reset:'RESET RACK',send:'📡 SEND SIGNAL'},
        missText:'The flares sputter into the wrong pattern. The ship sails on.',
        prompt:"Fire the flares in the international distress pattern, then hit SEND SIGNAL. (Watch the sky behind this panel.)",
        answers:['...---...'],
        hints:[
          "Three letters every sailor on Earth knows.",
          "S is three shorts. O is three longs. Spell the distress call.",
          "Fire: short short short, long long long, short short short — SOS."
        ],
        solvedText:""
      }
    }
  ]
}
];

registerScenario({
  id:'eldermoor',
  title:'The Wreck of the Eldermoor',
  sub:'shipwrecked · an island that appears on no chart',
  tagline:'Survive the wreck, raise the dead radio station, and launch the raft before dark.',
  icon:'🏝️',
  card:`<svg viewBox="0 0 300 130" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="cgE" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b232e"/><stop offset=".7" stop-color="#b96f36"/><stop offset="1" stop-color="#e09c55"/></linearGradient></defs>
    <rect width="300" height="130" fill="url(#cgE)"/>
    <circle cx="216" cy="82" r="18" fill="#ffd894"/>
    <rect y="88" width="300" height="42" fill="#12333a"/>
    <path d="M186 92 q14 -40 40 -48 l50 -12 q8 18 4 34 l-8 22 q-46 10 -86 4z" fill="#221710"/>
    <path d="M0 96 q80 -10 160 2 t140 -2 v34 h-300z" fill="#8a6c44"/>
    <g fill="#0f2416"><path d="M40 96 q-8 -50 10 -78 q6 24 30 30 q-22 4 -24 22 q16 -4 26 8 q-20 0 -26 18z"/></g>
  </svg>`,
  titleFx:'rain', titleLightning:true,
  titleArt:`<svg viewBox="0 0 560 200">
      <defs><linearGradient id="stSea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#12333c"/><stop offset="1" stop-color="#050d10"/></linearGradient></defs>
      <rect y="130" width="560" height="70" fill="url(#stSea)"/>
      <path class="wave w2" d="M-40 140 Q 40 132 120 140 T 280 140 T 440 140 T 620 140 V 160 H -40 Z" fill="#27504f" opacity=".6"/>
      <g class="lampswing">
        <path d="M120 150 q 60 -34 160 -30 l 170 8 q 20 14 6 26 l -300 8 q -30 -4 -36 -12 z" fill="#0d0a07"/>
        <rect x="252" y="18" width="7" height="106" fill="#0d0a07" transform="rotate(7 255 70)"/>
        <rect x="352" y="42" width="6" height="84" fill="#0d0a07" transform="rotate(10 355 84)"/>
        <path class="flag" d="M259 20 l 44 10 -44 12 z" fill="#1c1410"/>
        <path d="M231 40 L 262 118 L 214 122 Z" fill="#151009"/>
        <path d="M337 62 L 360 120 L 320 124 Z" fill="#151009"/>
      </g>
      <path class="wave w1" d="M-40 156 Q 60 148 160 156 T 360 156 T 560 156 T 760 156 V 200 H -40 Z" fill="#0e2429" opacity=".9"/>
    </svg>`,
  story:[
    "The storm took the <em>Eldermoor</em> apart in the dark. You remember cold water, splintered wood, and then sand.",
    "Dawn finds your crew alive on the beach of an island that appears on no chart. Up the ridge, half-swallowed by vines, stands an abandoned radio station — your one hope of calling for rescue and getting off this island.",
    "Work fast. Solve what the island puts in front of you. And if you hear something moving in the treeline… don't stop to look."
  ],
  begin:'⚓ BEGIN — 45:00', finalButton:'LAUNCH ⛵',
  emojis:['⚓','🏴‍☠️','🦜','🌊','🦈','🐙','🧭','🔥','🥥','🦀','⛵','💀'],
  ratings:['🏆 Master Navigator','⚓ Able Seafarer','🪢 Deck Hand','🛟 Barely Made It','🌙 Rescued After Dark'],
  shareTitle:'ESCAPED THE ELDERMOOR!',
  victoryTitle:'🚀 THE RAFT IS AWAY',
  victoryProse:`Three short. Three long. Three short. The flares hang burning over the cove — and out on the black water, the ship's lights swing toward you. The winch releases, the tide takes the raft, and the island falls away behind you.<br><br>
    On the beach where you started, at the very edge of the flare-light, something tall stands motionless at the waterline, watching you go. It does not follow. It has never needed to follow anyone before.<br><br>
    You don't look away until the island is gone.`,
  gameOverProse:`The sun slips below the horizon. The treeline is very quiet now — the patient kind of quiet.<br><br>The ship's lights are still out there. Barely.`,
  flare:{x:852,y:470,hue:[255,120,90]},
  ambience:[
    {surf:.40, wind:.08, drone:.012},
    {drone:.03, hum:.045, wind:.015},
    {wind:.05, drone:.05, rustle:.15},
    {surf:.16, wind:.10, drone:.065, rustle:.05}
  ],
  fx:['mist','motes','fireflies','mist'],
  events:[
    [{s:'gull',p:.45}],
    [{s:'crackle',p:.6}],
    [{s:'crickets',p:.55},{s:'creak',p:.2}],
    [{s:'wave',p:.5}]
  ],
  wrongBeats:WRONG_BEATS, wrongSounds:WRONG_SOUNDS,
  scenes:SCENES, rooms:ROOMS
});
})();
