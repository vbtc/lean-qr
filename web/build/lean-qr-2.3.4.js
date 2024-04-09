'use strict';

// This was generated using tools/corrections-gen.mjs
const CORRECTION_DATA =
  "*-04-39?2$%%$%%'$%''%'''%')(%'))%(++'(++'(+.'+-.',/3',33)-/5)-43).36)058*18<+37<+4:<,4:E,5<A-7>C/8@F/:EH/<EK0=FM1?IP2@KS3BNV4DPY5FS\\6HV_6IXb7K[e8N^i9Pam;Rdp<Tgt";

const ECS_RATIO = [1 / 5, 3 / 8, 5 / 9, 2 / 3];

const correctionData = (version, totalBytes) => (correctionIndex) => {
  const p = version * 4 + correctionIndex - 4;
  const d = CORRECTION_DATA.charCodeAt(p) - 35;
  const totalGroups = p > 8 ? d : 1;
  const gs = (totalBytes / totalGroups) | 0;
  const g2n = totalBytes % totalGroups;
  const g1n = totalGroups - g2n;
  const ecs =
    p > 8 ? (gs * ECS_RATIO[correctionIndex] + (version > 5)) & ~1 : d;
  const g1s = gs - ecs;

  return {
    _capacityBits: (g1n * g1s + g2n * (g1s + 1)) * 8,
    _groups: g2n
      ? [
          [g1n, g1s],
          [g2n, g1s + 1],
        ]
      : [[g1n, g1s]],
    _ecSize: ecs,
  };
};

const correction = {
  min: 0,
  L: 0,
  M: 1,
  Q: 2,
  H: 3,
  max: 3,
};

const makeUint8Array = (size) => new Uint8Array(size);
const fail = (code) => {
  const error = new Error(`lean-qr error ${code}`);
  error.code = code;
  throw error;
};

const ERROR_NO_DATA = 1;
const ERROR_INVALID_VERSION_RANGE = 2;
const ERROR_INVALID_ERROR_CORRECTION_RANGE = 3;
const ERROR_TOO_MUCH_DATA = 4;
const ERROR_UNENCODABLE = 5;

const alnum = (c) => '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:'.indexOf(c);
const firstCharCode = (c) => c.charCodeAt(0);

const multi =
  (...encodings) =>
  (data, version) =>
    encodings.forEach((enc) => enc(data, version));

const eci = (id) => (data) => {
  if (data.eci !== id) {
    data.push(0b0111, 4);
    data.push(id, 8);
    data.eci = id;
  }
};

const bytes = (value) => (data, version) => {
  data.push(0b0100, 4);
  data.push(value.length, 8 + (version > 9) * 8);
  value.forEach((b) => data.push(b, 8));
};

const makeMode = (
  fn,
  test,
  estimatorLen,
  requiredECI,
  estimator = (value, version) => estimatorLen(value.length, version),
  wrappedFn = requiredECI ? (value) => multi(eci(requiredECI), fn(value)) : fn,
) => {
  wrappedFn.test = test;
  wrappedFn._estimateByLength = estimatorLen;
  wrappedFn.est = estimator;
  wrappedFn.eci = requiredECI && [requiredECI];
  return wrappedFn;
};

const numeric = makeMode(
  (value) => (data, version) => {
    data.push(0b0001, 4);
    data.push(value.length, 10 + (version > 26) * 2 + (version > 9) * 2);
    let i = 0;
    for (; i < value.length - 2; i += 3) {
      data.push(+value.slice(i, i + 3), 10);
    }
    if (i < value.length - 1) {
      data.push(+value.slice(i, i + 2), 7);
    } else if (i < value.length) {
      data.push(+value[i], 4);
    }
  },
  /./.test.bind(/[0-9]/),
  (count, version) =>
    14 + (version > 26) * 2 + (version > 9) * 2 + (count * 10) / 3,
);

const alphaNumeric = makeMode(
  (value) => (data, version) => {
    data.push(0b0010, 4);
    data.push(value.length, 9 + (version > 26) * 2 + (version > 9) * 2);
    let i = 0;
    for (; i < value.length - 1; i += 2) {
      data.push(alnum(value[i]) * 45 + alnum(value[i + 1]), 11);
    }
    if (i < value.length) {
      data.push(alnum(value[i]), 6);
    }
  },
  (c) => alnum(c) >= 0,
  (count, version) => 13 + (version > 26) * 2 + (version > 9) * 2 + count * 5.5,
);

