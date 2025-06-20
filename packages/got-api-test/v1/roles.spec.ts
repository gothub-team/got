import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import type { Graph, PushResult } from '@gothub/got-core';
import type { TestFixture } from './shared/fixture.type';
import { createFixture } from './shared/create-fixture';

let fixture: TestFixture;
beforeAll(async () => {
    fixture = createFixture();
    await fixture.setup();
});
beforeEach(async () => {
    fixture.setTestId();
});

describe('roles', () => {
    let graph: Graph;
    let pushResult: PushResult;
    beforeEach(async () => {
        await fixture.user1Api.push({
            nodes: {
                [fixture.testId]: { id: fixture.testId },
                [`${fixture.testId}-role`]: { id: `${fixture.testId}-role` },
            },
        });
    });

    describe('public role exists', () => {
        beforeEach(async () => {
            await fixture.user1Api
                .push({
                    rights: {
                        [fixture.testId]: { role: { public: { read: true } } },
                    },
                })
                .catch(async (err) => {
                    console.error(await err);
                });
            graph = await fixture.user2Api.pull({
                [fixture.testId]: {
                    role: 'public',
                    include: { node: true },
                },
            });
        });

        it('pulls node as public user', () => {
            expect(graph).toHaveProperty(['nodes', fixture.testId]);
        });
    });

    describe('public role does not exist', () => {
        beforeEach(async () => {
            graph = await fixture.user2Api.pull({
                [fixture.testId]: {
                    role: 'public',
                    include: { node: true },
                },
            });
        });

        it('does not pull node as public user', () => {
            expect(graph).not.toHaveProperty(['nodes', fixture.testId]);
        });
    });

    describe('user 2 has role', () => {
        beforeEach(async () => {
            await fixture.user1Api.push({
                rights: {
                    [`${fixture.testId}-role`]: { user: { [fixture.user2Email]: { read: true } } },
                },
            });
        });

        describe('role can read node', () => {
            beforeEach(async () => {
                await fixture.user1Api.push({
                    rights: {
                        [fixture.testId]: { role: { [`${fixture.testId}-role`]: { read: true } } },
                    },
                });
            });

            describe('user 1 can pull role rights', () => {
                beforeEach(async () => {
                    graph = await fixture.user1Api.pull({
                        [fixture.testId]: {
                            include: { rights: true },
                        },
                    });
                });

                it('pulls rights', () => {
                    expect(graph).toHaveProperty(
                        ['rights', fixture.testId, 'role', `${fixture.testId}-role`, 'read'],
                        true,
                    );
                });
            });

            describe('user 2 can pull', () => {
                beforeEach(async () => {
                    graph = await fixture.user2Api.pull({
                        [fixture.testId]: {
                            role: `${fixture.testId}-role`,
                            include: { node: true },
                        },
                    });
                });
                it('pulls node as user 2', () => {
                    expect(graph).toHaveProperty(['nodes', fixture.testId]);
                });
            });
        });

        describe('role cannot read node', () => {
            beforeEach(async () => {
                graph = await fixture.user2Api.pull({
                    [fixture.testId]: {
                        role: `${fixture.testId}-role`,
                        include: { node: true },
                    },
                });
            });

            it('does not pull node as user 2', () => {
                expect(graph).not.toHaveProperty(['nodes', fixture.testId]);
            });
        });

        describe('role can write node', () => {
            beforeEach(async () => {
                await fixture.user1Api.push({
                    rights: {
                        [fixture.testId]: { role: { [`${fixture.testId}-role`]: { write: true } } },
                    },
                });
                pushResult = await fixture.user2Api.push(
                    {
                        nodes: { [fixture.testId]: { id: fixture.testId, prop: 'hallo' } },
                    },
                    `${fixture.testId}-role`,
                );
            });

            it('writes node', async () => {
                expect(pushResult).toHaveProperty(['nodes', fixture.testId, 'statusCode'], 200);
            });
        });

        describe('role cannot write node', () => {
            beforeEach(async () => {
                pushResult = await fixture.user2Api.push(
                    {
                        nodes: { [fixture.testId]: { id: fixture.testId, prop: 'hallo' } },
                    },
                    `${fixture.testId}-role`,
                );
            });

            it('does not write node', async () => {
                expect(pushResult).toHaveProperty(['nodes', fixture.testId, 'statusCode'], 403);
            });
        });

        describe('role can admin node', () => {
            beforeEach(async () => {
                await fixture.user1Api.push({
                    rights: {
                        [fixture.testId]: { role: { [`${fixture.testId}-role`]: { read: true, admin: true } } },
                    },
                });
            });

            describe('push and pull right', () => {
                beforeEach(async () => {
                    pushResult = await fixture.user2Api.push(
                        {
                            rights: {
                                [fixture.testId]: { user: { otherUser: { read: true } } },
                            },
                        },
                        `${fixture.testId}-role`,
                    );
                    graph = await fixture.user2Api.pull({
                        [fixture.testId]: {
                            role: `${fixture.testId}-role`,
                            include: { rights: true },
                        },
                    });
                });
                it('writes right', async () => {
                    expect(pushResult).toHaveProperty(
                        ['rights', fixture.testId, 'user', 'otherUser', 'read', 'statusCode'],
                        200,
                    );
                });
                it('pulls rights', async () => {
                    expect(graph).toHaveProperty(['rights', fixture.testId, 'user', 'otherUser', 'read'], true);
                });
            });

            describe('inherit rights as role', () => {
                beforeEach(async () => {
                    await fixture.user1Api.push({
                        nodes: {
                            [`${fixture.testId}-2`]: { id: `${fixture.testId}-2` },
                        },
                    });
                    pushResult = await fixture.user2Api.push(
                        {
                            rights: {
                                [fixture.testId]: { inherit: { from: `${fixture.testId}-2` } },
                            },
                        },
                        `${fixture.testId}-role`,
                    );
                    graph = await fixture.user2Api.pull({
                        [fixture.testId]: {
                            role: `${fixture.testId}-role`,
                            include: { rights: true },
                        },
                    });
                });

                it('pushes inherit rights', async () => {
                    expect(pushResult).toHaveProperty(['rights', fixture.testId, 'inherit', 'statusCode'], 200);
                });
            });
        });

        describe('role cannot admin node', () => {
            beforeEach(async () => {
                pushResult = await fixture.user2Api.push(
                    {
                        rights: {
                            [fixture.testId]: { user: { [`otherUser`]: { read: true } } },
                        },
                    },
                    `${fixture.testId}-role`,
                );
            });

            it('does not write node', async () => {
                expect(pushResult).toHaveProperty(
                    ['rights', fixture.testId, 'user', 'otherUser', 'read', 'statusCode'],
                    403,
                );
            });
        });
    });

    describe('user 2 does not have role', () => {
        describe('role can read, write, admin node', () => {
            beforeEach(async () => {
                await fixture.user1Api.push({
                    rights: {
                        [fixture.testId]: {
                            role: { [`${fixture.testId}-role`]: { read: true, write: true, admin: true } },
                        },
                    },
                });
                graph = await fixture.user2Api.pull({
                    [fixture.testId]: {
                        role: `${fixture.testId}-role`,
                        include: { node: true },
                    },
                });
                pushResult = await fixture.user2Api.push(
                    {
                        nodes: { [fixture.testId]: { id: fixture.testId, prop: 'hallo' } },
                        rights: {
                            [fixture.testId]: { user: { otherUser: { read: true } } },
                        },
                    },
                    `${fixture.testId}-role`,
                );
            });

            it('does not pull node', () => {
                expect(graph).not.toHaveProperty(['nodes', fixture.testId]);
            });
            it('does not write node', async () => {
                expect(pushResult).toHaveProperty(['nodes', fixture.testId, 'statusCode'], 403);
            });
            it('does not write rights', async () => {
                expect(pushResult).toHaveProperty(
                    ['rights', fixture.testId, 'user', 'otherUser', 'read', 'statusCode'],
                    403,
                );
            });
        });
    });

    describe('inherit role', () => {
        beforeEach(async () => {
            await fixture.user1Api.push({
                nodes: {
                    [`${fixture.testId}-2`]: { id: `${fixture.testId}-2` },
                    [`${fixture.testId}-role`]: { id: `${fixture.testId}-role` },
                },
                rights: {
                    [fixture.testId]: { role: { [`${fixture.testId}-role`]: { read: true } } },
                },
            });
            pushResult = await fixture.user1Api.push({
                rights: {
                    [`${fixture.testId}-2`]: { inherit: { from: fixture.testId } },
                },
            });
            graph = await fixture.user1Api.pull({
                [`${fixture.testId}-2`]: {
                    include: { rights: true },
                },
            });
        });

        it('pushes inherit', async () => {
            expect(pushResult).toHaveProperty(['rights', `${fixture.testId}-2`, 'inherit', 'statusCode'], 200);
        });

        it('inherited role from node', async () => {
            expect(graph).toHaveProperty(
                ['rights', `${fixture.testId}-2`, 'role', `${fixture.testId}-role`, 'read'],
                true,
            );
        });
    });
});
