/* ============================================================
   SCENARIO: CASTLE VORSTAG (Frankenstein's castle)
   Your carriage broke down. The castle took you in.
   The slab in the laboratory is empty. Charge the tower,
   raise the portcullis, and go — it knows the halls better.

   Built on the reset grammar (see PUZZLES.md): locks that look like locks,
   and whatever opens them somewhere else in the room. Each object carries
   its own art into the room as `sprite`; the backdrops below are only the
   place.
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
<g class="plx" data-depth="4" fill="#1b1530" stroke="#2c2444" stroke-width="2">
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
<!-- the curtain wall, with a walk along the top of it -->
<rect x="360" y="344" width="1240" height="316" fill="#1f1929"/>
<rect x="360" y="318" width="38" height="26" fill="#231d2f"/><rect x="422" y="318" width="38" height="26" fill="#231d2f"/><rect x="484" y="318" width="38" height="26" fill="#231d2f"/><rect x="546" y="318" width="38" height="26" fill="#231d2f"/><rect x="608" y="318" width="38" height="26" fill="#231d2f"/><rect x="670" y="318" width="38" height="26" fill="#231d2f"/><rect x="732" y="318" width="38" height="26" fill="#231d2f"/><rect x="794" y="318" width="38" height="26" fill="#231d2f"/><rect x="856" y="318" width="38" height="26" fill="#231d2f"/><rect x="918" y="318" width="38" height="26" fill="#231d2f"/><rect x="980" y="318" width="38" height="26" fill="#231d2f"/><rect x="1042" y="318" width="38" height="26" fill="#231d2f"/><rect x="1104" y="318" width="38" height="26" fill="#231d2f"/><rect x="1166" y="318" width="38" height="26" fill="#231d2f"/><rect x="1228" y="318" width="38" height="26" fill="#231d2f"/><rect x="1290" y="318" width="38" height="26" fill="#231d2f"/><rect x="1352" y="318" width="38" height="26" fill="#231d2f"/><rect x="1414" y="318" width="38" height="26" fill="#231d2f"/><rect x="1476" y="318" width="38" height="26" fill="#231d2f"/><rect x="1538" y="318" width="38" height="26" fill="#231d2f"/>
<path d="M360 344H1600" stroke="#3a3350" stroke-width="3" opacity=".8"/>
<path d="M360 400H1600" stroke="#0d0a16" stroke-width="2" opacity=".5"/><path d="M360 460H1600" stroke="#0d0a16" stroke-width="2" opacity=".5"/><path d="M360 520H1600" stroke="#0d0a16" stroke-width="2" opacity=".5"/><path d="M360 580H1600" stroke="#0d0a16" stroke-width="2" opacity=".5"/><path d="M400 344v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M496 344v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M592 344v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M688 344v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M784 344v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M880 344v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M976 344v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1072 344v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1168 344v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1264 344v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1360 344v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1456 344v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1552 344v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M448 404v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M544 404v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M640 404v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M736 404v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M832 404v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M928 404v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1024 404v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1120 404v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1216 404v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1312 404v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1408 404v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1504 404v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1600 404v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M400 464v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M496 464v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M592 464v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M688 464v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M784 464v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M880 464v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M976 464v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1072 464v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1168 464v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1264 464v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1360 464v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1456 464v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1552 464v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M448 524v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M544 524v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M640 524v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M736 524v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M832 524v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M928 524v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1024 524v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1120 524v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1216 524v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1312 524v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1408 524v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1504 524v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1600 524v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M400 584v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M496 584v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M592 584v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M688 584v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M784 584v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M880 584v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M976 584v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1072 584v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1168 584v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1264 584v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1360 584v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1456 584v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/><path d="M1552 584v56" stroke="#0d0a16" stroke-width="2" opacity=".35"/>
<rect x="360" y="352" width="1240" height="10" fill="#0d0a16" opacity=".45"/>
<path d="M1392 660V500Q1392 428 1485 428T1578 500V660Z" fill="#2f2840" stroke="#0d0a16" stroke-width="5"/>
<path d="M1406 660V504Q1406 444 1485 444T1564 504V660Z" fill="#07060c"/>
<path d="M1420 452V660" stroke="#3a3350" stroke-width="6"/><path d="M1446 452V660" stroke="#3a3350" stroke-width="6"/><path d="M1472 452V660" stroke="#3a3350" stroke-width="6"/><path d="M1498 452V660" stroke="#3a3350" stroke-width="6"/><path d="M1524 452V660" stroke="#3a3350" stroke-width="6"/><path d="M1550 452V660" stroke="#3a3350" stroke-width="6"/><path d="M1404 490H1566" stroke="#3a3350" stroke-width="6"/><path d="M1404 534H1566" stroke="#3a3350" stroke-width="6"/><path d="M1404 578H1566" stroke="#3a3350" stroke-width="6"/><path d="M1404 622H1566" stroke="#3a3350" stroke-width="6"/>
<!-- torch on wall -->
<g>
  <rect x="320" y="330" width="10" height="52" fill="#241a10"/>
  <circle cx="325" cy="316" r="70" fill="url(#vTorch)"/>
  <path class="flame" d="M325 322 q-14 -24 0 -44 q14 22 0 44z" fill="#ffb45e"/>
</g>
<!-- courtyard flagstones -->
<path d="M0 660 h1600 v240 h-1600z" fill="#1c1626"/>
${[0,1,2,3,4,5,6].map(i=>`<line x1="${i*260-80}" y1="660" x2="${i*300-200}" y2="900" stroke="#0d0a16" stroke-width="4"/>`).join('')}
<line x1="0" y1="660" x2="1600" y2="660" stroke="#0a0812" stroke-width="6"/>
<ellipse cx="300" cy="790" rx="90" ry="12" fill="#2a2440" opacity=".55"/><ellipse cx="273" cy="788" rx="31" ry="4" fill="#8f86b8" opacity=".12"/><ellipse cx="980" cy="760" rx="120" ry="13" fill="#2a2440" opacity=".55"/><ellipse cx="944" cy="758" rx="42" ry="4" fill="#8f86b8" opacity=".12"/><ellipse cx="1240" cy="840" rx="80" ry="10" fill="#2a2440" opacity=".55"/><ellipse cx="1216" cy="838" rx="28" ry="3" fill="#8f86b8" opacity=".12"/><ellipse cx="520" cy="850" rx="70" ry="9" fill="#2a2440" opacity=".55"/><ellipse cx="499" cy="848" rx="24" ry="3" fill="#8f86b8" opacity=".12"/>
<!-- a stone bench under the torch -->
<rect x="384" y="672" width="170" height="16" fill="#2f2840" stroke="#0d0a16" stroke-width="3"/><rect x="396" y="688" width="18" height="34" fill="#231d2f"/><rect x="524" y="688" width="18" height="34" fill="#231d2f"/>
<!--SPRITES-->
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
<!-- the cornice the ceiling is painted above -->
<rect x="0" y="198" width="1600" height="12" fill="#2a1d2e"/><rect x="0" y="210" width="1600" height="4" fill="#0d0806" opacity=".6"/>
<path d="M1220 640V250Q1220 214 1256 214H1530Q1566 214 1566 250V640Z" fill="#140c16" stroke="#2a1d2e" stroke-width="6"/>
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
<!--SPRITES-->
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
  <text x="1460" y="816" text-anchor="middle" font-family="Special Elite" font-size="10" fill="#8f7fa8">FOLLOW THE CHAIN</text>
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

/* ============================================================
   THE DRAWINGS, AND THE ROOMS THEY STAND IN

   Every prop is drawn once and used twice: large in the close-up, and small
   standing in the room, so what you can see from across the court is exactly
   what you read when you lean in.
   ============================================================ */
const C = ART.COL, I = ART.INK, W = ART.words, GL = ART.glyph;

/* ============================================================
   ROOM 1 — THE GATEHOUSE COURT
   Six gargoyles on the wall-walk, and a stone face in the well cover whose
   eyes roll four ways. A wall of shields with one taken down from every row,
   and a strongbox that wants four of them. And the keep door: five pins, a
   raven, and a ring of keys that only fits if you think about which end of a
   key goes in first.
   ============================================================ */
const V = { stone: '#2a2436', stoneLight: '#4a4458', stoneEdge: '#6a6380', dark: '#0d0a16', deep: '#171126', wall: '#1f1929',
            wood: '#4a3823', woodDark: '#241a10', woodLip: '#6b5334', brass: '#c9a04a', brassDark: '#8a7430', gold: '#e6c66a',
            parch: '#d9cba6', ink: '#3a2d1c', iron: '#3a3244', ironLight: '#5c5470', glint: '#e0d0a0', glow: '#ffb45e', bolt: '#cfd6ff' };

