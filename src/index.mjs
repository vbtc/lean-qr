import { correction } from './qr/options/corrections.mjs';
import { mode } from './qr/options/modes.mjs';
import { generate } from './qr/generate.mjs';

globalThis.__rollup_no_tree_shaking = { correction, mode, generate };
