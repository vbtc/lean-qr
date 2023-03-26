import { shift_jis } from './jis.mjs';
import { Bitmap1D } from '../structures/Bitmap1D.mjs';
import { toMatchBits } from '../test-helpers/toMatchBits.mjs';

expect.extend({ toMatchBits });

describe('shift_jis', () => {
  it('stores the identifier and length', () => {
    const data = new Bitmap1D(10);
    shift_jis('')(data, 1);
    expect(data).toMatchBits(`
      1000
      00000000
    `);
  });

  it('uses a larger length for higher versions', () => {
    const data10 = new Bitmap1D(10);
    shift_jis('')(data10, 10);
    expect(data10._bits).toEqual(4 + 10);

    const data27 = new Bitmap1D(10);
    shift_jis('')(data27, 27);
    expect(data27._bits).toEqual(4 + 12);
  });

  it('encodes values in 13-bits', () => {
    const data = new Bitmap1D(10);
    shift_jis('\uFF41\uFF42\uFF43')(data, 1); // full-width "abc"
    expect(data).toMatchBits(`
      1000
      00000011
      0000100000001
      0000100000010
      0000100000011
    `);
  });

  it('converts all supported values (shift-jis range)', () => {
    const data = new Bitmap1D(10);
    // smallest shift-jis codepoint to largest codepoint:
    shift_jis('\u3000\u7199')(data, 1); // ideographic space -- 'bright, splendid, glorious'
    expect(data).toMatchBits(`
      1000
      00000010
      0000000000000
      1111100100100
    `);
  });

  it('converts all supported values (unicode range)', () => {
    const data = new Bitmap1D(10);
    // smallest unicode codepoint to largest codepoint:
    shift_jis('\u00A7\uFFE5')(data, 1); // section -- full-width yen sign
    expect(data).toMatchBits(`
      1000
      00000010
      0000001011000
      0000001001111
    `);
  });

  it('accepts 2-byte shift-JIS characters', () => {
    expect(shift_jis.test('\u3000')).isTruthy();
    expect(shift_jis.test('\u7199')).isTruthy();
    expect(shift_jis.test('\u00A7')).isTruthy();
    expect(shift_jis.test('\uFFE5')).isTruthy();
    expect(shift_jis.test('.')).isFalsy();
    expect(shift_jis.test(' ')).isFalsy();
    expect(shift_jis.test('a')).isFalsy();
    expect(shift_jis.test('\u0000')).isFalsy();
    expect(shift_jis.test('\uFFFF')).isFalsy();
  });

  it('estimates accurately', () => {
    expectEstMatch(shift_jis, '');
    expectEstMatch(shift_jis, '\u3000');
  });
});

function expectEstMatch(mode, value) {
  const encoder = mode(value);

  for (let version = 1; version <= 40; ++version) {
    const data = new Bitmap1D(10);
    data.eci = mode.eci; // do not include ECI changes
    const est = mode.est(value, version);
    encoder(data, version);
    expect(Math.ceil(est)).equals(data._bits);
  }
}
