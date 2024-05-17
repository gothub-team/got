import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import { type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import type { Graph, PushResult } from '@gothub/got-core';
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

describe('roles', () => {
    let graph: Graph;
    let pushResult: PushResult;
    beforeEach(async () => {
        await user1Api.push({
            nodes: { [testId]: { id: testId } },
        });
    });

    describe('public role exists', () => {
        beforeEach(async () => {
            await user1Api
                .push({
                    rights: {
                        [testId]: { role: { public: { read: true } } },
                    },
                })
                .catch(async (err) => {
                    console.error(await err);
                });
            graph = await user2Api.pull({
                [testId]: {
                    role: 'public',
                    include: { node: true },
                },
            });
        });

        it('pulls node as public user', () => {
            expect(graph).toHaveProperty(['nodes', testId]);
        });
    });

    describe('public role does not exist', () => {
        beforeEach(async () => {
            graph = await user2Api.pull({
                [testId]: {
                    role: 'public',
                    include: { node: true },
                },
            });
        });

        it('does not pull node as public user', () => {
            expect(graph).not.toHaveProperty(['nodes', testId]);
        });
    });

    describe('user 2 has role', () => {
        beforeEach(async () => {
            await user1Api.push({
                nodes: {
                    [`${testId}-role`]: { id: `${testId}-role` },
                },
                rights: {
                    [`${testId}-role`]: { user: { [user2Email]: { read: true } } },
                },
            });
        });

        describe('role can read node 1', () => {
            beforeEach(async () => {
                await user1Api.push({
                    rights: {
                        [testId]: { role: { [`${testId}-role`]: { read: true } } },
                    },
                });
                graph = await user2Api.pull({
                    [testId]: {
                        role: `${testId}-role`,
                        include: { node: true },
                    },
                });
            });

            it('pulls node 1 as user 2', () => {
                expect(graph).toHaveProperty(['nodes', testId]);
            });
        });

        describe('role cannot read node 1', () => {
            beforeEach(async () => {
                graph = await user2Api.pull({
                    [testId]: {
                        role: `${testId}-role`,
                        include: { node: true },
                    },
                });
            });

            it('does not pull node 1 as user 2', () => {
                expect(graph).not.toHaveProperty(['nodes', testId]);
            });
        });

        describe('role can write node 1', () => {
            beforeEach(async () => {
                await user1Api.push({
                    rights: {
                        [testId]: { role: { [`${testId}-role`]: { write: true } } },
                    },
                });
                pushResult = await user2Api.push(
                    {
                        nodes: { [testId]: { id: testId, prop: 'hallo' } },
                    },
                    `${testId}-role`,
                );
            });

            it('writes node 1', async () => {
                expect(pushResult).toHaveProperty(['nodes', testId, 'statusCode'], 200);
            });
        });

        describe('role cannot write node 1', () => {
            beforeEach(async () => {
                pushResult = await user2Api.push(
                    {
                        nodes: { [testId]: { id: testId, prop: 'hallo' } },
                    },
                    `${testId}-role`,
                );
            });

            it('does not write node 1', async () => {
                expect(pushResult).toHaveProperty(['nodes', testId, 'statusCode'], 403);
            });
        });

        describe('role can admin node 1', () => {
            beforeEach(async () => {
                await user1Api.push({
                    rights: {
                        [testId]: { role: { [`${testId}-role`]: { admin: true } } },
                    },
                });
                pushResult = await user2Api.push(
                    {
                        rights: {
                            [testId]: { user: { [`otherUser`]: { read: true } } },
                        },
                    },
                    `${testId}-role`,
                );
            });

            it('writes node 1', async () => {
                expect(pushResult).toHaveProperty(['rights', testId, 'user', 'otherUser', 'read', 'statusCode'], 200);
            });
        });

        describe('role cannot admin node 1', () => {
            beforeEach(async () => {
                pushResult = await user2Api.push(
                    {
                        rights: {
                            [testId]: { user: { [`otherUser`]: { read: true } } },
                        },
                    },
                    `${testId}-role`,
                );
            });

            it('does not write node 1', async () => {
                expect(pushResult).toHaveProperty(['rights', testId, 'user', 'otherUser', 'read', 'statusCode'], 403);
            });
        });
    });
});
