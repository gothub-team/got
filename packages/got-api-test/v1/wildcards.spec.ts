import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import { type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import type { Graph } from '@gothub/got-core';
import { createUserApi } from './shared';
import { parseEnv } from '@gothub/typescript-util';
import { TEST_USER_1_EMAIL, TEST_USER_1_PW, TEST_USER_2_EMAIL, TEST_USER_2_PW } from '../env';

const env = parseEnv({
    TEST_USER_1_EMAIL,
    TEST_USER_1_PW,
    TEST_USER_2_EMAIL,
    TEST_USER_2_PW,
});

let testId: string;
let user1Api: GotApi;
let user1Email: string;
let user2Api: GotApi;
let user2Email: string;
beforeAll(async () => {
    user1Email = env.TEST_USER_1_EMAIL;
    user1Api = await createUserApi(user1Email, env.TEST_USER_1_PW);
    user2Email = env.TEST_USER_2_EMAIL;
    user2Api = await createUserApi(user2Email, env.TEST_USER_2_PW);
});
beforeEach(async () => {
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
});

describe('node wildcards', () => {
    let graph: Graph;
    let scopeId: string;
    beforeEach(async () => {
        scopeId = `${testId}-scope.`;
        await user1Api.push({
            nodes: { [scopeId]: { id: scopeId } },
        });
        await user1Api.push({
            nodes: {
                [`${scopeId}node-1`]: { id: `${scopeId}node-1` },
                [`${scopeId}node-2`]: { id: `${scopeId}node-2` },
            },
        });
    });

    describe('pull nodes', () => {
        beforeEach(async () => {
            graph = await user1Api.pull({
                [`${scopeId}*`]: { include: { node: true } },
            });
        });

        it('pulls two nodes', () => {
            expect(graph).toHaveProperty(['nodes', `${scopeId}node-1`]);
            expect(graph).toHaveProperty(['nodes', `${scopeId}node-2`]);
        });
    });

    describe('read rights not on scope', () => {
        beforeEach(async () => {
            await user1Api.push({
                rights: {
                    [`${scopeId}node-1`]: { user: { [user2Email]: { read: true } } },
                    [`${scopeId}node-2`]: { user: { [user2Email]: { read: true } } },
                },
            });
            graph = await user2Api.pull({
                [`${scopeId}*`]: { include: { node: true } },
            });
        });

        it('pulls two nodes', () => {
            expect(graph).toHaveProperty(['nodes', `${scopeId}node-1`]);
            expect(graph).toHaveProperty(['nodes', `${scopeId}node-2`]);
        });
    });
});

describe('edge wildcards', () => {
    let graph: Graph;
    beforeEach(async () => {
        await user1Api.push({
            nodes: {
                [`${testId}-1`]: { id: `${testId}-1` },
                [`${testId}-2`]: { id: `${testId}-2` },
                [`${testId}-3`]: { id: `${testId}-3` },
                [`${testId}-4`]: { id: `${testId}-4` },
                [`${testId}-5`]: { id: `${testId}-5` },
            },
            edges: {
                from1: {
                    [`${testId}-1`]: {
                        to1: {
                            [`${testId}-2`]: true,
                            [`${testId}-4`]: true,
                        },
                    },
                },
                from2: {
                    [`${testId}-1`]: {
                        to2: {
                            [`${testId}-3`]: true,
                            [`${testId}-5`]: true,
                        },
                    },
                },
            },
        });
    });

    describe('wildcard *', () => {
        beforeEach(async () => {
            graph = await user1Api.pull({
                [`${testId}-1`]: {
                    edges: { '*': { include: { edges: true } } },
                },
            });
        });

        it('pulls 4 edges', () => {
            expect(graph).toHaveProperty(['edges', 'from1', `${testId}-1`, 'to1', `${testId}-2`], true);
            expect(graph).toHaveProperty(['edges', 'from2', `${testId}-1`, 'to2', `${testId}-3`], true);
            expect(graph).toHaveProperty(['edges', 'from1', `${testId}-1`, 'to1', `${testId}-4`], true);
            expect(graph).toHaveProperty(['edges', 'from2', `${testId}-1`, 'to2', `${testId}-5`], true);
        });
    });

    describe('wildcard */*', () => {
        beforeEach(async () => {
            graph = await user1Api.pull({
                [`${testId}-1`]: {
                    edges: { '*/*': { include: { edges: true } } },
                },
            });
        });

        it('pulls 4 edges', () => {
            expect(graph).toHaveProperty(['edges', 'from1', `${testId}-1`, 'to1', `${testId}-2`], true);
            expect(graph).toHaveProperty(['edges', 'from2', `${testId}-1`, 'to2', `${testId}-3`], true);
            expect(graph).toHaveProperty(['edges', 'from1', `${testId}-1`, 'to1', `${testId}-4`], true);
            expect(graph).toHaveProperty(['edges', 'from2', `${testId}-1`, 'to2', `${testId}-5`], true);
        });
    });

    describe('illegal wildcard /*', () => {
        beforeEach(async () => {
            graph = await user1Api.pull({
                [`${testId}-1`]: {
                    edges: { '/*': { include: { edges: true } } },
                },
            });
        });

        it('pulls no edges', () => {
            expect(graph).not.toHaveProperty(['edges', 'from1']);
            expect(graph).not.toHaveProperty(['edges', 'from2']);
        });
    });

    describe('wildcard from1/*', () => {
        beforeEach(async () => {
            graph = await user1Api.pull({
                [`${testId}-1`]: {
                    edges: { 'from1/*': { include: { edges: true } } },
                },
            });
        });

        it('pulls 2 edges', () => {
            expect(graph).toHaveProperty(['edges', 'from1', `${testId}-1`, 'to1', `${testId}-2`], true);
            expect(graph).toHaveProperty(['edges', 'from1', `${testId}-1`, 'to1', `${testId}-4`], true);
            expect(graph).not.toHaveProperty(['edges', 'from2']);
        });
    });

    describe('wildcard */to2', () => {
        beforeEach(async () => {
            graph = await user1Api.pull({
                [`${testId}-1`]: {
                    edges: { '*/to2': { include: { edges: true } } },
                },
            });
        });

        it('pulls 2 edges', () => {
            expect(graph).toHaveProperty(['edges', 'from2', `${testId}-1`, 'to2', `${testId}-3`], true);
            expect(graph).toHaveProperty(['edges', 'from2', `${testId}-1`, 'to2', `${testId}-5`], true);
            expect(graph).not.toHaveProperty(['edges', 'from1', `${testId}-1`, 'to1', `${testId}-2`]);
            expect(graph).not.toHaveProperty(['edges', 'from1', `${testId}-1`, 'to1', `${testId}-4`]);
        });
    });
});
