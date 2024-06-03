import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import { type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import { createUserApi } from './shared';
import type { Graph, PushResult } from '@gothub/got-core';
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

describe('rights', () => {
    let pushResult: PushResult;
    let graph: Graph;
    beforeEach(async () => {
        await user1Api.push({
            nodes: {
                [`${testId}-1`]: { id: `${testId}-1` },
                [`${testId}-2`]: { id: `${testId}-2` },
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

    describe('pull', () => {
        beforeEach(async () => {
            graph = await user2Api.pull({
                [`${testId}-1`]: { include: { rights: true } },
                [`${testId}-2`]: { include: { rights: true } },
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

    describe('push', () => {
        beforeEach(async () => {
            pushResult = await user2Api.push({
                rights: {
                    [`${testId}-1`]: { user: { someEmail: { read: true } } },
                    [`${testId}-2`]: { user: { someEmail: { read: true } } },
                },
            });
            graph = await user1Api.pull({
                [`${testId}-1`]: { include: { rights: true } },
                [`${testId}-2`]: { include: { rights: true } },
            });
        });

        it('pushes rights for node 1', async () => {
            expect(pushResult).toHaveProperty(
                ['rights', `${testId}-1`, 'user', 'someEmail', 'read', 'statusCode'],
                200,
            );
        });
        it('does not push rights for node 2', async () => {
            expect(pushResult).toHaveProperty(
                ['rights', `${testId}-2`, 'user', 'someEmail', 'read', 'statusCode'],
                403,
            );
        });
        it('changes rights for node 1', async () => {
            expect(graph).toHaveProperty(['rights', `${testId}-1`, 'user', 'someEmail', 'read'], true);
        });
        it('does not change rights for node 2', async () => {
            expect(graph).not.toHaveProperty(['rights', `${testId}-2`, 'user', 'someEmail']);
        });
    });

    describe('delete', () => {
        beforeEach(async () => {
            pushResult = await user2Api.push({
                rights: {
                    [`${testId}-1`]: { user: { [user1Email]: { read: false } } },
                    [`${testId}-2`]: { user: { [user1Email]: { read: false } } },
                },
            });
            graph = await user1Api.pull({
                [`${testId}-1`]: { include: { rights: true } },
                [`${testId}-2`]: { include: { rights: true } },
            });
        });

        it('pushes rights for node 1 in delete mode', async () => {
            expect(pushResult).toHaveProperty(['rights', `${testId}-1`, 'user', user1Email, 'read', 'statusCode'], 200);
        });
        it('does not push rights for node 2', async () => {
            expect(pushResult).toHaveProperty(['rights', `${testId}-2`, 'user', user1Email, 'read', 'statusCode'], 403);
        });
        it('does not pull rights for node 1', async () => {
            expect(graph).not.toHaveProperty(['rights', `${testId}-1`, 'user', user1Email]);
        });
        it('pulls rights for node 2', async () => {
            expect(graph).toHaveProperty(['rights', `${testId}-2`, 'user', user1Email, 'read'], true);
        });
    });

    describe('inherit rights', () => {
        beforeEach(async () => {
            await user1Api.push({
                nodes: { [`${testId}-3`]: { id: `${testId}-3` } },
                rights: {
                    [`${testId}-2`]: {
                        user: {
                            otherUser: {
                                read: true,
                                write: true,
                            },
                        },
                    },
                },
            });
            pushResult = await user2Api.push({
                rights: {
                    [`${testId}-1`]: { inherit: { from: `${testId}-2` } },
                    [`${testId}-3`]: { inherit: { from: `${testId}-2` } },
                },
            });
            graph = await user1Api.pull({
                [`${testId}-1`]: { include: { rights: true } },
                [`${testId}-3`]: { include: { rights: true } },
            });
        });

        it('pushes inherit rights only for node 1', async () => {
            expect(pushResult).toHaveProperty(['rights', `${testId}-1`, 'inherit', 'statusCode'], 200);
            expect(pushResult).toHaveProperty(['rights', `${testId}-3`, 'inherit', 'statusCode'], 403);
        });
        it('pulls the same rights as on node 2 for user 1', async () => {
            expect(graph).toHaveProperty(['rights', `${testId}-1`, 'user', user1Email, 'read'], true);
            expect(graph).toHaveProperty(['rights', `${testId}-1`, 'user', user1Email, 'write'], true);
            expect(graph).toHaveProperty(['rights', `${testId}-1`, 'user', user1Email, 'admin'], true);
        });
        it('pulls the additional rights for otherUser same as on node 2', async () => {
            expect(graph).toHaveProperty(['rights', `${testId}-1`, 'user', 'otherUser', 'read'], true);
            expect(graph).toHaveProperty(['rights', `${testId}-1`, 'user', 'otherUser', 'write'], true);
        });
        it('has removed all rights for user 2', async () => {
            expect(graph).not.toHaveProperty(['rights', `${testId}-1`, 'user', user2Email]);
        });
        it('keeps only the rights for user 1 on node 3', async () => {
            expect(graph).not.toHaveProperty(['rights', `${testId}-3`, 'user', user2Email]);
            expect(graph).not.toHaveProperty(['rights', `${testId}-3`, 'user', 'otherUser']);
            expect(graph).toHaveProperty(['rights', `${testId}-3`, 'user', user1Email, 'read'], true);
            expect(graph).toHaveProperty(['rights', `${testId}-3`, 'user', user1Email, 'write'], true);
            expect(graph).toHaveProperty(['rights', `${testId}-3`, 'user', user1Email, 'admin'], true);
        });
    });
});
