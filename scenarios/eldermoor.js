/* ============================================================
   SCENARIO: THE WRECK OF THE ELDERMOOR — shipwreck island

   Built on the reset grammar (see PUZZLES.md): locks that look like locks,
   and whatever opens them somewhere else in the room. An object is either a
   clue (a drawing, sometimes with something you can do to it) or a lock
   (puzzle.type: combo | dirpad | clock | toggle | press | tiles | tune |
   simul). Each object carries its own art into the room as `sprite`; the
   backdrops below are only the place.
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
<!-- torn sail on a rock -->
<g id="art-sail">
  <ellipse cx="430" cy="560" rx="90" ry="34" fill="#3a3128"/>
  <path d="M355 552 L470 420 L520 556 q-60 26 -165 -4z" fill="#cfc0a0"/>
  <path d="M420 470 l16 30 -30 4 z" fill="#8d7f62"/>
  <path d="M470 420 L520 556" stroke="#8d7f62" stroke-width="3" fill="none"/>
</g>
<!--SPRITES-->
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-beach" cx="230" cy="210" r="6" fill="#ffdf9c" opacity=".12"/>
<circle cx="230" cy="210" r="20" fill="#ffdf9c" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-beach" class="surge" cx="780" cy="430" rx="96" ry="70" fill="#ffb45e" opacity="0"/>
<!-- more life on the wing and the water -->
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
<!-- desk -->
<rect x="420" y="540" width="860" height="26" fill="#4a3922"/>
<rect x="430" y="566" width="840" height="130" fill="#3a2c19"/>
<rect x="450" y="696" width="30" height="120" fill="#241a0e"/><rect x="1220" y="696" width="30" height="120" fill="#241a0e"/>
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
<!--SPRITES-->
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-radio" cx="580" cy="190" r="6" fill="#ffdf9c" opacity=".12"/>
<circle cx="580" cy="190" r="20" fill="#ffdf9c" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-radio" class="surge" cx="250" cy="670" rx="96" ry="70" fill="#ffb45e" opacity="0"/>
<!-- a moth worrying the one working lamp -->
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
  <g fill="#16321e"><path d="M330 268 q-130 -70 -230 -30 q110 -16 230 30z"/><path d="M330 268 q-40 -120 -150 -150 q80 60 150 150z"/><path d="M330 268 q80 -110 190 -104 q-100 24 -190 104z"/><path d="M330 268 q130 -30 200 40 q-110 -30 -200 -40z"/></g>
</g>
<!-- the river -->
<g id="art-river">
  <path d="M0 640 Q400 610 800 648 T1600 636 L1600 730 Q1200 762 800 726 T0 738 Z" fill="url(#jRiver)"/>
  <path class="rivershine" d="M40 676 Q400 650 800 684 T1560 672" stroke="#3f7a6e" stroke-width="4" fill="none" stroke-dasharray="26 26" opacity=".6"/>
  <path class="rivershine" d="M80 706 Q460 680 860 710 T1580 700" stroke="#2c5a52" stroke-width="3" fill="none" stroke-dasharray="18 30" opacity=".5"/>
</g>
<!--SPRITES-->
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
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-jungle" cx="230" cy="210" r="6" fill="#ffdf9c" opacity=".12"/>
<circle cx="230" cy="210" r="20" fill="#ffdf9c" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-jungle" class="surge" cx="1340" cy="430" rx="96" ry="70" fill="#ffb45e" opacity="0"/>
<!-- canopy birds crossing, high and unbothered -->
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
<!--SPRITES-->
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-cove" cx="230" cy="210" r="6" fill="#ffdf9c" opacity=".12"/>
<circle cx="230" cy="210" r="20" fill="#ffdf9c" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-cove" class="surge" cx="380" cy="430" rx="96" ry="70" fill="#ffb45e" opacity="0"/>
<!-- the sky does most of the work here -->
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

/* ============================================================
   THE DRAWINGS, AND THE ROOMS THEY STAND IN

   Every prop is drawn once and used twice: large in the close-up, and small
   standing in the room, so what you can see from across the beach is exactly
   what you count when you lean in.
   ============================================================ */
const C = ART.COL, I = ART.INK, W = ART.words, GL = ART.glyph;

/* ============================================================
   ROOM 1 — THE BEACH
   Count the floats to open the crate; the page in the crate reads the flags
   on the mast, which opens the chest; the chart in the chest is in six
   pieces; pieced together, it is a course for the binnacle — on a chart
   whose north is not at the top.
   ============================================================ */

/* Ten signal flags. Each is a different *kind* of pattern — a disc, a cross,
   quarters, a border — so no two are told apart by colour alone. */
const FLAG = {
  A: `<rect width="96" height="64" fill="${C.yellow}"/><circle cx="48" cy="32" r="17" fill="${C.black}"/>`,
  C: `<rect width="96" height="64" fill="${C.red}"/><rect x="38" width="20" height="64" fill="${C.white}"/><rect y="22" width="96" height="20" fill="${C.white}"/>`,
  E: `<rect width="96" height="64" fill="${C.white}"/><path d="M0 0L96 64M96 0L0 64" stroke="${C.red}" stroke-width="13"/>`,
  L: `<rect width="96" height="64" fill="${C.yellow}"/><rect x="48" width="48" height="32" fill="${C.blue}"/><rect y="32" width="48" height="32" fill="${C.blue}"/>`,
  N: `<rect width="96" height="64" fill="${C.white}"/>` + [0, 1, 2, 3].map(r => [0, 1, 2, 3].filter(c => (r + c) % 2 === 0)
        .map(c => `<rect x="${c * 24}" y="${r * 16}" width="24" height="16" fill="${C.blue}"/>`).join('')).join(''),
  O: `<rect width="96" height="64" fill="${C.yellow}"/><path d="M0 0H96L0 64Z" fill="${C.red}"/>`,
  R: `<rect width="96" height="64" fill="${C.blue}"/><rect x="16" y="13" width="64" height="38" fill="${C.white}"/>`,
  S: `<rect width="96" height="64" fill="${C.blue}"/><rect x="32" width="32" height="64" fill="${C.white}"/>`,
  T: `<rect width="96" height="64" fill="${C.red}"/><rect y="21.5" width="96" height="21" fill="${C.white}"/>`,
  W: `<rect width="96" height="64" fill="${C.blue}"/><polygon points="48,7 86,32 48,57 10,32" fill="${C.yellow}"/>`,
};
function flag(letter, x, y, w = 96, h = 64) {
  return ART.inset(x, y, w, h, 96, 64, FLAG[letter], { clip: true })
    + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#1b1410" stroke-width="${(3 * w / 96).toFixed(2)}"/>`;
}

/* The hoist: what is still flying from the mast, top to bottom. */
const HOIST = 'CORAL';
const hoistArt = { w: 360, h: 780, body: (() => {
  let b = `<rect x="58" y="24" width="18" height="756" fill="${I.woodDark}"/><rect x="58" y="24" width="6" height="756" fill="${I.wood}" opacity=".75"/>`;
  b += `<circle cx="67" cy="20" r="13" fill="${I.wood}" stroke="${I.woodDark}" stroke-width="3"/>`;
  b += `<path d="M16 168L150 132" stroke="${I.woodDark}" stroke-width="13" stroke-linecap="round"/>`;
  b += `<path d="M67 30L122 54V770" fill="none" stroke="${I.rope}" stroke-width="3.5"/>`;
  HOIST.split('').forEach((ch, i) => {
    const y = 66 + i * 140;
    b += `<path d="M122 ${y + 8}h8M122 ${y + 118}h8" stroke="${I.rope}" stroke-width="5" stroke-linecap="round"/>`;
    b += flag(ch, 130, y, 196, 128);
  });
  return b;
})() };

/* The net: glass floats in five colours, and only four of them are on the lock. */
const FLOAT_ROWS = ['yrwygwy', 'wbyrygr', 'ywrgybw'];
const FLOAT_COL = { y: 'yellow', r: 'red', w: 'white', g: 'green', b: 'blue' };
function glassFloat(x, y, r, color) {
  return `<circle cx="${x + 2}" cy="${y + 4}" r="${r}" fill="#000" opacity=".32"/>`
    + `<circle cx="${x}" cy="${y}" r="${r}" fill="${C[color]}" stroke="#14100c" stroke-width="2.5"/>`
    + `<path d="M${x - r} ${y}h${2 * r}M${x} ${y - r}v${2 * r}" stroke="#14100c" stroke-opacity=".28" stroke-width="2"/>`
    + `<path d="M${(x - r * .58).toFixed(1)} ${(y - r * .3).toFixed(1)}a${(r * .7).toFixed(1)} ${(r * .7).toFixed(1)} 0 0 1 ${(r * .5).toFixed(1)} ${(-r * .42).toFixed(1)}" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="${(r * .17).toFixed(1)}" stroke-linecap="round"/>`;
}
const floatsArt = { w: 720, h: 440, body: (() => {
  let b = `<defs><clipPath id="eldNet"><path d="M14 52Q360 104 706 46L654 404Q360 446 68 408Z"/></clipPath></defs>`;
  let mesh = '';
  for (let i = -8; i <= 14; i++) mesh += `<path d="M${i * 56} 40L${i * 56 + 250} 440M${i * 56 + 250} 40L${i * 56} 440"/>`;
  b += `<g clip-path="url(#eldNet)" stroke="${I.rope}" stroke-width="2.2" opacity=".5" fill="none">${mesh}</g>`;
  b += `<path d="M8 48Q360 104 712 42" fill="none" stroke="${I.rope}" stroke-width="8" stroke-linecap="round"/>`;
  b += `<path d="M68 408Q360 446 654 404" fill="none" stroke="${I.rope}" stroke-width="5" stroke-linecap="round" opacity=".8"/>`;
  FLOAT_ROWS.forEach((row, r) => row.split('').forEach((k, c) => {
    const x = 100 + c * 87 + ((r * 7 + c * 13) % 17 - 8), y = 146 + r * 96 + ((r * 11 + c * 5) % 15 - 7);
    b += glassFloat(x, y, 30, FLOAT_COL[k]);
  }));
  return b;
})() };

/* The page from the signal book: the legend the hoist is read with. */
const bookArt = { w: 720, h: 430, body: (() => {
  let b = ART.paper(20, 14, 680, 402);
  b += W(360, 60, 'Signals', { size: 30, spacing: 6 });
  b += `<path d="M236 74H484" stroke="${I.inkSoft}" stroke-width="1.5"/>`;
  'ACELNORSTW'.split('').forEach((ch, i) => {
    const x = 60 + (i % 5) * 126, y = 98 + Math.floor(i / 5) * 156;
    b += flag(ch, x, y, 104, 69) + W(x + 52, y + 69 + 38, ch, { size: 32 });
  });
  return b;
})() };

/* The chart. Its course runs from the wreck to the station in seven legs —
   and its compass rose has north on the right-hand side of the sheet. */
