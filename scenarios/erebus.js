/* ============================================================
   SCENARIO: STATION EREBUS (Antarctic research station)
   Nine days of radio silence. The plane drops you at the flag line.
   Core E-9 is open, and its meltwater has been walking around.
   Get the generator going, bring the plane down, and leave.

   Built on the reset grammar (see PUZZLES.md): locks that look like locks,
   and whatever opens them somewhere else in the room. Each object carries
   its own art into the room as `sprite`; the backdrops below are only the
   place.
   ============================================================ */
(function(){
const SCENES={};

/* ---------- Room 1: The Perimeter ---------- */
SCENES.perimeter=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="eSky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#050a14"/><stop offset=".65" stop-color="#12233a"/><stop offset="1" stop-color="#2a4258"/></linearGradient>
 <linearGradient id="eSnow" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#b8ccdc"/><stop offset="1" stop-color="#7c94ac"/></linearGradient>
</defs>
<rect width="1600" height="620" fill="url(#eSky)"/>
<!-- the sun, sitting on the horizon to the west -->
<ellipse cx="70" cy="566" rx="260" ry="120" fill="#ffb46a" opacity=".12"/><circle cx="70" cy="560" r="34" fill="#ffd9a0"/><circle cx="70" cy="560" r="60" fill="#ffd9a0" opacity=".2"/>
<!-- aurora -->
<g class="aurora">
  <path d="M100 60 q200 -40 380 30 q220 60 420 -10 q200 -60 380 10 l0 90 q-190 -60 -380 -5 q-200 60 -420 5 q-180 -55 -380 -20z" fill="#3fd68c" opacity=".22"/>
  <path d="M200 140 q220 -30 400 30 q240 60 460 -20 l0 60 q-220 70 -460 15 q-180 -50 -400 -15z" fill="#7c6ad8" opacity=".14"/>
</g>
${Array.from({length:26},(_,i)=>`<circle class="tw" cx="${(i*67+20)%1600}" cy="${(i*23)%200+10}" r="${.7+(i%3)*.6}" fill="#dfe8ff" style="animation-delay:${(i*.6)%4}s"/>`).join('')}
<!-- snowfield -->
<path d="M0 560 q400 -40 800 -6 t800 -12 v360 h-1600z" fill="url(#eSnow)"/>
<path d="M0 640 q300 22 600 4 t1000 8" stroke="#dce8f2" stroke-width="5" fill="none" opacity=".5"/>
<!-- wind ripping loose snow across the field -->
<line class="gust" x1="0" y1="620" x2="300" y2="612" stroke="#dce8f2" stroke-width="3" opacity=".5" stroke-linecap="round"/>
<line class="gust g2" x1="0" y1="700" x2="240" y2="694" stroke="#dce8f2" stroke-width="2.5" opacity=".4" stroke-linecap="round"/>
<line class="gust g3" x1="0" y1="770" x2="340" y2="764" stroke="#dce8f2" stroke-width="3.5" opacity=".45" stroke-linecap="round"/>
<!-- the station, dark -->
<g class="plx" data-depth="5">
  <rect x="1080" y="420" width="360" height="140" rx="16" fill="#1a2836"/>
  <rect x="1120" y="380" width="120" height="60" rx="10" fill="#14202c"/>
  ${[0,1,2,3].map(i=>`<rect x="${1110+i*84}" y="470" width="44" height="34" rx="6" fill="#0a1018"/>`).join('')}
  <rect class="flick" x="1362" y="470" width="44" height="34" rx="6" fill="#5a4a1a"/>
  <path d="M1060 560 h400" stroke="#4c6478" stroke-width="8"/>
  <rect x="1420" y="300" width="10" height="130" fill="#2a3a48"/>
  <line x1="1425" y1="300" x2="1385" y2="360" stroke="#2a3a48" stroke-width="4"/>
</g>
<!-- the station: a module on stilts, and the steps up to its storm door -->
<g>
  <rect x="1140" y="560" width="16" height="150" fill="#2a3a48"/><rect x="1300" y="560" width="16" height="150" fill="#2a3a48"/><rect x="1460" y="560" width="16" height="150" fill="#2a3a48"/><rect x="1580" y="560" width="16" height="150" fill="#2a3a48"/>
  <rect x="1110" y="300" width="520" height="270" rx="18" fill="#3a5a78" stroke="#22303e" stroke-width="6"/>
  <path d="M1110 340H1630M1110 520H1630" stroke="#2c4660" stroke-width="4"/>
  <rect x="1420" y="372" width="56" height="44" rx="8" fill="#0a1018" stroke="#22303e" stroke-width="4"/><rect x="1520" y="372" width="56" height="44" rx="8" fill="#0a1018" stroke="#22303e" stroke-width="4"/>
  <rect class="flick" x="1428" y="380" width="40" height="28" rx="4" fill="#5a4a1a" opacity=".7"/>
  <path d="M1170 700l40 -96h120l-4 96" fill="#2a3a48"/>
  <path d="M1180 690h150" stroke="#4c6478" stroke-width="6"/><path d="M1189 672h148" stroke="#4c6478" stroke-width="6"/><path d="M1198 654h146" stroke="#4c6478" stroke-width="6"/><path d="M1207 636h144" stroke="#4c6478" stroke-width="6"/><path d="M1216 618h142" stroke="#4c6478" stroke-width="6"/>
  <rect x="1190" y="586" width="180" height="14" fill="#4c6478"/>
  <path d="M1190 586V520M1370 586V520M1190 540H1370" stroke="#8aa4ba" stroke-width="4" fill="none"/>
</g>
<!--SPRITES-->
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-perimeter" cx="230" cy="210" r="6" fill="#ff9b6a" opacity=".12"/>
<circle cx="230" cy="210" r="20" fill="#ff9b6a" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-perimeter" class="surge" cx="160" cy="430" rx="96" ry="70" fill="#7fe0ff" opacity="0"/>
<!-- a second, slower aurora band deeper in the sky -->
<g class="aurora" style="animation-delay:7s;animation-duration:26s" opacity=".5">
  <path d="M-60 180 q380 -90 760 -14 q380 76 960 -30 l0 96 q-580 104 -960 28 q-380 -76 -760 12z" fill="#5fd8b0" opacity=".13"/>
  <path d="M-60 236 q420 -70 820 6 q400 76 900 -20 l0 62 q-500 96 -900 20 q-400 -76 -820 -4z" fill="#7f8fe8" opacity=".09"/>
</g>
<circle class="tw" cx="80" cy="30" r="1.5" fill="#e8f0ff" style="animation-delay:0.0s"/><circle class="tw" cx="253" cy="89" r="1.5" fill="#e8f0ff" style="animation-delay:0.6s"/><circle class="tw" cx="426" cy="148" r="1.5" fill="#e8f0ff" style="animation-delay:1.2s"/><circle class="tw" cx="599" cy="207" r="1.5" fill="#e8f0ff" style="animation-delay:1.7999999999999998s"/><circle class="tw" cx="772" cy="86" r="1.5" fill="#e8f0ff" style="animation-delay:2.4s"/><circle class="tw" cx="945" cy="145" r="1.5" fill="#e8f0ff" style="animation-delay:3.0s"/><circle class="tw" cx="1118" cy="204" r="1.5" fill="#e8f0ff" style="animation-delay:3.5999999999999996s"/><circle class="tw" cx="1291" cy="83" r="1.5" fill="#e8f0ff" style="animation-delay:4.2s"/><circle class="tw" cx="1464" cy="142" r="1.5" fill="#e8f0ff" style="animation-delay:4.8s"/><circle class="tw" cx="187" cy="201" r="1.5" fill="#e8f0ff" style="animation-delay:0.39999999999999947s"/><circle class="tw" cx="360" cy="80" r="1.5" fill="#e8f0ff" style="animation-delay:1.0s"/><circle class="tw" cx="533" cy="139" r="1.5" fill="#e8f0ff" style="animation-delay:1.5999999999999996s"/><circle class="tw" cx="706" cy="198" r="1.5" fill="#e8f0ff" style="animation-delay:2.1999999999999993s"/><circle class="tw" cx="879" cy="77" r="1.5" fill="#e8f0ff" style="animation-delay:2.8s"/><circle class="tw" cx="1052" cy="136" r="1.5" fill="#e8f0ff" style="animation-delay:3.4000000000000004s"/><circle class="tw" cx="1225" cy="195" r="1.5" fill="#e8f0ff" style="animation-delay:4.0s"/>
<!-- spindrift coming off the surface (the snowfield starts around y560) -->
<ellipse class="spindrift" cx="1560" cy="744" rx="30" ry="2.6" fill="#eaf6ff" opacity=".3" style="animation-delay:0.0s;animation-duration:5s"/><ellipse class="spindrift" cx="1560" cy="778" rx="52" ry="2.6" fill="#eaf6ff" opacity=".3" style="animation-delay:0.9s;animation-duration:6s"/><ellipse class="spindrift" cx="1560" cy="812" rx="74" ry="2.6" fill="#eaf6ff" opacity=".3" style="animation-delay:1.8s;animation-duration:7s"/><ellipse class="spindrift" cx="1560" cy="846" rx="30" ry="2.6" fill="#eaf6ff" opacity=".3" style="animation-delay:2.7s;animation-duration:5s"/><ellipse class="spindrift" cx="1560" cy="744" rx="52" ry="2.6" fill="#eaf6ff" opacity=".3" style="animation-delay:3.6s;animation-duration:6s"/><ellipse class="spindrift" cx="1560" cy="778" rx="74" ry="2.6" fill="#eaf6ff" opacity=".3" style="animation-delay:4.5s;animation-duration:7s"/><ellipse class="spindrift" cx="1560" cy="812" rx="30" ry="2.6" fill="#eaf6ff" opacity=".3" style="animation-delay:5.4s;animation-duration:5s"/><ellipse class="spindrift" cx="1560" cy="846" rx="52" ry="2.6" fill="#eaf6ff" opacity=".3" style="animation-delay:6.3s;animation-duration:6s"/></g>
</svg>`;

/* ---------- Room 2: Crew Quarters ---------- */
SCENES.quarters=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="eQ" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#141c22"/><stop offset="1" stop-color="#22303a"/></linearGradient>
 <radialGradient id="eHeat"><stop offset="0" stop-color="#ff9a4a" stop-opacity=".35"/><stop offset="1" stop-color="#ff9a4a" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="620" fill="url(#eQ)"/>
<rect y="620" width="1600" height="280" fill="#1a2026"/>
${[0,1,2,3,4,5].map(i=>`<line x1="${i*300-100}" y1="620" x2="${i*340-200}" y2="900" stroke="#0d1216" stroke-width="5"/>`).join('')}
<!-- frosted window with a shape -->
<g>
  <rect x="90" y="160" width="260" height="200" fill="#0a1420" stroke="#3a4c5c" stroke-width="10"/>
  <path d="M90 250 q60 -30 130 -10 q70 -24 130 6 l0 104 -260 0z" fill="#dce8f2" opacity=".2"/>
  <rect class="win-shadow" x="60" y="180" width="60" height="170" rx="26" fill="#050a10" opacity="0"/>
  <line x1="220" y1="160" x2="220" y2="360" stroke="#3a4c5c" stroke-width="7"/>
  ${[0,1,2,3,4].map(i=>`<line x1="${112+i*20}" y1="352" x2="${120+i*20}" y2="338" stroke="#8aa4ba" stroke-width="3"/>`).join('')}
</g>
<!-- bunks -->
<g>
${[0,1].map(i=>`<g transform="translate(${420+i*250},0)">
  <rect x="0" y="300" width="210" height="16" fill="#3a2d1a"/>
  <rect x="0" y="430" width="210" height="16" fill="#3a2d1a"/>
  <rect x="10" y="270" width="190" height="30" rx="8" fill="${i?'#46607a':'#5c7488'}"/>
  <rect x="10" y="400" width="190" height="30" rx="8" fill="${i?'#5c7488':'#46607a'}"/>
  <rect x="0" y="270" width="8" height="330" fill="#241a10"/><rect x="202" y="270" width="8" height="330" fill="#241a10"/>
</g>`).join('')}
</g>
<!-- heater glow -->
<g>
  <rect x="940" y="480" width="120" height="140" rx="10" fill="#22303a" stroke="#3a4c5c" stroke-width="5"/>
  <circle cx="1000" cy="560" r="90" fill="url(#eHeat)"/>
  ${[0,1,2].map(i=>`<rect class="flick" x="${958+i*30}" y="510" width="22" height="70" rx="4" fill="#b0502a" style="animation-delay:${i*.4}s"/>`).join('')}
</g>
<!-- the end wall: the day tanks stand against it, the generator room is through it -->
<g>
  <rect x="1070" y="150" width="530" height="470" fill="#1b252e"/>
  <path d="M1070 150V620" stroke="#0d1216" stroke-width="6"/>
  <path d="M1070 230H1600" stroke="#141c22" stroke-width="3"/><path d="M1070 330H1600" stroke="#141c22" stroke-width="3"/><path d="M1070 430H1600" stroke="#141c22" stroke-width="3"/><path d="M1070 530H1600" stroke="#141c22" stroke-width="3"/>
</g>
<!-- five empty parkas on hooks -->
<g>
${[0,1,2,3,4].map(i=>`<g><circle cx="${640+i*56}" cy="180" r="4" fill="#3a2d1a"/>
 <path d="M${640+i*56} 184 q-20 14 -18 70 l36 0 q2 -56 -18 -70z" fill="${i%2?'#b03a2a':'#46607a'}"/></g>`).join('')}
</g>
<!--SPRITES-->
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-quarters" cx="230" cy="210" r="6" fill="#ff9b6a" opacity=".12"/>
<circle cx="230" cy="210" r="20" fill="#ff9b6a" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-quarters" class="surge" cx="920" cy="430" rx="96" ry="70" fill="#7fe0ff" opacity="0"/>
<!-- frost taking the window back -->
<g opacity=".3"><path d="M60 60 q40 26 30 70 M120 50 q-20 40 8 76 M180 66 q34 30 18 66" stroke="#cfe8ff" stroke-width="2.4" fill="none"/></g>
<!-- breath, because it is far too cold in here -->
<ellipse class="steam" cx="820" cy="200" rx="34" ry="10" fill="#dff2ff" opacity=".10"/>
<ellipse class="steam" cx="860" cy="176" rx="24" ry="8" fill="#dff2ff" opacity=".08" style="animation-delay:3.2s"/>
<!-- a lamp the generator can only just manage -->
<g class="swing" style="transform-origin:960px 0"><line x1="960" y1="0" x2="960" y2="70" stroke="#2a3138" stroke-width="4"/>
  <circle class="flick" cx="960" cy="84" r="12" fill="#ffd98c" opacity=".75"/>
  <circle cx="960" cy="84" r="60" fill="#ffd98c" opacity=".06"/></g>
<circle class="sparkle" cx="200" cy="40" r="2" fill="#cfe8ff" style="animation-delay:0.0s"/><circle class="sparkle" cx="350" cy="81" r="2" fill="#cfe8ff" style="animation-delay:0.8s"/><circle class="sparkle" cx="500" cy="62" r="2" fill="#cfe8ff" style="animation-delay:1.6s"/><circle class="sparkle" cx="650" cy="43" r="2" fill="#cfe8ff" style="animation-delay:2.4000000000000004s"/><circle class="sparkle" cx="800" cy="84" r="2" fill="#cfe8ff" style="animation-delay:3.2s"/><circle class="sparkle" cx="950" cy="65" r="2" fill="#cfe8ff" style="animation-delay:0.0s"/><circle class="sparkle" cx="1100" cy="46" r="2" fill="#cfe8ff" style="animation-delay:0.8000000000000007s"/></g>
</svg>`;

/* ---------- Room 3: The Ice Core Lab ---------- */
SCENES.corelab=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="eL" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#0a141e"/><stop offset="1" stop-color="#142430"/></linearGradient>
 <radialGradient id="eBlue"><stop offset="0" stop-color="#7fd4ff" stop-opacity=".4"/><stop offset="1" stop-color="#7fd4ff" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#eL)"/>
<!-- cold room panels -->
${[0,1,2,3,4,5,6].map(i=>`<line x1="${i*240}" y1="0" x2="${i*240}" y2="620" stroke="#0d1a24" stroke-width="4"/>`).join('')}
<rect y="620" width="1600" height="280" fill="#101a22"/>
${[0,1,2,3,4].map(i=>`<line x1="${i*380-80}" y1="620" x2="${i*420-160}" y2="900" stroke="#081018" stroke-width="5"/>`).join('')}
<!-- the drill rig -->
<g>
  <rect x="1310" y="120" width="14" height="480" fill="#2a3a48"/>
  <path d="M1240 120 h150 l-20 -40 h-110z" fill="#22303e"/>
  <rect x="1290" y="580" width="54" height="60" fill="#1a242c"/>
  <circle cx="1317" cy="560" r="26" fill="none" stroke="#4c6478" stroke-width="7"/>
</g>
<!-- core racks -->
<g id="el-cores">
  <rect x="120" y="330" width="900" height="14" fill="#2a3a48"/>
  <rect x="120" y="480" width="900" height="14" fill="#2a3a48"/>
${[['B',180,330,9,4],['T',290,330,2,6],['U',400,330,7,2],['R',510,330,6,1],['O',620,330,3,3],['I',730,330,5,3],['E',840,330,8,6],['D',950,330,4,2]].map(([ch,x,y])=>
 `<g><rect x="${x-34}" y="${y-84}" width="68" height="80" rx="12" fill="#16303e" stroke="#3a6a84" stroke-width="3"/>
  <ellipse class="flick" cx="${x}" cy="${y-44}" rx="26" ry="32" fill="url(#eBlue)"/>
  <text x="${x}" y="${y-36}" text-anchor="middle" font-family="Special Elite" font-size="20" fill="#c8ecff">${ch}</text></g>`).join('')}
</g>
<!-- E-9: the broken case -->
<g id="art-coreE9">
  <rect x="500" y="560" width="220" height="120" rx="14" fill="#16303e" stroke="#3a6a84" stroke-width="5"/>
  <path d="M540 560 l40 -60 60 20 40 -30 40 70z" fill="#0a141e"/>
  <path d="M560 570 l30 -40 M640 566 l26 -36" stroke="#7fd4ff" stroke-width="3" opacity=".6"/>
  <text x="610" y="700" text-anchor="middle" font-family="Special Elite" font-size="15" fill="#7fa4c0">SAMPLE E-9</text>
  <ellipse class="rippleA" cx="610" cy="720" rx="90" ry="12" fill="none" stroke="#7fd4ff" stroke-width="2" opacity=".5"/>
  <ellipse class="rippleA r2" cx="610" cy="720" rx="90" ry="12" fill="none" stroke="#7fd4ff" stroke-width="2" opacity=".5"/>
  <ellipse cx="610" cy="720" rx="130" ry="16" fill="#0d2230" opacity=".8"/>
  <path d="M700 716 q120 10 260 -18 q120 -24 200 -8" stroke="#0d2230" stroke-width="18" fill="none" opacity=".6"/>
</g>
<!-- cold safe -->
<g id="el-coldsafe">
  <rect x="150" y="620" width="160" height="170" rx="10" fill="#22303e" stroke="#4c6478" stroke-width="7"/>
  <circle cx="230" cy="690" r="30" fill="#0d1216" stroke="#8aa4ba" stroke-width="5"/>
  <line x1="230" y1="690" x2="248" y2="672" stroke="#8aa4ba" stroke-width="4"/>
  <rect x="190" y="740" width="80" height="16" rx="4" fill="#1a242c"/>
</g>
<!-- intercom to the drill shed -->
<g id="el-intercom">
  <rect x="1420" y="330" width="110" height="140" rx="10" fill="#1c262e" stroke="#4c6478" stroke-width="5"/>
  ${[26,16].map(r=>`<circle cx="1475" cy="380" r="${r}" fill="none" stroke="#0d1216" stroke-width="5"/>`).join('')}
  <circle id="intercom-lamp" cx="1475" cy="436" r="9" fill="#ffdf9c" opacity=".1"/>
  <text x="1475" y="492" text-anchor="middle" font-family="Special Elite" font-size="10" fill="#7fa4c0">DRILL SHED</text>
</g>
<!-- microscope bench -->
<g>
  <rect x="1080" y="640" width="260" height="16" fill="#2a3a48"/>
  <rect x="1096" y="656" width="228" height="100" fill="#1a242c"/>
  <path d="M1150 640 q-6 -40 24 -50 q10 -4 12 -20 l14 0 q0 22 -12 28 q-22 10 -18 42z" fill="#8aa4ba"/>
  <rect x="1240" y="600" width="70" height="40" rx="4" fill="#dce8f2" transform="rotate(4 1275 620)"/>
</g>
<circle class="slowblink" cx="60" cy="60" r="8" fill="#c94a3d"/>
<text x="84" y="66" font-family="Special Elite" font-size="15" fill="#7f5a5a">COLD ROOM: −40°</text>
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-corelab" cx="1220" cy="210" r="6" fill="#ff9b6a" opacity=".12"/>
<circle cx="1220" cy="210" r="20" fill="#ff9b6a" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-corelab" class="surge" cx="1140" cy="610" rx="96" ry="70" fill="#7fe0ff" opacity="0"/>
<!-- ice crystals turning over in air kept at minus forty -->
<circle class="sparkle" cx="120" cy="40" r="2.4" fill="#dff2ff" style="animation-delay:0.0s"/><circle class="sparkle" cx="257" cy="93" r="2.4" fill="#dff2ff" style="animation-delay:0.7s"/><circle class="sparkle" cx="394" cy="146" r="2.4" fill="#dff2ff" style="animation-delay:1.4s"/><circle class="sparkle" cx="531" cy="199" r="2.4" fill="#dff2ff" style="animation-delay:2.0999999999999996s"/><circle class="sparkle" cx="668" cy="82" r="2.4" fill="#dff2ff" style="animation-delay:2.8s"/><circle class="sparkle" cx="805" cy="135" r="2.4" fill="#dff2ff" style="animation-delay:3.5s"/><circle class="sparkle" cx="942" cy="188" r="2.4" fill="#dff2ff" style="animation-delay:4.199999999999999s"/><circle class="sparkle" cx="1079" cy="71" r="2.4" fill="#dff2ff" style="animation-delay:4.8999999999999995s"/><circle class="sparkle" cx="1216" cy="124" r="2.4" fill="#dff2ff" style="animation-delay:0.5999999999999996s"/><circle class="sparkle" cx="1353" cy="177" r="2.4" fill="#dff2ff" style="animation-delay:1.2999999999999998s"/><circle class="sparkle" cx="130" cy="60" r="2.4" fill="#dff2ff" style="animation-delay:2.0s"/><circle class="sparkle" cx="267" cy="113" r="2.4" fill="#dff2ff" style="animation-delay:2.6999999999999993s"/><circle class="sparkle" cx="404" cy="166" r="2.4" fill="#dff2ff" style="animation-delay:3.3999999999999986s"/>
<ellipse class="steam" cx="1240" cy="700" rx="70" ry="18" fill="#dff2ff" opacity=".08"/>
<ellipse class="steam" cx="1300" cy="660" rx="50" ry="13" fill="#dff2ff" opacity=".06" style="animation-delay:4s"/>
<g opacity=".22"><path d="M1440 470 q30 26 22 62 M1500 500 q-18 34 6 62" stroke="#cfe8ff" stroke-width="2" fill="none"/></g>
<circle class="rippleA" cx="1180" cy="820" r="26" fill="none" stroke="#8fd8ff" stroke-width="2" opacity=".2"/></g>
</svg>`;

/* ---------- Room 4: The Radio Tower ---------- */
SCENES.radiotower=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="eT" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#04070f"/><stop offset=".7" stop-color="#0e1c30"/><stop offset="1" stop-color="#1c2e44"/></linearGradient>
 <linearGradient id="eSnow2" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#8aa4ba"/><stop offset="1" stop-color="#5c7488"/></linearGradient>
</defs>
<rect width="1600" height="640" fill="url(#eT)"/>
<g class="aurora">
  <path d="M150 80 q260 -50 480 20 q260 70 500 -20 q160 -50 320 0 l0 100 q-170 -50 -330 -10 q-240 80 -500 15 q-220 -60 -470 -5z" fill="#3fd68c" opacity=".2"/>
</g>
${Array.from({length:30},(_,i)=>`<circle class="tw" cx="${(i*59+14)%1600}" cy="${(i*19)%180+8}" r="${.6+(i%3)*.6}" fill="#dfe8ff" style="animation-delay:${(i*.5)%4}s"/>`).join('')}
<path d="M0 580 q400 -30 800 -8 t800 -10 v340 h-1600z" fill="url(#eSnow2)"/>
<!-- ground blizzard streaking the runway -->
<line class="gust" x1="0" y1="700" x2="320" y2="692" stroke="#dce8f2" stroke-width="3" opacity=".4" stroke-linecap="round"/>
<line class="gust g2" x1="0" y1="800" x2="280" y2="794" stroke="#dce8f2" stroke-width="3" opacity=".35" stroke-linecap="round"/>
<!-- the mast -->
<g>
  <path d="M760 580 L800 60 L840 580z" fill="none" stroke="#2a3a48" stroke-width="9"/>
  ${[0,1,2,3,4].map(i=>`<line x1="${768+i*3}" y1="${500-i*90}" x2="${832-i*3}" y2="${500-i*90}" stroke="#2a3a48" stroke-width="5"/>`).join('')}
  <line x1="800" y1="60" x2="500" y2="580" stroke="#22303e" stroke-width="3"/>
  <line x1="800" y1="60" x2="1100" y2="580" stroke="#22303e" stroke-width="3"/>
  <circle class="slowblink" cx="800" cy="52" r="9" fill="#c94a3d"/>
</g>
<!-- the generator sled -->
<g id="art-genstart">
  <rect x="180" y="620" width="260" height="130" rx="14" fill="#b03a2a" stroke="#7c2a1e" stroke-width="6"/>
  <circle cx="250" cy="686" r="34" fill="#1a242c" stroke="#0d1216" stroke-width="6"/>
  <path d="M250 686 l22 -16" stroke="#c9a04a" stroke-width="5"/>
  <rect x="310" y="646" width="100" height="50" rx="6" fill="#1a242c"/>
  ${[0,1,2].map(i=>`<circle class="flick" cx="${330+i*30}" cy="671" r="7" fill="#5a4a1a" style="animation-delay:${i*.5}s"/>`).join('')}
  <path d="M420 620 q30 -40 26 -90" stroke="#2a3a48" stroke-width="8" fill="none"/>
  <ellipse class="steam" cx="446" cy="520" rx="14" ry="8" fill="#8aa4ba" opacity=".4"/>
</g>
<!-- tower lockbox -->
<g id="el-lockbox">
  <rect x="700" y="640" width="130 " height="100" rx="8" fill="#46607a" stroke="#2a3a48" stroke-width="5"/>
  <circle cx="765" cy="690" r="18" fill="#0d1216" stroke="#8aa4ba" stroke-width="4"/>
  <text x="765" y="628" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#c8ecff">APPROACH CRYSTAL</text>
</g>
<!-- weather fax (hidden) -->
<g id="el-weather">
  <rect x="920" y="620" width="200" height="140" rx="8" fill="#22303a" stroke="#4c6478" stroke-width="5"/>
  <rect x="936" y="636" width="168" height="80" fill="#dce8f2"/>
  ${[0,1,2].map(i=>`<path d="M944 ${652+i*22} q40 ${(i%2?12:-12)} 80 0 t72 ${(i%2?8:-8)}" stroke="#5a6a78" stroke-width="2.5" fill="none"/>`).join('')}
  <line x1="960" y1="724" x2="1080" y2="724" stroke="#0d1216" stroke-width="4"/>
</g>
<!-- flare cache (hidden) -->
<g id="el-flarebox">
  <rect x="1200" y="640" width="150" height="110" rx="10" fill="#5c1f1a" stroke="#3a1410" stroke-width="6"/>
  ${[0,1,2].map(i=>`<rect x="${1214+i*46}" y="626" width="14" height="60" rx="5" fill="#c94a3d"/>`).join('')}
  <rect x="1240" y="688" width="70" height="30" rx="5" fill="#20140f"/>
</g>
<!-- runway drums stretching away (final signal) -->
<g id="el-runway">
  ${[0,1,2,3,4,5].map(i=>{const k=i/5;const x=760+ i*130, y=828-  i*24, s=1-k*.5;
   return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-20" y="-30" width="40" height="52" rx="6" fill="#46362a"/>
    <circle class="flame" cx="0" cy="-38" r="${9}" fill="#ffb45e" opacity=".9" style="animation-delay:${i*.2}s"/></g>`;}).join('')}
  <path d="M700 870 q380 -60 760 -140" stroke="#3c5064" stroke-width="30" fill="none" opacity=".5"/>
