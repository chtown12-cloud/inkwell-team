/* ============================================================
   Minimal QR encoder — byte mode, error-correction level M,
   versions 1-10, full mask selection.

   Self-contained on purpose: the game ships as static files with no
   CDN beyond Google Fonts, and using a QR *image API* would send the
   game's join URL to a third party. ~45-char join URLs land around
   version 3, which keeps the modules chunky enough to survive video
   compression when scanned off a shared screen.
   ============================================================ */
(function (global) {
  'use strict';

  /* ---------- GF(256), primitive polynomial 0x11D ---------- */
  const EXP = new Uint8Array(512);
  const LOG = new Uint8Array(256);
  (function () {
    let x = 1;
    for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 0x100) x ^= 0x11d; }
    for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
  })();
  const gmul = (a, b) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

  /** Monic generator polynomial of the given degree; index 0 is the highest power. */
  function rsGenerator(degree) {
    let poly = [1];
    for (let i = 0; i < degree; i++) {
      const next = new Array(poly.length + 1).fill(0);
      for (let j = 0; j < poly.length; j++) {
        next[j] ^= poly[j];
        next[j + 1] ^= gmul(poly[j], EXP[i]);
      }
      poly = next;
    }
    return poly;
  }

  function rsEncode(data, ecLen) {
    const gen = rsGenerator(ecLen);
    const buf = new Uint8Array(data.length + ecLen);
    buf.set(data);
    for (let i = 0; i < data.length; i++) {
      const factor = buf[i];
      if (!factor) continue;
      for (let j = 0; j < gen.length; j++) buf[i + j] ^= gmul(gen[j], factor);
    }
    return Array.from(buf.slice(data.length));
  }

  /* ---------- level-M tables: [ecPerBlock, [[blocks, dataCodewords], ...]] ---------- */
  const ECC_M = {
    1: [10, [[1, 16]]],
    2: [16, [[1, 28]]],
    3: [26, [[1, 44]]],
    4: [18, [[2, 32]]],
    5: [24, [[2, 43]]],
    6: [16, [[4, 27]]],
    7: [18, [[4, 31]]],
    8: [22, [[2, 38], [2, 39]]],
    9: [22, [[3, 36], [2, 37]]],
    10: [26, [[4, 43], [1, 44]]],
  };
  const ALIGN = {
    1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30],
    6: [6, 34], 7: [6, 22, 38], 8: [6, 24, 42], 9: [6, 26, 46], 10: [6, 28, 50],
  };

  const dataCapacity = (v) => ECC_M[v][1].reduce((n, [blocks, per]) => n + blocks * per, 0);

  function chooseVersion(byteLen) {
    for (let v = 1; v <= 10; v++) {
      const countBits = v <= 9 ? 8 : 16;
      const needed = Math.ceil((4 + countBits + byteLen * 8) / 8);
      if (needed <= dataCapacity(v)) return v;
    }
    throw new Error('data too long for this encoder (max version 10)');
  }

  /* ---------- data codewords ---------- */
  function encodeData(bytes, version) {
    const capacity = dataCapacity(version);
    const countBits = version <= 9 ? 8 : 16;
    const bits = [];
    const push = (value, len) => { for (let i = len - 1; i >= 0; i--) bits.push((value >> i) & 1); };

    push(0b0100, 4);              // byte mode
    push(bytes.length, countBits);
    for (const b of bytes) push(b, 8);

    const capacityBits = capacity * 8;
    for (let i = 0; i < 4 && bits.length < capacityBits; i++) bits.push(0);  // terminator
    while (bits.length % 8) bits.push(0);

    const words = [];
    for (let i = 0; i < bits.length; i += 8) {
      let byte = 0;
      for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j];
      words.push(byte);
    }
    const PAD = [0xec, 0x11];
    for (let i = 0; words.length < capacity; i++) words.push(PAD[i % 2]);
    return words;
  }

  /** Split into blocks, add ECC, then interleave as the spec requires. */
  function buildCodewords(dataWords, version) {
    const [ecLen, groups] = ECC_M[version];
    const dataBlocks = [];
    const ecBlocks = [];
    let at = 0;
    for (const [blockCount, perBlock] of groups) {
      for (let i = 0; i < blockCount; i++) {
        const block = dataWords.slice(at, at + perBlock);
        at += perBlock;
        dataBlocks.push(block);
        ecBlocks.push(rsEncode(Uint8Array.from(block), ecLen));
      }
    }
    const out = [];
    const maxData = Math.max(...dataBlocks.map((b) => b.length));
    for (let i = 0; i < maxData; i++) {
      for (const block of dataBlocks) if (i < block.length) out.push(block[i]);
    }
    for (let i = 0; i < ecLen; i++) {
      for (const block of ecBlocks) out.push(block[i]);
    }
    return out;
  }

  /* ---------- matrix ---------- */
  function makeMatrix(version) {
    const size = version * 4 + 17;
    const modules = Array.from({ length: size }, () => new Uint8Array(size));
    const reserved = Array.from({ length: size }, () => new Uint8Array(size));
    const set = (r, c, v) => { modules[r][c] = v; reserved[r][c] = 1; };

    const finder = (top, left) => {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const rr = top + r; const cc = left + c;
          if (rr < 0 || cc < 0 || rr >= size || cc >= size) continue;
          const on = r >= 0 && r <= 6 && c >= 0 && c <= 6 &&
            (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
          set(rr, cc, on ? 1 : 0);
        }
      }
    };
    finder(0, 0); finder(0, size - 7); finder(size - 7, 0);

    for (let i = 8; i < size - 8; i++) {           // timing patterns
      const on = i % 2 === 0 ? 1 : 0;
      set(6, i, on); set(i, 6, on);
    }

    const centers = ALIGN[version];                 // alignment patterns
    for (const r of centers) {
      for (const c of centers) {
        const nearFinder = (r <= 8 && c <= 8) || (r <= 8 && c >= size - 9) || (r >= size - 9 && c <= 8);
        if (nearFinder) continue;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const on = Math.max(Math.abs(dr), Math.abs(dc)) !== 1 ? 1 : 0;
            set(r + dr, c + dc, on);
          }
        }
      }
    }

    set(size - 8, 8, 1);                            // dark module

    for (let i = 0; i < 9; i++) {                   // reserve format areas
      if (!reserved[8][i]) set(8, i, 0);
      if (!reserved[i][8]) set(i, 8, 0);
    }
    for (let i = 0; i < 8; i++) {
      if (!reserved[8][size - 1 - i]) set(8, size - 1 - i, 0);
      if (!reserved[size - 1 - i][8]) set(size - 1 - i, 8, 0);
    }
    if (version >= 7) {                             // reserve version areas
      for (let i = 0; i < 18; i++) {
        const a = Math.floor(i / 3); const b = size - 11 + (i % 3);
        set(a, b, 0); set(b, a, 0);
      }
    }
    return { size, modules, reserved };
  }

  function placeData(m, codewords) {
    const { size, modules, reserved } = m;
    const bits = [];
    for (const word of codewords) for (let i = 7; i >= 0; i--) bits.push((word >> i) & 1);

    let idx = 0; let upward = true;
    for (let right = size - 1; right > 0; right -= 2) {
      if (right === 6) right = 5;                   // skip the vertical timing column
      for (let step = 0; step < size; step++) {
        for (let col = 0; col < 2; col++) {
          const c = right - col;
          const r = upward ? size - 1 - step : step;
          if (reserved[r][c]) continue;
          modules[r][c] = idx < bits.length ? bits[idx++] : 0;
        }
      }
      upward = !upward;
    }
  }

  const MASKS = [
    (r, c) => (r + c) % 2 === 0,
    (r) => r % 2 === 0,
    (r, c) => c % 3 === 0,
    (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
    (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
    (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
  ];

  function formatBits(mask) {
    const data = (0b00 << 3) | mask;                // 00 = level M
    let rem = data << 10;
    for (let i = 14; i >= 10; i--) if ((rem >> i) & 1) rem ^= 0x537 << (i - 10);
    return ((data << 10) | rem) ^ 0x5412;
  }

  function versionInfoBits(version) {
    let rem = version << 12;
    for (let i = 17; i >= 12; i--) if ((rem >> i) & 1) rem ^= 0x1f25 << (i - 12);
    return (version << 12) | rem;
  }

  function applyFormat(m, mask, version) {
    const { size, modules } = m;
    const fmt = formatBits(mask);
    for (let i = 0; i < 15; i++) {
      // the spec walks these positions most-significant bit first
      const bit = (fmt >> (14 - i)) & 1;
      if (i < 6) modules[8][i] = bit;
      else if (i === 6) modules[8][7] = bit;
      else if (i === 7) modules[8][8] = bit;
      else if (i === 8) modules[7][8] = bit;
      else modules[14 - i][8] = bit;

      if (i < 7) modules[size - 1 - i][8] = bit;
      else modules[8][size - 15 + i] = bit;
    }
    if (version >= 7) {
      const vb = versionInfoBits(version);
      for (let i = 0; i < 18; i++) {
        const bit = (vb >> i) & 1;
        const a = Math.floor(i / 3); const b = size - 11 + (i % 3);
        modules[a][b] = bit; modules[b][a] = bit;
      }
    }
  }

  function penalty(modules, size) {
    let score = 0;
    const runScore = (n) => (n >= 5 ? 3 + (n - 5) : 0);

    for (let i = 0; i < size; i++) {              // rule 1: runs of 5+
      let rowRun = 1; let colRun = 1;
      for (let j = 1; j < size; j++) {
        if (modules[i][j] === modules[i][j - 1]) rowRun++; else { score += runScore(rowRun); rowRun = 1; }
        if (modules[j][i] === modules[j - 1][i]) colRun++; else { score += runScore(colRun); colRun = 1; }
      }
      score += runScore(rowRun) + runScore(colRun);
    }
    for (let r = 0; r < size - 1; r++) {          // rule 2: 2x2 blocks
      for (let c = 0; c < size - 1; c++) {
        const v = modules[r][c];
        if (v === modules[r][c + 1] && v === modules[r + 1][c] && v === modules[r + 1][c + 1]) score += 3;
      }
    }
    const A = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];  // rule 3: finder-like patterns
    const B = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];
    const matches = (get, i) => {
      let a = true; let b = true;
      for (let k = 0; k < 11; k++) { const v = get(i + k); if (v !== A[k]) a = false; if (v !== B[k]) b = false; }
      return (a ? 1 : 0) + (b ? 1 : 0);
    };
    for (let r = 0; r < size; r++) {
      for (let c = 0; c + 11 <= size; c++) {
        score += 40 * matches((k) => modules[r][k], c);
        score += 40 * matches((k) => modules[k][r], c);
      }
    }
    let dark = 0;                                  // rule 4: dark/light balance
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) dark += modules[r][c];
    const percent = (dark * 100) / (size * size);
    score += 10 * Math.floor(Math.abs(percent - 50) / 5);
    return score;
  }

  /**
   * Encode text and return { size, modules } with the best mask applied.
   * `forceMask` pins a specific mask; used by the test suite to diff against
   * a reference encoder.
   */
  function encode(text, forceMask) {
    const bytes = Array.from(new TextEncoder().encode(String(text)));
    const version = chooseVersion(bytes.length);
    const codewords = buildCodewords(encodeData(bytes, version), version);

    let best = null;
    const masks = Number.isInteger(forceMask) ? [forceMask] : [0, 1, 2, 3, 4, 5, 6, 7];
    for (const mask of masks) {
      const m = makeMatrix(version);
      placeData(m, codewords);
      for (let r = 0; r < m.size; r++) {
        for (let c = 0; c < m.size; c++) {
          if (!m.reserved[r][c] && MASKS[mask](r, c)) m.modules[r][c] ^= 1;
        }
      }
      applyFormat(m, mask, version);
      const score = penalty(m.modules, m.size);
      if (!best || score < best.score) best = { score, size: m.size, modules: m.modules, version, mask };
    }
    return best;
  }

  /**
   * Draw into a canvas. Deliberately pure black on white with a 4-module
   * quiet zone — the game's dark palette would not survive being scanned
   * off someone's shared screen.
   */
  function render(canvas, text, opts) {
    const options = opts || {};
    const quiet = options.quiet == null ? 4 : options.quiet;
    const px = options.size || 300;
    const qr = encode(text);
    const total = qr.size + quiet * 2;
    const scale = Math.max(1, Math.floor(px / total));
    const dim = total * scale;

    canvas.width = dim; canvas.height = dim;
    canvas.style.width = dim + 'px'; canvas.style.height = dim + 'px';
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, dim, dim);
    ctx.fillStyle = '#000';
    for (let r = 0; r < qr.size; r++) {
      for (let c = 0; c < qr.size; c++) {
        if (qr.modules[r][c]) ctx.fillRect((c + quiet) * scale, (r + quiet) * scale, scale, scale);
      }
    }
    return qr;
  }

  const API = {
    encode,
    render,
    // exposed so the test suite can diff each stage against a reference encoder
    _internal: { makeMatrix, placeData, encodeData, buildCodewords, chooseVersion, dataCapacity, MASKS, formatBits },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = API;
  global.QR = API;
})(typeof globalThis !== 'undefined' ? globalThis : this);