const ROUTE = [[120, 420], [120, 300], [300, 300], [300, 180], [180, 180], [180, 70], [420, 70], [610, 70]];
const chartArt = { w: 720, h: 480, body: (() => {
  const sea = '#aebfb4', land = '#d9c99d', ink = '#4a3a22', red = '#8a2b1f';
  let b = `<rect width="720" height="480" fill="${sea}"/>`;
  // faint soundings in the water so the sea pieces are not blank
  for (let i = 0; i < 26; i++) b += `<path d="M${(i * 97) % 700 + 8} ${(i * 61) % 460 + 12}q8 -5 16 0" fill="none" stroke="#6f8a82" stroke-width="1.5" opacity=".55"/>`;
  b += `<path d="M64 452Q30 380 58 300Q20 220 74 150Q60 60 150 34Q260 8 380 26Q520 6 640 30Q700 60 690 150Q712 240 684 330Q700 420 630 450Q500 470 380 452Q230 474 64 452Z" fill="${land}" stroke="${ink}" stroke-width="3"/>`;
  b += `<path d="M64 452Q30 380 58 300Q20 220 74 150Q60 60 150 34Q260 8 380 26Q520 6 640 30Q700 60 690 150Q712 240 684 330Q700 420 630 450Q500 470 380 452Q230 474 64 452Z" fill="none" stroke="${ink}" stroke-width="9" stroke-opacity=".12"/>`;
  // high ground
  [[430, 215, 96, 52], [430, 215, 62, 32], [430, 215, 30, 14], [560, 150, 44, 26], [220, 380, 50, 22]].forEach(([cx, cy, rx, ry]) => {
    b += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${ink}" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="3 5"/>`;
  });
  // palms, as a chartmaker marks them
  [[90, 250], [250, 120], [520, 260], [350, 395], [640, 250], [495, 395]].forEach(([x, y]) => {
    b += `<path d="M${x} ${y}v-14M${x} ${y - 14}q-9 -6 -14 1M${x} ${y - 14}q9 -6 14 1M${x} ${y - 14}q-2 -10 -10 -11M${x} ${y - 14}q2 -10 10 -11" fill="none" stroke="${ink}" stroke-opacity=".55" stroke-width="1.8" stroke-linecap="round"/>`;
  });
  // the course
  b += `<path d="M${ROUTE.map(p => p.join(' ')).join('L')}" fill="none" stroke="${red}" stroke-width="4.5" stroke-dasharray="11 8" stroke-linejoin="round"/>`;
  ROUTE.forEach(([x, y], i) => {
    if (i) {
      const [px, py] = ROUTE[i - 1], mx = (x + px) / 2, my = (y + py) / 2;
      const ang = Math.atan2(y - py, x - px) * 180 / Math.PI;
      b += `<path d="M-9 -8L9 0L-9 8Z" transform="translate(${mx} ${my}) rotate(${ang})" fill="${red}"/>`;
    }
    b += `<circle cx="${x}" cy="${y}" r="8" fill="${land}" stroke="${red}" stroke-width="4"/>`;
  });
  b += GL('anchor', 120 - 22, 420 + 12, 44, ink);
  b += GL('antenna', 610 + 14, 70 - 26, 50, ink);
  // the rose: north is to the right of the sheet
  const rx = 585, ry = 330;
  b += `<circle cx="${rx}" cy="${ry}" r="66" fill="${land}" stroke="${ink}" stroke-width="2.5"/><circle cx="${rx}" cy="${ry}" r="52" fill="none" stroke="${ink}" stroke-width="1" stroke-opacity=".6"/>`;
  [45, 135, 225, 315].forEach(a => b += `<path d="M0 -40L7 0L0 40L-7 0Z" transform="translate(${rx} ${ry}) rotate(${a})" fill="${ink}" opacity=".35"/>`);
  [90, 180, 270].forEach(a => b += `<path d="M0 -62L10 0L-10 0Z" transform="translate(${rx} ${ry}) rotate(${a + 90})" fill="none" stroke="${ink}" stroke-width="2"/>`);
  b += `<path d="M0 -84L13 0L-13 0Z" transform="translate(${rx} ${ry}) rotate(90)" fill="${ink}"/>`;
  b += `<circle cx="${rx}" cy="${ry}" r="6" fill="${land}" stroke="${ink}" stroke-width="2"/>`;
  b += W(rx + 100, ry + 12, 'N', { size: 34, fill: ink });
  // cartouche
  b += `<rect x="288" y="396" width="184" height="50" fill="${land}" stroke="${ink}" stroke-width="2"/><rect x="293" y="401" width="174" height="40" fill="none" stroke="${ink}" stroke-width="1"/>`;
  b += W(380, 428, 'Eldermoor I.', { size: 20, fill: ink });
  b += `<rect x="6" y="6" width="708" height="468" fill="none" stroke="${ink}" stroke-width="4"/>`;
  return b;
})() };

/* ---- what stands on the sand ---- */
function crateBody(open) {
  let b = `<ellipse cx="80" cy="128" rx="78" ry="7" fill="#000" opacity=".28"/>`;
  b += `<rect x="12" y="36" width="136" height="90" fill="#6b5233"/>`;
  [0, 1, 2].forEach(i => b += `<path d="M12 ${58 + i * 23}H148" stroke="#3f2f1b" stroke-width="2"/>`);
  b += `<rect x="26" y="36" width="13" height="90" fill="#3a3f44"/><rect x="121" y="36" width="13" height="90" fill="#3a3f44"/>`;
  if (!open) {
    b += `<rect x="6" y="24" width="148" height="16" rx="2" fill="#7d6240"/><rect x="6" y="24" width="148" height="5" rx="2" fill="#9a7c52"/>`;
    b += `<path d="M70 64v-8a10 10 0 0 1 20 0v8" fill="none" stroke="#9aa3a7" stroke-width="4.5"/>`
      + `<rect x="60" y="62" width="40" height="27" rx="4" fill="${I.brass}" stroke="${I.brassDark}" stroke-width="2"/>`;
    ['blue', 'red', 'white', 'yellow'].forEach((c, i) => b += `<circle cx="${67 + i * 8.6}" cy="75.5" r="3.4" fill="${C[c]}" stroke="#000" stroke-opacity=".5" stroke-width=".8"/>`);
  } else {
    b += `<rect x="12" y="36" width="136" height="16" fill="#17100a"/>`;
    b += `<g transform="rotate(-26 8 34)"><rect x="6" y="14" width="148" height="16" rx="2" fill="#7d6240"/><rect x="6" y="14" width="148" height="5" rx="2" fill="#9a7c52"/></g>`;
    b += `<rect x="62" y="22" width="44" height="30" fill="${I.paper}" stroke="${I.paperDark}" transform="rotate(8 84 37)"/>`;
  }
  return b;
}
function chestBody(open) {
  let b = `<ellipse cx="84" cy="105" rx="80" ry="6.5" fill="#000" opacity=".28"/>`;
  if (open) b += `<path d="M18 52Q84 -14 150 52Z" fill="#3a1f1a" stroke="#241310" stroke-width="2"/><path d="M30 50Q84 2 138 50" fill="none" stroke="${I.brass}" stroke-width="3" opacity=".7"/>`;
  b += `<rect x="14" y="50" width="140" height="52" rx="3" fill="#5a2e26" stroke="#2c1612" stroke-width="2"/>`;
  b += `<rect x="14" y="50" width="16" height="52" fill="${I.brass}" opacity=".85"/><rect x="138" y="50" width="16" height="52" fill="${I.brass}" opacity=".85"/>`;
  if (!open) {
    b += `<path d="M14 54V40Q84 6 154 40V54Z" fill="#6b3a30" stroke="#2c1612" stroke-width="2"/><path d="M30 44Q84 16 138 44" fill="none" stroke="${I.brass}" stroke-width="3" opacity=".8"/>`;
    b += `<rect x="60" y="46" width="48" height="22" rx="3" fill="${I.brass}" stroke="${I.brassDark}" stroke-width="2"/>`;
    [0, 1, 2, 3, 4].forEach(i => b += `<rect x="${64.5 + i * 8.2}" y="51" width="6" height="12" rx="1" fill="#17100a"/>`);
  } else {
    b += `<rect x="30" y="50" width="108" height="12" fill="#150c0a"/>`;
    b += `<rect x="52" y="40" width="30" height="22" fill="${I.paper}" stroke="${I.paperDark}" transform="rotate(-12 67 51)"/><rect x="84" y="42" width="30" height="20" fill="${I.paper}" stroke="${I.paperDark}" transform="rotate(9 99 52)"/>`;
  }
  return b;
}
function binnacleBody(open) {
  let b = `<ellipse cx="64" cy="190" rx="52" ry="7" fill="#000" opacity=".28"/>`;
  b += `<path d="M44 96H84L94 190H34Z" fill="#6b4a2c" stroke="#2f2012" stroke-width="2"/><path d="M40 138H88" stroke="#2f2012" stroke-width="2" opacity=".6"/>`;
  b += `<path d="M22 86h84" stroke="#3a3f44" stroke-width="7" stroke-linecap="round"/><circle cx="18" cy="84" r="12" fill="#8c2f27" stroke="#2a1512" stroke-width="2"/><circle cx="110" cy="84" r="12" fill="#2f6b48" stroke="#12261b" stroke-width="2"/>`;
  b += `<path d="M30 98Q30 38 64 38Q98 38 98 98Z" fill="${I.brass}" stroke="${I.brassDark}" stroke-width="2.5"/><path d="M40 92Q40 50 60 46" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="4" stroke-linecap="round"/>`;
  b += `<circle cx="64" cy="70" r="15" fill="${open ? '#f3e7c2' : '#16242a'}" stroke="${I.brassDark}" stroke-width="3"/>`;
  if (open) b += `<path d="M64 58L68 70L64 82L60 70Z" fill="#8a2b1f"/>`;
  b += `<rect x="54" y="30" width="20" height="10" rx="3" fill="${I.brassDark}"/>`;
  return b;
}
function scrapsBody(whole) {
  if (whole) {
    // the same chart as the close-up, small: a made-up course here could be read, and would be wrong
    return `<ellipse cx="88" cy="76" rx="70" ry="5" fill="#000" opacity=".22"/><g transform="rotate(-5 88 40)"><rect x="28" y="0" width="120" height="80" fill="#d9c99d" stroke="#4a3a22" stroke-width="2"/>`
      + ART.inset(29, 1, 118, 78, chartArt.w, chartArt.h, chartArt.body, { clip: true }) + `</g>`;
  }
  let b = `<ellipse cx="88" cy="74" rx="80" ry="6" fill="#000" opacity=".2"/>`;
  [[10, 30, -14], [52, 10, 9], [98, 22, -6], [34, 44, 16], [80, 46, -20], [124, 44, 11]].forEach(([x, y, r], i) => {
    b += `<g transform="rotate(${r} ${x + 22} ${y + 14})"><rect x="${x}" y="${y}" width="44" height="29" fill="${i % 2 ? '#d9c99d' : '#aebfb4'}" stroke="#4a3a22" stroke-width="1.5"/><path d="M${x + 6} ${y + 18}h${14 + i * 3}" stroke="#8a2b1f" stroke-width="2" stroke-dasharray="4 3"/></g>`;
  });
  return b;
}

const POS1 = {
  floats:   { x: 67.8, y: 56.7, w: 13.4, h: 14.5 },
  hoist:    { x: 75.4, y: 15.6, w: 9.5,  h: 36.7 },
  crate:    { x: 46,   y: 70,   w: 10,   h: 15 },
  chest:    { x: 75,   y: 80.5, w: 10.5, h: 12.4 },
  chart:    { x: 31,   y: 86,   w: 11,   h: 9 },
  binnacle: { x: 17.5, y: 68,   w: 8,    h: 22 },
};

