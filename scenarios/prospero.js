/* ============================================================
   SCENARIO: DERELICT — THE PROSPERO (haunted space ship)
   Wake from cryo forty years off course. The crew is gone.
   Something lives in the vents. Reach the escape pod.

   Built on the reset grammar (see PUZZLES.md): locks that look like locks,
   and whatever opens them somewhere else in the room. Each object carries
   its own art into the room as `sprite`; the backdrops below are only the
   place.
   ============================================================ */
(function(){
const SCENES={};

/* ---------- Room 1: The Cryo Bay ---------- */
SCENES.cryobay=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="pWall" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#0a1018"/><stop offset="1" stop-color="#131c28"/></linearGradient>
 <linearGradient id="pFloor" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#1c2430"/><stop offset="1" stop-color="#0b0f16"/></linearGradient>
 <linearGradient id="pPod" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#2a3a4c"/><stop offset="1" stop-color="#141e2a"/></linearGradient>
 <radialGradient id="pGlow"><stop offset="0" stop-color="#7fd4ff" stop-opacity=".3"/><stop offset="1" stop-color="#7fd4ff" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="640" fill="url(#pWall)"/>
<rect y="640" width="1600" height="260" fill="url(#pFloor)"/>
${[0,1,2,3,4,5,6].map(i=>`<line x1="${i*260-100}" y1="640" x2="${i*300-220}" y2="900" stroke="#060a10" stroke-width="5"/>`).join('')}
<line x1="0" y1="640" x2="1600" y2="640" stroke="#040608" stroke-width="6"/>
<!-- ceiling pipework -->
<g stroke="#1a2530" stroke-width="14" fill="none">
  <path d="M0 60 H1600 M0 108 H1600"/>
  <path d="M300 60 V0 M700 108 V0 M1150 60 V0 M1420 108 V0"/>
</g>
${[0,1,2,3].map(i=>`<circle cx="${260+i*380}" cy="84" r="9" fill="#223140"/>`).join('')}
<!-- caution stripes bulkhead -->
<g transform="translate(0,132)">
  <rect width="1600" height="20" fill="#151a12"/>
  ${[...Array(20)].map((_,i)=>`<rect x="${i*84}" y="0" width="42" height="20" fill="#4a4420" opacity=".7"/>`).join('')}
</g>
<!-- the vent grille, screws missing -->
<g id="art-vent">
  <rect x="1090" y="40" width="160" height="98" rx="8" fill="#0a0e14" stroke="#26313e" stroke-width="6"/>
  ${[0,1,2,3].map(i=>`<line x1="1104" y1="${60+i*20}" x2="1236" y2="${60+i*20}" stroke="#26313e" stroke-width="6"/>`).join('')}
  <circle cx="1102" cy="52" r="4" fill="#3a4856"/><circle cx="1238" cy="126" r="4" fill="#3a4856"/>
  <path d="M1150 138 l14 26 M1188 138 l-8 22" stroke="#0a0e14" stroke-width="5"/>
</g>
<!-- cryo vapor bleeding out of the open pod -->
<ellipse class="steam" cx="560" cy="560" rx="26" ry="11" fill="#7fd4ff" opacity=".18"/>
<ellipse class="steam" cx="592" cy="540" rx="18" ry="8" fill="#7fd4ff" opacity=".14" style="animation-delay:1.7s"/>
<ellipse class="steam" cx="540" cy="520" rx="14" ry="7" fill="#c8ecff" opacity=".12" style="animation-delay:3.1s"/>
<!-- dead crew light + drag streak -->
<path d="M700 760 q160 20 340 -8" stroke="#0a0e14" stroke-width="26" fill="none" opacity=".5"/>
<circle class="slowblink" cx="60" cy="200" r="8" fill="#c94a3d"/>
<text x="84" y="206" font-family="Special Elite" font-size="15" fill="#7f5a5a">LIFE SUPPORT: RESERVE</text>
<!--SPRITES-->
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-cryobay" cx="190" cy="170" r="6" fill="#7fd4ff" opacity=".12"/>
<circle cx="190" cy="170" r="20" fill="#7fd4ff" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-cryobay" class="surge" cx="1110" cy="710" rx="96" ry="70" fill="#8fd8ff" opacity="0"/>
<!-- dust hanging in nil gravity -->
<circle class="sparkle" cx="120" cy="170" r="2.2" fill="#9fc4dd" style="animation-delay:0.0s"/><circle class="sparkle" cx="238" cy="217" r="2.2" fill="#9fc4dd" style="animation-delay:0.6s"/><circle class="sparkle" cx="356" cy="264" r="2.2" fill="#9fc4dd" style="animation-delay:1.2s"/><circle class="sparkle" cx="474" cy="191" r="2.2" fill="#9fc4dd" style="animation-delay:1.7999999999999998s"/><circle class="sparkle" cx="592" cy="238" r="2.2" fill="#9fc4dd" style="animation-delay:2.4s"/><circle class="sparkle" cx="710" cy="285" r="2.2" fill="#9fc4dd" style="animation-delay:3.0s"/><circle class="sparkle" cx="828" cy="212" r="2.2" fill="#9fc4dd" style="animation-delay:3.5999999999999996s"/><circle class="sparkle" cx="946" cy="259" r="2.2" fill="#9fc4dd" style="animation-delay:4.2s"/><circle class="sparkle" cx="1064" cy="186" r="2.2" fill="#9fc4dd" style="animation-delay:4.8s"/><circle class="sparkle" cx="1182" cy="233" r="2.2" fill="#9fc4dd" style="animation-delay:0.39999999999999947s"/><circle class="sparkle" cx="1300" cy="280" r="2.2" fill="#9fc4dd" style="animation-delay:1.0s"/>
<!-- a conduit that has been failing for forty years -->
<g class="arcflick" style="animation-delay:5s"><path d="M60 250 l26 16 l-14 6 l22 12" stroke="#8fd8ff" stroke-width="2.4" fill="none"/></g>
<g class="flick" style="animation-delay:2s"><rect x="300" y="164" width="150" height="5" rx="2" fill="#7fd4ff" opacity=".22"/></g>
<g class="flick" style="animation-delay:6s"><rect x="1080" y="176" width="120" height="4" rx="2" fill="#7fd4ff" opacity=".16"/></g>

<g class="arcflick" style="animation-delay:9s"><path d="M1540 200 l-24 18 l13 7 l-20 14" stroke="#8fd8ff" stroke-width="2" fill="none"/></g>
<circle class="slowblink" cx="820" cy="210" r="4" fill="#7fd4ff" opacity=".6" style="animation-delay:1.2s"/>
<circle class="slowblink" cx="240" cy="286" r="3" fill="#e0b24a" opacity=".5" style="animation-delay:2.6s"/>
<g opacity=".2"><path d="M40 160 q34 24 24 62 M96 176 q-18 32 8 58" stroke="#bfe8ff" stroke-width="2" fill="none"/></g>
<ellipse class="steam" cx="1400" cy="250" rx="34" ry="10" fill="#cfe8ff" opacity=".08"/></g>
</svg>`;

/* ---------- Room 2: The Bridge ---------- */
SCENES.bridge=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="pB" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#070b12"/><stop offset="1" stop-color="#101826"/></linearGradient>
 <linearGradient id="pCon" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#22303e"/><stop offset="1" stop-color="#121a24"/></linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#pB)"/>
<!-- the great viewport -->
<g>
  <path d="M180 80 H1420 L1360 420 H240 Z" fill="#02040a" stroke="#26313e" stroke-width="14"/>
</g>
<!-- corridor door where something passes -->
<g>
  <rect x="40" y="330" width="130" height="330" fill="#05080d" stroke="#26313e" stroke-width="8"/>
  <rect class="win-shadow" x="0" y="350" width="56" height="300" rx="24" fill="#010203" opacity="0"/>
  <circle class="slowblink" cx="105" cy="316" r="7" fill="#c94a3d"/>
</g>
<!-- console bank -->
<rect x="240" y="560" width="1140" height="34" rx="8" fill="#26313e"/>
<rect x="260" y="594" width="1100" height="150" rx="10" fill="url(#pCon)"/>
<!--SPRITES-->
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-bridge" cx="230" cy="210" r="6" fill="#7fd4ff" opacity=".12"/>
<circle cx="230" cy="210" r="20" fill="#7fd4ff" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-bridge" class="surge" cx="210" cy="430" rx="96" ry="70" fill="#8fd8ff" opacity="0"/>
<!-- wreckage tumbling past the viewport, and something enormous rising -->
<g class="drift" style="animation-delay:3s"><path d="M300 250 l34 -8 l10 16 l-38 10z" fill="#12202c" opacity=".8"/></g>
<g class="drift" style="animation-delay:14s"><path d="M700 150 l22 6 l-6 16 l-24 -6z" fill="#101c26" opacity=".7"/></g>
<circle class="riseslow" cx="320" cy="300" r="64" fill="#02040a" opacity=".93" style="animation-duration:70s"/>
<circle class="riseslow" cx="320" cy="300" r="64" fill="none" stroke="#1b2f45" stroke-width="2" opacity=".6" style="animation-duration:70s"/>
<g class="flick" style="animation-delay:4s"><rect x="200" y="470" width="200" height="4" fill="#7fd4ff" opacity=".13"/></g>

<g class="flick" style="animation-delay:7s"><rect x="1000" y="500" width="160" height="4" fill="#7fd4ff" opacity=".11"/></g>
<circle class="slowblink" cx="1240" cy="502" r="4" fill="#e0b24a" opacity=".5" style="animation-delay:1.8s"/>
<g class="drift" style="animation-delay:22s"><path d="M1180 190 l18 -5 l6 12 l-20 6z" fill="#0e1723" opacity=".65"/></g>
<g class="drift" style="animation-delay:9s"><circle cx="560" cy="340" r="3" fill="#1a2c3e" opacity=".8"/></g></g>
</svg>`;

/* ---------- Room 3: Hydroponics ---------- */
SCENES.hydro=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="pH" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#081209"/><stop offset="1" stop-color="#0c1a14"/></linearGradient>
 <radialGradient id="pPlant"><stop offset="0" stop-color="#6fdc8c" stop-opacity=".5"/><stop offset="1" stop-color="#6fdc8c" stop-opacity="0"/></radialGradient>
 <radialGradient id="pPlant2"><stop offset="0" stop-color="#b48ce0" stop-opacity=".45"/><stop offset="1" stop-color="#b48ce0" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#pH)"/>
<!-- overhead grow lights -->
${[0,1,2].map(i=>`<g><rect x="${240+i*420}" y="60" width="300" height="18" rx="8" fill="#1a2530"/>
  <polygon class="flick" points="${250+i*420},78 ${530+i*420},78 ${600+i*420},560 ${180+i*420},560" fill="#9fe8b0" opacity=".05"/></g>`).join('')}
<!-- drip pipes -->
<g stroke="#1c3226" stroke-width="8" fill="none">
  <path d="M0 140 H1600"/>
  ${[0,1,2,3,4,5].map(i=>`<path d="M${200+i*250} 140 V 260"/>`).join('')}
</g>
<!-- condensation dripping off the feed pipes -->
<g><circle class="dripdrop" cx="450" cy="262" r="3.5" fill="#9fe8b0" opacity=".8"/></g>
<g><circle class="dripdrop d2" cx="950" cy="262" r="3" fill="#9fe8b0" opacity=".8"/></g>
<!-- torn vent above, hanging open -->
<g id="art-grate">
  <rect x="900" y="30" width="150" height="86" rx="8" fill="#05080d" stroke="#26313e" stroke-width="6"/>
  <g transform="rotate(38 900 116)"><rect x="900" y="108" width="150" height="12" rx="4" fill="#26313e"/></g>
  <path d="M930 116 q-8 40 6 78" stroke="#101c12" stroke-width="4" fill="none"/>
</g>
<!-- planter rows -->
<g id="art-vines">
${[0,1].map(row=>`
  <rect x="120" y="${330+row*180}" width="1360" height="26" rx="8" fill="#1a2530"/>
  <rect x="120" y="${356+row*180}" width="1360" height="60" rx="10" fill="#12202b"/>
  ${[...Array(9)].map((_,i)=>{
    const x=190+i*150, purple=(i+row)%3===2;
    return `<g><ellipse cx="${x}" cy="${330+row*180}" rx="46" ry="30" fill="url(#pPlant${purple?'2':''})"/>
     <path d="M${x-20} ${344+row*180} q6 -40 20 -52 M${x} ${344+row*180} q2 -46 -4 -60 M${x+18} ${344+row*180} q-2 -38 -16 -50" stroke="${purple?'#7a5c9c':'#2f6a4a'}" stroke-width="5" fill="none"/></g>`;}).join('')}
`).join('')}
</g>
<!-- overgrowth bursting from the far row -->
<g stroke="#2f6a4a" stroke-width="7" fill="none" opacity=".8">
  <path d="M120 520 q-60 -80 -90 -190 M160 520 q-20 -120 30 -200 M1480 520 q60 -90 80 -200 M1440 700 q40 -60 110 -80"/>
</g>
<!-- specimen trays (hidden until vines) -->
<g id="el-trays">
  ${[['S',560],['B',664],['T',768],['A',872],['I',976],['R',1080],['V',1184],['O',1288],['E',1392]].map(([ch,x],i)=>
  `<g><rect x="${x-40}" y="640" width="80" height="54" rx="8" fill="#16222c" stroke="#31465c" stroke-width="3"/>
   <text x="${x}" y="676" text-anchor="middle" font-family="Special Elite" font-size="22" fill="#9fc8ae">${ch}</text>
   <circle class="slowblink" cx="${x-24}" cy="650" r="4" fill="#6fdc8c" style="animation-delay:${i*.3}s"/></g>`).join('')}
</g>
<!-- nutrient pump manifold (hidden until trays) -->
<g id="el-pumps">
  <rect x="80" y="640" width="170" height="150" rx="12" fill="#141e2a" stroke="#31465c" stroke-width="5"/>
  ${[0,1,2].map(i=>`<circle cx="${120+i*45}" cy="690" r="16" fill="#0a141c" stroke="#5a7a94" stroke-width="4"/>
   <line x1="${120+i*45}" y1="690" x2="${130+i*45}" y2="676" stroke="#9fc8ae" stroke-width="3"/>`).join('')}
  <rect x="110" y="730" width="110" height="34" rx="6" fill="#0a141c"/>
</g>
<!-- aft airlock with blinking panel (hidden until pumps... door always visible) -->
<g id="el-airlock">
  <rect x="1330" y="180" width="230" height="420" rx="18" fill="#0c121a" stroke="#31465c" stroke-width="10"/>
  <circle cx="1445" cy="340" r="52" fill="#05080d" stroke="#26313e" stroke-width="8"/>
  <rect x="1400" y="470" width="90" height="52" rx="8" fill="#0a141c" stroke="#2a4258" stroke-width="4"/>
  <circle id="airlock-lamp" cx="1445" cy="496" r="10" fill="#ffdf9c" opacity=".1"/>
  ${[0,1,2].map(i=>`<rect x="${1350+i*70}" y="606" width="42" height="10" rx="4" fill="#4a4420" opacity=".8"/>`).join('')}
</g>
<!-- floor -->
<rect y="800" width="1600" height="100" fill="#0a0f0c"/>
<path d="M320 840 q200 18 420 0 t 420 6" stroke="#050805" stroke-width="16" fill="none" opacity=".6"/>
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-hydro" cx="550" cy="210" r="6" fill="#7fd4ff" opacity=".12"/>
<circle cx="550" cy="210" r="20" fill="#7fd4ff" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-hydro" class="surge" cx="570" cy="430" rx="96" ry="70" fill="#8fd8ff" opacity="0"/>
<!-- spores and seed fluff drifting through the grow lights -->
<circle class="sparkle" cx="430" cy="60" r="3" fill="#cdf3b4" style="animation-delay:0.0s"/><circle class="sparkle" cx="543" cy="131" r="3" fill="#cdf3b4" style="animation-delay:0.9s"/><circle class="sparkle" cx="656" cy="202" r="3" fill="#cdf3b4" style="animation-delay:1.8s"/><circle class="sparkle" cx="769" cy="73" r="3" fill="#cdf3b4" style="animation-delay:2.7s"/><circle class="sparkle" cx="882" cy="144" r="3" fill="#cdf3b4" style="animation-delay:3.6s"/><circle class="sparkle" cx="995" cy="215" r="3" fill="#cdf3b4" style="animation-delay:4.5s"/><circle class="sparkle" cx="1108" cy="86" r="3" fill="#cdf3b4" style="animation-delay:5.4s"/><circle class="sparkle" cx="521" cy="157" r="3" fill="#cdf3b4" style="animation-delay:0.2999999999999998s"/><circle class="sparkle" cx="634" cy="228" r="3" fill="#cdf3b4" style="animation-delay:1.2000000000000002s"/><circle class="sparkle" cx="747" cy="99" r="3" fill="#cdf3b4" style="animation-delay:2.0999999999999996s"/>
<ellipse class="leaffall" cx="640" cy="40" rx="7" ry="3.4" fill="#4f8f3c" opacity=".55" style="animation-delay:6s"/>
<ellipse class="leaffall" cx="1180" cy="30" rx="6" ry="3" fill="#5f9f4c" opacity=".45" style="animation-delay:17s"/>
<circle class="dripdrop" cx="500" cy="150" r="3.6" fill="#bfe8ff" opacity=".55" style="animation-delay:3s"/>
<circle class="dripdrop" cx="980" cy="140" r="3" fill="#bfe8ff" opacity=".45" style="animation-delay:9s"/>
<ellipse class="steam" cx="300" cy="200" rx="60" ry="14" fill="#9fe0b0" opacity=".07"/></g>
</svg>`;

/* ---------- Room 4: The Escape Pod Bay ---------- */
SCENES.podbay=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="pPB" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#0a0e18"/><stop offset="1" stop-color="#141a26"/></linearGradient>
 <linearGradient id="pPod2" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#3a4c60"/><stop offset="1" stop-color="#182230"/></linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#pPB)"/>
<!-- bay doors with caution chevrons -->
<g>
  <rect x="480" y="90" width="660" height="480" rx="20" fill="#0c121a" stroke="#31465c" stroke-width="12"/>
  <line x1="810" y1="90" x2="810" y2="570" stroke="#26313e" stroke-width="10"/>
  ${[0,1,2,3,4].map(i=>`<path d="M${520+i*120} 560 l50 -40 20 0 -50 40 z" fill="#4a4420" opacity=".8"/>`).join('')}
  <circle class="slowblink" cx="810" cy="76" r="9" fill="#c94a3d"/>
</g>
<!-- small viewport with the beacon star -->
<g id="art-scratches">
  <rect x="120" y="140" width="200" height="150" rx="14" fill="#02040a" stroke="#26313e" stroke-width="9"/>
  ${Array.from({length:16},(_,i)=>`<circle class="tw" cx="${140+(i*43)%170}" cy="${158+(i*29)%110}" r="${.7+(i%3)*.6}" fill="#dfe8ff" style="animation-delay:${(i*.7)%4}s"/>`).join('')}
  <circle class="slowblink" cx="240" cy="200" r="4.5" fill="#8cd9c0"/>
  <path d="M150 300 l40 -18 M170 304 l36 -16 M192 308 l30 -12" stroke="#3a4856" stroke-width="3"/>
</g>
<!-- the escape pod on rails -->
<g class="bob">
  <ellipse cx="810" cy="740" rx="240" ry="20" fill="#000" opacity=".4"/>
  <path d="M620 640 q10 -120 190 -130 q180 10 190 130 q-10 60 -190 66 q-180 -6 -190 -66z" fill="url(#pPod2)" stroke="#4a6076" stroke-width="5"/>
  <circle cx="810" cy="600" r="40" fill="#05080d" stroke="#26313e" stroke-width="7"/>
  <circle class="flick" cx="810" cy="600" r="14" fill="#0f2a3a"/>
  ${[0,1].map(i=>`<rect x="${700+i*180}" y="688" width="40" height="26" rx="6" fill="#26313e"/>`).join('')}
</g>
<rect x="540" y="740" width="560" height="14" rx="6" fill="#1a2530"/>
${[0,1,2,3,4,5].map(i=>`<rect x="${560+i*96}" y="754" width="12" height="30" fill="#141c26"/>`).join('')}
<!-- rotating hazard glow over the bay doors -->
<ellipse class="rippleA" cx="810" cy="86" rx="60" ry="18" fill="#c94a3d" opacity=".4"/>
<!-- launch checklist on gantry -->
<g id="art-checklist">
  <rect x="220" y="480" width="120" height="160" rx="6" fill="#c2cad2" transform="rotate(-3 280 560)"/>
  <text x="280" y="510" text-anchor="middle" font-family="Special Elite" font-size="12" fill="#7a2a1a" transform="rotate(-3 280 560)">LAUNCH DRILL</text>
  ${[0,1,2,3,4].map(i=>`<line x1="238" y1="${528+i*20}" x2="322" y2="${524+i*20}" stroke="#4a5560" stroke-width="3" transform="rotate(-3 280 560)"/>`).join('')}
</g>
<!-- fuel panel -->
<g id="art-fuelpanel">
  <rect x="420" y="380" width="150" height="110" rx="10" fill="#141e2a" stroke="#31465c" stroke-width="5"/>
  <circle cx="470" cy="430" r="24" fill="#0a141c" stroke="#5a7a94" stroke-width="4"/>
  <line x1="470" y1="430" x2="484" y2="412" stroke="#c9a04a" stroke-width="4"/>
  ${[0,1,2,3].map(i=>`<circle cx="${524+ (i%2)*28}" cy="${412+Math.floor(i/2)*30}" r="9" fill="#1a2530"/>`).join('')}
</g>
<!-- launch-window table screen (hidden until fuelpanel) -->
<g id="el-window">
  <rect x="1180" y="220" width="230" height="150" rx="10" fill="#0a141c" stroke="#2a4258" stroke-width="6"/>
  ${[0,1,2].map(i=>`<line class="flick" x1="1200" y1="${256+i*34}" x2="${1380-i*24}" y2="${256+i*34}" stroke="#3fd68c" stroke-width="3"/>`).join('')}
  <text class="flick" x="1295" y="244" text-anchor="middle" font-family="Special Elite" font-size="13" fill="#3fd68c">ORBITAL PASSES</text>
</g>
<!-- docking clamps (hidden until window) -->
<g id="el-clamps">
  <rect x="1180" y="520" width="240" height="180" rx="14" fill="#141e2a" stroke="#31465c" stroke-width="6"/>
  ${[0,1,2,3].map(i=>`<rect x="${1204+i*54}" y="548" width="38" height="70" rx="6" fill="#0a141c" stroke="#5a7a94" stroke-width="3"/>
   <text x="${1223+i*54}" y="592" text-anchor="middle" font-size="18" fill="#7f97ab">${'⚡❄☢💧'[i]}</text>`).join('')}
  <text x="1300" y="666" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#5a7a94">RELEASE: CRYO·WATER·POWER·REACTOR</text>
</g>
<!-- thruster test rig (hidden until clamps) -->
<g id="el-thrusters">
  <rect x="690" y="800 " width="240" height="60" rx="10" fill="#141e2a" stroke="#31465c" stroke-width="5"/>
  ${[0,1,2].map(i=>`<circle class="slowblink" cx="${740+i*70}" cy="830" r="12" fill="#7fb0ff" style="animation-delay:${i*.4}s"/>`).join('')}
</g>
<circle class="slowblink" cx="60" cy="60" r="8" fill="#c94a3d"/>
<text x="84" y="66" font-family="Special Elite" font-size="15" fill="#7f5a5a">BAY PRESSURE: FALLING</text>
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-podbay" cx="710" cy="210" r="6" fill="#7fd4ff" opacity=".12"/>
<circle cx="710" cy="210" r="20" fill="#7fd4ff" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-podbay" class="surge" cx="870" cy="440" rx="96" ry="70" fill="#8fd8ff" opacity="0"/>
<!-- pressure bleeding off somewhere it shouldn't -->
<ellipse class="steam" cx="980" cy="70" rx="46" ry="12" fill="#cfe8ff" opacity=".16"/>
<ellipse class="steam" cx="1020" cy="50" rx="30" ry="9" fill="#cfe8ff" opacity=".12" style="animation-delay:2.4s"/>
<circle class="slowblink" cx="1520" cy="120" r="9" fill="#e0b24a" opacity=".8"/>
<circle class="slowblink" cx="1520" cy="120" r="20" fill="#e0b24a" opacity=".18" style="animation-delay:.2s"/>
<circle class="sparkle" cx="150" cy="40" r="2" fill="#9fc4dd" style="animation-delay:0.0s"/><circle class="sparkle" cx="278" cy="77" r="2" fill="#9fc4dd" style="animation-delay:0.7s"/><circle class="sparkle" cx="406" cy="54" r="2" fill="#9fc4dd" style="animation-delay:1.4s"/><circle class="sparkle" cx="534" cy="91" r="2" fill="#9fc4dd" style="animation-delay:2.0999999999999996s"/><circle class="sparkle" cx="662" cy="68" r="2" fill="#9fc4dd" style="animation-delay:2.8s"/><circle class="sparkle" cx="790" cy="45" r="2" fill="#9fc4dd" style="animation-delay:3.5s"/><circle class="sparkle" cx="918" cy="82" r="2" fill="#9fc4dd" style="animation-delay:0.1999999999999993s"/><circle class="sparkle" cx="1046" cy="59" r="2" fill="#9fc4dd" style="animation-delay:0.8999999999999995s"/><circle class="sparkle" cx="1174" cy="96" r="2" fill="#9fc4dd" style="animation-delay:1.5999999999999996s"/>
<g class="drift" style="animation-delay:7s"><rect x="600" y="70" width="16" height="5" rx="2" fill="#26313e"/></g></g>
</svg>`;

const WRONG_BEATS=[
  "Somewhere above the ceiling panels, something heavy shifts half a meter, then settles.",
  "The air recycler stops for four full seconds. When it resumes, it sounds like breathing.",
  "A pod lid in the cryo bay closes on its own. Nobody has been back there.",
  "Down the corridor, a maintenance light dies — then the next one. Then the next.",
  "The vent grille nearest you flexes outward, once, like something leaned on it from inside."
];
const WRONG_SOUNDS=['clank','hiss','clank','growl','hiss'];

/* ============================================================
   THE DRAWINGS, AND THE ROOMS THEY STAND IN

   Every prop is drawn once and used twice: large in the close-up, and small
   standing in the room, so what you can see from across the bay is exactly
   what you read when you lean in.
   ============================================================ */
const C = ART.COL, I = ART.INK, W = ART.words, GL = ART.glyph;

/* ============================================================
   ROOM 1 — THE CRYO BAY
   The locker's wheels wear four pictograms; the pipe run gives each a colour
   and the cargo crate's diamond gives each colour a number. The evacuation
   plan is a maze of welded hatches with one way through it, walked on the
   terminal's keys. And the lift wants five digits that are written twice in
   this bay — frosted over on the pods, cracked across on the terminal —
   and whole in neither place.
   ============================================================ */
const P = { hull: '#1c2836', edge: '#31465c', dark: '#0a0e14', deep: '#05080d', plate: '#c2cad2', plateInk: '#27313a',
            steel: '#3d4d5b', amber: '#ffb45e', crt: '#3fd68c', ice: '#cfeeff', cyan: '#7fd4ff', warn: '#c94a3d' };

/* ---- the pipe run: a colour for every pictogram (and one pipe that is on no wheel) ---- */
const PIPE_CODE = [['blue', 'snowflake'], ['white', 'fan'], ['yellow', 'bolt'], ['green', 'droplet'], ['red', 'trefoil']];
const pipesArt = { w: 720, h: 284, body: (() => {
  let b = '';
  [96, 624].forEach(x => b += `<rect x="${x - 9}" y="4" width="18" height="276" rx="4" fill="#141c26" stroke="${P.dark}" stroke-width="2"/>`);
  PIPE_CODE.forEach(([col, glyph], i) => {
    const y = 16 + i * 54;
    b += `<rect x="0" y="${y}" width="720" height="36" fill="${P.steel}"/><rect x="0" y="${y + 4}" width="720" height="7" fill="#6f8494" opacity=".55"/><rect x="0" y="${y + 28}" width="720" height="8" fill="#1a232d" opacity=".7"/>`;
    [40, 680].forEach(x => b += `<rect x="${x - 7}" y="${y - 4}" width="14" height="44" rx="3" fill="#2a3642" stroke="#141c26" stroke-width="2"/>`);
    b += `<rect x="150" y="${y}" width="118" height="36" fill="${C[col]}"/><rect x="150" y="${y + 4}" width="118" height="7" fill="#fff" opacity=".28"/><rect x="150" y="${y + 28}" width="118" height="8" fill="#000" opacity=".25"/>`;
    b += `<path d="M150 ${y}v36M268 ${y}v36" stroke="${P.dark}" stroke-width="2.5"/>`;
    b += `<rect x="330" y="${y - 6}" width="64" height="48" rx="6" fill="${P.plate}" stroke="#56626e" stroke-width="2.5"/>` + GL(glyph, 345, y + 1, 34, P.plateInk);
    b += `<circle cx="337" cy="${y + 1}" r="2" fill="#56626e"/><circle cx="387" cy="${y + 1}" r="2" fill="#56626e"/>`;
  });
  return b;
})() };

/* ---- the crate: a number for every colour ---- */
const DIAMOND = { top: ['red', 8], left: ['blue', 3], right: ['yellow', 7], bottom: ['green', 5] };
const crateArt = { w: 420, h: 330, body: (() => {
  let b = `<ellipse cx="210" cy="318" rx="204" ry="10" fill="#000" opacity=".35"/>`;
  b += `<rect x="10" y="34" width="400" height="282" rx="6" fill="#243240" stroke="${P.dark}" stroke-width="4"/>`;
  [0, 1, 2, 3, 4].forEach(i => b += `<path d="M10 ${78 + i * 52}H410" stroke="${P.dark}" stroke-width="2.5" opacity=".55"/>`);
  [[10, 34], [386, 34], [10, 292], [386, 292]].forEach(([x, y]) => b += `<rect x="${x}" y="${y}" width="24" height="24" fill="#3a4a59" stroke="${P.dark}" stroke-width="2"/>`);
  const cx = 210, cy = 176, r = 112, q = r / 2;
  const quad = { top: [cx, cy - q], right: [cx + q, cy], bottom: [cx, cy + q], left: [cx - q, cy] };
  const ink = { red: '#fff4e0', blue: '#f1f6ff', yellow: '#2a1e0c', green: '#0e2414' };
  b += `<path d="M${cx} ${cy - r - 9}L${cx + r + 9} ${cy}L${cx} ${cy + r + 9}L${cx - r - 9} ${cy}Z" fill="${P.plate}" stroke="${P.dark}" stroke-width="3"/>`;
  Object.keys(quad).forEach(k => {
    const [x, y] = quad[k], [col, n] = DIAMOND[k];
    b += `<path d="M${x} ${y - q}L${x + q} ${y}L${x} ${y + q}L${x - q} ${y}Z" fill="${C[col]}" stroke="${P.dark}" stroke-width="3"/>`;
    b += W(x, y + 17, String(n), { size: 50, face: 'num', weight: 700, fill: ink[col] });
  });
  return b;
})() };

/* ---- the locker ---- */
const LOCKER_WHEELS = ['bolt', 'snowflake', 'trefoil', 'droplet'];
const LOCKER_CODE = LOCKER_WHEELS.map(g => {
  const col = PIPE_CODE.find(p => p[1] === g)[0];
  return Object.values(DIAMOND).find(d => d[0] === col)[1];
}).join('');
function lockerBody(open) {
  let b = `<ellipse cx="61" cy="270" rx="64" ry="6" fill="#000" opacity=".4"/><rect x="2" y="6" width="118" height="262" rx="7" fill="${P.hull}" stroke="${P.edge}" stroke-width="5"/>`;
  b += `<rect x="2" y="246" width="118" height="22" fill="#4a4420" opacity=".8"/>` + [0, 1, 2, 3].map(i => `<path d="M${8 + i * 30} 268l14 -22h12l-14 22z" fill="${P.dark}" opacity=".7"/>`).join('');
  [0, 1, 2].forEach(i => b += `<path d="M14 ${26 + i * 10}h34" stroke="${P.dark}" stroke-width="4" stroke-linecap="round"/>`);
  if (!open) {
    b += `<path d="M61 8V246" stroke="${P.edge}" stroke-width="4"/>`;
    [0, 1, 2].forEach(i => b += `<path d="M74 ${26 + i * 10}h34" stroke="${P.dark}" stroke-width="4" stroke-linecap="round"/>`);
    b += `<rect x="66" y="118" width="48" height="26" rx="4" fill="#8f7a3c" stroke="#3a2f12" stroke-width="2"/>`;
    [0, 1, 2, 3].forEach(i => b += `<rect x="${70 + i * 10.6}" y="123" width="7.6" height="16" rx="1.5" fill="#141008"/>`);
  } else {
    b += `<rect x="62" y="10" width="55" height="234" fill="${P.deep}"/><path d="M62 150H117" stroke="${P.edge}" stroke-width="4"/>`;
    b += `<circle cx="90" cy="134" r="26" fill="${P.amber}" opacity=".16"/><rect x="74" y="126" width="32" height="20" rx="6" fill="#30404e" stroke="${P.dark}" stroke-width="2"/><rect x="80" y="131" width="20" height="10" rx="2" fill="${P.amber}"/>`;
    b += `<path d="M117 8l14 10v228l-14 -6z" fill="#263444" stroke="${P.edge}" stroke-width="3" stroke-linejoin="round"/>`;
  }
  return b;
}
const cellFig = ART.svg(460, 240, (() => {
  let b = `<path d="M20 196H440" stroke="${P.edge}" stroke-width="6"/><ellipse cx="230" cy="196" rx="170" ry="9" fill="#000" opacity=".4"/>`;
  b += `<rect x="74" y="84" width="312" height="106" rx="26" fill="#30404e" stroke="${P.dark}" stroke-width="5"/><rect x="74" y="96" width="312" height="16" fill="#6f8494" opacity=".4"/>`;
  b += `<rect x="50" y="110" width="30" height="54" rx="6" fill="#56626e" stroke="${P.dark}" stroke-width="4"/><rect x="380" y="110" width="30" height="54" rx="6" fill="#56626e" stroke="${P.dark}" stroke-width="4"/>`;
  b += `<rect x="150" y="112" width="160" height="50" rx="8" fill="${P.deep}" stroke="${P.dark}" stroke-width="3"/>`;
  [0, 1, 2, 3].forEach(i => b += `<rect x="${162 + i * 36}" y="122" width="26" height="30" rx="3" fill="${P.amber}" opacity="${i < 3 ? 1 : .22}"/>`);
  b += `<circle cx="230" cy="137" r="120" fill="${P.amber}" opacity=".06"/>` + GL('bolt', 100, 118, 40, P.amber);
  return b;
})());

/* ---- the evacuation plan: nine compartments, and most of the hatches between them welded ---- */
const PLAN = [['antenna', 'bulb', 'lift'], ['leaf', 'kettle', 'fan'], ['snowflake', 'medic', 'pump']];
const OPEN = ['2,0|2,1', '2,1|1,1', '1,1|1,0', '1,0|0,0', '0,0|0,1', '0,1|0,2'];
const isOpen = (r1, c1, r2, c2) => OPEN.includes(`${r1},${c1}|${r2},${c2}`) || OPEN.includes(`${r2},${c2}|${r1},${c1}`);
/** The one way through: walked out here rather than typed, so the plan and the lock cannot disagree. */
const ROUTE = (() => {
  const walk = (r, c, seen) => {
    if (PLAN[r][c] === 'lift') return [[r, c]];
    for (const [dr, dc] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr < 0 || nc < 0 || nr > 2 || nc > 2 || seen.has(nr + ',' + nc) || !isOpen(r, c, nr, nc)) continue;
      const rest = walk(nr, nc, new Set([...seen, nr + ',' + nc]));
      if (rest) return [[r, c], ...rest];
    }
    return null;
  };
  return walk(2, 0, new Set(['2,0'])).map(([r, c]) => PLAN[r][c]);
})();
const placardArt = { w: 560, h: 610, body: (() => {
  const X0 = 40, Y0 = 92, S = 160, wall = '#27313a';
  let b = `<rect x="6" y="8" width="548" height="596" rx="10" fill="#000" opacity=".3"/><rect x="2" y="2" width="548" height="596" rx="10" fill="${P.plate}" stroke="#7d8892" stroke-width="3"/>`;
  b += `<rect x="2" y="2" width="548" height="62" rx="10" fill="#a13a2e"/><rect x="2" y="44" width="548" height="20" fill="#a13a2e"/>`;
  b += GL('lift', 252, 10, 46, '#f6ead0') + `<path d="M150 33h70M162 21l-14 12l14 12" fill="none" stroke="#f6ead0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" transform="rotate(180 185 33)"/>`
    + `<path d="M330 33h70M342 21l-14 12l14 12" fill="none" stroke="#f6ead0" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`;
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
    const x = X0 + c * S, y = Y0 + r * S, g = PLAN[r][c];
    b += `<rect x="${x}" y="${y}" width="${S}" height="${S}" fill="#d9dfe5"/>` + GL(g, x + 44, y + 44, 72, P.plateInk);
    if (g === 'snowflake') b += `<rect x="${x + 12}" y="${y + 12}" width="${S - 24}" height="${S - 24}" rx="8" fill="none" stroke="#a13a2e" stroke-width="5" stroke-dasharray="14 8"/>` + ART.pin(x + 30, y + 30);
    if (g === 'lift') b += `<rect x="${x + 12}" y="${y + 12}" width="${S - 24}" height="${S - 24}" rx="8" fill="none" stroke="#2f7d45" stroke-width="6"/>`;
  }
  b += `<rect x="${X0}" y="${Y0}" width="${3 * S}" height="${3 * S}" fill="none" stroke="${wall}" stroke-width="10"/>`;
  const hatch = (x, y, vert, open) => {
    // a wall between two compartments, with a doorway in the middle of it: clear, or welded shut
    const len = S, door = 58, a = (len - door) / 2;
    const seg = (s, e) => vert ? `<path d="M${x} ${y + s}V${y + e}" stroke="${wall}" stroke-width="10"/>` : `<path d="M${x + s} ${y}H${x + e}" stroke="${wall}" stroke-width="10"/>`;
    let h = seg(0, a) + seg(a + door, len);
    const mx = vert ? x : x + len / 2, my = vert ? y + len / 2 : y;
    if (open) h += vert ? `<path d="M${x - 9} ${y + a}h18M${x - 9} ${y + a + door}h18" stroke="${wall}" stroke-width="5"/>` : `<path d="M${x + a} ${y - 9}v18M${x + a + door} ${y - 9}v18" stroke="${wall}" stroke-width="5"/>`;
    else {
      h += vert ? `<rect x="${x - 9}" y="${y + a}" width="18" height="${door}" fill="#7d8892" stroke="${wall}" stroke-width="3"/>` : `<rect x="${x + a}" y="${y - 9}" width="${door}" height="18" fill="#7d8892" stroke="${wall}" stroke-width="3"/>`;
      h += `<path d="M${mx - 13} ${my - 13}L${mx + 13} ${my + 13}M${mx + 13} ${my - 13}L${mx - 13} ${my + 13}" stroke="#a13a2e" stroke-width="6" stroke-linecap="round"/>`;
    }
    return h;
  };
  for (let r = 0; r < 3; r++) for (let c = 0; c < 2; c++) b += hatch(X0 + (c + 1) * S, Y0 + r * S, true, isOpen(r, c, r, c + 1));
  for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) b += hatch(X0 + c * S, Y0 + (r + 1) * S, false, isOpen(r, c, r + 1, c));
  return b;
})() };

