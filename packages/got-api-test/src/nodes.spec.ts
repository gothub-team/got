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

describe('new node', () => {
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
        expect(pushResult).toEqual({ nodes: { [testId]: { statusCode: 200 } } });
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
});