/* ---- the parapet: six gargoyles, each with something different to stare at ---- */
const GAZE = 'ESWWNE';
function gargoyle(dir) {
  // the body never changes; only where it is looking
  const body = `<rect x="12" y="92" width="76" height="18" fill="${V.stone}" stroke="${V.dark}" stroke-width="3"/>`
    + `<path d="M26 62L4 38L20 78ZM74 62L96 38L80 78Z" fill="${V.stone}" stroke="${V.dark}" stroke-width="3" stroke-linejoin="round"/>`
    + `<path d="M22 94Q14 60 34 52H66Q86 60 78 94Z" fill="${V.stoneLight}" stroke="${V.dark}" stroke-width="3" stroke-linejoin="round"/>`
    + `<path d="M38 94V76M62 94V76" stroke="${V.dark}" stroke-width="3"/><path d="M30 94h14M56 94h14" stroke="${V.dark}" stroke-width="5" stroke-linecap="round"/>`;
  const head = `<path d="M-19 -13Q-21 -25 -8 -23L-13 -37L3 -23Q14 -23 20 -13L40 -6Q45 0 40 7L20 12Q10 22 -8 20Q-22 16 -19 -13Z" fill="${V.stoneEdge}" stroke="${V.dark}" stroke-width="3" stroke-linejoin="round"/>`
    + `<circle cx="9" cy="-7" r="5.5" fill="${V.dark}"/><circle cx="10.5" cy="-8" r="2.2" fill="${V.glint}"/><path d="M24 7L40 4" stroke="${V.dark}" stroke-width="2.5" stroke-linecap="round"/>`;
  const turn = { E: '', W: 'scale(-1 1)', N: 'rotate(-82)', S: 'rotate(82)' }[dir];
  return body + `<g transform="translate(50 38) ${turn}">${head}</g>`;
}
const gargRow = GAZE.split('').map((d, i) => `<g transform="translate(${i * 112} 0)">${gargoyle(d)}</g>`).join('');   // 660 x 110
const gargArt = { w: 720, h: 230, body: (() => {
  let b = `<rect width="720" height="230" fill="#141026"/><ellipse cx="200" cy="40" rx="260" ry="40" fill="#0a0818" opacity=".9"/><ellipse cx="560" cy="24" rx="240" ry="30" fill="#0a0818" opacity=".8"/>`;
  for (let i = 0; i < 26; i++) b += `<path d="M${20 + (i * 137) % 690} ${(i * 53) % 150}l-5 26" stroke="#b8d4ea" stroke-width="1.6" opacity=".35"/>`;
  b += `<rect x="0" y="174" width="720" height="56" fill="${V.wall}"/><path d="M0 174H720" stroke="${V.stoneEdge}" stroke-width="3" opacity=".6"/>`;
  for (let i = 0; i < 9; i++) b += `<path d="M${40 + i * 84} 176v54" stroke="${V.dark}" stroke-width="2" opacity=".4"/>`;
  return b + `<g transform="translate(30 66)">${gargRow}</g>`;
})() };

/* ---- the shield wall: four rows, each a pattern with one shield gone ---- */
const TINCT = { crown: ['red', V.gold], tower: ['blue', V.gold], raven: ['white', '#24282c'], key: ['green', V.gold], cross: ['black', '#efe9da'], star: ['purple', V.gold] };
const ROWS = [
  ['crown', 'tower', 'crown', 'tower', null, 'tower'],
  ['raven', 'raven', 'key', 'raven', 'raven', null],
  ['star', 'cross', 'tower', null, 'cross', 'star'],
  ['raven', 'star', 'cross', null, 'star', 'cross'],
];
const MISSING = ['crown', 'key', 'tower', 'raven'];             // what would finish each row, top row first
const shieldPath = (x, y, w, h) => `M${x} ${y}h${w}v${(h * .5).toFixed(1)}q0 ${(h * .3).toFixed(1)} ${-w / 2} ${(h * .5).toFixed(1)}q${-w / 2} ${(-h * .2).toFixed(1)} ${-w / 2} ${(-h * .5).toFixed(1)}Z`;
const shield = (x, y, w, h, charge) => {
  const [field, ink] = TINCT[charge];
  return `<path d="${shieldPath(x, y, w, h)}" fill="${C[field]}" stroke="${V.dark}" stroke-width="${(w * .06).toFixed(1)}" stroke-linejoin="round"/>`
    + `<path d="${shieldPath(x + w * .09, y + h * .07, w * .82, h * .84)}" fill="none" stroke="#000" stroke-opacity=".22" stroke-width="${(w * .03).toFixed(1)}"/>`
    + GL(charge, x + w * .21, y + h * .13, w * .58, ink);
};
const shieldsArt = { w: 640, h: 700, body: (() => {
  let b = `<rect width="640" height="700" fill="${V.stone}"/>`;
  for (let j = 0; j < 9; j++) { b += `<path d="M0 ${j * 80}H640" stroke="${V.dark}" stroke-width="2" opacity=".5"/>`; for (let i = 0; i < 7; i++) b += `<path d="M${i * 104 + (j % 2) * 52} ${j * 80}v80" stroke="${V.dark}" stroke-width="2" opacity=".32"/>`; }
  ROWS.forEach((row, r) => {
    const y = 34 + r * 166;
    b += `<rect x="16" y="${y + 30}" width="54" height="44" rx="4" fill="${V.brassDark}" stroke="${V.dark}" stroke-width="3"/>` + W(43, y + 63, ['I', 'II', 'III', 'IV'][r], { size: 28, fill: '#1c1408', weight: 700 });
    b += `<path d="M84 ${y - 8}H624" stroke="${V.woodDark}" stroke-width="9" stroke-linecap="round"/>`;
    row.forEach((ch, c) => {
      const x = 92 + c * 90;
      b += `<path d="M${x + 39} ${y - 8}v10" stroke="${V.ironLight}" stroke-width="4"/>`;
      // a shield that is gone leaves its hook, and the clean stone it kept the weather off
      b += ch ? shield(x, y, 78, 104, ch) : `<path d="${shieldPath(x, y, 78, 104)}" fill="#3f3852" stroke="#5a5272" stroke-width="2.5" stroke-dasharray="7 6"/>`;
    });
  });
  return b;
})() };

/* ---- the strongbox: six enamel shields, and it takes four ---- */
const STUDS = ['crown', 'tower', 'raven', 'key', 'cross', 'star'];
const boxFig = ART.svg(620, 360, (() => {
  let b = `<rect x="14" y="18" width="592" height="330" rx="18" fill="#000" opacity=".3"/><rect x="8" y="8" width="592" height="330" rx="18" fill="${V.wood}" stroke="${V.dark}" stroke-width="6"/>`;
  [70, 304, 538].forEach(x => b += `<rect x="${x - 22}" y="8" width="44" height="330" fill="${V.iron}" stroke="${V.dark}" stroke-width="3"/>` + [40, 170, 306].map(y => `<circle cx="${x}" cy="${y}" r="6" fill="${V.ironLight}"/>`).join(''));
  STUDS.forEach((ch, i) => {
    const x = 118 + (i % 3) * 234 - (i % 3) * 78, y = 52 + Math.floor(i / 3) * 146, cx = 118 + (i % 3) * 156;
    b += `<g data-key="${ch}"><rect x="${cx - 8}" y="${y - 10}" width="110" height="132" rx="12" fill="${V.woodDark}" stroke="${V.dark}" stroke-width="3"/>${shield(cx + 8, y, 78, 104, ch)}`
      + `<rect class="hit-show" x="${cx - 8}" y="${y - 10}" width="110" height="132" rx="12" fill="none" stroke="${V.gold}" stroke-width="5"/></g>`;
  });
  return b;
})());
function boxBody(open) {
  let b = `<rect x="6" y="34" width="118" height="52" rx="5" fill="${V.wood}" stroke="${V.dark}" stroke-width="4"/>`;
  [22, 65, 108].forEach(x => b += `<rect x="${x - 6}" y="34" width="12" height="52" fill="${V.iron}"/>`);
  if (open) b += `<path d="M2 34L14 2H116L128 34Z" fill="${V.woodLip}" stroke="${V.dark}" stroke-width="4" stroke-linejoin="round"/><rect x="12" y="34" width="106" height="12" fill="${V.dark}"/><path d="M40 40l40 -10" stroke="${V.ironLight}" stroke-width="5" stroke-linecap="round"/>`;
  else {
    b += `<rect x="2" y="14" width="126" height="24" rx="6" fill="${V.woodLip}" stroke="${V.dark}" stroke-width="4"/>`;
    STUDS.forEach((ch, i) => b += `<rect x="${17 + i * 17}" y="19" width="11" height="13" rx="2" fill="${C[TINCT[ch][0]]}" stroke="${V.dark}" stroke-width="1.5"/>`);
  }
  return b;
}