</g>
<!-- the plane's lights, far off -->
<g class="shiplights">
  <circle class="slowblink" cx="1420" cy="240" r="4" fill="#ffd98c"/>
  <circle class="slowblink" cx="1444" cy="246" r="3" fill="#8cd9c0" style="animation-delay:.8s"/>
</g>
<!-- footprints ending mid-field -->
<g opacity=".7">
  ${[0,1,2,3,4].map(i=>`<ellipse cx="${420+i*54}" cy="${800+(i%2)*8}" rx="10" ry="4.5" fill="#46607a"/>`).join('')}
</g>
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-radiotower" cx="230" cy="210" r="6" fill="#ff9b6a" opacity=".12"/>
<circle cx="230" cy="210" r="20" fill="#ff9b6a" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-radiotower" class="surge" cx="580" cy="430" rx="96" ry="70" fill="#7fe0ff" opacity="0"/>
<g class="aurora" style="animation-delay:4s;animation-duration:30s" opacity=".55">
  <path d="M-60 140 q400 -80 800 -10 q400 70 920 -26 l0 90 q-520 100 -920 26 q-400 -74 -800 6z" fill="#5fd8b0" opacity=".12"/>
  <path d="M-60 200 q440 -60 860 10 q420 70 860 -18 l0 58 q-440 92 -860 18 q-420 -70 -860 -2z" fill="#8f7fe8" opacity=".08"/>