/* ---- the terminal: the same nine pictures, on keys that are laid out some other way ---- */
const PAD = [['fan', 'medic', 'bulb'], ['lift', 'pump', 'snowflake'], ['leaf', 'antenna', 'kettle']];
const padFig = ART.svg(440, 440, (() => {
  let b = `<rect x="4" y="4" width="432" height="432" rx="26" fill="#131d27" stroke="${P.edge}" stroke-width="6"/><rect x="26" y="26" width="388" height="388" rx="14" fill="#06130c" stroke="${P.dark}" stroke-width="4"/>`;
  for (let y = 40; y < 410; y += 8) b += `<path d="M30 ${y}H410" stroke="${P.crt}" stroke-width="1" opacity=".05"/>`;
  PAD.forEach((row, r) => row.forEach((g, c) => {
    const x = 110 + c * 110, y = 110 + r * 110;
    b += `<g data-key="${g}" data-x="${x}" data-y="${y}"><circle cx="${x}" cy="${y}" r="42" fill="#0c2217" stroke="${P.crt}" stroke-width="3"/>`
      + GL(g, x - 25, y - 25, 50, P.crt) + `<circle class="hit-show" cx="${x}" cy="${y}" r="48" fill="none" stroke="${P.amber}" stroke-width="5"/></g>`;
  }));
  return b;
})());
function terminalBody(open) {
  let b = `<rect x="52" y="112" width="46" height="62" fill="#141e2a"/><rect x="30" y="170" width="90" height="10" rx="4" fill="${P.edge}"/>`;
  b += `<rect x="2" y="2" width="146" height="112" rx="9" fill="#0a141c" stroke="#2a4258" stroke-width="5"/><rect class="flick" x="14" y="14" width="122" height="88" rx="4" fill="#06130c"/>`;
  if (!open) [0, 1, 2].forEach(r => [0, 1, 2].forEach(c => b += `<circle cx="${47 + c * 28}" cy="${32 + r * 26}" r="7" fill="none" stroke="${P.crt}" stroke-width="2.5" opacity=".85"/>`));
  else {
    [0, 1, 2, 3, 4].forEach(i => b += `<rect x="${24 + i * 22}" y="34" width="12" height="3.5" fill="${P.crt}"/><rect x="${24 + i * 22 + (i % 2 ? 0 : 8.5)}" y="38" width="3.5" height="13" fill="${P.crt}"/>`);
    b += `<path d="M14 58l22 -5l18 7l26 -6l20 6l36 -4V102H14Z" fill="#020604"/><path d="M14 58l22 -5l18 7l26 -6l20 6l36 -4" fill="none" stroke="#8fb8a2" stroke-width="1.5" opacity=".7"/>`;
  }
  return b;
}