/* ---- the well, the face in its cover, and what the bucket brings up ---- */
function wellBody(open) {
  let b = `<path d="M8 66L110 8L212 66Z" fill="${V.deep}" stroke="${V.dark}" stroke-width="4" stroke-linejoin="round"/><rect x="30" y="64" width="13" height="124" fill="${V.woodDark}"/><rect x="177" y="64" width="13" height="124" fill="${V.woodDark}"/>`;
  b += `<rect x="40" y="88" width="140" height="15" rx="7" fill="${V.wood}" stroke="${V.dark}" stroke-width="3"/><path d="M186 95h20v26" fill="none" stroke="${V.ironLight}" stroke-width="5" stroke-linecap="round"/>`;
  b += `<path d="M110 103V${open ? 150 : 176}" stroke="#b79a63" stroke-width="4"/>`;
  b += `<path d="M6 196v26q0 18 104 18t104 -18v-26Z" fill="${V.stoneLight}" stroke="${V.dark}" stroke-width="4"/><ellipse cx="110" cy="196" rx="104" ry="30" fill="${V.stoneEdge}" stroke="${V.dark}" stroke-width="4"/>`;
  for (let i = 0; i < 6; i++) b += `<path d="M${24 + i * 36} ${216 + (i % 2) * 4}v18" stroke="${V.dark}" stroke-width="2" opacity=".5"/>`;
  if (open) {
    b += `<ellipse cx="110" cy="196" rx="84" ry="21" fill="#05040a"/><ellipse cx="176" cy="204" rx="56" ry="15" fill="${V.wood}" stroke="${V.dark}" stroke-width="3" transform="rotate(14 176 204)"/>`;
    b += `<path d="M92 150h36l-5 34h-26Z" fill="${V.woodLip}" stroke="${V.dark}" stroke-width="3"/><path d="M92 152q18 -22 36 0" fill="none" stroke="${V.ironLight}" stroke-width="3"/><circle cx="110" cy="160" r="7" fill="none" stroke="${V.gold}" stroke-width="3"/>`;
  } else {
    b += `<ellipse cx="110" cy="196" rx="84" ry="21" fill="${V.wood}" stroke="${V.dark}" stroke-width="3"/><path d="M56 182v28M92 177v38M128 177v38M164 182v28" stroke="${V.dark}" stroke-width="2" opacity=".55"/>`;
    b += `<ellipse cx="110" cy="196" rx="26" ry="13" fill="${V.stoneEdge}" stroke="${V.dark}" stroke-width="3"/><circle cx="100" cy="194" r="4" fill="${V.dark}"/><circle cx="120" cy="194" r="4" fill="${V.dark}"/><path d="M102 202q8 4 16 0" fill="none" stroke="${V.dark}" stroke-width="2"/>`;
  }
  return b;
}
const KEYS = { crown: [3, 1, 4, 2, 5], raven: [2, 5, 1, 4, 3], tower: [4, 2, 5, 1, 3], skull: [1, 3, 2, 5, 4], bell: [5, 4, 2, 3, 1] };   // teeth, bow to tip
const DOOR_KEY = 'raven';
const PINS = KEYS[DOOR_KEY].slice().reverse();                  // the keyhole is at the right-hand end: the tip goes in first, to the far pin
const keysFig = ART.svg(680, 470, (() => {
  let b = `<rect width="680" height="470" rx="14" fill="#1a1524"/><path d="M60 50Q340 -6 620 50" fill="none" stroke="${V.ironLight}" stroke-width="9" stroke-linecap="round"/>`;
  Object.keys(KEYS).forEach((id, i) => {
    const x = 92 + i * 124;
    b += `<path d="M${x} 44V78" stroke="${V.ironLight}" stroke-width="5"/><circle cx="${x}" cy="118" r="42" fill="${V.brass}" stroke="${V.dark}" stroke-width="5"/><circle cx="${x}" cy="118" r="30" fill="${V.brassDark}"/>` + GL(id, x - 20, 98, 40, '#1c1408');
    b += `<rect x="${x - 9}" y="156" width="18" height="272" rx="5" fill="${V.brass}" stroke="${V.dark}" stroke-width="4"/>`;
    KEYS[id].forEach((n, k) => b += `<rect x="${x + 7}" y="${214 + k * 42}" width="${n * 13 + 4}" height="24" rx="3" fill="${V.brass}" stroke="${V.dark}" stroke-width="4"/>`);
  });
  return b;
})());
const lockPlate = `<svg viewBox="0 0 420 96" style="display:block;width:min(100%,420px);margin:0 auto 6px">`
  + `<rect x="4" y="6" width="412" height="84" rx="12" fill="${V.iron}" stroke="${V.dark}" stroke-width="5"/>`
  + `<circle cx="64" cy="48" r="32" fill="${V.brassDark}" stroke="${V.dark}" stroke-width="4"/>` + GL(DOOR_KEY, 42, 26, 44, '#1c1408')
  + [0, 1, 2, 3, 4].map(i => `<rect x="${118 + i * 40}" y="26" width="22" height="44" rx="5" fill="${V.dark}" stroke="${V.ironLight}" stroke-width="2.5"/>`).join('')
  + `<circle cx="366" cy="40" r="13" fill="${V.dark}"/><path d="M359 44h14l5 30h-24Z" fill="${V.dark}"/>`
  + `<path d="M404 16h-34" stroke="${V.gold}" stroke-width="4" stroke-linecap="round"/><path d="M372 8l-12 8l12 8Z" fill="${V.gold}"/></svg>`;
function doorBody(st) {
  let b = `<path d="M6 250V84Q6 8 80 8T154 84V250Z" fill="${V.stoneEdge}" stroke="${V.dark}" stroke-width="5"/>`;
  if (st.solved) b += `<path d="M20 250V88Q20 22 80 22T140 88V250Z" fill="#05040a"/><path d="M20 250V88Q20 22 80 22V250Z" fill="${V.woodDark}" stroke="${V.dark}" stroke-width="4" transform="skewY(-8) translate(0 12)"/><ellipse cx="96" cy="216" rx="34" ry="40" fill="${V.glow}" opacity=".12"/>`;
  else {
    b += `<path d="M20 250V88Q20 22 80 22T140 88V250Z" fill="${V.woodDark}" stroke="${V.dark}" stroke-width="4"/><path d="M50 250V36M80 250V22M110 250V36" stroke="${V.dark}" stroke-width="3" opacity=".6"/>`;
    [96, 196].forEach(y => b += `<rect x="20" y="${y}" width="120" height="13" fill="${V.iron}" stroke="${V.dark}" stroke-width="2.5"/>`);
    b += `<rect x="92" y="128" width="42" height="56" rx="5" fill="${V.iron}" stroke="${V.dark}" stroke-width="3"/><circle cx="113" cy="146" r="11" fill="${V.brassDark}"/>` + GL(DOOR_KEY, 105, 138, 16, '#1c1408') + `<circle cx="113" cy="170" r="4" fill="${V.dark}"/>`;
    // the bar's crank: a bare socket until the handle is found
    b += st.live ? `<path d="M42 150h22v-22" fill="none" stroke="${V.ironLight}" stroke-width="7" stroke-linecap="round"/>` : `<rect x="36" y="142" width="16" height="16" fill="${V.dark}" stroke="${V.ironLight}" stroke-width="2.5"/>`;
  }
  return b;
}

const POS1 = {
  shields:   { x: 1.5,   y: 31.8, w: 19.5, h: 39 },
  gargoyles: { x: 24.5,  y: 22.9, w: 41.25, h: 12.2 },
  strongbox: { x: 25.2,  y: 64.4, w: 8.1,  h: 10 },
  wellcover: { x: 39.4,  y: 54.4, w: 13.75, h: 26.7 },
  keepdoor:  { x: 68.75, y: 45.6, w: 10,   h: 27.8 },
};

