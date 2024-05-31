#!/usr/bin/env bun

import { $, argv } from 'bun';

console.log('DIRNAME:', __dirname);
try {
    await $`cd ${__dirname}; bun test --timeout 100000 ${argv[2]}`;
} catch (error) {
    //
}
