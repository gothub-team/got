import { describe, beforeAll, beforeEach, afterEach } from 'bun:test';
import { createApi, type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import { env } from '../env';
import { createUserApi } from './shared';

let adminApi: ReturnType<typeof createApi>;
let testId: string;
let user1Api: GotApi;
let user1Email: string;
// let user2Api: GotApi;
// let user2Email: string;
beforeAll(async () => {
    user1Email = env.TEST_USER_1_EMAIL;
    user1Api = await createUserApi(user1Email, env.TEST_USER_1_PW);
    // user2Email = env.TEST_USER_2_EMAIL;
    // user2Api = await createNewUserApi(user2Email, env.TEST_USER_2_PW);
});
beforeEach(async () => {
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
});

describe('rights', () => {
    // let pushResult: PushResult;
    // let graph: Graph;
    beforeEach(async () => {
        await user1Api.push({
            nodes: {
                [testId]: {
                    id: testId,
                },
            },
        });
    });
    afterEach(async () => {
        await adminApi.push({ nodes: { [testId]: false } });
    });

    describe('user1 pushes a node', () => {});
});
