import { describe, beforeAll, afterAll, beforeEach, afterEach } from 'bun:test';
import { createApi } from '@gothub/got-api';
import crypto from 'crypto';
// import type { Graph, PushResult } from '@gothub-team/got-core';
import { createAdminApi } from './shared';
import { env } from '../env';

let adminApi: ReturnType<typeof createApi>;
let testId: string;
// let user1Api: GotApi;
let user1Email: string;
// let user2Api: GotApi;
let user2Email: string;
beforeAll(async () => {
    adminApi = await createAdminApi();
    user1Email = env.TEST_USER_1_EMAIL;
    // user1Api = await createNewUserApi(adminApi, user1Email);
    user2Email = env.TEST_USER_2_EMAIL;
    // user2Api = await createNewUserApi(adminApi, user2Email);
});
beforeEach(async () => {
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
});
afterAll(async () => {
    await adminApi.deleteUser({ email: user1Email });
    await adminApi.deleteUser({ email: user2Email });
});

describe('rights', () => {
    // let pushResult: PushResult;
    // let graph: Graph;
    beforeEach(async () => {
        // pushResult = await user1Api.push({
        //     nodes: {
        //         [testId]: {
        //             id: testId,
        //         },
        //     },
        // });
    });
    afterEach(async () => {
        await adminApi.push({ nodes: { [testId]: false } });
    });

    describe('user1 pushes a node', () => {});
});
