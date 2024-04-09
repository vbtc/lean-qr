import terser from '@rollup/plugin-terser';
import pkg from './package.json' assert { type: 'json' };

const plugins = [
  terser({
    format: {
      ascii_only: true,
    },
    mangle: {
      properties: {
        reserved: ['correction', 'mode', 'generate'],
      },
      keep_fnames: true,
    },
  }),
];

export default [
  {
    treeshake: true,
    input: 'src/index.mjs',
    output: [
      {
        file: `web/build/${pkg.name}-${pkg.version}.js`,
        format: 'cjs',
        interop: 'compat',
      },
      {
        file: `web/build/${pkg.name}-${pkg.version}.min.js`,
        format: 'cjs',
        interop: 'compat',
        plugins,
      },
    ],
  },
];