</g>
<circle class="tw" cx="60" cy="30" r="1.6" fill="#e8f0ff" style="animation-delay:0.0s"/><circle class="tw" cx="251" cy="77" r="1.6" fill="#e8f0ff" style="animation-delay:0.55s"/><circle class="tw" cx="442" cy="124" r="1.6" fill="#e8f0ff" style="animation-delay:1.1s"/><circle class="tw" cx="633" cy="171" r="1.6" fill="#e8f0ff" style="animation-delay:1.6500000000000001s"/><circle class="tw" cx="824" cy="218" r="1.6" fill="#e8f0ff" style="animation-delay:2.2s"/><circle class="tw" cx="1015" cy="35" r="1.6" fill="#e8f0ff" style="animation-delay:2.75s"/><circle class="tw" cx="1206" cy="82" r="1.6" fill="#e8f0ff" style="animation-delay:3.3000000000000003s"/><circle class="tw" cx="1397" cy="129" r="1.6" fill="#e8f0ff" style="animation-delay:3.8500000000000005s"/><circle class="tw" cx="108" cy="176" r="1.6" fill="#e8f0ff" style="animation-delay:4.4s"/><circle class="tw" cx="299" cy="223" r="1.6" fill="#e8f0ff" style="animation-delay:4.95s"/><circle class="tw" cx="490" cy="40" r="1.6" fill="#e8f0ff" style="animation-delay:0.5s"/><circle class="tw" cx="681" cy="87" r="1.6" fill="#e8f0ff" style="animation-delay:1.0500000000000007s"/><circle class="tw" cx="872" cy="134" r="1.6" fill="#e8f0ff" style="animation-delay:1.6000000000000005s"/><circle class="tw" cx="1063" cy="181" r="1.6" fill="#e8f0ff" style="animation-delay:2.1500000000000004s"/><circle class="tw" cx="1254" cy="228" r="1.6" fill="#e8f0ff" style="animation-delay:2.700000000000001s"/><circle class="tw" cx="1445" cy="45" r="1.6" fill="#e8f0ff" style="animation-delay:3.25s"/><circle class="tw" cx="156" cy="92" r="1.6" fill="#e8f0ff" style="animation-delay:3.8000000000000007s"/><circle class="tw" cx="347" cy="139" r="1.6" fill="#e8f0ff" style="animation-delay:4.350000000000001s"/>
<ellipse class="spindrift" cx="1560" cy="800" rx="34" ry="2.4" fill="#eaf6ff" opacity=".28" style="animation-delay:0.0s;animation-duration:5s"/><ellipse class="spindrift" cx="1560" cy="824" rx="54" ry="2.4" fill="#eaf6ff" opacity=".28" style="animation-delay:1.1s;animation-duration:6s"/><ellipse class="spindrift" cx="1560" cy="848" rx="74" ry="2.4" fill="#eaf6ff" opacity=".28" style="animation-delay:2.2s;animation-duration:7s"/><ellipse class="spindrift" cx="1560" cy="872" rx="34" ry="2.4" fill="#eaf6ff" opacity=".28" style="animation-delay:3.3000000000000003s;animation-duration:5s"/><ellipse class="spindrift" cx="1560" cy="800" rx="54" ry="2.4" fill="#eaf6ff" opacity=".28" style="animation-delay:4.4s;animation-duration:6s"/><ellipse class="spindrift" cx="1560" cy="824" rx="74" ry="2.4" fill="#eaf6ff" opacity=".28" style="animation-delay:5.5s;animation-duration:7s"/><ellipse class="spindrift" cx="1560" cy="848" rx="34" ry="2.4" fill="#eaf6ff" opacity=".28" style="animation-delay:6.6000000000000005s;animation-duration:5s"/>
<circle class="slowblink" cx="1360" cy="150" r="4" fill="#ff9b6a" opacity=".8" style="animation-delay:1.5s"/></g>
</svg>`;

const WRONG_BEATS=[
  "Out in the white, one of the route flags goes down. There is no wind just now.",
  "The footprints outside the window have changed direction since you last looked. There are no new prints.",
  "Under the floor, the permafrost gives one long groan — like something turning over in its sleep.",
  "The dogs' kennel stands open and empty. It has been empty for nine days. So why did something just eat from the bowl?",
  "Between gusts, faint and wrong: your own voices, played back from somewhere out on the ice."
];
const WRONG_SOUNDS=['hiss','knock','growl','clank','hiss'];

/* ============================================================
   THE DRAWINGS, AND THE ROOMS THEY STAND IN

   Every prop is drawn once and used twice: large in the close-up, and small
   standing in the room, so what you can see from across the snow is exactly
   what you read when you lean in.
   ============================================================ */
const C = ART.COL, I = ART.INK, W = ART.words, GL = ART.glyph;

/* ============================================================
   ROOM 1 — THE PERIMETER
   Fresh snow over the ground by the steps, and under it four trails of
   boot prints, each with its own tread, each going somewhere. A row of
   fuel drums: the full ones have sunk into the snow, the empty ones sit on
   top. And a ring of hours round the foot of the mast, with the low sun
   throwing the mast's shadow across it.
   ============================================================ */
const E = { ice: '#dfe9f2', snow: '#f2f7fb', shade: '#b9c9d8', deep: '#7c94ac', steel: '#3a5a78', dark: '#0a1018', ink: '#22303e',
            red: '#b03a2a', redDark: '#7c2a1e', amber: '#ffb46a', lamp: '#ffd9a0' };

/* ---- the ground by the steps: four trails under the new snow ---- */
const TRAILS = [   // tread, where it goes, and the line it takes from the steps
  ['treadVee', 'snowcat', [300, 372, 230, 230, 140, 250, 62, 232]],
  ['treadZig', 'hole', [312, 372, 120, 318, 390, 170, 528, 214]],
  ['treadBars', 'antenna', [290, 372, 340, 250, 150, 160, 168, 74]],
  ['treadDots', 'drum', [304, 372, 262, 262, 520, 210, 438, 74]],
];
const PLACES = { snowcat: [40, 232], hole: [552, 214], antenna: [168, 40], drum: [438, 40] };
const SIGNOUT_MARKS = ['treadZig', 'treadVee', 'treadBars', 'treadDots'];
const SIGNOUT = SIGNOUT_MARKS.map(t => TRAILS.find(x => x[0] === t)[1]);
const bez = (c, t) => { const u = 1 - t; return [0, 1].map(k => u * u * u * c[k] + 3 * u * u * t * c[2 + k] + 3 * u * t * t * c[4 + k] + t * t * t * c[6 + k]); };
const placeTile = (name) => { const [x, y] = PLACES[name]; return `<rect x="${x - 26}" y="${y - 26}" width="52" height="52" rx="10" fill="${E.ink}" stroke="${E.deep}" stroke-width="3"/>` + GL(name, x - 18, y - 18, 36, E.ice); };
const tracksArt = { w: 600, h: 420, body: (() => {
  let b = `<rect width="600" height="420" fill="${E.ice}"/>`;
  for (let i = 0; i < 9; i++) b += `<path d="M${-20 + i * 70} ${40 + (i % 3) * 120}q60 -14 120 0" stroke="${E.shade}" stroke-width="3" fill="none" opacity=".6"/>`;
  b += `<rect x="248" y="372" width="104" height="48" fill="${E.steel}" stroke="${E.ink}" stroke-width="4"/>` + [0, 1, 2].map(i => `<path d="M252 ${384 + i * 12}h96" stroke="${E.ink}" stroke-width="3"/>`).join('');
  TRAILS.forEach(([tread, , c]) => {
    for (let i = 1; i <= 16; i++) {
      const t = i / 17, [x, y] = bez(c, t), [x2, y2] = bez(c, Math.min(1, t + 0.01)), ang = Math.atan2(y2 - y, x2 - x) * 180 / Math.PI, side = i % 2 ? 9 : -9;
      const nx = x - Math.sin(ang * Math.PI / 180) * side, ny = y + Math.cos(ang * Math.PI / 180) * side;
      b += `<g transform="translate(${nx.toFixed(1)} ${ny.toFixed(1)}) rotate(${(ang + 90).toFixed(1)})"><ellipse rx="10" ry="14" fill="${E.shade}"/>${GL(tread, -10, -11, 20, E.deep)}</g>`;
    }
  });
  Object.keys(PLACES).forEach(n => b += placeTile(n));
  return b;
})() };
// the snow that came down after them: it covers the trails, not the places they lead to
const tracksCover = `<rect x="0" y="0" width="600" height="372" fill="${E.snow}"/>`
  + Array.from({ length: 14 }, (_, i) => `<path d="M${(i * 89) % 600} ${30 + (i * 57) % 330}q40 -10 80 0" stroke="${E.ice}" stroke-width="4" fill="none"/>`).join('')
  + Object.keys(PLACES).map(placeTile).join('');

/* ---- the sign-out board by the door ---- */
function signoutBody(open) {
  let b = `<rect x="4" y="4" width="72" height="112" rx="6" fill="#3a2d1a" stroke="#241a10" stroke-width="4"/>`;
  SIGNOUT_MARKS.forEach((t, i) => {
    const y = 16 + i * 24;
    b += `<circle cx="18" cy="${y + 8}" r="3" fill="#8aa4ba"/>` + (open ? '' : `<rect x="24" y="${y}" width="40" height="18" rx="3" fill="${E.ice}"/>` + GL(t, 36, y + 1, 16, E.ink));
  });
  if (open) b += `<rect x="14" y="70" width="52" height="40" rx="4" fill="#120d08"/>`;
  return b;
}
const keyFig = ART.svg(420, 200, `<circle cx="100" cy="100" r="44" fill="none" stroke="#c9a24a" stroke-width="16"/><rect x="140" y="92" width="190" height="16" rx="4" fill="#c9a24a"/><path d="M290 108v28M318 108v20" stroke="#c9a24a" stroke-width="12"/>`
  + `<path d="M56 100L20 60" stroke="#8aa4ba" stroke-width="4"/><rect x="-6" y="18" width="56" height="44" rx="6" fill="${E.red}" transform="rotate(-24 22 40)"/>` + GL('snowcat', 6, 26, 28, E.ice));

/* ---- the fuel drums: the full ones have sunk ---- */
const DRUM_NO = [5, 2, 8, 1, 7, 3, 9, 4];
const FULL = [1, 2, 5, 7];
const SNOWCAT_CODE = FULL.map(i => DRUM_NO[i]).join('');
const drumsGround = `<rect width="680" height="255" fill="${E.ice}"/><path d="M0 196H680" stroke="${E.shade}" stroke-width="3"/>`;
const drumsArt = { w: 680, h: 255, body: (() => {
  let b = '';
  DRUM_NO.forEach((n, i) => {
    const x = 20 + i * 82, full = FULL.includes(i), top = full ? 112 : 70, tilt = i === 6 ? 7 : 0;
    b += `<g transform="rotate(${tilt} ${x + 32} 196)"><rect x="${x}" y="${top}" width="64" height="126" rx="8" fill="${i % 3 === 1 ? E.red : E.steel}" stroke="${E.ink}" stroke-width="3"/>`
      + `<ellipse cx="${x + 32}" cy="${top + 4}" rx="30" ry="6" fill="#000" opacity=".25"/><path d="M${x} ${top + 34}h64M${x} ${top + 78}h64" stroke="${E.ink}" stroke-width="3"/>`
      + W(x + 32, top + 64, String(n), { size: 30, fill: E.ice, weight: 700, face: 'display' }) + `</g>`;
    // a full drum sits low in a ring of snow it has pushed up around itself
    if (full) b += `<path d="M${x - 16} 214q6 -30 24 -34h48q18 4 24 34q-48 14 -96 0Z" fill="${E.snow}" stroke="${E.shade}" stroke-width="2"/>`;
    else b += `<ellipse cx="${x + 32}" cy="198" rx="34" ry="5" fill="${E.shade}"/>`;
  });
  return b;
})() };

/* ---- the snowcat ---- */
function snowcatBody(st) {
  let b = '';
  b += `<rect x="40" y="110" width="240" height="72" rx="12" fill="${E.red}" stroke="${E.ink}" stroke-width="4"/><rect x="70" y="56" width="120" height="62" rx="8" fill="${E.redDark}" stroke="${E.ink}" stroke-width="4"/>`;
  b += `<rect x="82" y="66" width="44" height="34" rx="4" fill="${st.solved ? '#ffe7b0' : E.dark}"/><rect x="134" y="66" width="44" height="34" rx="4" fill="${st.solved ? '#ffe7b0' : E.dark}"/>`;
  b += `<rect x="200" y="124" width="28" height="22" rx="3" fill="${E.ink}"/>` + [0, 1, 2].map(r => [0, 1, 2].map(c => `<rect x="${203 + c * 8}" y="${127 + r * 6}" width="5" height="4" fill="${st.live ? '#8aa4ba' : '#3a4a5a'}"/>`).join('')).join('');
  b += `<rect x="30" y="178" width="260" height="30" rx="15" fill="#1a2430"/>` + [0, 1, 2, 3, 4].map(i => `<circle cx="${58 + i * 52}" cy="193" r="9" fill="#3a4a5a"/>`).join('');
  b += `<path d="M0 218Q30 186 110 196T250 190T320 214Q300 222 160 222T0 218Z" fill="${E.snow}"/>`;
  if (st.solved) b += `<circle cx="276" cy="96" r="10" fill="#cfd8e0" opacity=".5"/><circle cx="290" cy="76" r="14" fill="#cfd8e0" opacity=".35"/><rect x="268" y="96" width="10" height="20" fill="${E.ink}"/>`;
  return b;
}

/* ---- the sun ring at the mast's foot ---- */
const SHADOW = 16.5;
const RING_TIME = '4:30';
const ringBody = (() => {
  const cx = 260, cy = 260, at = (h, r) => { const a = (90 + (h - SHADOW) * 15) * Math.PI / 180; return [cx + Math.sin(a) * r, cy - Math.cos(a) * r]; };
  let b = `<circle cx="${cx}" cy="${cy}" r="248" fill="${E.ice}" stroke="${E.shade}" stroke-width="6"/><circle cx="${cx}" cy="${cy}" r="214" fill="none" stroke="${E.ink}" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="160" fill="none" stroke="${E.ink}" stroke-width="2" opacity=".5"/>`;
  for (let h = 0; h < 24; h++) {
    const [x1, y1] = at(h, 200), [x2, y2] = at(h, 214), [tx, ty] = at(h, 184);
    b += `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)}L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${E.ink}" stroke-width="3"/>` + W(tx, ty + 7, String(h), { size: 20, fill: E.ink, weight: 700, face: 'num' });
  }
  // the low sun is to the west; the mast's shadow runs the other way, long, across the ring
  const [sx, sy] = at(SHADOW, 238);
  b += `<path d="M${cx} ${cy - 7}L${sx.toFixed(1)} ${(sy - 3).toFixed(1)}L${sx.toFixed(1)} ${(sy + 3).toFixed(1)}L${cx} ${cy + 7}Z" fill="#30455c" opacity=".78"/>`;
  b += `<circle cx="${cx}" cy="${cy}" r="16" fill="${E.ink}"/><circle cx="${cx}" cy="${cy}" r="7" fill="#8aa4ba"/>`;
  return b;
})();
const sundialArt = { w: 600, h: 520, body: `<rect width="600" height="520" fill="#c9d6e2"/><ellipse cx="0" cy="260" rx="70" ry="120" fill="${E.amber}" opacity=".35"/><circle cx="16" cy="260" r="20" fill="${E.lamp}"/>`
  + `<g transform="translate(60 0)">${ringBody}</g>` };