const ROOM1 = {
  id:'gatehouse', name:'Room 1 — The Gatehouse Court', scene:'gatehouse',
  stageFx:'shudder',
  relays:[{el:'rl-gatehouse',mode:'pulse',period:3.6}],
  wrongSound:'thunder',
  wrongVfx:'flash',
  intro:"The castle took you in from the storm. Then the portcullis came down behind you.",
  objective:"Find your way into the keep — <b>glowing rings</b> mark what there is to look at. Whatever opens a lock is somewhere else in the court.",
  entryBeat:"As the portcullis seats itself into the stone, every window in the keep goes dark at once — except one, high in the tower, which comes on.",
  entrySound:'thunder',
  completeText:"Five pins lift, and the keep door swings in on a hall of cold candles. Behind you in the court the well rope creaks — paying out, slowly, though no one is drawing water.",
  chain:`The six gargoyles on the wall-walk each look a different way, and the stone face in the well cover is shown the same six looks: ${GAZE.split('').join(', ')} → the bucket brings up a ring of five keys → every row of the shield wall runs to a pattern with one shield taken down, and the strongbox takes the four that are missing, top row first: ${MISSING.join(', ')} — it holds the crank for the keep door's bar → the door's lock wears a raven; the raven key's teeth, bow to tip, are ${KEYS[DOOR_KEY].join(', ')}, and since the keyhole is at the right-hand end the tip goes to the far pin: ${PINS.join(', ')}.`,
  objects:[
    { id:'gargoyles', icon:'🗿', name:'The Parapet', pos:POS1.gargoyles,
      desc:"Six of them along the wall-walk, spouting rain. The mason gave each one something different to stare at.",
      figure:ART.svg(gargArt.w, gargArt.h, gargArt.body),
      sprite:ART.sprite(POS1.gargoyles, 660, 110, gargRow) },
    { id:'wellcover', icon:'🪣', name:'The Well', pos:POS1.wellcover, ringAt:[50,80],
      desc:"A stone face is set into the well's oak cover. Its eyes roll four ways, and it wants to be shown six looks.",
      sprite:st=>ART.sprite(POS1.wellcover, 220, 244, wellBody(st.solved)),
      puzzle:{ type:'dirpad', from:['gargoyles'], slots:GAZE.length, answer:GAZE, labels:false,
        miss:"The stone eyes roll back to the middle. That is not what it wanted to see.",
        hints:[
          "A face whose eyes roll four ways, and six places to fill. Something else in this court is looking at things — six of them, up on the wall.",
          "Each gargoyle on the parapet looks its own way: left, right, up at the sky, or down at you. Show the face each look in turn, from the left-hand gargoyle to the right-hand one.",
          `Right, down, left, left, up, right: ${GAZE.split('').join(', ')}.`
        ],
        solvedText:"The stone eyes settle and the cover slides aside. The bucket comes up heavy: a ring of five keys, hung down there out of the rain.",
        inside:{ name:"The gatekeeper's keys", figure:keysFig } } },
    { id:'shields', icon:'🛡️', name:'The Shield Wall', pos:POS1.shields,
      desc:"Four rows of the household's arms. Somebody has taken one shield down from every row, and the wall has kept its shape.",
      figure:ART.svg(shieldsArt.w, shieldsArt.h, shieldsArt.body),
      sprite:ART.sprite(POS1.shields, shieldsArt.w, shieldsArt.h, shieldsArt.body) },
    { id:'strongbox', icon:'🧰', name:"Gatekeeper's Strongbox", pos:POS1.strongbox,
      desc:"Iron-bound, and no keyhole anywhere on it: six enamel shields on the lid, and it will take four of them.",
      sprite:st=>ART.sprite(POS1.strongbox, 130, 90, boxBody(st.solved)),
      puzzle:{ type:'press', from:['shields'], figure:boxFig, slots:MISSING.length, repeat:true, answer:MISSING,
        miss:"The lid stays down, and the four you pressed spring back.",
        hints:[
          "Six little shields to press, four at a time. The same six devices hang on the wall by the gate — or most of them do.",
          "Each row of the shield wall runs to a pattern, and each has a pale patch where a shield is gone. Work out which shield would finish each row, and press them top row first.",
          `${MISSING.map((m, i) => i ? m : m[0].toUpperCase() + m.slice(1)).join(', ')}.`
        ],
        solvedText:"The lid lifts on a bed of straw with one thing in it: the crank handle for the keep door's bar." } },
    { id:'keepdoor', icon:'🚪', name:'The Keep Door', pos:POS1.keepdoor, needs:'strongbox',
      desc:"The bar is cranked back. What holds the door now is its lock: five pins behind a raven, and the keyhole at the right-hand end.",
      deadDesc:"Barred from the inside. There is a square socket where a crank handle belongs, and no handle in it.",
      sprite:st=>ART.sprite(POS1.keepdoor, 160, 252, doorBody(st)),
      puzzle:{ type:'levels', from:['wellcover'], cols:5, max:5, answer:PINS, plate:lockPlate, scale:false, tryLabel:'TRY THE DOOR',
        miss:"The pins drop back. Nothing gave.",
        hints:[
          "Five pins to lift, under a raven. The keys from the well each carry a different device on the bow.",
          "The raven key has five teeth, each a different length: that is how high each pin has to go. But look where the keyhole is — a key goes in tip first, so its tip ends up under the far pin.",
          `From the left: ${PINS.join(', ')}.`
        ],
        solvedText:"Five pins lift together, and a door that has not opened in forty years opens." } },
  ]
};

/* ============================================================
   ROOM 2 — THE LIBRARY
   A game of chess left standing, and a cabinet whose letter wheels wear the
   white pieces. A music box in the cabinet, and an organ whose five pipes
   are its five teeth in another order. Nine volumes on the mantel with four
   gone, a ribbon in each gap, and a lectern ringed in the ribbons' colours.
   And a painted ceiling with something too small to see beside four of its
   beasts — until the lectern gives up its opera glass.
   ============================================================ */

/* ---- the chess table: a game left standing ---- */
const FILES = 'abcdefgh';
const BOARD = [   // piece, side, file, rank
  ['pawn', 'w', 'c', 4], ['knight', 'w', 'a', 3], ['bishop', 'w', 'g', 5], ['rook', 'w', 'e', 1], ['queen', 'w', 'd', 7], ['king', 'w', 'h', 1],
  ['pawn', 'b', 'f', 6], ['knight', 'b', 'h', 6], ['bishop', 'b', 'b', 2], ['rook', 'b', 'c', 8], ['queen', 'b', 'g', 2], ['king', 'b', 'e', 8],
];
const CABINET_PIECES = ['pawn', 'knight', 'bishop', 'rook', 'queen'];
const CABINET = CABINET_PIECES.map(pc => BOARD.find(x => x[0] === pc && x[1] === 'w')[2].toUpperCase()).join('');
const SQ = 54, BOARD_W = SQ * 8 + 60;
const boardBody = (() => {
  const ox = 44, oy = 12;
  let b = `<rect x="0" y="0" width="${BOARD_W}" height="${BOARD_W}" rx="12" fill="#3a2614" stroke="${V.dark}" stroke-width="5"/>`;
  for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) b += `<rect x="${ox + f * SQ}" y="${oy + r * SQ}" width="${SQ}" height="${SQ}" fill="${(r + f) % 2 ? '#7a5634' : '#dcc9a0'}"/>`;
  b += `<rect x="${ox}" y="${oy}" width="${SQ * 8}" height="${SQ * 8}" fill="none" stroke="${V.dark}" stroke-width="3"/>`;
  // ranks up the side and files along the bottom, as on any board
  for (let i = 0; i < 8; i++) {
    b += W(ox - 20, oy + i * SQ + SQ / 2 + 8, String(8 - i), { size: 22, fill: '#e6d6ae', weight: 700 });
    b += W(ox + i * SQ + SQ / 2, oy + 8 * SQ + 33, FILES[i], { size: 26, fill: '#e6d6ae', weight: 700 });
  }
  BOARD.forEach(([pc, side, f, r]) => {
    const x = ox + FILES.indexOf(f) * SQ + 5, y = oy + (8 - r) * SQ + 4;
    b += `<g stroke="${side === 'w' ? '#1c1408' : '#e6d6ae'}" stroke-width="1.2" stroke-linejoin="round">${GL(pc, x, y, SQ - 10, side === 'w' ? '#f8f1df' : '#1c1408')}</g>`;
  });
  return b;
})();
const chessBody = `<ellipse cx="105" cy="204" rx="80" ry="6" fill="#000" opacity=".35"/><path d="M40 150L28 202M170 150L182 202M105 150V202" stroke="${V.woodDark}" stroke-width="9" stroke-linecap="round"/>`
  + `<rect x="8" y="138" width="194" height="16" rx="5" fill="${V.wood}" stroke="${V.dark}" stroke-width="3"/>` + ART.inset(30, 0, 150, 150, BOARD_W, BOARD_W, boardBody);