const ROOM1 = {
  id:'beach', name:'Room 1 — The Beach', scene:'beach', fx:'mist',
  stageFx:'swell',
  relays:[{el:'rl-beach',mode:'pulse',period:3.4}],
  wrongSound:'wave',
  intro:"Dawn. A graveyard of cargo and canvas. Find a way off this beach.",
  objective:"<b>Glowing rings</b> mark what is worth a closer look. A lock shows you the kind of answer it wants — the answer itself is always somewhere else on the beach.",
  entryBeat:"As you take your first steps up the beach, the treeline goes quiet all at once — the way a room goes quiet when something walks in.",
  entrySound:null,
  completeText:"The compass swings once and settles. A course to follow and a needle to follow it by — you leave the wreck behind, and a trail opens in the vines like a mouth.",
  chain:"The crate's padlock has four coloured rings, and the net along the hull is full of glass floats in the same colours: 2 blue, 4 red, 5 white, 7 yellow = 2457 → the page in the crate is cut from the signal book, and reads the five flags still flying from the mast, top to bottom, as CORAL → the chest gives up a chart torn into six, which goes back together → its course runs in seven legs from the wreck to the station, and its compass rose points north to the right of the sheet, so up the page is west: W N W S W N N opens the binnacle.",
  objects:[
    { id:'floats', icon:'🪢', name:'Net of Glass Floats', pos:POS1.floats,
      desc:"A fishing net snagged along the hull, still heavy with the glass floats that held it up.",
      figure:ART.svg(floatsArt.w, floatsArt.h, floatsArt.body),
      sprite:ART.sprite(POS1.floats, floatsArt.w, floatsArt.h, floatsArt.body) },
    { id:'hoist', icon:'🚩', name:'Signal Hoist', pos:POS1.hoist,
      desc:"Five flags still flying from the broken mast, exactly as somebody left them.",
      figure:ART.svg(hoistArt.w, hoistArt.h, hoistArt.body),
      sprite:ART.sprite(POS1.hoist, hoistArt.w, hoistArt.h, hoistArt.body, { rot: 5 }) },
    { id:'crate', icon:'📦', name:'Cargo Crate', pos:POS1.crate,
      desc:"Iron-banded, salt-swollen, and still shut.",
      sprite:st=>ART.sprite(POS1.crate, 160, 135, crateBody(st.solved)),
      puzzle:{ type:'combo', from:['floats'],
        wheels:[{mark:{color:'blue'}},{mark:{color:'red'}},{mark:{color:'white'}},{mark:{color:'yellow'}}],
        faces:'0123456789', answer:'2457',
        hints:[
          "Four wheels, four coloured rings. Something else on this beach comes in those same colours.",
          "The glass floats in the net along the hull. Count how many there are of each ring colour — green is on no ring, so leave it out.",
          "Two blue, four red, five white, seven yellow, in the order the rings run: 2457."
        ],
        solvedText:"The shackle drops. Inside, wrapped in oilcloth, is a page cut from the ship's signal book.",
        inside:{ name:'From the signal book', figure:ART.svg(bookArt.w, bookArt.h, bookArt.body) } } },
    { id:'chest', icon:'🧰', name:"Captain's Sea Chest", pos:POS1.chest,
      desc:"Brass-bound, with five lettered wheels where a keyhole should be.",
      sprite:st=>ART.sprite(POS1.chest, 168, 112, chestBody(st.solved)),
      puzzle:{ type:'combo', from:['hoist','crate'], skin:'plate',
        wheels:5, faces:'ACELNORSTW', answer:'CORAL',
        hints:[
          "The lock wants five letters, and the only thing on this wreck still saying anything is flying from the mast.",
          "The page in the crate gives a letter for every flag. Read the hoist from the top flag down.",
          "Cross, diagonal halves, white panel in a border, black disc, quarters: C, O, R, A, L."
        ],
        solvedText:"The wheels line up and the lid lifts. Inside is a chart — torn, deliberately, into six.",
        inside:{ name:'Six scraps of one chart', figure:ART.svg(176, 81, scrapsBody(false)) } } },
    { id:'chart', icon:'🗺️', name:'Torn Chart', pos:POS1.chart, hiddenUntil:'chest',
      desc:"Six scraps of the same chart, laid out on the sand. Somebody did not want this read.",
      sprite:st=>ART.sprite(POS1.chart, 176, 81, scrapsBody(st.solved)),
      puzzle:{ type:'tiles', cols:3, rows:2, picture:chartArt, start:[4,0,5,2,1,3],
        hints:[
          "Tap one scrap, then another, and they change places.",
          "The heavy border runs round the outside of the sheet, and the coastline and the dashed course have to carry on from scrap to scrap.",
          "The anchor is bottom left, the compass rose bottom right, the mast top right."
        ],
        solvedText:"The scraps meet. A course runs from the wreck, across the island, to a mast on the far side.",
        inside:{ name:'The chart, whole', figure:ART.svg(chartArt.w, chartArt.h, chartArt.body) } } },
    { id:'binnacle', icon:'🧭', name:"Ship's Binnacle", pos:POS1.binnacle,
      desc:"The compass housing, thrown clear of the wreck. Its hood is held shut by a lock you steer rather than turn.",
      sprite:st=>ART.sprite(POS1.binnacle, 128, 198, binnacleBody(st.solved), { rot: -7 }),
      puzzle:{ type:'dirpad', from:['chart'], slots:7, answer:'WNWSWNN',
        hints:[
          "Seven presses. The chart from the chest marks a course in seven legs, from the anchor to the mast.",
          "Before you call any leg north, find the compass rose on that chart. Its N is not at the top of the sheet.",
          "North is to the right, so up the page is west: W, N, W, S, W, N, N."
        ],
        solvedText:"The hood swings back on a compass still alive in its bowl, already pointing the way inland." } },
  ]
};

/* ============================================================
   ROOM 2 — THE RADIO STATION
   Two ways in. The breaker board wants three circuits and the wall shows
   which cable runs where; the hatch is a time lock and the log says when he
   shut it. Power wakes the receiver, the receiver prints morse, the poster
   reads it, the drawer opens on it — and the photograph in the drawer shows
   how the transmitter was patched, in a mirror.
   ============================================================ */

/* dots and dashes as marks, the same on the poster and on the tape */
const MORSE = { A:'.-', B:'-...', C:'-.-.', D:'-..', E:'.', F:'..-.', G:'--.', H:'....', I:'..', J:'.---', K:'-.-', L:'.-..', M:'--',
  N:'-.', O:'---', P:'.--.', Q:'--.-', R:'.-.', S:'...', T:'-', U:'..-', V:'...-', W:'.--', X:'-..-', Y:'-.--', Z:'--..' };
function morseMarks(code, x, y, u, fill) {
  let b = '', cx = x;
  code.split('').forEach(ch => {
    if (ch === '.') { b += `<circle cx="${cx + u / 2}" cy="${y}" r="${u / 2}" fill="${fill}"/>`; cx += u * 1.8; }
    else { b += `<rect x="${cx}" y="${y - u / 2}" width="${u * 2.8}" height="${u}" rx="${u / 2}" fill="${fill}"/>`; cx += u * 3.6; }
  });
  return { svg: b, w: cx - x - u * 0.8 };
}

/* the cable run: seven things on the left, seven breakers on the right */
const DEVICES = ['antenna', 'heater', 'bulb', 'fan', 'radio', 'kettle', 'pump'];
const WIRED_TO = { antenna: 5, heater: 1, bulb: 6, fan: 7, radio: 2, kettle: 3, pump: 4 };
const NEEDED = ['antenna', 'radio', 'bulb'];
const cablesArt = { w: 720, h: 420, body: (() => {
  const rowY = i => 44 + i * 55;
  let b = `<rect x="14" y="10" width="92" height="400" rx="8" fill="#232b2d" stroke="#0e1213" stroke-width="3"/>`;
  b += `<rect x="614" y="10" width="92" height="400" rx="8" fill="#39444a" stroke="#0e1213" stroke-width="3"/>`;
  // Every cable wanders through a third height on the way across, so each
  // pair crosses more than once and none of them can be followed at a glance.
  const VIA = { antenna: 3, heater: 6, bulb: 0, fan: 5, radio: 1, kettle: 4, pump: 2 };
  const run = (d, i) => {
    const y1 = rowY(i), ym = rowY(VIA[d]) + (i % 2 ? 9 : -9), y2 = rowY(WIRED_TO[d] - 1);
    return `M106 ${y1}C210 ${y1} 250 ${ym} 360 ${ym}S510 ${y2} 614 ${y2}`;
  };
  let runs = '';
  DEVICES.forEach((d, i) => runs += `<path d="${run(d, i)}" fill="none" stroke="#090b0c" stroke-width="10" stroke-linecap="round"/>`);
  DEVICES.forEach((d, i) => runs += `<path d="${run(d, i)}" fill="none" stroke="#5b656a" stroke-width="5" stroke-linecap="round"/>`);
  b += runs;
  DEVICES.forEach((d, i) => {
    b += `<circle cx="60" cy="${rowY(i)}" r="22" fill="#11181a" stroke="#4a565b" stroke-width="2"/>` + GL(d, 60 - 16, rowY(i) - 16, 32, '#e6d9b8');
    b += `<circle cx="106" cy="${rowY(i)}" r="6" fill="#090b0c"/>`;
  });
  for (let n = 1; n <= 7; n++) {
    b += `<circle cx="614" cy="${rowY(n - 1)}" r="6" fill="#090b0c"/>`;
    b += `<rect x="636" y="${rowY(n - 1) - 20}" width="48" height="40" rx="5" fill="#11181a" stroke="#6a777d" stroke-width="2"/>`;
    b += W(660, rowY(n - 1) + 10, String(n), { size: 28, fill: '#e6d9b8', face: 'num' });
  }
  return b;
})() };

/* what the generator can carry, on a card screwed to the breaker board */
const loadCard = ART.svg(600, 150, (() => {
  let b = `<rect x="4" y="4" width="592" height="142" rx="8" fill="#d7ccae" stroke="#5b5138" stroke-width="3"/>`;
  b += `<circle cx="22" cy="22" r="5" fill="#5b5138"/><circle cx="578" cy="22" r="5" fill="#5b5138"/><circle cx="22" cy="128" r="5" fill="#5b5138"/><circle cx="578" cy="128" r="5" fill="#5b5138"/>`;
  b += `<path d="M262 20V130" stroke="#5b5138" stroke-width="2" stroke-dasharray="5 5"/>`;
  NEEDED.forEach((d, i) => {
    const x = 62 + i * 72;
    b += GL(d, x - 24, 34, 48, '#2f2a1c') + GL('tick', x - 15, 92, 30, '#2f7d45');
  });
  DEVICES.filter(d => !NEEDED.includes(d)).forEach((d, i) => {
    const x = 310 + i * 72;
    b += GL(d, x - 24, 34, 48, '#2f2a1c') + GL('nope', x - 14, 93, 28, '#b03a2e');
  });
  return b;
})());

/* the wall poster */
const posterArt = { w: 720, h: 500, body: (() => {
  let b = ART.paper(16, 12, 688, 476) + ART.pin(360, 26);
  b += W(360, 70, 'Morse Code', { size: 30, spacing: 4 });
  b += `<path d="M230 84H490" stroke="${I.inkSoft}" stroke-width="1.5"/>`;
  Object.keys(MORSE).forEach((ch, i) => {
    const col = Math.floor(i / 7), row = i % 7;
    const x = 52 + col * 168, y = 126 + row * 51;
    b += W(x + 12, y + 10, ch, { size: 28 }) + morseMarks(MORSE[ch], x + 44, y, 11, I.ink).svg;
  });
  return b;
})() };

/* what the receiver prints once it has found the station */
const TAPE = 'RAVEN';
const tapeFig = ART.svg(720, 150, (() => {
  let b = `<rect x="0" y="30" width="720" height="90" fill="#e7dcc0"/><path d="M0 30H720M0 120H720" stroke="#a8996f" stroke-width="2"/>`;
  for (let x = 14; x < 720; x += 28) b += `<circle cx="${x}" cy="40" r="3.5" fill="#12100c" opacity=".55"/><circle cx="${x}" cy="110" r="3.5" fill="#12100c" opacity=".55"/>`;
  let x = 46;
  TAPE.split('').forEach(ch => { const m = morseMarks(MORSE[ch], x, 75, 15, '#1d1711'); b += m.svg; x += m.w + 54; });
  return b;
})());

/* the log: his day, as he drew it */
const ROUTINE = [['sunrise', 6, 10], ['antenna', 8, 0], ['hatch', 9, 40], ['moon', 11, 15]];
const logArt = { w: 720, h: 430, body: (() => {
  let b = `<path d="M24 26Q190 8 356 30V414Q190 392 24 410Z" fill="${I.paper}" stroke="${I.paperDark}" stroke-width="2"/>`;
  b += `<path d="M364 30Q530 8 696 26V410Q530 392 364 414Z" fill="#d3c49d" stroke="${I.paperDark}" stroke-width="2"/>`;
  b += `<path d="M360 28V416" stroke="#6b5a38" stroke-width="5"/>`;
  ROUTINE.forEach(([g, h, m], i) => {
    const px = i < 2 ? 0 : 340, y = 120 + (i % 2) * 170;
    b += GL(g, 62 + px, y - 34, 68, I.ink);
    b += ART.clockFace(240 + px, y, 54, h, m, { face: '#efe6cc', ink: I.ink, rim: I.ink });
    b += `<path d="M56 ${y + 62}q60 -8 120 0t120 0" transform="translate(${px} 0)" fill="none" stroke="${I.inkSoft}" stroke-width="1.6" opacity=".55"/>`;
  });
  return b;
})() };

