#!/usr/bin/env bun

import { $, argv } from 'bun';

try {
    await $`bun test --timeout 100000 ${argv[2]}`;
} catch (error) {
    //
}