/* ---- the curio cabinet, and the music box in it ---- */
function cabinetBody(open) {
  let b = `<path d="M6 150h98l-12 10H18Z" fill="${V.woodDark}"/><rect x="6" y="14" width="98" height="136" rx="6" fill="${V.wood}" stroke="${V.dark}" stroke-width="4"/><path d="M2 14h106l-8 -10H10Z" fill="${V.woodLip}" stroke="${V.dark}" stroke-width="3"/>`;
  if (open) {
    b += `<rect x="14" y="22" width="82" height="120" fill="#120a14"/><path d="M14 22l-12 6v110l12 4Z" fill="#3a2d4a" opacity=".7" stroke="${V.dark}" stroke-width="2"/><path d="M96 22l12 6v110l-12 4Z" fill="#3a2d4a" opacity=".7" stroke="${V.dark}" stroke-width="2"/>`;
    b += `<rect x="26" y="96" width="58" height="30" rx="3" fill="${V.woodLip}" stroke="${V.dark}" stroke-width="2"/><rect x="34" y="88" width="42" height="12" fill="${V.brass}"/>`;
  } else {
    b += `<rect x="14" y="22" width="40" height="120" fill="#2a2038" opacity=".85"/><rect x="56" y="22" width="40" height="120" fill="#2a2038" opacity=".85"/><path d="M20 30l14 30M62 30l14 30" stroke="#8f86b8" stroke-width="2" opacity=".35"/>`;
    b += `<rect x="30" y="72" width="50" height="16" rx="3" fill="${V.brass}" stroke="${V.dark}" stroke-width="2"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${33 + i * 9.4}" y="75" width="7" height="10" rx="1.5" fill="#1c1408"/>`).join('');
  }
  return b;
}
const TEETH = [3, 5, 1, 4, 2];                        // how long each lane's tooth is, top lane first (1 is the shortest)
const STRIP = [2, 0, 3, 1, 4, 0, 2];                 // which lane is punched, column by column, in the order they reach the comb
const PITCH = { 1: 784, 2: 659, 3: 587, 4: 523, 5: 440 };      // the shorter the tooth (or the pipe), the higher the note
const musicFig = ART.svg(700, 330, (() => {
  let b = `<rect x="10" y="40" width="200" height="250" rx="12" fill="${V.wood}" stroke="${V.dark}" stroke-width="5"/><rect x="24" y="54" width="172" height="222" rx="6" fill="${V.woodDark}"/>`;
  // the crank, and which way it turns
  b += `<circle cx="60" cy="24" r="10" fill="${V.brass}" stroke="${V.dark}" stroke-width="3"/><path d="M60 24H110" stroke="${V.brass}" stroke-width="7" stroke-linecap="round"/><circle cx="110" cy="24" r="8" fill="${V.woodLip}" stroke="${V.dark}" stroke-width="3"/>`;
  const lane = (i) => 92 + i * 42;
  // the comb: one steel tooth to a lane, five lengths
  b += `<rect x="40" y="70" width="26" height="206" rx="4" fill="#9aa3a7" stroke="${V.dark}" stroke-width="3"/>`;
  TEETH.forEach((len, i) => b += `<rect x="64" y="${lane(i) - 7}" width="${24 + len * 22}" height="14" rx="4" fill="#c9d0d4" stroke="${V.dark}" stroke-width="2.5"/>`);
  // the paper strip, feeding in towards the comb
  b += `<rect x="200" y="66" width="486" height="210" fill="#e9dfc4" stroke="#b9a57c" stroke-width="2"/>`;
  for (let c = 0; c < STRIP.length; c++) b += `<path d="M${238 + c * 62} 68V274" stroke="#b9a57c" stroke-width="1.5" stroke-dasharray="3 6" opacity=".7"/>`;
  for (let i = 0; i < 5; i++) b += `<path d="M202 ${lane(i)}H684" stroke="#cbbd98" stroke-width="1.5"/>`;
  STRIP.forEach((ln, c) => b += `<rect x="${226 + c * 62}" y="${lane(ln) - 9}" width="24" height="18" rx="5" fill="#2a1d10"/>`);
  b += `<path d="M640 300H560" stroke="${V.ink}" stroke-width="5" stroke-linecap="round"/><path d="M556 300l16 -10v20Z" fill="${V.ink}"/>`;
  return b;
})());
const ORGAN_PIPES = [4, 1, 5, 2, 3];                  // each pipe's length, left to right (1 is the shortest)
const ORGAN = STRIP.map(ln => ORGAN_PIPES.indexOf(TEETH[ln]) + 1).join('');
const TUNE = STRIP.map(ln => PITCH[TEETH[ln]]);
const organBody = (() => {
  let b = `<path d="M8 120L160 64L312 120V420H8Z" fill="#241626" stroke="#3a2d4a" stroke-width="6" stroke-linejoin="round"/>`;
  ORGAN_PIPES.forEach((len, i) => {
    const x = 34 + i * 56, h = 110 + (len - 1) * 52, top = 316 - h;
    b += `<g data-key="${i + 1}"><rect x="${x}" y="${top}" width="40" height="${h}" rx="9" fill="#8a7a9c" stroke="${V.dark}" stroke-width="3"/>`
      + `<rect x="${x + 6}" y="${top + 6}" width="7" height="${h - 20}" rx="3" fill="#c9bde0" opacity=".45"/>`
      + `<path d="M${x + 8} ${top + h - 46}h24l-4 12h-16Z" fill="${V.dark}"/>`
      + `<path d="M${x + 6} 316h28l-8 30h-12Z" fill="#6a5a7c" stroke="${V.dark}" stroke-width="3"/></g>`;
  });
  b += `<rect x="20" y="346" width="280" height="22" rx="3" fill="${V.woodDark}"/><rect x="20" y="368" width="280" height="34" fill="#171021"/>`;
  for (let k = 0; k < 14; k++) b += `<rect x="${24 + k * 19.6}" y="372" width="16" height="28" fill="${[2, 5, 9, 12].includes(k) ? '#171021' : '#e6d6ae'}" stroke="${V.dark}" stroke-width="1"/>`;
  return b;
})();
const organFig = ART.svg(320, 426, organBody);

/* ---- the mantel: nine volumes, four gone, a ribbon left in every gap ---- */
const VOLUMES = { 1: '#5c3244', 2: '#2d3a4a', 4: '#4a3a2d', 5: '#3a2d4a', 8: '#2d4a3a' };
const RIBBONS = { 3: 'red', 6: 'blue', 7: 'green', 9: 'yellow' };
const LECTERN_RINGS = ['yellow', 'red', 'green', 'blue'];
const LECTERN = LECTERN_RINGS.map(c => Object.keys(RIBBONS).find(n => RIBBONS[n] === c)).join('');
const ROMAN = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];
const mantelArt = { w: 560, h: 160, body: (() => {
  let b = `<rect x="0" y="146" width="560" height="14" fill="#3a3244"/>`;
  b += `<path d="M6 146V70h22v76Z" fill="${V.iron}" stroke="${V.dark}" stroke-width="3"/><path d="M554 146V70h-22v76Z" fill="${V.iron}" stroke="${V.dark}" stroke-width="3"/>`;
  for (let n = 1; n <= 9; n++) {
    const x = 34 + (n - 1) * 55;
    if (VOLUMES[n]) {
      b += `<rect x="${x}" y="${30 + (n % 3) * 8}" width="50" height="${116 - (n % 3) * 8}" rx="3" fill="${VOLUMES[n]}" stroke="${V.dark}" stroke-width="3"/>`
        + `<path d="M${x + 4} ${44 + (n % 3) * 8}h42M${x + 4} 132h42" stroke="${V.brass}" stroke-width="3" opacity=".8"/>`
        + W(x + 25, 96, ROMAN[n], { size: 22, fill: V.gold, weight: 700 });
    } else {
      // where a book stood: clean wood, and a ribbon tied to the shelf
      b += `<rect x="${x + 3}" y="140" width="44" height="6" fill="#4a4458" opacity=".7"/>`
        + `<path d="M${x + 25} 140V${100 + (n % 2) * 10}l-7 14M${x + 25} ${100 + (n % 2) * 10}l7 14" fill="none" stroke="${C[RIBBONS[n]]}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`
        + `<circle cx="${x + 25}" cy="141" r="4" fill="${C[RIBBONS[n]]}"/>`;
    }
  }
  return b;
})() };