const mastBody = `<path d="M160 20V600" stroke="#2a3a48" stroke-width="12"/><path d="M160 60L60 600M160 60L260 600" stroke="#4c6478" stroke-width="2" opacity=".7"/>`
  + `<path d="M160 20l-26 26M160 20l26 26M140 100h40" stroke="#2a3a48" stroke-width="5"/>`
  + ART.inset(0, 560, 320, 104, 520, 520, ringBody) + `<path d="M160 600L320 612" stroke="#30455c" stroke-width="10" opacity=".55"/>`;

/* ---- the storm door ---- */
function doorBody(st) {
  let b = `<rect x="6" y="6" width="128" height="198" rx="8" fill="#22303e" stroke="#4c6478" stroke-width="6"/>`;
  if (st.solved) b += `<rect x="14" y="14" width="112" height="182" fill="#ffe7b0" opacity=".85"/><path d="M14 14l-16 10v182l16 -8Z" fill="#2c4660" stroke="#4c6478" stroke-width="3"/>`;
  else {
    b += `<path d="M20 30h100M20 170h100" stroke="#2c4660" stroke-width="5"/><circle cx="112" cy="104" r="8" fill="${E.dark}" stroke="#8aa4ba" stroke-width="3"/>`;
    b += ART.clockFace(70, 98, 30, 12, 0, { face: st.live ? '#f2ead2' : '#5a6a7a', ink: '#1c1408', rim: '#8aa4ba' });
  }
  if (st.live && !st.solved) b += `<path d="M70 204C60 230 -40 250 -120 300" stroke="#1a2430" stroke-width="5" fill="none"/>`;
  return b;
}

const POS1 = {
  sundial: { x: 23.75, y: 10,   w: 20,   h: 74.4 },
  snowcat: { x: 2.5,   y: 67.8, w: 20,   h: 24.4 },
  drums:   { x: 43.75, y: 76.7, w: 25,   h: 16.7 },
  tracks:  { x: 67.5,  y: 81.1, w: 30,   h: 17.8 },
  door:    { x: 75.6,  y: 42.2, w: 8.75, h: 23.3 },
  signout: { x: 70,    y: 44.4, w: 5,    h: 13.3 },
};

const ROOM1 = {
  id:'perimeter', name:'Room 1 — The Perimeter', scene:'perimeter',
  stageFx:'gust',
  relays:[{el:'rl-perimeter',mode:'pulse',period:3.2}],
  wrongSound:'hiss',
  wrongVfx:'shake',
  intro:"Nine days of silence. The plane drops you at the flag line and doesn't cut its engines.",
  objective:"Get inside before the front hits — <b>glowing rings</b> mark what the ice hasn't buried yet. Whatever opens a lock is somewhere else out here.",
  entryBeat:"The plane banks away without waiting. In the snow by the steps, something has been round and round the station — in a circle, as if it were looking for a door.",
  entrySound:'hiss',
  completeText:"The storm door's timer runs down and the bolts draw back. Warm air — warm — breathes out of the station at you. Somebody kept the heating on.",
  chain:`Under the new snow by the steps, four trails of boot prints leave the station, each with its own tread: the zigzag soles go to the ice hole, the chevrons to the snowcat, the bars to the mast and the dots to the fuel drums, and the sign-out board's four tags are set ${SIGNOUT.join(', ')} → the board gives up the snowcat's key; of the eight fuel drums the full ones have sunk into the snow and the empty ones sit on top, and the snowcat's fuel selector takes the full ones' numbers, left to right: ${SNOWCAT_CODE} → the snowcat's jump leads wake the storm door's timer, and the mast's shadow lies halfway between 16 and 17 on the sun ring: ${RING_TIME}.`,
  objects:[
    { id:'tracks', icon:'👣', name:'Snow by the Steps', pos:POS1.tracks,
      desc:"New snow, a few days deep, over the ground at the foot of the steps. Something under it has kept its shape.",
      figure:ART.svg(tracksArt.w, tracksArt.h, tracksArt.body),
      tool:{ type:'brush', r:30, cover:tracksCover, label:'drag across the snow to sweep it away' },
      sprite:ART.sprite(POS1.tracks, 600, 200, `<path d="M10 150Q80 60 200 70T420 56T590 130Q600 190 300 196T10 150Z" fill="${E.snow}" opacity=".9"/>`
        + [[120, 120], [260, 104], [380, 132], [480, 100]].map(([x, y]) => `<path d="M${x - 40} ${y}q40 -14 80 0" stroke="${E.shade}" stroke-width="4" fill="none"/>`).join('')) },
    { id:'signout', icon:'🏷️', name:'Sign-out Board', pos:POS1.signout,
      desc:"A tag for everyone who goes out, and a picture to turn to say where. Each tag is stamped with the tread of a boot.",
      sprite:st=>ART.sprite(POS1.signout, 80, 120, signoutBody(st.solved)),
      puzzle:{ type:'combo', from:['tracks'], wheels:SIGNOUT_MARKS.map(g=>({ faces:{ glyphs:['snowcat', 'antenna', 'drum', 'hole', 'flag', 'penguin'] }, mark:{ glyph:g } })), answer:SIGNOUT, tryLabel:'SIGN THEM BACK',
        miss:"The board's catch stays down.",
        hints:[
          "Four tags, each stamped with a boot's tread, and a picture of where that boot went. The snow at the foot of the steps has been walked on.",
          "Sweep the new snow away by the steps: four trails of prints come out from under it, each with a different tread, each to a different place at the edge.",
          `Zigzag to the hole, chevrons to the snowcat, bars to the mast, dots to the drums: ${SIGNOUT.join(', ')}.`
        ],
        solvedText:"The four tags turn, and the catch under the board lets go. Behind it, on its own hook, the snowcat's key.",
        inside:{ name:"The snowcat's key", figure:keyFig } } },
    { id:'drums', icon:'🛢️', name:'Fuel Drums', pos:POS1.drums,
      desc:"Eight drums in a row, stencilled with numbers. Some stand on the snow; some have settled into it.",
      figure:ART.svg(drumsArt.w, drumsArt.h, drumsGround + drumsArt.body),
      sprite:ART.sprite(POS1.drums, drumsArt.w, drumsArt.h, drumsArt.body) },
    { id:'snowcat', icon:'🚜', name:'The Snowcat', pos:POS1.snowcat, needs:'signout',
      desc:"Its fuel selector has a pad for drum numbers: draw from the full ones and nothing else.",
      deadDesc:"Half-buried and locked, with its key nowhere near it. Someone signs it out, somewhere.",
      deadFigure:st=>ART.svg(320, 220, snowcatBody(st)),
      sprite:st=>ART.sprite(POS1.snowcat, 320, 220, snowcatBody(st)),
      puzzle:{ type:'keypad', from:['drums'], answer:SNOWCAT_CODE,
        miss:"The pump coughs on air and stops. One of those was empty.",
        hints:[
          "A fuel selector wants drum numbers, and there are eight drums in a row by the station.",
          "The full drums are heavy: they have sunk into the snow. The empty ones sit on top of it. Key in the full ones' numbers, left to right.",
          `The full drums are ${SNOWCAT_CODE.split('').join(', ')}.`
        ],
        solvedText:"Fuel knocks through the lines and the snowcat's engine catches on the third turn. Its jump leads will reach the station steps." } },
    { id:'sundial', icon:'☀️', name:'The Mast', pos:POS1.sundial, ringAt:[50, 88],
      desc:"The radio mast, and round its foot a ring of hours painted on a disc of planking. The sun is so low its shadow crosses the whole ring.",
      figure:ART.svg(sundialArt.w, sundialArt.h, sundialArt.body),
      sprite:ART.sprite(POS1.sundial, 320, 670, mastBody) },
    { id:'door', icon:'🚪', name:'Storm Door', pos:POS1.door, needs:'snowcat',
      desc:"The storm door's timer is lit now, running off the snowcat. It opens at the hour it is set to, and only if that hour is now.",
      deadDesc:"The storm door is bolted on a timer, and the timer has been dead since the generator stopped.",
      deadFigure:st=>ART.svg(140, 210, doorBody(st)),
      sprite:st=>ART.sprite(POS1.door, 140, 210, doorBody(st)),
      puzzle:{ type:'clock', from:['sundial'], start:{h:12,m:0}, answer:RING_TIME, tryLabel:'SET THE TIMER',
        miss:"The timer clicks, and the bolts stay where they are. That is not now.",
        hints:[
          "The door wants the time of day, and every clock in the station stopped with the power. The sun didn't.",
          "The ring of hours round the mast is a sundial: the mast's shadow lies across it and points at the hour. It counts all twenty-four; the timer only twelve.",
          `The shadow lies halfway between 16 and 17: half past four, ${RING_TIME}.`
        ],
        solvedText:"The timer runs out its last minute, and the bolts draw back." } },
  ]
};

