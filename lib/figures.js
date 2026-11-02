/* ============================================================
   FIGURES — the drawings that carry the clues.

   Until now every clue in this game arrived as a paragraph, which meant a
   clue that is physically a picture had to be *described* — and describing a
   picture is most of the way to solving it. "GALE — the tack is through the A"
   hands over the answer; a drawing of a tack driven through a letter does not.

   These are the recurring objects the five scenarios are built from, so that
   a weathered plank looks the same on a beach as a luggage tag does on a
   train, and so the scenario files stay readable data rather than walls of
   path geometry.

   Every builder returns an SVG fragment. FIG.plate() wraps fragments into a
   finished figure with a viewBox and no fixed pixel width, so it scales from
   a projector down to a phone — tests/audit.js enforces that.
   ============================================================ */
(function () {

  // The game's own palette, so figures sit in the room rather than on top of it.
  const INK = {
    sand: '#d8c39a', dim: '#8a9a95', teal: '#6fd39a', tealHi: '#4fa39b',
    wood: '#7a5f3c', woodDark: '#4e3c26', woodLip: '#9c7c4e',
    brass: '#c9a24a', copper: '#c67b4a', iron: '#5a6a72',
    stone: '#8d9aa0', sea: '#2d5d63', line: '#3a565c', panel: '#0b1619',
  };
  const TYPE = "'Special Elite', 'Courier New', monospace";

  const esc = (s) => String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /** A line of type. Everything here is centred unless told otherwise. */
  function words(x, y, str, o = {}) {
    const a = o.anchor || 'middle';
    const fill = o.fill || INK.sand;
    const size = o.size || 15;
    const fam = o.family || TYPE;
    const rot = o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : '';
    const ls = o.spacing ? ` letter-spacing="${o.spacing}"` : '';
    const op = o.opacity != null ? ` opacity="${o.opacity}"` : '';
    return `<text x="${x}" y="${y}" text-anchor="${a}" font-family="${fam}" font-size="${size}" fill="${fill}"${ls}${rot}${op}>${esc(str)}</text>`;
  }

  /* ---------- the wrapper every figure ends with ---------- */

  /**
   * Wrap fragments into a figure. No width/height attributes: the CSS gives it
   * the modal's width and the viewBox keeps the shape.
   */
  function plate(w, h, body, caption) {
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" role="img">`
      + body + `</svg>`
      + (caption ? `<figcaption>${esc(caption)}</figcaption>` : '');
  }

  /* ---------- timber ---------- */

  /**
   * A weathered board with its name branded across it, and optionally a copper
   * tack driven through one letter. The tack is small enough that the letter
   * underneath stays readable — which is the whole puzzle.
   */
  function plank(o) {
    const label = o.label || '';
    const cw = o.cw || 30;                       // one letter's width
    const pad = 22;
    const w = label.length * cw + pad * 2;
    const h = o.h || 56;
    const x = o.x || 0, y = o.y || 0;
    const rot = o.rot ? ` transform="rotate(${o.rot} ${x + w / 2} ${y + h / 2})"` : '';
    let b = `<g${rot}>`;
    // the board, with a lighter lip along the top edge so it reads as timber
    b += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${INK.wood}" stroke="${INK.woodDark}" stroke-width="2"/>`;
    b += `<rect x="${x}" y="${y}" width="${w}" height="5" fill="${INK.woodLip}" opacity=".5"/>`;
    // grain
    for (let i = 1; i < 4; i++) {
      const gy = y + (h / 4) * i;
      b += `<path d="M${x + 6} ${gy} q ${w / 3} ${i % 2 ? -3 : 3} ${w - 12} 0" stroke="${INK.woodDark}" stroke-width="1" fill="none" opacity=".45"/>`;
    }
    // the branded name, one glyph at a time so a tack can land exactly on one
    for (let i = 0; i < label.length; i++) {
      const cx = x + pad + i * cw + cw / 2;
      b += words(cx, y + h / 2 + 10, label[i], { size: 29, fill: '#f0dfbb', opacity: .92 });
    }
    if (o.tack != null && o.tack >= 0) {
      // Small, and sitting high on the glyph rather than over its middle: the
      // whole puzzle is reading the letter it has been driven through, so the
      // letter has to survive it.
      const cx = x + pad + o.tack * cw + cw / 2, cy = y + h / 2 - 6;
      b += `<circle cx="${cx}" cy="${cy}" r="5.6" fill="rgba(0,0,0,.5)"/>`;           // the hole it sits in
      b += `<circle cx="${cx}" cy="${cy}" r="4.4" fill="${INK.copper}" stroke="#7a4420" stroke-width="1.2"/>`;
      b += `<circle cx="${cx - 1.4}" cy="${cy - 1.4}" r="1.3" fill="#ffd9a8" opacity=".9"/>`;  // hammered highlight
    }
    b += `</g>`;
    return b;
  }

  /** A mooring post standing in sand, branded with a single letter near its top. */
  function post(o) {
    const x = o.x, base = o.base, h = o.h, w = o.w || 26;
    const top = base - h;
    let b = `<g>`;
    b += `<rect x="${x - w / 2}" y="${top}" width="${w}" height="${h}" rx="2" fill="${INK.wood}" stroke="${INK.woodDark}" stroke-width="2"/>`;
    b += `<rect x="${x - w / 2}" y="${top}" width="${w}" height="4" fill="${INK.woodLip}" opacity=".6"/>`;
    // splintered top, because every one of these is snapped off
    b += `<path d="M${x - w / 2} ${top} l ${w * 0.3} -5 l ${w * 0.25} 4 l ${w * 0.25} -6 l ${w * 0.2} 7 z" fill="${INK.woodLip}" opacity=".55"/>`;
    if (o.letter) b += words(x, top + 26, o.letter, { size: 22, fill: '#f0dfbb' });
    if (o.weed) b += `<path d="M${x - w / 2} ${base - o.weed} h ${w}" stroke="#3f6b52" stroke-width="3" opacity=".6"/>`;
    b += `</g>`;
    return b;
  }

  /** A dashed survey line across a drawing, labelled at the left. */
  function level(o) {
    const { x1, x2, y, label } = o;
    return `<g><line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="${o.stroke || INK.tealHi}" stroke-width="2" stroke-dasharray="9 7" opacity=".9"/>`
      + (label ? words(x1 + 4, y - 8, label, { anchor: 'start', size: 12, fill: o.stroke || INK.tealHi, spacing: 2 }) : '')
      + `</g>`;
  }

  /** A wash of sea with a soft top edge. */
  function water(o) {
    const { x1, x2, y, h } = o;
    let b = `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="${h}" fill="${INK.sea}" opacity=".55"/>`;
    b += `<path d="M${x1} ${y} q 30 -5 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0 t 60 0" stroke="#7fc6c0" stroke-width="2" fill="none" opacity=".7"/>`;
    return b;
  }

  /** A strip of sand to stand things in. */
  function sand(o) {
    const { x1, x2, y, h } = o;
    let b = `<rect x="${x1}" y="${y}" width="${x2 - x1}" height="${h}" fill="#5c4a30" opacity=".75"/>`;
    for (let i = 0; i < 26; i++) {
      const gx = x1 + Math.round(((i * 97) % (x2 - x1 - 10)) + 5);
      const gy = y + 6 + ((i * 53) % Math.max(1, h - 10));
      b += `<circle cx="${gx}" cy="${gy}" r="1.3" fill="#8d7450" opacity=".5"/>`;
    }
    return b;
  }

  /* ---------- painted and stencilled things ---------- */

  /** A shipper's mark painted on a crate: a glyph with its number beside it. */
  function paintedMark(o) {
    const { x, y, glyph, num } = o;
    const rot = o.rot || 0;
    return `<g transform="rotate(${rot} ${x} ${y})">`
      + words(x, y, glyph, { size: o.size || 30, fill: o.fill || '#e8d6ae', family: 'serif' })
      + words(x + (o.gap || 30), y, String(num), { size: o.size || 28, fill: o.fill || '#e8d6ae' })
      + `</g>`;
  }

  /** A compass rose: the reason nobody has to be told to read round from north. */
  function rose(o) {
    const { cx, cy, r } = o;
    let b = `<g>`;
    b += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#1b2b2e" stroke="${INK.brass}" stroke-width="2.5"/>`;
    b += `<circle cx="${cx}" cy="${cy}" r="${r - 9}" fill="none" stroke="${INK.brass}" stroke-width="1" opacity=".5"/>`;
    // the eight points, cardinals long
    for (let i = 0; i < 8; i++) {
      const a = (Math.PI / 4) * i - Math.PI / 2;
      const len = i % 2 === 0 ? r - 12 : r - 24;
      b += `<path d="M${cx} ${cy} L${(cx + Math.cos(a - 0.09) * len).toFixed(1)} ${(cy + Math.sin(a - 0.09) * len).toFixed(1)} L${(cx + Math.cos(a) * len).toFixed(1)} ${(cy + Math.sin(a) * len).toFixed(1)} Z" fill="${INK.brass}" opacity="${i % 2 === 0 ? .85 : .4}"/>`;
    }
    const lab = [['N', 0, -1], ['E', 1, 0], ['S', 0, 1], ['W', -1, 0]];
    for (const [t, dx, dy] of lab) {
      b += words(cx + dx * (r + 13), cy + dy * (r + 13) + 6, t,
        { size: 17, fill: t === 'N' ? '#ffe9b8' : INK.brass });
    }
    b += `<circle cx="${cx}" cy="${cy}" r="3" fill="#ffe9b8"/>`;
    b += `</g>`;
    return b;
  }

  /** An enamelled or riveted plate: a heading and a list of rows. */
  function board(o) {
    const { x, y, w, rows } = o;
    const rh = o.rh || 26, pad = 14;
    const h = pad * 2 + (o.title ? 26 : 0) + rows.length * rh;
    let b = `<g>`;
    b += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${o.fill || '#122025'}" stroke="${o.stroke || INK.line}" stroke-width="2"/>`;
    let ry = y + pad + 14;
    if (o.title) {
      b += words(x + w / 2, ry, o.title, { size: 14, fill: INK.tealHi, spacing: 2 });
      ry += 26;
    }
    rows.forEach(r => {
      const left = Array.isArray(r) ? r[0] : r;
      const right = Array.isArray(r) ? r[1] : '';
      b += words(x + pad, ry, left, { anchor: 'start', size: 15, fill: INK.sand });
      if (right !== '') b += words(x + w - pad, ry, String(right), { anchor: 'end', size: 15, fill: '#ffe9b8' });
      ry += rh;
    });
    b += `</g>`;
    return b;
  }
  board.height = (rows, o = {}) => (o.rh || 26) * rows + (o.title ? 26 : 0) + 28;

  /** A luggage or sounding tag on a string. */
  function tag(o) {
    const { x, y, text, sub } = o;
    const w = o.w || 96, h = o.h || 46, nick = 13;
    let b = `<g>`;
    // a luggage tag: one corner cut away for the string, and an eyelet in it
    b += `<path d="M${x + nick} ${y} H${x + w} V${y + h} H${x} V${y + nick} Z"`
      + ` fill="#c9bb95" stroke="#8a7c5c" stroke-width="1.6" stroke-linejoin="round"/>`;
    b += `<circle cx="${x + 13}" cy="${y + 13}" r="3.6" fill="#2a2418"/>`;
    b += words(x + w / 2 + 5, y + (sub ? 24 : 29), String(text), { size: 15, fill: '#2a2418' });
    if (sub) b += words(x + w / 2 + 5, y + 39, String(sub), { size: 12, fill: '#4a4132' });
    b += `</g>`;
    return b;
  }

  /** An indicator lamp, lit or dark. */
  function lamp(o) {
    const { x, y, on } = o;
    const r = o.r || 9;
    return `<g><circle cx="${x}" cy="${y}" r="${r + 3}" fill="#0a1417" stroke="${INK.line}" stroke-width="1.5"/>`
      + `<circle cx="${x}" cy="${y}" r="${r}" fill="${on ? '#ffd27a' : '#1d2b2f'}"${on ? ' opacity=".95"' : ''}/>`
      + (on ? `<circle cx="${x}" cy="${y}" r="${r + 6}" fill="#ffd27a" opacity=".18"/>` : '')
      + `</g>`;
  }

  /* ---------- things you count ---------- */

  /** A shelf with its stock standing on it, drawn to be counted. */
  function shelf(o) {
    const { x, y, w, items, label } = o;
    const h = o.h || 54;
    let b = `<g>`;
    b += `<rect x="${x}" y="${y + h - 5}" width="${w}" height="5" fill="${INK.iron}"/>`;
    if (label) b += words(x + 6, y + h + 18, label, { anchor: 'start', size: 12, fill: INK.dim, spacing: 1 });
    const n = items.length;
    for (let i = 0; i < n; i++) {
      const it = items[i];
      const ix = x + 24 + i * 34;
      if (it === 'rocket') {
        b += `<rect x="${ix - 7}" y="${y + 10}" width="14" height="${h - 15}" rx="7" fill="#9c3f33" stroke="#5c231c" stroke-width="1.5"/>`;
        b += `<path d="M${ix - 7} ${y + 16} h 14" stroke="#e8d6ae" stroke-width="2"/>`;
      } else if (it === 'flare') {
        b += `<rect x="${ix - 5}" y="${y + 18}" width="10" height="${h - 23}" rx="3" fill="#c0603a" stroke="#5c231c" stroke-width="1.4"/>`;
        b += `<circle cx="${ix}" cy="${y + 16}" r="4" fill="#e8d6ae"/>`;
      } else if (it === 'smoke') {
        b += `<rect x="${ix - 8}" y="${y + 20}" width="16" height="${h - 25}" rx="2" fill="#5d6f55" stroke="#2f3a2b" stroke-width="1.4"/>`;
        b += `<path d="M${ix - 8} ${y + 27} h 16" stroke="#cfd8c4" stroke-width="2"/>`;
      }
    }
    b += `</g>`;
    return b;
  }

  /* Where moss sits for a given count. Both numbers on a stone have to be
     countable at a glance, so the patches go in a fixed cluster rather than a
     ring — a ring of five inside a triangle ends up as a green smear. */
  const MOSS_AT = {
    1: [[0, 0]],
    2: [[-1, 0], [1, 0]],
    3: [[0, -1.05], [-1.05, .8], [1.05, .8]],
    4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
    5: [[0, 0], [-1.25, -1], [1.25, -1], [-1.25, 1], [1.25, 1]],
    6: [[-1.3, -1], [0, -1], [1.3, -1], [-1.3, 1], [0, 1], [1.3, 1]],
  };

  /** A polygon with patches of moss on it — sides to count, moss to count. */
  function stone(o) {
    const sides = o.sides, moss = o.moss, r = o.r || 34;
    const cx = o.cx || 45, cy = o.cy || 45;
    // even-sided shapes get a flat top and bottom so a square reads as a
    // square rather than a diamond; odd ones keep their point up
    const turn = sides % 2 === 0 ? Math.PI / sides : 0;
    const pts = [];
    for (let i = 0; i < sides; i++) {
      const a = (Math.PI * 2 / sides) * i - Math.PI / 2 + turn;
      pts.push(`${(cx + Math.cos(a) * r).toFixed(1)},${(cy + Math.sin(a) * r).toFixed(1)}`);
    }
    let b = `<polygon points="${pts.join(' ')}" fill="${INK.stone}" stroke="#4a565b" stroke-width="2.5" opacity=".94"/>`;
    // keep the whole cluster inside the shape's inscribed circle
    const inr = r * Math.cos(Math.PI / sides);
    const spread = inr * 0.46, rad = Math.max(3.4, inr * 0.26);
    (MOSS_AT[moss] || []).forEach(([dx, dy]) => {
      const mx = cx + dx * spread, my = cy + dy * spread;
      b += `<ellipse cx="${mx.toFixed(1)}" cy="${my.toFixed(1)}" rx="${rad.toFixed(1)}" ry="${(rad * .82).toFixed(1)}" fill="#4d7a45" opacity=".97"/>`;
      b += `<ellipse cx="${(mx + rad * .3).toFixed(1)}" cy="${(my - rad * .28).toFixed(1)}" rx="${(rad * .42).toFixed(1)}" ry="${(rad * .34).toFixed(1)}" fill="#7fb06c" opacity=".85"/>`;
    });
    return b;
  }

  /* ---------- documents ---------- */

  /** A run of cursive, for a signature you have to count rather than read. */
  function signature(x, y, seed, w = 92) {
    const r = (n) => ((Math.sin(seed * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
    let d = `M${x} ${y}`;
    let cx = x;
    for (let i = 0; i < 5; i++) {
      const dx = w / 5;
      const up = y - 6 - r(i) * 13, dn = y + 2 + r(i + 9) * 6;
      d += ` c ${dx * 0.3} ${up - y} ${dx * 0.7} ${dn - y} ${dx} 0`;
      cx += dx;
    }
    return `<path d="${d}" stroke="#2a2418" stroke-width="1.8" fill="none" stroke-linecap="round" opacity=".88"/>`;
  }

  /** A hand-drawn cross, for the people who could not sign. */
  function cross(x, y, s = 9) {
    return `<g stroke="#2a2418" stroke-width="2.4" stroke-linecap="round" opacity=".9">`
      + `<line x1="${x - s}" y1="${y - s}" x2="${x + s}" y2="${y + s}"/>`
      + `<line x1="${x + s}" y1="${y - s}" x2="${x - s}" y2="${y + s}"/></g>`;
  }

  /** A sheet of paper to put documents on. */
  function paper(o) {
    const { x, y, w, h } = o;
    return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="#cfc3a2" stroke="#9a8b68" stroke-width="2"/>`
      + `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="url(#figAge)" opacity=".25"/></g>`;
  }

  /** Paper-ageing gradient; include once per figure that uses paper(). */
  const defs = `<defs><radialGradient id="figAge" cx=".5" cy=".4" r=".75">`
    + `<stop offset=".55" stop-color="#cfc3a2" stop-opacity="0"/>`
    + `<stop offset="1" stop-color="#6b5a38" stop-opacity=".9"/></radialGradient></defs>`;

  const FIG = {
    INK, TYPE, esc, words, plate, defs,
    plank, post, level, water, sand,
    paintedMark, rose, board, tag, lamp,
    shelf, stone, signature, cross, paper,
  };

  if (typeof globalThis !== 'undefined') globalThis.FIG = FIG;
  if (typeof module !== 'undefined' && module.exports) module.exports = FIG;
})();