/* the photograph: the set as it was, caught in the window glass at night */
const PATCH = ['blue', 'yellow', 'red', 'green'];            // as it really was, left to right
const photoFig = ART.svg(720, 500, (() => {
  let room = `<rect x="24" y="24" width="672" height="430" fill="#4c5a52"/><rect x="24" y="360" width="672" height="94" fill="#2f2a22"/>`;
  room += `<rect x="430" y="52" width="236" height="60" fill="#d9cba6" stroke="#3a2c1c" stroke-width="3"/>`;
  room += W(520, 94, 'ANTENNA', { size: 30, fill: '#3a2c1c', spacing: 2 });
  room += `<path d="M606 82h38m-12 -10l12 10l-12 10" fill="none" stroke="#3a2c1c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>`;
  room += `<rect x="120" y="150" width="470" height="236" rx="10" fill="#262c2c" stroke="#0f1212" stroke-width="4"/>`;
  [0, 1, 2].forEach(i => room += `<circle cx="${210 + i * 145}" cy="204" r="26" fill="#d8d0b4" stroke="#0f1212" stroke-width="3"/><path d="M${210 + i * 145} 204l${14 - i * 12} -16" stroke="#0f1212" stroke-width="3"/>`);
  PATCH.forEach((c, i) => {
    const x = 190 + i * 110;
    room += `<circle cx="${x}" cy="300" r="26" fill="#0c0f0f" stroke="#555f5f" stroke-width="3"/>`;
    room += `<path d="M${x} 300C${x - 8} 372 ${x + 16} 392 ${x + 4} 446" fill="none" stroke="${C[c]}" stroke-width="9" stroke-linecap="round"/>`;
    room += `<circle cx="${x}" cy="300" r="17" fill="${C[c]}" stroke="#0c0f0f" stroke-width="2.5"/>`;
  });
  let b = `<rect x="2" y="2" width="716" height="496" fill="#efe9da" stroke="#b9ad90" stroke-width="2"/>`;
  b += `<g transform="translate(720 0) scale(-1 1)">${room}</g>`;
  // the glass it was taken in: the bars of the window, and the flash coming back
  b += `<path d="M360 24V454M24 236H696" stroke="#1b2320" stroke-width="12" opacity=".5"/>`;
  b += `<defs><radialGradient id="eldFlash"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".25" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>`;
  b += `<circle cx="560" cy="150" r="120" fill="url(#eldFlash)"/><path d="M560 60V240M470 150H650M500 90L620 210M620 90L500 210" stroke="#fff" stroke-opacity=".5" stroke-width="2"/>`;
  b += `<rect x="24" y="24" width="672" height="430" fill="#d8b46a" opacity=".12"/>`;
  return b;
})());

/* ---- what stands in the hut ---- */
function breakerBody(solved) {
  let b = `<rect x="6" y="6" width="148" height="168" rx="8" fill="#39444a" stroke="#161b1d" stroke-width="4"/><rect x="18" y="18" width="124" height="34" rx="3" fill="#d7ccae"/>`;
  for (let n = 1; n <= 7; n++) {
    const x = 24 + (n - 1) * 18.6, up = solved && [2, 5, 6].includes(n);
    b += `<rect x="${x - 4}" y="70" width="8" height="70" rx="4" fill="#0b0e0f"/><rect x="${x - 7}" y="${up ? 72 : 116}" width="14" height="20" rx="3" fill="${up ? '#e7b84a' : '#9aa5ab'}"/>`;
  }
  b += `<circle cx="80" cy="158" r="6" fill="${solved ? '#7fe08f' : '#3a2020'}"/>`;
  return b;
}
function receiverBody(live, found) {
  let b = `<rect x="6" y="6" width="428" height="170" rx="8" fill="#1d2a26" stroke="#3a4a44" stroke-width="4"/>`;
  b += `<rect x="26" y="24" width="180" height="46" rx="4" fill="${live ? '#082012' : '#06100a'}"/>`;
  if (live) b += `<path d="M36 47h40l8 -12 10 24 8 -12h92" fill="none" stroke="#8fe0a0" stroke-width="3" class="flick"/>`;
  b += `<circle cx="86" cy="124" r="32" fill="#0f1a14" stroke="#4a5a52" stroke-width="5"/><line x1="86" y1="124" x2="${found ? 104 : 70}" y2="${found ? 100 : 104}" stroke="${live ? '#8fe0a0' : '#4a5a52'}" stroke-width="4" stroke-linecap="round"/>`;
  b += `<rect x="284" y="30" width="130" height="64" rx="4" fill="#0f1a14" stroke="#3a4a44" stroke-width="3"/>`;
  [0, 1, 2, 3, 4, 5].forEach(i => b += `<rect x="${296 + i * 19}" y="${live ? 78 - (i < (found ? 6 : 2) ? 34 : 6) : 72}" width="12" height="${live ? (i < (found ? 6 : 2) ? 34 : 6) : 4}" fill="${live ? '#6fe08f' : '#24352b'}"/>`);
  [0, 1, 2, 3, 4].forEach(i => b += `<circle cx="${186 + i * 34}" cy="140" r="8" fill="${i % 2 ? '#3a4a44' : '#5c4423'}"/>`);
  if (found) b += `<rect x="150" y="150" width="150" height="40" fill="#e7dcc0" transform="rotate(4 225 170)"/>`;
  return b;
}
function drawerBody(open) {
  let b = `<rect x="4" y="${open ? 22 : 6}" width="192" height="84" rx="4" fill="#4a3922" stroke="#241a0e" stroke-width="3"/>`;
  if (open) b += `<rect x="12" y="6" width="176" height="22" fill="#1b130a"/><rect x="60" y="2" width="56" height="24" fill="#efe9da" stroke="#b9ad90" transform="rotate(-6 88 14)"/>`;
  b += `<rect x="56" y="${open ? 50 : 34}" width="88" height="30" rx="4" fill="${I.brass}" stroke="${I.brassDark}" stroke-width="2"/>`;
  [0, 1, 2, 3, 4].forEach(i => b += `<rect x="${63 + i * 15.4}" y="${open ? 56 : 40}" width="11" height="18" rx="2" fill="#17100a"/>`);
  return b;
}
function hatchBody(open) {
  let b = `<path d="M30 6H230L260 70H0Z" fill="${open ? '#050707' : '#39413f'}" stroke="#20272a" stroke-width="6"/>`;
  if (!open) b += `<ellipse cx="130" cy="38" rx="34" ry="22" fill="#d9cfb2" stroke="${I.brassDark}" stroke-width="5"/><path d="M130 38L130 24M130 38L146 42" stroke="#2a1e0c" stroke-width="3.5" stroke-linecap="round"/>`;
  else b += `<path d="M44 14H216L236 58H24Z" fill="#000"/><path d="M70 60V30M110 60V30" stroke="#3a4449" stroke-width="5"/>`;
  return b;
}
function transmitterBody(solved) {
  let b = `<ellipse cx="94" cy="118" rx="92" ry="7" fill="#000" opacity=".3"/><rect x="6" y="8" width="176" height="106" rx="10" fill="#232c28" stroke="#3a4a44" stroke-width="5"/>`;
  [0, 1, 2].forEach(i => b += `<circle cx="${44 + i * 50}" cy="38" r="13" fill="#d8d0b4" stroke="#0f1212" stroke-width="2"/>`);
  (solved ? PATCH : ['', '', '', '']).forEach((c, i) => b += `<circle cx="${34 + i * 40}" cy="82" r="12" fill="${c ? C[c] : '#0c0f0f'}" stroke="#555f5f" stroke-width="2.5"/>`);
  b += `<circle cx="164" cy="30" r="7" fill="${solved ? '#7fe08f' : '#3a2020'}" class="${solved ? 'flick' : ''}"/>`;
  return b;
}

const POS2 = {
  cables:      { x: 27.5, y: 15.5, w: 20,   h: 18.7 },
  breakers:    { x: 55.5, y: 15.5, w: 10,   h: 20 },
  poster:      { x: 76.6, y: 19,   w: 11.2, h: 27.8 },
  receiver:    { x: 39,   y: 40,   w: 27.5, h: 20 },
  logbook:     { x: 28.5, y: 62.5, w: 11.5, h: 10.2 },
  drawer:      { x: 67,   y: 64,   w: 12.5, h: 12.2 },
  hatch:       { x: 42,   y: 84.5, w: 16.2, h: 8.5 },
  transmitter: { x: 70.5, y: 80.5, w: 11.8, h: 13.8 },
};

const ROOM2 = {
  id:'radio', name:'Room 2 — The Radio Station', scene:'radio', fx:'motes',
  relays:[{el:'rl-radio',mode:'pulse',period:2.6}],
  wrongSound:'static',
  wrongVfx:'sparks',
  intro:"Dust hangs in the green glow of instruments that should not still have power.",
  objective:"The operator left in a hurry and left everything behind. <b>Nothing in here is switched on.</b> Start there.",
  entryBeat:"The door swings shut behind you on its own. Rusted hinges don't do that quietly. This one did.",
  entrySound:'knock',
  completeText:"The transmitter hums, your distress call looping out to sea. Above the back door, the sign says ANTENNA, and the cable runs straight out into the jungle.",
  chain:"The card on the breaker board ticks three things — the antenna, the receiver, the lamp — and the cable run on the wall takes each of them to its breaker: 2, 5 and 6 up, the rest down → with power, the receiver finds a station in the static at 103.7 and prints its morse, which the wall poster reads as RAVEN → the desk drawer opens on that, and holds a photograph of the transmitter taken in the window glass → the logbook draws the operator's day as pictures and clocks, and the hatch is the one at 9:40 → under it is the transmitter itself, to be patched as the photograph shows — but a reflection is back to front (the ANTENNA sign in it reads backwards), so the plugs run blue, yellow, red, green.",
  objects:[
    { id:'cables', icon:'🔌', name:'Cable Run', pos:POS2.cables,
      desc:"Seven cables stapled along the wall, and not one of them takes the short way.",
      figure:ART.svg(cablesArt.w, cablesArt.h, cablesArt.body),
      sprite:ART.sprite(POS2.cables, cablesArt.w, cablesArt.h, cablesArt.body) },
    { id:'breakers', icon:'🎚️', name:'Breaker Board', pos:POS2.breakers,
      desc:"Seven breakers, all thrown down. The generator outside is small, and somebody screwed a card on to remember it.",
      sprite:st=>ART.sprite(POS2.breakers, 160, 180, breakerBody(st.solved)),
      puzzle:{ type:'toggle', from:['cables'], plate:loadCard,
        keys:'1234567', answer:['2','5','6'], tryLabel:'THROW THE MAIN',
        hints:[
          "The card shows seven things. Three are ticked: those are what the generator can carry, and all you need.",
          "The numbers on the board are the far ends of the cables on the wall. Follow the three ticked ones — antenna, receiver, lamp — from left to right.",
          "The antenna runs to 5, the receiver to 2, the lamp to 6. Those three up, the other four down."
        ],
        solvedText:"The main goes over with a bang. The lamp steadies, a needle twitches, and the receiver on the desk starts to warm.",
        solveBeat:"Under the floor, something that had been ticking stops, the way a clock stops when somebody has put a hand on it.",
        beatSound:'knock' } },
    { id:'receiver', icon:'📻', name:'Radio Receiver', pos:POS2.receiver, needs:'breakers',
      desc:"The receiver, warm now, hissing like rain. Somewhere along the dial there is something that is not rain.",
      deadDesc:"The receiver. Cold, dark, and not connected to anything that is on.",
      sprite:st=>ART.sprite(POS2.receiver, 440, 196, receiverBody(st.live, st.solved)),
      puzzle:{ type:'tune', min:80, max:120, step:0.1, at:103.7, tol:0.3, start:86.2, unit:'kc',
        hints:[
          "There is no number to look up. Move the dial slowly and watch the row of lamps climb.",
          "The lamps fill as you get close and go amber when you are on it. It is in the upper half of the dial.",
          "Hold it at 103.7 until the tape runs."
        ],
        solvedText:"The static opens like a curtain. One station, the same five letters over and over, and the tape printer chatters them out.",
        inside:{ name:'Off the tape printer', figure:tapeFig, tool:{ type:'listen', morse:TAPE.split('').map(c=>MORSE[c]).join(' ') } } } },
    { id:'poster', icon:'📜', name:'Wall Poster', pos:POS2.poster,
      desc:"Pinned where he could read it from the chair.",
      figure:ART.svg(posterArt.w, posterArt.h, posterArt.body),
      sprite:ART.sprite(POS2.poster, posterArt.w, posterArt.h, posterArt.body, { rot: 1.5 }) },
    { id:'drawer', icon:'🗄️', name:'Desk Drawer', pos:POS2.drawer,
      desc:"The only drawer in the desk with a lock on it.",
      sprite:st=>ART.sprite(POS2.drawer, 200, 110, drawerBody(st.solved)),
      puzzle:{ type:'combo', from:['receiver','poster'], skin:'plate',
        wheels:5, faces:'AEKNORSTVW', answer:'RAVEN',
        hints:[
          "Five letters. The receiver is saying five letters, once it has power and has been tuned.",
          "The tape is morse. The poster on the wall gives every letter: read the tape one group at a time.",
          "Dot-dash-dot, dot-dash, dot-dot-dot-dash, dot, dash-dot: R, A, V, E, N."
        ],
        solvedText:"The drawer slides out. One thing in it: a photograph of the emergency set, taken at night.",
        inside:{ name:'A photograph', figure:photoFig } } },
    { id:'logbook', icon:'📓', name:"Operator's Logbook", pos:POS2.logbook,
      desc:"He stopped writing words some time ago. The last pages are his day, drawn.",
      figure:ART.svg(logArt.w, logArt.h, logArt.body),
      sprite:ART.sprite(POS2.logbook, logArt.w, logArt.h, logArt.body, { rot: -4 }) },
    { id:'hatch', icon:'🕳️', name:'Floor Hatch', pos:POS2.hatch,
      desc:"A steel hatch under the rug, held by a time lock with a clock face where the dial should be.",
      sprite:st=>ART.sprite(POS2.hatch, 260, 76, hatchBody(st.solved)),
      puzzle:{ type:'clock', from:['logbook'], start:{h:12,m:0}, answer:'9:40',
        hints:[
          "A lock with a clock face wants a time. Somebody in here kept careful track of his.",
          "The logbook draws four moments of his day, each with a clock. One of the four pictures is this hatch.",
          "The square with the ring in it is the hatch, and its clock reads twenty to ten: 9:40."
        ],
        solvedText:"The bolts draw back together. Under the hatch, on a shelf of its own, is a second transmitter — unplugged, every lead hanging loose." } },
    { id:'transmitter', icon:'📡', name:'Emergency Transmitter', pos:POS2.transmitter, hiddenUntil:'hatch',
      desc:"Four sockets, four loose leads, and no label on any of them.",
      sprite:st=>ART.sprite(POS2.transmitter, 188, 126, transmitterBody(st.solved)),
      puzzle:{ type:'combo', from:['drawer'], skin:'plate',
        wheels:4, faces:{colors:['red','yellow','green','blue','white']}, answer:['blue','yellow','red','green'],
        tryLabel:'KEY THE SET',
        hints:[
          "Four sockets, each wanting a colour. Somebody photographed this set when it was working.",
          "Look at the sign in that photograph, and then at the same sign over the back door. The photograph is a reflection.",
          "Mirrored, the plugs read green, red, yellow, blue — so the real order is blue, yellow, red, green."
        ],
        solvedText:"Four leads home, and the set lights from end to end. It starts sending before you have touched the key.",
        solveBeat:"The moment the distress call starts going out, every bird on the island takes off at once.",
        beatSound:'growl' } },
  ]
};

