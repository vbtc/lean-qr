import { makeUint8Array } from '../util.mjs';

export const Bitmap2D = (
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