/* ============================================================
   ROOM 2 — CREW QUARTERS
   The crew's last game of snakes and ladders, abandoned before anyone
   moved: four counters on the start and each player's two dice on their
   own mat. The foot locker wants the colour each one would have landed
   on. Inside it is the station's thermal camera, and through it the
   generator room door's keypad shows which keys a warm finger pressed,
   fading in the order it pressed them, and the day tanks show how full
   they are.
   ============================================================ */

/* ---- the game on the table ---- */
const SQ_COL = {
  1: 'yellow', 2: 'blue', 3: 'green', 4: 'red', 5: 'white',
  6: 'yellow', 7: 'blue', 8: 'black', 9: 'green', 10: 'red',
  11: 'blue', 12: 'white', 13: 'red', 14: 'green', 15: 'black',
  16: 'green', 17: 'white', 18: 'blue', 19: 'red', 20: 'yellow',
  21: 'black', 22: 'green', 23: 'yellow', 24: 'red', 25: 'white',
};
const LADDERS = [[7, 17], [9, 19], [15, 25]];
const SNAKES = [[11, 1], [23, 13]];
// Each player's two dice. Neither die alone lands on a snake or a ladder, so it makes no difference which is
// counted first; and every counter is still on the start, so nobody has moved yet.
const PLAYERS = [['penguin', [2, 6]], ['bird', [5, 6]], ['fish', [3, 4]], ['crab', [4, 5]]];
const landsOn = (n) => { const j = LADDERS.find(x => x[0] === n) || SNAKES.find(x => x[0] === n); return j ? j[1] : n; };
const LOCKER_MARKS = ['fish', 'crab', 'penguin', 'bird'];
const ROLLED = Object.fromEntries(PLAYERS.map(([t, d]) => [t, d[0] + d[1]]));
const LOCKER = LOCKER_MARKS.map(t => SQ_COL[landsOn(ROLLED[t])]);

const BD = { x: 74, y: 16, s: 76 };
const sqCorner = (n) => { const r = Math.floor((n - 1) / 5), i = (n - 1) % 5, c = r % 2 ? 4 - i : i; return [BD.x + c * BD.s, BD.y + (4 - r) * BD.s]; };
const sqMid = (n, dx = 0, dy = 0) => { const [x, y] = sqCorner(n); return [x + BD.s / 2 + dx, y + BD.s / 2 + dy]; };
const PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };
const die = (x, y, n, s, rot) => `<g transform="rotate(${rot} ${x + s / 2} ${y + s / 2})"><rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.18}" fill="#f4efe2" stroke="#2a1e12" stroke-width="2.5"/>`
  + PIPS[n].map(([u, v]) => `<circle cx="${(x + s / 2 + u * s * 0.27).toFixed(1)}" cy="${(y + s / 2 + v * s * 0.27).toFixed(1)}" r="${(s * 0.09).toFixed(1)}" fill="#1a1410"/>`).join('') + `</g>`;