/* ---- the lectern, and the opera glass in its book ---- */
function lecternBody(open) {
  let b = `<path d="M38 250h24l-4 -110h-16Z" fill="${V.woodDark}"/><rect x="22" y="240" width="56" height="10" rx="3" fill="${V.wood}"/>`;
  b += `<path d="M4 64L96 44L92 120L8 140Z" fill="${V.wood}" stroke="${V.dark}" stroke-width="4" stroke-linejoin="round"/>`;
  if (open) b += `<path d="M14 66L50 58L52 120L16 128Z" fill="#e9dfc4"/><path d="M50 58L88 50L86 112L52 120Z" fill="#ddd0ae"/><circle cx="62" cy="88" r="8" fill="${V.brass}" stroke="${V.dark}" stroke-width="2"/><circle cx="76" cy="85" r="8" fill="${V.brass}" stroke="${V.dark}" stroke-width="2"/>`;
  else b += `<path d="M14 66L86 50L84 112L16 128Z" fill="#5c3244" stroke="${V.dark}" stroke-width="3"/><rect x="40" y="76" width="22" height="20" rx="3" fill="${V.brass}" stroke="${V.dark}" stroke-width="2"/>`
    + LECTERN_RINGS.map((c, i) => `<rect x="${42 + i * 4.6}" y="80" width="3.4" height="12" fill="${C[c]}"/>`).join('');
  return b;
}
const glassFig = ART.svg(420, 220, `<path d="M40 110h340" stroke="${V.woodDark}" stroke-width="8" stroke-linecap="round"/>`
  + [130, 290].map(x => `<circle cx="${x}" cy="110" r="64" fill="#1c2e3a" stroke="${V.brass}" stroke-width="14"/><circle cx="${x - 18}" cy="90" r="16" fill="#cfe4ee" opacity=".3"/>`).join('')
  + `<rect x="186" y="96" width="48" height="28" rx="8" fill="${V.brassDark}" stroke="${V.dark}" stroke-width="3"/><path d="M210 124V196" stroke="${V.brass}" stroke-width="8" stroke-linecap="round"/>`);

/* ---- the painted ceiling: eight beasts, and something tiny beside four of them ---- */
const BEASTS = ['raven', 'snake', 'frog', 'crab', 'fish', 'beetle', 'bird', 'paw'];
const TINY = { sun: 'snake', moon: 'crab', star: 'raven', comet: 'beetle' };
const ORRERY_MARKS = ['sun', 'moon', 'star', 'comet'];
const ORRERY = ORRERY_MARKS.map(m => TINY[m]);
const ceilingArt = { w: 1000, h: 170, body: (() => {
  let b = `<rect width="1000" height="170" fill="#2a1d2e"/><rect x="6" y="6" width="988" height="158" fill="#3a2a3e" stroke="${V.brassDark}" stroke-width="4"/>`;
  b += `<path d="M10 85Q60 40 120 85T240 85T360 85T480 85T600 85T720 85T840 85T960 85" fill="none" stroke="#5c4a3a" stroke-width="5" opacity=".7"/>`;
  BEASTS.forEach((beast, i) => {
    const cx = 64 + i * 124;
    b += `<circle cx="${cx}" cy="85" r="52" fill="#d8c9a6" stroke="${V.brassDark}" stroke-width="5"/>` + GL(beast, cx - 30, 55, 60, '#3a2a3e');
    const mark = Object.keys(TINY).find(m => TINY[m] === beast);
    // painted in by a fine brush, in the same brown as the vine: nobody was meant to see it from the floor
    if (mark) b += GL(mark, cx + 30, 104, 9, '#6b5334');
  });
  return b;
})() };

/* ---- the orrery ---- */
function orreryBody(st) {
  let b = `<ellipse cx="90" cy="232" rx="70" ry="7" fill="#000" opacity=".35"/><path d="M60 230h60l-10 -60h-40Z" fill="${V.woodDark}" stroke="${V.dark}" stroke-width="3"/><rect x="84" y="96" width="12" height="80" fill="${V.brassDark}"/>`;
  b += `<circle cx="90" cy="90" r="16" fill="${V.gold}" stroke="${V.dark}" stroke-width="3"/>`;
  [[36, 0], [56, 1], [80, 2]].forEach(([r, i]) => {
    const a = st.solved ? -90 : [-30, 140, 210][i], x = 90 + Math.cos(a * Math.PI / 180) * r, y = 90 + Math.sin(a * Math.PI / 180) * r * .55;
    b += `<ellipse cx="90" cy="90" rx="${r}" ry="${(r * .55).toFixed(1)}" fill="none" stroke="${V.brass}" stroke-width="3"/><path d="M90 90L${x.toFixed(1)} ${y.toFixed(1)}" stroke="${V.brassDark}" stroke-width="2.5"/>`
      + `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${6 + i * 2}" fill="${['#8f7fa8', '#4a7a9c', '#9c5a4a'][i]}" stroke="${V.dark}" stroke-width="2"/>`;
  });
  if (!st.live) b += `<rect x="70" y="182" width="40" height="12" rx="4" fill="${V.iron}" stroke="${V.dark}" stroke-width="2"/><path d="M110 188h40" stroke="${V.ironLight}" stroke-width="4"/>`;
  return b;
}

const POS2 = {
  ceiling:  { x: 17.5,  y: 2,    w: 65,    h: 19.7 },
  mantel:   { x: 37.5,  y: 36.7, w: 17.5,  h: 8.9 },
  organ:    { x: 77.25, y: 23.8, w: 20,    h: 47.3 },
  cabinet:  { x: 66.9,  y: 48.9, w: 6.9,   h: 17.8 },
  lectern:  { x: 57.4,  y: 60.9, w: 6.25,  h: 28 },
  chess:    { x: 20.6,  y: 67.8, w: 13.1,  h: 23.3 },
  orrery:   { x: 40.6,  y: 66.7, w: 11.25, h: 26.7 },
};

