import { makeDynamicComponent, makeStaticComponent } from './react.mjs';
import { generate } from '../index.mjs';
import { toSvgDataURL } from './svg.mjs';
import { h, render } from 'preact';
import * as hooks from 'preact/hooks';

const framework = { createElement: h, ...hooks };

describe('makeDynamicComponent', () => {
  it('creates a preact-compatible component', async () => {
    const Component = makeDynamicComponent(framework, generate);

    render(h(Component, { content: 'TEST' }), container);

    const canvas = container.querySelector('canvas');
    expect(canvas).isTruthy();
    expect(canvas.width).equals(300); // default canvas size

    await expect.poll(() => canvas.width, equals(29)); // QR code size + padding
  });

  it('updates if content changes', async () => {
    const spyGenerate = mock(generate);
    const Component = makeDynamicComponent(framework, spyGenerate);

    render(h(Component, { content: 'TEST' }), container);

    const canvas = container.querySelector('canvas');
    await expect.poll(() => canvas.width, equals(29));
    expect(spyGenerate).toHaveBeenCalled({ times: 1 });

    render(
      h(Component, { content: 'content that needs more space' }),
      container,
    );
    await expect.poll(() => canvas.width, equals(33));
    expect(spyGenerate).toHaveBeenCalled({ times: 2 });
  });

  it('accepts generate config and updates if changed', async () => {
    const spyGenerate = mock(generate);
    const Component = makeDynamicComponent(framework, spyGenerate);

    render(h(Component, { content: 'TEST', minVersion: 10 }), container);

    const canvas = container.querySelector('canvas');
    await expect.poll(() => canvas.width, equals(65));
    expect(spyGenerate).toHaveBeenCalled({ times: 1 });

    render(h(Component, { content: 'TEST', minVersion: 20 }), container);
    await expect.poll(() => canvas.width, equals(105));
    expect(spyGenerate).toHaveBeenCalled({ times: 2 });
  });

  it('accepts toCanvas config and updates if changed', async () => {
    const spyGenerate = mock(generate);
    const Component = makeDynamicComponent(framework, spyGenerate);

    render(h(Component, { content: 'TEST', padX: 2 }), container);

    const canvas = container.querySelector('canvas');
    await expect.poll(() => canvas.width, equals(25));
    expect(spyGenerate).toHaveBeenCalled({ times: 1 });

    render(h(Component, { content: 'TEST', padX: 10 }), container);
    await expect.poll(() => canvas.width, equals(41));
    expect(spyGenerate).toHaveBeenCalled({ times: 1 });
  });

  it('returns no code if content is omitted', async () => {
    const Component = makeDynamicComponent(framework, generate);

    render(h(Component, {}), container);

    const canvas = container.querySelector('canvas');
    expect(canvas).isFalsy();
  });
});

describe('makeStaticComponent', () => {
  it('creates a preact-compatible component', () => {
    const Component = makeStaticComponent(framework, generate, toSvgDataURL);

    render(h(Component, { content: 'TEST' }), container);

    const img = container.querySelector('img');
    expect(img).isTruthy();
    expect(img.src).startsWith('data:image/svg;base64,');
  });
});

expect.poll = async (expr, matcher) => {
  // TODO: promote this to lean-test core
  for (let r = 0; r < 10; ++r) {
    try {
      return await expect(expr(), matcher);
    } catch (e) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  }
  try {
    return await expect(expr(), matcher);
  } catch (e) {
    fail(`Timed out waiting for expectation\n${e}`);
  }
};

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  render(null, container);
  document.body.removeChild(container);
  container = null;
});
