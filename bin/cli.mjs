#!/usr/bin/env node

import { mode, correction, generate } from '../build/index.js';
import { toSvgSource } from '../build/extras/svg.js';
import { toPngBuffer } from '../build/extras/node_export.mjs';
import { readError } from '../build/extras/errors.mjs';
import { printUsage, parseArgs } from './argparser.mjs';

const ENCODINGS = new Map();
ENCODINGS.set('auto', mode.auto);
ENCODINGS.set('numeric', mode.numeric);
ENCODINGS.set('alphanumeric', mode.alphaNumeric);
ENCODINGS.set('ascii', mode.ascii);
ENCODINGS.set('iso-8859-1', mode.iso8859_1);
ENCODINGS.set('shift-jis', mode.shift_jis);
ENCODINGS.set('utf8', mode.utf8);

const TEXT_FORMATS = new Map();
TEXT_FORMATS.set('text-ansi-invert', { on: '\u001B[7m  \u001B[0m' });
TEXT_FORMATS.set('text-ansi-bw', {
  on: '\u001B[40m  ',
  off: '\u001B[107m  ',
  lf: '\u001B[0m\n',
});
TEXT_FORMATS.set('text-ansi-wb', {
  on: '\u001B[107m  ',
  off: '\u001B[40m  ',
  lf: '\u001B[0m\n',
});
TEXT_FORMATS.set('text-box', { on: '\u2588\u2588' });
TEXT_FORMATS.set('text-ascii', {});

const FLAGS = [
  {
    id: 'encoding',
    name: 'encoding',
    short: 'e',
    type: 'enum',
    values: [...ENCODINGS.keys()],
    def: 'auto',
    info: 'Set the encoding type for the content',
  },
  {
    id: 'minCor',
    name: 'min-correction',
    short: 'c',
    type: 'enum',
    values: [...Object.keys(correction)],
    def: 'min',
    info: 'Set the minimum error correction level',
  },
  {
    id: 'maxCor',
    name: 'max-correction',
    short: 'C',
    type: 'enum',
    values: [...Object.keys(correction)],
    def: 'max',
    info: 'Set the maximum error correction level',
  },
  {
    id: 'minVer',
    name: 'min-version',
    short: 'v',
    type: 'int',
    min: 1,
    max: 40,
    def: 1,
    info: 'Set the minimum version (size)',
  },
  {
    id: 'maxVer',
    name: 'max-version',
    short: 'V',
    type: 'int',
    min: 1,
    max: 40,
    def: 40,
    info: 'Set the maximum version (size)',
  },
  {
    id: 'padding',
    name: 'padding',
    short: 'p',
    type: 'int',
    min: 0,
    def: 4,
    info: 'Set the edge padding size',
  },
  {
    id: 'mask',
    name: 'mask',
    short: 'm',
    type: 'enum',
    values: ['auto', '0', '1', '2', '3', '4', '5', '6', '7'],
    def: 'auto',
    info: 'Set the masking type (advanced usage)',
  },
  {
    id: 'trailer',
    name: 'trailer',
    short: 't',
    type: 'hex',
    length: 4,
    min: 0x0000,
    max: 0xffff,
    def: 0xec11,
    info: 'Set the trailer data (advanced usage)',
  },
  {
    id: 'format',
    name: 'format',
    short: 'f',
    type: 'enum',
    values: [...TEXT_FORMATS.keys(), 'svg', 'png'],
    def: 'text-ansi-invert',
    info: 'Set the output format',
  },
  {
    id: 'info',
    name: 'info',
    short: 'i',
    type: 'presence',
    info: 'Print meta information to stderr',
  },
  {
    id: 'help',
    name: 'help',
    short: '?',
    type: 'presence',
    info: 'Print documentation',
  },
];

try {
  const args = parseArgs(FLAGS, process.argv);
  if (args.help) {
    printUsage('lean-qr', 'CLI for generating a QR code', FLAGS, 'content');
    process.exit(0);
  }

  const content = args.rest;

  const encoding = ENCODINGS.get(args.encoding.toLowerCase());
  if (!encoding) {
    throw new Error('Unknown encoding type');
  }
  const encoded = encoding(content);

  const tm0 = Date.now();
  const code = generate(encoded, {
    minCorrectionLevel: correction[args.minCor],
    maxCorrectionLevel: correction[args.maxCor],
    minVersion: args.minVer,
    maxVersion: args.maxVer,
    mask: args.mask === 'auto' ? null : Number(args.mask),
    trailer: args.trailer,
  });
  const tm1 = Date.now();
  let tm2;
  if (args.format === 'svg') {
    const result = toSvgSource(code, {
      on: 'black',
      off: 'white',
      padX: args.padding,
      padY: args.padding,
      xmlDeclaration: true,
    });
    tm2 = Date.now();
    process.stdout.write(result + '\n');
  } else if (args.format === 'png') {
    const result = toPngBuffer(code, {
      on: [0, 0, 0],
      off: [255, 255, 255],
      scale: 8,
      padX: args.padding,
      padY: args.padding,
    });
    tm2 = Date.now();
    process.stdout.write(result);
  } else if (TEXT_FORMATS.has(args.format)) {
    const result = code.toString({
      ...TEXT_FORMATS.get(args.format),
      padX: args.padding,
      padY: args.padding,
    });
    tm2 = Date.now();
    process.stdout.write(result);
  } else {
    throw new Error('Unknown output format');
  }

  if (args.info) {
    process.stderr.write('Time taken:\n');
    process.stderr.write(`  generate: ${tm1 - tm0}ms\n`);
    process.stderr.write(`  format: ${tm2 - tm1}ms\n`);
  }
} catch (e) {
  process.stderr.write(`${readError(e)}\n\n`);
  process.exit(1);
}

// lean-qr 'LEAN-QR LIBRARY'
// lean-qr -cQ 'HELLO WORLD'
// lean-qr -cQ -m1 'http://en.m.wikipedia.org'