// Unicode codepoints and ISO-8859-1 overlap for first 256 chars
const ascii = makeMode(
  (value) => bytes([...value].map(firstCharCode)),
  (c) => firstCharCode(c) < 0x80,
  (count, version) => 12 + (version > 9) * 8 + count * 8,
);
ascii._composable = true;

const iso8859_1 = makeMode(
  ascii,
  (c) => firstCharCode(c) < 0x100,
  ascii._estimateByLength,
  3,
);
iso8859_1._composable = true;

const utf8Encoder = new TextEncoder();
const utf8 = makeMode(
  (value) => bytes(utf8Encoder.encode(value)),
  () => 1,
  0,
  26,
  (value, version) =>
    12 + (version > 9) * 8 + utf8Encoder.encode(value).length * 8,
);
utf8._composable = true;

let shiftJISMap = () => {
  const map = new Map();
  const decoder = new TextDecoder('sjis');
  const b = makeUint8Array(2);
  for (let code = 0; code < 0x1f25; ++code) {
    b[0] = code / 0xc0 + 0x81 + (code > 0x173f) * 0x40;
    b[1] = (code % 0xc0) + 0x40;
    map.set(decoder.decode(b), code);
  }
  map.delete('\uFFFD');
  shiftJISMap = () => map;
  return map;
};

const shift_jis = makeMode(
  (value) => (data, version) => {
    data.push(0b1000, 4);
    data.push(value.length, 8 + (version > 26) * 2 + (version > 9) * 2);
    for (const c of value) {
      data.push(shiftJISMap().get(c), 13);
    }
  },
  (c) => shiftJISMap().has(c),
  (count, version) => 12 + (version > 26) * 2 + (version > 9) * 2 + count * 13,
);
shift_jis._composable = true;

const DEFAULT_AUTO_MODES = [
  numeric,
  alphaNumeric,
  ascii,
  iso8859_1,
  shift_jis,
  utf8,
];

const mode = {
  auto:
    (value, { modes = DEFAULT_AUTO_MODES } = {}) =>
    (data, version) => {
      /*
       * The algorithm used here assumes that no mode can encode longer strings in less space,
       * and that it is only beneficial to switch modes when the supported character sets
       * change.
       *
       * It breaks the string into chunks according to which combination of modes can encode
       * the characters, then progresses block by block, tracking the single lowest-cost-so-far
       * path for each of the currently possible mode/eci combinations. It is possible to
       * determine this from the previous character's lowest-cost-so-far paths, making this
       * algorithm O(n * m^2) overall (n = number of blocks, m = number of available modes *
       * possible ECI states), assuming the mode estimator functions are O(1)
       *
       * Since this is the most CPU-intensive part of the process, it has been optimised for
       * speed rather than code size.
       */

      let id = 1;
      for (const mode of modes) {
        const cache = new Map();
        mode._id = id <<= 1;
        mode._switchCost = mode.est('', version);
        mode._est = mode._estimateByLength
          ? (start, end) => {
              const l = end - start;
              const n = cache.get(l) ?? mode._estimateByLength(l, version);
              cache.set(l, n);
              return n;
            }
          : (start, end) => {
              const s = value.slice(start, end);
              const n = cache.get(s) ?? mode.est(s, version);
              cache.set(s, n);
              return n;
            };
      }

      let cur = [{ _cost: 0 }];
      let start = 0;
      let end = 0;
      let prevActive = -1;
      for (const c of [...value, '']) {
        let active = 0;
        if (c) {
          for (const mode of modes) {
            if (mode.test(c)) {
              active |= mode._id;
            }
          }
        }
        if (!c || active !== prevActive) {
          if (prevActive !== -1) {
            const ecis = new Set(cur.map((p) => p._eci));
            const next = [];
            for (const mode of modes.filter((m) => prevActive & m._id)) {
              const fragCost = mode._est(start, end);
              for (const eci of mode.eci ?? ecis) {
                if (mode === ascii && eci) {
                  // bespoke optimisation: ascii is never better if ECI has already been set
                  continue;
                }
                let best;
                for (const p of cur) {
                  if (p._eci === eci || mode.eci) {
                    const join = p._mode === mode && p._eci === eci;
                    const prev = join ? p._prev : p;
                    const joinedStart = join ? p._start : start;

                    let cost;
                    if (mode._composable && join) {
                      cost = p._cost + fragCost - mode._switchCost;
                    } else {
                      cost =
                        prev._cost +
                        (prev._eci !== eci) * 12 +
                        (joinedStart === start
                          ? fragCost
                          : mode._est(joinedStart, end));
                    }
                    if (!best || cost < best._cost) {
                      best = {
                        _start: joinedStart,
                        _prev: prev,
                        _mode: mode,
                        _eci: eci,
                        _end: end,
                        _cost: cost,
                      };
                    }
                  }
                }
                if (best) {
                  next.push(best);
                }
              }
            }
            if (!next.length) {
              fail(ERROR_UNENCODABLE);
            }
            cur = next;
          }
          prevActive = active;
          start = end;
        }
        end += c.length;
      }

      const parts = [];
      for (
        let part = cur.reduce((a, b) => (b._cost < a._cost ? b : a));
        part._mode;
        part = part._prev
      ) {
        parts.unshift(part._mode(value.slice(part._start, part._end)));
      }
      parts.forEach((enc) => enc(data, version));
    },
  multi,
  eci,
  numeric,
  alphaNumeric,
  bytes,
  ascii,
  iso8859_1,
  shift_jis,
  utf8,
};