/* ---- seven-segment digits, and the five that matter ---- */
const SEG = { 0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg' };
function seg7(x, y, w, h, digit, on, ghost) {
  const t = w * .2, hh = h / 2;
  const bar = { a: [x + t * .7, y, w - t * 1.4, t], g: [x + t * .7, y + hh - t / 2, w - t * 1.4, t], d: [x + t * .7, y + h - t, w - t * 1.4, t],
                f: [x, y + t * .7, t, hh - t * 1.05], b: [x + w - t, y + t * .7, t, hh - t * 1.05],
                e: [x, y + hh + t * .35, t, hh - t * 1.05], c: [x + w - t, y + hh + t * .35, t, hh - t * 1.05] };
  return Object.keys(bar).map(k => {
    const [bx, by, bw, bh] = bar[k], lit = digit != null && SEG[digit].includes(k);
    return `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="${(t * .4).toFixed(1)}" fill="${on}" opacity="${lit ? 1 : ghost}"/>`;
  }).join('');
}
const POD_READS = { 1: 3, 2: 9, 3: 5, 5: 6, 6: 7 };          // pod number -> what its readout says (pod 4 is yours, and dark)
const LIFT_CODE = Object.keys(POD_READS).map(k => POD_READS[k]).join('');

/* what the terminal shows once it is in: the readouts' upper halves, and dead glass below the crack */
const telemetryFig = ART.svg(680, 330, (() => {
  let b = `<rect x="4" y="4" width="672" height="322" rx="20" fill="#131d27" stroke="${P.edge}" stroke-width="6"/><rect x="24" y="24" width="632" height="282" rx="10" fill="#06130c"/>`;
  for (let y = 30; y < 304; y += 7) b += `<path d="M26 ${y}H654" stroke="${P.crt}" stroke-width="1" opacity=".05"/>`;
  const top = 96, dw = 52, dh = 150, t = dw * .2;
  [1, 2, 3, 4, 5, 6].forEach((n, i) => {
    const x = 62 + i * 100;
    b += GL('snowflake', x - 6, 38, 22, P.crt) + W(x + 34, 58, String(n), { size: 26, face: 'num', weight: 700, fill: P.crt });
    b += POD_READS[n] != null ? seg7(x, top, dw, dh, POD_READS[n], P.crt, .1)
      : `<path d="M${x + 6} ${top + 40}h${dw - 12}" stroke="${P.crt}" stroke-width="6" opacity=".35" stroke-linecap="round"/>`;
  });
  // everything from just above the middle bars down is lost
  const cy = top + dh / 2 - t / 2 - 12;
  const crack = `M24 ${cy + 4}l58 -9l44 11l70 -12l52 13l84 -10l60 9l76 -12l64 10l58 -8l66 7`;
  b += `<path d="${crack}V306H24Z" fill="#020604"/><path d="${crack}" fill="none" stroke="#9cc4ae" stroke-width="2" opacity=".75"/>`;
  b += `<path d="M196 ${cy - 8}l30 60l-18 44M452 ${cy - 6}l-26 52l22 70M82 ${cy - 5}l-20 90" fill="none" stroke="#9cc4ae" stroke-width="1.5" opacity=".4"/>`;
  [0, 1, 2].forEach(i => b += `<rect x="${90 + i * 190}" y="${cy + 40 + i * 28}" width="${120 - i * 26}" height="3" fill="${P.crt}" opacity=".12"/>`);
  return b;
})());

/* the pods themselves: each readout iced over from the top down to just above its middle bar */
const podsArt = { w: 870, h: 304, body: (() => {
  let b = '';
  [1, 2, 3, 4, 5, 6].forEach((n, i) => {
    const x = i * 150, open = n === 4;
    b += `<rect x="${x + 30}" y="290" width="60" height="10" rx="4" fill="#26313e"/>`;
    b += `<rect x="${x}" y="6" width="120" height="290" rx="34" fill="#22303e" stroke="${P.edge}" stroke-width="5"/><path d="M${x + 16} 52q-6 -34 28 -38" fill="none" stroke="#5b7289" stroke-width="4" opacity=".6" stroke-linecap="round"/>`;
    b += `<rect x="${x + 14}" y="30" width="92" height="150" rx="22" fill="${open ? P.deep : '#0d1622'}" stroke="${P.dark}" stroke-width="3"/>`;
    if (open) b += `<ellipse class="flick" cx="${x + 60}" cy="170" rx="40" ry="12" fill="${P.cyan}" opacity=".14"/><path d="M${x + 14} 60l-16 -10v120l16 10" fill="#1a2632" stroke="${P.edge}" stroke-width="3" stroke-linejoin="round"/>`;
    else b += `<path d="M${x + 24} 52q36 22 74 104" stroke="#2a4258" stroke-width="8" fill="none" opacity=".6"/><path d="M${x + 22} 166q20 -14 36 -4t40 -8" stroke="${P.ice}" stroke-width="3" fill="none" opacity=".25"/>`;
    b += W(x + 60, 208, String(n), { size: 24, face: 'num', weight: 700, fill: '#8fa6ba' });
    // the readout
    const rx = x + 24, ry = 218, rw = 72, rh = 66, dw = 30, dh = 50, t = dw * .2;
    b += `<rect x="${rx}" y="${ry}" width="${rw}" height="${rh}" rx="6" fill="${P.deep}" stroke="${P.dark}" stroke-width="3"/>`;
    if (open) { b += `<path d="M${rx + 24} ${ry + rh / 2}h${rw - 48}" stroke="${P.amber}" stroke-width="5" opacity=".3" stroke-linecap="round"/>`; return; }
    const dx = rx + (rw - dw) / 2, dy = ry + 8;
    b += seg7(dx, dy, dw, dh, POD_READS[n], P.amber, .1);
    // Frost comes down to just past the ends of the upper bars, so nothing of the top half shows —
    // and the icicles hang either side of the digit, never across what is left of it.
    const fy = dy + dh / 2 - t * .35 + 1.5;
    b += `<path d="M${rx - 5} ${ry - 7}h${rw + 10}V${fy}h-4l-5 13l-6 -13H${dx + dw + 2}H${dx - 2}h-5l-5 16l-6 -16H${rx - 5}Z" fill="${P.ice}" stroke="#8fb4cc" stroke-width="1.5" stroke-linejoin="round"/>`
      + `<path d="M${rx + 8} ${ry - 1}q16 6 30 0t26 2" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/>`;
  });
  return b;
})() };

/* ---- the lift ---- */
function liftBody(st) {
  const lamp = st.solved ? '#5fd08a' : st.live ? P.amber : '#1a222b';
  let b = `<rect x="16" y="2" width="68" height="30" rx="5" fill="#1c2836" stroke="#5b7289" stroke-width="3"/>` + GL('lift', 38, 5, 24, st.live ? P.amber : '#5b7289');
  b += `<rect x="2" y="40" width="96" height="308" rx="6" fill="#0c121a" stroke="#5b7289" stroke-width="6"/>`
    + [0, 1, 2, 3].map(i => `<path d="M${6 + i * 24} 348l12 -14h10l-12 14z" fill="#4a4420"/>`).join('');
  if (st.solved) b += `<rect x="10" y="48" width="80" height="284" fill="#e9d9a8" opacity=".9"/><rect x="10" y="48" width="14" height="284" fill="#121a24"/><rect x="76" y="48" width="14" height="284" fill="#121a24"/>`;
  else b += `<rect x="10" y="48" width="39" height="284" fill="#18232f"/><rect x="51" y="48" width="39" height="284" fill="#18232f"/><path d="M50 48V332" stroke="${P.dark}" stroke-width="3"/><path d="M22 60v260M78 60v260" stroke="#2a3a4a" stroke-width="2"/>`;
  b += `<rect x="102" y="150" width="22" height="46" rx="4" fill="#1c2836" stroke="${P.edge}" stroke-width="3"/><circle cx="113" cy="161" r="4.5" fill="${lamp}"/>`;
  [0, 1, 2].forEach(r => [0, 1].forEach(c => b += `<rect x="${106 + c * 8}" y="${170 + r * 8}" width="5.5" height="5.5" rx="1" fill="${st.live ? '#56626e' : '#141c26'}"/>`));
  if (st.live && !st.solved) b += `<circle cx="113" cy="161" r="12" fill="${P.amber}" opacity=".2"/>`;
  return b;
}

const POS1 = {
  pipes:    { x: 23.5, y: 17.4, w: 15.8, h: 10.9 },
  pods:     { x: 3.75, y: 35.3, w: 54.4, h: 33.8 },
  terminal: { x: 60.9, y: 46.7, w: 9.4,  h: 20 },
  placard:  { x: 72.3, y: 35,   w: 6.6,  h: 12.8 },
  locker:   { x: 80.6, y: 39.4, w: 7.6,  h: 30.6 },
  lift:     { x: 90.4, y: 31.6, w: 7.75, h: 39.1 },
  crate:    { x: 26.9, y: 76.4, w: 10.6, h: 14.8 },
};

const ROOM1 = {
  id:'cryobay', name:'Room 1 — The Cryo Bay', scene:'cryobay',
  stageFx:'drift',
  relays:[{el:'rl-cryobay',mode:'pulse',period:3.8}],
  wrongSound:'clank',
  intro:"You wake choking on cryo-fluid, forty years past your wake date. The other pods are dark.",
  objective:"<b>Glowing rings</b> mark what is worth a closer look. A lock shows you the kind of answer it wants — the answer itself is always somewhere else in the bay.",
  entryBeat:"The bay's ceiling panels creak, one after another, in a slow line from the vent to the door — the sound of weight moving where no crew could walk.",
  entrySound:'clank',
  completeText:"The lift takes the number and grinds upward toward the bridge. Behind you, in the bay, a pod lid whines open. You do not go back to check.",
  chain:`The locker's four wheels wear a bolt, a snowflake, a trefoil and a drop; the pipe run gives each pictogram a colour and the diamond on the cargo crate gives each colour a number: ${LOCKER_CODE} → the evacuation plan shows nine compartments with most of the hatches between them welded; the one open way from the cryo bay to the lift runs ${ROUTE.join(', ')}, pressed in that order on the terminal → its cracked screen shows the top halves of the five pod readouts and the frosted pods show the bottom halves: ${LIFT_CODE}, keyed into the lift once the power cell from the locker is in it.`,
  objects:[
    { id:'pipes', icon:'🧯', name:'Pipe Run', pos:POS1.pipes,
      desc:"Five service pipes along the bulkhead, each with a band of paint and a tag riveted beside it.",
      figure:ART.svg(pipesArt.w, pipesArt.h, pipesArt.body),
      sprite:ART.sprite(POS1.pipes, pipesArt.w, pipesArt.h, pipesArt.body) },
    { id:'crate', icon:'📦', name:'Cargo Crate', pos:POS1.crate,
      desc:"Never unloaded. The hazard diamond on its side is the brightest thing in the bay.",
      figure:ART.svg(crateArt.w, crateArt.h, crateArt.body),
      sprite:ART.sprite(POS1.crate, crateArt.w, crateArt.h, crateArt.body) },
    { id:'locker', icon:'🗄️', name:'Maintenance Locker', pos:POS1.locker,
      desc:"Still shut, which is more than can be said for most things on this deck. Four wheels, a pictogram over each.",
      sprite:st=>ART.sprite(POS1.locker, 134, 275, lockerBody(st.solved)),
      puzzle:{ type:'combo', from:['pipes','crate'],
        wheels:LOCKER_WHEELS.map(g=>({ mark:{ glyph:g } })), faces:'0123456789', answer:LOCKER_CODE,
        hints:[
          "Four wheels, and over each one a pictogram: a bolt, a snowflake, a trefoil, a drop. The same four pictures are riveted up somewhere else in this bay.",
          "The tags on the pipe run give every pictogram a colour, and the diamond on the cargo crate gives every colour a number. The fan's pipe is on no wheel.",
          `Bolt is yellow, snowflake is blue, trefoil is red, the drop is green: ${LOCKER_CODE.split('').join(', ')}.`
        ],
        solvedText:"The door comes open on a breath of cold. On the shelf, still showing charge: a power cell, with a keypad's fitting on one end.",
        inside:{ name:'From the locker', figure:cellFig } } },
    { id:'placard', icon:'🚪', name:'Evacuation Plan', pos:POS1.placard,
      desc:"This deck, compartment by compartment. Somebody has been round it since with a welding torch and a red pen.",
      figure:ART.svg(placardArt.w, placardArt.h, placardArt.body),
      sprite:ART.sprite(POS1.placard, placardArt.w, placardArt.h, placardArt.body, { rot: 2 }) },
    { id:'terminal', icon:'🖥️', name:'Medical Terminal', pos:POS1.terminal,
      desc:"Locked to a pattern: nine keys, and it wants seven of them in the right order.",
      sprite:st=>ART.sprite(POS1.terminal, 150, 180, terminalBody(st.solved)),
      puzzle:{ type:'press', from:['placard'], figure:padFig, slots:ROUTE.length, trail:true, answer:ROUTE,
        hints:[
          "Nine keys with nine pictures on them — the same nine pictures as the compartments on the evacuation plan.",
          "On the plan most of the hatches are welded. Only one way runs from the pin in the cryo bay to the lift: press the compartments in the order you would walk through them, starting where you are standing.",
          `${ROUTE.map((g, i) => i ? g : g[0].toUpperCase() + g.slice(1)).join(', ')}.`
        ],
        solvedText:"The screen wakes behind its crack: pod telemetry, six columns of it, and the lower half of every one lost in dead glass.",
        inside:{ name:'Pod telemetry', figure:telemetryFig } } },
    { id:'pods', icon:'🧊', name:'Cryo Pods', pos:POS1.pods,
      desc:"Six pods. The fourth is yours, and open. The readouts on the other five are still lit under forty years of frost.",
      figure:ART.svg(podsArt.w, podsArt.h, podsArt.body),
      sprite:ART.sprite(POS1.pods, podsArt.w, podsArt.h, podsArt.body) },
    { id:'lift', icon:'🛗', name:'Bridge Lift', pos:POS1.lift, needs:'locker',
      desc:"The only way off this deck that has not been welded. Its keypad has a cell in it now, and five empty places on the display.",
      deadDesc:"The only way off this deck that has not been welded. Its keypad is dark, and where a power cell should sit there is an empty cradle.",
      sprite:st=>ART.sprite(POS1.lift, 126, 350, liftBody(st)),
      puzzle:{ type:'keypad', from:['terminal','pods'], answer:LIFT_CODE,
        hints:[
          "Five digits. There is one five-figure number in this bay, and it is written in two places — neither of which shows you all of it.",
          "The readouts on the pods are frosted over on top. The same five readouts on the medical terminal are lost below the crack. Put the top half of each on its bottom half.",
          `Pods 1, 2, 3, 5 and 6 read ${LIFT_CODE.split('').join(', ')}.`
        ],
        solvedText:"The pad takes the number. Somewhere above you a motor that has not turned in forty years turns." } },
  ]
};

/* ============================================================
   ROOM 2 — THE BRIDGE
   Five keys on the captain's armrest are worn to bare metal, and they spell
   what opens his log. The sky in the viewport is read twice: against the
   star chart, for the four figures he ringed on the glass; and through the
   star wheel from his drawer, turned until its slot shows the same sky, for
   the hour. With the dish on its heading the beacon comes through, a run of
   coloured pulses to be sent back; engineering's scope wakes, and shows how
   far each rod is to be drawn.
   ============================================================ */

/* ---- the sky ---- */
const STARS = {
  crown:  { pts: [[6, 64], [28, 28], [50, 60], [72, 28], [94, 64]], lines: [[0, 1], [1, 2], [2, 3], [3, 4]] },
  fish:   { pts: [[8, 50], [38, 26], [66, 50], [38, 74], [94, 28], [94, 72]], lines: [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4], [2, 5]] },
  key:    { pts: [[8, 50], [24, 32], [40, 50], [24, 68], [68, 50], [94, 50], [68, 74]], lines: [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4], [4, 5], [4, 6]] },
  snake:  { pts: [[4, 74], [22, 44], [42, 68], [60, 38], [78, 62], [96, 30]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]] },
  bird:   { pts: [[5, 18], [27, 46], [50, 74], [73, 46], [95, 18], [50, 96]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5]] },
  anchor: { pts: [[50, 6], [50, 42], [50, 90], [26, 36], [74, 36], [18, 66], [82, 66]], lines: [[0, 1], [1, 2], [3, 1], [1, 4], [5, 2], [2, 6]] },
  crab:   { pts: [[30, 46], [50, 36], [70, 46], [70, 68], [50, 78], [30, 68], [10, 22], [90, 22]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 6], [2, 7]] },
  bell:   { pts: [[50, 8], [30, 40], [20, 74], [80, 74], [70, 40], [50, 94]], lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [2, 5], [5, 3]] },
};
/* Where everything lies on the star wheel when it is turned to match the window. The slot runs across
   the wheel's middle: 380 wide, 72 tall. Five figures are in it; three are round the back. */
