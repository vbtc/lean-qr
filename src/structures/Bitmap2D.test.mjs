import { Bitmap2D } from './Bitmap2D.mjs';

describe('Bitmap2D', () => {
  it('begins with all pixels off and unmasked', () => {
    const bmp = Bitmap2D(10);
    expect(bmp.size).toEqual(10);
    expect(bmp.get(0, 0)).toEqual(false);
    expect(bmp.get(9, 9)).toEqual(false);
    expect(bmp._data[0]).toEqual(0);
    expect(bmp._data[99]).toEqual(0);
  });

  it('stores pixels', () => {
    const bmp = Bitmap2D(10);
    bmp._set(5, 7, 3);
    bmp._set(9, 1, 2);
    bmp._set(8, 2, 1);
    bmp._set(4, 3, 0);
    expect(bmp.get(5, 7)).toEqual(true);
    expect(bmp.get(9, 1)).toEqual(false);
    expect(bmp.get(8, 2)).toEqual(true);
    expect(bmp.get(4, 3)).toEqual(false);
  });

  it('stores mask status pixels', () => {
    const bmp = Bitmap2D(10);
    bmp._set(5, 7, 3);
    bmp._set(9, 1, 2);
    bmp._set(8, 2, 1);
    bmp._set(4, 3, 0);
    expect(bmp._data[75]).toEqual(3);
    expect(bmp._data[19]).toEqual(2);
    expect(bmp._data[28]).toEqual(1);
    expect(bmp._data[34]).toEqual(0);
  });

  it('copies an existing bitmap', () => {
    const bmp1 = Bitmap2D(3);
    bmp1._set(0, 1, true);
    const bmp2 = Bitmap2D(bmp1.size, bmp1._data);

    expect(bmp2.size).toEqual(3);
    expect(bmp2.get(0, 0)).toEqual(false);
    expect(bmp2.get(0, 1)).toEqual(true);

    bmp2._set(1, 0, true);
    expect(bmp2.get(1, 0)).toEqual(true);
    expect(bmp1.get(1, 0)).toEqual(false);

    bmp1._set(1, 1, true);
    expect(bmp2.get(1, 1)).toEqual(false);
  });

  describe('toImageData', () => {
    it('creates image data for the image', () => {
      const imageData = TEST_IMAGE.toImageData(VIRTUAL_CANVAS);
      expect(imageData.width).toEqual(11);
      expect(imageData.height).toEqual(11);

      expect(imageData.data[0]).toEqual(0x00);
      expect(imageData.data[1]).toEqual(0x00);
      expect(imageData.data[2]).toEqual(0x00);
      expect(imageData.data[3]).toEqual(0x00);

      const p = (4 * imageData.width + 4) * 4;
      expect(imageData.data[p + 0]).toEqual(0x00);
      expect(imageData.data[p + 1]).toEqual(0x00);
      expect(imageData.data[p + 2]).toEqual(0x00);
      expect(imageData.data[p + 3]).toEqual(0xff);
    });

    it('accepts custom settings', () => {
      const imageData = TEST_IMAGE.toImageData(VIRTUAL_CANVAS, {
        on: [0x50, 0x60, 0x70, 0x80],
        off: [0x10, 0x20, 0x30, 0x40],
        padX: 2,
        padY: 1,
      });
      expect(imageData.width).toEqual(7);
      expect(imageData.height).toEqual(5);

      expect(imageData.data[0]).toEqual(0x10);
      expect(imageData.data[1]).toEqual(0x20);
      expect(imageData.data[2]).toEqual(0x30);
      expect(imageData.data[3]).toEqual(0x40);

      const p = (1 * imageData.width + 2) * 4;
      expect(imageData.data[p + 0]).toEqual(0x50);
      expect(imageData.data[p + 1]).toEqual(0x60);
      expect(imageData.data[p + 2]).toEqual(0x70);
      expect(imageData.data[p + 3]).toEqual(0x80);
    });

    it('assumes full opacity if not specified', () => {
      const imageData = TEST_IMAGE.toImageData(VIRTUAL_CANVAS, {
        on: [0x50, 0x60, 0x70],
        off: [0x10, 0x20, 0x30],
      });

      expect(imageData.data[0]).toEqual(0x10);
      expect(imageData.data[1]).toEqual(0x20);
      expect(imageData.data[2]).toEqual(0x30);
      expect(imageData.data[3]).toEqual(0xff);

      const p = (4 * imageData.width + 4) * 4;
      expect(imageData.data[p + 0]).toEqual(0x50);
      expect(imageData.data[p + 1]).toEqual(0x60);
      expect(imageData.data[p + 2]).toEqual(0x70);
      expect(imageData.data[p + 3]).toEqual(0xff);
    });
  });

  describe('toCanvas', () => {
    beforeAll(() => {
      assume(globalThis).hasProperty('document');
    });

    it('populates the given canvas with the image content', () => {
      const canvas = document.createElement('canvas');
      TEST_IMAGE.toCanvas(canvas);

      expect(canvas.width).toEqual(11);
      expect(canvas.height).toEqual(11);

      const imageData = canvas
        .getContext('2d')
        .getImageData(0, 0, canvas.width, canvas.height);
      expect(imageData.data[0]).toEqual(0x00);
      expect(imageData.data[1]).toEqual(0x00);
      expect(imageData.data[2]).toEqual(0x00);
      expect(imageData.data[3]).toEqual(0x00);

      const p = (4 * imageData.width + 4) * 4;
      expect(imageData.data[p + 0]).toEqual(0x00);
      expect(imageData.data[p + 1]).toEqual(0x00);
      expect(imageData.data[p + 2]).toEqual(0x00);
      expect(imageData.data[p + 3]).toEqual(0xff);
    });
  });
});

const TEST_IMAGE = Bitmap2D(3);
TEST_IMAGE._set(0, 0, true);
TEST_IMAGE._set(0, 1, true);
TEST_IMAGE._set(0, 2, true);
TEST_IMAGE._set(2, 2, true);

const VIRTUAL_CANVAS = {
  createImageData: (width, height) => {
    return { width, height, data: new Uint8ClampedArray(width * height * 4) };
  },
};
