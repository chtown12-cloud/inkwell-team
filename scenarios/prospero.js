/* ============================================================
   SCENARIO: DERELICT — THE PROSPERO (haunted space ship)
   Wake from cryo forty years off course. The crew is gone.
   Something lives in the vents. Reach the escape pod.
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
<!-- cryo pods: six, one open -->
<g id="art-pods">
${[0,1,2,3,4,5].map(i=>{
  const x=120+i*172, open=i===3;
  return `<g>
   <rect x="${x}" y="330" width="132" height="290" rx="34" fill="url(#pPod)" stroke="#31465c" stroke-width="5"/>
   ${open
     ?`<rect x="${x+14}" y="356" width="104" height="180" rx="22" fill="#05080d"/>
       <ellipse class="flick" cx="${x+66}" cy="560" rx="70" ry="16" fill="url(#pGlow)"/>`
     :`<rect x="${x+14}" y="356" width="104" height="180" rx="22" fill="#0d1622"/>
       <circle class="slowblink" cx="${x+66}" cy="600" r="6" fill="#7fd4ff"/>
       <path d="M${x+24} 380 q40 26 84 120" stroke="#2a4258" stroke-width="8" fill="none" opacity=".6"/>`}
   <rect x="${x+30}" y="600" width="72" height="10" rx="4" fill="#26313e"/>
   <text x="${x+66}" y="348" text-anchor="middle" font-family="Special Elite" font-size="13" fill="#7f97ab">POD ${i+1}</text>
  </g>`;}).join('')}
</g>
<!-- cryo vapor bleeding out of the open pod -->
<ellipse class="steam" cx="620" cy="560" rx="26" ry="11" fill="#7fd4ff" opacity=".18"/>
<ellipse class="steam" cx="652" cy="540" rx="18" ry="8" fill="#7fd4ff" opacity=".14" style="animation-delay:1.7s"/>
<ellipse class="steam" cx="596" cy="520" rx="14" ry="7" fill="#c8ecff" opacity=".12" style="animation-delay:3.1s"/>
<!-- maintenance locker -->
<g id="art-locker">
  <rect x="1300" y="380" width="120" height="250" rx="8" fill="#1c2836" stroke="#31465c" stroke-width="5"/>
  <line x1="1360" y1="380" x2="1360" y2="630" stroke="#31465c" stroke-width="4"/>
  <circle cx="1348" cy="505" r="7" fill="#0a0e14" stroke="#5a7a94" stroke-width="3"/>
  <text x="1360" y="368" text-anchor="middle" font-size="20" fill="#5a7a94">⚡9 ❄2 ☢6 💧4</text>
</g>
<!-- med terminal -->
<g id="art-terminal">
  <rect x="920" y="420" width="150" height="110" rx="8" fill="#0a141c" stroke="#2a4258" stroke-width="5"/>
  <rect class="flick" x="934" y="434" width="122" height="66" rx="4" fill="#06130c"/>
  ${[0,1,2].map(i=>`<line class="flick" x1="944" y1="${450+i*16}" x2="${1010+i*12}" y2="${450+i*16}" stroke="#3fd68c" stroke-width="3"/>`).join('')}
  <rect x="960" y="530" width="70" height="70" fill="#141e2a"/>
</g>
<!-- evac placard -->
<g id="art-placard">
  <rect x="1450" y="330" width="98" height="128" rx="4" fill="#c2cad2" transform="rotate(2 1499 394)"/>
  <text x="1499" y="356" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#7a2a1a">EVACUATION</text>
  ${[0,1,2,3].map(i=>`<line x1="1462" y1="${372+i*18}" x2="1536" y2="${372+i*18}" stroke="#4a5560" stroke-width="3"/>`).join('')}
</g>
<!-- cargo crate + manifest clipboard -->
<g id="el-manifest">
  <rect x="430" y="700" width="150" height="110" fill="#1c2836" stroke="#31465c" stroke-width="4"/>
  <rect x="470" y="676" width="86" height="110" rx="6" fill="#c2cad2" transform="rotate(-7 513 731)"/>
  ${[0,1,2,3].map(i=>`<line x1="486" y1="${706+i*18}" x2="${540}" y2="${702+i*18}" stroke="#4a5560" stroke-width="3" transform="rotate(-7 513 731)"/>`).join('')}
</g>
<!-- dead crew light + drag streak -->
<path d="M700 760 q160 20 340 -8" stroke="#0a0e14" stroke-width="26" fill="none" opacity=".5"/>
<circle class="slowblink" cx="60" cy="200" r="8" fill="#c94a3d"/>
<text x="84" y="206" font-family="Special Elite" font-size="15" fill="#7f5a5a">LIFE SUPPORT: RESERVE</text>
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
  ${Array.from({length:60},(_,i)=>`<circle class="tw" cx="${(i*167+90)%1180+220}" cy="${(i*61)%300+100}" r="${.8+(i%3)*.7}" fill="#dfe8ff" style="animation-delay:${(i*.53)%4}s"/>`).join('')}
  <g class="drift">
    <path d="M480 200 l60 -12 20 26 -70 14 z" fill="#0e1622"/>
    <path d="M980 150 l40 8 -8 22 -44 -8 z" fill="#0c141e"/>
  </g>
  <circle class="slowblink" cx="1180" cy="170" r="5" fill="#ffb45e"/>
  <line x1="800" y1="80" x2="800" y2="420" stroke="#26313e" stroke-width="10"/>
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
<!-- captain's chair, turned away -->
<g opacity=".95">
  <rect x="740" y="470" width="130" height="150" rx="20" fill="#0c121a"/>
  <rect x="760" y="600" width="90" height="16" rx="6" fill="#1a2530"/>
  <rect x="790" y="616" width="26" height="60" fill="#0c121a"/>
</g>
<!-- antenna / radar console -->
<g id="art-antenna">
  <rect x="600" y="430" width="200" height="120" rx="10" fill="#121c28" stroke="#31465c" stroke-width="5"/>
  <circle cx="700" cy="490" r="44" fill="#06130c" stroke="#2a4258" stroke-width="4"/>
  <g class="radarsweep" style="transform-origin:700px 490px"><line x1="700" y1="490" x2="700" y2="450" stroke="#3fd68c" stroke-width="3"/><line x1="700" y1="490" x2="700" y2="452" stroke="#3fd68c" stroke-width="7" opacity=".25"/></g>
  <circle class="slowblink" cx="722" cy="472" r="2.5" fill="#3fd68c"/>
  ${[16,30].map(r=>`<circle cx="700" cy="490" r="${r}" fill="none" stroke="#1c3a2a" stroke-width="2"/>`).join('')}
  <text class="flick" x="700" y="426" text-anchor="middle" font-family="Special Elite" font-size="17" fill="#3fd68c">DISH: --.--</text>
</g>
<!-- captain's log -->
<g id="art-log">
  <rect x="330" y="620" width="120" height="80" rx="6" fill="#0a141c" stroke="#2a4258" stroke-width="4"/>
  <rect class="flick" x="342" y="632" width="96" height="44" fill="#06130c"/>
  ${[0,1].map(i=>`<line x1="352" y1="${648+i*14}" x2="${420-i*20}" y2="${648+i*14}" stroke="#3fd68c" stroke-width="2.5"/>`).join('')}
</g>
<!-- star chart with gouges -->
<g id="art-starchart">
  <rect x="1080" y="260" width="220" height="150" rx="6" fill="#0c1420" stroke="#31465c" stroke-width="5"/>
  ${Array.from({length:14},(_,i)=>`<circle cx="${1100+(i*47)%180}" cy="${280+(i*31)%110}" r="1.6" fill="#8fa8c8"/>`).join('')}
  <path d="M1110 390 h130" stroke="#c9a04a" stroke-width="2" stroke-dasharray="4 4"/>
  ${[0,1,2].map(r=>[0,1,2,3,4].map(c=>`<line x1="${1118+c*18}" y1="${352+r*10}" x2="${1126+c*18}" y2="${360+r*10}" stroke="#c97b5a" stroke-width="2.5"/>`).join('')).join('')}
</g>
<!-- comms speaker (the beacon loop) -->
<g id="el-beacon">
  <circle cx="480" cy="480" r="52" fill="#0c121a" stroke="#31465c" stroke-width="7"/>
  ${[36,24,12].map(r=>`<circle cx="480" cy="480" r="${r}" fill="none" stroke="#060a10" stroke-width="5"/>`).join('')}
  <circle class="flick" cx="480" cy="480" r="6" fill="#3fd68c"/>
</g>
<!-- nav console (cipher plate) -->
<g id="el-console">
  <rect x="900" y="620" width="180" height="86" rx="8" fill="#121c28" stroke="#31465c" stroke-width="5"/>
  <rect x="916" y="636" width="148" height="30" fill="#0a141c"/>
  <text x="990" y="657" text-anchor="middle" font-family="Special Elite" font-size="14" fill="#7f97ab">YMJ HTZWXJ...</text>
  ${[0,1,2,3].map(i=>`<circle cx="${930+i*36}" cy="686" r="8" fill="#1a2530"/>`).join('')}
</g>
<!-- reactor pillar -->
<g id="el-reactor">
  <rect x="1440" y="380" width="120" height="360" rx="14" fill="#141e2a" stroke="#31465c" stroke-width="6"/>
  ${[0,1,2,3,4].map(i=>`<rect class="flick" x="1458" y="${408+i*62}" width="84" height="30" rx="4" fill="#0a141c" stroke="#2a4258" stroke-width="2"/>`).join('')}
  <circle class="slowblink" cx="1500" cy="360" r="9" fill="#c94a3d"/>
</g>
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-bridge" cx="230" cy="210" r="6" fill="#7fd4ff" opacity=".12"/>
<circle cx="230" cy="210" r="20" fill="#7fd4ff" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-bridge" class="surge" cx="210" cy="430" rx="96" ry="70" fill="#8fd8ff" opacity="0"/>
<!-- wreckage tumbling past the viewport, and something enormous rising -->
<g class="drift" style="animation-delay:3s"><path d="M300 250 l34 -8 l10 16 l-38 10z" fill="#12202c" opacity=".8"/></g>
<g class="drift" style="animation-delay:14s"><path d="M700 150 l22 6 l-6 16 l-24 -6z" fill="#101c26" opacity=".7"/></g>
<circle class="riseslow" cx="320" cy="290" r="80" fill="#1b2f45" opacity=".5" style="animation-duration:70s"/>
<circle class="riseslow" cx="320" cy="290" r="80" fill="none" stroke="#33597e" stroke-width="2" opacity=".4" style="animation-duration:70s"/>
<circle class="tw" cx="300" cy="110" r="1.6" fill="#dfe8ff" style="animation-delay:0.0s"/><circle class="tw" cx="460" cy="157" r="1.6" fill="#dfe8ff" style="animation-delay:0.5s"/><circle class="tw" cx="620" cy="114" r="1.6" fill="#dfe8ff" style="animation-delay:1.0s"/><circle class="tw" cx="780" cy="161" r="1.6" fill="#dfe8ff" style="animation-delay:1.5s"/><circle class="tw" cx="940" cy="118" r="1.6" fill="#dfe8ff" style="animation-delay:2.0s"/><circle class="tw" cx="1100" cy="165" r="1.6" fill="#dfe8ff" style="animation-delay:2.5s"/>
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

const ROOMS=[
/* ============ ROOM 1 — THE CRYO BAY ============ */
{
  id:'cryobay', name:'Room 1 — The Cryo Bay', scene:'cryobay',
  stageFx:'drift',
  relays:[{el:'rl-cryobay',mode:'pulse',period:3.8}],
  wrongSound:'clank',
  intro:"You wake choking on cryo-fluid, forty years past your wake date. The other pods are dark.",
  objective:"Find out what happened — <b>glowing rings</b> mark what you can examine. Nothing on this deck explains itself.",
  entryBeat:"The bay's ceiling panels creak, one after another, in a slow line from the vent to the door — the sound of weight moving where no crew could walk.",
  entrySound:'clank',
  completeText:"The lift accepts the deck code and grinds upward toward the bridge. Behind you, in the bay, a pod lid whines open. You do not go back to check.",
  chain:"Forty years of the same six status lines have burned the first character of each one into the pod plates, and read down the column they spell LOCKER → the locker's four glyphs carry digits but no order, and the evacuation placard supplies one: shut down REACTOR, POWER, WATER, CRYO = 6942 → the med terminal asks for the standing order at the level this deck is set to; the quarantine tag on the vent grille is wound to 4 and the placard says level 4 is BURN → the bridge lift's code is reset each watch to the duty count then the relief, and the watch bill shows three and four = 34.",
  objects:[
    { id:'vent', icon:'🌬️', name:'Vent Grille', pos:{x:66,y:2,w:12,h:14},
      desc:"The maintenance vent over the pods hangs open on one hinge. Two of its screws lie on the deck below — placed side by side, dead parallel, like surgical tools.\n\nZip-tied to the grille is a quarantine tag, the kind with a brass pointer you wind round to whatever level the deck is running at.\n\nSomebody has wound this one all the way round to 4, and then snapped the stop off so that it cannot be wound back.\n\nThe shaft behind the grille is pitch dark and completely silent, which is wrong. Shafts hum. This one is holding still." },
    { id:'pods', icon:'🧊', name:'Cryo Pods', pos:{x:6,y:36,w:52,h:34},
      desc:"Six pods. Five dark, their occupants gone — not thawed, gone. Yours stands open, dripping.\n\nEach pod's status plate still shows the last line its system wrote. The plates are forty years old and the phosphor has burned in, so the first character of every line sits brighter than the rest of it, stacked down the column:\n\n   POD 1 — “Life-support nominal.”\n   POD 2 — “Occupant absent.”\n   POD 3 — “Cryo-seal breached.”\n   POD 4 — “Kelvin drift climbing.”\n   POD 5 — “Egress hatch open.”\n   POD 6 — “Return date overdue.”\n\nSix bright letters, burned into the glass by forty years of the same six lines.",
      puzzle:{
        prompt:"Six plates, six burned-in letters. What do they spell?",
        placeholder:"SIX LETTERS", answers:['LOCKER'],
        hints:[
          "You are not decoding anything. The burn-in has done the work — read what is bright, pod 1 down to pod 6.",
          "Life… Occupant… Cryo… Kelvin… Egress… Return…",
          "L, O, C, K, E, R. It is pointing at the maintenance locker across the bay."
        ],
        solvedText:"L-O-C-K-E-R. The maintenance locker by the bulkhead — tall, sealed, and stencilled with four system glyphs."
      }
    },
    { id:'locker', onSolve:{el:'rx-cryobay',op:.2,fx:'surge'}, icon:'🗄️', name:'Maintenance Locker', pos:{x:79,y:40,w:10,h:30},
      desc:"A tall maintenance locker sealed with a 4-digit mag-lock. Four system glyphs are stencilled above it, each with a digit, and they are stencilled in no order at all — whoever painted them worked round the door as the space allowed:\n\n   ⚡ POWER 9       ❄ CRYO 2       ☢ REACTOR 6       💧 WATER 4\n\nFour systems, four digits, and nothing here to say which comes first. But a ship this size does not leave the order of its systems to memory; it puts it on the wall.",
      puzzle:{
        type:'keypad',
        prompt:"Enter the 4-digit code.", answers:['6942'],
        hints:[
          "The digits belong to systems, so what you need is an official order for those systems. This deck has one posted on it.",
          "The evacuation placard: SHUT DOWN IN THIS ORDER — REACTOR, POWER, WATER, CRYO.",
          "☢ is 6, ⚡ is 9, 💧 is 4, ❄ is 2. Enter 6942."
        ],
        solvedText:"The mag-lock releases on 6-9-4-2. Inside: a med-bay keycard, an empty tool rack with every cutting tool gone from it, and a dust-free rectangle where something long used to lie.",
        solveBeat:"As the locker opens, the vent above the pods exhales a long, slow breath of cold air. Vents push air in pulses. They do not exhale.",
        beatSound:'hiss'
      }
    },
    { id:'placard', icon:'📋', name:'Evacuation Placard', pos:{x:88,y:35,w:9,h:16},
      desc:"A laminated placard hangs on the wall, corporate-cheerful under forty years of dust. Two notices share it.\n\n   IN THE EVENT OF EVACUATION, SHUT DOWN SYSTEMS IN THIS ORDER:\n     1. REACTOR    2. POWER    3. WATER    4. CRYO\n\n   CONTAMINATION STANDING ORDERS — THE LEVEL IS SET ON EACH DECK:\n     LEVEL 1 — CLEAN\n     LEVEL 2 — WATCH\n     LEVEL 3 — SEAL\n     LEVEL 4 — BURN\n\nProspero carries twin reactor cores. Both must sleep before you do.\n\nSomeone has underlined the word “twin”. Twice. Someone else has gone over LEVEL 4 so hard the marker tore the laminate." },
    { id:'terminal', icon:'🖥️', name:'Med Terminal', pos:{x:56,y:44,w:12,h:16},
      desc:"The med terminal wants a password. Its lock screen has been showing the same prompt for four decades, and the cursor has burned a groove in the phosphor waiting for an answer:\n\n   CONTAMINATION CONTROL — RESTRICTED\n\n   ENTER THE STANDING ORDER FOR THE LEVEL THIS DECK IS SET TO.\n\nThe level is not set in software. On this ship it is set by hand, on the deck it applies to, and it is not the kind of thing anybody raises for a drill.",
      puzzle:{
        prompt:"Enter the password.", placeholder:"PASSWORD", answers:['BURN'],
        hints:[
          "Two things to find and put together: what level this deck is actually set to, and what the standing order for that level is.",
          "The quarantine tag on the vent grille has been wound round to 4 and the stop snapped off. The placard on the wall lists what each level means.",
          "Level 4 on the placard reads BURN. Enter BURN."
        ],
        solvedText:"B-U-R-N. Somebody set this deck to burn and then did not get the chance. The terminal unlocks and brings up forty years of medical logs. The last entry is in the director's hand: “Crew of nine aboard at launch, and both reactor cores still burning. The scratching in the vents is not rats. Rats stop when you knock.”",
        solveBeat:"Somewhere in the shaft above you, something knocks back. Three times. Patient.",
        beatSound:'knock'
      }
    },
    { id:'manifest', icon:'📄', name:'Deck Manifest', pos:{x:27,y:74,w:10,h:14}, hiddenUntil:'terminal',
      desc:"The lift to the bridge is restricted, and its panel wants two digits.\n\nClipped beside it, the deck's watch bill — who was standing what when the ship went quiet. The instruction across the top is printed, not written:\n\n   BRIDGE LIFT — CODE IS RESET EVERY WATCH:\n   THE DUTY WATCH COUNT, THEN THE RELIEF.\n\n   DUTY WATCH ....... Okafor · Lindqvist · Barre\n   RELIEF WATCH ..... Yusuf · Marchetti · Osei · Hallgren\n   OFF WATCH ........ Reyes · Tanaka\n\nNine names. Nobody has crossed any of them off.",
      puzzle:{
        prompt:"Enter the 2-digit lift code.", placeholder:"TWO DIGITS", answers:['34'],
        hints:[
          "Nothing to work out here — only two lists to count, and the panel tells you which order it wants them in.",
          "Count the duty watch, then count the relief watch. Ignore the off watch; the panel did not ask for it.",
          "Three on duty, four on relief. Enter 34."
        ],
        solvedText:"3-4. The lift doors part on a corridor of dead lights — and one live one, far down, above the bridge hatch.",
        solveBeat:"As the lift rises, something rises with you — inside the wall, matching your speed exactly, then passing you.",
        beatSound:'clank'
      }
    }
  ]
},
/* ============ ROOM 2 — THE BRIDGE ============ */
{
  id:'bridge', name:'Room 2 — The Bridge', scene:'bridge',
  stageFx:'drift',
  relays:[{el:'rl-bridge',mode:'pulse',period:2.4}],
  wrongSound:'ping',
  wrongVfx:'sparks',
  intro:"The bridge is forty years of dust and one turned chair. The viewport is full of the wrong stars.",
  objective:"The ship has been listening to something for decades. Find the dish heading — then <b>listen</b> yourself.",
  entryBeat:"The captain's chair faces the viewport. The dust on the armrests is disturbed — four long furrows on each side, as if something sat here recently. And gripped.",
  entrySound:'clank',
  completeText:"The reactor accepts the code and channels power aft. A service map blinks: ESCAPE POD — VIA HYDROPONICS. The green deck. The one the crew sealed first.",
  chain:"The captain's log says he aimed the dish at the one beacon that had stopped talking; the chart's register lists four bearings and marks exactly one SILENT, so the dish swings to 47.15 → that channel is carrying a hand-knocked loop in prisoners' tap code: SEAL VENTS → the nav console's status line is five letters in 5-bit binary, and the legend is etched below it: GAMMA → the rods are stamped 6, 5 and 1, and the engineer's two notes (copper leftmost, iron left of lead) fix the seating: 651.",
  objects:[
    { id:'log', icon:'📖', name:"Captain's Log", pos:{x:18,y:66,w:10,h:12},
      desc:"The last entries, voice-to-text, the punctuation failing along with the speaker's nerve:\n\n“Day 44. Something answered our hail. Not on any channel we transmit on.”\n\n“Day 46. Crew hear it in the vents now. I have ordered the shafts welded.”\n\n“Day 47. I have aimed the dish at the one beacon out there that stopped talking, and I will not move it again. Its bearing is on the chart with all the others; I am not writing it in here, in case this log is read by something that is not you. Find it, listen, and then get off this ship.”" },
    { id:'starchart', icon:'🗺️', name:'Star Chart', pos:{x:66,y:26,w:16,h:20},
      desc:"A star chart of the sector, one course line burned in amber toward a dead beacon. Down the margin, the chart's beacon register:\n\n   BEACON ................ BEARING ...... STATUS\n   CASSIA RELAY .......... 31.08 ........ ACTIVE\n   ARDEN BUOY ............ 44.02 ........ ACTIVE\n   KEPLER MARK ........... 47.15 ........ SILENT — 40 YRS\n   TORVALD LIGHT ......... 52.60 ........ ACTIVE\n\nBeneath the chart's frame somebody has cut tally scratches into the console — small, neat, obsessive. You count them twice to be sure.\n\nNine.\n\nThere were nine of them aboard." },
    { id:'antenna', icon:'📡', name:'Deep-Space Dish', pos:{x:38,y:44,w:14,h:16},
      desc:"The dish control console: a great steel ear out on the hull, and a dial to swing it across the sky. The readout is waiting for a bearing, to two decimal places, the way the chart writes them.\n\nThe captain aimed this at one specific thing on Day 47 and left a log entry saying so, and a bearing register on the chart beside you listing every beacon in the sector.",
      puzzle:{
        type:'dial',
        prompt:"Swing the dish to the captain's bearing, then coax the trim knobs until the carrier holds.",
        answers:['4715'],
        dial:{min:4000,max:5000,div:100,target:4715,pad:5,meter:'CARRIER STRENGTH',lock:'LOCK HEADING',miss:'nothing out there but hiss.',
          knobs:[{label:'AZIMUTH TRIM',target:41},{label:'GAIN',target:73},{label:'POLARIZATION',target:18}]},
        hints:[
          "The log says what he aimed at without giving you the number; the chart's register gives every number without saying which. Put the two together.",
          "He aimed at the beacon that stopped talking. The register marks exactly one as SILENT — forty years silent, which is how long this ship has been out here.",
          "KEPLER MARK, bearing 47.15. Set it there, then work the three knobs one at a time until the panel reads LOCKED IN."
        ],
        solvedText:"At 47.15 the hiss opens like a door — and underneath it, something is knocking. A repeating loop, forty years old, knocked out by hand. The comms speaker is carrying it now. Split the letters up; it is a long one."
      }
    },
    { id:'beacon', onSolve:{el:'rx-bridge',op:.2,fx:'surge'}, icon:'🔊', name:'The Beacon Loop', pos:{x:25,y:44,w:10,h:14}, hiddenUntil:'antenna',
      desc:"The loop repeats every few seconds. Not dots and dashes — knocks, in pairs: a count, a small pause, a second count. Nine pairs, two words, knocked out slowly by someone who wanted this understood.\n\nDivide the pairs among the crew and count them out.",
      puzzle:{
        prompt:"Decode the loop (two words).",
        placeholder:"TWO WORDS", answers:['SEALVENTS'],
        taps:'43 15 11 31|51 15 33 44 43',
        hints:[
          "Knocks in pairs — that's the old prisoners' tap code. Look it up: the alphabet in a 5×5 grid, first count gives the row, second the column.",
          "Row 4, column 3 is S. Row 1, column 5 is E. Split the pairs among the crew — and remember the grid drops K (it shares a cell with C).",
          "4·3 S, 1·5 E, 1·1 A, 3·1 L — then 5·1 V, 1·5 E, 3·3 N, 4·4 T, 4·3 S. Enter SEALVENTS."
        ],
        solvedText:"SEAL VENTS. Knocked out for forty years by the dead, to whoever came next. You look at the welded shafts. The welds on this deck… are intact. The ones below decks, the map says, are not.",
        solveBeat:"The moment the last letter resolves, the speaker pops once and goes silent — as if something, somewhere, noticed you'd finally heard it.",
        beatSound:'hiss'
      }
    },
    { id:'console', icon:'🧭', name:'Nav Console', pos:{x:55,y:66,w:13,h:12},
      desc:"The navigation console is locked. Its status line blinks five groups of machine bits — the ship talks in binary when it doesn't trust its crew:\n\n00111   00001   01101   01101   00001\n\nA legend is etched below: “A=00001 · B=00010 · C=00011 · … each letter is its place in the alphabet, in five bits.”",
      puzzle:{
        prompt:"Enter the unlock word.", placeholder:"FIVE LETTERS", answers:['GAMMA'],
        hints:[
          "Each group is a number in binary (bit values 16-8-4-2-1). Convert it, then turn the number into a letter: 1=A, 2=B…",
          "00111 = 4+2+1 = 7 = the 7th letter. Do the same for each group; split them among the crew.",
          "7, 1, 13, 13, 1 → G, A, M, M, A. Enter GAMMA."
        ],
        solvedText:"G-A-M-M-A. The console unlocks — the ship has been holding station against a dead beacon for decades, burning fuel to stay near something that stopped talking. Aft power routing now needs the reactor code."
      }
    },
    { id:'reactor', icon:'☢️', name:'Reactor Calibration', pos:{x:88,y:40,w:9,h:42}, hiddenUntil:'console',
      desc:"Three control rods — COPPER, IRON and LEAD — have to be seated into the LEFT, CENTRE and RIGHT sockets, and the readout reads their stamped numbers off left to right.\n\nThe engineer's parts list is still clipped to the housing:\n\n   COPPER ROD ..... stamped 6\n   IRON ROD ....... stamped 5\n   LEAD ROD ....... stamped 1\n\nAnd under it, in his own hand, the two things the manual does not tell you:\n\n   “Copper shorts out in anything but the leftmost socket. Found that out the hard way.”\n\n   “Iron only holds if it is seated somewhere to the left of lead.”",
      puzzle:{
        type:'keypad',
        prompt:"Seat the rods, then type the readout — the three stamped numbers, left socket to right.", answers:['651'],
        hints:[
          "The numbers are given to you outright. The whole puzzle is where the three rods are allowed to sit.",
          "Copper can only go in the left socket, so that is settled. Iron and lead take the centre and the right, in some order.",
          "Iron must be left of lead, so iron takes the centre and lead the right. Left to right that reads 6, 5, 1 — enter 651."
        ],
        solvedText:"6-5-1. The reactor spools up from a whisper to a heartbeat, and power flows aft — through Hydroponics. The deck the crew welded shut from the outside.",
        solveBeat:"Deep below, something answers the reactor's new heartbeat with three slow blows against a bulkhead. Not random. Rhythmic. Like a knock learned from watching you.",
        beatSound:'knock'
      }
    }
  ]
},
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

registerScenario({
  id:'prospero',
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
