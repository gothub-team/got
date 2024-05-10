import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import { type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import type { Graph } from '@gothub-team/got-core';
import { createUserApi } from './shared';
import { env } from '../env';

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
