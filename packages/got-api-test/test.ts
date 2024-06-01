#!/usr/bin/env bun

import { $, argv } from 'bun';

console.log('DIRNAME:', __dirname);
console.log('VERSION', '0.0.18');
try {
    await $`cd ${__dirname}; bun test --timeout 100000 ${argv[2]}`;
} catch (error) {
    //
}
