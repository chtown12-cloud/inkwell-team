/* ============================================================
   ART — the drawing kit the rooms are built from.

   The puzzles in this game are things you look at and things you handle, so
   nearly everything a player needs is a drawing: a string of flags, a net of
   glass floats, a torn chart, a breaker board. This file is the shared kit
   those drawings are made from — one palette, one set of engraved glyphs, and
   the two wrappers that turn the same drawing into a close-up (ART.svg) or a
   prop standing in the room (ART.sprite).

   That last part matters. A clue you can only see once you have opened it is
   not something you can *find*. Every prop is drawn once and placed twice, so
   what is hanging on the mast in the wide shot is exactly what you count when
   you lean in.

   Glyphs are drawn in a 24x24 box with currentColor, so the same anchor can be
   brass on a lock, paint on a crate and a knife-cut in bark.
   ============================================================ */
(function () {

  /* One set of named colours for anything a player has to match by colour.
     They are spaced to survive a video call and the common kinds of colour
     blindness as far as six flat colours can: no red/green pair is ever the
     only thing telling two answers apart — see PUZZLES.md. */
  const COL = {
    red: '#cf4a3c', yellow: '#e6b93a', blue: '#3d7fd0', white: '#efe9da',
    green: '#4fa364', orange: '#de8a35', purple: '#8f66bd', black: '#24282c',
    pink: '#dc86a6', teal: '#35a79c', brown: '#7c5a3a', grey: '#8c969c',
  };
  const INK = {
    paper: '#d9cba6', paperDark: '#b9a57c', ink: '#3a2c1c', inkSoft: '#6d5637',
    wood: '#7a5f3c', woodDark: '#4a3823', woodLip: '#a58556',
    brass: '#c9a24a', brassDark: '#7d6126', iron: '#5a6a72', ironDark: '#2f3a40',
    steel: '#93a1a8', rope: '#b79a63', glass: '#bfe4ee', night: '#0b1418',
    sand: '#d8c39a', dim: '#8a9a95',
  };
  
  const esc = (s) => String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const col = (c) => COL[c] || c;

  /* Lettering on a prop is lettered by somebody: painted or engraved in the
     place's display face, written by hand, or typed. The faces themselves are
     the scenario's (CSS variables), so the same drawing code is letterpress
     on the wreck and stencil at the ice station. */
  const FACE = {
    display: 'var(--font-display)', body: 'var(--font-body)', label: 'var(--font-label)',
    hand: 'var(--font-hand)', typed: 'var(--font-type)', num: 'var(--font-num)',
  };
  /** A line of type, centred unless told otherwise. */
  function words(x, y, str, o = {}) {
    const rot = o.rot ? ` transform="rotate(${o.rot} ${x} ${y})"` : '';
    const ls = o.spacing ? ` letter-spacing="${o.spacing}"` : '';
    const op = o.opacity != null ? ` opacity="${o.opacity}"` : '';
    const wt = o.weight ? ` font-weight="${o.weight}"` : '';
    return `<text x="${x}" y="${y}" text-anchor="${o.anchor || 'middle'}" style="font-family:${FACE[o.face] || FACE.display}" `
      + `font-size="${o.size || 15}" fill="${o.fill || INK.ink}"${ls}${rot}${op}${wt}>${esc(str)}</text>`;
  }

  /* ---------- the two wrappers ---------- */

  /**
   * Ids inside a drawing belong to that copy of it. Every prop is placed at
   * least twice — in the close-up and standing in the room — and a clip or a
   * gradient that resolves into the other copy paints nothing at all the
   * moment that copy is hidden (a phone has no stage). So each placement
   * renames the ids it defines, and its own references to them.
   */
  let placed = 0;
  function scoped(body) {
    if (body.indexOf(' id="') < 0) return body;
    const own = new Set(); body.replace(/ id="([\w-]+)"/g, (m, id) => (own.add(id), m));
    const n = (++placed).toString(36);
    return body.replace(/ id="([\w-]+)"/g, (m, id) => ` id="${id}_${n}"`)
      .replace(/url\(#([\w-]+)\)/g, (m, id) => own.has(id) ? `url(#${id}_${n})` : m)
      .replace(/href="#([\w-]+)"/g, (m, id) => own.has(id) ? `href="#${id}_${n}"` : m);
  }

  /** A close-up: scales to whatever room the examine view gives it. */
  function svg(w, h, body) {
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" role="img">${scoped(body)}</svg>`;
  }
  /**
   * The same drawing standing in the room. `pos` is the object's hotspot box
   * in percent of the 1600x900 stage, so the art and the ring that marks it
   * can never drift apart.
   */
  function sprite(pos, w, h, body, o = {}) {
    const x = pos.x / 100 * 1600, y = pos.y / 100 * 900;
    const pw = pos.w / 100 * 1600, ph = pos.h / 100 * 900;
    const rot = o.rot ? ` transform="rotate(${o.rot} ${x + pw / 2} ${y + ph / 2})"` : '';
    return `<g${rot}${o.opacity != null ? ` opacity="${o.opacity}"` : ''}>`
      + `<svg x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${pw.toFixed(1)}" height="${ph.toFixed(1)}" `
      + `viewBox="0 0 ${w} ${h}" preserveAspectRatio="${o.par || 'xMidYMid meet'}" overflow="visible">${scoped(body)}</svg></g>`;
  }

  /**
   * One drawing set into another, at a place and a size. A nested <svg> would
   * do it too, but Chromium clips anything translucent inside one to the
   * wrong box as soon as the outer drawing is scaled down — on a phone, half
   * a chart's grid goes missing — so this is a plain scaled group, with a
   * clip only when it is asked for.
   */
  function inset(x, y, w, h, vw, vh, body, o = {}) {
    const sx = +(w / vw).toFixed(4), sy = +(h / vh).toFixed(4);
    const id = `ac${vw}x${vh}`.replace(/\./g, '_');
    return `<g transform="translate(${x} ${y}) scale(${sx} ${sy})">`
      + (o.clip ? `<clipPath id="${id}"><rect width="${vw}" height="${vh}"/></clipPath><g clip-path="url(#${id})">${body}</g>` : body) + `</g>`;
  }

  /* ---------- glyphs ----------
     S is a drawn line, F a filled shape, K a knocked-out detail (an eye, a
     rib) that shows the surface underneath through the glyph. */
  const S = (w = 1.9) => `fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"`;
  const F = `fill="currentColor"`;
  const K = `fill="#000" opacity=".5"`;
  const poly = (n, r, cx = 12, cy = 12, rot = -90, inner) => {
    const pts = [];
    const m = inner ? n * 2 : n;
    for (let i = 0; i < m; i++) {
      const a = (rot + i * 360 / m) * Math.PI / 180;
      const rr = inner && i % 2 ? inner : r;
      pts.push((cx + rr * Math.cos(a)).toFixed(2) + ',' + (cy + rr * Math.sin(a)).toFixed(2));
    }
    return pts.join(' ');
  };
  const rays = (n, r1, r2, w = 1.9) => Array.from({ length: n }, (_, i) => {
    const a = i * 2 * Math.PI / n;
    return `<line x1="${(12 + r1 * Math.cos(a)).toFixed(2)}" y1="${(12 + r1 * Math.sin(a)).toFixed(2)}" `
      + `x2="${(12 + r2 * Math.cos(a)).toFixed(2)}" y2="${(12 + r2 * Math.sin(a)).toFixed(2)}" ${S(w)}/>`;
  }).join('');

  const G = {
    /* --- sea --- */
    anchor: () => `<circle cx="12" cy="4.6" r="2.1" ${S()}/><path d="M12 6.7V20.6M8 10h8M4.4 13.8c.5 4.2 3.7 6.8 7.6 6.8s7.1-2.6 7.6-6.8" ${S()}/>`
      + `<path d="M4.4 13.8l-1.7 2.5M4.4 13.8l2.9.9M19.6 13.8l1.7 2.5M19.6 13.8l-2.9.9" ${S()}/>`,
    fish: () => `<path d="M2.6 12c3.2-4.8 9.4-5.8 13.6-1.3l4.6-3.3v9.2l-4.6-3.3C12 17.8 5.8 16.8 2.6 12z" ${F}/><circle cx="7.4" cy="11" r="1.1" ${K}/>`,
    star: () => `<polygon points="${poly(5, 9.6, 12, 12.6, -90, 4)}" ${F}/>`,
    shell: () => `<path d="M12 21c-1.3 0-2.2-.9-2.6-2.100C5.6 17.3 3 14 3 10.3 3 6.2 6.9 3 12 3s9 3.2 9 7.300c0 3.7-2.6 7-6.4 8.6-.4 1.2-1.3 2.1-2.6 2.100z" ${F}/>`
      + `<path d="M12 19.500V4.200M12 19.500L7 5.400M12 19.500L17 5.400M12 19.500L4.2 8.600M12 19.500L19.8 8.6" fill="none" stroke="#000" stroke-opacity=".38" stroke-width="1.1"/>`,
    wave: () => `<path d="M2 12.500c2.2-4.6 5.2-4.6 7.4 0s5.2 4.6 7.4 0c1.2-2.5 3-3.3 5.2-2.400M2 19c2.2-3.8 5.2-3.8 7.4 0s5.2 3.8 7.4 0c1.2-2 3-2.7 5.2-2" ${S(2.1)}/>`,
    wheel: () => `<circle cx="12" cy="12" r="6" ${S(2)}/><circle cx="12" cy="12" r="1.7" ${F}/>${rays(8, 2.6, 10.6, 1.7)}`,
    gull: () => `<path d="M2.2 13.600c2.8-4.8 6.4-5.2 9.8-.8 3.4-4.4 7-4 9.8.8" ${S(2.2)}/><circle cx="12" cy="14.6" r="1.5" ${F}/>`,
    compass: () => `<circle cx="12" cy="12" r="9.3" ${S(1.6)}/><path d="M12 4.200l2.6 7.8-2.6 7.8-2.6-7.800z" ${S(1.4)}/><path d="M12 4.200l2.6 7.800H9.400z" ${F}/>`,
    crab: () => `<ellipse cx="12" cy="14" rx="6.2" ry="4.3" ${F}/><path d="M6.6 11.200C4.6 9.8 3.8 8 4.3 6M17.4 11.200C19.4 9.8 20.2 8 19.7 6" ${S(1.8)}/>`
      + `<circle cx="4.3" cy="5" r="2" ${F}/><circle cx="19.7" cy="5" r="2" ${F}/><path d="M6.5 16.500L3.5 18.500M7.5 18L5.5 20.800M17.5 16.500l3 2M16.5 18l2 2.8" ${S(1.6)}/>`,
    lantern: () => `<path d="M9 3.500h6M10 3.500v2.200M14 3.500v2.2" ${S(1.7)}/><path d="M8 5.700h8l1.5 3v8.600l-1.5 3H8l-1.5-3V8.700z" ${S(1.8)}/><path d="M12 9.500c1.8 2.2 2.6 3.6 2.6 5a2.6 2.6 0 0 1-5.2 0c0-1.4.8-2.8 2.6-5z" ${F}/>`,
    /* --- sky --- */
    moon: () => `<path d="M16.6 3.400a9.2 9.2 0 1 0 4.2 12.800A7.6 7.6 0 0 1 16.6 3.400z" ${F}/>`,
    sun: () => `<circle cx="12" cy="12" r="4.4" ${F}/>${rays(8, 6.7, 9.8, 2)}`,
    sunrise: () => `<path d="M5.5 16a6.5 6.5 0 0 1 13 0z" ${F}/><path d="M2 19.500h20M12 3.500v3M4.6 7.800l2 2M19.4 7.800l-2 2" ${S(1.9)}/>`,
    comet: () => `<circle cx="16.5" cy="7.5" r="3.6" ${F}/><path d="M13.4 9.600L3 20M11.8 6.800L4.5 12.500M17.2 12.200L11 19.5" ${S(1.7)}/>`,
    planet: () => `<circle cx="12" cy="12" r="5.6" ${F}/><ellipse cx="12" cy="12" rx="10.3" ry="3.2" transform="rotate(-22 12 12)" ${S(1.6)}/>`,
    /* --- jungle --- */
    leaf: () => `<path d="M3.6 20.400C3.6 11 9.8 4.2 20.4 3.6 19.8 14.2 13 20.4 3.6 20.400z" ${F}/><path d="M4.6 19.400L15.5 8.500M9 15l.2-4.200M12.2 11.800l.2-4" fill="none" stroke="#000" stroke-opacity=".4" stroke-width="1.1" stroke-linecap="round"/>`,
    snake: () => `<path d="M4.5 19.200c7.4 1.7 9.8-2.6 6.2-5.600C7 10.5 9.6 5.4 16.6 6.2" ${S(2.7)}/><circle cx="18.3" cy="6.5" r="2.1" ${F}/>`,
    bird: () => `<path d="M3 15.800c0-4.2 3.4-7 7.5-7 1.1 0 2.1.2 3 .500a3.3 3.3 0 1 1 3.5 4.200c-.5 3.8-3.5 6.3-7.7 6.300H5.500L2.5 22z" ${F}/><path d="M19.8 9.200l2.6.9-2.5 1.100z" ${F}/><circle cx="16.8" cy="9.3" r=".8" ${K}/>`,
    frog: () => `<ellipse cx="12" cy="15.2" rx="8.8" ry="5.5" ${F}/><circle cx="7.4" cy="9.4" r="2.9" ${F}/><circle cx="16.6" cy="9.4" r="2.9" ${F}/><circle cx="7.4" cy="9.2" r="1.1" ${K}/><circle cx="16.6" cy="9.2" r="1.1" ${K}/>`,
    flower: () => Array.from({ length: 5 }, (_, i) => {
      const a = (-90 + i * 72) * Math.PI / 180;
      return `<circle cx="${(12 + 5.2 * Math.cos(a)).toFixed(2)}" cy="${(12 + 5.2 * Math.sin(a)).toFixed(2)}" r="3.5" ${F}/>`;
    }).join('') + `<circle cx="12" cy="12" r="2.3" ${K}/>`,
    beetle: () => `<ellipse cx="12" cy="14" rx="5.4" ry="6.6" ${F}/><circle cx="12" cy="6.2" r="2.6" ${F}/><path d="M12 8.500V20.5" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="1.2"/>`
      + `<path d="M6.8 11L3.2 9.500M6.6 14.500H2.800M7 18l-3.2 2M17.2 11l3.6-1.500M17.4 14.500h3.800M17 18l3.2 2" ${S(1.5)}/>`,
    mushroom: () => `<path d="M2.8 12.500C2.8 7.4 6.9 3.8 12 3.800s9.2 3.6 9.2 8.700z" ${F}/><path d="M9.4 12.500h5.200l1.1 8H8.300z" ${F} opacity=".78"/>`,
    cairn: () => `<ellipse cx="12" cy="18.2" rx="8" ry="3.3" ${F}/><ellipse cx="12" cy="12" rx="5.6" ry="2.9" ${F}/><ellipse cx="12" cy="6.6" rx="3.5" ry="2.4" ${F}/>`,
    vine: () => `<path d="M12 2.500c-5 3.2-5 6.3 0 9.500s5 6.3 0 9.5" ${S(2.1)}/><path d="M9 7.200C6.5 6.7 5 7.8 4.6 10c2.5.5 4-.6 4.4-2.800zM15 16.800c2.5.5 4-.6 4.4-2.8-2.5-.5-4 .6-4.4 2.800z" ${F}/>`,
    nest: () => `<path d="M2.8 12.500h18.400c0 4.6-3.9 7.8-9.2 7.800s-9.2-3.2-9.2-7.800z" ${F}/><ellipse cx="8.6" cy="10.4" rx="2.3" ry="3" ${F}/><ellipse cx="12.4" cy="9.8" rx="2.3" ry="3" ${F}/><ellipse cx="16" cy="10.6" rx="2.2" ry="2.8" ${F}/>`,
    branch: () => `<path d="M3 20.500L14 9.500M9 14.500V7.500M14 9.500l6.5-1M14 9.500l1-6" ${S(2.3)}/>`,
    paw: () => `<ellipse cx="12" cy="15.6" rx="5" ry="4.2" ${F}/><ellipse cx="5.8" cy="10.4" rx="2" ry="2.6" ${F}/><ellipse cx="10" cy="6.8" rx="2" ry="2.7" ${F}/><ellipse cx="14.6" cy="6.8" rx="2" ry="2.7" ${F}/><ellipse cx="18.4" cy="10.4" rx="2" ry="2.6" ${F}/>`,
    /* --- a radio hut --- */
    antenna: () => `<path d="M12 9.500V21M7.5 21h9M12 12.500l-3.6 8M12 12.500l3.6 8" ${S(1.8)}/><circle cx="12" cy="7.3" r="1.9" ${F}/><path d="M7.2 3.200a6.8 6.8 0 0 0 0 8.200M16.8 3.200a6.8 6.8 0 0 1 0 8.2" ${S(1.7)}/>`,
    radio: () => `<rect x="2.8" y="7.5" width="18.4" height="12.5" rx="1.8" ${S(1.8)}/><circle cx="8.3" cy="13.8" r="3.1" ${S(1.6)}/><path d="M14 11.500h4.600M14 14h4.600M14 16.500h4.600M6 7.500l9-4.5" ${S(1.6)}/>`,
    bulb: () => `<path d="M12 2.800a6.4 6.4 0 0 0-3.7 11.600c.7.6 1.1 1.2 1.1 2.100h5.200c0-.9.4-1.5 1.1-2.100A6.4 6.4 0 0 0 12 2.800z" ${F}/><path d="M9.6 18.700h4.800M10.3 21h3.4" ${S(1.8)}/>`,
    heater: () => `<rect x="3.5" y="5" width="17" height="13.5" rx="1.6" ${S(1.8)}/><path d="M7.2 8.200v7.100M10.4 8.200v7.100M13.6 8.200v7.100M16.8 8.200v7.100M6 18.500v2.500M18 18.500v2.5" ${S(1.8)}/>`,
    fan: () => `<circle cx="12" cy="12" r="1.9" ${F}/><path d="M12 10.100C10 7 10.8 3.6 13.6 2.800c1.4 2.8.7 5.6-1.6 7.300zM13.6 13C17.3 13.2 19.8 15.6 19.1 18.400c-3.1-.2-5.2-2.2-5.5-5.400zM10.4 13C8.6 16.2 5.2 17.2 3.2 15.100c1.7-2.6 4.5-3.4 7.2-2.100z" ${F}/>`,
    kettle: () => `<path d="M5.5 10h11l1.3 9.500H4.200z" ${F}/><path d="M16.5 12.200l4.3-3.200M8 10c0-3.6 6-3.6 6 0" ${S(1.9)}/><path d="M9.2 5.200h3.6" ${S(1.9)}/>`,
    pump: () => `<path d="M12 3.200c3.8 4.8 6.2 7.8 6.2 11.300a6.2 6.2 0 0 1-12.4 0c0-3.5 2.4-6.5 6.2-11.300z" ${S(1.8)}/><path d="M12 10.500v6.500M9.3 14.300L12 17l2.7-2.7" ${S(1.8)}/>`,
    hatch: () => `<rect x="3.5" y="3.5" width="17" height="17" rx="1.5" ${S(1.9)}/><circle cx="12" cy="12" r="3.6" ${S(1.9)}/><path d="M3.5 7.500h17" ${S(1.3)}/>`,
    /* --- hazards, for a ship --- */
    bolt: () => `<path d="M13.6 2L5 13.600h5.600L9.3 22 19 9.900h-6z" ${F}/>`,
    snowflake: () => `<path d="M12 2.500v19M3.8 7.200l16.4 9.600M20.2 7.200L3.8 16.8" ${S(1.8)}/><path d="M9.6 4.200L12 6.400l2.4-2.200M9.6 19.800L12 17.600l2.4 2.2" ${S(1.5)}/>`,
    droplet: () => `<path d="M12 2.800c3.8 4.8 6.3 7.9 6.3 11.400a6.3 6.3 0 0 1-12.6 0c0-3.5 2.5-6.6 6.3-11.400z" ${F}/>`,
    flame: () => `<path d="M12.6 2.200c.6 3.6 5.6 6 5.6 11.600a6.2 6.2 0 0 1-12.4 0c0-2.5 1.2-4 2.6-5.6.3 1.9 1.1 2.8 2.2 3.2-.6-3.6.3-6.8 2-9.200z" ${F}/>`,
    trefoil: () => [0, 120, 240].map(a => `<path d="M12 12L7.250 3.770A9.5 9.5 0 0 1 16.750 3.770z" transform="rotate(${a} 12 12)" ${F}/>`).join('') + `<circle cx="12" cy="12" r="2.3" fill="#000" opacity=".5"/><circle cx="12" cy="12" r="1.5" ${F}/>`,
    atom: () => `<circle cx="12" cy="12" r="1.9" ${F}/>` + [0, 60, 120].map(a => `<ellipse cx="12" cy="12" rx="9.8" ry="3.7" transform="rotate(${a} 12 12)" ${S(1.4)}/>`).join(''),
    /* --- a castle --- */
    key: () => `<circle cx="7" cy="12" r="4.2" ${S(2)}/><path d="M11.2 12H21M17 12v3.600M20.5 12v2.6" ${S(2.1)}/>`,
    crown: () => `<path d="M3.6 18.500l-1.2-10.5 5.2 4.300L12 4.600l4.4 7.7 5.2-4.3-1.2 10.500z" ${F}/>`,
    tower: () => `<path d="M6 21V9.500H4.500V4h3v2.400h2.600V4h3.800v2.400h2.600V4h3v5.500H18V21z" ${F}/><path d="M10.5 21v-4.300a1.5 1.5 0 0 1 3 0V21z" ${K}/>`,
    skull: () => `<path d="M12 2.800c-4.8 0-8.3 3.4-8.3 7.9 0 2.8 1.4 4.9 3.3 6.100v3.400h10v-3.400c1.9-1.2 3.3-3.3 3.3-6.1 0-4.5-3.5-7.9-8.3-7.900z" ${F}/><circle cx="8.6" cy="11" r="2.2" ${K}/><circle cx="15.4" cy="11" r="2.2" ${K}/><path d="M10 17.500v2.500M12 17.500v2.500M14 17.500v2.5" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1.1"/>`,
    raven: () => `<path d="M2.5 9.500l5-1.300c.9-2.7 3.2-4.4 6-4.4 3.8 0 6.5 3 6.5 7 0 1.7-.5 3.2-1.4 4.500l2.9 5.2-6-2.200c-1 .5-2.1.8-3.3.8-3.1 0-5.5-2-6.3-4.800L3 12.500l3.5-1.300z" ${F}/><circle cx="12.8" cy="8.4" r=".9" ${K}/>`,
    candle: () => `<rect x="9.2" y="10" width="5.6" height="11.2" rx=".8" ${F}/><path d="M12 2.600c1.6 2 2.3 3.2 2.3 4.400a2.3 2.3 0 0 1-4.6 0c0-1.2.7-2.4 2.3-4.400z" ${F}/>`,
    eye: () => `<path d="M2 12c2.7-4.4 6.1-6.6 10-6.600s7.3 2.2 10 6.600c-2.7 4.4-6.1 6.6-10 6.600S4.7 16.4 2 12z" ${S(1.8)}/><circle cx="12" cy="12" r="3.3" ${F}/>`,
    cross: () => `<path d="M9.8 2.500h4.400v5.800h5.300v4.400h-5.300v8.800H9.800v-8.800H4.500V8.300h5.300z" ${F}/>`,
    /* --- a train, a card table --- */
    heart: () => `<path d="M12 20.800C5.2 15.8 2.6 12.6 2.6 9A4.9 4.9 0 0 1 12 6.9 4.9 4.9 0 0 1 21.4 9c0 3.6-2.6 6.8-9.4 11.800z" ${F}/>`,
    spade: () => `<path d="M12 2.800c4.6 4.6 8.6 7.4 8.6 11a4.3 4.3 0 0 1-7.5 2.900c.2 1.7.8 3.1 2 4.500H8.900c1.2-1.4 1.8-2.8 2-4.500a4.3 4.3 0 0 1-7.5-2.900c0-3.6 4-6.4 8.6-11z" ${F}/>`,
    diamond: () => `<polygon points="12,2.5 19.6,12 12,21.5 4.4,12" ${F}/>`,
    club: () => `<circle cx="12" cy="7.3" r="4.1" ${F}/><circle cx="7.1" cy="13.6" r="4.1" ${F}/><circle cx="16.9" cy="13.6" r="4.1" ${F}/><path d="M12 12c.2 4.2.8 6.7 2.5 9.200h-5c1.7-2.5 2.3-5 2.5-9.200z" ${F}/>`,
    bell: () => `<path d="M12 2.800a1.6 1.6 0 0 1 1.6 1.600v.5c3 .9 4.9 3.4 4.9 6.700v4.200l1.9 2.400H3.600l1.9-2.400v-4.200c0-3.3 1.9-5.8 4.9-6.700v-.5A1.6 1.6 0 0 1 12 2.800z" ${F}/><circle cx="12" cy="20.3" r="1.7" ${F}/>`,
    hat: () => `<path d="M7 5h10l-.8 10.500H7.800z" ${F}/><ellipse cx="12" cy="17.5" rx="9.8" ry="2.7" ${F}/>`,
    /* --- ice --- */
    mountain: () => `<path d="M1.8 20.500L9 6.500l3.6 6 2.6-3.6 7 11.600z" ${F}/><path d="M9 6.500l-2 3.9 2 1 1.3-1.5 1.3 1.3.6-1.400z" fill="#fff" opacity=".7"/>`,
    penguin: () => `<path d="M12 2.500c3.3 0 5.2 2.5 5.2 6 0 1.2 2.3 4 2.3 6.200l-2.3-.9c-.2 4-2.2 6.7-5.2 6.700s-5-2.7-5.2-6.700l-2.3.900c0-2.2 2.3-5 2.3-6.2 0-3.5 1.9-6 5.2-6z" ${F}/><ellipse cx="12" cy="14" rx="2.9" ry="5" fill="#fff" opacity=".82"/><path d="M10.8 7.400h2.400L12 9.300z" fill="#000" opacity=".5"/>`,
    flag: () => `<path d="M5 21.500V2.8" ${S(2)}/><path d="M5 3.600h13.600l-3.3 4.3 3.3 4.300H5z" ${F}/>`,
    /* --- generally useful --- */
    arrowUp: () => `<path d="M12 20.500V4.500M5.5 10.800L12 4.300l6.5 6.5" ${S(2.5)}/>`,
    medic: () => `<path d="M9 3.500h6V9h5.500v6H15v5.500H9V15H3.500V9H9z" ${F}/>`,
    /* --- the chessboard (every piece stands on the same base) --- */
    pawn: () => `<circle cx="12" cy="6.6" r="3.300" ${F}/><path d="M9 10.400h6l-1 2.600c1.800 1.700 2.900 4 2.900 6.200H7.100c0-2.200 1.100-4.500 2.900-6.200z" ${F}/><rect x="5.500" y="19.300" width="13" height="2.700" rx="1" ${F}/>`,
    rook: () => `<path d="M6.400 3.200h2.700v2.300h1.800V3.200h2.200v2.300h1.800V3.200h2.700V8.400l-2 1.600v6.300l2 2.100v1H6.400v-1l2-2.100V10l-2-1.600z" ${F}/><rect x="5" y="19.300" width="14" height="2.700" rx="1" ${F}/>`,
    bishop: () => `<path d="M12 2.400c2.900 2.200 4.500 4.700 4.500 7.100 0 2-1.200 3.500-2.600 4.300l1.300 1.700H8.800l1.300-1.700c-1.400-.8-2.600-2.300-2.600-4.300 0-2.400 1.600-4.900 4.500-7.100z" ${F}/><path d="M13.800 5.300l-2.600 3.400" fill="none" stroke="#000" stroke-opacity=".5" stroke-width="1.300"/><path d="M8 15.500h8l1.900 3.800H6.100z" ${F}/><rect x="5.500" y="19.300" width="13" height="2.700" rx="1" ${F}/>`,
    knight: () => `<path d="M6.800 19.300c0-4.300 2.700-6.300 4.300-8.300-1.900.4-3.500 1.300-4.700 2.300L4.900 11.300c1.200-3.700 3.500-6.900 6.700-8.500l1 1.600c3.900.6 6.100 3.700 6.100 8.500v6.400z" ${F}/><circle cx="13.300" cy="7.300" r="1" fill="#000" fill-opacity=".55"/><rect x="5.500" y="19.300" width="13" height="2.700" rx="1" ${F}/>`,
    queen: () => `<circle cx="4.400" cy="5.900" r="1.700" ${F}/><circle cx="9" cy="4" r="1.700" ${F}/><circle cx="15" cy="4" r="1.700" ${F}/><circle cx="19.600" cy="5.900" r="1.700" ${F}/><path d="M4.400 7.500l2.700 9.200h9.800l2.700-9.200-4.300 4.300L15 5.400l-3 5.900-3-5.900-.3 6.400z" ${F}/><path d="M6.800 16.900h10.400l1.200 2.400H5.600z" ${F}/><rect x="5" y="19.300" width="14" height="2.700" rx="1" ${F}/>`,
    king: () => `<path d="M11 1.600h2v2h2v2h-2v2.200h-2V5.600H9v-2h2z" ${F}/><path d="M12 8.200c3.100 0 5.500 1.800 5.500 4.200 0 1.500-.8 2.700-1.800 3.500l.8 1.300H7.500l.8-1.300c-1-.8-1.800-2-1.800-3.500 0-2.400 2.400-4.200 5.500-4.200z" ${F}/><path d="M7 16.900h10l1.200 2.400H5.800z" ${F}/><rect x="5" y="19.300" width="14" height="2.700" rx="1" ${F}/>`,
    lift: () => `<rect x="4.200" y="2.800" width="15.600" height="18.400" rx="1.600" ${S(1.9)}/><path d="M12 17.200V7.600M8.300 11.200L12 7.400l3.700 3.800" ${S(2.2)}/>`,
    tick: () => `<path d="M4.5 12.800l4.8 4.800L19.8 6.6" ${S(2.9)}/>`,
    nope: () => `<path d="M5.5 5.500l13 13M18.5 5.500l-13 13" ${S(2.9)}/>`,
    circle: () => `<circle cx="12" cy="12" r="8.5" ${F}/>`,
    square: () => `<rect x="4" y="4" width="16" height="16" ${F}/>`,
    triangle: () => `<polygon points="12,3 21.5,20 2.5,20" ${F}/>`,
    hex: () => `<polygon points="${poly(6, 9.5, 12, 12, 0)}" ${F}/>`,
    ring: () => `<circle cx="12" cy="12" r="7.6" ${S(2.8)}/>`,
  };

  /** A glyph at (x,y), `size` across, in `color`. */
  function glyph(name, x = 0, y = 0, size = 24, color) {
    const g = G[name];
    if (!g) return '';
    return `<g transform="translate(${x} ${y}) scale(${(size / 24).toFixed(4)})"${color ? ` style="color:${col(color)}"` : ''}>${g()}</g>`;
  }
  /** A glyph as a little standalone svg, for a lock face or a tag. */
  function glyphSvg(name, color) {
    return `<svg viewBox="0 0 24 24" class="glyph"${color ? ` style="color:${col(color)}"` : ''} aria-label="${esc(name)}">${(G[name] || (() => ''))()}</svg>`;
  }

  /* ---------- small shared shapes ---------- */

  /** Aged paper, slightly out of square. */
  function paper(x, y, w, h, o = {}) {
    const r = o.rot ? ` transform="rotate(${o.rot} ${x + w / 2} ${y + h / 2})"` : '';
    return `<g${r}><rect x="${x + 3}" y="${y + 4}" width="${w}" height="${h}" fill="#000" opacity=".28"/>`
      + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${o.fill || INK.paper}"/>`
      + `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${INK.paperDark}" stroke-width="1.5" opacity=".7"/>`
      + (o.body || '') + `</g>`;
  }
  /** A drawn pin. */
  const pin = (x, y, c = '#a13a2e') => `<circle cx="${x}" cy="${y + 2}" r="5" fill="#000" opacity=".25"/><circle cx="${x}" cy="${y}" r="5" fill="${c}"/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.6" fill="#fff" opacity=".45"/>`;
  /** A clock face with its hands at h:m. Hours are 1-12. */
  function clockFace(cx, cy, r, h, m, o = {}) {
    const face = o.face || '#e6dcc0', ink = o.ink || INK.ink;
    let b = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${face}" stroke="${o.rim || INK.brassDark}" stroke-width="${Math.max(2, r * .09)}"/>`;
    for (let i = 0; i < 12; i++) {
      const a = i * Math.PI / 6, big = i % 3 === 0;
      const r1 = r * (big ? .78 : .84), r2 = r * .93;
      b += `<line x1="${(cx + r1 * Math.sin(a)).toFixed(1)}" y1="${(cy - r1 * Math.cos(a)).toFixed(1)}" x2="${(cx + r2 * Math.sin(a)).toFixed(1)}" y2="${(cy - r2 * Math.cos(a)).toFixed(1)}" stroke="${ink}" stroke-width="${big ? r * .06 : r * .03}" stroke-linecap="round"/>`;
    }
    if (o.numerals) {
      [12, 3, 6, 9].forEach((n, i) => {
        const a = i * Math.PI / 2;
        b += words(cx + r * .62 * Math.sin(a), cy - r * .62 * Math.cos(a) + r * .09, String(n), { size: r * .24, fill: ink });
      });
    }
    const ha = ((h % 12) + m / 60) * Math.PI / 6, ma = m * Math.PI / 30;
    b += `<line class="ck-h" x1="${cx}" y1="${cy}" x2="${(cx + r * .5 * Math.sin(ha)).toFixed(1)}" y2="${(cy - r * .5 * Math.cos(ha)).toFixed(1)}" stroke="${ink}" stroke-width="${r * .085}" stroke-linecap="round"/>`;
    b += `<line class="ck-m" x1="${cx}" y1="${cy}" x2="${(cx + r * .76 * Math.sin(ma)).toFixed(1)}" y2="${(cy - r * .76 * Math.cos(ma)).toFixed(1)}" stroke="${ink}" stroke-width="${r * .05}" stroke-linecap="round"/>`;
    b += `<circle cx="${cx}" cy="${cy}" r="${r * .07}" fill="${ink}"/>`;
    return b;
  }

  const ART = { COL, INK, FACE, esc, col, words, svg, sprite, inset, glyph, glyphSvg, glyphs: G, paper, pin, clockFace, poly };
  if (typeof globalThis !== 'undefined') globalThis.ART = ART;
  if (typeof module !== 'undefined' && module.exports) module.exports = ART;
})();
