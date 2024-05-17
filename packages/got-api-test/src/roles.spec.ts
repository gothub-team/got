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

        describe('role can read node', () => {
            beforeEach(async () => {
                await user1Api.push({
                    rights: {
                        [testId]: { role: { [`${testId}-role`]: { read: true } } },
                    },
                });
            });

            describe('user 1 can pull role rights', () => {
                beforeEach(async () => {
                    graph = await user1Api.pull({
                        [testId]: {
                            include: { rights: true },
                        },
                    });
                });

                it('pulls rights', () => {
                    expect(graph).toHaveProperty(['rights', testId, 'role', `${testId}-role`, 'read'], true);
                });
            });

            describe('user 2 can pull', () => {
                beforeEach(async () => {
                    graph = await user2Api.pull({
                        [testId]: {
                            role: `${testId}-role`,
                            include: { node: true },
                        },
                    });
                });
                it('pulls node as user 2', () => {
                    expect(graph).toHaveProperty(['nodes', testId]);
                });
            });
        });

        describe('role cannot read node', () => {
            beforeEach(async () => {
                graph = await user2Api.pull({
                    [testId]: {
                        role: `${testId}-role`,
                        include: { node: true },
                    },
                });
            });

            it('does not pull node as user 2', () => {
                expect(graph).not.toHaveProperty(['nodes', testId]);
            });
        });

        describe('role can write node', () => {
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

            it('writes node', async () => {
                expect(pushResult).toHaveProperty(['nodes', testId, 'statusCode'], 200);
            });
        });

        describe('role cannot write node', () => {
            beforeEach(async () => {
                pushResult = await user2Api.push(
                    {
                        nodes: { [testId]: { id: testId, prop: 'hallo' } },
                    },
                    `${testId}-role`,
                );
            });

            it('does not write node', async () => {
                expect(pushResult).toHaveProperty(['nodes', testId, 'statusCode'], 403);
            });
        });

        describe('role can admin node', () => {
            beforeEach(async () => {
                await user1Api.push({
                    rights: {
                        [testId]: { role: { [`${testId}-role`]: { admin: true } } },
                    },
                });
            });

            describe('push and pull right', () => {
                beforeEach(async () => {
                    pushResult = await user2Api.push(
                        {
                            rights: {
                                [testId]: { user: { otherUser: { read: true } } },
                            },
                        },
                        `${testId}-role`,
                    );
                    graph = await user2Api.pull({
                        [testId]: {
                            role: `${testId}-role`,
                            include: { rights: true },
                        },
                    });
                });
                it('writes right', async () => {
                    expect(pushResult).toHaveProperty(
                        ['rights', testId, 'user', 'otherUser', 'read', 'statusCode'],
                        200,
                    );
                });
                it.todo('pulls rights', async () => {
                    expect(graph).toHaveProperty(['rights', testId, 'user', 'otherUser', 'read'], true);
                });
            });

            describe('inherit rights', () => {
                beforeEach(async () => {
                    await user1Api.push({
                        nodes: {
                            [`${testId}-2`]: { id: `${testId}-2` },
                        },
                    });
                    pushResult = await user2Api.push(
                        {
                            rights: {
                                [testId]: { inherit: { from: `${testId}-2` } },
                            },
                        },
                        `${testId}-role`,
                    );
                    graph = await user2Api.pull({
                        [testId]: {
                            role: `${testId}-role`,
                            include: { rights: true },
                        },
                    });
                });

                it('pushes inherit rights', async () => {
                    expect(pushResult).toHaveProperty(['rights', testId, 'inherit', 'statusCode'], 200);
                });

                it.todo('inherited rights from node 2', async () => {
                    expect(true).toBe(false);
                });
            });
        });

        describe('role cannot admin node', () => {
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

            it('does not write node', async () => {
                expect(pushResult).toHaveProperty(['rights', testId, 'user', 'otherUser', 'read', 'statusCode'], 403);
            });
        });
    });
});