/* ============================================================
   ROOM 3 — THE JUNGLE PATH
   The trail camera took the same picture twice, and three things are gone
   from the second one; the ranger's pack is latched to match. In the pack are
   his lantern and a card with four holes cut in it. The lantern shows which
   stones he marked for crossing. The card, laid over the carvings on the old
   tree the right way up, leaves four of them showing — and the box on the
   gate takes four.
   ============================================================ */

const TRAIL_THINGS = ['mushroom', 'cairn', 'vine', 'nest', 'flower', 'branch'];
const STILL_THERE = ['cairn', 'flower', 'branch'];
/* one frame from the trail camera */
function clearing(x, y, present, day) {
  const has = t => present.includes(t);
  let b = `<g transform="translate(${x} ${y})">`;
  b += `<rect x="-8" y="-8" width="336" height="282" fill="#efe9da" stroke="#b9ad90" stroke-width="2"/>`;
  b += `<rect width="320" height="226" fill="#1c3524"/><rect y="150" width="320" height="76" fill="#2b2a1c"/>`;
  b += `<path d="M0 150Q80 136 160 150T320 146V160H0Z" fill="#24402b"/>`;
  // the trunk and the bough everything hangs from: the same in both frames
  b += `<rect x="236" y="0" width="34" height="158" fill="#2c1d10"/><path d="M244 62Q170 40 96 58" stroke="#2c1d10" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  b += `<path d="M20 0q10 40 -4 70M300 0q-8 30 4 52M150 0q6 22 -3 40" stroke="#12301c" stroke-width="7" fill="none"/>`;
  [[4, 96, 46, -18], [44, 108, 34, 12], [196, 100, 40, 160], [282, 112, 36, 20], [130, 96, 30, 200]].forEach(([fx, fy, fs, fr]) =>
    b += `<g transform="rotate(${fr} ${fx + fs / 2} ${fy + fs / 2})">${GL('leaf', fx, fy, fs, '#2f5a38')}</g>`);
  [[70, 204], [150, 212], [226, 206], [300, 214], [12, 210]].forEach(([tx, ty]) =>
    b += `<path d="M${tx} ${ty}q-4 -14 -9 -18M${tx} ${ty}q0 -16 1 -22M${tx} ${ty}q5 -13 10 -16" stroke="#3d6a3f" stroke-width="2.5" fill="none" stroke-linecap="round"/>`);
  b += `<ellipse cx="238" cy="196" rx="20" ry="9" fill="#55604f"/><ellipse cx="60" cy="176" rx="13" ry="6" fill="#55604f"/>`;
  if (has('vine'))     b += GL('vine', 86, 58, 62, '#5fae62');
  if (has('nest'))     b += GL('nest', 168, 14, 56, '#b08a52');
  if (has('cairn'))    b += GL('cairn', 104, 138, 60, '#9aa39a');
  if (has('mushroom')) b += GL('mushroom', 26, 150, 52, '#d9744f');
  if (has('flower'))   b += GL('flower', 264, 164, 46, '#e9a3c0');
  if (has('branch'))   b += GL('branch', 176, 160, 62, '#7a5a3a');
  b += `<rect width="320" height="226" fill="#7fb894" opacity=".07"/>`;
  b += W(160, 258, day, { size: 19, face: 'typed', fill: '#3a2c1c', spacing: 2 });
  return b + `</g>`;
}
const trailArt = { w: 720, h: 320, body:
  clearing(26, 22, TRAIL_THINGS, 'FRAME 1') + clearing(374, 22, STILL_THERE, 'FRAME 2')
  + `<path d="M356 150h8" stroke="#efe9da" stroke-width="3" opacity=".5"/>` };

/* the carved panel on the old tree: sixteen carvings, and a nail */
const GRID = [
  ['leaf', 'moon', 'fish', 'snake'],
  ['frog', 'bird', 'sun', 'beetle'],
  ['beetle', 'snake', 'moon', 'leaf'],
  ['sun', 'fish', 'frog', 'bird'],
];
const HOLES = [[0, 0], [1, 2], [2, 3], [3, 1]];          // on the card as it comes out of the pack
const GX = 140, GY = 40, CELL = 110;
/** The ranger's card: four holes, and one corner cut off. Drawn over a square at (x,y). */
function cutCard(x, y, size, k) {
  const c = size / 4, n = size * 0.2;
  let d = `M${x} ${y}H${x + size - n}L${x + size} ${y + n}V${y + size}H${x}Z`;      // the cut corner is top right
  HOLES.forEach(([r, col]) => {
    const cx = x + col * c + c / 2, cy = y + r * c + c / 2, rr = c * 0.36;
    d += `M${cx - rr} ${cy}a${rr} ${rr} 0 1 0 ${rr * 2} 0a${rr} ${rr} 0 1 0 ${-rr * 2} 0Z`;
  });
  return `<g transform="rotate(${k * 90} ${x + size / 2} ${y + size / 2})">`
    + `<path d="${d}" fill="#e3d6b0" fill-rule="evenodd" stroke="#6d5637" stroke-width="3"/></g>`;
}
/* what was in the pack */
const packInside = ART.svg(720, 330, (() => {
  // the lantern, with a blue glass
  let b = `<path d="M130 60q40 -44 80 0" fill="none" stroke="#7d6126" stroke-width="7"/>`;
  b += `<rect x="124" y="60" width="92" height="22" rx="5" fill="${I.brass}" stroke="${I.brassDark}" stroke-width="3"/>`;
  b += `<path d="M120 84h100l14 150H106Z" fill="#2c6fa8" stroke="#143049" stroke-width="3"/><path d="M134 96l-10 124" stroke="#bfe4ff" stroke-width="6" opacity=".5" stroke-linecap="round"/>`;
  b += `<path d="M170 132c16 20 24 34 24 48a24 24 0 0 1 -48 0c0 -14 8 -28 24 -48z" fill="#cfeaff" opacity=".85"/>`;
  b += `<rect x="100" y="234" width="140" height="26" rx="5" fill="${I.brass}" stroke="${I.brassDark}" stroke-width="3"/>`;
  // the cut card
  b += cutCard(430, 50, 230, 0);
  return b;
})());

const treeArt = { w: 720, h: 520, body: (() => {
  let b = `<rect x="60" y="0" width="600" height="520" fill="#3a2716"/>`;
  for (let i = 0; i < 9; i++) b += `<path d="M${84 + i * 68} 0q${i % 2 ? 14 : -14} 260 0 520" stroke="#23160b" stroke-width="5" fill="none" opacity=".7"/>`;
  b += `<rect x="${GX - 14}" y="${GY - 14}" width="${CELL * 4 + 28}" height="${CELL * 4 + 28}" rx="10" fill="#6d4f2f" stroke="#23160b" stroke-width="4"/>`;
  GRID.forEach((row, r) => row.forEach((g, c) => {
    const x = GX + c * CELL, y = GY + r * CELL;
    b += `<rect x="${x + 5}" y="${y + 5}" width="${CELL - 10}" height="${CELL - 10}" rx="8" fill="#7d5c38" stroke="#4a3320" stroke-width="2"/>`;
    b += GL(g, x + 23, y + 23, 64, '#23160b');
  }));
  // the nail, at the bottom right-hand corner
  const nx = GX + CELL * 4 - 10, ny = GY + CELL * 4 - 10;
  b += `<circle cx="${nx}" cy="${ny}" r="12" fill="#b9c2c6" stroke="#1c2224" stroke-width="3"/><path d="M${nx - 6} ${ny}h12M${nx} ${ny - 6}v12" stroke="#1c2224" stroke-width="2.5"/>`;
  return b;
})() };
// the four carvings left showing when the cut corner sits over the nail: the card
// comes out of the pack with that corner top right, so it is a quarter turn clockwise
const SHOWING = HOLES.map(([r, c]) => [c, 3 - r]).sort((a, b2) => a[0] - b2[0]).map(([r, c]) => GRID[r][c]);

/* the river, close to */
const STONES = [[86, 232, 1], [168, 150, 0], [258, 214, 2], [344, 128, 3], [432, 222, 0], [512, 140, 4], [598, 226, 0], [650, 124, 5]];
const stonesArt = (() => {
  let b = `<rect width="720" height="330" fill="#123b3f"/>`;
  b += `<path d="M0 0H720V54Q540 86 360 60T0 70Z" fill="#17301f"/><path d="M0 330H720V284Q540 262 360 288T0 276Z" fill="#17301f"/>`;
  for (let i = 0; i < 9; i++) b += `<path d="M${20 + i * 80} ${96 + (i % 3) * 62}q26 -9 52 0" fill="none" stroke="#3f7a6e" stroke-width="3" opacity=".55"/>`;
  let glow = '';
  STONES.forEach(([x, y, n], i) => {
    const rx = 46 + (i % 3) * 5, ry = 30 + (i % 2) * 5;
    b += `<g data-key="s${i + 1}"><ellipse cx="${x}" cy="${y + 7}" rx="${rx}" ry="${ry}" fill="#2a2f2b"/>`
      + `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="#6b716a" stroke="#2a2f2b" stroke-width="2.5"/>`
      + `<path d="M${x - rx * .5} ${y - ry * .35}q${rx * .5} -${ry * .5} ${rx} 0" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="5" stroke-linecap="round"/>`
      + `<g class="hit-show"><ellipse cx="${x}" cy="${y}" rx="${rx - 6}" ry="${ry - 6}" fill="none" stroke="#ffe08a" stroke-width="4"/>`
      + GL('paw', x - 15, y - 15, 30, '#ffe08a') + `</g></g>`;
    if (n) glow += `<circle cx="${x}" cy="${y}" r="24" fill="#7fe8ff" opacity=".22"/>` + W(x, y + 13, String(n), { size: 36, fill: '#c9f7ff', face: 'num', weight: 700 });
  });
  return { w: 720, h: 330, body: b, glow };
})();
const SAFE = STONES.map((s, i) => [s[2], 's' + (i + 1)]).filter(x => x[0]).sort((a, b2) => a[0] - b2[0]).map(x => x[1]);

/* ---- what stands on the path ---- */
function trailcamBody() {
  let b = `<rect x="86" y="20" width="16" height="180" fill="#2c1d10"/>`;
  b += `<rect x="60" y="10" width="68" height="50" rx="6" fill="#3a3d38" stroke="#171a15" stroke-width="3"/><circle cx="94" cy="35" r="13" fill="#0c0f0f" stroke="#6a7a74" stroke-width="3"/>`;
  b += `<rect x="20" y="84" width="66" height="54" fill="#efe9da" transform="rotate(-7 53 111)"/><rect x="27" y="90" width="52" height="34" fill="#1c3524" transform="rotate(-7 53 111)"/>`;
  b += `<rect x="104" y="92" width="66" height="54" fill="#efe9da" transform="rotate(6 137 119)"/><rect x="111" y="98" width="52" height="34" fill="#1c3524" transform="rotate(6 137 119)"/>`;
  return b;
}
function packBody(open) {
  let b = `<ellipse cx="74" cy="122" rx="66" ry="7" fill="#000" opacity=".3"/>`;
  b += `<path d="M22 112q-12 -76 48 -86q62 -8 58 78l-6 16q-48 14 -94 0z" fill="#3b4428" stroke="#1c2114" stroke-width="3"/>`;
  b += `<rect x="40" y="40" width="66" height="16" rx="8" fill="#1c2114"/>`;
  if (!open) {
    b += `<rect x="34" y="70" width="78" height="34" rx="5" fill="#59653a" stroke="#1c2114" stroke-width="2"/>`;
    [0, 1, 2, 3, 4, 5].forEach(i => b += `<rect x="${39 + i * 12.2}" y="76" width="8" height="22" rx="2" fill="${I.brass}"/>`);
  } else {
    b += `<path d="M34 70h78l-8 -26h-62z" fill="#2a311c" stroke="#1c2114" stroke-width="2"/>`;
    b += `<rect x="118" y="78" width="22" height="34" rx="3" fill="#2c6fa8" stroke="#143049" stroke-width="2"/><circle cx="129" cy="95" r="16" fill="#8fd0ff" opacity=".35"/>`;
  }
  return b;
}
function stonesScene() {
  const at = [[420, 702], [518, 678], [616, 704], [714, 680], [812, 706], [910, 682], [1008, 704], [1106, 680]];
  return at.map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="44" ry="19" fill="#3a3d38"/><ellipse cx="${x}" cy="${y - 5}" rx="44" ry="17" fill="#565a52"/>`
    + `<path d="M${x - 22} ${y - 10}q22 -8 44 0" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="3"/>`).join('');
}
function gateboxBody(open) {
  let b = `<rect x="6" y="6" width="72" height="62" rx="6" fill="#3a3d38" stroke="#171a15" stroke-width="3"/>`;
  [0, 1, 2, 3].forEach(i => b += `<rect x="${13 + i * 15.4}" y="22" width="11" height="26" rx="2" fill="${open ? '#7fe08f' : '#0c0f0f'}" stroke="#6a7a74" stroke-width="1.5"/>`);
  return b;
}
function gateWinchBody(solved) {
  const w = (x) => `<circle cx="${x}" cy="46" r="26" fill="#2c1d10" stroke="#120b05" stroke-width="4"/><circle cx="${x}" cy="46" r="7" fill="#9aa3a7"/>`
    + [0, 60, 120].map(a => `<path d="M${x - 24} 46h48" stroke="#5a3d22" stroke-width="5" transform="rotate(${a + (solved ? 30 : 0)} ${x} 46)"/>`).join('');
  return w(34) + w(206);
}

