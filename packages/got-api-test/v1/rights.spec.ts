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

describe('rights', () => {
    let pushResult: PushResult;
    let graph: Graph;
    beforeEach(async () => {
        await fixture.user1Api.push({
            nodes: {
                [`${fixture.testId}-1`]: { id: `${fixture.testId}-1` },
                [`${fixture.testId}-2`]: { id: `${fixture.testId}-2` },
            },
            rights: {
                [`${fixture.testId}-1`]: {
                    user: {
                        [fixture.user2Email]: {
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
            graph = await fixture.user2Api.pull({
                [`${fixture.testId}-1`]: { include: { rights: true } },
                [`${fixture.testId}-2`]: { include: { rights: true } },
            });
        });

        it('pulls rights for node 1', async () => {
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-1`, 'user', fixture.user1Email, 'read'], true);
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-1`, 'user', fixture.user1Email, 'write'], true);
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-1`, 'user', fixture.user1Email, 'admin'], true);
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-1`, 'user', fixture.user2Email, 'read'], true);
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-1`, 'user', fixture.user2Email, 'admin'], true);
        });

        it('does not pull rights for node 2', async () => {
            expect(graph).not.toHaveProperty(['rights', `${fixture.testId}-2`]);
        });
    });

    describe('push', () => {
        beforeEach(async () => {
            pushResult = await fixture.user2Api.push({
                rights: {
                    [`${fixture.testId}-1`]: { user: { someEmail: { read: true } } },
                    [`${fixture.testId}-2`]: { user: { someEmail: { read: true } } },
                },
            });
            graph = await fixture.user1Api.pull({
                [`${fixture.testId}-1`]: { include: { rights: true } },
                [`${fixture.testId}-2`]: { include: { rights: true } },
            });
        });

        it('pushes rights for node 1', async () => {
            expect(pushResult).toHaveProperty(
                ['rights', `${fixture.testId}-1`, 'user', 'someEmail', 'read', 'statusCode'],
                200,
            );
        });
        it('does not push rights for node 2', async () => {
            expect(pushResult).toHaveProperty(
                ['rights', `${fixture.testId}-2`, 'user', 'someEmail', 'read', 'statusCode'],
                403,
            );
        });
        it('changes rights for node 1', async () => {
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-1`, 'user', 'someEmail', 'read'], true);
        });
        it('does not change rights for node 2', async () => {
            expect(graph).not.toHaveProperty(['rights', `${fixture.testId}-2`, 'user', 'someEmail']);
        });
    });

    describe('delete', () => {
        beforeEach(async () => {
            pushResult = await fixture.user2Api.push({
                rights: {
                    [`${fixture.testId}-1`]: { user: { [fixture.user1Email]: { read: false } } },
                    [`${fixture.testId}-2`]: { user: { [fixture.user1Email]: { read: false } } },
                },
            });
            graph = await fixture.user1Api.pull({
                [`${fixture.testId}-1`]: { include: { rights: true } },
                [`${fixture.testId}-2`]: { include: { rights: true } },
            });
        });

        it('pushes rights for node 1 in delete mode', async () => {
            expect(pushResult).toHaveProperty(
                ['rights', `${fixture.testId}-1`, 'user', fixture.user1Email, 'read', 'statusCode'],
                200,
            );
        });
        it('does not push rights for node 2', async () => {
            expect(pushResult).toHaveProperty(
                ['rights', `${fixture.testId}-2`, 'user', fixture.user1Email, 'read', 'statusCode'],
                403,
            );
        });
        it('does not pull rights for node 1', async () => {
            expect(graph).not.toHaveProperty(['rights', `${fixture.testId}-1`, 'user', fixture.user1Email]);
        });
        it('pulls rights for node 2', async () => {
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-2`, 'user', fixture.user1Email, 'read'], true);
        });
    });

    describe('inherit rights', () => {
        beforeEach(async () => {
            await fixture.user1Api.push({
                nodes: { [`${fixture.testId}-3`]: { id: `${fixture.testId}-3` } },
                rights: {
                    [`${fixture.testId}-2`]: {
                        user: {
                            otherUser: {
                                read: true,
                                write: true,
                            },
                        },
                    },
                },
            });
            pushResult = await fixture.user2Api.push({
                rights: {
                    [`${fixture.testId}-1`]: { inherit: { from: `${fixture.testId}-2` } },
                    [`${fixture.testId}-3`]: { inherit: { from: `${fixture.testId}-2` } },
                },
            });
            graph = await fixture.user1Api.pull({
                [`${fixture.testId}-1`]: { include: { rights: true } },
                [`${fixture.testId}-3`]: { include: { rights: true } },
            });
        });

        it('pushes inherit rights only for node 1', async () => {
            expect(pushResult).toHaveProperty(['rights', `${fixture.testId}-1`, 'inherit', 'statusCode'], 200);
            expect(pushResult).toHaveProperty(['rights', `${fixture.testId}-3`, 'inherit', 'statusCode'], 403);
        });
        it('pulls the same rights as on node 2 for user 1', async () => {
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-1`, 'user', fixture.user1Email, 'read'], true);
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-1`, 'user', fixture.user1Email, 'write'], true);
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-1`, 'user', fixture.user1Email, 'admin'], true);
        });
        it('pulls the additional rights for otherUser same as on node 2', async () => {
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-1`, 'user', 'otherUser', 'read'], true);
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-1`, 'user', 'otherUser', 'write'], true);
        });
        it('has removed all rights for user 2', async () => {
            expect(graph).not.toHaveProperty(['rights', `${fixture.testId}-1`, 'user', fixture.user2Email]);
        });
        it('keeps only the rights for user 1 on node 3', async () => {
            expect(graph).not.toHaveProperty(['rights', `${fixture.testId}-3`, 'user', fixture.user2Email]);
            expect(graph).not.toHaveProperty(['rights', `${fixture.testId}-3`, 'user', 'otherUser']);
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-3`, 'user', fixture.user1Email, 'read'], true);
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-3`, 'user', fixture.user1Email, 'write'], true);
            expect(graph).toHaveProperty(['rights', `${fixture.testId}-3`, 'user', fixture.user1Email, 'admin'], true);
        });
    });
});