const ROOM2 = {
  id:'library', name:'Room 2 — The Library', scene:'library',
  relays:[{el:'rl-library',mode:'pulse',period:4.0}],
  wrongSound:'creak',
  wrongVfx:'shadow',
  intro:"Ten thousand books, one cold hearth relit by nobody, and the Baron's organ waiting mid-hymn.",
  objective:"The Baron hid his laboratory behind a game, a tune and the stars. <b>Play the room.</b>",
  entryBeat:"The fire in the hearth is burning. It was not burning when the household died, and no one has been here since. Something keeps this room warm. Something likes it here.",
  entrySound:'knock',
  completeText:"The orrery's arms swing into line, and a bookcase rolls aside on iron rails, breathing out forty years of cold air and the smell of a hospital. The laboratory stair leads down.",
  chain:`The white pieces on the chessboard stand on files c, a, g, e and d, and the cabinet's five letter wheels wear a white pawn, knight, bishop, rook and queen: ${CABINET} → the cabinet holds a music box whose paper strip punches seven notes; each lane has its own tooth, and the organ's five pipes are the comb's five lengths in another order — short tooth, short pipe — so, counting pipes from the left: ${ORGAN.split('').join(', ')} → the volumes on the mantel run I to IX with four gone and a ribbon in each gap, red III, blue VI, green VII, gold IX, and the lectern's wheels are ringed gold, red, green, blue: ${LECTERN} → the lectern's book holds an opera glass, and through it the painted ceiling shows a tiny sun by the snake, a moon by the crab, a star by the raven and a comet by the beetle → with the organ played the orrery's brake lets go, and its arms are set ${ORRERY.join(', ')}.`,
  objects:[
    { id:'chess', icon:'♟️', name:'The Chess Table', pos:POS2.chess,
      desc:"A game nobody finished. The Baron played white.",
      figure:ART.svg(BOARD_W, BOARD_W, boardBody),
      sprite:ART.sprite(POS2.chess, 210, 210, chessBody) },
    { id:'cabinet', icon:'🗝️', name:'Curio Cabinet', pos:POS2.cabinet,
      desc:"Glass doors and a brass clasp: five wheels of letters, A to H, and a little ivory chessman on each.",
      sprite:st=>ART.sprite(POS2.cabinet, 110, 160, cabinetBody(st.solved)),
      puzzle:{ type:'combo', from:['chess'], faces:'ABCDEFGH', wheels:CABINET_PIECES.map(g=>({ mark:{ glyph:g } })), answer:CABINET, tryLabel:'TRY THE CLASP',
        miss:"The clasp holds. Somewhere in the walls, a pipe sighs.",
        hints:[
          "Five wheels of letters, A to H, and a chess piece over each. There is a game on the table by the shelves.",
          "Along the bottom of a chessboard the columns are lettered a to h. Find the white pawn, knight, bishop, rook and queen, and read which column each one stands in.",
          `Pawn C, knight A, bishop G, rook E, queen D: ${CABINET.split('').join(', ')}.`
        ],
        solvedText:"The clasp lets go. On the cabinet's one shelf sits a music box with a crank, and a strip of punched paper already fed into it.",
        inside:{ name:'The music box', figure:musicFig, tool:{ type:'listen', notes:TUNE, label:'▶ turn the crank' } } } },
    { id:'organ', icon:'🎹', name:'The Organ', pos:POS2.organ,
      desc:"Five great pipes, no two the same length, and nobody has stood them in order.",
      sprite:ART.sprite(POS2.organ, 320, 426, organBody),
      puzzle:{ type:'press', from:['cabinet'], figure:organFig, slots:STRIP.length, repeat:true, answer:ORGAN, tones:Object.fromEntries(ORGAN_PIPES.map((len, i) => [String(i + 1), PITCH[len]])),
        gm:`pipes counted from the left: ${ORGAN.split('').join(', ')}`,
        miss:"The organ wheezes the wrong tune at you, and stops.",
        hints:[
          "Seven notes on five pipes. The music box in the cabinet knows a tune of seven notes.",
          "On the music box, each lane of the paper strip has its own tooth on the comb, and the teeth are five lengths. The pipes are the same five lengths in a different order: a short tooth is a short pipe. Play the strip from the end nearest the comb.",
          `Counting pipes from the left: ${ORGAN.split('').join(', ')}.`
        ],
        solvedText:"The last note holds, and holds — and under the floor, a valve opens with a long breath of air. Something in the room has been let go." } },
    { id:'mantel', icon:'📚', name:'The Mantelpiece', pos:POS2.mantel,
      desc:"A set of nine volumes between two iron bookends, and four of them gone. Whoever took them left a ribbon where each one stood.",
      figure:ART.svg(mantelArt.w, mantelArt.h, mantelArt.body),
      sprite:ART.sprite(POS2.mantel, mantelArt.w, mantelArt.h, mantelArt.body) },
    { id:'lectern', icon:'📖', name:'The Lectern', pos:POS2.lectern,
      desc:"A heavy book chained to a lectern, shut with a clasp of four wheels ringed in gold, red, green and blue.",
      sprite:st=>ART.sprite(POS2.lectern, 100, 252, lecternBody(st.solved)),
      puzzle:{ type:'combo', from:['mantel'], wheels:LECTERN_RINGS.map(c=>({ mark:{ color:c } })), answer:LECTERN, tryLabel:'OPEN THE BOOK',
        miss:"The clasp does not give.",
        hints:[
          "Four wheels of figures, each ringed in a colour. The same four colours are on the mantelpiece.",
          "The volumes on the mantel run one to nine, in Roman figures, with four gone and a coloured ribbon in each gap. Work out which volume each ribbon stands in for.",
          `Gold is IX, red is III, green is VII, blue is VI: ${LECTERN.split('').join(', ')}.`
        ],
        solvedText:"The book falls open on a hollow cut into its pages. In the hollow: an opera glass, brass and mother-of-pearl.",
        inside:{ name:'An opera glass', figure:glassFig } } },
    { id:'ceiling', icon:'🎨', name:'The Painted Ceiling', pos:POS2.ceiling,
      desc:"Eight beasts in roundels above the cornice, joined by a painted vine. The painter took more care over some of them than anyone below could ever see.",
      figure:ART.svg(ceilingArt.w, ceilingArt.h, ceilingArt.body),
      lens:{ needs:'lectern', zoom:4.5, r:58, tint:V.brass, bg:'#3a2a3e' },
      sprite:ART.sprite(POS2.ceiling, ceilingArt.w, ceilingArt.h, ceilingArt.body) },
    { id:'orrery', icon:'🪐', name:'The Orrery', pos:POS2.orrery, needs:'organ',
      desc:"Brass worlds on brass arms, free to turn now. Each arm carries a wheel of beasts, and each wheel a little heavenly body.",
      deadDesc:"Brass worlds on brass arms, and every arm held fast by a brake. A thin pipe runs from the brake, under the floor, to the organ.",
      sprite:st=>ART.sprite(POS2.orrery, 180, 240, orreryBody(st)),
      puzzle:{ type:'combo', from:['ceiling'], wheels:ORRERY_MARKS.map(g=>({ faces:{ glyphs:BEASTS }, mark:{ glyph:g } })), answer:ORRERY, tryLabel:'ALIGN THE ARMS',
        miss:"The arms swing, and drift apart again.",
        hints:[
          "Four wheels of beasts, each marked with a sun, a moon, a star or a comet. The same eight beasts are painted on the ceiling.",
          "From the floor the ceiling is just beasts. Through the opera glass from the lectern, four of them have something tiny painted beside them.",
          `Sun snake, moon crab, star raven, comet beetle: ${ORRERY.join(', ')}.`
        ],
        solvedText:"The arms swing round into one line, sun to the far world, and lock there with a click you feel in the floor." } },
  ]
};