const counter = (name, cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${E.ice}" stroke="${E.ink}" stroke-width="3"/>` + GL(name, cx - r * 0.66, cy - r * 0.66, r * 1.32, E.ink);
function ladderArt(a, b) {
  const [x1, y1] = a, [x2, y2] = b, len = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / len, uy = (y2 - y1) / len, nx = -uy * 11, ny = ux * 11;
  let d = '';
  for (let t = 16; t < len - 8; t += 21) { const px = x1 + ux * t, py = y1 + uy * t; d += `M${(px + nx).toFixed(1)} ${(py + ny).toFixed(1)}L${(px - nx).toFixed(1)} ${(py - ny).toFixed(1)}`; }
  [1, -1].forEach(k => { d += `M${(x1 + k * nx).toFixed(1)} ${(y1 + k * ny).toFixed(1)}L${(x2 + k * nx).toFixed(1)} ${(y2 + k * ny).toFixed(1)}`; });
  return `<path d="${d}" stroke="#2a1a0c" stroke-width="9" stroke-linecap="round" fill="none"/><path d="${d}" stroke="#c99a5a" stroke-width="5" stroke-linecap="round" fill="none"/>`;
}
function snakeArt(a, b) {
  const [x1, y1] = a, [x2, y2] = b, len = Math.hypot(x2 - x1, y2 - y1), nx = -(y2 - y1) / len, ny = (x2 - x1) / len;
  const pts = [];
  for (let k = 0; k <= 36; k++) {
    const t = k / 36, w = Math.sin(t * Math.PI * 2.2) * Math.min(14, len / 9) * Math.min(1, t * 6);
    pts.push([x1 + (x2 - x1) * t + nx * w, y1 + (y2 - y1) * t + ny * w]);
  }
  let out = '', body = '';
  for (let k = 0; k < 36; k++) {
    const t = k / 36, wd = 15 * (1 - 0.75 * t * t), [ax, ay] = pts[k], [bx, by] = pts[k + 1];
    const seg = `M${ax.toFixed(1)} ${ay.toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}`;
    out += `<path d="${seg}" stroke="#24123a" stroke-width="${(wd + 4).toFixed(1)}" stroke-linecap="round"/>`;
    body += `<path d="${seg}" stroke="${k % 4 < 2 ? '#7a4fa0' : '#9a6ac4'}" stroke-width="${wd.toFixed(1)}" stroke-linecap="round"/>`;
  }
  const ang = Math.atan2(pts[1][1] - y1, pts[1][0] - x1) * 180 / Math.PI + 180;
  const head = `<g transform="translate(${x1.toFixed(1)} ${y1.toFixed(1)}) rotate(${ang.toFixed(1)})"><path d="M14 0l12 -4M14 0l12 4" stroke="#c0392b" stroke-width="2.5"/>`
    + `<ellipse rx="16" ry="12" fill="#7a4fa0" stroke="#24123a" stroke-width="3"/><circle cx="5" cy="-6" r="3.4" fill="#fff"/><circle cx="5" cy="6" r="3.4" fill="#fff"/>`
    + `<circle cx="6" cy="-6" r="1.6" fill="#000"/><circle cx="6" cy="6" r="1.6" fill="#000"/></g>`;
  return out + body + head;
}
const boardArt = { w: 640, h: 420, body: (() => {
  let b = `<rect width="640" height="420" fill="#4a3826"/>` + Array.from({ length: 7 }, (_, i) => `<path d="M0 ${30 + i * 62}Q320 ${16 + i * 62} 640 ${34 + i * 62}" stroke="#3e2e1e" stroke-width="3" fill="none"/>`).join('');
  b += `<rect x="${BD.x - 6}" y="${BD.y - 6}" width="${BD.s * 5 + 12}" height="${BD.s * 5 + 12}" rx="6" fill="#1c140c"/>`;
  for (let n = 1; n <= 25; n++) {
    const [x, y] = sqCorner(n), c = SQ_COL[n], dark = ['blue', 'red', 'green', 'black'].includes(c);
    b += `<rect x="${x}" y="${y}" width="${BD.s}" height="${BD.s}" fill="${C[c]}" stroke="#1c140c" stroke-width="2"/>`
      + W(x + 7, y + 21, String(n), { size: 17, fill: dark ? '#f4efe2' : '#2a1e12', weight: 700, face: 'num', anchor: 'start' });
  }
  // every ladder and snake keeps to the right of its squares, clear of the numbers in their top left corners
  LADDERS.forEach(([f, t]) => { b += ladderArt(sqMid(f, 12, 18), sqMid(t, 12, 4)); });
  SNAKES.forEach(([h, t]) => { b += snakeArt(sqMid(h, 14, 4), sqMid(t, 14, 18)); });
  // the start, off the board before square 1, with all four counters still on it
  b += `<rect x="4" y="300" width="62" height="96" rx="8" fill="#e8dcc0" stroke="#2a1e12" stroke-width="3"/>`
    + `<path d="M14 384H58M48 376l10 8l-10 8" stroke="#2a1e12" stroke-width="4" fill="none" stroke-linecap="round"/>`;
  PLAYERS.forEach(([t], i) => { b += counter(t, 21 + (i % 2) * 28, 320 + Math.floor(i / 2) * 32, 13); });
  // each player's mat, with their two dice on it
  PLAYERS.forEach(([t, [d1, d2]], i) => {
    const y = 18 + i * 98;
    b += `<rect x="476" y="${y}" width="156" height="88" rx="10" fill="#2f4a3a" stroke="#1a2a20" stroke-width="3"/>` + counter(t, 506, y + 44, 21)
      + die(538, y + 24, d1, 38, -8 + i * 5) + die(584, y + 26, d2, 38, 6 - i * 4);
  });
  return b;
})() };
// lying flat on the table, from across the room
const boardSprite = `<path d="M26 18H334L356 134H4Z" fill="#5a4630" stroke="#2e2416" stroke-width="3"/><rect x="4" y="134" width="352" height="14" fill="#3a2c1c"/>`
  + `<rect x="18" y="148" width="14" height="52" fill="#2e2416"/><rect x="328" y="148" width="14" height="52" fill="#2e2416"/>`
  + `<g transform="matrix(0.5 0 0 0.25 20 24)">${boardArt.body.replace(/^<rect width="640" height="420" fill="#4a3826"\/>/, '')}</g>`;

/* ---- the foot locker at the end of the bunks ---- */
function footlockerBody(st) {
  let b = '';
  if (st.solved) {
    b += `<path d="M16 34L28 -4H192L204 34Z" fill="#5b7c60" stroke="#1e2a20" stroke-width="4"/><rect x="16" y="34" width="188" height="70" rx="6" fill="#16201a" stroke="#1e2a20" stroke-width="4"/>`
      + `<rect x="16" y="56" width="188" height="48" rx="6" fill="#4c6a52" stroke="#1e2a20" stroke-width="4"/>`;
  } else {
    b += `<rect x="16" y="30" width="188" height="74" rx="6" fill="#4c6a52" stroke="#1e2a20" stroke-width="4"/><rect x="12" y="22" width="196" height="24" rx="6" fill="#5b7c60" stroke="#1e2a20" stroke-width="4"/>`
      + `<rect x="88" y="44" width="44" height="30" rx="4" fill="#20282c" stroke="#8aa4ba" stroke-width="2"/>`
      + [0, 1, 2, 3].map(i => `<rect x="${93 + i * 9}" y="50" width="6" height="18" rx="2" fill="#5a6a72"/>`).join('');
  }
  b += `<path d="M48 ${st.solved ? 56 : 24}V104M172 ${st.solved ? 56 : 24}V104" stroke="#8aa4ba" stroke-width="6"/>`;
  return b;
}
const cameraFig = ART.svg(480, 300, `<defs><linearGradient id="therm" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#2a1450"/><stop offset=".3" stop-color="#a0287a"/>`
  + `<stop offset=".55" stop-color="#e0442a"/><stop offset=".75" stop-color="#f7931e"/><stop offset=".9" stop-color="#ffd23f"/><stop offset="1" stop-color="#fffbe6"/></linearGradient></defs>`
  + `<path d="M300 210l44 76h70l-46 -96Z" fill="#20262c" stroke="#101418" stroke-width="4"/>`
  + `<rect x="30" y="30" width="370" height="200" rx="24" fill="#2a3138" stroke="#101418" stroke-width="5"/><circle cx="400" cy="130" r="54" fill="#1a1e22" stroke="#101418" stroke-width="5"/><circle cx="400" cy="130" r="30" fill="#3a2a5a"/><circle cx="390" cy="118" r="8" fill="#8a7ab0" opacity=".6"/>`
  + `<rect x="52" y="50" width="250" height="160" rx="6" fill="#170b33"/>`
  // on its screen: a mug of something hot, in the colours a thermal camera uses
  + `<path d="M126 102h86v74q0 18 -18 18h-50q-18 0 -18 -18Z" fill="#f7931e"/><path d="M212 118q30 0 30 26t-30 24" stroke="#e0442a" stroke-width="10" fill="none"/>`
  + `<ellipse cx="169" cy="104" rx="42" ry="8" fill="#fffbe6"/><path d="M136 150h66v24q0 12 -12 12h-42q-12 0 -12 -12Z" fill="#ffd23f"/>`
  + `<path d="M150 90q-10 -14 2 -26M172 88q-10 -16 2 -30M194 90q-10 -14 2 -26" stroke="#a0287a" stroke-width="5" fill="none" stroke-linecap="round"/>`
  + `<rect x="314" y="58" width="18" height="144" rx="4" fill="url(#therm)" stroke="#101418" stroke-width="2"/>`
  + GL('flame', 312, 26, 22, '#ffd23f') + GL('snowflake', 312, 206, 22, '#8a7ab0'));

/* ---- the day tanks along the end wall ---- */
const TANK_ORDER = ['yellow', 'red', 'blue', 'green'];              // left to right along the wall
const TANK_LEVEL = { yellow: 2, red: 5, blue: 1, green: 4 };
const PANEL_ORDER = ['red', 'yellow', 'green', 'blue'];             // left to right on the generator's panel
const PANEL = PANEL_ORDER.map(c => TANK_LEVEL[c]);
const TK = { x: (i) => 36 + i * 142, w: 116, top: 56, bot: 360, band: 56 };
const seamY = (j) => TK.bot - j * TK.band;                            // the weld at the top of band j
const tankShell = (x, fill, stroke) => `<rect x="${x}" y="${TK.top}" width="${TK.w}" height="${TK.bot - TK.top}" rx="26" fill="${fill}" stroke="${stroke}" stroke-width="4"/>`;
const tanksBody = (() => {
  let b = `<path d="M${TK.x(0) + TK.w / 2} ${TK.top}V28H600" stroke="#4c6478" stroke-width="10" fill="none"/>`;
  TANK_ORDER.forEach((c, i) => {
    const x = TK.x(i);
    b += `<path d="M${x + TK.w / 2} ${TK.top}V28" stroke="#4c6478" stroke-width="10"/><rect x="${x + TK.w / 2 - 12}" y="36" width="24" height="12" rx="3" fill="#2a3640"/>`
      + `<rect x="${x + 12}" y="${TK.bot}" width="14" height="22" fill="${E.ink}"/><rect x="${x + TK.w - 26}" y="${TK.bot}" width="14" height="22" fill="${E.ink}"/>`
      + tankShell(x, '#5c7488', E.ink);
    for (let j = 1; j <= 5; j++) b += `<path d="M${x + 3} ${seamY(j)}H${x + TK.w - 3}" stroke="#40566a" stroke-width="3"/>`;
    b += `<rect x="${x + 3}" y="${seamY(5) + 10}" width="${TK.w - 6}" height="18" fill="${C[c]}" stroke="${E.ink}" stroke-width="2"/>`;
  });
  return b;
})();
const tanksBack = `<rect width="600" height="400" fill="#26323c"/><rect y="382" width="600" height="18" fill="#161c22"/>`;
// through the camera: the fuel holds the tank heaters' warmth, and the empty steel above it is as cold as the room
const tanksThermal = (() => {
  let b = `<rect width="600" height="400" fill="#170b33"/><path d="M${TK.x(0) + TK.w / 2} ${TK.top}V28H600" stroke="#2a1450" stroke-width="10" fill="none"/>`;
  TANK_ORDER.forEach((c, i) => {
    const x = TK.x(i), top = seamY(TANK_LEVEL[c]);
    b += `<path d="M${x + TK.w / 2} ${TK.top}V28" stroke="#2a1450" stroke-width="10"/>` + tankShell(x, '#24104a', '#4a2a7a')
      + `<path d="M${x + 2} ${top}H${x + TK.w - 2}V${TK.bot - 26}Q${x + TK.w - 2} ${TK.bot - 2} ${x + TK.w - 28} ${TK.bot - 2}H${x + 28}Q${x + 2} ${TK.bot - 2} ${x + 2} ${TK.bot - 26}Z" fill="#f7931e"/>`
      + `<rect x="${x + 2}" y="${top}" width="${TK.w - 4}" height="14" fill="#ffd23f"/><rect x="${x + 2}" y="${top}" width="${TK.w - 4}" height="4" fill="#fffbe6"/>`
      + `<rect x="${x + 10}" y="${TK.bot - 30}" width="${TK.w - 20}" height="18" rx="8" fill="#e0442a" opacity=".6"/>`;
    for (let j = 1; j <= 5; j++) b += `<path d="M${x + 3} ${seamY(j)}H${x + TK.w - 3}" stroke="${seamY(j) >= top ? '#c45a1a' : '#4a2a7a'}" stroke-width="3"/>`;
  });
  return b;
})();

/* ---- the generator room door, and its keypad ---- */
const DOOR_CODE = ['3', '8', '1', '6', '9'];                         // the order a warm finger pressed them in
const HEAT = ['#b0287a', '#e0442a', '#f7931e', '#ffd23f', '#fffbe6']; // from the oldest print to the newest
const keyAt = (d) => { const i = d === '0' ? 10 : +d - 1; return [52 + (i % 3) * 92, 66 + Math.floor(i / 3) * 94]; };
const keypadBody = (() => {
  let b = `<rect width="360" height="470" fill="#1b252e"/><rect x="16" y="10" width="328" height="450" rx="22" fill="#2e3c48" stroke="#4c6478" stroke-width="5"/>`
    + `<circle cx="180" cy="38" r="8" fill="#7c2a1e" stroke="#101418" stroke-width="2"/>`;
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].forEach(d => {
    const [x, y] = keyAt(d);
    b += `<g data-key="${d}" data-x="${x + 40}" data-y="${y + 39}"><rect x="${x}" y="${y}" width="80" height="78" rx="12" fill="#cfd8e0" stroke="#14202a" stroke-width="4"/>`
      + W(x + 40, y + 52, d, { size: 38, fill: '#22303e', weight: 700, face: 'num' }) + `</g>`;
  });
  [[52, 348], [236, 348]].forEach(([x, y]) => { b += `<rect x="${x}" y="${y}" width="80" height="78" rx="12" fill="#3a4a58" stroke="#14202a" stroke-width="4"/>`; });
  return b;
})();
const keypadThermal = (() => {
  let b = `<rect width="360" height="470" fill="#170b33"/><rect x="16" y="10" width="328" height="450" rx="22" fill="#21103e" stroke="#3a1d6a" stroke-width="5"/>`;
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].forEach(d => {
    const [x, y] = keyAt(d);
    b += `<rect x="${x}" y="${y}" width="80" height="78" rx="12" fill="#2e1858" stroke="#3a1d6a" stroke-width="4"/>` + W(x + 40, y + 52, d, { size: 38, fill: '#4a2c80', weight: 700, face: 'num' });
  });
  [[52, 348], [236, 348]].forEach(([x, y]) => { b += `<rect x="${x}" y="${y}" width="80" height="78" rx="12" fill="#2a1450" stroke="#3a1d6a" stroke-width="4"/>`; });
  DOOR_CODE.forEach((d, i) => {
    const [x, y] = keyAt(d), cx = x + 40, cy = y + 44, rx = 13 + i * 2.2, ry = 18 + i * 2.4;
    b += `<ellipse cx="${cx}" cy="${cy}" rx="${(rx + 13).toFixed(1)}" ry="${(ry + 13).toFixed(1)}" fill="${HEAT[i]}" opacity=".18"/>`
      + `<ellipse cx="${cx}" cy="${cy}" rx="${(rx + 6).toFixed(1)}" ry="${(ry + 6).toFixed(1)}" fill="${HEAT[i]}" opacity=".45"/>`
      + `<ellipse cx="${cx}" cy="${cy}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${HEAT[i]}"/>`;
  });
  return b;
})();
function gendoorBody(st) {
  let b = `<rect x="4" y="4" width="152" height="392" rx="6" fill="#141c22" stroke="#4c6478" stroke-width="6"/>`;
  if (st.solved) {
    const on = st.open && st.open.genpanel;
    b += `<rect x="12" y="12" width="136" height="380" fill="${on ? '#3a3226' : '#0b1014'}"/>`
      + `<rect x="20" y="268" width="128" height="118" rx="8" fill="#22303a" stroke="#3a4c5c" stroke-width="3"/><path d="M34 290h96M34 310h96" stroke="#3a4c5c" stroke-width="3"/>`
      + `<path d="M12 12L-8 26V378L12 392Z" fill="#3a5a78" stroke="#22303e" stroke-width="3"/>`;
    if (on) b += `<rect x="12" y="12" width="136" height="380" fill="#ffd9a0" opacity=".16"/>`;
  } else {
    b += `<rect x="12" y="12" width="136" height="380" fill="#3a5a78"/>` + [80, 170, 260].map(y => `<path d="M18 ${y}H142" stroke="#2c4660" stroke-width="5"/>`).join('')
      + `<path d="M12 352L148 352" stroke="#22303e" stroke-width="3"/>` + [0, 1, 2, 3, 4].map(i => `<path d="M${16 + i * 30} 390L${40 + i * 30} 356" stroke="${E.amber}" stroke-width="9"/>`).join('')
      + `<rect x="108" y="176" width="34" height="44" rx="4" fill="#2e3c48" stroke="#8aa4ba" stroke-width="2"/>`
      + Array.from({ length: 12 }, (_, i) => `<rect x="${112 + (i % 3) * 10}" y="${180 + Math.floor(i / 3) * 10}" width="7" height="7" rx="1.5" fill="#cfd8e0"/>`).join('')
      + `<circle cx="125" cy="232" r="3" fill="#7c2a1e"/><rect x="118" y="244" width="22" height="9" rx="4" fill="#8aa4ba"/>`;
  }
  return b;
}

/* ---- the generator panel, through the door ---- */
function genpanelBody(st) {
  let b = `<rect x="4" y="4" width="88" height="132" rx="8" fill="#2e3c48" stroke="#8aa4ba" stroke-width="3"/>`;
  PANEL_ORDER.forEach((c, i) => {
    const x = 14 + i * 19, lvl = st.solved ? PANEL[i] : 0;
    b += `<rect x="${x}" y="22" width="13" height="96" rx="3" fill="#0b1014" stroke="${C[c]}" stroke-width="2.5"/>`;
    if (lvl) b += `<rect x="${x + 2}" y="${120 - lvl * 19}" width="9" height="${lvl * 19 - 4}" fill="${C[c]}"/>`;
  });
  return b;
}

const POS2 = {
  boardgame:  { x: 3.75,  y: 67.8, w: 22.5,  h: 22.2 },
  footlocker: { x: 29.4,  y: 74.4, w: 13.75, h: 12.2 },
  tanks:      { x: 67.5,  y: 47.8, w: 20.6,  h: 24.4 },
  gendoor:    { x: 88.75, y: 26.7, w: 10,    h: 44.4 },
  genpanel:   { x: 90.75, y: 36.7, w: 6,     h: 15.6 },
};
const ROLL_SAY = PLAYERS.map(([t, [a, b2]]) => { const n = a + b2, to = landsOn(n); return `${t} ${a}+${b2} = ${n}` + (to === n ? '' : `, ${to > n ? 'up the ladder' : 'down the snake'} to ${to}`); });

