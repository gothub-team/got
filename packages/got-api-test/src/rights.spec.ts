import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import { type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import { env } from '../env';
import { createUserApi } from './shared';
import type { Graph } from '@gothub-team/got-core';

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

describe('rights', () => {
    // let pushResult: PushResult;
    let graph: Graph;
    beforeEach(async () => {
        await user1Api.push({
            nodes: {
                [`${testId}-1`]: {
                    id: `${testId}-1`,
                },
                [`${testId}-2`]: {
                    id: `${testId}-2`,
                },
            },
            rights: {
                [`${testId}-1`]: {
                    user: {
                        [user2Email]: {
                            read: true,
                            admin: true,
                        },
                    },
                },
            },
        });
    });

    describe('pull rights', () => {
        beforeEach(async () => {
            graph = await user2Api.pull({
                [`${testId}-1`]: {
                    include: {
                        rights: true,
                    },
                },
                [`${testId}-2`]: {
                    include: {
                        rights: true,
                    },
                },
            });
        });

        it('pulls rights for node 1', async () => {
            expect(graph).toHaveProperty(['rights', `${testId}-1`, 'user', user1Email, 'read'], true);
            expect(graph).toHaveProperty(['rights', `${testId}-1`, 'user', user1Email, 'write'], true);
            expect(graph).toHaveProperty(['rights', `${testId}-1`, 'user', user1Email, 'admin'], true);
            expect(graph).toHaveProperty(['rights', `${testId}-1`, 'user', user2Email, 'read'], true);
            expect(graph).toHaveProperty(['rights', `${testId}-1`, 'user', user2Email, 'admin'], true);
        });

        it('does not pull rights for node 2', async () => {
            expect(graph).not.toHaveProperty(['rights', `${testId}-2`]);
        });
    });
});
