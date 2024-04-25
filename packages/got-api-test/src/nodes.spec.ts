import { describe, beforeAll, beforeEach, afterEach, it, expect } from 'bun:test';
import { env } from '../env';
import { createApi } from '@gothub/got-api';
import crypto from 'crypto';
import type { Graph, PushResult } from '@gothub-team/got-core';

let adminApi: ReturnType<typeof createApi>;
beforeAll(async () => {
    if (!env.TEST_ADMIN_PW) {
        throw new Error('TEST_ADMIN_PW is not set');
    }
    adminApi = createApi({
        host: env.GOT_API_URL,
        adminMode: true,
        sessionExpireTime: 1000 * 60 * 20,
    });
    await adminApi.login({
        email: env.TEST_ADMIN_USER_EMAIL,
        password: env.TEST_ADMIN_PW,
    });
});

let testId: string;
let api: ReturnType<typeof createApi>;
let userEmail: string;
beforeEach(async () => {
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
    userEmail = `aws+api.test${testId}@gothub.io`;
    const password = crypto.randomBytes(8).toString('hex');
    const session = await adminApi.inviteUser({ email: userEmail, password });
    api = createApi({
        host: env.GOT_API_URL,
        adminMode: false,
        sessionExpireTime: 1000 * 60 * 5,
    });
    api.setCurrentSession(session);
});
afterEach(async () => {
    await adminApi.deleteUser({ email: userEmail });
});

describe('new nodes', () => {
    let pushResult: PushResult;
    let graph: Graph;
    beforeEach(async () => {
        pushResult = await api.push({
            nodes: {
                [testId]: {
                    id: testId,
                    name: 'Test Node',
                    prop: 'value1',
                },
            },
        });
        graph = await api.pull({
            [testId]: {
                include: { node: true },
            },
        });
    });
    afterEach(async () => {
        await adminApi.push({ nodes: { [testId]: false } });
    });

    it('pushes one node', async () => {
        expect(pushResult).toHaveProperty(['nodes', testId, 'statusCode'], 200);
    });
    it('pulls the same node', async () => {
        expect(graph).toEqual({
            nodes: {
                [testId]: {
                    id: testId,
                    name: 'Test Node',
                    prop: 'value1',
                },
            },
        });
    });

    describe('two more nodes', () => {
        beforeEach(async () => {
            pushResult = await api.push({
                nodes: {
                    [`${testId}-1`]: {
                        id: `${testId}-1`,
                        name: 'Test Node 1',
                        prop: 'value1',
                    },
                    [`${testId}-2`]: {
                        id: `${testId}-2`,
                        name: 'Test Node 2',
                        prop: 'value1',
                    },
                },
            });
            graph = await api.pull({
                [testId]: {
                    include: { node: true },
                },
                [`${testId}-1`]: {
                    include: { node: true },
                },
                [`${testId}-2`]: {
                    include: { node: true },
                },
            });
        });
        afterEach(async () => {
            await adminApi.push({
                nodes: {
                    [`${testId}-1`]: false,
                    [`${testId}-2`]: false,
                },
            });
        });

        it('pushes two more nodes', async () => {
            expect(pushResult).toHaveProperty(['nodes', `${testId}-1`, 'statusCode'], 200);
            expect(pushResult).toHaveProperty(['nodes', `${testId}-2`, 'statusCode'], 200);
        });
        it('pulls all three nodes', async () => {
            expect(graph).toHaveProperty(['nodes', testId, 'id'], testId);
            expect(graph).toHaveProperty(['nodes', `${testId}-1`, 'id'], `${testId}-1`);
            expect(graph).toHaveProperty(['nodes', `${testId}-2`, 'id'], `${testId}-2`);
        });
    });

    describe('update node', () => {
        beforeEach(async () => {
            pushResult = await api.push({
                nodes: {
                    [testId]: {
                        id: testId,
                        name: 'Test Node',
                        prop: 'value2',
                    },
                },
            });
            graph = await api.pull({
                [testId]: {
                    include: { node: true },
                },
            });
        });

        it('pushes updated node', async () => {
            expect(pushResult).toEqual({ nodes: { [testId]: { statusCode: 200 } } });
        });
        it('pulls the updated node', async () => {
            expect(graph).toEqual({
                nodes: {
                    [testId]: {
                        id: testId,
                        name: 'Test Node',
                        prop: 'value2',
                    },
                },
            });
        });
    });
});