const ROOM2 = {
  id:'quarters', name:'Room 2 — Crew Quarters', scene:'quarters',
  relays:[{el:'rl-quarters',mode:'pulse',period:3.8}],
  wrongSound:'creak',
  wrongVfx:'shadow',
  intro:"The bunks are made. The parkas are on their hooks. Nobody is here, and the heater is still running.",
  objective:"The station is on its last battery: <b>start the generator</b>. Whatever opens a lock is somewhere else in this room.",
  entryBeat:"Five parkas on the hooks, and outside it is forty below. Wherever the crew went, they went without their coats.",
  entrySound:'knock',
  completeText:"The generator catches on the second crank, and the station's lights march away from you building by building, out toward the core lab. The last building lights with something already standing at its window. By the time anyone can point, it isn't.",
  chain:`On the table, a game of snakes and ladders nobody got to move in: all four counters on the start and two dice on each player's mat — ${ROLL_SAY.join('; ')}. The foot locker's wheels are marked ${LOCKER_MARKS.join(', ')} and take the colours they land on: ${LOCKER.join(', ')} → inside, the station's thermal camera. Through it five keys on the generator room door still hold a finger's warmth, fading in the order they were pressed: ${DOOR_CODE.join(', ')} → the door opens on the generator's panel, which wants each day tank's level, and through the camera the fuel glows up to it: ${PANEL_ORDER.map((c, i) => `${c} ${PANEL[i]}`).join(', ')}.`,
  objects:[
    { id:'boardgame', icon:'🎲', name:'The Game on the Table', pos:POS2.boardgame,
      desc:"Snakes and ladders, abandoned on the first turn: every counter still on the start, and each player's two dice rolled on their mat.",
      figure:ART.svg(boardArt.w, boardArt.h, boardArt.body),
      sprite:ART.sprite(POS2.boardgame, 360, 200, boardSprite) },
    { id:'footlocker', icon:'🧳', name:'Foot Locker', pos:POS2.footlocker,
      desc:"A steel-banded foot locker at the end of the bunks. Four wheels of colours, and an animal stamped over each.",
      sprite:st=>ART.sprite(POS2.footlocker, 220, 110, footlockerBody(st)),
      puzzle:{ type:'combo', from:['boardgame'], wheels:LOCKER_MARKS.map(g=>({ faces:{ colors:['red', 'yellow', 'blue', 'green', 'white', 'black'] }, mark:{ glyph:g } })), answer:LOCKER, tryLabel:'OPEN IT',
        miss:"The hasp doesn't move.",
        hints:[
          "Four wheels, an animal over each, and a colour to find for each one. The same four animals are playing the game on the table.",
          "Nobody has moved yet: every counter is on the start, and each player's two dice lie on their mat. Add them, count that many squares, and remember what a ladder's foot and a snake's head do.",
          `${ROLL_SAY.map(s => s[0].toUpperCase() + s.slice(1)).join('. ')}. ${LOCKER_MARKS.map((t, i) => `${t[0].toUpperCase() + t.slice(1)} ${LOCKER[i]}`).join(', ')}.`
        ],
        solvedText:"The hasp lets go. Inside, wrapped in somebody's jumper, the station's thermal camera, still charged. Anything warm shows up bright on it.",
        inside:{ name:"The thermal camera", figure:cameraFig } } },
    { id:'tanks', icon:'🛢️', name:'Day Tanks', pos:POS2.tanks,
      desc:"The generator's four day tanks, plumbed through the wall. Plate steel, each painted with a band of colour, and no gauge on any of them.",
      figure:ART.svg(600, 400, tanksBack + tanksBody),
      lens:{ needs:'footlocker', hidden:tanksThermal, r:84, dark:0, tint:'#ffb46a' },
      sprite:ART.sprite(POS2.tanks, 600, 400, tanksBody) },
    { id:'gendoor', icon:'🚪', name:'Generator Room Door', pos:POS2.gendoor,
      desc:"The generator room is through here. Its keypad wants five keys, and nothing anywhere says which.",
      sprite:st=>ART.sprite(POS2.gendoor, 160, 400, gendoorBody(st)), watches:['genpanel'],
      puzzle:{ type:'press', from:['footlocker'], slots:5, answer:DOOR_CODE, echo:Object.fromEntries('0123456789'.split('').map(d => [d, d])),
        figure:ART.svg(360, 470, keypadBody),
        lens:{ needs:'footlocker', hidden:keypadThermal, r:96, dark:0, tint:'#ffb46a' },
        miss:"The light on the keypad blinks red.",
        hints:[
          "Five keys and nothing written down. But a key a finger has just pressed is warmer than the rest.",
          "Hold the thermal camera from the foot locker over the keypad: five keys still glow where a finger pressed them. A print fades as it cools, so the faintest was pressed first.",
          `Faintest to brightest: ${DOOR_CODE.join(', ')}.`
        ],
        solvedText:"The bolt slides back. Five prints, and the last of them is minutes old. Nobody has been here for nine days.",
        solveBeat:"Behind you, the heater ticks as it cools. Something in this room was standing close to it a moment ago.",
        beatSound:'hiss' } },
    { id:'genpanel', icon:'⚡', name:'Generator Panel', pos:POS2.genpanel, hiddenUntil:'gendoor',
      desc:"The generator will only start with each day tank's level set on its panel: four gauges, banded in the tanks' colours.",
      sprite:st=>ART.sprite(POS2.genpanel, 96, 140, genpanelBody(st)),
      puzzle:{ type:'levels', from:['tanks'], skin:'tanks', max:5, cols:PANEL_ORDER.map(c=>({ mark:{ color:c } })), answer:PANEL, tryLabel:'CRANK IT',
        miss:"The generator turns over, coughs, and dies. One of those was wrong.",
        hints:[
          "Four gauges, each banded with a colour. The day tanks along the wall are banded in the same four colours, and none of them has a gauge.",
          "Look at the tanks through the thermal camera: the fuel holds the warmth and the empty steel above it doesn't, so each one glows up to its level. Count the welded seams.",
          `${PANEL_ORDER.map((c, i) => `${c[0].toUpperCase() + c.slice(1)} ${PANEL[i]}`).join(', ')}.`
        ],
        solvedText:"Four tanks, four levels. The generator coughs, catches, and settles into a roar you can feel through the floor." } },
  ]
};

const OLD_ROOMS = [
/* ============ ROOM 3 — THE ICE CORE LAB ============ */
{
  id:'corelab', name:'Room 3 — The Ice Core Lab', scene:'corelab',
  relays:[{el:'rl-corelab',mode:'pulse',period:2.6}],
  wrongSound:'geiger',
  wrongVfx:'sparks',
  intro:"Minus forty in here, by design. Sample case E-9 is open, and its meltwater has been walking around.",
  objective:"Learn what the crew drilled up. The cold room keeps its secrets <b>frozen — keep it that way.</b>",
  entryBeat:"Sample E-9's case didn't fail — the bolts were backed out from the inside of the case. Whatever the drill brought up through three hundred thousand years of ice was awake when it arrived.",
  entrySound:'clank',
  completeText:"The tower door unbolts. Behind you, the intercom's open channel exhales once and goes dead — like a thing satisfied you finally understand where it went.",
  chain:"The frost-writing on the steel table names what this whole lab exists to study: ICE → the cold store's chart recorder gives the day it lost temperature, day 61, and anything drilled after that never froze through, which leaves six of the eight cores spelling BURIED → the cold safe's tag wants three different non-zero multiples of three, the first the sum of the other two and the smallest in the middle: 936 → the drill-shed key fob is embossed in the same braille as the tape: BELOW.",
  objects:[
    { id:'coreE9', icon:'🧊', name:'Sample E-9', pos:{x:30,y:60,w:15,h:18},
      desc:"The shattered case, and beside it, in the frost on the steel table, someone wrote with a fingertip — the station's last riddle:\n\n“I hold yesterday's air in bubbles.\nI remember every winter that ever was.\nI break like glass and bleed like water,\nand I kept your visitor patient for a very long time.”",
      puzzle:{
        prompt:"What is the frost-writing describing?", placeholder:"ANSWER", answers:['ICE','THEICE','ANICECORE','ICECORE'],
        hints:[
          "It's what this whole lab exists to study.",
          "Ancient air in bubbles, a memory of winters, breaks like glass, bleeds like water…",
          "ICE. Three hundred thousand years of it — and something inside, keeping."
        ],
        solvedText:"ICE. The riddle isn't a lock — it's a warning label, written by someone who finally understood the archive they'd been sawing into. The core racks along the wall suddenly demand much closer reading."
      }
    },
    { id:'cores', onSolve:{el:'rx-corelab',op:.2,fx:'surge'}, icon:'🔬', name:'The Core Racks', pos:{x:8,y:26,w:56,h:14}, hiddenUntil:'coreE9',
      desc:"Eight cores in the cold store, each tagged with a letter and the station day it was drilled.\n\nPinned to the store door, the chart recorder's trace for the season, and the lead scientist's note under the place where the line falls off a cliff:\n\n   “STORE LOST TEMPERATURE ON DAY 61 AND WE DID NOT NOTICE FOR A WEEK.\n    ANYTHING THAT CAME IN AFTER THAT NEVER FROZE THROUGH. LOG IT AND BIN IT.”\n\nLeft to right along the rack:",
      puzzle:{
        type:'select',
        select:{commit:"🧊 THESE CORES ARE SOUND", wrong:"The survey log will not accept that set.",
          items:[{letter:"B",value:"drilled day 12"},{letter:"T",value:"drilled day 74"},{letter:"U",value:"drilled day 30"},{letter:"R",value:"drilled day 55"},{letter:"O",value:"drilled day 80"},{letter:"I",value:"drilled day 48"},{letter:"E",value:"drilled day 19"},{letter:"D",value:"drilled day 8"}]},
        prompt:"Which cores froze through? Tap the ones that came in before the store failed.", answers:['BURIED'],
        hints:[
          "One number decides every core: the day the store lost temperature. Everything drilled before it is sound, everything after it is not.",
          "The chart says day 61. Go along the rack and keep only the cores drilled earlier than that.",
          "Day 74 and day 80 came in after the store failed, so T and O are out. The rest spell BURIED."
        ],
        solvedText:"B-U-R-I-E-D. The word the glacier kept trying to say. The sound cores also hide the cold safe's tag, tucked behind R like a bookmark.",
        solveBeat:"Deep under the floor, the ice groans one long syllable — and the meltwater around E-9's case shivers in rings, in time with it.",
        beatSound:'growl'
      }
    },
    { id:'coldsafe', icon:'🔐', name:'The Cold Safe', pos:{x:8,y:68,w:12,h:20},
      desc:"The lab's cold safe, 3-digit dial. The tag from the core rack, in the lead scientist's careful print:\n\n“Three different digits, every one a multiple of three, none of them zero.\nThe first is the sum of the other two.\nThe smallest hides in the middle.”",
      puzzle:{
        type:'keypad',
        prompt:"Find the three digits that fit and enter them in order.", answers:['936'],
        hints:[
          "Your only materials are 3, 6 and 9 — the single-digit multiples of three.",
          "Which of them is the sum of the other two? 9 = 3 + 6, so 9 leads.",
          "9 first, then the smallest (3) in the middle, 6 last — enter 936."
        ],
        solvedText:"9-3-6. Inside the safe: the tower key, the crew's last photographs — and the drill logs, whose final page is just one depth figure circled so hard the pen went through.",
        solveBeat:null
      }
    },
    { id:'intercom', icon:'📢', name:'The Drill-Shed Intercom', pos:{x:87,y:35,w:9,h:20}, hiddenUntil:'coldsafe',
      desc:"The intercom to the drill shed crackles alive — an open channel, breathing, saying nothing. The drill shed has been empty for nine days.\n\nTaped beside the speaker hangs the shed key, on a metal fob embossed with the same raised dots as the tape leader:\n\n<span style='font-size:2rem;letter-spacing:10px'>⠃⠑⠇⠕⠺</span>\n\nThe tower door's 5-letter lock waits.",
      puzzle:{
        prompt:"Enter the 5-letter word the intercom is clicking.", placeholder:"5 LETTERS", answers:['BELOW'],
        hints:[
          "The same braille as the tape leader — five cells, five letters.",
          "It starts with B and ends with W. It's telling you where it went.",
          "⠃⠑⠇⠕⠺ reads BELOW. It went home. For now."
        ],
        solvedText:"B-E-L-O-W. The open channel closes the moment you speak it — message received. The tower door unbolts. You are done asking the station questions; the answers have started coming to find you.",
        solveBeat:"From the drill shaft, far under your boots, comes a sound you feel more than hear — three hundred meters of ice being climbed, without hurry.",
        beatSound:'knock'
      }
    }
  ]
},
/* ============ ROOM 4 — THE RADIO TOWER ============ */
{
  id:'radiotower', name:'Room 4 — The Radio Tower', scene:'radiotower',
  stageFx:'gust',
  relays:[{el:'rl-radiotower',mode:'pulse',period:3.0}],
  wrongSound:'chug',
  wrongVfx:'shake',
  intro:"Dawn is a rumor on the horizon and the plane is up there waiting. Light the runway and bring them down.",
  objective:"Restart the generator, raise the plane, and <b>light the drum line</b> — before what's below finishes its climb.",
  entryBeat:"The tower's guy-wires are thrumming — all of them, evenly. Not the wind. Something at the far anchor point is testing, very gently, whether the tower would fall.",
  entrySound:'clank',
  completeText:"The generator is running, the runway flares are laid, and the set is warm. There is a plane out there in the dark, waiting to be told.",
  chain:"Five cold-start tags, each with its reason: fuel first because nothing else matters without it, plugs with fuel already in the line, crank while the plugs are hot, choke only once she has caught, breaker last — DEBAC → the approach plate gives the skiway's three channels and the lockbox lid says it holds the approach crystal, coded with the point omitted: 1764 → the weather fax rules out the 4:50 window (under the 1500 m minimum) and the 9:30 (after the aircraft's fuel is gone), leaving 6:10 less the forty minutes the drum line needs = 5:30 → the depot cache's bins are numbered on the door and the quartermaster's stock card gives the quantities in a different order: 1486 → put the beacon on the approach channel, 176.4, and transmit.",
  objects:[
    { id:'genstart', icon:'⚙️', name:'The Generator Sled', pos:{x:11,y:66,w:18,h:18},
      desc:"The tower generator's cold-start drill, five steps on five tags that nine days of wind have shuffled across the floor. The engineer wrote each one with the reason attached, the way you do when you expect to be read by somebody with cold hands and no time:\n\n   TAG A — “Close the choke, and not until she has actually caught. Choking a cold engine only floods it.”\n\n   TAG B — “Crank the flywheel while the plugs are still hot. You get about twenty seconds of hot.”\n\n   TAG C — “Throw the breaker last, once she is running steady. Put a load on her before that and she stalls.”\n\n   TAG D — “Open the fuel line first. Nothing else on this list matters if she has nothing to burn.”\n\n   TAG E — “Warm the glow plugs — with fuel already in the line, or you are just heating air.”",
      puzzle:{
        type:'order', order:{labels:{"A": "Close the choke", "B": "Crank the flywheel", "C": "Throw the breaker", "D": "Open the fuel line", "E": "Warm the glow plugs"}},
        prompt:"Enter the five tag letters in start order.", placeholder:"FIVE LETTERS", answers:['DEBAC'],
        hints:[
          "Each tag says why it sits where it sits. Two of them claim an end outright: one is explicitly first, one explicitly last.",
          "Fuel line first (D), breaker last (C). The plugs want fuel already in the line, and the crank wants the plugs still hot.",
          "Fuel, plugs, crank, then the choke once she has caught, then the breaker: enter DEBAC."
        ],
        solvedText:"Fuel, plugs, crank, choke, breaker. The generator coughs, catches, and settles into a steady chug you feel through your boots like a second heartbeat. A better one than the ice's.",
        solveBeat:"The moment the engine steadies, the thrumming in the guy-wires stops — the way a fisherman goes still when the line finally moves.",
        beatSound:'clank'
      }
    },
    { id:'lockbox', onSolve:{el:'rx-radiotower',op:.2,fx:'surge'}, icon:'📦', name:'The Tower Lockbox', pos:{x:42,y:68,w:11,h:16},
      desc:"The transmitter's approach crystal is locked in a four-digit box.\n\nBolted to the wall above it, the skiway's approach plate — the card every aircraft working this strip flies off:\n\n   EREBUS SKIWAY — APPROACH\n     TOWER, GROUND ............. 88.2\n     APPROACH BEACON ........... 176.4\n     EMERGENCY ONLY ............ 243.0\n\nAnd stencilled across the lid of the box itself, the radio officer's own shorthand:\n\n   “CRYSTAL: APPROACH. CODE IS THE CHANNEL, POINT OMITTED.”",
      puzzle:{
        type:'keypad',
        prompt:"Enter the 4-digit code.", answers:['1764'],
        hints:[
          "The plate on the wall gives you three channels. The lid tells you which one this box holds and how to type it.",
          "The box holds the approach crystal, so you want the approach beacon's channel — and the lock has no decimal point.",
          "176.4 with the point left out is 1764. Enter 1764."
        ],
        solvedText:"1-7-6-4. The crystal seats, the transmitter warms, and a voice you could weep at answers on the third call: “Erebus, we see your lights. Give us a runway and a window.”"
      }
    },
    { id:'weather', icon:'🌨️', name:'The Weather Fax', pos:{x:57,y:66,w:14,h:18},
      desc:"The fax chatters out the morning's landing windows:\n\n“WINDOW 1 — 4:50 · visibility 800 m\nWINDOW 2 — 6:10 · visibility 2200 m\nWINDOW 3 — 9:30 · visibility 3000 m\n\nMINIMUM LEGAL VISIBILITY: 1500 m.\nAIRCRAFT FUEL EXHAUSTED BY 8:00.\nDRUM LINE MUST BURN 40 MINUTES BEFORE THE WINDOW.”",
      puzzle:{
        prompt:"Set the drum-line ignition time (hour then minutes).", placeholder:"H:MM", answers:['530','0530'],
        hints:[
          "Two filters: the visibility floor, and the plane's fuel.",
          "4:50 is under the 1500 m minimum. 9:30 is after the fuel runs out at 8:00. That leaves 6:10 — count back 40 minutes.",
          "6:10 minus 0:40 is 5:30. Enter 530."
        ],
        solvedText:"5:30. The ignition clock arms. Out along the snow, the drum line waits — a runway drawn in barrels, aimed at the dawn."
      }
    },
    { id:'flarebox', icon:'🧨', name:'The Flare Cache', pos:{x:74,y:69,w:11,h:15}, hiddenUntil:'weather',
      desc:"The outer depot cache, four-digit lock, everything the station keeps for the dark months stacked behind it — flares included.\n\nThe door is stencilled into four bins, numbered the way the quartermaster had them loaded:\n\n   BIN 1 ▲        BIN 2 ✚        BIN 3 ●        BIN 4 ■\n\nHis stock card is wired to the handle, written up in whatever order he happened to count things:\n\n   ● FUEL ............. 8 drums\n   ■ FOOD ............. 6 crates\n   ▲ FLARES ........... 1 case\n   ✚ MEDICAL .......... 4 cases\n\n   “CODE IS THIS SEASON'S ISSUE, BIN BY BIN.”",
      puzzle:{
        type:'keypad',
        prompt:"Enter the 4-digit code.", answers:['1486'],
        hints:[
          "The card has the quantities and the door has the bins, and the two are not in the same order. You need both.",
          "Work along the bins, one to four, and look up what the card says is in each.",
          "Bin 1 is flares (1), bin 2 medical (4), bin 3 fuel (8), bin 4 food (6). Enter 1486."
        ],
        solvedText:"1-4-8-6 and the cache opens on flares. Dozens of them. Enough to write on the dark with.",
        solveBeat:"At the base of the tower, unhurried, something begins to climb. The ladder rungs ring one at a time — patient as a metronome, far apart as a tall man's reach. Taller.",
        beatSound:'clank'
      }
    },
    { id:'runway', icon:'📡', name:'The Approach Beacon', pos:{x:46,y:84,w:14,h:10}, hiddenUntil:'flarebox',
      desc:"The drum line is lit and the strip is bright enough to land on. What the plane still has no reason to do is believe it — a fire on the ice is a fire on the ice until somebody on the ground is talking.\n\nThe tower's transmit set is cold but intact, and the approach plate is still bolted to the wall where it has always been.\n\nPut the beacon on the approach channel and hold it there. They are low on fuel and they will only come round once.",
      puzzle:{
        type:'dial',
        dial:{ min:1500, max:2000, target:1764, div:10, pad:5,
               meter:'CARRIER STRENGTH', lock:'TRANSMIT', miss:'nothing out there but the ice.',
               knobs:[ {label:'Antenna match', target:62},
                       {label:'Power stage',   target:38},
                       {label:'Keying bias',   target:74} ] },
        prompt:"Set the beacon to the approach channel, trim it in, and transmit.",
        answers:['176.4'],
        hints:[
          "The approach plate on the wall has the number. It is the same channel the crystal in the lockbox was cut for, which is the point of the crystal.",
          "APPROACH BEACON — 176.4.",
          "Set the main dial to 176.4, bring the three trims to their sweet spots, and transmit."
        ],
        solvedText:"",
        solveBeat:"The carrier catches. Thirty seconds of nothing — and then a voice, thin and flat and utterly ordinary, reading your position back to you.",
        beatSound:'ping'
      }
    }
  ]
}
];
const ROOMS = [ROOM1, ROOM2, ...OLD_ROOMS];