const POS3 = {
  trailcam: { x: 5.5,  y: 44,   w: 12,   h: 23 },
  tree:     { x: 18,   y: 47.5, w: 6.2,  h: 15 },
  pack:     { x: 36,   y: 80,   w: 9.4,  h: 14.5 },
  stones:   { x: 23,   y: 72,   w: 50,   h: 10.5 },
  gatebox:  { x: 41.4, y: 27.2, w: 5.2,  h: 8.2 },
  gate:     { x: 43.5, y: 15,   w: 15,   h: 10.5 },
};

const ROOM3 = {
  id:'jungle', name:'Room 3 — The Jungle Path', scene:'jungle', fx:'fireflies',
  relays:[{el:'rl-jungle',mode:'pulse',period:4.2}],
  wrongSound:'growl',
  wrongVfx:'shadow',
  intro:"The canopy closes overhead. Something large keeps pace with you, always just out of sight.",
  objective:"Follow the antenna cable through the interior. A ranger worked this trail once, and left it the way a careful man leaves things. <b>Keep quiet.</b>",
  entryBeat:"Ten steps in, you find one of the operator's boots. Just the one. It has been placed, neatly, in the exact center of the path — facing back the way you came.",
  entrySound:'growl',
  completeText:"You cross the rope bridge at a dead sprint and cut the lines behind you. Below the cliffs lies a hidden cove — and stacked on the sand, under a tarp, materials for a raft. The operator planned an escape. You're going to finish it.",
  chain:"The trail camera took the same clearing twice, and in the second frame the mushroom, the vine and the nest are gone; the pack's six tabs are those six things, so the three still standing stay up — cairn, flower, branch — and the others go down → in the pack are a blue-glass lantern and a card with four holes and one corner cut off → the lantern shows the numbers painted on five of the eight river stones, and they are stepped on in that order → on the old tree are sixteen carvings and a nail; with the card's cut corner laid over the nail, the four holes show snake, frog, moon, fish, top to bottom, which the box on the gate takes → the beam behind it needs both winches turned at once, so the crew splits and hauls together.",
  objects:[
    { id:'trailcam', icon:'📷', name:'Trail Camera', pos:POS3.trailcam,
      desc:"A ranger's camera, lashed to a post and aimed at the same patch of ground. Its last two frames are still pinned underneath.",
      figure:ART.svg(trailArt.w, trailArt.h, trailArt.body),
      sprite:ART.sprite(POS3.trailcam, 190, 200, trailcamBody()) },
    { id:'pack', icon:'🎒', name:"Ranger's Pack", pos:POS3.pack,
      desc:"Left against a root, buckled, with a row of six brass tabs for a catch.",
      sprite:st=>ART.sprite(POS3.pack, 150, 130, packBody(st.solved)),
      puzzle:{ type:'toggle', from:['trailcam'], skin:'tabs',
        keys:{glyphs:TRAIL_THINGS}, start:TRAIL_THINGS, answer:STILL_THERE, tryLabel:'TRY THE CATCH',
        hints:[
          "Six tabs, six little pictures — and every one of those six things is in the trail camera's photographs.",
          "The two frames are not the same. The tabs all start up, which is the first frame. Make them match the second.",
          "The mushroom, the vine and the nest are gone: those three down. Cairn, flower and branch stay up."
        ],
        solvedText:"The catch gives. On top of everything else in the pack: a lantern with a blue glass, and a card with four holes cut in it.",
        inside:{ name:'From the pack', figure:packInside } } },
    { id:'stones', icon:'🪨', name:'River Crossing', pos:POS3.stones,
      desc:"Eight stones across black water that is moving faster than it looks. It is too dark down here to tell one from another.",
      sprite:stonesScene(),
      puzzle:{ type:'press', from:['pack'], slots:5, answer:SAFE,
        gm:'the 1st, 3rd, 4th, 6th and 8th stones from the left, in that order',
        figure:ART.svg(stonesArt.w, stonesArt.h, stonesArt.body),
        lens:{ needs:'pack', hidden:stonesArt.glow, r:74, dark:.66 },
        hints:[
          "Five steps, and nothing you can see by. You need a light — and the ranger carried one.",
          "With the lantern from the pack, move it slowly across the water. He painted the stones he trusted, and the paint only shows in that light.",
          "Five stones are numbered. Step on them in order, 1 to 5: the first, third, fourth, sixth and eighth from the left."
        ],
        solvedText:"Five stones, five steps, and the far bank. Behind you the water closes over the other three as if they had never been there.",
        solveBeat:"Half way over, the lantern shows something else painted on the far bank, in the same hand: an arrow, and under it the word RUN.",
        beatSound:'growl' } },
    { id:'tree', icon:'🌳', name:'The Carved Tree', pos:POS3.tree,
      desc:"Sixteen carvings in a square, cut deep and a long time ago. A newer nail has been driven in at one corner.",
      figure:ART.svg(treeArt.w, treeArt.h, treeArt.body),
      sprite:ART.sprite(POS3.tree, treeArt.w, treeArt.h, treeArt.body),
      tool:{ type:'turn', needs:'pack', cx:GX + CELL * 2, cy:GY + CELL * 2, start:0,
             overlay:cutCard(GX, GY, CELL * 4, 0) } },
    { id:'gatebox', icon:'🔐', name:'Gate Box', pos:POS3.gatebox, hiddenUntil:'stones',
      desc:"An iron box bolted to the gatepost, with four small windows and a carving in each.",
      sprite:st=>ART.sprite(POS3.gatebox, 84, 74, gateboxBody(st.solved)),
      puzzle:{ type:'combo', from:['tree','pack'], skin:'plate',
        wheels:4, faces:{glyphs:['leaf','snake','bird','frog','moon','sun','beetle','fish']}, answer:SHOWING,
        hints:[
          "Four windows, and the pictures in them are the same carvings that are on the old tree back across the river.",
          "The card from the pack is the same size as that square of carvings, and the tree has a nail in one corner where the card has a corner missing.",
          "With the cut corner over the nail, the holes show snake, frog, moon and fish, reading down."
        ],
        solvedText:"Four carvings line up and a pin drops inside the post. The gate is unlocked — but the beam across it has not moved." } },
    { id:'gate', icon:'🌉', name:'Gorge Gate', pos:POS3.gate, hiddenUntil:'gatebox',
      desc:"A counterweight beam bars the bridge, and the two winches that lift it stand at opposite ends of the platform — too far apart for one pair of hands.",
      sprite:st=>ART.sprite(POS3.gate, 240, 92, gateWinchBody(st.solved)),
      puzzle:{ type:'simul',
        stations:[{id:'gate-port',label:'Near Winch',icon:'⚙️'},{id:'gate-star',label:'Far Winch',icon:'⚙️'}],
        need:2, pullLabel:'HAUL ON THREE',
        hints:[
          "This one needs people in two places at once. Anyone on a phone can take a winch.",
          "Split the crew between the near winch and the far winch.",
          "Once both winches show somebody on them, press HAUL ON THREE."
        ],
        solvedText:"The beam lifts a foot, then two, then swings clear — and at that exact moment the undergrowth behind you erupts. You don't look. You run, boots hammering the planks, the whole bridge bucking under something that steps onto it behind you." } },
  ]
};

/* ============================================================
   ROOM 4 — THE ESCAPE RAFT
   The operator photographed his raft as he built it and wrote a number on
   every print; in the order he took them, the numbers open the flare locker.
   The same prints show how the logs lie. The locker holds a tide card with
   three seas on it, one for each kind of moon — and tonight's moon is over
   the western head. Then the flares, and the oldest signal there is.
   ============================================================ */

