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

describe('edges', () => {
    let pushResult: PushResult;
    let graph: Graph;
    beforeEach(async () => {
        pushResult = await fixture.user1Api.push({
            nodes: {
                [`${fixture.testId}-1`]: { id: `${fixture.testId}-1` },
                [`${fixture.testId}-2`]: { id: `${fixture.testId}-2` },
            },
            edges: {
                from: { [`${fixture.testId}-1`]: { to: { [`${fixture.testId}-2`]: true } } },
            },
        });
        graph = await fixture.user1Api.pull({
            [`${fixture.testId}-1`]: {
                edges: {
                    'from/to': {
                        include: {
                            edges: true,
                        },
                    },
                },
            },
        });
    });

    describe('one edge', () => {
        it('pushes the edge', () => {
            expect(pushResult).toHaveProperty(
                ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`, 'statusCode'],
                200,
            );
        });
        it('pulls the edge', () => {
            expect(graph).toHaveProperty(['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`], true);
        });
    });

    describe('two more edges', () => {
        beforeEach(async () => {
            pushResult = await fixture.user1Api.push({
                nodes: {
                    [`${fixture.testId}-3`]: { id: `${fixture.testId}-3` },
                    [`${fixture.testId}-4`]: { id: `${fixture.testId}-4` },
                },
                edges: {
                    from: {
                        [`${fixture.testId}-1`]: {
                            to: {
                                [`${fixture.testId}-3`]: true,
                                [`${fixture.testId}-4`]: true,
                            },
                        },
                    },
                },
            });
            graph = await fixture.user1Api.pull({
                [`${fixture.testId}-1`]: { edges: { 'from/to': { include: { edges: true } } } },
            });
        });

        describe('push and pull', () => {
            it('pushes the edges', () => {
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-3`, 'statusCode'],
                    200,
                );
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-4`, 'statusCode'],
                    200,
                );
            });
            it('pulls the new edges and the old edge', () => {
                expect(graph).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`],
                    true,
                );
                expect(graph).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-3`],
                    true,
                );
                expect(graph).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-4`],
                    true,
                );
            });
        });

        describe('delete edges', () => {
            beforeEach(async () => {
                pushResult = await fixture.user1Api.push({
                    edges: {
                        from: {
                            [`${fixture.testId}-1`]: {
                                to: {
                                    [`${fixture.testId}-2`]: false,
                                    [`${fixture.testId}-4`]: false,
                                },
                            },
                        },
                    },
                });
                graph = await fixture.user1Api.pull({
                    [`${fixture.testId}-1`]: { edges: { 'from/to': { include: { edges: true } } } },
                });
            });

            it('pushes the edges in delete mode', () => {
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`, 'statusCode'],
                    200,
                );
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-4`, 'statusCode'],
                    200,
                );
            });
            it('pulls the only left edge', () => {
                expect(graph).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-3`],
                    true,
                );
                expect(graph).not.toHaveProperty(['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`]);
                expect(graph).not.toHaveProperty(['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-4`]);
            });
        });

        describe('reverse edges', () => {
            beforeEach(async () => {
                await fixture.user1Api.push({
                    edges: {
                        from: { [`${fixture.testId}-2`]: { to: { [`${fixture.testId}-3`]: true } } },
                    },
                });
                graph = await fixture.user1Api.pull({
                    [`${fixture.testId}-3`]: { edges: { 'from/to': { reverse: true, include: { edges: true } } } },
                });
                graph.index?.reverseEdges;
            });

            it('pulls all edges to node 3', () => {
                expect(graph).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-3`],
                    true,
                );
                expect(graph).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-2`, 'to', `${fixture.testId}-3`],
                    true,
                );
            });
            it('sends the reverse index', () => {
                expect(graph).toHaveProperty(
                    ['index', 'reverseEdges', 'to', `${fixture.testId}-3`, 'from', `${fixture.testId}-1`],
                    true,
                );
                expect(graph).toHaveProperty(
                    ['index', 'reverseEdges', 'to', `${fixture.testId}-3`, 'from', `${fixture.testId}-2`],
                    true,
                );
            });
        });
    });

    describe('nested edges', () => {
        beforeEach(async () => {
            pushResult = await fixture.user1Api.push({
                nodes: {
                    [`${fixture.testId}-3`]: { id: `${fixture.testId}-3` },
                    [`${fixture.testId}-4`]: { id: `${fixture.testId}-4` },
                },
                edges: {
                    from: {
                        [`${fixture.testId}-2`]: { to: { [`${fixture.testId}-3`]: true } },
                        [`${fixture.testId}-3`]: { to: { [`${fixture.testId}-4`]: true } },
                    },
                },
            });
            graph = await fixture.user1Api.pull({
                [`${fixture.testId}-1`]: {
                    edges: {
                        'from/to': {
                            include: { edges: true },
                            edges: {
                                'from/to': { include: { edges: true } },
                            },
                        },
                    },
                },
            });
        });

        describe('push and pull', () => {
            it('pushes the edges', () => {
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-2`, 'to', `${fixture.testId}-3`, 'statusCode'],
                    200,
                );
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-3`, 'to', `${fixture.testId}-4`, 'statusCode'],
                    200,
                );
            });
            it('pulls the edge 1 level nested and the old edge', () => {
                expect(graph).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`],
                    true,
                );
                expect(graph).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-2`, 'to', `${fixture.testId}-3`],
                    true,
                );
                expect(graph).not.toHaveProperty(['edges', 'from', `${fixture.testId}-3`, 'to', `${fixture.testId}-4`]);
            });
        });

        describe('reverse edges', () => {
            beforeEach(async () => {
                graph = await fixture.user1Api.pull({
                    [`${fixture.testId}-4`]: {
                        edges: {
                            'from/to': {
                                reverse: true,
                                include: { edges: true },
                                edges: {
                                    'from/to': {
                                        reverse: true,
                                        include: { edges: true },
                                    },
                                },
                            },
                        },
                    },
                });
            });

            it('follows edges back two levels', () => {
                expect(graph).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-3`, 'to', `${fixture.testId}-4`],
                    true,
                );
                expect(graph).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-2`, 'to', `${fixture.testId}-3`],
                    true,
                );
            });
        });
    });

    describe('read rights', () => {
        beforeEach(async () => {
            await fixture.user1Api.push({
                nodes: {
                    [`${fixture.testId}-3`]: { id: `${fixture.testId}-3` },
                },
                edges: {
                    from: {
                        [`${fixture.testId}-1`]: {
                            to: { [`${fixture.testId}-2`]: true, [`${fixture.testId}-3`]: true },
                        },
                    },
                },
                rights: {
                    [`${fixture.testId}-1`]: { user: { [fixture.user2Email]: { read: true } } },
                    [`${fixture.testId}-2`]: { user: { [fixture.user2Email]: { read: true } } },
                },
            });
            graph = await fixture.user2Api.pull({
                [`${fixture.testId}-1`]: {
                    edges: {
                        'from/to': {
                            include: {
                                edges: true,
                            },
                        },
                    },
                },
            });
        });

        describe('push and pull', () => {
            it('can pull the edge with read rights for both ends', () => {
                expect(graph).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`],
                    true,
                );
            });
            it('cannot pull the edge with read rights missing at one end', () => {
                expect(graph).not.toHaveProperty(['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-3`]);
            });
        });

        describe('non-existing to-node', () => {
            beforeEach(async () => {
                await fixture.user1Api.push({
                    nodes: {
                        [`${fixture.testId}-3`]: false,
                    },
                    rights: {
                        [`${fixture.testId}-3`]: { user: { [fixture.user2Email]: { read: true } } },
                    },
                });
                graph = await fixture.user2Api.pull({
                    [`${fixture.testId}-1`]: { edges: { 'from/to': { include: { edges: true } } } },
                });
            });

            it('does only pull the edge with two existing nodes', () => {
                expect(graph).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`],
                    true,
                );
                expect(graph).not.toHaveProperty(['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-3`]);
            });
        });

        describe('non-existing from-node', () => {
            beforeEach(async () => {
                await fixture.user1Api.push({
                    nodes: {
                        [`${fixture.testId}-1`]: false,
                    },
                    rights: {
                        [`${fixture.testId}-3`]: { user: { [fixture.user2Email]: { read: true } } },
                    },
                });
                graph = await fixture.user2Api.pull({
                    [`${fixture.testId}-1`]: { edges: { 'from/to': { include: { edges: true } } } },
                });
            });

            it('does not pull the edge', () => {
                expect(graph).not.toHaveProperty(['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`]);
                expect(graph).not.toHaveProperty(['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-3`]);
            });
        });
    });

    describe('write rights', () => {
        beforeEach(async () => {
            await fixture.user1Api.push({
                nodes: {
                    [`${fixture.testId}-3`]: { id: `${fixture.testId}-3` },
                },
                rights: {
                    [`${fixture.testId}-1`]: { user: { [fixture.user2Email]: { write: true } } },
                    [`${fixture.testId}-2`]: { user: { [fixture.user2Email]: { write: true } } },
                },
            });
            pushResult = await fixture.user2Api.push({
                edges: {
                    from: {
                        [`${fixture.testId}-1`]: {
                            to: {
                                [`${fixture.testId}-2`]: true,
                                [`${fixture.testId}-3`]: true,
                            },
                        },
                    },
                },
            });
            graph = await fixture.user1Api.pull({
                [`${fixture.testId}-1`]: { edges: { 'from/to': { include: { edges: true } } } },
            });
        });

        describe('push and pull', () => {
            it('pushes the edge where for both nodes are write rights', () => {
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`, 'statusCode'],
                    200,
                );
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-3`, 'statusCode'],
                    403,
                );
            });
            it('pulls only the edge that was pushed', () => {
                expect(graph).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`],
                    true,
                );
                expect(graph).not.toHaveProperty(['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-3`]);
            });
        });

        describe('delete edges', () => {
            beforeEach(async () => {
                await fixture.user1Api.push({
                    edges: {
                        from: { [`${fixture.testId}-1`]: { to: { [`${fixture.testId}-3`]: true } } },
                    },
                });
                pushResult = await fixture.user2Api.push({
                    edges: {
                        from: {
                            [`${fixture.testId}-1`]: {
                                to: {
                                    [`${fixture.testId}-2`]: false,
                                    [`${fixture.testId}-3`]: false,
                                },
                            },
                        },
                    },
                });
                graph = await fixture.user1Api.pull({
                    [`${fixture.testId}-1`]: { edges: { 'from/to': { include: { edges: true } } } },
                });
            });

            it('pushes the edges in delete mode', () => {
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`, 'statusCode'],
                    200,
                );
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-3`, 'statusCode'],
                    403,
                );
            });
            it('pulls only the edge that was not deleted', () => {
                expect(graph).not.toHaveProperty(['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`]);
                expect(graph).toHaveProperty(
                    ['edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-3`],
                    true,
                );
            });
        });
    });
});