registerScenario({
  id:'erebus', classic:true,
  title:'Station Erebus',
  sub:'antarctica · nine days of silence · something thawed first',
  tagline:'A silent research station, an opened ice core, and one plane that can still land at dawn.',
  icon:'❄️',
  card:`<svg viewBox="0 0 300 130" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="cgA" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#050a14"/><stop offset="1" stop-color="#1c2e44"/></linearGradient></defs>
    <rect width="300" height="130" fill="url(#cgA)"/>
    <path class="aurora" d="M20 20 q60 -14 120 8 q70 22 140 -8 l0 30 q-70 26 -140 6 q-60 -18 -120 -4z" fill="#3fd68c" opacity=".25"/>
    <path d="M0 96 q80 -10 160 -2 t140 -4 v40 h-300z" fill="#8aa4ba"/>
    <rect x="180" y="66" width="90" height="34" rx="6" fill="#1a2836"/>
    <rect class="flick" x="246" y="76" width="14" height="12" fill="#5a4a1a"/>
    <rect x="60" y="52" width="3" height="44" fill="#3a2d1a"/><path class="flag" d="M63 52 l20 5 -20 6z" fill="#c94a3d"/>
    <rect x="110" y="60" width="3" height="36" fill="#3a2d1a"/><path class="flag" d="M113 60 l18 5 -18 5z" fill="#c94a3d"/>
  </svg>`,
  titleFx:'snow', titleLightning:false,
  titleArt:`<svg viewBox="0 0 560 200">
    <path class="aurora" d="M40 30 q120 -24 220 10 q140 40 260 -10 l0 44 q-120 44 -260 14 q-100 -26 -220 -6z" fill="#3fd68c" opacity=".25"/>
    ${Array.from({length:24},(_,i)=>`<circle class="tw" cx="${(i*47+16)%560}" cy="${(i*13)%80+6}" r="${.6+(i%3)*.5}" fill="#dfe8ff" style="animation-delay:${(i*.6)%4}s"/>`).join('')}
    <path d="M0 160 q140 -18 280 -4 t280 -8 v52 h-560z" fill="#8aa4ba"/>
    <rect x="330" y="110" width="150" height="52" rx="8" fill="#1a2836"/>
    <rect x="360" y="88" width="50" height="28" rx="6" fill="#14202c"/>
    <rect class="flick" x="442" y="124" width="20" height="16" fill="#5a4a1a"/>
    <path d="M120 160 L140 60 L160 160" stroke="#2a3a48" stroke-width="4" fill="none"/>
    <circle class="slowblink" cx="140" cy="54" r="4" fill="#c94a3d"/>
  </svg>`,
  story:[
    "Station Erebus missed nine scheduled radio checks in a row. Your survey team drew the short straw: fly in, restore contact, find the crew. The pilot will not cut his engines while you look.",
    "The station is warm, lit, and empty. Fourteen bunks. Nine parkas still on their hooks. In the ice core lab, sample E-9 — drilled from three hundred thousand years down — stands open. From the inside.",
    "The plane can land once more at dawn, if you light the runway and raise them on the radio. Work warm, work fast — and whatever the intercom tells you, remember the crew's last message: <em>melt nothing.</em>"
  ],
  begin:'❄️ BEGIN — 45:00', finalButton:'CALL THE PLANE 🛩️',
  emojis:['❄️','🐧','⛏️','🔬','🧊','🌨️','🚩','📡','🛩️','⛽','🧣','💀'],
  ratings:['🏆 Polar Legend','❄️ Able Surveyor','⛏️ Field Hand','🛟 Barely Made the Plane','🌨️ Lost to the White'],
  shareTitle:'ESCAPED STATION EREBUS!',
  victoryTitle:'🛩️ WHEELS UP',
  victoryProse:`Three short. Three long. Three short. The drum line roars alive down the snow and the plane drops out of the grey like a promise kept, skis shrieking, props clawing the storm.<br><br>
    As you climb away, the whole station shrinks to a scatter of lights — and between the burning drums, dead center on your runway, something stands looking up. It does not shield its eyes from the fire. It waited three hundred thousand years; it can wait out a little heat.<br><br>
    Nobody talks on the flight home. You watch the ice the whole way, and the ice watches back.`,
  gameOverProse:`The fuel gauge on the circling plane runs past its point of no return, and the engines fade north.<br><br>Below the floor, patient as winter, the climbing sound resumes.`,
  flare:{x:800,y:800,hue:[255,150,60]},
  ambience:[
    {wind:.28, drone:.02},
    {hum:.04, wind:.06, drone:.03},
    {hum:.03, wind:.05, drone:.05},
    {wind:.2, drone:.06, hum:.02}
  ],
  fx:['snow','ash','drips','snow'],
  events:[
    [{s:'hiss',p:.5},{s:'creak',p:.3,v:'shadow'}],
    [{s:'creak',p:.35,v:'shadow'},{s:'crackle',p:.3,v:'sparks'}],
    [{s:'geiger',p:.45,v:'sparks'},{s:'drip',p:.3}],
    [{s:'chug',p:.5,v:'shake'},{s:'creak',p:.25,v:'shadow'}]
  ],
  // shown free of charge when a team has gone quiet for a while
  nudges:[
    "The wind turns, and the station shows you {it} once more.",
    "The generator surges. For a second, {it} is properly lit.",
    "The cold ticks through the metal. You look back at {it}.",
    "A gust clears the snow off {it}. It is still unread."
  ],
  // Three times a game something happens TO the team rather than around
  // them: the lights fail, something crosses the room, and a clue they had
  // already settled turns up disturbed.
  intrusions:{
    squeeze:'The generator drops. The hut goes black and the cold is inside it immediately — then the lights come up again, browner than before.',
    arrival:'Something passes the window at eye height. Nothing out there stands that tall.',
    midroom:'The core you had already cleared has frosted over again, hard, in the time it took to turn around.'
  },
  wrongBeats:WRONG_BEATS, wrongSounds:WRONG_SOUNDS,
  scenes:SCENES, rooms:ROOMS
});
})();
