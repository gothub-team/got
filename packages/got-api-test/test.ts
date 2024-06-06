#!/usr/bin/env bun

import { argv } from 'bun';

const [, , ...patterns] = argv;

try {
    const proc = Bun.spawn(['bun', 'test', '--timeout', '100000', ...patterns]);
    await proc.exited;
} catch (error) {
    //
}