/* five logs, by length. The raft is lashed in this order, left to right. */
const LOGS = { a: 150, b: 110, c: 170, d: 90, e: 130 };
const LASHED = ['e', 'c', 'd', 'a', 'b'];
function logShape(x, base, len, w) {
  return `<rect x="${x}" y="${base - len}" width="${w}" height="${len}" rx="${w / 2}" fill="#7a5a3a" stroke="#3a2815" stroke-width="2.5"/>`
    + `<path d="M${x + w * .3} ${base - len + 12}v${len - 24}" stroke="#3a2815" stroke-opacity=".45" stroke-width="2"/>`
    + `<ellipse cx="${x + w / 2}" cy="${base - len + w * .32}" rx="${w * .34}" ry="${w * .2}" fill="#a98558" stroke="#3a2815" stroke-width="1.5"/>`;
}
/** The raft at one stage of the build, drawn into a 190x120 picture. */
function raftStage(stage) {
  let b = `<rect width="190" height="120" fill="#2b3550"/><rect y="78" width="190" height="42" fill="#6a5237"/>`;
  b += `<path d="M0 78q48 -8 95 0t95 0" fill="none" stroke="#8fa3c8" stroke-width="2" opacity=".5"/>`;
  const base = 106, w = 15;
  if (stage === 1) {
    // loose, any old how
    [['b', 22, -24], ['d', 58, 12], ['a', 92, -6], ['e', 128, 28], ['c', 160, -14]].forEach(([id, x, r]) =>
      b += `<g transform="rotate(${r} ${x + w / 2} ${base - 20})">${logShape(x, base, LOGS[id] * .42, w)}</g>`);
    return b;
  }
  LASHED.forEach((id, i) => b += logShape(52 + i * (w + 3), base, LOGS[id] * .42, w));
  b += `<path d="M48 ${base - 10}h96M48 ${base - 30}h96" stroke="#e3d6b0" stroke-width="3"/>`;
  if (stage >= 3) b += `<rect x="50" y="${base - 26}" width="92" height="13" fill="#b08f5e" stroke="#3a2815" stroke-width="1.5"/><path d="M73 ${base - 26}v13M96 ${base - 26}v13M119 ${base - 26}v13" stroke="#3a2815" stroke-width="1.2"/>`;
  if (stage >= 4) b += `<path d="M96 ${base - 20}V10" stroke="#3a2815" stroke-width="5" stroke-linecap="round"/><circle cx="96" cy="${base - 20}" r="5" fill="#3a2815"/>`;
  if (stage >= 5) b += `<path d="M99 14L150 62H99Z" fill="#e9e1c9" stroke="#3a2815" stroke-width="2"/>`;
  return b;
}
const SHOTS = [[4, '3'], [1, '6'], [5, '5'], [2, '1'], [3, '8']];      // as pinned: [stage, number on it]
const BUILD_CODE = SHOTS.slice().sort((x, y) => x[0] - y[0]).map(x => x[1]).join('');
const photosArt = { w: 720, h: 440, body: (() => {
  let b = `<rect x="6" y="6" width="708" height="428" rx="6" fill="#5b452c" stroke="#2b1f12" stroke-width="4"/>`;
  for (let i = 1; i < 5; i++) b += `<path d="M6 ${6 + i * 86}H714" stroke="#2b1f12" stroke-width="2" opacity=".5"/>`;
  const at = [[34, 26, -4], [264, 18, 3], [494, 30, -2], [146, 228, 5], [392, 224, -5]];
  SHOTS.forEach(([stage, num], i) => {
    const [x, y, r] = at[i];
    b += `<g transform="rotate(${r} ${x + 105} ${y + 90})"><rect x="${x + 4}" y="${y + 6}" width="210" height="182" fill="#000" opacity=".3"/>`
      + `<rect x="${x}" y="${y}" width="210" height="182" fill="#efe9da" stroke="#b9ad90" stroke-width="1.5"/>`
      + ART.inset(x + 10, y + 10, 190, 120, 190, 120, raftStage(stage), { clip: true })
      + W(x + 178, y + 170, num, { size: 44, face: 'hand', fill: '#1d2a4a', weight: 700 }) + ART.pin(x + 105, y + 4) + `</g>`;
  });
  return b;
})() };

/* the moon, three ways. One drawing for the sky and for the card, so the match is there to see. */
function moonShape(phase, cx, cy, r, fill) {
  if (phase === 'full') return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
  const lit = phase === 'half'
    ? `M${cx} ${cy - r}A${r} ${r} 0 0 0 ${cx} ${cy + r}Z`
    : `M${cx} ${cy - r}A${r} ${r} 0 0 0 ${cx} ${cy + r}A${(r * .7).toFixed(1)} ${r} 0 0 1 ${cx} ${cy - r}Z`;
  return `<g transform="rotate(-24 ${cx} ${cy})"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${fill}" stroke-width="${Math.max(1.2, r * .07).toFixed(1)}" opacity=".5"/>`
    + `<path d="${lit}" fill="${fill}"/></g>`;
}
const TONIGHT = 'crescent';
const skyArt = { w: 128, h: 128, body: `<circle cx="64" cy="64" r="62" fill="#f4e9c8" opacity=".07"/>` + moonShape(TONIGHT, 64, 64, 40, '#f4e9c8') };
const moonFig = ART.svg(420, 380, (() => {
  let b = `<defs><radialGradient id="mnSky"><stop offset="0" stop-color="#2a1c4a"/><stop offset=".7" stop-color="#1a1030"/><stop offset="1" stop-color="#1a1030" stop-opacity="0"/></radialGradient></defs>`;
  b += `<ellipse cx="210" cy="190" rx="208" ry="188" fill="url(#mnSky)"/><circle cx="210" cy="186" r="150" fill="#f4e9c8" opacity=".05"/>`;
  [[62, 96, 2.6], [118, 300, 2], [330, 78, 2.2], [352, 262, 2.8], [282, 330, 1.8], [90, 196, 1.6], [316, 172, 1.5], [172, 52, 2]].forEach(([x, y, r]) => b += `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffe9c0" opacity=".85"/>`);
  b += moonShape(TONIGHT, 210, 186, 96, '#f4e9c8');
  b += `<path d="M0 372q70 -44 132 -26t96 22q60 -22 110 -10t82 14V380H0Z" fill="#0a0812"/>`;      // the western head, under it
  return b;
})());

/* the tide card: the sea against the hours, three times over — one sea for each moon —
   and the reef standing in it. Every sea tops the reef for half an hour either side of its peak. */
const TIDES = [
  { moon: 'half',     at: 3.5, w: 2.4, ink: '#2f7d6a' },
  { moon: 'crescent', at: 6,   w: 1.9, ink: '#1f4f8f' },
  { moon: 'full',     at: 8.5, w: 1.5, ink: '#7a3a6a' },
];
const LOW_U = .08, REEF_U = .62;
function tideU(c, t) {
  const d = Math.abs(t - c.at);
  if (d >= c.w) return LOW_U;
  const amp = (REEF_U - LOW_U) / Math.cos(Math.PI * .5 / (2 * c.w)) ** 2;
  return LOW_U + amp * Math.cos(Math.PI * d / (2 * c.w)) ** 2;
}
const clockAt = t => `${Math.floor(t + 1e-9)}:${String(Math.round(((t + 1e-9) % 1) * 60)).padStart(2, '0')}`;
const HIGH = TIDES.find(c => c.moon === TONIGHT);
const TIDE_AT = clockAt(HIGH.at), TIDE_OPEN = [clockAt(HIGH.at - .5 - 5 / 60), clockAt(HIGH.at + .5 + 5 / 60)];
const tideArt = { w: 720, h: 400, body: (() => {
  const X = t => 130 + (t - 2) * 70, Y = u => 318 - u * 262, reef = Y(REEF_U);
  let b = ART.paper(8, 8, 704, 384);
  for (let t = 2; t <= 10; t += .5) {
    b += `<path d="M${X(t)} 40V318" stroke="${I.inkSoft}" stroke-width="${t % 1 ? 1 : 1.8}" opacity="${t % 1 ? .28 : .55}"/>`;
    if (t % 1 === 0) b += W(X(t), 356, String(t), { size: 27, face: 'num', weight: 700 });
  }
  // the three seas
  b += `<rect x="${X(2)}" y="${Y(LOW_U).toFixed(1)}" width="${X(10) - X(2)}" height="${(318 - Y(LOW_U)).toFixed(1)}" fill="#3d6f9a" opacity=".3"/>`;
  TIDES.forEach(c => {
    const t0 = Math.max(2, c.at - c.w), t1 = Math.min(10, c.at + c.w);
    let d = '';
    for (let i = 0, n = Math.round((t1 - t0) / .05); i <= n; i++) { const t = t0 + (t1 - t0) * i / n; d += `${d ? 'L' : 'M'}${X(t).toFixed(1)} ${Y(tideU(c, t)).toFixed(1)}`; }
    b += `<path d="${d}L${X(t1).toFixed(1)} ${Y(LOW_U).toFixed(1)}L${X(t0).toFixed(1)} ${Y(LOW_U).toFixed(1)}Z" fill="${c.ink}" opacity=".14"/><path d="${d}" fill="none" stroke="${c.ink}" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>`;
    b += moonShape(c.moon, X(c.at), Y(tideU(c, c.at)) - 36, 18, c.ink);
  });
  b += `<path d="M96 318H694" stroke="${I.ink}" stroke-width="3"/><path d="M${X(2)} 40V318" stroke="${I.ink}" stroke-width="3"/>`;
  // the reef, in section, and the line of its top carried across
  b += `<path d="M58 318l8 -62l14 -20l2 -52l16 -12V${reef.toFixed(1)}H128V318Z" fill="#5a5148" stroke="#2f2a25" stroke-width="2" stroke-linejoin="round"/>`;
  b += `<path d="M84 250l10 -8M70 292l12 -6M104 214l12 -10M100 286l14 -4" stroke="#2f2a25" stroke-width="1.6" opacity=".6"/>`;
  b += `<path d="M98 ${reef.toFixed(1)}H692" stroke="#7a2a1e" stroke-width="3.5" stroke-dasharray="12 8"/>`;
  // she floats over it, or she does not
  const raft = (x, y) => `<path d="M${x - 22} ${y}h44l-6 10h-32z" fill="#7a5a3a" stroke="#3a2815" stroke-width="2"/><path d="M${x} ${y}v-26l19 21z" fill="#e9e1c9" stroke="#3a2815" stroke-width="2"/>`;
  b += `<path d="M40 ${reef - 22}q9 -6 18 0t18 0t18 0t18 0" fill="none" stroke="#1f4f8f" stroke-width="2.5" opacity=".7"/>`;
  b += raft(84, reef - 30) + GL('tick', 30, reef - 62, 28, '#2f7d45');
  return b;
})() };

/* a piece torn off the code chart from the station wall, kept in the lid of the flare locker */
const STRIP = ['O', 'P', 'Q', 'R', 'S', 'T'];
const stripArt = { w: 600, h: 150, body: (() => {
  const torn = 'M22 8L584 12L590 30L578 48L592 70L580 92L594 116L582 142L16 140L26 118L12 96L24 72L10 50L22 30Z';
  let b = `<path d="${torn}" fill="#000" opacity=".28" transform="translate(3 4)"/><path d="${torn}" fill="#e7dcc0" stroke="${I.paperDark}" stroke-width="1.5"/>`;
  STRIP.forEach((ch, i) => {
    const x = 48 + (i % 3) * 180, y = 52 + Math.floor(i / 3) * 54;
    b += W(x, y + 11, ch, { size: 30 }) + morseMarks(MORSE[ch], x + 40, y, 10, I.ink).svg;
  });
  return b;
})() };
const lockerInside = ART.svg(720, 566, tideArt.body + ART.inset(60, 410, 600, 150, 600, 150, stripArt.body));

function flareArt(long) {
  return `<svg viewBox="0 0 60 ${long ? 110 : 80}" class="glyph" style="width:${long ? 40 : 34}px;height:${long ? 74 : 54}px">`
    + `<rect x="20" y="${long ? 34 : 30}" width="20" height="${long ? 72 : 46}" rx="5" fill="#a83a28" stroke="#3a120d" stroke-width="3"/>`
    + `<rect x="20" y="${long ? 34 : 30}" width="20" height="12" rx="4" fill="#f1d9a0"/>`
    + (long ? `<path d="M30 30V4M18 26L8 8M42 26L52 8" stroke="#ffc46b" stroke-width="5" stroke-linecap="round"/>`
            : `<path d="M30 26V14" stroke="#ffc46b" stroke-width="5" stroke-linecap="round"/>`) + `</svg>`;
}

