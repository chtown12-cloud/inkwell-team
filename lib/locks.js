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
     levels  rods, slides or tanks, each set to a height
     keypad  a number pad: key it in, press the tick
     hold    press and hold until the gauge is where it should be, then let go

   And what a clue can let you do to it: a lantern or a glass to hold over it
   (lens: hidden, or zoom), a card or a wheel to turn, something to play — a
   message, or a tune — and something to stand and watch.

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
    if (m.bar) {     // a rising row of bars with one of them solid: which place this wheel takes in an order
      const of = m.of || 5; let b = '';
      for (let i = 1; i <= of; i++) {
        const h = 4 + 18 * i / of;
        b += `<rect x="${(i - 1) * 9 + 1}" y="${(24 - h).toFixed(1)}" width="6.5" height="${h.toFixed(1)}" rx="1.5" fill="currentColor" opacity="${i === m.bar ? 1 : .26}"/>`;
      }
      return `<span class="lk-mark bars"><svg viewBox="0 0 ${of * 9} 25">${b}</svg></span>`;
    }
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
    if (f) { f.className = 'feedback bad'; f.textContent = '✗ ' + (msg || (typeof o.puzzle.miss === 'string' && o.puzzle.miss) || 'It does not give.') + ' (+0:05 penalty)'; }
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
        if (clock.opens(p, got)) return solvePuzzle(o);
        fail(o, root, typeof p.miss === 'function' ? p.miss(st.h, st.m) : undefined);
      };
    },
    /** One time opens it — or, with `window:[from,to]`, any time from one to the other. */
    opens(p, got) {
      const mins = t => { const [h, m] = String(t).split(':').map(Number); return (h % 12) * 60 + m; };
      if (!p.window) return got === String(p.answer);
      return mins(got) >= mins(p.window[0]) && mins(got) <= mins(p.window[1]);
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
      const paint = () => {
        root.querySelectorAll('[data-key]').forEach(el => {
          const on = st.on.has(el.dataset.key);
          el.classList.toggle('on', on);
          if (on) el.setAttribute('data-on', '1'); else el.removeAttribute('data-on');
        });
        // a drawing can answer back: lines that take a colour, a needle that moves
        if (p.onChange) { try { p.onChange([...st.on], root); } catch (e) { /* cosmetic */ } }
      };
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
      // a coloured key leaves its colour in the place it filled, so a run can be checked against what was seen
      const tint = Object.fromEntries((p.keys ? normFaces(p.keys) : []).filter(k => k.color).map(k => [String(k.id), art().col(k.color)]));
      const paint = () => {
        root.querySelectorAll('#lk-slots i').forEach((el, i) => {
          el.className = st.seq[i] ? 'set' : ''; el.innerHTML = st.seq[i] ? echo(st.seq[i]) : '';
          el.style.background = st.seq[i] && tint[st.seq[i]] ? tint[st.seq[i]] : '';
        });
        root.querySelectorAll('[data-key]').forEach(el => {
          const at = st.seq.indexOf(el.dataset.key);
          el.classList.toggle('hit', !p.repeat && at >= 0);
        });
        if (p.trail) drawTrail(root, st.seq);
      };
      root.querySelectorAll('[data-key]').forEach(el => {
        el.style.cursor = 'pointer';
        el.addEventListener('click', (ev) => {
          if (st.busy || st.seq.length >= n) return;
          if (!inTheLight(el, ev)) return;                    // that touch was only looking
          const k = el.dataset.key;
          if (!p.repeat && st.seq.includes(k)) return;       // a stone is stepped on once
          st.seq.push(k);
          // an organ sounds the pipe you pressed; anything else just clicks a little higher each time
          if (p.tones && p.tones[k]) beep(p.tones[k], 0.34, 0.09, 'triangle'); else beep(330 + (st.seq.length * 40), 0.07, 0.08, 'triangle');
          if (p.figure) { el.classList.add('flash'); setTimeout(() => el.classList.remove('flash'), 260); }   // the thing you pressed answers
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

  /**
   * The line a finger leaves on a pattern lock: through everything pressed so
   * far, in order. Each pressable thing says where its middle is (data-x,
   * data-y, in the drawing's own units), so no transform has to be undone.
   */
  function drawTrail(root, seq) {
    const svg = root.querySelector('.lock-fig svg'); if (!svg) return;
    let line = svg.querySelector('.lk-trail');
    if (!line) {
      line = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      line.setAttribute('class', 'lk-trail'); line.setAttribute('pointer-events', 'none');
      svg.appendChild(line);
    }
    line.setAttribute('points', seq.map(k => {
      const el = svg.querySelector(`[data-key="${k}"]`);
      return el ? `${el.dataset.x},${el.dataset.y}` : '';
    }).join(' '));
  }

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
      const cols = p.cols || pcs.length, rows = Math.ceil(pcs.length / cols);
      // how wide the whole picture is for its height, so the grid can be sized by the room it has
      const whole = ((cols * pcs[0].w) / (rows * pcs[0].h)).toFixed(3);
      return `<div class="lock">${p.plate ? `<div class="lk-plate">${p.plate}</div>` : ''}<div class="lk-tiles lk-shake ${esc(p.skin || '')}" id="lk-tiles" style="--cols:${cols};--ar:${pcs[0].w}/${pcs[0].h};--whole:${whole}">`
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
     levels — rods, slides, tanks: each one set to a height
     ========================================================= */
  const levels = {
    cols(p) { return Array.isArray(p.cols) ? p.cols : Array.from({ length: p.cols || asList(p.answer).length }, () => ({})); },
    html(o) {
      const p = o.puzzle, cols = levels.cols(p), max = p.max || 5;
      const st = state(o, () => ({ at: cols.map((_, i) => (p.start && p.start[i]) || 0) }));
      const col = (c, i) => {
        let cells = '';
        for (let l = max; l >= 1; l--) cells += `<button class="lk-cell${st.at[i] >= l ? ' on' : ''}" data-c="${i}" data-l="${l}" aria-label="level ${l}"></button>`;
        const tint = c.mark && c.mark.color ? ` style="--tint:${art().col(c.mark.color)}"` : '';
        return `<div class="lk-col" data-c="${i}" data-v="${st.at[i]}"${tint}>${markHTML(c.mark)}<div class="lk-track">${cells}</div>`
          + `<button class="lk-cell base" data-c="${i}" data-l="0" aria-label="empty"></button></div>`;
      };
      const scale = p.scale === false ? '' : `<div class="lk-scale">${Array.from({ length: max }, (_, k) => `<i>${max - k}</i>`).join('')}</div>`;
      return `<div class="lock">${p.plate ? `<div class="lk-plate">${p.plate}</div>` : ''}`
        + `<div class="lk-levels lk-shake ${esc(p.skin || 'rods')}">${scale}${cols.map(col).join('')}</div>`
        + tryBtn(p, 'SET IT') + fb() + `</div>`;
    },
    init(o, root) {
      const p = o.puzzle, st = ST[o.id];
      const paint = (i) => {
        const col = root.querySelector(`.lk-col[data-c="${i}"]`); col.dataset.v = st.at[i];
        col.querySelectorAll('.lk-cell:not(.base)').forEach(b => b.classList.toggle('on', st.at[i] >= +b.dataset.l));
      };
      root.querySelectorAll('.lk-cell').forEach(b => {
        b.onclick = () => {
          const i = +b.dataset.c, l = +b.dataset.l;
          // tapping the top of what is already there takes it down one: a rod can be nudged as well as set
          st.at[i] = (l && st.at[i] === l) ? l - 1 : l;
          paint(i); beep(260 + st.at[i] * 50, 0.05);
        };
      });
      root.querySelector('.lk-try').onclick = () => {
        if (same(st.at.map(String), asList(p.answer).map(String))) return solvePuzzle(o);
        fail(o, root);
      };
    },
  };

  /* =========================================================
     keypad — numbers keyed in, then the tick
     ========================================================= */
  const keypad = {
    show(v, n) { return Array.from({ length: n }, (_, i) => `<i${v[i] ? ' class="set"' : ''}>${v[i] || ''}</i>`).join(''); },
    html(o) {
      const p = o.puzzle, n = String(p.answer).length;
      const st = state(o, () => ({ v: '' }));
      const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '\u232b', '0', '\u2714'];
      return `<div class="lock"><div class="lk-pad lk-shake"><div class="pad-display" id="pad-display">${keypad.show(st.v, n)}</div>`
        + `<div class="pad-grid" id="pad-grid">${keys.map(k => `<button class="pad-key${k === '\u2714' ? ' go' : ''}${k === '\u232b' ? ' del' : ''}" data-k="${k}">${k}</button>`).join('')}</div>`
        + `</div>` + fb() + `</div>`;
    },
    init(o, root) {
      const p = o.puzzle, st = ST[o.id], n = String(p.answer).length;
      const paint = () => { $('pad-display').innerHTML = keypad.show(st.v, n); };
      root.querySelectorAll('.pad-key').forEach(b => {
        b.onclick = () => {
          const k = b.dataset.k;
          if (k === '\u232b') { st.v = st.v.slice(0, -1); thud(); }
          else if (k === '\u2714') {
            if (st.v.length < n) return thud();              // not a try until every place is filled
            if (st.v === String(p.answer)) return solvePuzzle(o);
            st.v = ''; paint(); return fail(o, root);
          } else if (st.v.length < n) { st.v += k; beep(420 + (+k) * 22, 0.05); }
          paint();
        };
      });
    },
  };

  /* =========================================================
     hold — bring the gauge up, and let go where it should be
     ========================================================= */
  const hold = {
    html(o) {
      const p = o.puzzle, max = p.max || 10, every = p.every || 2;
      const ticks = Array.from({ length: max + 1 }, (_, i) => `<i style="left:${i / max * 100}%"${i % every ? '' : ` data-n="${i}"`}></i>`).join('');
      return `<div class="lock">${p.plate ? `<div class="lk-plate">${p.plate}</div>` : ''}<div class="lk-hold lk-shake" id="lk-hold" data-v="0">`
        + `<div class="hd-gauge"><b id="hd-bar"></b><span class="hd-ticks">${ticks}</span></div>`
        + `<div class="hd-read"><span id="hd-val">0.0</span><small>${esc(p.unit || '')}</small></div></div>`
        + `<button class="lk-try hd-btn" id="hold-btn">${esc(p.tryLabel || 'HOLD')}</button>` + fb() + `</div>`;
    },
    init(o, root) {
      const p = o.puzzle, max = p.max || 10, btn = $('hold-btn'), box = $('lk-hold');
      let v = 0, down = false, last = performance.now();
      const paint = () => { box.dataset.v = v.toFixed(2); $('hd-bar').style.width = (v / max * 100) + '%'; $('hd-val').textContent = v.toFixed(1); };
      const press = (e) => { e.preventDefault(); down = true; btn.classList.add('pressing'); };
      const release = () => {
        if (!down) return;
        down = false; btn.classList.remove('pressing');
        if (Math.abs(v - p.target) <= (p.tol || 0.3)) return solvePuzzle(o);
        fail(o, root, v < p.target ? (p.short || 'Not enough.') : (p.over || 'Too far.'));
      };
      btn.addEventListener('pointerdown', press);
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => btn.addEventListener(t, release));
      const tick = (now) => {
        if (!document.body.contains(box)) return;           // the close-up is gone
        const dt = Math.min(0.1, (now - last) / 1000); last = now;
        v = Math.max(0, Math.min(max, v + (down ? (p.rise || 2.4) : -(p.fall || 4)) * dt));
        paint(); requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
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
    const dark = lens.dark == null ? (lens.zoom ? 0 : 0.62) : lens.dark;
    let add = `<defs><clipPath id="${id}c"><circle class="lens-c" cx="-999" cy="-999" r="${r}"/></clipPath>`
      + `<radialGradient id="${id}g"><stop offset=".62" stop-color="#000"/><stop offset="1" stop-color="#fff"/></radialGradient>`
      + `<mask id="${id}m"><rect x="0" y="0" width="${w}" height="${h}" fill="#fff"/><circle class="lens-c" cx="-999" cy="-999" r="${r}" fill="url(#${id}g)"/></mask></defs>`;
    add += `<rect x="0" y="0" width="${w}" height="${h}" fill="${lens.shade || '#02070b'}" opacity="${dark}"${lit ? ` mask="url(#${id}m)"` : ''} pointer-events="none"/>`;
    if (lit) {
      // A lantern shows what is painted in `hidden`; a glass (`zoom`) shows the drawing itself, larger, centred
      // on wherever it is held — the same marks, nothing added, which is the point of a glass.
      const seen = lens.zoom
        ? `<rect x="0" y="0" width="${w}" height="${h}" fill="${lens.bg || '#0b0a10'}"/><g class="lens-zoom" data-k="${lens.zoom}">${svgHtml.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')}</g>`
        : (lens.hidden || '');
      add += `<g clip-path="url(#${id}c)" pointer-events="none" class="lens-hid">${seen}</g>`
        + `<circle class="lens-c" cx="-999" cy="-999" r="${r}" fill="${lens.tint || '#8fd0ff'}" opacity=".10" pointer-events="none"/>`
        + `<circle class="lens-c" cx="-999" cy="-999" r="${r}" fill="none" stroke="${lens.tint || '#8fd0ff'}" stroke-opacity=".5" stroke-width="2" pointer-events="none"/>`;
    }
    return svgHtml.replace(/<\/svg>\s*$/, add + '</svg>').replace('<svg ', `<svg data-lens="${lit ? 1 : 0}" `);
  }
  /** Where a pointer event landed, in the drawing's own coordinates. */
  function svgPoint(svg, ev) {
    const pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
    const m = svg.getScreenCTM(); if (!m) return null;
    return pt.matrixTransform(m.inverse());
  }
  function wireLens(root) {
    root.querySelectorAll('svg[data-lens="1"]').forEach(svg => {
      svg.style.touchAction = 'none';
      const c0 = svg.querySelector('.lens-c');
      svg._lensR = c0 ? +c0.getAttribute('r') : 60;
      const move = (ev) => {
        const q = svgPoint(svg, ev); if (!q) return;
        svg._lens = { x: q.x, y: q.y };
        svg.querySelectorAll('.lens-c').forEach(c => { c.setAttribute('cx', q.x.toFixed(1)); c.setAttribute('cy', q.y.toFixed(1)); });
        svg.querySelectorAll('.lens-zoom').forEach(g => {
          const k = +g.dataset.k;
          g.setAttribute('transform', `translate(${q.x.toFixed(1)} ${q.y.toFixed(1)}) scale(${k}) translate(${(-q.x).toFixed(1)} ${(-q.y).toFixed(1)})`);
        });
      };
      svg.addEventListener('pointermove', move);
      // Remember where the light was *before* this press. A finger has no way
      // to hover, so on a phone the first touch somewhere new only moves the
      // lantern there; it takes a second touch in the light to act on what
      // it shows. A mouse is already where it is pointing, so one click does.
      svg.addEventListener('pointerdown', (ev) => { svg._lensPrev = svg._lens ? { x: svg._lens.x, y: svg._lens.y } : null; move(ev); });
    });
  }
  /** Did this click land somewhere the lantern was already shining? (Always yes with no lantern.) */
  function inTheLight(el, ev) {
    const svg = el.closest && el.closest('svg[data-lens="1"]');
    if (!svg || !ev || ev.clientX == null) return true;
    const q = svgPoint(svg, ev), prev = svg._lensPrev;
    if (!q) return true;
    return !!prev && Math.hypot(prev.x - q.x, prev.y - q.y) <= svg._lensR;
  }
  const solvedNow = (id) => !id || (typeof S !== 'undefined' && S.solved.has(id));

  /** A clue: its drawing, plus whatever it lets you do. */
  function clue(o) {
    let fig = o.figure || '';
    const t = o.tool;
    if (o.lens) fig = lensify(fig, o.lens, solvedNow(o.lens.needs));
    let extra = '';
    if (t && t.type === 'turn' && solvedNow(t.needs)) {
      const st = state(o, () => ({ k: t.start || 0 })), n = t.steps || 4;
      const g = `<g id="turn-card" transform="rotate(${+(st.k * 360 / n).toFixed(2)} ${t.cx} ${t.cy})">${t.overlay}</g>`;
      // the turning part normally lies on top; a drawing can instead say where it goes (under a fixed mask, say)
      fig = fig.includes('<!--TURN-->') ? fig.replace('<!--TURN-->', g) : fig.replace(/<\/svg>\s*$/, g + '</svg>');
      extra = `<div class="tool-row"><button class="tool-btn" data-turn="-1">⟲ turn it</button><button class="tool-btn" data-turn="1">turn it ⟳</button></div>`;
    }
    if (t && t.type === 'flip') {
      const st = state(o, () => ({ side: 0 }));
      if (st.side) fig = t.back;
      extra = `<div class="tool-row"><button class="tool-btn" data-flip="1">turn it over</button></div>`;
    }
    if (t && t.type === 'listen') {
      extra = t.notes
        ? `<div class="tool-row"><button class="tool-btn" data-notes="${esc(t.notes.join(','))}">${esc(t.label || '▶ play it')}</button></div>`
        : `<div class="tool-row"><button class="tool-btn" data-listen="${esc(t.morse)}">▶ play it</button></div>`;
    }
    return (fig ? `<figure class="obj-fig">${fig}</figure>` : '') + extra;
  }
  /**
   * Something that repeats while you watch it: a lamp running through a
   * sequence of colours (`seq`), or beats that come in groups (`groups`).
   * It works on whatever in the drawing has class pulse-lamp, and stops by
   * itself when that drawing leaves the page.
   */
  let pulseRun = 0;
  const TONE = { red: 330, yellow: 392, green: 494, blue: 587, white: 659, orange: 440, purple: 523 };
  function startPulse(root, t) {
    const lamp = root.querySelector('.pulse-lamp'); if (!lamp) return;
    const run = ++pulseRun, steps = [];
    if (t.seq) t.seq.forEach(c => steps.push({ color: c, on: t.on || 430, off: t.gap || 250 }));
    else (t.groups || []).forEach(n => { for (let i = 0; i < n; i++) steps.push({ on: t.on || 150, off: i === n - 1 ? (t.pause || 950) : (t.gap || 240) }); });
    let i = 0;
    const next = () => {
      if (run !== pulseRun || !document.body.contains(lamp)) return;
      if (i >= steps.length) { i = 0; return setTimeout(next, t.rest || 1800); }
      const s = steps[i++];
      if (s.color) { lamp.style.setProperty('--lamp', art().col(s.color)); beep(TONE[s.color] || 440, s.on / 1000 * 0.9, 0.05, 'sine'); }
      else thud();
      lamp.classList.add('on');
      setTimeout(() => { lamp.classList.remove('on'); setTimeout(next, s.off); }, s.on);
    };
    setTimeout(next, 600);
  }

  /** A tune, one note after another (a music box, a bell, a pipe). */
  function playNotes(list, step = 0.42) {
    try {
      if (typeof AC === 'undefined' || !AC) return;
      if (AC.state === 'suspended') AC.resume();
      const t0 = AC.currentTime + 0.08;
      list.forEach((f, i) => tone(f, step * 0.92, t0 + i * step, 0.11, 'triangle'));
    } catch (e) { /* no audio */ }
  }

  function wireClue(o, root, reopen) {
    wireLens(root);
    const t = o.tool;
    if (t && t.type === 'pulse') startPulse(root, t);
    root.querySelectorAll('[data-turn]').forEach(b => {
      b.onclick = () => {
        const st = ST[o.id], n = t.steps || 4; st.k = (st.k + (+b.dataset.turn) + n) % n;
        const g = $('turn-card'); if (g) g.setAttribute('transform', `rotate(${+(st.k * 360 / n).toFixed(2)} ${t.cx} ${t.cy})`);
        thud();
      };
    });
    root.querySelectorAll('[data-flip]').forEach(b => { b.onclick = () => { ST[o.id].side ^= 1; thud(); reopen(); }; });
    root.querySelectorAll('[data-listen]').forEach(b => { b.onclick = () => { try { playMorse(b.dataset.listen); } catch (e) { /* no audio */ } }; });
    root.querySelectorAll('[data-notes]').forEach(b => { b.onclick = () => playNotes(b.dataset.notes.split(',').map(Number), t && t.step); });
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
  const TYPES = { combo, dirpad, clock, toggle, press, tiles, tune, levels, keypad, hold };
  const LOCKS = {
    has: (t) => !!TYPES[t],
    /** Would this setting open it? For locks that take more than one (a clock with a window). */
    accepts: (p, got) => TYPES[p.type] && TYPES[p.type].opens ? TYPES[p.type].opens(p, got) : null,
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
