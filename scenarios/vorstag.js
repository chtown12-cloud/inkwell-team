/* ============================================================
   SCENARIO: CASTLE VORSTAG (Frankenstein's castle)
   Your carriage broke down. The castle took you in.
   The slab in the laboratory is empty. Charge the tower,
   raise the portcullis, and go — it knows the halls better.
   ============================================================ */
(function(){
const SCENES={};

/* pigpen cipher glyphs — standard key: A-I grid, J-R grid+dot, S-V X, W-Z X+dot */
const PIG=(()=>{
  const grid=(i,dot)=>{
    const r=Math.floor(i/3),c=i%3;
    let d='';
    if(r>0) d+='M7 7 H29 ';
    if(r<2) d+='M7 31 H29 ';
    if(c>0) d+='M7 7 V31 ';
    if(c<2) d+='M29 7 V31 ';
    return `<path d="${d}"/>`+(dot?'<circle cx="18" cy="19" r="2.7" fill="currentColor" stroke="none"/>':'');
  };
  const vee=(i,dot)=>{
    const d=['M7 7 L18 30 L29 7','M7 7 L30 19 L7 31','M29 7 L6 19 L29 31','M7 31 L18 8 L29 31'][i];
    const dp=[[18,13],[13,19],[23,19],[18,25]][i];
    return `<path d="${d}"/>`+(dot?`<circle cx="${dp[0]}" cy="${dp[1]}" r="2.7" fill="currentColor" stroke="none"/>`:'');
  };
  const glyph=ch=>{
    const a='ABCDEFGHI'.indexOf(ch), j='JKLMNOPQR'.indexOf(ch), x='STUV'.indexOf(ch), w='WXYZ'.indexOf(ch);
    const inner = a>=0?grid(a,false) : j>=0?grid(j,true) : x>=0?vee(x,false) : vee(w,true);
    return `<svg width="31" height="34" viewBox="0 0 36 38" style="vertical-align:middle;margin:0 4px;overflow:visible"><g stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="square">${inner}</g></svg>`;
  };
  return word=>'<span style="color:var(--sand)">'+word.split(' ').map(w=>w.split('').map(glyph).join('')).join('<span style="display:inline-block;width:36px"></span>')+'</span>';
})();

/* ---------- Room 1: The Gatehouse Court ---------- */
SCENES.gatehouse=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="vSky" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#0c0a1a"/><stop offset=".7" stop-color="#231a33"/><stop offset="1" stop-color="#171126"/></linearGradient>
 <linearGradient id="vStone" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#2a2436"/><stop offset="1" stop-color="#171221"/></linearGradient>
 <radialGradient id="vTorch"><stop offset="0" stop-color="#ffb45e" stop-opacity=".35"/><stop offset="1" stop-color="#ffb45e" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="900" fill="url(#vSky)"/>
<!-- storm clouds -->
<ellipse class="cloud c1" cx="400" cy="110" rx="300" ry="40" fill="#080614" opacity=".8"/>
<ellipse class="cloud c2" cx="1100" cy="70" rx="360" ry="46" fill="#0a0818" opacity=".8"/>
<path class="flick" d="M980 90 l-30 70 26 -6 -38 90" stroke="#cfd6ff" stroke-width="4" fill="none" opacity=".5"/>
<!-- bats crossing the storm -->
<g class="batfly"><path d="M0 0 q8 -9 15 0 q8 -9 15 0" stroke="#080614" stroke-width="4" fill="none" stroke-linecap="round"/></g>
<g class="batfly b2"><path d="M0 0 q6 -7 12 0 q6 -7 12 0" stroke="#080614" stroke-width="3.5" fill="none" stroke-linecap="round"/></g>
<!-- castle keep behind -->
<g class="plx" data-depth="4" fill="#120d1e">
  <rect x="1080" y="150" width="140" height="420"/>
  <path d="M1080 150 h140 l0 -30 -20 0 0 16 -25 0 0 -16 -25 0 0 16 -25 0 0 -16 -25 0 0 16 -20 0z"/>
  <rect x="1250" y="240" width="200" height="330"/>
  <path d="M1250 240 h200 l0 -30 -28 0 0 16 -36 0 0 -16 -36 0 0 16 -36 0 0 -16 -36 0 0 16 -28 0z"/>
  <rect class="flick" x="1130" y="240" width="26" height="42" fill="#5a4a1a"/>
  <rect x="1320" y="330" width="30" height="46" fill="#241a33"/>
</g>
<!-- gatehouse walls framing -->
<g fill="url(#vStone)">
  <rect x="0" y="240" width="360" height="420"/>
  <path d="M0 240 h360 l0 -34 -30 0 0 18 -42 0 0 -18 -42 0 0 18 -42 0 0 -18 -42 0 0 18 -42 0 0 -18 -42 0 0 18 -42 0 0 -18 -36 0z"/>
</g>
${[0,1,2,3,4].map(i=>`<line x1="${40+i*70}" y1="300" x2="${40+i*70}" y2="640" stroke="#0d0a16" stroke-width="3" opacity=".6"/>`).join('')}
<!-- torch on wall -->
<g>
  <rect x="320" y="330" width="10" height="52" fill="#241a10"/>
  <circle cx="325" cy="316" r="70" fill="url(#vTorch)"/>
  <path class="flame" d="M325 322 q-14 -24 0 -44 q14 22 0 44z" fill="#ffb45e"/>
</g>
<!-- family crest shields -->
<g id="art-crests">
${[['L',90,420],['W',196,420],['L',302,420],['E',154,540]].map(([ch,x,y])=>
 `<g><path d="M${x-34} ${y} h68 v54 q0 26 -34 40 q-34 -14 -34 -40z" fill="#3a2d4a" stroke="#5c4a74" stroke-width="4"/>
  <text x="${x}" y="${y+52}" text-anchor="middle" font-family="Special Elite" font-size="30" fill="#e0cfa2">${ch}</text></g>`).join('')}
</g>
<!-- courtyard flagstones -->
<path d="M0 660 h1600 v240 h-1600z" fill="#1c1626"/>
${[0,1,2,3,4,5,6].map(i=>`<line x1="${i*260-80}" y1="660" x2="${i*300-200}" y2="900" stroke="#0d0a16" stroke-width="4"/>`).join('')}
<line x1="0" y1="660" x2="1600" y2="660" stroke="#0a0812" stroke-width="6"/>
<!-- the well -->
<g id="art-well">
  <ellipse cx="700" cy="700" rx="120" ry="34" fill="#0d0a16"/>
  <path d="M580 700 q0 -44 120 -44 q120 0 120 44 l0 26 q0 -40 -120 -40 q-120 0 -120 40z" fill="#3a3244"/>
  <rect x="600" y="540" width="12" height="130" fill="#241a10"/><rect x="788" y="540" width="12" height="130" fill="#241a10"/>
  <path d="M590 540 h220 l-20 -34 h-180z" fill="#171126"/>
  <rect x="660" y="590" width="80" height="22" rx="10" fill="#5c4a30"/>
  <text x="700" y="760" text-anchor="middle" font-size="17" fill="#8f7fa8">☾7 ✠3 ⚘9 ♜5</text>
</g>
<!-- the sealed doors -->
<g id="art-doors">
  <path d="M1030 420 q0 -70 90 -70 q90 0 90 70 l0 240 h-180z" fill="#241a10" stroke="#171126" stroke-width="8"/>
  <line x1="1120" y1="352" x2="1120" y2="660" stroke="#171126" stroke-width="6"/>
  ${[0,1,2].map(i=>`<circle cx="${1075+i*45}" cy="${470+i*8}" r="4" fill="#5c4a30"/>`).join('')}
  <circle cx="1102" cy="540" r="9" fill="#0d0a16" stroke="#8a7430" stroke-width="3"/>
  <rect x="1064" y="440" width="112" height="30" rx="4" fill="#171126"/>
</g>
<!-- tapestry -->
<g id="art-tapestry">
  <rect x="440" y="300" width="150" height="230" fill="#3a1d2a" stroke="#5c3244" stroke-width="6"/>
  <path d="M448 320 q66 30 134 0 M448 380 q66 30 134 0 M448 440 q66 30 134 0" stroke="#8a5c30" stroke-width="4" fill="none"/>
  <text x="515" y="360" text-anchor="middle" font-size="15" fill="#e0cfa2">⚘</text>
  <text x="515" y="420" text-anchor="middle" font-size="15" fill="#e0cfa2">✠</text>
  <text x="515" y="480" text-anchor="middle" font-size="15" fill="#e0cfa2">♜</text>
  <text x="552" y="360" text-anchor="middle" font-size="11" fill="#c9bde0">SPRING</text>
  <text x="552" y="420" text-anchor="middle" font-size="11" fill="#c9bde0">SUMMER</text>
  <text x="552" y="480" text-anchor="middle" font-size="11" fill="#c9bde0">AUTUMN</text>
</g>
<!-- gatekeeper's ledger stand -->
<g id="el-ledger">
  <rect x="880" y="600" width="16" height="90" fill="#241a10"/>
  <path d="M830 596 l66 -14 66 14 -66 12z" fill="#3a2d1a"/>
  <path d="M836 592 l60 -12 0 8 -60 12z" fill="#d9cba6"/>
  <path d="M896 580 l60 12 0 8 -60 -12z" fill="#cfc0a0"/>
</g>
<!-- broken carriage at edge -->
<g opacity=".9">
  <ellipse cx="1420" cy="820" rx="130" ry="16" fill="#0a0812"/>
  <path d="M1330 760 q30 -50 120 -46 l80 10 -14 60z" fill="#171126"/>
  <circle cx="1370" cy="806" r="34" fill="none" stroke="#241a33" stroke-width="9"/>
  <circle cx="1500" cy="790" r="26" fill="none" stroke="#241a33" stroke-width="8" transform="rotate(30 1500 790)"/>
</g>
<!-- wolf eyes at treeline -->
<g class="eyes"><circle cx="70" cy="760" r="4" fill="#e0d0a0"/><circle cx="90" cy="760" r="4" fill="#e0d0a0"/></g>
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-gatehouse" cx="790" cy="210" r="6" fill="#ffb45e" opacity=".12"/>
<circle cx="790" cy="210" r="20" fill="#ffb45e" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-gatehouse" class="surge" cx="1390" cy="680" rx="96" ry="70" fill="#ff9a4a" opacity="0"/>
<!-- the storm the Baron waited for, still arriving -->
<line class="rainrun" x1="620" y1="0" x2="612" y2="46" stroke="#b8d4ea" stroke-width="1.8" opacity=".55" style="animation-delay:0.0s;animation-duration:1.5s"/><line class="rainrun" x1="676" y1="0" x2="668" y2="46" stroke="#b8d4ea" stroke-width="1.8" opacity=".55" style="animation-delay:0.37s;animation-duration:1.9s"/><line class="rainrun" x1="732" y1="0" x2="724" y2="46" stroke="#b8d4ea" stroke-width="1.8" opacity=".55" style="animation-delay:0.74s;animation-duration:2.3s"/><line class="rainrun" x1="788" y1="0" x2="780" y2="46" stroke="#b8d4ea" stroke-width="1.8" opacity=".55" style="animation-delay:1.1099999999999999s;animation-duration:1.5s"/><line class="rainrun" x1="844" y1="0" x2="836" y2="46" stroke="#b8d4ea" stroke-width="1.8" opacity=".55" style="animation-delay:1.48s;animation-duration:1.9s"/><line class="rainrun" x1="900" y1="0" x2="892" y2="46" stroke="#b8d4ea" stroke-width="1.8" opacity=".55" style="animation-delay:1.85s;animation-duration:2.3s"/><line class="rainrun" x1="956" y1="0" x2="948" y2="46" stroke="#b8d4ea" stroke-width="1.8" opacity=".55" style="animation-delay:2.2199999999999998s;animation-duration:1.5s"/><line class="rainrun" x1="1000" y1="0" x2="992" y2="46" stroke="#b8d4ea" stroke-width="1.8" opacity=".55" style="animation-delay:2.59s;animation-duration:1.9s"/><line class="rainrun" x1="1240" y1="0" x2="1232" y2="46" stroke="#b8d4ea" stroke-width="1.8" opacity=".55" style="animation-delay:2.96s;animation-duration:2.3s"/><line class="rainrun" x1="1320" y1="0" x2="1312" y2="46" stroke="#b8d4ea" stroke-width="1.8" opacity=".55" style="animation-delay:0.1299999999999999s;animation-duration:1.5s"/><line class="rainrun" x1="1400" y1="0" x2="1392" y2="46" stroke="#b8d4ea" stroke-width="1.8" opacity=".55" style="animation-delay:0.5s;animation-duration:1.9s"/><line class="rainrun" x1="1480" y1="0" x2="1472" y2="46" stroke="#b8d4ea" stroke-width="1.8" opacity=".55" style="animation-delay:0.8700000000000001s;animation-duration:2.3s"/><line class="rainrun" x1="1560" y1="0" x2="1552" y2="46" stroke="#b8d4ea" stroke-width="1.8" opacity=".55" style="animation-delay:1.2399999999999993s;animation-duration:1.5s"/>
<g class="batfly" style="animation-delay:1s"><path d="M420 120 q10 -8 20 0 q-10 -4 -20 0" fill="#0b0d12" opacity=".8"/></g>
<g class="batfly" style="animation-delay:8s"><path d="M420 76 q8 -6 16 0 q-8 -3 -16 0" fill="#0b0d12" opacity=".6"/></g>
<ellipse class="drift" cx="1240" cy="110" rx="200" ry="26" fill="#0d1018" opacity=".55"/></g>
</svg>`;

/* ---------- Room 2: The Library ---------- */
SCENES.library=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="vLib" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#170f1e"/><stop offset="1" stop-color="#241a2b"/></linearGradient>
 <radialGradient id="vHearth"><stop offset="0" stop-color="#ff9a4a" stop-opacity=".4"/><stop offset="1" stop-color="#ff9a4a" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="640" fill="url(#vLib)"/>
<rect y="640" width="1600" height="260" fill="#1a1010"/>
${[0,1,2,3,4,5].map(i=>`<line x1="${i*300-100}" y1="640" x2="${i*340-200}" y2="900" stroke="#0d0806" stroke-width="5"/>`).join('')}
<!-- bookshelves -->
${[0,1].map(s=>`<g transform="translate(${40+s*270},0)">
  <rect x="0" y="150" width="230" height="490" fill="#241626"/>
  ${[0,1,2,3,4].map(r=>`<g><rect x="12" y="${170+r*96}" width="206" height="70" fill="#120a14"/>
   ${[...Array(9)].map((_,b)=>`<rect x="${18+b*22}" y="${176+r*96+(b%3)*4}" width="16" height="${60-(b%3)*6}" fill="${['#3a2d4a','#4a2d3a','#2d3a4a','#4a3a2d'][((b+r)%4)]}"/>`).join('')}
  </g>`).join('')}
</g>`).join('')}
<!-- fireplace -->
<g>
  <rect x="620" y="420" width="240" height="220" fill="#2a2436"/>
  <rect x="650" y="470" width="180" height="170" rx="10" fill="#0d0806"/>
  <circle cx="740" cy="620" r="110" fill="url(#vHearth)"/>
  <path class="flame" d="M710 636 q-14 -40 10 -66 q6 26 22 34 q-4 -34 18 -52 q4 40 20 54 q10 12 4 30z" fill="#ff9a4a"/>
  <path class="flame" d="M726 636 q-6 -22 10 -38 q10 20 4 38z" fill="#ffd894" style="animation-delay:.2s"/>
  <rect x="600" y="410" width="280" height="20" fill="#3a3244"/>
  <circle class="sparkup" cx="726" cy="600" r="2.6" fill="#ffb45e"/>
  <circle class="sparkup s2" cx="748" cy="606" r="2.2" fill="#ffd894"/>
  <circle class="sparkup s3" cx="762" cy="596" r="2" fill="#ff9a4a"/>
</g>
<!-- the pipe organ -->
<g id="art-organ">
  <rect x="1220" y="220" width="330" height="420" fill="#241626" stroke="#3a2d4a" stroke-width="6"/>
  ${[0,1,2,3,4,5,6].map(i=>`<rect x="${1250+i*40}" y="${250+Math.abs(3-i)*24}" width="26" height="${240-Math.abs(3-i)*40}" rx="8" fill="#6a5a7c"/>`).join('')}
  <rect x="1240" y="520" width="290" height="50" fill="#171021"/>
  ${[...Array(14)].map((_,i)=>`<rect x="${1252+i*19}" y="526" width="15" height="38" fill="${i%7===2||i%7===5?'#171021':'#d9cba6'}" stroke="#0d0a16" stroke-width="1"/>`).join('')}
  <rect x="1300" y="580" width="170" height="34" rx="6" fill="#0d0a16"/>
  <text class="flick" x="1385" y="603" text-anchor="middle" font-family="Special Elite" font-size="17" fill="#c9a04a">STOP ---.-</text>
</g>
<!-- hymn board -->
<g id="art-hymnboard">
  <rect x="1080" y="260" width="110" height="150" fill="#241a10" stroke="#3a2d1a" stroke-width="5"/>
  <text x="1135" y="292" text-anchor="middle" font-family="Special Elite" font-size="13" fill="#d9cba6">HYMN</text>
  <rect x="1096" y="304" width="78" height="34" fill="#d9cba6"/>
  <text x="1135" y="328" text-anchor="middle" font-family="Special Elite" font-size="19" fill="#3a2d1c">CXIX</text>
  <rect x="1096" y="348" width="78" height="26" fill="#cfc0a0"/>
  <text x="1135" y="366" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#3a2d1c">VERSE ?</text>
</g>
<!-- hidden panel behind organ (the chimes) -->
<g id="el-chimes">
  <rect x="1130" y="470" width="80" height="120" fill="#120a14" stroke="#5c4a74" stroke-width="4"/>
  ${[0,1,2].map(i=>`<circle class="flick" cx="1170" cy="${500+i*32}" r="10" fill="none" stroke="#c9a04a" stroke-width="3" style="animation-delay:${i*.4}s"/>`).join('')}
</g>
<!-- folio desk -->
<g id="el-folio">
  <rect x="360" y="560" width="220" height="18" fill="#3a2d1a"/>
  <rect x="376" y="578" width="188 " height="90" fill="#241a10"/>
  <path d="M400 552 l70 -12 6 26 -70 13z" fill="#d9cba6"/>
  <path d="M470 540 l66 8 -2 26 -66 -8z" fill="#cfc0a0"/>
  <text x="470" y="536" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#8f7fa8">XLI HSSV...</text>
  <circle cx="404" cy="536" r="12" fill="#0d0a16"/><path class="flame" d="M404 528 q-5 -10 0 -16 q5 8 0 16z" fill="#ffd894"/>
</g>
<!-- the orrery -->
<g id="el-orrery">
  <rect x="700" y="700 " width="14" height="110" fill="#241a10"/>
  <circle cx="707" cy="690" r="9" fill="#c9a04a"/>
  ${[[34,'#8f7fa8'],[58,'#6a5a7c'],[84,'#4a3a5c']].map(([r,c],i)=>`<g><circle cx="707" cy="690" r="${r}" fill="none" stroke="${c}" stroke-width="2"/>
   <circle class="bob" cx="${707+r}" cy="690" r="${5+i*2}" fill="${c}" style="animation-delay:${i*.7}s"/></g>`).join('')}
  <rect x="640" y="806" width="140" height="22" rx="6" fill="#171021"/>
  ${[0,1,2].map(i=>`<circle cx="${676+i*32}" cy="817" r="7" fill="#0d0a16" stroke="#5c4a74" stroke-width="2"/>`).join('')}
</g>
<!-- portrait with followed eyes -->
<g>
  <rect x="900" y="230" width="130" height="170" fill="#0d0806" stroke="#5c4a30" stroke-width="8"/>
  <ellipse cx="965" cy="300" rx="34" ry="44" fill="#241a2b"/>
  <g class="eyes"><circle cx="953" cy="292" r="3.5" fill="#e0d0a0"/><circle cx="977" cy="292" r="3.5" fill="#e0d0a0"/></g>
  <text x="965" y="392" text-anchor="middle" font-family="Special Elite" font-size="10" fill="#8f7fa8">BARON VORSTAG</text>
</g>
<!-- candelabrum -->
<g>
  <rect x="200" y="700 " width="10" height="80" fill="#3a3244"/>
  ${[-24,0,24].map((dx,i)=>`<g><rect x="${201+dx}" y="${690-Math.abs(dx)*.3}" width="8" height="20" fill="#d9cba6"/>
  <path class="flame" d="M${205+dx} ${684-Math.abs(dx)*.3} q-4 -9 0 -14 q4 7 0 14z" fill="#ffd894" style="animation-delay:${i*.3}s"/></g>`).join('')}
</g>
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-library" cx="230" cy="210" r="6" fill="#ffb45e" opacity=".12"/>
<circle cx="230" cy="210" r="20" fill="#ffb45e" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-library" class="surge" cx="850" cy="430" rx="96" ry="70" fill="#ff9a4a" opacity="0"/>
<!-- candles that have been guttering for decades -->
<g class="flamewob" style="transform-origin:150px 150px"><ellipse cx="150" cy="150" rx="7" ry="14" fill="#ffb45e" opacity=".7"/></g>
<g class="flamewob" style="animation-delay:1.1s;transform-origin:1500px 214px"><ellipse cx="1500" cy="214" rx="6" ry="12" fill="#ffb45e" opacity=".6"/></g>
<ellipse cx="150" cy="150" rx="70" ry="60" fill="#ffb45e" opacity=".07"/>
<ellipse cx="1500" cy="216" rx="54" ry="46" fill="#ffb45e" opacity=".06"/>
<!-- cobwebs breathing in a room with no draught -->
<g opacity=".16" class="sway" style="transform-origin:0 0"><path d="M0 30 q70 30 104 86 M0 90 q60 6 104 24" stroke="#d8ccae" stroke-width="2" fill="none"/></g>
<!-- something crosses the floor beside the hearth and is not there when you look -->
<ellipse class="shadowpass" cx="900" cy="770" rx="46" ry="112" fill="#04060a" opacity="0" style="animation-duration:23s;filter:blur(7px)"/>
<circle class="sparkle" cx="300" cy="40" r="2" fill="#e6d6ae" style="animation-delay:0.0s"/><circle class="sparkle" cx="460" cy="69" r="2" fill="#e6d6ae" style="animation-delay:1.1s"/><circle class="sparkle" cx="620" cy="98" r="2" fill="#e6d6ae" style="animation-delay:2.2s"/><circle class="sparkle" cx="780" cy="67" r="2" fill="#e6d6ae" style="animation-delay:3.3000000000000003s"/><circle class="sparkle" cx="940" cy="96" r="2" fill="#e6d6ae" style="animation-delay:4.4s"/><circle class="sparkle" cx="1100" cy="65" r="2" fill="#e6d6ae" style="animation-delay:0.5s"/><circle class="sparkle" cx="1260" cy="94" r="2" fill="#e6d6ae" style="animation-delay:1.6000000000000005s"/></g>
</svg>`;

/* ---------- Room 3: The Laboratory ---------- */
SCENES.laboratory=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="vLab" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#0d1416"/><stop offset="1" stop-color="#16211f"/></linearGradient>
 <radialGradient id="vGreen"><stop offset="0" stop-color="#7ce8a8" stop-opacity=".28"/><stop offset="1" stop-color="#7ce8a8" stop-opacity="0"/></radialGradient>
</defs>
<rect width="1600" height="620" fill="url(#vLab)"/>
<rect y="620" width="1600" height="280" fill="#101414"/>
${[0,1,2,3,4,5].map(i=>`<line x1="${i*300-120}" y1="620" x2="${i*340-220}" y2="900" stroke="#070a09" stroke-width="5"/>`).join('')}
<!-- chains from the ceiling -->
${[380,520,1060,1200].map((x,i)=>`<g class="lampswing" style="animation-delay:${i*.8}s">
 <line x1="${x}" y1="0" x2="${x}" y2="${150+(i%2)*60}" stroke="#26313a" stroke-width="7" stroke-dasharray="12 6"/>
 <circle cx="${x}" cy="${158+(i%2)*60}" r="10" fill="none" stroke="#26313a" stroke-width="5"/></g>`).join('')}
<!-- stray voltage arcing between the ceiling chains -->
<path class="arcflick" d="M380 190 l24 10 -14 12 30 8 -16 14 28 10" stroke="#9fb8e8" stroke-width="2.5" fill="none"/>
<path class="arcflick a2" d="M1060 210 l-22 12 16 10 -28 10 18 12 -24 10" stroke="#9fb8e8" stroke-width="2.5" fill="none"/>
<!-- the empty slab -->
<g id="art-slab">
  <ellipse cx="800" cy="600" rx="270" ry="26" fill="#070a09"/>
  <path d="M560 480 l480 0 24 100 -528 0z" fill="#3a4448" stroke="#26313a" stroke-width="5"/>
  <rect x="600" y="452" width="400" height="34" rx="8" fill="#4a565c"/>
  ${[0,1,2,3].map(i=>`<g><rect x="${640+i*90}" y="440" width="34" height="14" rx="6" fill="#26313a"/>
   <path d="M${657+i*90} 454 q${(i%2?14:-14)} 20 0 34" stroke="#26313a" stroke-width="6" fill="none"/></g>`).join('')}
  <ellipse class="flick" cx="800" cy="470" rx="190" ry="20" fill="url(#vGreen)"/>
</g>
<!-- leyden jar rack -->
<g id="el-jars">
  <rect x="120" y="330" width="560" height="16" fill="#26313a"/>
  ${[['R',160],['M',226],['I',292],['U',358],['S',424],['E',490],['D',556],['N',622]].map(([ch,x],i)=>
  `<g><rect x="${x-22}" y="240" width="44" height="90" rx="10" fill="#1c2e34" stroke="#3a565c" stroke-width="3"/>
   <rect class="flick" x="${x-14}" y="254" width="28" height="40" rx="6" fill="#2a4a42" style="animation-delay:${i*.35}s"/>
   <text x="${x}" y="320" text-anchor="middle" font-family="Special Elite" font-size="17" fill="#9fc8ae">${ch}</text></g>`).join('')}
</g>
<!-- galvanic switchboard -->
<g id="el-switchboard">
  <rect x="1240" y="280" width="260" height="300" rx="10" fill="#1a2426" stroke="#3a4a44" stroke-width="6"/>
  ${[0,1,2].map(r=>[0,1,2].map(c=>`<g><circle cx="${1290+c*80}" cy="${330+r*80}" r="18" fill="#0d1416" stroke="#4a5a52" stroke-width="4"/>
   <line x1="${1290+c*80}" y1="${330+r*80}" x2="${1290+c*80+((r+c)%2?11:-9)}" y2="${318+r*80}" stroke="#c9a04a" stroke-width="4"/></g>`).join('')).join('')}
  <rect x="1290" y="536" width="160" height="26" rx="6" fill="#0d1416"/>
</g>
<!-- workbench with glassware -->
<g>
  <rect x="80" y="560" width="480" height="20" fill="#3a2d1a"/>
  <rect x="96" y="580" width="448" height="110" fill="#241a10"/>
  ${[0,1,2].map(i=>`<g><path d="M${150+i*130} 560 v-40 q0 -14 14 -14 q14 0 14 14 v40z" fill="#1c3a34" opacity=".9"/>
   <ellipse class="steam" cx="${164+i*130}" cy="500" rx="9" ry="5" fill="#9fc8ae" opacity=".3" style="animation-delay:${i*1.2}s"/></g>`).join('')}
</g>
<!-- dumbwaiter with bell -->
<g id="el-dumbwaiter">
  <rect x="880 " y="640" width="170" height="200" fill="#1a1416" stroke="#3a2d1a" stroke-width="8"/>
  <rect x="900" y="660" width="130" height="130" fill="#070a09"/>
  <path d="M946 720 a20 20 0 0 1 40 0 l4 16 h-48z" fill="#c9a04a"/>
  <circle id="dumb-lamp" cx="966" cy="748" r="8" fill="#ffdf9c" opacity=".1"/>
  <text x="966" y="830" text-anchor="middle" font-family="Special Elite" font-size="11" fill="#8fa596">FROM THE CELLAR</text>
</g>
<!-- specimen shelf -->
<g opacity=".9">
  <rect x="700" y="200 " width="240" height="12" fill="#26313a"/>
  ${[0,1,2].map(i=>`<g><rect x="${726+i*72}" y="140" width="46" height="60" rx="8" fill="#16211f" stroke="#2a4a42" stroke-width="3"/>
   <ellipse class="bob" cx="${749+i*72}" cy="172" rx="12" ry="${14+i*3}" fill="#2a4a42" style="animation-delay:${i*.9}s"/></g>`).join('')}
</g>
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-laboratory" cx="900" cy="210" r="6" fill="#ffb45e" opacity=".12"/>
<circle cx="900" cy="210" r="20" fill="#ffb45e" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-laboratory" class="surge" cx="280" cy="630" rx="96" ry="70" fill="#ff9a4a" opacity="0"/>
<!-- condensation finding its way down the glassware -->
<circle class="dripdrop" cx="760" cy="120" r="4" fill="#bfe8ff" opacity=".5" style="animation-delay:2s"/>
<circle class="dripdrop" cx="1120" cy="100" r="3.4" fill="#bfe8ff" opacity=".4" style="animation-delay:8s"/>
<!-- more current finding its way across the rig -->
<g class="arcflick" style="animation-delay:3.5s"><path d="M840 90 l24 18 l-13 7 l20 14" stroke="#bfe9ff" stroke-width="2.2" fill="none"/></g>
<g class="arcflick" style="animation-delay:9s"><path d="M1180 60 l-20 16 l12 6 l-18 12" stroke="#bfe9ff" stroke-width="2" fill="none"/></g>
<!-- a chain still swinging from something that passed -->
<g class="swing" style="transform-origin:1010px 0"><line x1="1010" y1="0" x2="1010" y2="150" stroke="#2a3a34" stroke-width="4"/>
  <circle cx="1010" cy="156" r="7" fill="#2a3a34"/></g>
<ellipse class="fogdrift" cx="800" cy="860" rx="420" ry="26" fill="#8fb8a8" opacity=".06"/>

<g class="arcflick" style="animation-delay:1.2s"><path d="M300 120 l22 16 l-12 6 l18 12" stroke="#bfe9ff" stroke-width="2" fill="none"/></g>
<g class="arcflick" style="animation-delay:6.4s"><path d="M1320 90 l-18 14 l11 6 l-16 11" stroke="#bfe9ff" stroke-width="1.8" fill="none"/></g>
<circle class="slowblink" cx="1150" cy="170" r="5" fill="#8fd8ff" opacity=".55" style="animation-delay:.9s"/>
<circle class="dripdrop" cx="250" cy="40" r="3.2" fill="#bfe8ff" opacity=".4" style="animation-delay:5.5s"/>
<ellipse class="fogdrift" cx="400" cy="884" rx="300" ry="18" fill="#8fb8a8" opacity=".05" style="animation-delay:6s"/>
<ellipse class="fogdrift" cx="1300" cy="866" rx="260" ry="16" fill="#8fb8a8" opacity=".05" style="animation-delay:13s"/>
<circle class="sparkle" cx="220" cy="60" r="2.2" fill="#cfe6df" style="animation-delay:0.0s"/><circle class="sparkle" cx="400" cy="97" r="2.2" fill="#cfe6df" style="animation-delay:0.9s"/><circle class="sparkle" cx="580" cy="134" r="2.2" fill="#cfe6df" style="animation-delay:1.8s"/><circle class="sparkle" cx="760" cy="61" r="2.2" fill="#cfe6df" style="animation-delay:2.7s"/><circle class="sparkle" cx="940" cy="98" r="2.2" fill="#cfe6df" style="animation-delay:3.6s"/><circle class="sparkle" cx="1120" cy="135" r="2.2" fill="#cfe6df" style="animation-delay:4.5s"/><circle class="sparkle" cx="1300" cy="62" r="2.2" fill="#cfe6df" style="animation-delay:0.40000000000000036s"/></g>
</svg>`;

/* ---------- Room 4: The Tower ---------- */
SCENES.tower=()=>`
<svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">
<defs>
 <linearGradient id="vTow" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#0a0818"/><stop offset=".6" stop-color="#1d1430"/><stop offset="1" stop-color="#241a33"/></linearGradient>
</defs>
<rect width="1600" height="900" fill="url(#vTow)"/>
<!-- roiling storm -->
<ellipse class="cloud c1" cx="380" cy="90" rx="340" ry="50" fill="#060412" opacity=".9"/>
<ellipse class="cloud c2" cx="1150" cy="130" rx="400" ry="56" fill="#080616" opacity=".9"/>
<ellipse class="cloud c3" cx="760" cy="60" rx="300" ry="40" fill="#0a0818" opacity=".85"/>
<path class="flick" d="M1120 150 l-36 84 30 -8 -44 108" stroke="#cfd6ff" stroke-width="5" fill="none" opacity=".6"/>
<path class="flick" d="M330 130 l-24 60 20 -6 -30 76" stroke="#cfd6ff" stroke-width="4" fill="none" opacity=".45" style="animation-delay:1.7s"/>
<!-- tower battlements -->
<path d="M0 640 h1600 v260 h-1600z" fill="#221a33"/>
<path d="M0 640 h1600 l0 -36 -60 0 0 20 -80 0 0 -20 -80 0 0 20 -80 0 0 -20 -80 0 0 20 -80 0 0 -20 -80 0 0 20 -80 0 0 -20 -80 0 0 20 -80 0 0 -20 -80 0 0 20 -80 0 0 -20 -80 0 0 20 -80 0 0 -20 -80 0 0 20 -80 0 0 -20 -80 0 0 20 -80 0 0 -20 -76 0z" fill="#171126"/>
${[0,1,2,3,4].map(i=>`<line x1="${i*380-60}" y1="660" x2="${i*400-120}" y2="900" stroke="#0d0a16" stroke-width="4" opacity=".7"/>`).join('')}
<!-- the lightning rod -->
<g id="el-rod">
  <rect x="770" y="150" width="18" height="440" fill="#26313a"/>
  <path d="M779 150 l0 -70" stroke="#4a5a62" stroke-width="8"/>
  <circle cx="779" cy="72" r="10" fill="#8fa8c8"/>
  ${[0,1,2].map(i=>`<line x1="779" y1="${220+i*110}" x2="${820+i*24}" y2="${250+i*110}" stroke="#26313a" stroke-width="7"/>`).join('')}
  <circle class="slowblink" cx="779" cy="600" r="12" fill="#c9d6ff"/>
</g>
<!-- the coil spitting early sparks -->
<path class="arcflick" d="M515 400 l14 -16 -8 -6 16 -14" stroke="#c9d6ff" stroke-width="3" fill="none"/>
<path class="arcflick a2" d="M515 404 l-16 -14 10 -6 -14 -16" stroke="#c9d6ff" stroke-width="2.5" fill="none"/>
<!-- the great coil -->
<g id="art-coil">
  <rect x="440" y="430" width="150 " height="180" rx="16" fill="#2a2436" stroke="#3a2d4a" stroke-width="5"/>
  ${[0,1,2,3,4,5].map(i=>`<ellipse cx="515" cy="${450+i*28}" rx="66" ry="9" fill="none" stroke="#8a6f52" stroke-width="5"/>`).join('')}
  <circle class="flick" cx="515" cy="416" r="16" fill="#9fb8e8"/>
</g>
<!-- capacitor bank -->
<g id="art-capacitor">
  <rect x="1050" y="450" width="220" height="160" rx="12" fill="#1d1430" stroke="#3a2d4a" stroke-width="6"/>
  ${[0,1,2].map(i=>`<rect class="flick" x="${1072+i*62}" y="472" width="42" height="80" rx="8" fill="#0d0a16" stroke="#5c4a74" stroke-width="3" style="animation-delay:${i*.5}s"/>`).join('')}
  <rect x="1080" y="566" width="160" height="24" rx="6" fill="#0d0a16"/>
  <line x1="1160" y1="450" x2="900 " y2="240" stroke="#26313a" stroke-width="5"/>
</g>
<!-- chapel fuse box -->
<g id="el-fusebox">
  <rect x="220" y="470" width="120" height="150" rx="8" fill="#241a10" stroke="#3a2d1a" stroke-width="6"/>
  <line x1="280" y1="470" x2="280" y2="620" stroke="#3a2d1a" stroke-width="4"/>
  <text x="280" y="456" text-anchor="middle" font-family="Special Elite" font-size="12" fill="#c9bde0">CHAPEL MAINS</text>
  ${[0,1,2,3].map(i=>`<circle cx="${252+(i%2)*56}" cy="${510+Math.floor(i/2)*56}" r="10" fill="#0d0a16" stroke="#8a7430" stroke-width="3"/>`).join('')}
</g>
<!-- storm-glass table -->
<g id="el-barometer">
  <rect x="640" y="690 " width="14" height="120" fill="#241a10"/>
  <ellipse cx="647" cy="690" rx="90" ry="18" fill="#2a2436"/>
  <path d="M620 676 v-50 q0 -16 16 -16 q16 0 16 16 v50z" fill="#1c2e3a" opacity=".95"/>
  <path class="bob" d="M628 650 q8 -10 16 0 q-8 8 -16 0z" fill="#9fb8e8"/>
  <rect x="680" y="646" width="66" height="44" rx="4" fill="#d9cba6" transform="rotate(6 713 668)"/>
</g>
<!-- portcullis winch glyphs -->
<g id="el-portcullis">
  <rect x="1380" y="660" width="160" height="180" rx="10" fill="#2a2436" stroke="#3a2d4a" stroke-width="6"/>
  <circle cx="1460" cy="720" r="34" fill="#171126" stroke="#5c4a74" stroke-width="6"/>
  ${[0,1,2,3].map(i=>`<line x1="1460" y1="720" x2="${Math.round(1460+40*Math.cos(i*Math.PI/2+0.6))}" y2="${Math.round(720+40*Math.sin(i*Math.PI/2+0.6))}" stroke="#5c4a74" stroke-width="6"/>`).join('')}
  <text x="1460" y="790" text-anchor="middle" font-size="16" fill="#e0cfa2">☾ ✠ ⚘ ♜</text>
  <text x="1460" y="816" text-anchor="middle" font-family="Special Elite" font-size="10" fill="#8f7fa8">THE GATE WINDS BACK</text>
</g>
<!-- valley below, tiny village lights -->
<g class="plx" data-depth="5">
  ${[0,1,2,3,4].map(i=>`<circle class="tw" cx="${140+i*90}" cy="${856+((i*13)%18)}" r="2.5" fill="#ffd98c" style="animation-delay:${i*.8}s"/>`).join('')}
</g>
<g class="atmo">
<!-- something in here is still running -->
<circle id="rl-tower" cx="230" cy="210" r="6" fill="#ffb45e" opacity=".12"/>
<circle cx="230" cy="210" r="20" fill="#ffb45e" opacity=".05"/>
<!-- and something here answers back when the room gives way -->
<ellipse id="rx-tower" class="surge" cx="1180" cy="430" rx="96" ry="70" fill="#ff9a4a" opacity="0"/>
<!-- the front arriving, hard -->
<line class="rainrun" x1="980" y1="0" x2="968" y2="52" stroke="#b8d4ea" stroke-width="2" opacity=".55" style="animation-delay:0.0s;animation-duration:1.3s"/><line class="rainrun" x1="1050" y1="0" x2="1038" y2="52" stroke="#b8d4ea" stroke-width="2" opacity=".55" style="animation-delay:0.29s;animation-duration:1.6s"/><line class="rainrun" x1="1120" y1="0" x2="1108" y2="52" stroke="#b8d4ea" stroke-width="2" opacity=".55" style="animation-delay:0.58s;animation-duration:1.9s"/><line class="rainrun" x1="1190" y1="0" x2="1178" y2="52" stroke="#b8d4ea" stroke-width="2" opacity=".55" style="animation-delay:0.8699999999999999s;animation-duration:1.3s"/><line class="rainrun" x1="1260" y1="0" x2="1248" y2="52" stroke="#b8d4ea" stroke-width="2" opacity=".55" style="animation-delay:1.16s;animation-duration:1.6s"/><line class="rainrun" x1="1330" y1="0" x2="1318" y2="52" stroke="#b8d4ea" stroke-width="2" opacity=".55" style="animation-delay:1.45s;animation-duration:1.9s"/><line class="rainrun" x1="1400" y1="0" x2="1388" y2="52" stroke="#b8d4ea" stroke-width="2" opacity=".55" style="animation-delay:1.7399999999999998s;animation-duration:1.3s"/><line class="rainrun" x1="1470" y1="0" x2="1458" y2="52" stroke="#b8d4ea" stroke-width="2" opacity=".55" style="animation-delay:2.03s;animation-duration:1.6s"/><line class="rainrun" x1="1540" y1="0" x2="1528" y2="52" stroke="#b8d4ea" stroke-width="2" opacity=".55" style="animation-delay:2.32s;animation-duration:1.9s"/>
<g class="batfly" style="animation-delay:2s"><path d="M1000 70 q11 -9 22 0 q-11 -4 -22 0" fill="#090c11" opacity=".75"/></g>
<g class="batfly" style="animation-delay:12s"><path d="M1000 40 q8 -7 16 0 q-8 -3 -16 0" fill="#090c11" opacity=".55"/></g>
<ellipse class="drift" cx="1180" cy="80" rx="230" ry="24" fill="#0b0e15" opacity=".5"/>
<g class="sparkrise" style="animation-delay:1.4s"><circle cx="1120" cy="520" r="2.6" fill="#cfe9ff"/></g>

<g class="sparkrise" style="animation-delay:.4s"><circle cx="1000" cy="560" r="2.4" fill="#cfe9ff"/></g>
<g class="sparkrise s2" style="animation-delay:2.2s"><circle cx="1240" cy="600" r="2" fill="#bfe0ff"/></g>
<g class="sparkrise s3" style="animation-delay:3.6s"><circle cx="1120" cy="580" r="2.2" fill="#dff0ff"/></g>
<g class="batfly" style="animation-delay:19s"><path d="M1000 20 q7 -6 14 0 q-7 -3 -14 0" fill="#090c11" opacity=".45"/></g>
<ellipse class="fogdrift" cx="800" cy="878" rx="420" ry="18" fill="#8fa8c0" opacity=".06"/>
<circle class="sparkle" cx="100" cy="30" r="2" fill="#c8d8ea" style="animation-delay:0.0s"/><circle class="sparkle" cx="270" cy="59" r="2" fill="#c8d8ea" style="animation-delay:0.8s"/><circle class="sparkle" cx="440" cy="88" r="2" fill="#c8d8ea" style="animation-delay:1.6s"/><circle class="sparkle" cx="610" cy="57" r="2" fill="#c8d8ea" style="animation-delay:2.4000000000000004s"/><circle class="sparkle" cx="780" cy="86" r="2" fill="#c8d8ea" style="animation-delay:3.2s"/><circle class="sparkle" cx="950" cy="55" r="2" fill="#c8d8ea" style="animation-delay:4.0s"/><circle class="sparkle" cx="1120" cy="84" r="2" fill="#c8d8ea" style="animation-delay:4.800000000000001s"/><circle class="sparkle" cx="1290" cy="53" r="2" fill="#c8d8ea" style="animation-delay:0.6000000000000005s"/></g>
</svg>`;

const WRONG_BEATS=[
  "Somewhere above you, a door you have not opened closes with great care.",
  "The candle flames all lean, together, toward the inner hall — as if something displaced the air there.",
  "A drag. A pause. A drag. On the floor directly overhead, something crosses the room and stops.",
  "From the cellar, faint and patient: the sound of a chain being gathered up, link by link.",
  "In the corridor, the portrait's eyes are wrong now. You don't remember them being wrong."
];
const WRONG_SOUNDS=['knock','hiss','clank','clank','growl'];

const ROOMS=[
/* ============ ROOM 1 — THE GATEHOUSE COURT ============ */
{
  id:'gatehouse', name:'Room 1 — The Gatehouse Court', scene:'gatehouse',
  stageFx:'shudder',
  relays:[{el:'rl-gatehouse',mode:'pulse',period:3.6}],
  wrongSound:'thunder',
  wrongVfx:'flash',
  intro:"The castle took you in from the storm. Then the portcullis came down behind you.",
  objective:"Find your way into the keep — <b>glowing rings</b> mark what will speak to you. The Baron's household loved its riddles.",
  entryBeat:"As the portcullis seats itself into the stone, every window in the keep goes dark at once — except one, high in the tower, which comes on.",
  entrySound:'thunder',
  completeText:"The sealed doors accept the old word and swing inward on a hall of cold candles. Behind you in the court, the well rope creaks — paying out, slowly, though no one is drawing water.",
  chain:"Gatehouse shields: anagram of the four scattered letters spells WELL → well rim pairs symbols with digits; the tapestry pairs symbols with seasons; read the year from spring → 9357 → sealed doors riddle (NIGHT) answered in the old tongue = NOCTIS (the mirrored key) → gatekeeper's ledger cross-references the portrait's guests, the wolves, and the chandelier → 56.",
  objects:[
    { id:'crests', icon:'🛡️', name:'Family Crests', pos:{x:3,y:42,w:19,h:28},
      desc:"Four blank shields hang on the gatehouse wall — the family names chiselled off long ago, each now bearing a single carved letter. Left to right:\n\nL   ·   W   ·   L   ·   E\n\nBeneath them, in iron letters: “THE MASON SCATTERED WHAT THE SPRING GIVES. SET IT RIGHT.”",
      puzzle:{
        prompt:"Rearrange the four letters. Where should you look next?",
        placeholder:"FOUR LETTERS", answers:['WELL'],
        hints:[
          "Four letters — L, W, L, E — scrambled. Rearrange them into a single word.",
          "“What the spring gives” is water, drawn from one thing in this courtyard.",
          "W, E, L, L — the WELL in the middle of the court."
        ],
        solvedText:"W-E-L-L. The courtyard well — its crank is locked with a 4-digit mechanism, and its rim is carved with symbols."
      }
    },
    { id:'well', onSolve:{el:'rx-gatehouse',op:.2,fx:'surge'}, icon:'⛲', name:'The Courtyard Well', pos:{x:34,y:66,w:18,h:18},
      desc:"The well crank is bound by a 4-digit lock. Four symbols are chiselled around the rim, each with a digit — in no particular order:\n\n☾ 7      ✠ 3      ⚘ 9      ♜ 5\n\nAnd on the crossbeam, one line of the household's motto:\n\n“WIND THE YEAR FROM SPRING.”",
      puzzle:{
        prompt:"Enter the 4-digit crank code.", placeholder:"0000", answers:['9357'],
        hints:[
          "You need the symbols in a seasonal order — something else in this court pairs symbols with seasons.",
          "The tapestry: ⚘ SPRING, ✠ SUMMER, ♜ AUTUMN. The moon ☾ can only be winter. Wind the year from spring.",
          "⚘9 ✠3 ♜5 ☾7 → enter 9357."
        ],
        solvedText:"The crank turns on 9-3-5-7 and hauls up the bucket. Inside, dry as bone: an iron key stamped NOCTIS — the stamp mirrored, meant to be read by something on the other side of a door.",
        solveBeat:"Far below, the well answers the crank with a sound. Wells echo. They do not clear their throats.",
        beatSound:'growl'
      }
    },
    { id:'tapestry', icon:'🧵', name:'The Seasons Tapestry', pos:{x:26,y:32,w:12,h:26},
      desc:"A moth-eaten tapestry of the Vorstag lands through the year, symbols woven beside each panel:\n\n⚘ — the SPRING planting\n✠ — the SUMMER pilgrimage\n♜ — the AUTUMN levy\n\nThe winter panel has been cut out of the cloth entirely. Whatever symbol winter carried, someone did not want it hanging here after dark." },
    { id:'doors', icon:'🚪', name:'The Sealed Doors', pos:{x:63,y:42,w:13,h:28},
      desc:"The keep's doors carry a letter-lock and an engraved riddle:\n\n“I am always coming, yet I never arrive.\nLamps are lit against me, and still I win.\nThe Baron did his great work while I watched.\nWhat am I?”\n\nAnd below, smaller:\n\n“ANSWER IN THE OLD TONGUE, AS THE KEY REMEMBERS.”",
      puzzle:{
        prompt:"Set the letter dials.", placeholder:"SIX LETTERS", answers:['NOCTIS'],
        hints:[
          "Solve the riddle first — something that always approaches, that lamps hold back, that watched the Baron work.",
          "The riddle's answer is NIGHT. Now say it in the old tongue — the word stamped on the mirrored key.",
          "The key says it: NOCTIS. Latin for 'of the night'. Enter NOCTIS."
        ],
        solvedText:"N-O-C-T-I-S. The lock's tumblers fall like a sigh, and the doors to the keep stand open. Inside, a great chandelier hangs over the hall — eight candles, three of them long dead under fossilized wax. The living five are cold… but the wax is soft."
      }
    },
    { id:'ledger', icon:'📒', name:"Gatekeeper's Ledger", pos:{x:53,y:64,w:10,h:14}, hiddenUntil:'doors',
      desc:"Inside the doors, a lectern and the gatekeeper's ledger, open to the night of the last feast. A 2-digit wheel bars the inner hall, and the final entry reads:\n\n“INNER HALL — first figure: the guests at the Baron's table, less the wolves the hounds counted that night. Second figure: the chandelier's dead candles, doubled.”\n\nHis marginalia: “eleven sat down to dine. the hounds counted six. they would not stop counting.”",
      puzzle:{
        prompt:"Enter the 2-digit code.", placeholder:"TWO DIGITS", answers:['56'],
        hints:[
          "The guests and wolves are in the ledger's own margin. The candles are hanging above you in the hall.",
          "Eleven guests minus six wolves is 5. The hall chandelier you saw when the doors opened: eight candles, three long dead — 3 doubled is 6.",
          "5 then 6 — enter 56."
        ],
        solvedText:"5-6. The inner hall opens toward the library — and the chandelier overhead sways once, gently, as though something crossed the floor above it.",
        solveBeat:"From the top of the stair, unhurried: a footstep. Then the long, soft drag of something that has learned to walk but not yet to lift its feet.",
        beatSound:'knock'
      }
    }
  ]
},
/* ============ ROOM 2 — THE LIBRARY ============ */
{
  id:'library', name:'Room 2 — The Library', scene:'library',
  relays:[{el:'rl-library',mode:'pulse',period:4.0}],
  wrongSound:'creak',
  wrongVfx:'shadow',
  intro:"Ten thousand books, one cold hearth relit by nobody, and the Baron's organ waiting mid-hymn.",
  objective:"The Baron hid his laboratory behind music and mathematics. <b>Play the room.</b>",
  entryBeat:"The fire in the hearth is burning. It was not burning when the household died, and no one has been here since. Something keeps this room warm. Something likes it here.",
  entrySound:'knock',
  completeText:"The orrery clicks into alignment and a bookcase rolls aside on iron rails, breathing out forty years of cold air and the smell of a hospital. The laboratory stair leads down.",
  chain:"Hymn board (CXIX = 119) + psalter margin (third verse) → set the organ stop to 119.3 → the hidden panel's vellum strip is pigpen cipher = STAY INSIDE → the Baron's folio Atbash mirror-script (GSV = THE) = SPARK → orrery planet-weights (Roman numerals, heaviest sunward) = 763.",
  objects:[
    { id:'hymnboard', icon:'🎼', name:'Hymn Board', pos:{x:66,y:26,w:9,h:20},
      desc:"The chapel hymn board, its brass letters furred with dust:\n\nHYMN: CXIX\nVERSE: (the tile is missing)\n\nTucked behind the board, a psalter falls open to a dog-eared page. In the margin, the Baron's hand: “Father sang only the third verse when the storm came close. Only ever the third.”" },
    { id:'organ', icon:'🎹', name:'The Pipe Organ', pos:{x:77,y:26,w:20,h:40},
      desc:"The great organ dominates the east wall. Its stop dial is a strange one — numbered like an instrument of science, not music — and a small plate reads: HYMN · VERSE.\n\nThe Baron's household hid its secrets behind music. Set the stop, and the room will answer.",
      puzzle:{
        type:'dial',
        prompt:"Set the stop to the hymn and verse, then work the voicing knobs until the pipes ring true.",
        answers:['1193'],
        dial:{min:1000,max:1300,div:10,target:1193,pad:5,meter:'RESONANCE',lock:'PULL THE STOP',miss:'the pipes moan and fall silent.',
          knobs:[{label:'SWELL',target:66},{label:'TREMULANT',target:23},{label:'MIXTURE',target:88}]},
        hints:[
          "The stop wants a hymn and a verse — one number, then a point, then another.",
          "The hymn board says CXIX — Roman numerals for 119. The psalter margin says only the third verse.",
          "Set the stop to exactly 119.3, then work the three voicing knobs one at a time until the panel reads LOCKED IN."
        ],
        solvedText:"At 119.3 a chord swells that has waited forty years — and behind the pipes, a hidden panel cracks open. Inside hangs a narrow strip of vellum, stitched edge to edge with small angular marks. Lodge-work. The Baron's people wrote the things they feared in the masons' cipher."
      }
    },
    { id:'chimes', onSolve:{el:'rx-library',op:.2,fx:'surge'}, icon:'📜', name:'The Vellum Strip', pos:{x:69,y:50,w:8,h:16}, hiddenUntil:'organ',
      desc:"Ten symbols are stitched into the vellum in black thread — two words. Angular boxes, corners and wedges, some carrying a single dot:\n\n"+PIG("STAY INSIDE")+"\n\nThe Baron's household wrote its warnings in the masons' cipher, sure that no servant could read them. Divide the symbols among the crew and work them out.",
      puzzle:{
        prompt:"Decode the stitched symbols (two words).",
        placeholder:"TWO WORDS", answers:['STAYINSIDE'],
        hints:[
          "Boxes, corners and dots — that's the pigpen cipher, the old Freemasons' code. Look up a pigpen key: each letter lives in a grid or an X, and the lines around its cell become its symbol.",
          "Use the standard key: A–I fill a tic-tac-toe grid, J–R repeat it with a dot, S–V fill an X, W–Z repeat the X with a dot. The first symbol — a wedge — is S.",
          "The two words are STAY and INSIDE. Enter STAYINSIDE."
        ],
        solvedText:"STAY INSIDE. The Baron's lodge stitched one warning into the organ itself, and this is it. You think of the wolves. You think of what the hounds were really counting. You stay inside.",
        solveBeat:"Outside the tall windows, against the lightning, something crosses the courtyard below in four strides. The courtyard is sixty feet wide.",
        beatSound:'thunder'
      }
    },
    { id:'folio', icon:'📜', name:"The Baron's Folio", pos:{x:22,y:56,w:14,h:16}, hiddenUntil:'chimes',
      desc:"The Baron's working folio lies chained to its desk, the last page in his alchemist's mirror-script. His own key to the script is pinned above the page:\n\n“THE MIRROR ALPHABET — A becomes Z, B becomes Y, C becomes X… and back again.”\n\nThe final line reads:\n\nGSV  WLLI  LKVMH  GL:  HKZIP",
      puzzle:{
        prompt:"Enter the deciphered word.", placeholder:"FIVE LETTERS", answers:['SPARK'],
        hints:[
          "It's an Atbash mirror: A↔Z, B↔Y, C↔X. Each letter swaps with its opposite end of the alphabet. GSV decodes to THE, confirming it.",
          "Mirror the last word: H↔S, K↔P, Z↔A, I↔R, P↔K.",
          "HKZIP mirrors to SPARK. THE DOOR OPENS TO: SPARK."
        ],
        solvedText:"S-P-A-R-K. Of course. The whole castle is a machine for catching one, and the folio's last legible line: “it only ever feared the same thing that made it.”"
      }
    },
    { id:'orrery', icon:'🪐', name:'The Orrery Lock', pos:{x:38,y:70,w:12,h:20}, hiddenUntil:'folio',
      desc:"A brass orrery guards the bookcase mechanism. Three planet-weights hang loose beside it, each stamped in the Baron's beloved Roman numerals:\n\n⬤ VII      ⬤ III      ⬤ VI\n\nThe rule plate on the pedestal reads:\n\n“HANG THE HEAVIEST NEAREST THE SUN,\nTHE LIGHTEST FARTHEST OUT.\nTHEN READ THE ARMS SUNWARD-OUT,\nAND GIVE THE ORRERY ITS NUMBER.”",
      puzzle:{
        prompt:"Convert the numerals, hang the weights heaviest-to-lightest, and type the three digits from the sun outward.", placeholder:"000", answers:['763'],
        hints:[
          "First convert the Roman numerals: VII, VI and III.",
          "That's 7, 6 and 3. Heaviest hangs nearest the sun, lightest farthest — so read them largest to smallest.",
          "7, 6, 3 — enter 763."
        ],
        solvedText:"7-6-3. The planets align over a house that never once looked up at the real ones, and the bookcase rolls aside. Cold air. Iron stairs. Down.",
        solveBeat:"As the passage opens, every candle in the library leans toward it — and somewhere below, something politely, deliberately, blows one out.",
        beatSound:'hiss'
      }
    }
  ]
},
/* ============ ROOM 3 — THE LABORATORY ============ */
{
  id:'laboratory', name:'Room 3 — The Laboratory', scene:'laboratory',
  relays:[{el:'rl-laboratory',mode:'pulse',period:2.8}],
  wrongSound:'clank',
  wrongVfx:'sparks',
  intro:"The great work is gone from the slab. The straps were opened from the inside.",
  objective:"Wake the Baron's machinery. Whatever he made here, <b>you need what powered it.</b>",
  entryBeat:"On the slab, the leather straps lie neatly unbuckled — not torn. It took its time. It folded them.",
  entrySound:'clank',
  completeText:"The dumbwaiter's word hangs in the air as you climb the tower stair. Below you, in the dark of the cellar, something begins — slowly, tunelessly, in a voice like wet gravel — to hum the Baron's hymn.",
  chain:"The slab's chalked riddle = LIGHTNING → Leyden jar rack: keep only ODD charges; survivors spell RISEN → galvanic switchboard fuse riddle (even digits, product 48) = 624 → the dumbwaiter sends up a card in the same pigpen = ALIVE.",
  objects:[
    { id:'slab', icon:'⛓️', name:'The Empty Slab', pos:{x:33,y:47,w:34,h:22},
      desc:"The slab itself — scorched, strapped, and empty. A riddle is chalked along its edge in the Baron's hand — one he wrote for his own machinery:\n\n“I am the Baron's oldest servant.\nI climb the tower without legs.\nI speak exactly once,\nand the sky breaks when I do.\nWhat am I?”",
      puzzle:{
        prompt:"Name the Baron's oldest servant.", placeholder:"ANSWER", answers:['LIGHTNING','THELIGHTNING','ABOLT','BOLT','LIGHTNINGBOLT'],
        hints:[
          "Not a person. Something the tower was built to catch.",
          "It climbs the conductor rod without legs, speaks once — a crack — and splits the sky.",
          "LIGHTNING. Everything in this room drinks it."
        ],
        solvedText:"LIGHTNING. The chalk answer unlocks nothing mechanical — but it tells you how to read the room: everything here is a vessel for the storm. Starting with the rack of jars along the wall."
      }
    },
    { id:'jars', onSolve:{el:'rx-laboratory',op:.2,fx:'surge'}, icon:'⚡', name:'Leyden Jar Rack', pos:{x:6,y:24,w:38,h:16}, hiddenUntil:'slab',
      desc:"Eight Leyden jars on the rack, each chalked with a letter and a charge reading. Left to right:\n\nR — 5\nM — 2\nI — 3\nU — 4\nS — 7\nE — 1\nD — 6\nN — 9\n\nThe Baron's rule, burned into the shelf: “AN EVEN CHARGE HAS ALREADY EARTHED ITSELF AND IS DEAD. TRUST ONLY THE ODD.”",
      puzzle:{
        prompt:"Which jars can be trusted? Enter their letters in rack order.", placeholder:"LETTERS", answers:['RISEN'],
        hints:[
          "Odd numbers end in 1, 3, 5, 7, 9. Check each jar's charge; split the rack among the crew.",
          "Drop the even charges — M(2), U(4), D(6). Read the odd ones left to right.",
          "R(5) I(3) S(7) E(1) N(9) are odd — the rack spells RISEN."
        ],
        solvedText:"R-I-S-E-N. Nobody says it twice. The trusted jars still hold their charge — enough to wake the switchboard, if you can find its combination.",
        solveBeat:"The chains overhead swing, all four at once, in a room with no wind. Then they still themselves — carefully — as if embarrassed.",
        beatSound:'clank'
      }
    },
    { id:'switchboard', icon:'🎛️', name:'Galvanic Switchboard', pos:{x:76,y:28,w:18,h:38}, hiddenUntil:'jars',
      desc:"The master switchboard is locked behind three fuse dials, 0–9 each. The Baron's tag swings from the lever:\n\n“THREE EVEN FIGURES WAKE THE BOARD.\nMULTIPLIED TOGETHER THEY MAKE FORTY-EIGHT.\nSET THEM: LARGEST, THEN SMALLEST, THEN MIDDLE.”",
      puzzle:{
        prompt:"Find the three even digits whose product is 48, then dial them largest, smallest, middle.", placeholder:"000", answers:['624'],
        hints:[
          "You need three even digits (2, 4, 6 or 8) that multiply to exactly 48. Try factor pairs as a team.",
          "48 = 2 × 4 × 6 — and no other trio of even digits works.",
          "Largest, smallest, middle: 6, 2, 4 — enter 624."
        ],
        solvedText:"6-2-4. The board wakes with a rising whine, needles climbing — and at the back of the laboratory, the dumbwaiter begins to climb. Slowly. Unbidden. From the cellar. Where the rope is cut."
      }
    },
    { id:'dumbwaiter', icon:'🛎️', name:'The Dumbwaiter Card', pos:{x:54,y:70,w:12,h:24}, hiddenUntil:'switchboard',
      desc:"The dumbwaiter arrives from the cellar on its cut rope, breathing cold air — carrying one thing. A mourning card, and on it, five symbols in the same stitched cipher as the organ's vellum:\n\n"+PIG("ALIVE")+"\n\nThe tower stair's letter-lock waits for five letters.",
      puzzle:{
        prompt:"Enter the 5-letter word the bell is ringing.", placeholder:"5 LETTERS", answers:['ALIVE'],
        hints:[
          "The same masons' pigpen cipher as the vellum — grid letters, X letters, a dot for the second round.",
          "Five letters. The first is the grid's top-left corner: A. The last is the grid's boxed-in centre: E. It's a status report.",
          "The card reads ALIVE. It wants you to know."
        ],
        solvedText:"A-L-I-V-E. Nobody asks who sent the card up. The tower stair unlocks. Up — away from the cellar. Go.",
        solveBeat:"From the bottom of the dumbwaiter shaft, very quietly, something tugs the bell-rope twice more. You already answered. It just wanted to hear you again.",
        beatSound:'bell'
      }
    }
  ]
},
/* ============ ROOM 4 — THE TOWER ============ */
{
  id:'tower', name:'Room 4 — The Tower', scene:'tower',
  stageFx:'shudder',
  relays:[{el:'rl-tower',mode:'pulse',period:2.6}],
  wrongSound:'thunder',
  wrongVfx:'flash',
  intro:"The storm the Baron waited his whole life for is here. Catch it, and the gate lifts.",
  objective:"Rig the conductor, charge the coil, and <b>ride the lightning</b> — the portcullis runs on the storm.",
  entryBeat:"The tower door was barred from this side — and the bar now leans against the battlement, set aside as gently as a sleeping child. It wanted you to reach the top. It's the gate it never learned to open.",
  entrySound:'thunder',
  completeText:"",
  chain:"Five ignition tags with positional constraints → unique order E-A-D-C-B → chapel fuse box: “father sang it twice when the storm came close” = hymn 119.3 doubled = 2386 → storm-glass table: only the 11:30 front carries 9kV+ before the bell tolls one; minus 50 min = 10:40 → portcullis glyphs: the well code reversed = 7539 → signal the village with the tower lamp (SOS) → THROW THE SWITCH.",
  objects:[
    { id:'rig', icon:'🔩', name:'The Ignition Rig', pos:{x:45,y:12,w:12,h:56},
      desc:"The Baron's launch ritual, five steps on five scattered vellum tags:\n\nTAG A — “Crank the capacitor second. The chains must already hang.”\n\nTAG B — “Throw the master switch only once the coil is coupled.”\n\nTAG C — “Couple the coil — never right before or right after cranking the capacitor.”\n\nTAG D — “Raise the rod. Exactly one task passes between grounding the chains and raising the rod.”\n\nTAG E — “Ground the chains before the capacitor is cranked.”",
      puzzle:{
        prompt:"Enter the five tag letters in ritual order.", placeholder:"FIVE LETTERS", answers:['EADCB'],
        hints:[
          "One tag names an exact position. Fix the capacitor's slot, then see what must come before it.",
          "Capacitor is 2nd; the chains come before it — 1st. 'Exactly one task between chains and rod' puts the rod 3rd. Where can the coil legally sit?",
          "The coil can't touch slot 1 or 3 (adjacent to the capacitor in slot 2)… slot 4. The switch follows it: 5th. E-A-D-C-B."
        ],
        solvedText:"Chains, capacitor, rod, coil, switch. The rig assents, piece by piece, the whole tower humming like a struck bell in slow motion.",
        solveBeat:"Lightning walks the ridge across the valley — one, two, three strikes in a line, closing on the castle like footsteps.",
        beatSound:'thunder'
      }
    },
    { id:'fusebox', onSolve:{el:'rx-tower',op:.2,fx:'surge'}, icon:'🕯️', name:'Chapel Fuse Box', pos:{x:13,y:50,w:9,h:20},
      desc:"The chapel mains feed the tower through a 4-digit fuse box. On its door, in the Baron's hand:\n\n“FATHER SANG IT TWICE\nWHEN THE STORM CAME CLOSE.”",
      puzzle:{
        prompt:"Enter the 4-digit code.", placeholder:"0000", answers:['2386'],
        hints:[
          "You've already 'sung it' once tonight — on the organ, downstairs.",
          "The stop was 119.3. Sing it twice: double it.",
          "119.3 × 2 = 238.6 → enter 2386."
        ],
        solvedText:"238.6 — the hymn, sung twice, as the storm demands. The chapel mains close and the tower's veins fill with potential."
      }
    },
    { id:'barometer', icon:'⛈️', name:'The Storm-Glass Table', pos:{x:37,y:72,w:12,h:18}, hiddenUntil:'fusebox',
      desc:"The Baron's storm-glass and his strike table for tonight, in a steady hand that gets less steady:\n\n“FRONT ONE — strikes at 10:15 · six thousand volts\nFRONT TWO — strikes at 11:30 · twelve thousand volts\nFRONT THREE — strikes at 1:20 · nine thousand volts\n\nTHE COIL NEEDS NINE THOUSAND OR BETTER.\nAFTER THE CHAPEL BELL TOLLS ONE, THE DOORS BELOW OPEN ON THEIR OWN. WE MUST BE GONE.\nBEGIN THE CHARGE 50 MINUTES BEFORE THE STRIKE.”",
      puzzle:{
        prompt:"Set the charge time (hour then minutes, e.g. 730).", placeholder:"H:MM", answers:['1040'],
        hints:[
          "Two filters: the coil's voltage floor, and the bell that tolls one.",
          "10:15 is only six thousand volts. 1:20 is after the bell tolls one — and you must be gone. That leaves 11:30 — count back 50 minutes.",
          "11:30 minus 0:50 is 10:40. Enter 1040."
        ],
        solvedText:"10:40. The charge timer arms itself with a sound like a held breath. The storm-glass crystals climb the tube — the front is coming to you."
      }
    },
    { id:'portcullis', icon:'⚙️', name:'Portcullis Winch', pos:{x:85,y:70,w:12,h:22}, hiddenUntil:'barometer',
      desc:"The portcullis winch answers to four glyph rings — the same four symbols from the courtyard well, in the same seasonal order:\n\n☾   ✠   ⚘   ♜\n\nAnd chiselled beneath, the Vorstag motto's other half:\n\n“THE YEAR WINDS FORWARD.\nTHE GATE WINDS BACK.”",
      puzzle:{
        prompt:"Enter the 4-digit release.", placeholder:"0000", answers:['7539'],
        hints:[
          "You wound the year forward at the well. The gate winds back.",
          "The well code was 9357. Reverse it.",
          "9357 backward is 7539. Enter 7539."
        ],
        solvedText:"7-5-3-9 — the year run backward, the way this whole house runs. The winch pawl lifts. All that remains is to bring the lightning and signal the village to open the valley gate.",
        solveBeat:"On the battlement behind you — patient, unhurried, close — something sets down its weight. It has climbed the outside of the tower. It always could.",
        beatSound:'growl'
      }
    },
    { id:'rod', icon:'💡', name:'The Tower Lamp', pos:{x:44,y:70,w:14,h:16}, hiddenUntil:'portcullis',
      desc:"The Baron's signal lamp, aimed down at the sleeping village and the valley gate. Short flashes and long burns — and one pattern every watchman in the valley drills for: the distress call older than the castle itself.\n\nGet it right, and the valley opens. Get it wrong, and the village shutters its windows against you.",
      puzzle:{
        type:'signal',
        labels:{short:'🕯️ SHORT FLASH ·',long:'🕯️ LONG BURN −',reset:'DOUSE THE LAMP',send:'⚡ THROW THE SWITCH'},
        missText:'The lamp stutters nonsense. Down in the valley, a light goes out.',
        prompt:"Flash the distress pattern to the village, then THROW THE SWITCH. (Watch the sky above the rod.)",
        answers:['...---...'],
        hints:[
          "Three letters every watchman knows.",
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
  id:'vorstag',
  title:'Castle Vorstag',
  sub:'the Baron’s castle · the slab is empty · the storm is coming',
  tagline:'Sheltering travelers, a locked portcullis, and a laboratory missing its great work.',
  icon:'⚡',
  card:`<svg viewBox="0 0 300 130" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="cgV" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0c0a1a"/><stop offset="1" stop-color="#231a33"/></linearGradient></defs>
    <rect width="300" height="130" fill="url(#cgV)"/>
    <path class="flick" d="M196 12 l-14 34 12 -3 -18 44" stroke="#cfd6ff" stroke-width="3" fill="none" opacity=".6"/>
    <g fill="#120d1e">
      <rect x="60" y="52" width="44" height="78"/><path d="M60 52 h44 v-12 -0 l-8 0 0 7 -9 0 0 -7 -10 0 0 7 -9 0 0 -7 -8 0z"/>
      <rect x="130" y="30" width="56" height="100"/><path d="M130 30 h56 l0 -14 -10 0 0 8 -12 0 0 -8 -12 0 0 8 -12 0 0 -8 -10 0z"/>
      <rect x="212" y="62" width="40" height="68"/>
    </g>
    <rect class="flick" x="150" y="52" width="12" height="18" fill="#5a4a1a"/>
    <g class="eyes"><circle cx="30" cy="112" r="2.5" fill="#e0d0a0"/><circle cx="42" cy="112" r="2.5" fill="#e0d0a0"/></g>
  </svg>`,
  titleFx:'rain', titleLightning:true,
  titleArt:`<svg viewBox="0 0 560 200">
    <path class="flick" d="M350 10 l-20 52 18 -5 -28 66" stroke="#cfd6ff" stroke-width="4" fill="none" opacity=".65"/>
    <g fill="#120d1e">
      <rect x="130" y="90" width="70" height="110"/><path d="M130 90 h70 l0 -18 -12 0 0 10 -14 0 0 -10 -14 0 0 10 -14 0 0 -10 -12 0z"/>
      <rect x="240" y="50" width="90" height="150"/><path d="M240 50 h90 l0 -20 -15 0 0 11 -19 0 0 -11 -19 0 0 11 -19 0 0 -11 -14 0z"/>
      <rect x="370" y="100" width="60" height="100"/><path d="M370 100 h60 l0 -16 -10 0 0 9 -13 0 0 -9 -13 0 0 9 -13 0 0 -9 -11 0z"/>
    </g>
    <rect class="flick" x="272" y="86" width="18" height="26" fill="#5a4a1a"/>
    <path d="M0 200 h560" stroke="#0d0a16" stroke-width="14"/>
  </svg>`,
  story:[
    "The mountain road washed out beneath your carriage, and Castle Vorstag — dead these forty years, the villagers swear — stood with its gate open and its fires lit.",
    "The gate is closed now. The late Baron's laboratory sits at the top of the keep, and the famous slab, the one the trials were about, is empty. The straps were unbuckled from the inside, and folded.",
    "The portcullis runs on the storm: charge the tower, catch the lightning, signal the village. And if you hear something dragging its feet in the halls — it isn't dragging them toward the exit. It doesn't need one."
  ],
  begin:'⚡ BEGIN — 45:00', finalButton:'RIDE THE LIGHTNING ⚡',
  emojis:['⚡','🧟','🦇','🕯️','🏰','⚗️','🔩','🌩️','🐺','📖','🧠','💀'],
  ratings:['🏆 Master Galvanist','⚡ Able Alchemist','🕯️ Candle Apprentice','🛟 Barely Made the Gate','🌩️ Kept By the Castle'],
  shareTitle:'ESCAPED CASTLE VORSTAG!',
  victoryTitle:'⚡ THE GATE IS OPEN',
  victoryProse:`The strike takes the rod with a sound like the sky tearing loose, the coil drinks it whole, and the portcullis climbs its chains for the first time in forty years. You run the causeway in the rain, lungs burning, the village lights swinging up ahead.<br><br>
    At the valley gate you look back once. On the tower's crown, framed against the storm, something tall raises one arm — not reaching. Waving. The way you'd wave to guests you hoped might visit again.<br><br>
    The Baron built it a body. Nobody ever taught it goodbye.`,
  gameOverProse:`The chapel bell tolls one. Far below you, unhurried, the doors of the keep begin to open on their own.<br><br>The storm moves on across the valley, taking its lightning with it.`,
  flare:{x:779,y:600,hue:[190,170,255]},
  ambience:[
    {wind:.12, drone:.03},
    {drone:.04, hum:.028, wind:.02},
    {hum:.045, drone:.05, wind:.015},
    {wind:.2, drone:.07}
  ],
  fx:['mist','pollen','drips','embers'],
  events:[
    [{s:'thunder',p:.4,v:'flash'},{s:'wolf',p:.25,v:'shadow'}],
    [{s:'creak',p:.4,v:'shadow'},{s:'bell',p:.12}],
    [{s:'drip',p:.4},{s:'clank',p:.3,v:'shake'}],
    [{s:'thunder',p:.55,v:'flash'},{s:'clank',p:.2,v:'shake'}]
  ],
  wrongBeats:WRONG_BEATS, wrongSounds:WRONG_SOUNDS,
  scenes:SCENES, rooms:ROOMS
});
})();