const Bitmap1D = () => ({
  _bytes: makeUint8Array(2956), // max capacity of any code
  _bits: 0,
  push(value, bits) {
    for (let b = bits, r = 8 - (this._bits & 7); b > 0; b -= r, r = 8) {
      this._bytes[this._bits >> 3] |= (value << r) >> b;
      this._bits += b < r ? b : r; // min(b, r)
    }
  },
});

const Bitmap2D = (
  size,
  _dataSource = size * size,
  _data = makeUint8Array(_dataSource),
) => ({
  size,
  _data,

  get: (x, y) => x >= 0 && x < size && !!(_data[y * size + x] & 1),

  _set(x, y, value) {
    _data[y * size + x] = value;
  },

  toImageData(
    context,
    { on = [0, 0, 0], off = [0, 0, 0, 0], padX = 4, padY = 4 } = {},
  ) {
    const fullX = size + padX * 2;
    const fullY = size + padY * 2;
    const target = context.createImageData(fullX, fullY);
    const abgr = new Uint32Array(target.data.buffer);
    target.data.set([...on, 255]);
    const cOn = abgr[0];
    target.data.set([...off, 255]);
    const cOff = abgr[0];
    for (let y = 0; y < fullY; ++y) {
      for (let x = 0; x < fullX; ++x) {
        abgr[y * fullX + x] = this.get(x - padX, y - padY) ? cOn : cOff;
      }
    }
    return target;
  },

  toCanvas(canvas, options) {
    const ctx = canvas.getContext('2d');
    const data = this.toImageData(ctx, options);
    canvas.width = data.width;
    canvas.height = data.height;
    ctx.putImageData(data, 0, 0);
  },
});

const masks = [
  (x, y) => !((x ^ y) & 1),
  (x, y) => !(y & 1),
  (x) => !(x % 3),
  (x, y) => !((x + y) % 3),
  (x, y) => !((((x / 3) | 0) ^ (y >> 1)) & 1),
  (x, y) => !((x & y & 1) + ((x * y) % 3)),
  (x, y) => !(((x & y & 1) + ((x * y) % 3)) & 1),
  (x, y) => !((((x ^ y) & 1) + ((x * y) % 3)) & 1),
];

const LOG = makeUint8Array(512);
LOG[0] = 1;
for (let i = 0, v = 1; i < 255; LOG[++i] = v) {
  LOG[v + 256] = i;
  v *= 2;
  if (v & 256) {
    v ^= 285;
  }
}
const e = (x) => LOG[x % 255]; // assume x is never negative
const ln = (x) => LOG[x + 256];

const mult256PolyLn = (p1Ln, p2Ln) => {
  const result = makeUint8Array(p1Ln.length + p2Ln.length - 1);
  for (let i = 0; i < p1Ln.length; ++i) {
    for (let j = 0; j < p2Ln.length; ++j) {
      result[i + j] ^= e(p1Ln[i] + p2Ln[j]);
    }
  }
  return result.map(ln);
};

const rem256Poly = (num, denLn) => {
  const remainder = makeUint8Array(num.length + denLn.length - 1);
  remainder.set(num, 0);
  for (let i = 0; i < num.length; ++i) {
    if (remainder[i]) {
      // assume denLn[0] === 0 (true for all generator polys)
      const shift = ln(remainder[i]); // - denLn[0];
      for (let j = 0; j < denLn.length; ++j) {
        remainder[i + j] ^= e(denLn[j] + shift);
      }
    }
  }
  return remainder.slice(num.length);
};