const SKY = 60, SLOT = { w: 380, h: 72 };
const IN_VIEW = [['fish', -150, 3], ['crown', -75, -3], ['bird', 0, 4], ['snake', 75, -2], ['key', 150, 2]];
const ROUND_BACK = [['anchor', -96, -118], ['crab', 4, 128], ['bell', 104, -112]];
const RINGED = ['crown', 'key', 'fish', 'snake'];                 // in the order the captain numbered them
const skyStars = (() => {
  const bright = [];
  [...IN_VIEW, ...ROUND_BACK].forEach(([name, cx, cy]) => STARS[name].pts.forEach(([px, py]) =>
    bright.push({ x: cx + (px - 50) * SKY / 100, y: cy + (py - 50) * SKY / 100, big: true })));
  // the rest of the sky: faint, scattered, and the same every time
  let seed = 20441; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  const faint = [];
  for (let n = 0; faint.length < 54 && n < 4000; n++) {
    const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * 196, x = Math.cos(a) * r, y = Math.sin(a) * r;
    if (bright.some(s => Math.hypot(s.x - x, s.y - y) < 9) || faint.some(s => Math.hypot(s.x - x, s.y - y) < 12)) continue;
    faint.push({ x, y, big: false });
  }
  return [...bright, ...faint];
})();
const star = (x, y, r, big, halo = true) => big
  ? (halo ? `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * 2.3).toFixed(1)}" fill="#dfe8ff" opacity=".13"/>` : '') + `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#f4f7ff"/>`
  : `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r * .5).toFixed(1)}" fill="#9fb2d6" opacity=".8"/>`;

