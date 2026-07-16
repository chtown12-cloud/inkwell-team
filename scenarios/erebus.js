/* ============================================================
   SCENARIO: STATION EREBUS (Antarctic research station)
   The station went silent nine days ago. The survey plane
   drops you at dawn — and the ice has been busy.
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
<!-- route flags -->
<g id="art-flags">
${[['CH 7',150,700],['CH 1',330,676],['CH 18',510,700],['CH 1',690,678],['CH 7',870,702],['CH 5',1050,680]].map(([nm,x,y],i)=>
 `<g><rect x="${x}" y="${y-110}" width="6" height="110" fill="#3a2d1a"/>
  <path class="flag" d="M${x+6} ${y-110} l52 12 -52 14z" fill="#c94a3d"/>
  <rect x="${x-30}" y="${y-6}" width="66" height="20" rx="4" fill="#dce8f2"/>
  <text x="${x+3}" y="${y+9}" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#2a3a48">${nm}</text></g>`).join('')}
</g>
<!-- the half-buried snowcat -->
<g id="art-garage">
  <path d="M180 810 q60 -26 160 -20 l180 10 q40 30 20 54 l-360 8 q-30 -30 0 -52z" fill="#8aa4ba"/>
  <rect x="240" y="742" width="230" height="70" rx="12" fill="#b03a2a"/>
  <rect x="260" y="712" width="110" height="44" rx="8" fill="#7c2a1e"/>
  <rect x="272" y="720" width="80" height="26" rx="4" fill="#0a1018"/>
  <circle cx="290" cy="812" r="24" fill="none" stroke="#1a2430" stroke-width="8"/>
  <circle cx="420" cy="812" r="24" fill="none" stroke="#1a2430" stroke-width="8"/>
  <path d="M250 838 h240" stroke="#1a2430" stroke-width="10"/>
</g>
<!-- main door -->
<g id="art-maindoor">
  <rect x="1180" y="560" width="110 " height="150" rx="8" fill="#22303e" stroke="#4c6478" stroke-width="6"/>
  <circle cx="1268" cy="640" r="7" fill="#0a1018" stroke="#8aa4ba" stroke-width="3"/>
  <rect x="1196" y="580" width="78" height="40" rx="4" fill="#dce8f2"/>
  <text x="1235" y="598" text-anchor="middle" font-family="Special Elite" font-size="9" fill="#7a2a1a">STATION EREBUS</text>
</g>
<!-- notice board (appears) -->
<g id="el-noticeboard">
  <rect x="1330" y="580" width="120" height="110" fill="#3a2d1a" stroke="#241a10" stroke-width="6"/>
  ${[0,1,2,3].map(i=>`<rect x="${1342+(i%2)*56}" y="${592+Math.floor(i/2)*52}" width="48" height="44" fill="#dce8f2" transform="rotate(${(i-1.5)*3} ${1366+(i%2)*56} ${614+Math.floor(i/2)*52})"/>`).join('')}
</g>
<!-- fuel drums -->
<g>
  ${[0,1,2].map(i=>`<g><rect x="${620+i*70}" y="760" width="52" height="66" rx="8" fill="${i===1?'#b03a2a':'#4c6478'}"/>
  <line x1="${620+i*70}" y1="782" x2="${672+i*70}" y2="782" stroke="#1a2430" stroke-width="4"/></g>`).join('')}
</g>
<!-- something's track, circling -->
<path d="M60 880 q300 -50 700 -18 q400 30 780 -18" stroke="#5c7488" stroke-width="22" fill="none" opacity=".4"/>
<path d="M120 858 q60 -8 120 0 M840 852 q60 -8 120 0" stroke="#46607a" stroke-width="8" opacity=".5"/>
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
<!-- shortwave set -->
<g id="art-shortwave">
  <rect x="1140" y="360" width="300" height="150" rx="10" fill="#22303a" stroke="#4c6478" stroke-width="6"/>
  <rect x="1160" y="380" width="130" height="40" rx="4" fill="#06130c"/>
  <text class="flick" x="1225" y="408" text-anchor="middle" font-family="Special Elite" font-size="20" fill="#8fe0a0">--.-</text>
  <circle cx="1340" cy="420" r="30" fill="#0d1216" stroke="#5c7488" stroke-width="5"/>
  <line x1="1340" y1="420" x2="1358" y2="400" stroke="#8fe0a0" stroke-width="4"/>
  ${[0,1,2,3].map(i=>`<circle cx="${1180+i*36}" cy="470" r="9" fill="#1a242c"/>`).join('')}
  <path d="M1300 360 q30 -60 90 -80" stroke="#4c6478" stroke-width="4" fill="none"/>
</g>
<!-- reel-to-reel (hidden until shortwave) -->
<g id="el-recorder">
  <rect x="1160" y="560" width="220" height="110" rx="10" fill="#1c262e" stroke="#4c6478" stroke-width="5"/>
  ${[0,1].map(i=>`<g><circle cx="${1220+i*110}" cy="606" r="34" fill="#0d1216" stroke="#5c7488" stroke-width="4"/>
  <circle cx="${1220+i*110}" cy="606" r="10" fill="#2a3a48"/></g>`).join('')}
  <rect x="1200" y="646" width="150" height="12" rx="4" fill="#0d1216"/>
</g>
<!-- foot lockers -->
<g id="el-footlocker">
  <rect x="430" y="640" width="180" height="90" rx="8" fill="#46607a" stroke="#2a3a48" stroke-width="5"/>
  <rect x="430" y="640" width="180" height="24" rx="8" fill="#5c7488"/>
  <rect x="500" y="672" width="40" height="30" rx="4" fill="#1a242c"/>
  <text x="520" y="758" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#8aa4ba">VJG EQFG KU...</text>
</g>
<!-- generator panel (hidden) -->
<g id="el-genpanel">
  <rect x="700" y="640" width="180" height="170" rx="10" fill="#22303a" stroke="#4c6478" stroke-width="6"/>
  ${[0,1,2].map(r=>[0,1,2].map(c=>`<circle class="flick" cx="${740+c*50}" cy="${680+r*46}" r="9" fill="#0a1018" stroke="#c9a04a" stroke-width="2" style="animation-delay:${(r+c)*.3}s"/>`).join('')).join('')}
</g>
<!-- duty roster -->
<g>
  <rect x="60" y="430" width="120" height="150" fill="#dce8f2" transform="rotate(-2 120 505)"/>
  ${[0,1,2,3,4].map(i=>`<line x1="76" y1="${458+i*22}" x2="164" y2="${454+i*22}" stroke="#5a6a78" stroke-width="3" transform="rotate(-2 120 505)"/>`).join('')}
  <text x="120" y="448" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#7a2a1a" transform="rotate(-2 120 505)">DUTY ROSTER</text>
</g>
<!-- nine empty parkas on hooks -->
<g>
${[0,1,2,3,4].map(i=>`<g><circle cx="${640+i*56}" cy="180" r="4" fill="#3a2d1a"/>
 <path d="M${640+i*56} 184 q-20 14 -18 70 l36 0 q2 -56 -18 -70z" fill="${i%2?'#b03a2a':'#46607a'}"/></g>`).join('')}
</g>
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
  <text x="765" y="628" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#c8ecff">TWICE THE STATION</text>
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
</svg>`;

const WRONG_BEATS=[
  "Out in the white, one of the route flags goes down. There is no wind just now.",
  "The footprints outside the window have changed direction since you last looked. There are no new prints.",
  "Under the floor, the permafrost gives one long groan — like something turning over in its sleep.",
  "The dogs' kennel stands open and empty. It has been empty for nine days. So why did something just eat from the bowl?",
  "Between gusts, faint and wrong: your own voices, played back from somewhere out on the ice."
];
const WRONG_SOUNDS=['hiss','knock','growl','clank','hiss'];

const ROOMS=[
/* ============ ROOM 1 — THE PERIMETER ============ */
{
  id:'perimeter', name:'Room 1 — The Perimeter', scene:'perimeter',
  intro:"Nine days of silence. The plane drops you at the flag line and doesn't cut its engines.",
  objective:"Get inside before the front hits — <b>glowing rings</b> mark what the ice hasn't buried yet.",
  entryBeat:"The route flags run dead straight toward the station — except the last fifty meters, where every flag has been pulled up and replanted, ever so slightly, to curve the path toward the dark side of the buildings.",
  entrySound:'hiss',
  completeText:"The inner door seals behind you with a hiss of warm air. Out on the ice, through the closing gap, the flag line is moving again — one flag at a time, patiently, back into a straight line.",
  chain:"Route flags: channel numbers as A1Z26 letters spell GARAGE → drum stencils pair supplies with digits; the resupply poster gives the order (food, fuel, medical, flares) → 6841 → main door riddle (NORTH — every direction from here is north) but the mirrored tag says the drill ran the other way = SOUTH → notice board cross-references the roster, the drums and the garage → 73.",
  objects:[
    { id:'flags', icon:'🚩', name:'Route Flags', pos:{x:6,y:62,w:62,h:16},
      desc:"Six route flags on the depot line, each staked with a radio-channel board, in order:\n\nFLAG 1 — CH 7\nFLAG 2 — CH 1\nFLAG 3 — CH 18\nFLAG 4 — CH 1\nFLAG 5 — CH 7\nFLAG 6 — CH 5\n\nThe first stake carries a stencil: “CHANNELS ARE LETTERED THE OLD WAY — A IS ONE.”",
      puzzle:{
        prompt:"The flag line hides a word. Where should you look first?",
        placeholder:"SIX LETTERS", answers:['GARAGE'],
        hints:[
          "“A is one” — turn each channel number into its letter: 1=A, 2=B, 3=C… 26=Z.",
          "7=G, 1=A, 18=R, 1=A, 7=G, 5=E. Read the flags in order.",
          "G, A, R, A, G, E — the snowcat GARAGE."
        ],
        solvedText:"G-A-R-A-G-E. The snowcat garage — half-buried, engine cold, and its supply cage locked with a 4-digit padlock."
      }
    },
    { id:'garage', icon:'🚜', name:'The Snowcat Garage', pos:{x:12,y:76,w:22,h:18},
      desc:"The supply cage in the garage wears a 4-digit padlock. Four supply glyphs are stencilled on the fuel drums beside it, each with a digit — in no particular order:\n\n✚ MEDICAL 4      ● FUEL 8      ▲ FLARES 1      ■ FOOD 6\n\nAlong the back wall stand nine fuel drums; you rap each one down the line and six of them ring empty.\n\nDigits, but no sequence. Somewhere on this station is a standing order that puts supplies in order.",
      puzzle:{
        prompt:"Enter the 4-digit code.", placeholder:"0000", answers:['6841'],
        hints:[
          "You need the official ORDER of supplies — check what's posted by the main door.",
          "The resupply notice: UNLOAD IN THIS ORDER — FOOD, FUEL, MEDICAL, FLARES.",
          "■6 ●8 ✚4 ▲1 → enter 6841."
        ],
        solvedText:"6-8-4-1 and the cage swings open. Inside: a hand-crank lantern, the snowcat's dead battery — and a brass depot tag stamped SOUTH, the stamp mirrored, as if punched from the far side.",
        solveBeat:"Behind the garage, snow squeaks under something heavy taking exactly three steps. Then nothing. Whatever it is, it has learned that you stop to listen after three.",
        beatSound:'knock'
      }
    },
    { id:'maindoor', icon:'🚪', name:'The Main Door', pos:{x:72,y:60,w:10,h:20},
      desc:"The station's outer door — letter-lock, five characters, and a riddle etched by some bored winter-over crew a decade ago:\n\n“Stand here, and every direction is me.\nEvery road home begins by walking me.\nWhat am I?”\n\nThe station's standing resupply notice is taped beside the lock:\n\n“UNLOAD IN THIS ORDER, ALWAYS:\n1. FOOD   2. FUEL   3. MEDICAL   4. FLARES”\n\nBelow it, scratched much more recently, much less steadily:\n\n“WE DRILLED THE OTHER WAY.”",
      puzzle:{
        prompt:"Set the five letter dials.", placeholder:"FIVE LETTERS", answers:['SOUTH'],
        hints:[
          "Stand at the South Pole and think about compasses. Which way is every way?",
          "The riddle's answer is NORTH — from here, every direction is north. But the scratched line says they drilled the OTHER way… and check the mirrored depot tag.",
          "The opposite of the riddle's answer: SOUTH. The tag already told you."
        ],
        solvedText:"S-O-U-T-H. The lock gives. The riddle's answer was NORTH — the joke of the station — but the last crew re-keyed it to its opposite, and mirrored the tag, and you'd very much like to stop thinking about why."
      }
    },
    { id:'noticeboard', icon:'📌', name:'The Notice Board', pos:{x:82,y:62,w:10,h:16}, hiddenUntil:'maindoor',
      desc:"Inside the cold porch, a notice board and the inner door's 2-digit keypad. The posted standing order reads:\n\n“INNER DOOR — first figure: the bunks this station sleeps, less the crew rotated home last month. Second figure: fuel drums standing full in the garage.”\n\nA crew sheet pinned beside it reads “STATION EREBUS SLEEPS 14,” and the rotation log below adds: “7 rotated home on the last flight.”",
      puzzle:{
        prompt:"Enter the 2-digit code.", placeholder:"TWO DIGITS", answers:['73'],
        hints:[
          "Two numbers are pinned right here. The third you saw in the garage.",
          "14 bunks minus 7 rotated home is 7. The garage held nine drums and six rang empty when you knocked — 3 full.",
          "7 then 3 — enter 73."
        ],
        solvedText:"7-3. The inner door unseals — heat, dark, and a smell you'll place later: nine days of nobody, and one bowl on the floor, freshly emptied.",
        solveBeat:"As the porch light flickers on, every window on the dark side of the station creaks — softly, together — under a pressure that isn't wind.",
        beatSound:'hiss'
      }
    }
  ]
},
/* ============ ROOM 2 — CREW QUARTERS ============ */
{
  id:'quarters', name:'Room 2 — Crew Quarters', scene:'quarters',
  intro:"Fourteen bunks, nine parkas on hooks, zero people. The kettle is still faintly warm.",
  objective:"The crew's last hours are recorded in this room. Find the frequency — then <b>listen to what they left.</b>",
  entryBeat:"Nine parkas on the hooks. Outside it is forty below. Wherever the crew went, they went without their coats — or they went as something that no longer felt the cold.",
  entrySound:'knock',
  completeText:"The generator panel accepts the code and the station's spine of lights marches on, building by building, out toward the core lab. The last building lights with something already standing at its window. By the time anyone can point, it isn't.",
  chain:"Duty roster (last entry Station day 88) + radio log (two checks daily — “the point, then the checks”) → tune 88.2 → the reel-to-reel is morse = MELT NOTHING → foot locker Vigenère (keyword ICE) = FROST → generator halving-chain rule (8→4→2, sum 14) = 842.",
  objects:[
    { id:'roster', icon:'📋', name:'Duty Roster', pos:{x:3,y:46,w:10,h:20},
      desc:"The duty roster, filled in to a point and then not:\n\n“STATION DAY 86 — cores E-1 through E-8 catalogued. E-9 tomorrow.”\n“STATION DAY 87 — E-9 case will not stay shut. Weather radio at 0600 and 1800, as always. Two checks daily, never miss.”\n“STATION DAY 88 — ”\n\nDay 88 is blank. They stopped counting on 88. In the margin, tiny: “the band is the day we stopped, the point, then the checks.”" },
    { id:'shortwave', icon:'📻', name:'The Shortwave Set', pos:{x:70,y:38,w:20,h:20},
      desc:"The station's shortwave, still warm on standby, its dial waiting. The roster margin said the band is a number in two parts — a day, a point, and a count.\n\nOutside, the blizzard eats every other frequency alive.",
      puzzle:{
        type:'dial',
        prompt:"Sweep the band. Find the station's frequency, then LOCK IT IN.",
        answers:['882'],
        dial:{min:760,max:1080,div:10,target:882,pad:4,meter:'SIGNAL THROUGH THE STORM',lock:'LOCK IT IN',miss:'the blizzard swallows it.',nearMorse:'-- . .-.. -  -. --- - .... .. -. --.'},
        hints:[
          "The roster gives the whole number — the day they stopped counting. Its margin gives the decimal.",
          "They stopped on station day 88. Two radio checks daily: that's your point-two.",
          "Tune to exactly 88.2 and lock it in."
        ],
        solvedText:"At 88.2 the blizzard parts — and the frequency isn't dead. It's LOOPED. Someone patched the reel-to-reel into the transmitter before the end, and it has been repeating them ever since. The RECORDER is live. Split up the letters; it's a long message."
      }
    },
    { id:'recorder', icon:'🎞️', name:'The Reel-to-Reel', pos:{x:71,y:60,w:16,h:15}, hiddenUntil:'shortwave',
      desc:"The tape loops every few seconds. Two words — eleven letters, keyed with a cold, deliberate hand:\n\n−−  ·  ·−··  −\n\n−·  −−−  −  ····  ··  −·  −−·\n\nDivide the letters among the crew and call them out.",
      puzzle:{
        prompt:"Decode the tape (two words).",
        placeholder:"TWO WORDS", answers:['MELTNOTHING'],
        morse:'-- . .-.. -  -. --- - .... .. -. --.',
        hints:[
          "Eleven letters, two words. −− is M. Split the groups among the crew.",
          "First word: M, E, L… four letters. Second starts −· = N.",
          "−− · ·−·· − is MELT. −· −−− − ···· ·· −· −−· is NOTHING. Enter MELTNOTHING."
        ],
        solvedText:"MELT NOTHING. Eleven letters the crew spent their last hours making sure someone would hear. You think of core E-9's case, and the standing water around it, and how warm they kept this room.",
        solveBeat:"The heater ticks — and something outside the window leans away from the glass, where it has been enjoying the warmth.",
        beatSound:'hiss'
      }
    },
    { id:'footlocker', icon:'🧳', name:'The Foot Locker', pos:{x:26,y:69,w:13,h:14}, hiddenUntil:'recorder',
      desc:"A foot locker banded in steel, its 5-letter lock guarded by a Vigenère cipher — the scientist scratched the wheel and its keyword right onto the lid:\n\nKEYWORD: ICE  (the one thing this station studies)\nCIPHER:  N T S A V\n\n“Line the keyword under the cipher, repeating — I, C, E, I, C — and subtract each key letter (A=0). What's left is the word.”",
      puzzle:{
        prompt:"Enter the deciphered word.", placeholder:"FIVE LETTERS", answers:['FROST'],
        hints:[
          "Number the alphabet A=0…Z=25. Under NTSAV write the repeating key ICE→ I,C,E,I,C, and subtract (wrap past A back to Z).",
          "N(13)−I(8)=5=F.  T(19)−C(2)=17=R.  S(18)−E(4)=14=O.  A(0)−I(8)=18=S.  V(21)−C(2)=19=T.",
          "The five letters spell FROST. THE CODE IS: FROST."
        ],
        solvedText:"F-R-O-S-T. Inside the locker: the generator's calibration card, a flare pistol with no flares — and someone's wedding ring, left square in the middle, the way you leave things you know you won't need."
      }
    },
    { id:'genpanel', icon:'🔌', name:'Generator Panel', pos:{x:43,y:69,w:12,h:20}, hiddenUntil:'footlocker',
      desc:"The backup generator wants a 3-digit setting. The calibration card from the locker, in the engineer's block capitals:\n\n“COLD-START RULE —\nEACH DIGIT IS DOUBLE THE DIGIT THAT FOLLOWS IT.\nALL THREE TOGETHER MAKE FOURTEEN.”\n\nAnd beneath, double-underlined: “REMEMBER THE STATION'S BAND. THE PLANE WILL NEED IT.”",
      puzzle:{
        prompt:"Find the three digits that fit the cold-start rule and enter them in order.", placeholder:"000", answers:['842'],
        hints:[
          "The digits halve as you read: the second is half the first, the third is half the second. Try a starting digit and follow it down.",
          "Only one chain of halves sums to 14 — start from 8: 8, 4, 2 makes 14.",
          "8, 4, 2 — enter 842."
        ],
        solvedText:"8-4-2. The generator catches on the second crank and the station wakes around you, room by room, like something remembering how to breathe.",
        solveBeat:"Every light on the station comes up — and out on the ice, at the exact edge of the new light, something steps back one pace. Just enough. It knows exactly how far light reaches.",
        beatSound:'growl'
      }
    }
  ]
},
/* ============ ROOM 3 — THE ICE CORE LAB ============ */
{
  id:'corelab', name:'Room 3 — The Ice Core Lab', scene:'corelab',
  relay:{el:'intercom-lamp',seq:'-... . .-.. --- .--',after:'coldsafe'},
  intro:"Minus forty in here, by design. Sample case E-9 is open, and its meltwater has been walking around.",
  objective:"Learn what the crew drilled up. The cold room keeps its secrets <b>frozen — keep it that way.</b>",
  entryBeat:"Sample E-9's case didn't fail — the bolts were backed out from the inside of the case. Whatever the drill brought up through three hundred thousand years of ice was awake when it arrived.",
  entrySound:'clank',
  completeText:"The tower door unbolts. Behind you, over the intercom from the empty drill shed, the word repeats once more — softer now, like a thing satisfied you finally understand where it went.",
  chain:"E-9's chalked riddle = ICE → core racks: keep only EVEN drill depths; survivors spell BURIED → cold safe multiples-of-three riddle = 936 → the drill-shed intercom clicks morse = BELOW.",
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
    { id:'cores', icon:'🔬', name:'The Core Racks', pos:{x:8,y:26,w:56,h:14}, hiddenUntil:'coreE9',
      desc:"Eight cores in cold storage, each tagged with a letter and the depth it was drilled from (metres). Left to right:\n\nB — 812 m\nT — 435 m\nU — 604 m\nR — 286 m\nO — 3 m … (mislabelled, the tag notes)\nI — 550 m\nE — 178 m\nD — 944 m\n\nThe survey rule, taped to the rack: “ONLY CORES FROM AN EVEN DEPTH STAYED FROZEN THROUGH. ODD-DEPTH CORES CRACKED AND ARE CONTAMINATED.”",
      puzzle:{
        prompt:"Which cores can be trusted? Enter their letters in rack order.", placeholder:"LETTERS", answers:['BURIED'],
        hints:[
          "Even numbers end in 0, 2, 4, 6, 8. Check the last digit of each depth; split the rack among the crew.",
          "Drop the odd depths — T(435) and O(3). Read the even-depth cores left to right.",
          "B(812) U(604) R(286) I(550) E(178) D(944) are all even — the rack spells BURIED."
        ],
        solvedText:"B-U-R-I-E-D. The word the glacier kept trying to say. The trusted cores also hide the cold safe's tag, tucked behind R like a bookmark.",
        solveBeat:"Deep under the floor, the ice groans one long syllable — and the meltwater around E-9's case shivers in rings, in time with it.",
        beatSound:'growl'
      }
    },
    { id:'coldsafe', icon:'🔐', name:'The Cold Safe', pos:{x:8,y:68,w:12,h:20}, hiddenUntil:'cores',
      desc:"The lab's cold safe, 3-digit dial. The tag from the core rack, in the lead scientist's careful print:\n\n“Three different digits, every one a multiple of three, none of them zero.\nThe first is the sum of the other two.\nThe smallest hides in the middle.”",
      puzzle:{
        prompt:"Find the three digits that fit and enter them in order.", placeholder:"000", answers:['936'],
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
      desc:"The intercom to the drill shed crackles alive — and begins to click. Long clicks and short. The drill shed has been empty for nine days. The tower door's 5-letter lock waits.\n\n−···   ·   ·−··   −−−   ·−−",
      puzzle:{
        prompt:"Enter the 5-letter word the intercom is clicking.", placeholder:"5 LETTERS", answers:['BELOW'],
        morse:'-... . .-.. --- .--', morseLocked:'coldsafe',
        hints:[
          "Long and short clicks — five letters, standard code. Call them out together.",
          "−··· is B. The −−− in the middle is O. It's telling you where it went.",
          "−··· · ·−·· −−− ·−− spells BELOW. It went home. For now."
        ],
        solvedText:"B-E-L-O-W. The clicking stops the moment you speak it — message received. The tower door unbolts. You are done asking the station questions; the answers have started coming to find you.",
        solveBeat:"From the drill shaft, far under your boots, comes a sound you feel more than hear — three hundred meters of ice being climbed, without hurry.",
        beatSound:'knock'
      }
    }
  ]
},
/* ============ ROOM 4 — THE RADIO TOWER ============ */
{
  id:'radiotower', name:'Room 4 — The Radio Tower', scene:'radiotower',
  intro:"Dawn is a rumor on the horizon and the plane is up there waiting. Light the runway and bring them down.",
  objective:"Restart the generator, raise the plane, and <b>light the drum line</b> — before what's below finishes its climb.",
  entryBeat:"The tower's guy-wires are thrumming — all of them, evenly. Not the wind. Something at the far anchor point is testing, very gently, whether the tower would fall.",
  entrySound:'clank',
  completeText:"",
  chain:"Generator drill tags with positional constraints → unique order D-E-B-A-C → tower lockbox: “the plane listens at TWICE the station” = 88.2×2 = 176.4 → 1764 → weather fax: only the 6:10 window has legal visibility before fuel runs out; minus 40 min = 5:30 → flare cache: stocked in resupply order, unlocked in reverse = 1486 → light the drum line in the old pattern (SOS) → WHEELS UP.",
  objects:[
    { id:'genstart', icon:'⚙️', name:'The Generator Sled', pos:{x:11,y:66,w:18,h:18},
      desc:"The tower generator's cold-start drill, five steps on five tags shuffled by nine days of wind:\n\nTAG A — “Close the choke — never right before or right after warming the plugs.”\n\nTAG B — “Crank the flywheel. Exactly one step passes between opening the fuel line and cranking.”\n\nTAG C — “Throw the breaker only once the choke is closed.”\n\nTAG D — “Open the fuel line before the glow plugs warm.”\n\nTAG E — “Warm the glow plugs second.”",
      puzzle:{
        prompt:"Enter the five tag letters in start order.", placeholder:"FIVE LETTERS", answers:['DEBAC'],
        hints:[
          "One tag names an exact slot. Fix the glow plugs, then see what must come before them.",
          "Plugs are 2nd; the fuel line comes before them — 1st. 'Exactly one step between fuel line and crank' puts the crank 3rd. Where can the choke legally go?",
          "The choke can't touch slot 1 or 3 (adjacent to the plugs in slot 2)… slot 4. The breaker follows: 5th. D-E-B-A-C."
        ],
        solvedText:"Fuel, plugs, crank, choke, breaker. The generator coughs, catches, and settles into a steady chug that you feel through your boots like a second heartbeat. A better one than the ice's.",
        solveBeat:"The moment the engine steadies, the thrumming in the guy-wires stops — the way a fisherman goes still when the line finally moves.",
        beatSound:'clank'
      }
    },
    { id:'lockbox', icon:'📦', name:'The Tower Lockbox', pos:{x:42,y:68,w:11,h:16},
      desc:"The transmitter's crystal is locked in a 4-digit box, stencilled with the radio officer's rule:\n\n“STATION EREBUS TRANSMITS ON ITS OWN BAND.\nTHE PLANE LISTENS AT TWICE IT.”",
      puzzle:{
        prompt:"Enter the 4-digit code.", placeholder:"0000", answers:['1764'],
        hints:[
          "You found the station's band yourself, on the shortwave in the quarters.",
          "The band was 88.2. The plane listens at twice it.",
          "88.2 × 2 = 176.4 → enter 1764."
        ],
        solvedText:"176.4 — the plane's guard channel. The crystal seats, the transmitter warms, and a voice you could weep at answers on the third call: “Erebus, we see your lights. Give us a runway and a window.”"
      }
    },
    { id:'weather', icon:'🌨️', name:'The Weather Fax', pos:{x:57,y:66,w:14,h:18}, hiddenUntil:'lockbox',
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
      desc:"The flare cache, 4-digit lock, stencilled in the quartermaster's hand:\n\n“STOCKED IN RESUPPLY ORDER.\nUNLOCKED IN REVERSE.”\n\nThe same four supply glyphs from the garage look back at you: ■ ● ✚ ▲.",
      puzzle:{
        prompt:"Enter the 4-digit code.", placeholder:"0000", answers:['1486'],
        hints:[
          "You stocked this code once already — the garage cage, in resupply order.",
          "The garage opened on 6841. Unlock in reverse.",
          "6841 backward is 1486. Enter 1486."
        ],
        solvedText:"1-4-8-6 — the garage code, run backward, the way everything on this station eventually runs. Flares. Dozens. Enough to write on the dark with.",
        solveBeat:"At the base of the tower, unhurried, something begins to climb. The ladder rungs ring one at a time — patient as a metronome, far apart as a tall man's reach. Taller.",
        beatSound:'clank'
      }
    },
    { id:'runway', icon:'🔥', name:'Light the Drum Line', pos:{x:46,y:84,w:14,h:12}, hiddenUntil:'flarebox',
      desc:"The drum line ignition rig: short burns and long, down the line of barrels. One pattern every pilot alive will read from the air — the oldest call there is, written in fire on the ice.\n\nGet it right, and the plane commits. Get it wrong, and they log a false light and climb away.",
      puzzle:{
        type:'signal',
        labels:{short:'🔥 SHORT BURN ·',long:'🔥 LONG BURN −',reset:'SMOTHER THE LINE',send:'🛩️ CALL THEM DOWN'},
        missText:'The line burns nonsense. The plane holds its orbit.',
        prompt:"Burn the distress pattern into the drum line, then CALL THEM DOWN. (Watch the runway behind this panel.)",
        answers:['...---...'],
        hints:[
          "Three letters every pilot knows.",
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
  id:'erebus',
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
  fx:['snow','motes','mist','snow'],
  events:[
    [{s:'hiss',p:.5},{s:'creak',p:.3}],
    [{s:'creak',p:.35},{s:'crackle',p:.3}],
    [{s:'geiger',p:.45},{s:'drip',p:.3}],
    [{s:'chug',p:.5},{s:'creak',p:.25}]
  ],
  wrongBeats:WRONG_BEATS, wrongSounds:WRONG_SOUNDS,
  scenes:SCENES, rooms:ROOMS
});
})();