const generators = [[0], [0, 0]];
for (let i = 1, last = generators[1]; i < 30; ++i) {
  const next = mult256PolyLn(last, [0, i]);
  generators.push(next);
  last = next;
}

const calculateEC = (versionBytes, correction) => {
  const blocks = [[], []];

  let p = 0;
  let size = 0;
  for (const [nBlocks, bytes] of correction._groups) {
    for (let b = 0; b < nBlocks; ++b, p += bytes) {
      const block = versionBytes.slice(p, p + bytes);
      blocks[0].push(block);
      blocks[1].push(rem256Poly(block, generators[correction._ecSize]));
      size += bytes + correction._ecSize;
    }
  }

  const result = makeUint8Array(size);
  let offset = 0;
  for (const bs of blocks) {
    for (let i = 0, prev; offset !== prev; ++i) {
      prev = offset;
      for (const block of bs) {
        if (i < block.length) {
          result[offset++] = block[i];
        }
      }
    }
  }
  return result;
};

const remBinPoly = (num, den, denBits) => {
  let remainder = num << (denBits - 1);
  for (let i = 0x8000000; i; i >>= 1) {
    if (remainder & i) {
      remainder ^= den * (i >> (denBits - 1));
    }
  }
  return remainder;
};

const drawFrame = ({ size, _data, _set }, version) => {
  const drawRect = (x1, y1, w, h, value) => {
    for (; h-- > 0; ) {
      const p = (y1 + h) * size + x1;
      _data.fill(value, p, p + w);
    }
  };

  const drawPlacement = (x, y) => {
    drawRect(x - 3, y - 3, 7, 7, 3);
    drawRect(x - 2, y - 2, 5, 5, 2);
    drawRect(x - 1, y - 1, 3, 3, 3);
  };

  const drawAlignment = (x, y) => {
    drawRect(x - 2, y - 2, 5, 5, 3);
    drawRect(x - 1, y - 1, 3, 3, 2);
    _set(x, y, 3);
  };

  drawRect(7, 0, 2, 9, 2);
  drawRect(size - 8, 0, 8, 9, 2);
  for (let i = 0; i < size; ++i) {
    _set(i, 6, 3 ^ (i & 1));
  }
  drawPlacement(3, 3);
  drawPlacement(size - 4, 3);
  if (version > 1) {
    const numAlignmentM = ((version / 7) | 0) + 1;
    // alignment boxes must always be positioned on even pixels
    // and are spaced evenly from the bottom right (except top and left which are always 6)
    // the 0.75 (1-0.25) avoids a quirk in the spec for version 32
    const stepAlignment = (((size - 13) / numAlignmentM / 2 + 0.75) | 0) * 2;
    for (let i = 0; i < numAlignmentM; ++i) {
      const p = size - 7 - i * stepAlignment;
      if (i) {
        drawAlignment(p, 6);
      }
      for (let j = 0; j < numAlignmentM; ++j) {
        drawAlignment(p, size - 7 - j * stepAlignment);
      }
    }
  }
  if (version > 6) {
    for (
      let dat = (version << 12) | remBinPoly(version, 0b1111100100101, 13),
        j = 0;
      j < 6;
      ++j
    ) {
      for (let i = 12; i-- > 9; dat >>= 1) {
        _set(size - i, j, 2 | (dat & 1));
      }
    }
  }
  for (let y = 0; y < size; ++y) {
    for (let x = y; x < size; ++x) {
      _data[x * size + y] = _data[y * size + x];
    }
  }
  _set(8, size - 8, 3);
};

const getPath = ({ size, _data }) => {
  const result = [];
  for (let xB = size - 2, y = size, dirY = -1; xB >= 0; xB -= 2) {
    if (xB === 5) {
      // special case: skip vertical timing pattern line
      xB = 4;
    }
    while (((y += dirY), y !== -1 && y !== size)) {
      const p = y * size + xB;
      if (_data[p + 1] < 2) {
        result.push(p + 1);
      }
      if (_data[p] < 2) {
        result.push(p);
      }
    }
    dirY *= -1;
  }
  return result;
};

const drawCode = ({ _data }, path, data) =>
  path.forEach(
    (p, bit) => (_data[p] = (data[bit >> 3] >> (7 - (bit & 7))) & 1),
  );