/* ---- what stands in the cove ---- */
function lockerBody(open) {
  let b = `<ellipse cx="78" cy="106" rx="76" ry="6" fill="#000" opacity=".3"/><rect x="4" y="${open ? 26 : 6}" width="150" height="${open ? 78 : 98}" rx="8" fill="#5c1f1a"/>`;
  [0, 1, 2].forEach(i => b += `<rect x="${16 + i * 48}" y="${open ? 26 : 12}" width="22" height="${open ? 78 : 92}" fill="#c9a04a" opacity=".8"/>`);
  if (!open) {
    b += `<rect x="4" y="6" width="150" height="22" rx="8" fill="#7a2a22"/><rect x="46" y="46" width="66" height="26" rx="4" fill="${I.brass}" stroke="${I.brassDark}" stroke-width="2"/>`;
    [0, 1, 2, 3, 4].forEach(i => b += `<rect x="${51 + i * 11.6}" y="51" width="8" height="16" rx="1.5" fill="#17100a"/>`);
  } else {
    // the lid thrown back: you are looking at the inside of it, standing up behind the box
    b += `<path d="M8 27L20 1H138L150 27Z" fill="#431714" stroke="#22090a" stroke-width="2" stroke-linejoin="round"/><rect x="4" y="26" width="150" height="12" fill="#160807"/>`;
    [0, 1, 2].forEach(i => b += `<rect x="${58 + i * 16}" y="8" width="10" height="30" rx="3" fill="#a83a28" stroke="#3a120d"/><rect x="${58 + i * 16}" y="8" width="10" height="7" rx="3" fill="#e0cfa2"/>`);
  }
  return b;
}
function raftBody(built) {
  let b = `<ellipse cx="128" cy="118" rx="120" ry="8" fill="#000" opacity=".28"/>`;
  if (!built) {
    [['a', 14, 10], ['b', 64, -8], ['c', 110, 6], ['d', 160, -12], ['e', 206, 9]].forEach(([id, x, r]) =>
      b += `<g transform="rotate(${90 + r} ${x + 9} 96)">${logShape(x, 104, LOGS[id] * .58, 18)}</g>`);
    return b;
  }
  LASHED.forEach((id, i) => b += logShape(72 + i * 22, 112, LOGS[id] * .56, 19));
  b += `<path d="M68 100h118M68 74h118" stroke="#e3d6b0" stroke-width="3.5"/><rect x="70" y="80" width="114" height="15" fill="#b08f5e" stroke="#3a2815" stroke-width="1.5"/>`;
  b += `<path d="M127 88V6" stroke="#3a2815" stroke-width="6" stroke-linecap="round"/><path d="M131 10L190 70H131Z" fill="#e9e1c9" stroke="#3a2815" stroke-width="2"/>`;
  return b;
}
function launchWinchBody(free) {
  let b = `<rect x="46" y="60" width="16" height="140" fill="#241a10"/>`;
  [0, 1, 2, 3].forEach(i => b += `<path d="M10 62H98" stroke="#20241f" stroke-width="7" stroke-linecap="round" transform="rotate(${i * 45 + (free ? 20 : 0)} 54 62)"/>`);
  b += `<circle cx="54" cy="62" r="40" fill="#3a3d38" stroke="#20241f" stroke-width="6"/>`;
  b += ART.clockFace(54, 62, 27, free ? 5 : 12, free ? 30 : 0, { face: '#e9dfc3', ink: '#2a1e0c', rim: I.brassDark });
  return b;
}
function rackBody(fired) {
  let b = `<path d="M22 70h88l12 64H10z" fill="#241a10"/>`;
  [0, 1, 2].forEach(i => b += `<g transform="rotate(${(i - 1) * 10} ${48 + i * 18} 76)"><rect x="${42 + i * 18}" y="18" width="13" height="58" rx="4" fill="${fired ? '#3b3530' : '#a83a28'}"/><rect x="${42 + i * 18}" y="12" width="13" height="10" rx="3" fill="${fired ? '#17140f' : '#e0cfa2'}"/></g>`);
  return b;
}

const POS4 = {
  photos:    { x: 26.5, y: 57,   w: 13.2, h: 14.4 },
  moon:      { x: 22.4, y: 7.6,  w: 8,    h: 14.2 },
  locker:    { x: 68,   y: 71.4, w: 9.9,  h: 12.5 },
  raft:      { x: 43,   y: 72.5, w: 16,   h: 14.2 },
  tideclock: { x: 85.2, y: 61,   w: 6.8,  h: 22.6 },
  flares:    { x: 13.4, y: 66.6, w: 8.3,  h: 15.4 },
};

const ROOM4 = {
  id:'raft', name:'Room 4 — The Escape Raft', scene:'cove', fx:'mist',
  stageFx:'swell',
  relays:[{el:'rl-cove',mode:'pulse',period:3.0}],
  wrongSound:'wave',
  intro:"Dusk. One chance to build, signal, and launch.",
  objective:"The operator staged an escape and never used it. <b>Finish it.</b> The ship's lights are already on the horizon.",
  entryBeat:"Fresh prints circle the raft materials — the same long, dragging prints from the beach where you started. It has been here. It has been waiting to see if you'd make it this far.",
  entrySound:'knock',
  completeText:"The raft is rigged, the winch is free, and the tide is going out under you. Nothing holds it to this island now but the hand on the line.",
  chain:`The operator photographed the raft as he built it and wrote a number on each print; put in the order he must have taken them — loose logs, lashed, decked, mast, sail — the numbers read ${BUILD_CODE}, which opens the flare locker → the same prints show how the five logs lie, by their lengths, so the raft goes together to match → the tide card in the locker draws three seas against the hours, each marked with a moon, and the reef as a line across them; tonight's moon is a crescent, and the crescent's sea is over the reef for half an hour either side of ${TIDE_AT}, which the tide clock on the winch is set to → the torn strip in the locker lid is a piece of the code chart, O to T, and nine flares is exactly S, O, S: three short, three long, three short (...---...).`,
  objects:[
    { id:'photos', icon:'🖼️', name:'Pinned Photographs', pos:POS4.photos,
      desc:"Five prints pinned to a board, out of any order, each with a number in the corner in his hand.",
      figure:ART.svg(photosArt.w, photosArt.h, photosArt.body),
      sprite:ART.sprite(POS4.photos, photosArt.w, photosArt.h, photosArt.body, { rot: -3 }) },
    { id:'moon', icon:'🌙', name:"Tonight's Moon", pos:POS4.moon,
      desc:"Low over the western head: a thin, bright sliver, with the rest of the disc only just there.",
      figure:moonFig,
      sprite:ART.sprite(POS4.moon, skyArt.w, skyArt.h, skyArt.body) },
    { id:'locker', icon:'🧨', name:'Flare Locker', pos:POS4.locker,
      desc:"Steel, in emergency stripes, with five numbered wheels on the hasp.",
      sprite:st=>ART.sprite(POS4.locker, 158, 112, lockerBody(st.solved)),
      puzzle:{ type:'combo', from:['photos'],
        wheels:5, faces:'0123456789', answer:BUILD_CODE,
        hints:[
          "Five wheels, and five photographs with a number written on each. The numbers are not in a useful order — but the photographs can be.",
          "They are pictures of one raft being built. Put them in the order they must have been taken, from loose logs to a raft under sail, and read the numbers off in that order.",
          `Loose logs, lashed, decked, mast up, sail on: ${BUILD_CODE.split('').join(', ')}.`
        ],
        solvedText:"The hasp comes away. Flares, dry and intact — and under them a tide card for the cove, with a torn strip of paper tucked in the lid.",
        inside:{ name:'From the locker', figure:lockerInside } } },
    { id:'raft', icon:'🪵', name:'Raft Timbers', pos:POS4.raft,
      desc:"Five logs, cut to five lengths on purpose, lying wherever they were dropped.",
      sprite:st=>ART.sprite(POS4.raft, 256, 128, raftBody(st.solved)),
      puzzle:{ type:'tiles', from:['photos'], cols:5, skin:'logs',
        gm:'left to right: middling, longest, shortest, second longest, second shortest',
        pieces:Object.keys(LOGS).map(id=>({ id, w:70, h:210, body:`<rect width="70" height="210" fill="#6a5237"/>${logShape(18, 200, LOGS[id], 34)}` })),
        start:['a','b','c','d','e'], answer:LASHED,
        hints:[
          "Tap one log, then another, to swap them. He built this raft once already, and he took pictures.",
          "Every photograph after the first shows the raft lashed up, and the logs are different lengths. Lay these out so the far ends make the same outline.",
          "Left to right: middling, longest, shortest, second longest, second shortest."
        ],
        solvedText:"The lashings bite and the five logs become one thing. The deck goes on; the mast goes up.",
        inside:{ name:'Lashed', figure:ART.svg(256, 128, raftBody(true)) } } },
    { id:'tideclock', icon:'⚙️', name:'Launch Winch', pos:POS4.tideclock, needs:'raft',
      desc:"The winch that pays the raft out over the reef. Its brake is a tide clock: it lets go at the time it is set to, and not before.",
      deadDesc:"A winch with a clock for a brake, and a line that runs down the sand to nothing. There is no raft to launch yet.",
      sprite:st=>ART.sprite(POS4.tideclock, 108, 204, launchWinchBody(st.solved)),
      puzzle:{ type:'clock', from:['locker','moon'], start:{h:12,m:0}, answer:TIDE_AT, window:TIDE_OPEN, tryLabel:'RELEASE THE BRAKE',
        miss:"The brake lets go and the raft slides out — and grounds hard on the reef. You haul her back up the sand.",
        hints:[
          "A clock on a winch wants a time, and the card in the flare locker is all times: the hours along the bottom, and the sea rising and falling across them. Three seas, though, not one.",
          "Each sea on the card has a moon drawn over it, and the dashed line is the top of the reef. Only one of those moons is in the sky tonight.",
          `Tonight's moon is the thin crescent. The crescent's sea is over the reef from half past five to half past six, and highest at six: set the clock to ${TIDE_AT}.`
        ],
        solvedText:"The brake lets go with a heavy CLACK and the line runs free. All that is left is to bring that ship.",
        solveBeat:"From the treeline at the cove's edge, for the first time, you hear it breathe. It is very close now. It has stopped hiding.",
        beatSound:'growl' } },
    { id:'flares', icon:'🔥', name:'Signal Flares', pos:POS4.flares, hiddenUntil:'tideclock',
      desc:"Nine flares in the rack — enough for one message and nothing left over for a second try.",
      sprite:st=>ART.sprite(POS4.flares, 132, 138, rackBody(st.solved)),
      puzzle:{ type:'press', from:['locker'], repeat:true, slots:9, answer:'...---...',
        keys:[{ id:'.', art:flareArt(false), cap:'short burst' }, { id:'-', art:flareArt(true), cap:'long burn' }],
        echo:{ '.':'·', '-':'–' }, miss:'The flares gutter into the wrong pattern. The ship sails on.',
        hints:[
          "Nine flares, and two ways to fire each one: a short burst or a long burn. Short and long — this island has spoken to you that way before.",
          "The torn strip from the locker lid is a piece of the code chart: a dot is a short burst, a dash is a long burn. Six letters on it. What does anyone send when they need a ship to stop?",
          "S, O, S: three short, three long, three short."
        ],
        solvedText:"" } },
  ]
};

const ROOMS = [ROOM1, ROOM2, ROOM3, ROOM4];

registerScenario({
  id:'eldermoor', classic:true,
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
  flare:{x:281,y:612,hue:[255,120,90]},
  ambience:[
    {surf:.40, wind:.08, drone:.012},
    {drone:.03, hum:.045, wind:.015},
    {wind:.05, drone:.05, rustle:.15},
    {surf:.16, wind:.10, drone:.065, rustle:.05}
  ],
  fx:['mist','drips','fireflies','mist'],
  events:[
    [{s:'gull',p:.45}],
    [{s:'crackle',p:.6,v:'sparks'}],
    [{s:'crickets',p:.55},{s:'creak',p:.2,v:'shadow'}],
    [{s:'wave',p:.5}]
  ],
  // shown free of charge when a team has gone quiet for a while
  nudges:[
    "The tide pushes something further up the sand. {it} is still sitting there, unread.",
    "The set hisses, then settles. Your eye keeps going back to {it}.",
    "The canopy shifts. Whatever is out there moves off — and you notice {it} again.",
    "A wave breaks and draws back. {it} has not given up everything it holds."
  ],
  // Three times a game something happens TO the team rather than around
  // them: the lights fail, something crosses the room, and a clue they had
  // already settled turns up disturbed.
  intrusions:{
    squeeze:'The lamp gutters, and goes out. For a few seconds there is nothing but the sea — then it catches again, lower than it was.',
    arrival:'Something long moves between you and the water, slow, and is gone before anyone can put a name to it.',
    midroom:'Behind you, something you had already worked out shifts in the wind. It is not where you left it.'
  },
  wrongBeats:WRONG_BEATS, wrongSounds:WRONG_SOUNDS,
  scenes:SCENES, rooms:ROOMS
});
})();