const OLD_ROOMS = [
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
  chain:"The slab's chalked riddle names the Baron's oldest servant: LIGHTNING → the jar rack holds only under the Baron's own seal, which rules out one cracked, one resealed and one carrying a mark nobody knows, leaving RISEN → the switchboard wants three even figures multiplying to forty-eight, placed on the ways as the Baron assigns them — heaviest to the coil, lightest to the earth: 624 → the dumbwaiter brings up a mourning card in the same masons' cipher as the vellum: ALIVE.",
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
      desc:"Eight Leyden jars stand in the rack, each chalked with a letter and each stoppered under wax. The Baron's own notice is nailed above them, and he was not a man who wrote twice:\n\n   “A JAR HOLDS ONLY UNDER MY OWN SEAL. ANYTHING RESEALED HAS BEEN OPENED,\n    ANYTHING OPENED HAS EARTHED ITSELF, AND ANYTHING EARTHED WILL KILL\n    THE COIL AND NOT THE THING.”\n\nLeft to right along the rack:",
      puzzle:{
        type:'select',
        select:{commit:"⚡ THESE JARS HOLD CHARGE", wrong:"The rack stays dead.",
          items:[{letter:"R",value:"wax whole · the Baron's mark"},{letter:"M",value:"wax cracked clean through"},{letter:"I",value:"wax whole · the Baron's mark"},{letter:"U",value:"resealed in plain candle wax"},{letter:"S",value:"wax whole · the Baron's mark"},{letter:"E",value:"wax whole · the Baron's mark"},{letter:"D",value:"wax whole · a mark you do not know"},{letter:"N",value:"wax whole · the Baron's mark"}]},
        prompt:"Which jars still hold? Tap the ones under the Baron's own seal.", answers:['RISEN'],
        hints:[
          "Go jar by jar and read the wax, not the letter. Eight of them, so split the rack between you.",
          "Cracked is out and resealed is out — but look harder at the whole ones too. One of them is sealed with a mark that is not his.",
          "R, I, S, E and N are under the Baron's own mark. M is cracked, U is resealed, and D carries a mark you do not know. The rack spells RISEN."
        ],
        solvedText:"R-I-S-E-N. Nobody says it twice. Five jars still hold their charge — enough to wake the switchboard, if you can find what it wants.",
        solveBeat:"The chains overhead swing, all four at once, in a room with no wind. Then they still themselves — carefully — as if embarrassed.",
        beatSound:'clank'
      }
    },
    { id:'switchboard', icon:'🎛️', name:'Galvanic Switchboard', pos:{x:76,y:28,w:18,h:38},
      desc:"The master switchboard is locked behind three fuse dials, 0–9 each. The three fuse-ways are stamped with the circuits they feed, left to right across the board:\n\n   COIL          EARTH          BANK\n\nAnd the Baron's tag swings from the lever below them:\n\n   “THREE EVEN FIGURES WAKE THE BOARD, AND MULTIPLIED TOGETHER THEY MAKE\n    FORTY-EIGHT. THE COIL TAKES THE HEAVIEST OF THEM. THE EARTH TAKES THE\n    LIGHTEST. THE BANK TAKES WHAT IS LEFT.”",
      puzzle:{
        type:'keypad',
        prompt:"Work out the three fuses, then dial them in the order the ways are stamped.", answers:['624'],
        hints:[
          "Two jobs. First find three even digits that multiply to forty-eight; then put each one on the way the Baron assigns it.",
          "48 is 2 × 4 × 6, and no other three even digits will do it.",
          "Coil takes the heaviest (6), earth the lightest (2), bank what is left (4). The ways run COIL, EARTH, BANK: enter 624."
        ],
        solvedText:"6-2-4. The board wakes with a rising whine and the needles climb — and at the back of the laboratory the dumbwaiter begins to climb too. Slowly. Unbidden. From the cellar. Where the rope is cut."
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
  completeText:"The rig is wound, the fuses hold, and the portcullis is up. The storm is directly overhead — the next strike is yours to take.",
  chain:"Five ritual tags, each carrying its reason: the chains are grounded first because everything after puts charge in the room, the capacitor is cranked while the rod is still down, the coil can only be coupled once the rod is up, and the master switch is last — EADCB → the fuse box's chart gives each way its rating and the ways are numbered: 2386 → the storm table rules out the six-thousand-volt front and the one that strikes after the bell tolls one, leaving 11:30, less the fifty minutes the charge takes = 10:40 → the portcullis rings are stamped with their own figures and the counterweight chain passes them moon, tower, cross, flower: 7539 → hold the master switch closed and let go on a nine-kilovolt arc.",
  objects:[
    { id:'rig', icon:'🔩', name:'The Ignition Rig', pos:{x:45,y:12,w:12,h:56},
      desc:"The Baron's ignition ritual, five steps on five scattered vellum tags. He wrote every one of them with its reason attached, because he expected to be doing this alone and frightened:\n\n   TAG A — “Crank the capacitor, and crank it while the rod is still down. I will not have a raised rod standing over a charging bank.”\n\n   TAG B — “Throw the master switch. Last. It is the last thing anyone does in this tower, one way or the other.”\n\n   TAG C — “Couple the coil — and not until the rod is up, because the coupling runs through the rod's own collar and cannot be reached from the floor.”\n\n   TAG D — “Raise the rod.”\n\n   TAG E — “Ground the chains first, before anything else whatever. Everything after this puts charge in the room, and the chains are the only reason it goes into the earth and not into you.”",
      puzzle:{
        type:'order', order:{labels:{"A": "Crank the capacitor", "B": "Throw the master switch", "C": "Couple the coil", "D": "Raise the rod", "E": "Ground the chains"}},
        prompt:"Enter the five tag letters in ritual order.", placeholder:"FIVE LETTERS", answers:['EADCB'],
        hints:[
          "Every tag carries its reason. Two of them name their own place outright — one insists on being first, one on being last.",
          "Chains first (E), master switch last (B). The capacitor is cranked while the rod is still down, so the capacitor comes before the rod.",
          "Chains, capacitor, rod, then the coil once the rod is up, then the switch: enter EADCB."
        ],
        solvedText:"Chains, capacitor, rod, coil, switch. The rig assents piece by piece, and the whole tower starts to hum like a struck bell in very slow motion.",
        solveBeat:"Lightning walks the ridge across the valley — one, two, three strikes in a line, closing on the castle like footsteps.",
        beatSound:'thunder'
      }
    },
    { id:'fusebox', onSolve:{el:'rx-tower',op:.2,fx:'surge'}, icon:'🕯️', name:'Chapel Fuse Box', pos:{x:13,y:50,w:9,h:20},
      desc:"The chapel mains feed the tower through a four-digit fuse box. Four ways, four dials, and the chart pasted inside the door tells you what each way is allowed to carry:\n\n   WAY 1 — CHAPEL LAMPS ....... 2\n   WAY 2 — TOWER STAIR ........ 3\n   WAY 3 — THE COIL ........... 8\n   WAY 4 — GROUND CHAINS ...... 6\n\nUnderneath, in the Baron's hand:\n\n   “The coil takes eight and nothing under it. It has cost me two fuses\n    and one man who thought he knew better.”",
      puzzle:{
        type:'keypad',
        prompt:"Enter the 4-digit code.", answers:['2386'],
        hints:[
          "No arithmetic here. The chart gives the rating for each way, and the ways are numbered.",
          "Dial them in way order: chapel lamps, tower stair, coil, ground chains.",
          "2, 3, 8, 6. Enter 2386."
        ],
        solvedText:"2-3-8-6. The chapel mains close with a thud you feel through the stone, and the tower's veins fill with potential."
      }
    },
    { id:'barometer', icon:'⛈️', name:'The Storm-Glass Table', pos:{x:37,y:72,w:12,h:18},
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
      desc:"The portcullis winch answers to four glyph rings, and each ring is stamped with its own figure beside the glyph, so that nobody winding this gate in the dark has to remember anything:\n\n   ☾ 7        ♜ 5        ✠ 3        ⚘ 9\n\nThe rings do not turn independently. The counterweight chain runs from the drum and passes them one after another, and you can follow it with your eye the whole way: the moon first, then the tower, then the cross, and the flower last of all, where the chain goes down into the floor.",
      puzzle:{
        type:'keypad',
        prompt:"Enter the 4-digit release.", answers:['7539'],
        hints:[
          "You do not need anything from the rest of the castle. The figures are stamped on the rings and the chain itself gives the order.",
          "Follow the chain from the drum: moon, tower, cross, flower.",
          "☾ 7, ♜ 5, ✠ 3, ⚘ 9. Enter 7539."
        ],
        solvedText:"7-5-3-9, and the winch pawl lifts. The portcullis is free. All that remains is to bring the lightning down and signal the village to open the valley gate.",
        solveBeat:"On the battlement behind you — patient, unhurried, close — something sets down its weight. It has climbed the outside of the tower. It always could.",
        beatSound:'growl'
      }
    },
    { id:'rod', icon:'⚡', name:'The Master Switch', pos:{x:44,y:70,w:14,h:12}, hiddenUntil:'portcullis',
      desc:"The Baron's master switch, a brass handle the length of your forearm. Hold it closed and the capacitor bank charges; let it go and the charge bleeds away through the ground chains.\n\nThe rig's own plate is explicit, and the storm glass told you the rest:\n\n“THE GATE RELEASES ON A NINE-KILOVOLT ARC. BELOW NINE IT WILL NOT CARRY. ABOVE NINE THE COIL GOES, AND THE COIL IS NOT REPLACEABLE.”\n\nHold it too long and you will take the rig with you. Let go too early and nothing crosses the gap.",
      puzzle:{
        type:'hold',
        hold:{ label:'⚡ HOLD THE SWITCH CLOSED', unit:'kV', max:14, target:9, tolerance:0.5,
               rate:2.6, fall:3.6, ticks:[3,6,9,12] },
        prompt:"Hold the switch closed and let go at the arc the gate needs.",
        hints:[
          "The plate gives the number outright. The difficulty is not knowing it — it is stopping there.",
          "The gauge climbs while you hold and falls back the moment you let go. Nine kilovolts, no more.",
          "Hold until the gauge reads 9.0 and release. If you overshoot, let it fall and come up again."
        ],
        solvedText:"",
        solveBeat:"Nine kilovolts crosses the gap with a crack you feel in your teeth, and somewhere below, iron begins to move.",
        beatSound:'thunder'
      }
    }
  ]
}
];
const ROOMS = [ROOM1, ROOM2, ...OLD_ROOMS];

registerScenario({
  id:'vorstag', classic:true,
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
  // shown free of charge when a team has gone quiet for a while
  nudges:[
    "The rain slackens for a moment, and the courtyard shows you {it} again.",
    "A log shifts in the hearth. Firelight moves across {it}.",
    "Something in the glassware settles. Your eye lands on {it}.",
    "The wind drops. In the quiet, {it} is what you have left."
  ],
  // Three times a game something happens TO the team rather than around
  // them: the lights fail, something crosses the room, and a clue they had
  // already settled turns up disturbed.
  intrusions:{
    squeeze:'Every candle in the hall leans flat and goes out together. The dark lasts long enough that somebody says so. Then they take again.',
    arrival:'A shadow crosses the far doorway at the height of a man, and the rain goes on falling through where it was.',
    midroom:'The jar you had already settled is standing open. Its wax seal is on the floor beside it.'
  },
  wrongBeats:WRONG_BEATS, wrongSounds:WRONG_SOUNDS,
  scenes:SCENES, rooms:ROOMS
});
})();