const applyMask = ({ size, _data, _set }, mask, maskId, ecLevel) => {
  for (let y = 0; y < size; ++y) {
    for (let x = 0; x < size; ++x) {
      const p = y * size + x;
      _data[p] ^= mask(x, y) & ((_data[p] >> 1) ^ 1);
    }
  }
  const info = ((ecLevel ^ 1) << 3) | maskId;
  let pattern =
    0b101010000010010 ^ ((info << 10) | remBinPoly(info, 0b10100110111, 11));
  for (let i = 8; i-- > 0; pattern >>= 1) {
    _set(8, (i > 1 ? 7 : 8) - i, pattern);
    _set(size - 8 + i, 8, pattern);
  }
  for (let i = 7; i-- > 0; pattern >>= 1) {
    _set(i > 5 ? 7 : i, 8, pattern);
    _set(8, size - i - 1, pattern);
  }
};

// only scoreCode is used for actual scoring; the other methods here
// provide a useful comparison for testing at a more atomic level.


const initial = 0b10000000000_10000000000;
const pattern = 0b10111010000_00001011101;
const matches = 0b00000000001_00000000001;

const scoreCode = ({ size, _data }, score = 0, totalOn = 0) => {
  for (let i = 0; i < size; ++i) {
    for (let n = 0; n < 2; ++n) {
      for (let j = 0, state = 0, consec = 0, last; j < size; ++j) {
        const cur = _data[n ? i * size + j : j * size + i] & 1;
        totalOn += cur;
        state = ((state >> 1) | initial) & (pattern ^ (cur - 1));
        if (state & matches) {
          score += 40;
        }
        if (cur !== last) {
          consec = 1;
          last = cur;
        } else if (++consec > 4) {
          score += consec < 6 ? 3 : 1;
        }
      }
    }
    if (i) {
      for (
        let y = 1, lastV = _data[i - 1] & 1, lastM = (_data[i] & 1) === lastV;
        y < size;
        ++y
      ) {
        const curV = _data[y * size + i - 1] & 1;
        const curM = (_data[y * size + i] & 1) === curV;
        score += (lastM && curM && lastV === curV) * 3;
        lastV = curV;
        lastM = curM;
      }
    }
  }
  return score + ((20 * Math.abs(totalOn / (size * size * 2) - 0.5)) | 0) * 10;
};

const baseCache = [];

const generate = (
  modeData = fail(ERROR_NO_DATA),
  {
    minCorrectionLevel = correction.min,
    maxCorrectionLevel = correction.max,
    minVersion = 1,
    maxVersion = 40,
    mask,
    trailer = 0b11101100_00010001,
    ...autoModeConfig
  } = {},
) => {
  if (maxCorrectionLevel < minCorrectionLevel) {
    fail(ERROR_INVALID_ERROR_CORRECTION_RANGE);
  }
  if (maxVersion < minVersion) {
    fail(ERROR_INVALID_VERSION_RANGE);
  }
  if (typeof modeData === 'string') {
    modeData = mode.auto(modeData, autoModeConfig);
  }

  for (
    let version = minVersion, dataLengthBits = 0;
    version <= maxVersion;
    ++version
  ) {
    let base = baseCache[version];
    if (!base) {
      baseCache[version] = base = Bitmap2D(version * 4 + 17);
      drawFrame(base, version);
      base.p = getPath(base);
    }
    const versionCorrection = correctionData(version, base.p.length >> 3);
    if (versionCorrection(minCorrectionLevel)._capacityBits < dataLengthBits) {
      continue;
    }

    const data = Bitmap1D();
    modeData(data, version);
    dataLengthBits = data._bits;

    for (let cl = maxCorrectionLevel; cl >= minCorrectionLevel; --cl) {
      const correction = versionCorrection(cl);
      if (correction._capacityBits < dataLengthBits) {
        continue;
      }
      data.push(0b0000, 4);
      data._bits = (data._bits + 7) & ~7; // pad with 0s to the next byte
      while (data._bits < correction._capacityBits) {
        data.push(trailer, 16);
      }

      const code = Bitmap2D(base.size, base._data);
      drawCode(code, base.p, calculateEC(data._bytes, correction));

      // pick best mask
      return (masks[mask ?? -1] ? [masks[mask]] : masks)
        .map((m, maskId) => {
          const masked = Bitmap2D(code.size, code._data);
          applyMask(masked, m, mask ?? maskId, cl);
          masked.s = scoreCode(masked);
          return masked;
        })
        .reduce((best, masked) => (masked.s < best.s ? masked : best));
    }
  }
  fail(ERROR_TOO_MUCH_DATA);
};

generate.with =
  (...extraModes) =>
  (modeData, options) =>
    generate(modeData, {
      modes: [...DEFAULT_AUTO_MODES, ...extraModes],
      ...options,
    });

globalThis.__rollup_no_tree_shaking = { correction, mode, generate };
