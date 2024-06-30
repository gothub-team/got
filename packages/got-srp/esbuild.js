import build from '@gothub/typescript-util/esbuild.js';
import * as fs from 'fs';

const source = fs
    .readFileSync('src/index.ts')
    .toString()
    .replace(`import { webcrypto as crypto } from 'crypto';`, 'const { crypto } = window;');

const resultBrowser = `// DO NOT EDIT THIS FILE, IT IS GENERATED

${source}`;

fs.writeFileSync('src/index-browser.ts', resultBrowser, {});

build({ srcDir: './src', minBundle: true });
