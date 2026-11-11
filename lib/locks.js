/* ============================================================
   LOCKS — things you open with your hands.

   Nothing in here is typed. A lock is a drawn object with a face that shows
   the shape of its answer — four wheels ringed in four colours, seven empty
   slots on a compass pad, two clock hands, a row of levers — and you work it
   the way you would work the real thing. What goes on the wheels is never on
   the lock: it is somewhere else in the room (puzzle.from names where), and
   noticing that the two belong together is the puzzle.

     combo   wheels of digits, letters, colours or glyphs; one marker per wheel
     dirpad  compass presses into a fixed number of slots
     clock   two hands, set in five-minute steps
     toggle  levers on a row, or switches drawn into a figure (data-key)
     press   things pressed in order: buttons, or parts of a figure (data-key)
     tiles   a picture in pieces; tap two to swap them
     tune    a dial swept until the signal comes up out of the static

   Each widget keeps its working state for as long as the page lives, so a
   lock you walk away from is where you left it when you come back.

   The engine supplies: solvePuzzle, wrongAnswer, tone, sfxThud, sfxStatic,
   playMorse, S. This file only draws and listens.
   ============================================================ */
(function () {
  const $ = (id) => document.getElementById(id);
  const ST = {};
  const art = () => globalThis.ART;
  const esc = (s) => String(s).replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const beep = (f, d = 0.04, g = 0.07, type = 'square') => { try { tone(f, d, undefined, g, type); } catch (e) { /* no audio yet */ } };
  const thud = () => { try { sfxThud(); } catch (e) { /* no audio yet */ } };

  /* ---------- faces: what can be on a wheel, a key or a tag ---------- */
  function normFaces(f) {
    if (!f) f = '0123456789';
    if (typeof f === 'string') return f.split('').map(ch => ({ id: ch, label: ch }));
    if (f.colors) return f.colors.map(c => ({ id: c, color: c }));
    if (f.glyphs) return f.glyphs.map(g => ({ id: g, glyph: g }));
    return f.map(x => typeof x === 'string' ? { id: x, label: x } : x);
  }
  function faceHTML(f) {
    if (!f) return '';
    if (f.color) return `<span class="fc-color" style="background:${art().col(f.color)}"></span>`;
    if (f.glyph) return art().glyphSvg(f.glyph, f.tint);
    if (f.art) return f.art;
    return `<span class="fc-text">${esc(f.label != null ? f.label : f.id)}</span>`;
  }
  function markHTML(m) {
    if (!m) return `<span class="lk-mark none"></span>`;
    if (m.color) return `<span class="lk-mark band" style="background:${art().col(m.color)}"></span>`;
    if (m.glyph) return `<span class="lk-mark icon">${art().glyphSvg(m.glyph)}</span>`;
    return `<span class="lk-mark text">${esc(m.text || '')}</span>`;
  }
  /** An answer as a list of ids, however the scenario wrote it. */
  function asList(ans, faces) {
    if (Array.isArray(ans)) return ans.map(String);
    const s = String(ans == null ? '' : ans);
    if (s.includes(',')) return s.split(',').map(x => x.trim());
    if (faces && faces.some(f => String(f.id).length > 1)) return [s];
    return s.split('');
  }
  const same = (a, b) => a.length === b.length && a.every((x, i) => String(x) === String(b[i]));

  /* ---------- shared pieces ---------- */
  const fb = () => `<div class="feedback" id="feedback"></div>`;
  const tryBtn = (p, dflt) => `<button class="lk-try">${esc(p.tryLabel || dflt)}</button>`;
  function fail(o, root, msg) {
    wrongAnswer();
    const f = $('feedback');
    if (f) { f.className = 'feedback bad'; f.textContent = '✗ ' + (msg || o.puzzle.miss || 'It does not give.') + ' (+0:05 penalty)'; }
    const el = root.querySelector('.lk-shake') || root;
    el.classList.remove('shakein'); void el.offsetWidth; el.classList.add('shakein');
  }
  function state(o, init) { return ST[o.id] || (ST[o.id] = init()); }

  /* =========================================================
     combo — wheels
     ========================================================= */
  const combo = {
    faces(p, i) { const w = Array.isArray(p.wheels) ? (p.wheels[i] || {}) : {}; return normFaces(w.faces || p.faces); },
    count(p) { return Array.isArray(p.wheels) ? p.wheels.length : (p.wheels || asList(p.answer, normFaces(p.faces)).length); },
    html(o) {
      const p = o.puzzle, n = combo.count(p);
      const st = state(o, () => ({ at: Array.from({ length: n }, (_, i) => (p.start && p.start[i]) || 0) }));
      let w = '';
      for (let i = 0; i < n; i++) {
        const fs = combo.faces(p, i), mark = Array.isArray(p.wheels) ? (p.wheels[i] || {}).mark : null;
        const ring = mark && mark.color ? ` style="--ring:${art().col(mark.color)}"` : '';
        w += `<div class="lk-wheel${ring ? ' ringed' : ''}" data-w="${i}" data-v="${esc(fs[st.at[i]].id)}"${ring}>`
          + markHTML(mark)
          + `<button class="lk-step up" data-w="${i}" data-d="1" aria-label="next">▲</button>`
          + `<button class="lk-face" data-w="${i}" data-d="1">${faceHTML(fs[st.at[i]])}</button>`
          + `<button class="lk-step dn" data-w="${i}" data-d="-1" aria-label="previous">▼</button></div>`;
      }
      return `<div class="lock">${p.plate ? `<div class="lk-plate">${p.plate}</div>` : ''}`
        + `<div class="lk-combo lk-shake ${esc(p.skin || 'padlock')}">${w}</div>`
        + tryBtn(p, 'PULL IT OPEN') + fb() + `</div>`;
    },
    init(o, root) {
      const p = o.puzzle, st = ST[o.id];
      root.querySelectorAll('.lk-step,.lk-face').forEach(b => {
        b.onclick = () => {
          const i = +b.dataset.w, fs = combo.faces(p, i);
          st.at[i] = (st.at[i] + (+b.dataset.d) + fs.length) % fs.length;
          const wheel = root.querySelector(`.lk-wheel[data-w="${i}"]`);
          wheel.dataset.v = fs[st.at[i]].id;
          const face = wheel.querySelector('.lk-face');
          face.innerHTML = faceHTML(fs[st.at[i]]);
          face.classList.remove('tick'); void face.offsetWidth; face.classList.add('tick');
          beep(380 + st.at[i] * 14);
        };
      });
      root.querySelector('.lk-try').onclick = () => {
        const n = combo.count(p);
        const got = Array.from({ length: n }, (_, i) => combo.faces(p, i)[st.at[i]].id);
        if (same(got, asList(p.answer, combo.faces(p, 0)))) return solvePuzzle(o);
        fail(o, root);
      };
    },
  };

  /* =========================================================
     dirpad — a compass you press
     ========================================================= */
  const DIRS = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
  const arrow = (d) => `<svg viewBox="0 0 24 24" class="glyph" style="transform:rotate(${{ N: 0, E: 90, S: 180, W: 270 }[d]}deg)">${art().glyphs.arrowUp()}</svg>`;
  const dirpad = {
    html(o) {
      const p = o.puzzle, n = p.slots || asList(p.answer).length;
      const st = state(o, () => ({ seq: [] }));
      const lab = p.labels === false ? {} : (p.labels || { N: 'N', E: 'E', S: 'S', W: 'W' });
      const slots = Array.from({ length: n }, (_, i) => `<i class="${st.seq[i] ? 'set' : ''}">${st.seq[i] ? arrow(st.seq[i]) : ''}</i>`).join('');
      const btn = (d) => `<button class="lk-d d-${d.toLowerCase()}" data-dir="${d}">${arrow(d)}${lab[d] ? `<b>${esc(lab[d])}</b>` : ''}</button>`;
      return `<div class="lock"><div class="lk-slots" id="lk-slots">${slots}</div>`
        + `<div class="lk-dir lk-shake ${esc(p.skin || 'binnacle')}">${btn('N')}${btn('W')}<span class="lk-hub"></span>${btn('E')}${btn('S')}</div>`
        + `<button class="lk-clear">start again</button>` + fb() + `</div>`;
    },
    init(o, root) {
      const p = o.puzzle, st = ST[o.id], n = p.slots || asList(p.answer).length;
      const paint = () => {
        root.querySelectorAll('#lk-slots i').forEach((el, i) => {
          el.className = st.seq[i] ? 'set' : ''; el.innerHTML = st.seq[i] ? arrow(st.seq[i]) : '';
        });
      };
      root.querySelectorAll('.lk-d').forEach(b => {
        b.onclick = () => {
          if (st.seq.length >= n || st.busy) return;
          st.seq.push(b.dataset.dir); beep(300 + 'NESW'.indexOf(b.dataset.dir) * 70, 0.06);
          paint();
          if (st.seq.length < n) return;
          if (same(st.seq, asList(p.answer))) return solvePuzzle(o);
          st.busy = true; fail(o, root);
          setTimeout(() => { st.seq = []; st.busy = false; paint(); }, 650);
        };
      });
      root.querySelector('.lk-clear').onclick = () => { st.seq = []; paint(); thud(); };
    },
  };

  /* =========================================================
     clock — two hands
     ========================================================= */
  const clock = {
    face(st, p) {
      const o = p.face || {};
      return art().svg(260, 260, art().clockFace(130, 130, 116, st.h, st.m, { numerals: true, face: o.face, ink: o.ink, rim: o.rim }));
    },
    html(o) {
      const p = o.puzzle;
      const st = state(o, () => ({ h: (p.start && p.start.h) || 12, m: (p.start && p.start.m) || 0 }));
      const b = (k, t) => `<button class="ck-btn" data-k="${k}">${t}</button>`;
      return `<div class="lock"><div class="lk-clock lk-shake" id="lk-clock" data-h="${st.h}" data-m="${st.m}">${clock.face(st, p)}</div>`
        + `<div class="ck-row"><span class="ck-set">${b('h-', '◀')}<em>hour hand</em>${b('h+', '▶')}</span>`
        + `<span class="ck-set">${b('m-', '◀')}<em>minute hand</em>${b('m+', '▶')}</span></div>`
        + tryBtn(p, 'TRY THE HANDLE') + fb() + `</div>`;
    },
    init(o, root) {
      const p = o.puzzle, st = ST[o.id], step = p.step || 5;
      root.querySelectorAll('.ck-btn').forEach(b => {
        b.onclick = () => {
          const k = b.dataset.k;
          if (k === 'h+') st.h = st.h % 12 + 1;
          if (k === 'h-') st.h = (st.h + 10) % 12 + 1;
          if (k === 'm+') st.m = (st.m + step) % 60;
          if (k === 'm-') st.m = (st.m - step + 60) % 60;
          const c = $('lk-clock'); c.innerHTML = clock.face(st, p); c.dataset.h = st.h; c.dataset.m = st.m;
          beep(k[0] === 'h' ? 300 : 520, 0.03);
        };
      });
      root.querySelector('.lk-try').onclick = () => {
        const got = st.h + ':' + String(st.m).padStart(2, '0');
        if (got === String(p.answer)) return solvePuzzle(o);
        fail(o, root);
      };
    },
  };

  /* =========================================================
     toggle — switches, on a row or drawn into a figure
     ========================================================= */
  const toggle = {
    html(o) {
      const p = o.puzzle;
      const st = state(o, () => ({ on: new Set(p.start || []) }));
      let body;
      if (p.figure) body = `<div class="lock-fig lk-shake" id="lock-fig">${p.figure}</div>`;
      else {
        body = `<div class="lk-levers lk-shake ${esc(p.skin || '')}">` + normFaces(p.keys).map(k =>
          `<button class="lk-lever${st.on.has(String(k.id)) ? ' on' : ''}" data-key="${esc(k.id)}">`
          + `<span class="lv-slot"><i class="lv-knob"></i></span><span class="lv-cap">${faceHTML(k)}</span></button>`).join('') + `</div>`;
      }
      return `<div class="lock">${p.plate ? `<div class="lk-plate">${p.plate}</div>` : ''}${body}`
        + tryBtn(p, 'THROW THE MAIN') + fb() + `</div>`;
    },
    init(o, root) {
      const p = o.puzzle, st = ST[o.id];
      const paint = () => root.querySelectorAll('[data-key]').forEach(el => {
        const on = st.on.has(el.dataset.key);
        el.classList.toggle('on', on);
        if (on) el.setAttribute('data-on', '1'); else el.removeAttribute('data-on');
      });
      root.querySelectorAll('[data-key]').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          const k = el.dataset.key;
          if (st.on.has(k)) st.on.delete(k); else st.on.add(k);
          beep(st.on.has(k) ? 520 : 300, 0.05); paint();
        });
      });
      paint();
      root.querySelector('.lk-try').onclick = () => {
        const want = asList(p.answer).map(String).sort(), got = [...st.on].map(String).sort();
        if (same(got, want)) return solvePuzzle(o);
        fail(o, root);
      };
    },
  };

  /* =========================================================
     press — things pressed in order
     ========================================================= */
  const press = {
    html(o) {
      const p = o.puzzle, n = p.slots || asList(p.answer).length;
      const st = state(o, () => ({ seq: [] }));
      const echo = (k) => (p.echo && p.echo[k] != null) ? esc(p.echo[k]) : '';
      const slots = Array.from({ length: n }, (_, i) => `<i class="${st.seq[i] ? 'set' : ''}">${st.seq[i] ? echo(st.seq[i]) : ''}</i>`).join('');
      let body;
      if (p.figure) body = `<div class="lock-fig lk-shake" id="lock-fig">${p.figure}</div>`;
      else {
        body = `<div class="lk-keys lk-shake ${esc(p.skin || '')}">` + normFaces(p.keys).map(k =>
          `<button class="lk-key" data-key="${esc(k.id)}">${faceHTML(k)}${k.cap ? `<small>${esc(k.cap)}</small>` : ''}</button>`).join('') + `</div>`;
      }
      return `<div class="lock">${p.plate ? `<div class="lk-plate">${p.plate}</div>` : ''}`
        + (p.slotsFirst === false ? '' : `<div class="lk-slots pips" id="lk-slots">${slots}</div>`) + body
        + (p.slotsFirst === false ? `<div class="lk-slots pips" id="lk-slots">${slots}</div>` : '')
        + `<button class="lk-clear">start again</button>` + fb() + `</div>`;
    },
    init(o, root) {
      const p = o.puzzle, st = ST[o.id], n = p.slots || asList(p.answer).length;
      const echo = (k) => (p.echo && p.echo[k] != null) ? esc(p.echo[k]) : '';
      const paint = () => {
        root.querySelectorAll('#lk-slots i').forEach((el, i) => {
          el.className = st.seq[i] ? 'set' : ''; el.innerHTML = st.seq[i] ? echo(st.seq[i]) : '';
        });
        root.querySelectorAll('[data-key]').forEach(el => {
          const at = st.seq.indexOf(el.dataset.key);
          el.classList.toggle('hit', !p.repeat && at >= 0);
        });
      };
      root.querySelectorAll('[data-key]').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => {
          if (st.busy || st.seq.length >= n) return;
          const k = el.dataset.key;
          if (!p.repeat && st.seq.includes(k)) return;       // a stone is stepped on once
          st.seq.push(k); beep(330 + (st.seq.length * 40), 0.07, 0.08, 'triangle');
          if (p.onPress) { try { p.onPress(k); } catch (e) { /* cosmetic */ } }
          paint();
          if (st.seq.length < n) return;
          if (same(st.seq, asList(p.answer))) return solvePuzzle(o);
          st.busy = true; fail(o, root);
          setTimeout(() => { st.seq = []; st.busy = false; paint(); }, 700);
        });
      });
      paint();
      root.querySelector('.lk-clear').onclick = () => { st.seq = []; paint(); thud(); };
    },
  };

  /* =========================================================
     tiles — a picture in pieces
     ========================================================= */
  const tiles = {
    pieces(p) {
      if (p.pieces) return p.pieces;
      const tw = p.picture.w / p.cols, th = p.picture.h / p.rows, out = [];
      for (let r = 0; r < p.rows; r++) for (let c = 0; c < p.cols; c++) {
        out.push({ id: String(r * p.cols + c), w: tw, h: th, vb: `${c * tw} ${r * th} ${tw} ${th}`, body: p.picture.body });
      }
      return out;
    },
    want(p) { return p.answer ? asList(p.answer) : tiles.pieces(p).map(x => String(x.id)); },
    tile(pc) {
      return `<svg viewBox="${pc.vb || `0 0 ${pc.w} ${pc.h}`}" preserveAspectRatio="xMidYMid meet">${pc.body}</svg>`;
    },
    html(o) {
      const p = o.puzzle, pcs = tiles.pieces(p);
      const st = state(o, () => ({ at: (p.start || pcs.map(x => x.id)).map(String), pick: -1 }));
      const by = Object.fromEntries(pcs.map(x => [String(x.id), x]));
      const cols = p.cols || pcs.length;
      return `<div class="lock"><div class="lk-tiles lk-shake ${esc(p.skin || '')}" id="lk-tiles" style="--cols:${cols};--ar:${pcs[0].w}/${pcs[0].h}">`
        + st.at.map((id, i) => `<button class="lk-tile" data-slot="${i}" data-piece="${esc(id)}">${tiles.tile(by[id])}</button>`).join('')
        + `</div>` + fb() + `</div>`;
    },
    init(o, root) {
      const p = o.puzzle, st = ST[o.id], pcs = tiles.pieces(p);
      const by = Object.fromEntries(pcs.map(x => [String(x.id), x]));
      const grid = $('lk-tiles');
      const paint = (i) => {
        const b = grid.querySelector(`.lk-tile[data-slot="${i}"]`);
        b.dataset.piece = st.at[i]; b.innerHTML = tiles.tile(by[st.at[i]]);
        b.classList.toggle('picked', st.pick === i);
      };
      grid.querySelectorAll('.lk-tile').forEach(b => {
        b.onclick = () => {
          const i = +b.dataset.slot;
          if (st.done) return;
          if (st.pick < 0) { st.pick = i; paint(i); beep(440, 0.03); return; }
          const j = st.pick; st.pick = -1;
          if (i !== j) { const t = st.at[i]; st.at[i] = st.at[j]; st.at[j] = t; thud(); }
          paint(i); paint(j);
          if (same(st.at, tiles.want(p))) {
            st.done = true; grid.classList.add('whole');
            setTimeout(() => solvePuzzle(o), 520);
          }
        };
      });
    },
  };

  /* =========================================================
     tune — a dial swept through static
     ========================================================= */
  const tune = {
    html(o) {
      const p = o.puzzle;
      const st = state(o, () => ({ v: p.start != null ? p.start : p.min }));
      const fx = (v) => Number(v).toFixed(p.step && p.step < 1 ? 1 : 0);
      return `<div class="lock"><div class="lk-tune lk-shake">`
        + `<div class="tn-read"><span id="tn-val">${fx(st.v)}</span><small>${esc(p.unit || '')}</small></div>`
        + `<div class="tn-meter" id="tn-meter">${'<i></i>'.repeat(14)}</div>`
        + `<input type="range" id="tune-slider" min="${p.min}" max="${p.max}" step="${p.step || 0.1}" value="${st.v}">`
        + `<div class="tn-scale"><span>${p.min}</span><span>${p.max}</span></div>`
        + `</div>` + fb() + `</div>`;
    },
    init(o, root) {
      const p = o.puzzle, st = ST[o.id], sl = $('tune-slider');
      const fx = (v) => Number(v).toFixed(p.step && p.step < 1 ? 1 : 0);
      const reach = (p.max - p.min) * (p.reach || 0.16);
      let hold = null, last = 0;
      const paint = () => {
        const d = Math.abs(st.v - p.at), c = Math.max(0, 1 - d / reach);
        $('tn-val').textContent = fx(st.v);
        const lit = d <= (p.tol || 0.2) ? 14 : Math.round(c * 12);
        $('tn-meter').querySelectorAll('i').forEach((el, i) => el.classList.toggle('on', i < lit));
        $('tn-meter').classList.toggle('peak', lit === 14);
        const now = Date.now();
        if (now - last > 110) { last = now; try { sfxStatic(0.10, 0.02 + 0.07 * (1 - c)); } catch (e) { /* no audio */ } if (c > 0.55) beep(640, 0.05, 0.03 + 0.05 * c, 'sine'); }
        clearTimeout(hold);
        if (d <= (p.tol || 0.2)) hold = setTimeout(() => { if (Math.abs(st.v - p.at) <= (p.tol || 0.2)) solvePuzzle(o); }, p.settle || 800);
      };
      sl.addEventListener('input', () => { st.v = +sl.value; paint(); });
      paint();
    },
  };

  /* =========================================================
     tools — what a clue lets you do to it
     ========================================================= */
  let uid = 0;
  /**
   * Darkness with a pool of light in it. With the light, whatever is painted
   * in `hidden` shows inside the pool and nowhere else. Without it (`lit`
   * false) the drawing is simply dark.
   */
  function lensify(svgHtml, lens, lit) {
    const m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(svgHtml);
    if (!m) return svgHtml;
    const w = +m[1], h = +m[2], r = lens.r || Math.round(Math.min(w, h) * 0.2), id = 'ln' + (++uid);
    const dark = lens.dark == null ? 0.62 : lens.dark;
    let add = `<defs><clipPath id="${id}c"><circle class="lens-c" cx="-999" cy="-999" r="${r}"/></clipPath>`
      + `<radialGradient id="${id}g"><stop offset=".62" stop-color="#000"/><stop offset="1" stop-color="#fff"/></radialGradient>`
      + `<mask id="${id}m"><rect x="0" y="0" width="${w}" height="${h}" fill="#fff"/><circle class="lens-c" cx="-999" cy="-999" r="${r}" fill="url(#${id}g)"/></mask></defs>`;
    add += `<rect x="0" y="0" width="${w}" height="${h}" fill="${lens.shade || '#02070b'}" opacity="${dark}"${lit ? ` mask="url(#${id}m)"` : ''} pointer-events="none"/>`;
    if (lit) {
      add += `<g clip-path="url(#${id}c)" pointer-events="none" class="lens-hid">${lens.hidden || ''}</g>`
        + `<circle class="lens-c" cx="-999" cy="-999" r="${r}" fill="${lens.tint || '#8fd0ff'}" opacity=".10" pointer-events="none"/>`
        + `<circle class="lens-c" cx="-999" cy="-999" r="${r}" fill="none" stroke="${lens.tint || '#8fd0ff'}" stroke-opacity=".5" stroke-width="2" pointer-events="none"/>`;
    }
    return svgHtml.replace(/<\/svg>\s*$/, add + '</svg>').replace('<svg ', `<svg data-lens="${lit ? 1 : 0}" `);
  }
  function wireLens(root) {
    root.querySelectorAll('svg[data-lens="1"]').forEach(svg => {
      svg.style.touchAction = 'none';
      const move = (ev) => {
        const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        const m = svg.getScreenCTM(); if (!m) return;
        const q = pt.matrixTransform(m.inverse());
        svg.querySelectorAll('.lens-c').forEach(c => { c.setAttribute('cx', q.x.toFixed(1)); c.setAttribute('cy', q.y.toFixed(1)); });
      };
      svg.addEventListener('pointermove', move); svg.addEventListener('pointerdown', move);
    });
  }
  const solvedNow = (id) => !id || (typeof S !== 'undefined' && S.solved.has(id));

  /** A clue: its drawing, plus whatever it lets you do. */
  function clue(o) {
    let fig = o.figure || '';
    const t = o.tool;
    if (o.lens) fig = lensify(fig, o.lens, solvedNow(o.lens.needs));
    let extra = '';
    if (t && t.type === 'turn' && solvedNow(t.needs)) {
      const st = state(o, () => ({ k: t.start || 0 }));
      fig = fig.replace(/<\/svg>\s*$/, `<g id="turn-card" transform="rotate(${st.k * 90} ${t.cx} ${t.cy})">${t.overlay}</g></svg>`);
      extra = `<div class="tool-row"><button class="tool-btn" data-turn="-1">⟲ turn it</button><button class="tool-btn" data-turn="1">turn it ⟳</button></div>`;
    }
    if (t && t.type === 'flip') {
      const st = state(o, () => ({ side: 0 }));
      if (st.side) fig = t.back;
      extra = `<div class="tool-row"><button class="tool-btn" data-flip="1">turn it over</button></div>`;
    }
    if (t && t.type === 'listen') {
      extra = `<div class="tool-row"><button class="tool-btn" data-listen="${esc(t.morse)}">▶ play it</button></div>`;
    }
    return (fig ? `<figure class="obj-fig">${fig}</figure>` : '') + extra;
  }
  function wireClue(o, root, reopen) {
    wireLens(root);
    const t = o.tool;
    root.querySelectorAll('[data-turn]').forEach(b => {
      b.onclick = () => {
        const st = ST[o.id]; st.k = (st.k + (+b.dataset.turn) + 4) % 4;
        const g = $('turn-card'); if (g) g.setAttribute('transform', `rotate(${st.k * 90} ${t.cx} ${t.cy})`);
        thud();
      };
    });
    root.querySelectorAll('[data-flip]').forEach(b => { b.onclick = () => { ST[o.id].side ^= 1; thud(); reopen(); }; });
    root.querySelectorAll('[data-listen]').forEach(b => { b.onclick = () => { try { playMorse(b.dataset.listen); } catch (e) { /* no audio */ } }; });
  }

  /** What was in the box, once it is open. */
  function inside(o) {
    const ins = o.puzzle && o.puzzle.inside;
    if (!ins) return '';
    const fake = { id: o.id + ':in', figure: ins.figure, tool: ins.tool, lens: ins.lens };
    return `<div class="inside">${ins.name ? `<div class="inside-name">${esc(ins.name)}</div>` : ''}${clue(fake)}</div>`;
  }
  function wireInside(o, root, reopen) {
    const ins = o.puzzle && o.puzzle.inside; if (!ins) return;
    wireClue({ id: o.id + ':in', tool: ins.tool }, root, reopen);
  }

  /* ---------- the public face ---------- */
  const TYPES = { combo, dirpad, clock, toggle, press, tiles, tune };
  const LOCKS = {
    has: (t) => !!TYPES[t],
    render(o) {
      let h = TYPES[o.puzzle.type].html(o);
      const p = o.puzzle;
      // a lock drawn as a figure can still be standing in the dark
      if (p.lens && p.figure) h = h.replace(p.figure, lensify(p.figure, p.lens, solvedNow(p.lens.needs)));
      return h;
    },
    init(o) {
      const root = document.querySelector('#modal .lock'); if (!root) return;
      TYPES[o.puzzle.type].init(o, root);
      wireLens(root);
    },
    clue, wireClue, inside, wireInside, lensify, faceHTML, normFaces, asList,
    /** For tests and for a clean slate between games. */
    reset() { Object.keys(ST).forEach(k => delete ST[k]); },
    _state: ST,
  };
  if (typeof globalThis !== 'undefined') globalThis.LOCKS = LOCKS;
  if (typeof module !== 'undefined' && module.exports) module.exports = LOCKS;
})();