/* the viewport: the slot's worth of sky, with four figures ringed and numbered in grease pencil */
const VS = 880 / SLOT.w;
const viewArt = { w: 880, h: +(SLOT.h * VS).toFixed(1), body: (() => {
  const X = x => (x + SLOT.w / 2) * VS, Y = y => (y + SLOT.h / 2) * VS, H = SLOT.h * VS, wax = '#f1e3a4';
  let b = `<rect width="880" height="${H.toFixed(1)}" fill="#02040a"/>`;
  skyStars.filter(s => Math.abs(s.x) <= SLOT.w / 2 && Math.abs(s.y) <= SLOT.h / 2).forEach(s => b += star(X(s.x), Y(s.y), 4.6, s.big));
  RINGED.forEach((name, i) => {
    const [, cx, cy] = IN_VIEW.find(v => v[0] === name), x = X(cx), y = Y(cy);
    b += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="80" ry="74" fill="none" stroke="${wax}" stroke-width="4" opacity=".62" transform="rotate(${[-8, 11, -5, 7][i]} ${x.toFixed(1)} ${y.toFixed(1)})" stroke-dasharray="330 9 120 6"/>`;
    b += W(x - 62, y - 44, String(i + 1), { size: 44, face: 'hand', fill: wax, opacity: .9, weight: 700 });
  });
  return b;
})() };

/* the star chart: every figure with its lines drawn in, and its name as a picture */
const CHART_ORDER = ['bell', 'snake', 'crab', 'crown', 'anchor', 'key', 'bird', 'fish'];
const chartArt = { w: 430, h: 760, body: (() => {
  let b = `<rect x="4" y="6" width="422" height="750" rx="8" fill="#000" opacity=".35"/><rect x="0" y="0" width="422" height="750" rx="8" fill="#0c1420" stroke="${P.edge}" stroke-width="5"/>`;
  CHART_ORDER.forEach((name, i) => {
    const x = 26 + (i % 2) * 196, y = 22 + Math.floor(i / 2) * 182, s = 1.18;
    b += `<rect x="${x}" y="${y}" width="176" height="166" rx="6" fill="#111c2c" stroke="#22344a" stroke-width="2"/>`;
    const px = (p) => x + 29 + p[0] * s, py = (p) => y + 8 + p[1] * s * .96;
    STARS[name].lines.forEach(([m, n]) => { const A = STARS[name].pts[m], B = STARS[name].pts[n]; b += `<path d="M${px(A).toFixed(1)} ${py(A).toFixed(1)}L${px(B).toFixed(1)} ${py(B).toFixed(1)}" stroke="#5b7fb0" stroke-width="2"/>`; });
    STARS[name].pts.forEach(p => b += star(px(p), py(p), 4.2, true));
    b += GL(name, x + 70, y + 124, 36, '#e8d9a4');
  });
  return b;
})() };

/* the star wheel: the sky on a disc, a cover with a slot across it, hours round the outside */
const AT_HOUR = 8, STEPS = 12, TURNS_TO_MATCH = 5;
const wheelTurning = (() => {
  // drawn as it lies when it matches, then wound back: the turn tool brings it round again
  let g = `<circle cx="260" cy="260" r="212" fill="none" stroke="#8f7a3c" stroke-width="14"/>`;
  for (let i = 0; i < 24; i++) g += `<path d="M260 ${260 - 219}v${i % 2 ? 6 : 12}" stroke="#3a2f12" stroke-width="2" transform="rotate(${i * 15} 260 260)"/>`;
  g += `<path d="M260 ${260 - 232}l-11 17h22z" fill="#e8cf8c" stroke="#3a2f12" stroke-width="2" transform="rotate(${AT_HOUR * 30} 260 260)"/>`;
  skyStars.forEach(s => g += star(260 + s.x, 260 + s.y, 3, s.big, false));
  return `<g transform="rotate(${-TURNS_TO_MATCH * 360 / STEPS} 260 260)">${g}</g>`;
})();
const wheelFig = ART.svg(520, 520, (() => {
  let b = `<circle cx="260" cy="266" r="252" fill="#000" opacity=".35"/><circle cx="260" cy="260" r="252" fill="#1c2836" stroke="${P.dark}" stroke-width="3"/>`;
  for (let h = 1; h <= 12; h++) {
    const a = h * 30 * Math.PI / 180, x = 260 + Math.sin(a) * 240, y = 260 - Math.cos(a) * 240;
    b += W(x, y + 7, String(h), { size: 20, face: 'num', weight: 700, fill: '#c9d6e2' });
  }
  b += `<circle cx="260" cy="260" r="226" fill="#070c18" stroke="${P.dark}" stroke-width="2"/><!--TURN-->`;
  // the cover: everything hidden but a slot across the middle
  const sx = 260 - SLOT.w / 2, sy = 260 - SLOT.h / 2;
  b += `<path fill-rule="evenodd" d="M260 55a205 205 0 1 0 0.01 0ZM${sx + 8} ${sy}h${SLOT.w - 16}a8 8 0 0 1 8 8v${SLOT.h - 16}a8 8 0 0 1 -8 8h-${SLOT.w - 16}a8 8 0 0 1 -8 -8v-${SLOT.h - 16}a8 8 0 0 1 8 -8Z" fill="#39485a" stroke="${P.dark}" stroke-width="3"/>`;
  b += `<path d="M260 55a205 205 0 0 1 0 410" fill="none" stroke="#5f7388" stroke-width="2" opacity=".4" transform="rotate(-90 260 260)"/>`;
  b += `<rect x="${sx}" y="${sy}" width="${SLOT.w}" height="${SLOT.h}" rx="8" fill="none" stroke="#8f7a3c" stroke-width="3"/>`;
  [[260, 110], [260, 410], [150, 150], [370, 150], [150, 370], [370, 370]].forEach(([x, y]) => b += `<circle cx="${x}" cy="${y}" r="5" fill="#27313a" stroke="#5f7388" stroke-width="1.5"/>`);
  b += GL('star', 236, 96, 48, '#5f7388') + GL('moon', 238, 380, 44, '#5f7388');
  return b;
})());

/* ---- the captain's chair: twelve keys under his right hand, and five of them worn bare ---- */
const ARM_KEYS = ['KOAU', 'BETL', 'RNIS'];
const LOG_WORD = 'ORBIT';
const chairArt = { w: 640, h: 400, body: (() => {
  let b = `<path d="M30 80q290 -50 580 0v250q-290 40 -580 0z" fill="#10161f" stroke="${P.dark}" stroke-width="5"/><path d="M30 80q290 -50 580 0" fill="none" stroke="#2c3a4a" stroke-width="6"/>`;
  // what something's grip did to the padding
  [0, 1, 2, 3].forEach(i => b += `<path d="M${70 + i * 30} ${118 + i * 4}q10 80 -6 172" fill="none" stroke="#05080d" stroke-width="9" stroke-linecap="round"/><path d="M${74 + i * 30} ${120 + i * 4}q10 80 -6 168" fill="none" stroke="#3a4a5c" stroke-width="1.5" opacity=".6"/>`);
  b += `<rect x="232" y="100" width="352" height="232" rx="14" fill="#1c2836" stroke="${P.edge}" stroke-width="5"/>`;
  ARM_KEYS.forEach((row, r) => row.split('').forEach((ch, c) => {
    const x = 252 + c * 80, y = 118 + r * 68, worn = LOG_WORD.includes(ch);
    b += `<rect x="${x}" y="${y + 4}" width="68" height="56" rx="8" fill="#05080d"/>`;
    b += worn ? `<rect x="${x}" y="${y}" width="68" height="56" rx="8" fill="#9fb0bd" stroke="#56626e" stroke-width="2"/><ellipse cx="${x + 34}" cy="${y + 26}" rx="24" ry="17" fill="#d5dfe6" opacity=".7"/>`
              : `<rect x="${x}" y="${y}" width="68" height="56" rx="8" fill="#27313a" stroke="#141c26" stroke-width="2"/><rect x="${x + 4}" y="${y + 3}" width="60" height="8" rx="4" fill="#56626e" opacity=".35"/>`;
    b += W(x + 34, y + 40, ch, { size: 34, face: 'label', weight: 700, fill: worn ? '#56626e' : '#c9d6e2', opacity: worn ? .75 : 1 });
  }));
  return b;
})() };
function chairBody() {
  let b = `<ellipse cx="70" cy="222" rx="66" ry="8" fill="#000" opacity=".4"/><rect x="56" y="150" width="28" height="66" fill="#0c121a"/><rect x="24" y="210" width="92" height="12" rx="5" fill="#1a2530"/>`;
  b += `<rect x="6" y="4" width="128" height="150" rx="22" fill="#0c121a" stroke="#1a2530" stroke-width="4"/>`;
  b += `<rect x="96" y="96" width="42" height="34" rx="5" fill="#1c2836" stroke="${P.edge}" stroke-width="2"/>`;
  [0, 1, 2].forEach(r => [0, 1, 2, 3].forEach(c => b += `<rect x="${100 + c * 9}" y="${101 + r * 9}" width="7" height="7" rx="1.5" fill="${LOG_WORD.includes(ARM_KEYS[r][c]) ? '#c9d6e2' : '#3a4856'}"/>`));
  return b;
}

/* ---- consoles along the bank ---- */
function logBody(open) {
  let b = `<rect x="2" y="2" width="116" height="64" rx="6" fill="#0a141c" stroke="#2a4258" stroke-width="4"/><rect class="flick" x="12" y="11" width="96" height="40" fill="#06130c"/>`;
  [0, 1, 2, 3, 4].forEach(i => b += `<rect x="${19 + i * 17}" y="22" width="13" height="18" rx="2" fill="none" stroke="${P.crt}" stroke-width="2" opacity="${open ? .9 : .5}"/>`);
  b += open ? `<rect x="14" y="66" width="92" height="22" rx="3" fill="#141e2a" stroke="${P.edge}" stroke-width="2"/><circle cx="60" cy="77" r="9" fill="#8f7a3c" stroke="#3a2f12" stroke-width="2"/><circle cx="60" cy="77" r="3" fill="#e8cf8c"/>`
            : `<rect x="14" y="66" width="92" height="12" rx="3" fill="#141e2a" stroke="${P.edge}" stroke-width="2"/><rect x="52" y="70" width="16" height="4" rx="2" fill="${P.edge}"/>`;
  return b;
}
const PULSE = ['blue', 'yellow', 'red', 'blue', 'green', 'yellow'];
const KEY_COLOURS = ['red', 'yellow', 'green', 'blue'];
function commsBody(open) {
  let b = `<rect x="2" y="2" width="176" height="90" rx="8" fill="#121c28" stroke="${P.edge}" stroke-width="4"/><rect x="14" y="12" width="152" height="24" rx="4" fill="#06130c"/>`;
  for (let i = 0; i < 12; i++) b += `<rect x="${20 + i * 12}" y="${24 - (open ? [4, 8, 3, 9, 5, 2, 7, 4, 8, 3, 6, 4][i] : 1)}" width="6" height="${(open ? [4, 8, 3, 9, 5, 2, 7, 4, 8, 3, 6, 4][i] : 1) * 2}" fill="${P.crt}" opacity=".8"/>`;
  KEY_COLOURS.forEach((c, i) => b += `<rect x="${18 + i * 38}" y="48" width="30" height="30" rx="6" fill="${C[c]}" stroke="${P.dark}" stroke-width="2.5"/><rect x="${21 + i * 38}" y="51" width="24" height="6" rx="3" fill="#fff" opacity=".3"/>`);
  return b;
}
function navBody(open) {
  let b = `<rect x="2" y="2" width="176" height="90" rx="8" fill="#121c28" stroke="${P.edge}" stroke-width="4"/>`;
  [0, 1, 2, 3].forEach(i => {
    b += `<rect x="${14 + i * 40}" y="16" width="32" height="44" rx="5" fill="#0a141c" stroke="#2a4258" stroke-width="2"/>`;
    b += open ? GL(RINGED[i], 18 + i * 40, 26, 24, '#e8d9a4') : `<path d="M${22 + i * 40} 38h16" stroke="#2a4258" stroke-width="3" stroke-linecap="round"/>`;
  });
  b += `<rect x="14" y="68" width="152" height="12" rx="4" fill="${open ? P.crt : '#1a2530'}" opacity="${open ? .7 : 1}"/>`;
  return b;
}
function chronoBody(open) {
  return `<rect x="26" y="88" width="28" height="18" fill="#141e2a"/><circle cx="40" cy="48" r="38" fill="#8f7a3c" stroke="#3a2f12" stroke-width="4"/>`
    + ART.clockFace(40, 48, 30, open ? AT_HOUR : 12, 0, { face: '#e9dfc3', ink: '#2a1e0c', rim: '#3a2f12' });
}

/* ---- the beacon: dead air, until the dish is on it ---- */
const beaconArt = (live) => {
  let b = `<rect x="14" y="14" width="392" height="392" rx="30" fill="#0c121a" stroke="${P.edge}" stroke-width="7"/>`;
  [150, 118, 86, 54].forEach(r => b += `<circle cx="210" cy="250" r="${r}" fill="none" stroke="#05080d" stroke-width="13"/>`);
  for (let i = 0; i < 9; i++) b += `<path d="M${62 + i * 37} 104V396" stroke="#1a2530" stroke-width="3" opacity=".5"/>`;
  b += `<circle cx="210" cy="76" r="46" fill="#05080d" stroke="#2a3a4a" stroke-width="5"/><circle class="${live ? 'pulse-lamp' : ''}" cx="210" cy="76" r="36" fill="#0b1114"/><path d="M186 60q22 -18 46 -4" fill="none" stroke="#fff" stroke-width="4" opacity=".18" stroke-linecap="round"/>`;
  return b;
};
function beaconBody(live) {
  return `<circle cx="58" cy="62" r="52" fill="#0c121a" stroke="${P.edge}" stroke-width="7"/>` + [36, 24, 12].map(r => `<circle cx="58" cy="62" r="${r}" fill="none" stroke="#060a10" stroke-width="5"/>`).join('')
    + `<circle cx="58" cy="14" r="9" fill="${live ? P.cyan : '#141c26'}" stroke="${P.dark}" stroke-width="2"${live ? ' class="slowblink"' : ''}/>` + (live ? `<circle cx="58" cy="14" r="20" fill="${P.cyan}" opacity=".18"/>` : '');
}

/* ---- engineering's scope, and the rods it is talking about ---- */
const RODS = [['red', 4], ['yellow', 2], ['green', 5], ['blue', 1], ['white', 3]];        // left to right on the pillar
const SPOKES = ['green', 'white', 'red', 'blue', 'yellow'];                             // clockwise from the top of the scope
const ROD_SET = RODS.map(r => r[1]);
const scopeArt = (live) => {
  let b = `<rect x="6" y="6" width="448" height="448" rx="34" fill="#121c28" stroke="${P.edge}" stroke-width="7"/><circle cx="230" cy="230" r="196" fill="#06130c" stroke="${P.dark}" stroke-width="5"/>`;
  if (!live) return b + `<path d="M120 230H340" stroke="${P.crt}" stroke-width="3" opacity=".25"/>`;
  [1, 2, 3, 4, 5].forEach(n => b += `<circle cx="230" cy="230" r="${n * 31}" fill="none" stroke="${P.crt}" stroke-width="2" opacity=".4"/>` + W(230 + n * 31 * .588 + 11, 230 + n * 31 * .809 + 3, String(n), { size: 17, face: 'num', weight: 700, fill: P.crt, opacity: .8 }));
  SPOKES.forEach((col, i) => {
    const a = i * 72 * Math.PI / 180, dx = Math.sin(a), dy = -Math.cos(a), n = RODS.find(r => r[0] === col)[1];
    b += `<path d="M230 230L${(230 + dx * 184).toFixed(1)} ${(230 + dy * 184).toFixed(1)}" stroke="${C[col]}" stroke-width="5" opacity=".8"/>`;
    b += `<circle cx="${(230 + dx * 184).toFixed(1)}" cy="${(230 + dy * 184).toFixed(1)}" r="13" fill="${C[col]}" stroke="${P.dark}" stroke-width="3"/>`;
    const bx = 230 + dx * n * 31, by = 230 + dy * n * 31;
    b += `<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="22" fill="#fff" opacity=".14"/><rect x="${(bx - 10).toFixed(1)}" y="${(by - 10).toFixed(1)}" width="20" height="20" fill="#fdfbe8" stroke="${P.dark}" stroke-width="2" transform="rotate(45 ${bx.toFixed(1)} ${by.toFixed(1)})"/>`;
  });
  return b + `<circle cx="230" cy="230" r="6" fill="${P.crt}"/>`;
};
function scopeBody(live) {
  let b = `<rect x="2" y="2" width="116" height="116" rx="12" fill="#121c28" stroke="${P.edge}" stroke-width="4"/><circle cx="60" cy="60" r="46" fill="#06130c" stroke="${P.dark}" stroke-width="3"/>`;
  if (!live) return b;
  [16, 31, 46].forEach(r => b += `<circle cx="60" cy="60" r="${r}" fill="none" stroke="${P.crt}" stroke-width="1.2" opacity=".4"/>`);
  SPOKES.forEach((col, i) => { const a = i * 72 * Math.PI / 180, n = RODS.find(r => r[0] === col)[1];
    b += `<path d="M60 60L${(60 + Math.sin(a) * 44).toFixed(1)} ${(60 - Math.cos(a) * 44).toFixed(1)}" stroke="${C[col]}" stroke-width="2.5"/><circle cx="${(60 + Math.sin(a) * n * 8.6).toFixed(1)}" cy="${(60 - Math.cos(a) * n * 8.6).toFixed(1)}" r="3.6" fill="#fdfbe8"/>`; });
  return b;
}
function reactorBody(st) {
  let b = `<rect x="2" y="26" width="116" height="332" rx="14" fill="#141e2a" stroke="${P.edge}" stroke-width="6"/><circle cx="60" cy="12" r="9" fill="${st.solved ? '#5fd08a' : st.live ? P.amber : P.warn}"${st.solved ? '' : ' class="slowblink"'}/>`;
  RODS.forEach(([col, n], i) => {
    const x = 14 + i * 19.5, up = st.solved ? n : 0;
    b += `<rect x="${x}" y="52" width="14" height="250" rx="4" fill="#06080a" stroke="#2a3a4a" stroke-width="1.5"/>`;
    b += `<rect x="${x + 2}" y="${298 - 46 - up * 40}" width="10" height="${46 + up * 40}" rx="3" fill="${C[col]}" opacity="${st.solved ? 1 : .55}"/>`;
  });
  b += `<rect x="14" y="316" width="92" height="26" rx="5" fill="#0a141c" stroke="#2a4258" stroke-width="2"/>`;
  return b;
}

const POS2 = {
  viewport:  { x: 15.6,  y: 14.4, w: 68.75, h: 23.2 },
  starchart: { x: 89.9,  y: 11,   w: 8.4,   h: 26.3 },
  beacon:    { x: 3.6,   y: 16,   w: 7.3,   h: 13.6 },
  log:       { x: 18.75, y: 67.4, w: 7.5,   h: 10 },
  comms:     { x: 28.7,  y: 67.2, w: 11.25, h: 10.5 },
  chair:     { x: 45.8,  y: 50.4, w: 8.9,   h: 25.2 },
  chrono:    { x: 56.5,  y: 66.2, w: 5,     h: 12 },
  nav:       { x: 62.9,  y: 67.2, w: 11.25, h: 10.5 },
  scope:     { x: 75.8,  y: 65.8, w: 7.5,   h: 13.4 },
  reactor:   { x: 90,    y: 40.6, w: 7.5,   h: 40 },
};

const ROOM2 = {
  id:'bridge', name:'Room 2 — The Bridge', scene:'bridge',
  stageFx:'drift',
  relays:[{el:'rl-bridge',mode:'pulse',period:2.4}],
  wrongSound:'ping',
  wrongVfx:'sparks',
  intro:"The bridge is forty years of dust and one turned chair. The viewport is full of the wrong stars.",
  objective:"The ship has been listening to something for decades. Put the dish back on it — then <b>listen</b> yourself.",
  entryBeat:"The captain's chair faces the viewport. The dust on the armrests is disturbed — four long furrows on each side, as if something sat here recently. And gripped.",
  entrySound:'clank',
  completeText:"The reactor takes the setting and channels power aft. A service map blinks: ESCAPE POD — VIA HYDROPONICS. The green deck. The one the crew sealed first.",
  chain:`Five of the twelve keys on the captain's armrest are worn to bare metal, and the five letters make one word: ${LOG_WORD}, which opens his log → on the glass of the viewport he ringed four star figures in grease pencil and numbered them; the star chart names each figure with a picture, so the helm takes ${RINGED.join(', ')} → with the dish on that heading the beacon comes through as a run of coloured pulses, sent back on the comms keys: ${PULSE.join(', ')} → the star wheel from the log's drawer is turned until its slot shows the sky exactly as the viewport does, and its pointer then stands at ${AT_HOUR}, so the chronometer is set to ${AT_HOUR}:00 → engineering's scope, awake once the beacon is answered, shows each coloured rod as a blip on one of five rings, and the rods are drawn to match: ${ROD_SET.join(', ')}.`,
  objects:[
    { id:'chair', icon:'💺', name:"Captain's Chair", pos:POS2.chair,
      desc:"Turned to the stars. There is a block of keys under where his right hand lay, and forty years of the same habit on them.",
      figure:ART.svg(chairArt.w, chairArt.h, chairArt.body),
      sprite:ART.sprite(POS2.chair, 142, 226, chairBody()) },
    { id:'log', icon:'📓', name:"Captain's Log", pos:POS2.log,
      desc:"His station, and the drawer under it. The log wants a word of five letters before it will show anybody anything.",
      sprite:st=>ART.sprite(POS2.log, 120, 90, logBody(st.solved)),
      puzzle:{ type:'combo', from:['chair'], skin:'plate',
        wheels:5, faces:ARM_KEYS.join('').split('').sort().join(''), answer:LOG_WORD, tryLabel:'OPEN THE LOG',
        hints:[
          "Five letters, typed every watch for forty years by the same hand. A hand like that leaves a mark on what it touches.",
          "On the armrest of the captain's chair, five keys are worn to bare metal. Those are the five letters; they make one word, and you know what kind of ship this is.",
          "The bare keys are B, I, O, R and T, and there is only one word in them: O, R, B, I, T."
        ],
        solvedText:"The log opens on its last entry, which is not words. And the drawer under the station unlatches: a brass star wheel, the kind a navigator keeps for when the computers are wrong.",
        inside:{ name:"From the captain's drawer", figure:wheelFig, tool:{ type:'turn', steps:STEPS, cx:260, cy:260, overlay:wheelTurning } } } },
    { id:'viewport', icon:'🌌', name:'The Viewport', pos:POS2.viewport, ringAt:[50, 112],
      desc:"Somebody stood here with a grease pencil and marked the glass, as if they did not trust the instruments to remember.",
      figure:ART.svg(viewArt.w, viewArt.h, viewArt.body),
      sprite:ART.sprite(POS2.viewport, viewArt.w, viewArt.h, viewArt.body) },
    { id:'starchart', icon:'🗺️', name:'Star Chart', pos:POS2.starchart,
      desc:"Eight figures somebody once saw in these stars, each with its lines drawn in and its name given as a picture.",
      figure:ART.svg(chartArt.w, chartArt.h, chartArt.body),
      sprite:ART.sprite(POS2.starchart, chartArt.w, chartArt.h, chartArt.body) },
    { id:'nav', icon:'🧭', name:'Helm', pos:POS2.nav,
      desc:"The dish follows the helm. Four windows, a picture in each, numbered one to four.",
      sprite:st=>ART.sprite(POS2.nav, 180, 94, navBody(st.solved)),
      puzzle:{ type:'combo', from:['viewport','starchart'], skin:'plate',
        wheels:[1,2,3,4].map(n=>({ mark:{ text:String(n) } })), faces:{ glyphs:Object.keys(STARS).sort() }, answer:RINGED, tryLabel:'SET THE HEADING',
        hints:[
          "Four windows numbered one to four — and four rings on the glass of the viewport, numbered the same way in grease pencil.",
          "The rings are round groups of stars with no lines between them. The star chart draws the lines in, and gives every figure a picture for a name. The group nobody ringed is not wanted.",
          `One to four: ${RINGED.join(', ')}.`
        ],
        solvedText:"Somewhere on the hull forty years of seized bearings let go, and the dish comes round. The static on the bridge speaker changes.",
        solveBeat:"For a moment, between pulses, the channel carries something else: a slow scrape, close to the microphone. It is coming from inside the ship.",
        beatSound:'hiss' } },
    { id:'beacon', icon:'📡', name:'Bridge Speaker', pos:POS2.beacon, needs:'nav',
      desc:"The beacon the ship has been holding station on, coming through at last: the same run of pulses, over and over.",
      deadDesc:"Static, flat and even. Whatever the dish is pointed at, it is not pointed at anything that is talking.",
      figure:ART.svg(420, 420, beaconArt(true)), deadFigure:ART.svg(420, 420, beaconArt(false)),
      tool:{ type:'pulse', seq:PULSE },
      sprite:st=>ART.sprite(POS2.beacon, 116, 122, beaconBody(st.live)) },
    { id:'comms', icon:'🎛️', name:'Comms Panel', pos:POS2.comms,
      desc:"A transmit key for each of four tones, each under its own coloured cap.",
      sprite:st=>ART.sprite(POS2.comms, 180, 94, commsBody(st.solved)),
      puzzle:{ type:'press', from:['beacon'], repeat:true, slots:PULSE.length, answer:PULSE,
        keys:{ colors:KEY_COLOURS },
        miss:"The panel sends it. Nothing comes back but the same pulses as before.",
        hints:[
          "Four coloured keys and six places to fill. Something on this bridge is showing colours, once the dish is pointed the right way.",
          "The lamp on the bridge speaker runs through six colours and then rests before it starts again. Wait for the rest, then send the same six back in the same order.",
          `${PULSE.map((c, i) => i ? c : c[0].toUpperCase() + c.slice(1)).join(', ')}.`
        ],
        solvedText:"The pulses stop. One long tone answers, and all down the engineering side of the bridge dead screens begin to come up." } },
    { id:'chrono', icon:'🕰️', name:"Ship's Chronometer", pos:POS2.chrono,
      desc:"Stopped at the moment the bridge was abandoned. Nothing aft of here will take an order until the ship knows what time it is.",
      sprite:st=>ART.sprite(POS2.chrono, 80, 108, chronoBody(st.solved)),
      puzzle:{ type:'clock', from:['log','viewport'], start:{h:12,m:0}, answer:`${AT_HOUR}:00`, tryLabel:'START IT',
        hints:[
          "A clock that has lost the time, on a ship that still has the stars. The captain kept something in his drawer for exactly this.",
          "Turn the star wheel until its slot shows the sky as the viewport shows it — the same figures, the same way up, in the same order. Then read where the pointer on its rim has come to.",
          `With the wheel matched, the pointer stands at ${AT_HOUR}. Set the chronometer to ${AT_HOUR}:00.`
        ],
        solvedText:"It ticks. One by one, down the consoles, forty years of blinking zeroes become the time." } },
    { id:'scope', icon:'🟢', name:'Core Scope', pos:POS2.scope, needs:'comms',
      desc:"Engineering's picture of the core: five rods, five colours, each one a bright mark somewhere along its own line.",
      deadDesc:"Engineering's scope. One flat line across the glass, and nothing behind it.",
      figure:ART.svg(460, 460, scopeArt(true)), deadFigure:ART.svg(460, 460, scopeArt(false)),
      sprite:st=>ART.sprite(POS2.scope, 120, 120, scopeBody(st.live)) },
    { id:'reactor', icon:'☢️', name:'Reactor Pillar', pos:POS2.reactor, needs:'chrono',
      desc:"Five control rods under five coloured caps, all of them driven home. Each can be drawn out as far as the fifth mark.",
      deadDesc:"Five control rods, all driven home. The board is lit but takes no orders: its clock reads forty years of nothing.",
      sprite:st=>ART.sprite(POS2.reactor, 120, 360, reactorBody(st)),
      puzzle:{ type:'levels', from:['scope'], cols:RODS.map(r=>({ mark:{ color:r[0] } })), max:5, answer:ROD_SET, tryLabel:'ENGAGE',
        hints:[
          "Five rods, five colours, and five marks up each one. Engineering's scope has the same five colours on it, once the beacon has been answered.",
          "On the scope each coloured line carries one bright mark, and the rings are numbered out from the middle. The ring a mark sits on is how far that colour's rod is drawn.",
          `Red, yellow, green, blue, white: ${ROD_SET.join(', ')}.`
        ],
        solvedText:"The rods settle with a sound like a held breath let go, and the deck plates begin, very faintly, to hum.",
        solveBeat:"Under the hum there is another sound, in the wall behind the pillar. Something moving away from the heat. Quickly.",
        beatSound:'clank' } },
  ]
};

const OLD_ROOMS = [
/* ============ ROOM 3 — HYDROPONICS ============ */
{
  id:'hydro', name:'Room 3 — Hydroponics', scene:'hydro',
  stageFx:'drift',
  relays:[{el:'rl-hydro',mode:'pulse',period:4.4}],
  wrongSound:'hiss',
  relay:{el:'airlock-lamp',seq:'... ..... .... ..... .... .. .. .. . .....',after:'pumps'},
  intro:"The grow lights still burn. The plants have not stopped growing in forty years. Neither has anything else down here.",
  objective:"Cross the green deck to the aft airlock. The vent covers down here are <b>off</b>.",
  entryBeat:"The weld on the entry hatch was cut from the inside of the deck — the metal is peeled outward in four long strips, evenly spaced. You all look at the spacing. Nobody says what it looks like.",
  entrySound:'growl',
  completeText:"The aft airlock cycles you through toward the pod bay. Behind you, in the green, the drip-lines swing gently where nothing has touched them.",
  chain:"Overgrown row riddle = VENT → specimen trays: keep only PRIME seed counts; survivors spell STARVE → nutrient pump priming sequence (6, −2 each) = 642 → the aft airlock knocks the same tap code = PURGE.",
  objects:[
    { id:'grate', icon:'🕳️', name:'Torn Vent', pos:{x:55,y:2,w:12,h:13},
      desc:"The vent cover above the planters hangs by one bolt, bent double. Torn outward.\n\nInside the shaft, the dust shows a track — smooth, continuous, wider than a person. It has been used often. It is being used still." },
    { id:'vines', icon:'🌿', name:'The Overgrown Row', pos:{x:6,y:36,w:18,h:34},
      desc:"The first planter row has gone feral, roots cracking the deck plates. A waterproof tag hangs from a stake, written in the botanist's hand — a riddle, because she never labeled anything plainly in her life:\n\n“I breathe for the ship.\nI whisper when I am empty\nand knock when I am full.\nEvery deck feeds me. What am I?”",
      puzzle:{
        prompt:"What is the botanist pointing you at?", placeholder:"ANSWER", answers:['VENT','VENTS','THEVENTS','AVENT'],
        hints:[
          "It's part of the ship — every deck has one, and you've been hearing yours all day.",
          "It carries the air. It whispers when empty. Lately, it knocks.",
          "The answer is VENT. The beacon told you to seal them. The botanist wants you to look inside one."
        ],
        solvedText:"VENT. Wedged inside the torn vent's mouth, where nothing sane would reach: the botanist's specimen keys, and a scrawl — “it won't touch the trays. Count what grew.”"
      }
    },
    { id:'trays', onSolve:{el:'rx-hydro',op:.2,fx:'surge'}, icon:'🧪', name:'Specimen Trays', pos:{x:32,y:68,w:56,h:12}, hiddenUntil:'vines',
      desc:"Nine specimen trays under the grow lights, each stamped with a letter and a live seed count. Left to right:\n\nHarvest only the trays whose count is a prime number.",
      puzzle:{
        type:'select',
        select:{commit:"\ud83c\udf31 HARVEST THESE", wrong:"The rack rejects the harvest.",
          items:[{letter:"S",value:"7 seeds"},{letter:"B",value:"4 seeds"},{letter:"T",value:"5 seeds"},{letter:"A",value:"3 seeds"},{letter:"I",value:"8 seeds"},{letter:"R",value:"2 seeds"},{letter:"V",value:"11 seeds"},{letter:"O",value:"9 seeds"},{letter:"E",value:"13 seeds"}]},
        prompt:"Which trays get harvested? Tap the ones worth taking.", answers:['STARVE'],
        hints:[
          "A prime is divisible only by 1 and itself. Check each tray's count; split the nine among the crew.",
          "Drop 4 (2×2), 8 (2×4) and 9 (3×3). Keep 7, 5, 3, 2, 11, 13 and read those letters left to right.",
          "S(7) T(5) A(3) R(2) V(11) E(13) are prime; B(4) I(8) O(9) are not — the harvest spells STARVE."
        ],
        solvedText:"S-T-A-R-V-E. Nobody reads it aloud. The harvested trays hide a maintenance fob for the nutrient pumps — and a thought none of you wants: forty years is a long time for anything to go hungry.",
        solveBeat:"Along the far planter row, one after another, the plants shiver — something passing beneath them, unhurried, the full length of the room.",
        beatSound:'growl'
      }
    },
    { id:'pumps', icon:'⚙️', name:'Nutrient Pumps', pos:{x:4,y:68,w:13,h:20},
      desc:"The pump manifold is padlocked with a 3-digit dial, one digit per pump down the line. The priming instructions are stencilled across the intake, where a maintenance hand would read them:\n\n   PRIMING SEQUENCE —\n   Pump one draws half a dozen litres a stroke.\n   Every pump down the line draws two litres less than the one before it.\n   Dial the three stroke-counts in line order.",
      puzzle:{
        type:'keypad',
        prompt:"Work out each pump's litres-per-stroke and type the three numbers in order.", answers:['642'],
        hints:[
          "Three pumps in a line, and the first one's figure is written out in words rather than digits. Start there.",
          "Half a dozen is six, and each pump after it draws two less: six, then four, then…",
          "6, 4, 2 — enter 642."
        ],
        solvedText:"6-4-2. The pumps shudder to life and flood the rows — and down at the far end the aft airlock's speaker wakes, knocking a pattern into the mist. Not a fault alarm. A count."
      }
    },
    { id:'airlock', icon:'🚪', name:'Aft Airlock', pos:{x:82,y:20,w:15,h:48}, hiddenUntil:'pumps',
      desc:"From the aft airlock's speaker grille, the knocking again — five pairs this time, patient, repeating, urgent as a heartbeat. The same code as the beacon loop. The keypad below waits for five letters.",
      puzzle:{
        prompt:"Enter the 5-letter word the panel is flashing.", placeholder:"5 LETTERS", answers:['PURGE'],
        taps:'35 45 42 22 15', morseLocked:'pumps',
        hints:[
          "Pairs of knocks — the same 5×5 tap code as the beacon loop. First count is the row, second the column.",
          "3·5 is row 3, column 5: P. The last pair, 1·5, is E. It's an instruction — something this deck can do.",
          "3·5 P, 4·5 U, 4·2 R, 2·2 G, 1·5 E — enter PURGE. So purge it."
        ],
        solvedText:"P-U-R-G-E. You slam the deck purge. Fans scream; the green mist rips backward into the recyclers — and something big and unseen crashes through the planter rows AWAY from the airlock as it cycles you through.",
        solveBeat:"Through the closing inner door you hear it hit the far bulkhead and go still. Not hurt. Waiting for the fans to stop.",
        beatSound:'clank'
      }
    }
  ]
},
/* ============ ROOM 4 — THE ESCAPE POD BAY ============ */
{
  id:'podbay', name:'Room 4 — The Escape Pod Bay', scene:'podbay',
  stageFx:'drift',
  relays:[{el:'rl-podbay',mode:'pulse',period:2.2}],
  wrongSound:'clank',
  wrongVfx:'shake',
  intro:"One pod left. The crew never reached it. You will.",
  objective:"Prep, fuel, and launch — the beacon window won't wait. <b>Neither will the thing in the vents.</b>",
  entryBeat:"The pod bay's dust is untouched except for one path — a wide, smooth track circling the pod itself. Around and around. Years of it. Something has been guarding your way out, or coveting it.",
  entrySound:'hiss',
  completeText:"Clamps clear, fuel green, the bay doors standing open on the dark. The pod is ready to go the moment somebody says so.",
  chain:"Five launch tags, each carrying its own reason: the hatch is sealed before anything loads, priming throws sparks so the cells come before the oxygen, the guidance ring is trued only once she is loaded, and the clamps are last — EBDAC → the fuelling protocol lists line pressures by pod type and the cradle is stencilled TYPE C: 9430 → the launch table rules out the 2:40 pass (needs 11 units of 9) and the 8:45 (after the reactor dies at 7:00), leaving 5:20 less 45 minutes of ignition = 4:35 → the clamps carry their own release sequence, cryo-water-power-reactor, read off the digits stencilled on each housing: 2496 → the board is set the way the drill leaves her: guidance LOCKED, fuel at PRESSURE, clamps to RELEASE.",
  objects:[
    { id:'scratches', icon:'🪟', name:'Viewport Scratches', pos:{x:8,y:14,w:14,h:20},
      desc:"A small viewport, the beacon's star pulsing coldly in the corner. The inside of the glass — the inside — carries three long scratches, wiped clean of dust.\n\nBeyond them, the last stars you'll ever see from this ship. If you're quick." },
    { id:'checklist', icon:'📋', name:'Launch Drill', pos:{x:13,y:52,w:9,h:20},
      desc:"The pod's launch drill, five steps, each on its own numbered tag — and the tags have been torn off their ring and scattered. The flight officer wrote them the way flight officers do: every instruction carrying the reason it exists.\n\n   TAG A — “Align the guidance ring. Not until she is loaded: her mass moves where she points, and a ring trued on an empty pod is a ring trued for nothing.”\n\n   TAG B — “Prime the fuel cells. Priming throws sparks, so get it done before there is oxygen aboard.”\n\n   TAG C — “Release the docking clamps. They are the last thing between you and the dark.”\n\n   TAG D — “Load the oxygen.”\n\n   TAG E — “Seal the hatch first, before anything at all goes aboard. The bay will not hold pressure; everything after this loads through the transfer port.”",
      puzzle:{
        type:'order', order:{labels:{"A": "Align the guidance ring", "B": "Prime the fuel cells", "C": "Release the docking clamps", "D": "Load the oxygen", "E": "Seal the hatch"}},
        prompt:"Enter the five tag letters in launch order.", placeholder:"FIVE LETTERS", answers:['EBDAC'],
        hints:[
          "Every tag says why. Two of them name their own position outright — one is explicitly first, one is explicitly last.",
          "The hatch is sealed first (E) and the clamps are released last (C). In between: sparks before oxygen, so cells before loading.",
          "Hatch, cells, oxygen, then the ring once she is loaded, then the clamps: enter EBDAC."
        ],
        solvedText:"Hatch, cells, oxygen, ring, clamps. The drill checks out and the pod's boards go green one by one, like a small constellation coming home.",
        solveBeat:"From inside the bay's walls — all four at once — comes a single coordinated shudder. It knows the boards went green too.",
        beatSound:'clank'
      }
    },
    { id:'fuelpanel', onSolve:{el:'rx-podbay',op:.2,fx:'surge'}, icon:'⛽', name:'Fuel Lock', pos:{x:25,y:40,w:11,h:14},
      desc:"The fuel line is locked behind a 4-digit panel, and the fuelling protocol is riveted to the gantry beside it:\n\n   LINE PRESSURES BY POD TYPE — SET IN LINE ORDER\n     TYPE A ....... 6 1 2 0\n     TYPE B ....... 7 7 1 5\n     TYPE C ....... 9 4 3 0\n     TYPE D ....... 8 2 2 4\n\nWhich type you are fuelling is stencilled on the cradle, not the pod — the pods were interchangeable and the cradles were not.\n\nYour cradle is stencilled, in paint a foot high: TYPE C. The five empty cradles down the bay read A, A, B, D and C.",
      puzzle:{
        type:'keypad',
        prompt:"Enter the 4-digit code.", answers:['9430'],
        hints:[
          "This is a lookup, not a calculation. Find which row of the protocol applies to the pod you are actually standing next to.",
          "The type is stencilled on the cradle rather than the pod. Yours reads TYPE C.",
          "Type C is 9 4 3 0. Enter 9430."
        ],
        solvedText:"9-4-3-0. Fuel hisses into the cells, and a launch-window table lights up on the gantry screen."
      }
    },
    { id:'window', icon:'🛰️', name:'Launch Window Table', pos:{x:72,y:22,w:16,h:20},
      desc:"The gantry screen scrolls the beacon's orbital passes:\n\n“PASS 1 — 2:40 · burn required 11 units\nPASS 2 — 5:20 · burn required 8 units\nPASS 3 — 8:45 · burn required 7 units\n\nFUEL ABOARD: 9 UNITS.\nREACTOR SUSTAINS BAY POWER UNTIL 7:00 — NO LAUNCH AFTER.\nBEGIN IGNITION 45 MINUTES BEFORE YOUR PASS.”",
      puzzle:{
        prompt:"Set ignition time (hour then minutes, e.g. 730).", placeholder:"H:MM", answers:['435','0435'],
        hints:[
          "Two filters: the fuel you actually have, and when the reactor dies.",
          "2:40 needs 11 units — you have 9. 8:45 is after the reactor dies at 7:00. That leaves 5:20 — now count back 45 minutes.",
          "5:20 minus 0:45 is 4:35. Enter 435."
        ],
        solvedText:"4:35. The ignition timer arms. The pod hums like something alive — the good kind of alive, for once."
      }
    },
    { id:'clamps', icon:'🗜️', name:'Docking Clamps', pos:{x:72,y:56,w:16,h:22}, hiddenUntil:'window',
      desc:"Four heavy clamps pin the pod to its cradle, each released by its own glyph tumbler. The glyphs are the ship's system marks and each one is stencilled with its digit right there on the clamp housing:\n\n   ⚡ 9        ❄ 2        ☢ 6        💧 4\n\nBolted above them, the release plate — the bay's own procedure, which is not the same as the shutdown order and was never meant to be:\n\n   CLAMP RELEASE SEQUENCE\n     1. CRYO      2. WATER      3. POWER      4. REACTOR",
      puzzle:{
        type:'keypad',
        prompt:"Enter the 4-digit release code.", answers:['2496'],
        hints:[
          "Everything you need is on the clamps themselves: the four digits, and the order the release plate puts them in.",
          "Release runs cryo, water, power, reactor. Read each one's digit off its housing.",
          "❄ is 2, 💧 is 4, ⚡ is 9, ☢ is 6. Enter 2496."
        ],
        solvedText:"2-4-9-6. The clamps release with four echoing CLACKS, and the pod settles a half-inch onto its own weight for the first time in forty years. Only the ignition board remains.",
        solveBeat:"The vent above the bay door bows outward and holds — bent metal creaking under a patient, constant weight. It is done hiding. It is simply too late.",
        beatSound:'growl'
      }
    },
    { id:'thrusters', icon:'🚀', name:'Launch Configuration', pos:{x:42,y:86,w:16,h:10}, hiddenUntil:'clamps',
      desc:"The pod's launch board: three banks, each with a setting, and a single commit lever under a wire guard. The flight officer's drill card is still clipped above it, and the four tags you have already read say the rest.\n\nGUIDANCE — stowed for dock, ALIGNED for a powered burn, LOCKED only once the ring has been trued.\n\nFUEL — the cells were primed in the drill. A primed cell is held at PRESSURE until the moment of burn.\n\nCLAMPS — the hatch is sealed and the drill ends on the clamps. They go to RELEASE.\n\nGet the board right and the pod flies. Get it wrong and you have announced yourself to the dark and gone nowhere.",
      puzzle:{
        type:'panel',
        panel:{
          commit:'🚀 COMMIT THE BOARD',
          wrong:'The board rejects the configuration. Nothing fires. (+0:05 penalty)',
          controls:[
            {id:'guidance', icon:'🎯', label:'Guidance ring', options:['STOWED','ALIGNED','LOCKED']},
            {id:'fuel',     icon:'⛽', label:'Fuel cells',    options:['VENTED','PRESSURE','DUMPED']},
            {id:'clamps',   icon:'🔩', label:'Docking clamps',options:['HOLD','RELEASE','WELD']},
          ],
        },
        prompt:"Set all three banks the way the drill leaves them, then commit.",
        answers:['LOCKED|PRESSURE|RELEASE'],
        hints:[
          "Every setting is named in the board's own text. Read it as a checklist, not as prose.",
          "The ring has been trued, the cells were primed and are held, and the drill ends on the clamps.",
          "GUIDANCE → LOCKED. FUEL → PRESSURE. CLAMPS → RELEASE."
        ],
        solvedText:"",
        solveBeat:"The clamps let go with a sound like a held breath, and for one second the pod is simply falling.",
        beatSound:'clank'
      }
    }
  ]
}
];
const ROOMS = [ROOM1, ROOM2, ...OLD_ROOMS];

registerScenario({
  id:'prospero', classic:true,
  title:'Derelict: The Prospero',
  sub:'deep space · forty years off course · something in the vents',
  tagline:'Wake from cryo on a dead ship, find out what emptied it, and reach the last escape pod.',
  icon:'🚀',
  card:`<svg viewBox="0 0 300 130" preserveAspectRatio="xMidYMid slice">
    <rect width="300" height="130" fill="#05070d"/>
    ${Array.from({length:26},(_,i)=>`<circle class="tw" cx="${(i*37+10)%300}" cy="${(i*17)%120+5}" r="${.6+(i%3)*.5}" fill="#dfe8ff" style="animation-delay:${(i*.5)%4}s"/>`).join('')}
    <g class="drift"><path d="M60 70 q20 -26 90 -28 l80 4 q26 10 22 22 q-4 12 -30 14 l-110 4 q-44 -2 -52 -16z" fill="#131c28" stroke="#26313e" stroke-width="2"/>
    <circle class="slowblink" cx="220" cy="64" r="3.5" fill="#c94a3d"/>
    <circle class="slowblink" cx="96" cy="60" r="3" fill="#7fd4ff" style="animation-delay:1s"/></g>
  </svg>`,
  titleFx:'stars', titleLightning:false,
  titleArt:`<svg viewBox="0 0 560 200">
    ${Array.from({length:40},(_,i)=>`<circle class="tw" cx="${(i*53+12)%560}" cy="${(i*23)%190+5}" r="${.6+(i%3)*.6}" fill="#dfe8ff" style="animation-delay:${(i*.4)%4}s"/>`).join('')}
    <g class="drift">
      <path d="M110 110 q30 -44 160 -48 l150 8 q46 16 38 38 q-8 20 -54 24 l-200 6 q-78 -4 -94 -28z" fill="#111a26" stroke="#26313e" stroke-width="3"/>
      <rect x="196" y="52" width="90" height="26" rx="12" fill="#0c141e"/>
      ${[0,1,2,3,4].map(i=>`<circle class="slowblink" cx="${160+i*64}" cy="112" r="4" fill="${i%2?'#7fd4ff':'#c94a3d'}" style="animation-delay:${i*.6}s"/>`).join('')}
      <path d="M418 116 l70 6 -70 10z" fill="#0c141e"/>
    </g>
  </svg>`,
  story:[
    "The cryo pod spits you out forty years late. The <em>Prospero</em> should be in orbit around a bright new colony; instead she hangs dead in nowhere, holding station against a beacon that stopped broadcasting decades ago.",
    "The crew is gone. Not dead — gone. Their pods are empty, their tools are missing, and every vent cover on the lower decks has been removed. From the inside.",
    "One escape pod remains, aft, past the decks the crew welded shut. Wake the ship, learn what it's been listening to, and get off the Prospero. And when the vents knock — do not knock back."
  ],
  begin:'🚀 BEGIN — 45:00', finalButton:'LAUNCH THE POD 🚀',
  emojis:['🚀','🛰️','👾','🪐','☄️','🤖','🔧','🧊','⭐','🛸','📡','💀'],
  ratings:['🏆 Flight Commander','🚀 Able Astronaut','🔧 Deck Tech','🛟 Barely Made Orbit','🌌 Rescued From the Dark'],
  shareTitle:'ESCAPED THE PROSPERO!',
  victoryTitle:'🚀 THE POD IS AWAY',
  victoryProse:`Three short. Three long. Three short. The thrusters hammer the old code into the dark and the pod rips free of the cradle, through the bay doors, out into clean starlight.<br><br>
    In the last camera frame of the Prospero, the bay you launched from stands open to space — and in its mouth, silhouetted against the working lights, something long and patient watches you go. It does not reach after you. It has the ship. It has time.<br><br>
    The beacon's star swells ahead. You don't look at the aft camera again.`,
  gameOverProse:`The reactor's hum stutters and dies somewhere far below. The emergency lights drop to red.<br><br>In the new silence, the vents begin — unhurried, deliberate — to open.`,
  flare:{x:810,y:800,hue:[120,190,255]},
  ambience:[
    {hum:.05, drone:.03, wind:.018},
    {hum:.04, drone:.045, wind:.02},
    {hum:.028, drone:.05, rustle:.07, wind:.03},
    {hum:.05, drone:.07, wind:.04}
  ],
  fx:['mist','ash','spores','ash'],
  events:[
    [{s:'hiss',p:.5},{s:'clank',p:.22,v:'shake'}],
    [{s:'ping',p:.5,v:'sparks'},{s:'crackle',p:.3,v:'sparks'}],
    [{s:'drip',p:.55},{s:'hiss',p:.25}],
    [{s:'clank',p:.4,v:'shake'},{s:'hiss',p:.3}]
  ],
  // shown free of charge when a team has gone quiet for a while
  nudges:[
    "A pod light cycles. In its glow, {it} looks like it is still waiting on you.",
    "The console chirps once, unprompted. {it} has more to say.",
    "Somewhere a pump kicks in. The sound draws your attention to {it}.",
    "Bay pressure ticks down a notch. {it} is the thing you have not finished."
  ],
  // Three times a game something happens TO the team rather than around
  // them: the lights fail, something crosses the room, and a clue they had
  // already settled turns up disturbed.
  intrusions:{
    squeeze:'The lights die one bank at a time, all the way down the corridor. When they come back, the far end stays dark.',
    arrival:'Something goes past the viewport on the outside of the hull. It does not hurry.',
    midroom:'A panel you have already cracked flickers and resets itself. Nobody is standing near it.'
  },
  // One wording for every lock in this fiction: a salt-seized crate and a
  // frozen hut safe do not fail the same way.
  padMiss:'The bolt stays shut. Somewhere down the corridor, something answers it.', padHow:'Key in the code. The pad beeps once for a bad entry, and that costs 5 seconds.',
  wrongBeats:WRONG_BEATS, wrongSounds:WRONG_SOUNDS,
  scenes:SCENES, rooms:ROOMS
});
})();
