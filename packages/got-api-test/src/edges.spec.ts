import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import { type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import type { Graph, PushResult } from '@gothub-team/got-core';
import { createNewUserApi } from './shared';
import { env } from '../env';

let testId: string;
let user1Api: GotApi;
let user1Email: string;
let user2Api: GotApi;
let user2Email: string;
beforeAll(async () => {
    user1Email = env.TEST_USER_1_EMAIL;
    user1Api = await createNewUserApi(user1Email, env.TEST_USER_1_PW);
    user2Email = env.TEST_USER_2_EMAIL;
    user2Api = await createNewUserApi(user2Email, env.TEST_USER_2_PW);
});
beforeEach(async () => {
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
});

describe('edges', () => {
    let pushResult: PushResult;
    let graph: Graph;
    beforeEach(async () => {
        pushResult = await user1Api.push({
            nodes: {
                [`${testId}-1`]: {
                    id: `${testId}-1`,
                },
                [`${testId}-2`]: {
                    id: `${testId}-2`,
                },
            },
            edges: {
                from: {
                    [`${testId}-1`]: {
                        to: { [`${testId}-2`]: true },
                    },
                },
            },
        });
        graph = await user1Api.pull({
            [`${testId}-1`]: {
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
            expect(pushResult).toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-2`, 'statusCode'], 200);
        });
        it('pulls the edge', () => {
            expect(graph).toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-2`], true);
        });
    });

    describe('two more edges', () => {
        beforeEach(async () => {
            pushResult = await user1Api.push({
                nodes: {
                    [`${testId}-3`]: {
                        id: `${testId}-3`,
                    },
                    [`${testId}-4`]: {
                        id: `${testId}-4`,
                    },
                },
                edges: {
                    from: {
                        [`${testId}-1`]: {
                            to: {
                                [`${testId}-3`]: true,
                                [`${testId}-4`]: true,
                            },
                        },
                    },
                },
            });
            graph = await user1Api.pull({
                [`${testId}-1`]: {
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
            it('pushes the edges', () => {
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${testId}-1`, 'to', `${testId}-3`, 'statusCode'],
                    200,
                );
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${testId}-1`, 'to', `${testId}-4`, 'statusCode'],
                    200,
                );
            });
            it('pulls the new edges and the old edge', () => {
                expect(graph).toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-2`], true);
                expect(graph).toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-3`], true);
                expect(graph).toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-4`], true);
            });
        });

        describe('delete edges', () => {
            beforeEach(async () => {
                pushResult = await user1Api.push({
                    edges: {
                        from: {
                            [`${testId}-1`]: {
                                to: {
                                    [`${testId}-2`]: false,
                                    [`${testId}-4`]: false,
                                },
                            },
                        },
                    },
                });
                graph = await user1Api.pull({
                    [`${testId}-1`]: {
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

            it('pushes the edges in delete mode', () => {
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${testId}-1`, 'to', `${testId}-2`, 'statusCode'],
                    200,
                );
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${testId}-1`, 'to', `${testId}-4`, 'statusCode'],
                    200,
                );
            });
            it('pulls the only left edge', () => {
                expect(graph).toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-3`], true);
                expect(graph).not.toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-2`]);
                expect(graph).not.toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-4`]);
            });
        });
    });

    describe('nested edges', () => {
        beforeEach(async () => {
            pushResult = await user1Api.push({
                nodes: {
                    [`${testId}-3`]: {
                        id: `${testId}-3`,
                    },
                    [`${testId}-4`]: {
                        id: `${testId}-4`,
                    },
                },
                edges: {
                    from: {
                        [`${testId}-2`]: {
                            to: {
                                [`${testId}-3`]: true,
                            },
                        },
                        [`${testId}-3`]: {
                            to: {
                                [`${testId}-4`]: true,
                            },
                        },
                    },
                },
            });
            graph = await user1Api.pull({
                [`${testId}-1`]: {
                    edges: {
                        'from/to': {
                            include: {
                                edges: true,
                            },
                            edges: {
                                'from/to': {
                                    include: {
                                        edges: true,
                                    },
                                },
                            },
                        },
                    },
                },
            });
        });

        it('pushes the edges', () => {
            expect(pushResult).toHaveProperty(['edges', 'from', `${testId}-2`, 'to', `${testId}-3`, 'statusCode'], 200);
            expect(pushResult).toHaveProperty(['edges', 'from', `${testId}-3`, 'to', `${testId}-4`, 'statusCode'], 200);
        });
        it('pulls the edge 1 level nested and the old edge', () => {
            expect(graph).toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-2`], true);
            expect(graph).toHaveProperty(['edges', 'from', `${testId}-2`, 'to', `${testId}-3`], true);
            expect(graph).not.toHaveProperty(['edges', 'from', `${testId}-3`, 'to', `${testId}-4`]);
        });
    });

    describe('read rights', () => {
        beforeEach(async () => {
            await user1Api.push({
                nodes: {
                    [`${testId}-3`]: {
                        id: `${testId}-3`,
                    },
                },
                edges: {
                    from: {
                        [`${testId}-1`]: {
                            to: {
                                [`${testId}-2`]: true,
                                [`${testId}-3`]: true,
                            },
                        },
                    },
                },
                rights: {
                    [`${testId}-1`]: {
                        user: {
                            [user2Email]: {
                                read: true,
                            },
                        },
                    },
                    [`${testId}-2`]: {
                        user: {
                            [user2Email]: {
                                read: true,
                            },
                        },
                    },
                },
            });
            graph = await user2Api.pull({
                [`${testId}-1`]: {
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
                expect(graph).toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-2`], true);
            });
            it('cannot pull the edge with read rights missing at one end', () => {
                expect(graph).not.toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-3`]);
            });
        });

        describe('non-existing to-node', () => {
            beforeEach(async () => {
                await user1Api.push({
                    nodes: {
                        [`${testId}-3`]: false,
                    },
                    rights: {
                        [`${testId}-3`]: {
                            user: {
                                [user2Email]: {
                                    read: true,
                                },
                            },
                        },
                    },
                });
                graph = await user2Api.pull({
                    [`${testId}-1`]: {
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

            it('does only pull the edge with two existing nodes', () => {
                expect(graph).toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-2`], true);
                expect(graph).not.toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-3`]);
            });
        });

        describe('non-existing from-node', () => {
            beforeEach(async () => {
                await user1Api.push({
                    nodes: {
                        [`${testId}-1`]: false,
                    },
                    rights: {
                        [`${testId}-3`]: {
                            user: {
                                [user2Email]: {
                                    read: true,
                                },
                            },
                        },
                    },
                });
                graph = await user2Api.pull({
                    [`${testId}-1`]: {
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

            it('does not pull the edge', () => {
                expect(graph).not.toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-2`]);
                expect(graph).not.toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-3`]);
            });
        });
    });

    describe('write rights', () => {
        beforeEach(async () => {
            await user1Api.push({
                nodes: {
                    [`${testId}-3`]: {
                        id: `${testId}-3`,
                    },
                },
                rights: {
                    [`${testId}-1`]: {
                        user: {
                            [user2Email]: {
                                write: true,
                            },
                        },
                    },
                    [`${testId}-2`]: {
                        user: {
                            [user2Email]: {
                                write: true,
                            },
                        },
                    },
                },
            });
            pushResult = await user2Api.push({
                edges: {
                    from: {
                        [`${testId}-1`]: {
                            to: {
                                [`${testId}-2`]: true,
                                [`${testId}-3`]: true,
                            },
                        },
                    },
                },
            });
            graph = await user1Api.pull({
                [`${testId}-1`]: {
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
            it('pushes the edge where for both nodes are write rights', () => {
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${testId}-1`, 'to', `${testId}-2`, 'statusCode'],
                    200,
                );
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${testId}-1`, 'to', `${testId}-3`, 'statusCode'],
                    403,
                );
            });
            it('pulls only the edge that was pushed', () => {
                expect(graph).toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-2`], true);
                expect(graph).not.toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-3`]);
            });
        });

        describe('delete edges', () => {
            beforeEach(async () => {
                await user1Api.push({
                    edges: {
                        from: {
                            [`${testId}-1`]: {
                                to: {
                                    [`${testId}-3`]: true,
                                },
                            },
                        },
                    },
                });
                pushResult = await user2Api.push({
                    edges: {
                        from: {
                            [`${testId}-1`]: {
                                to: {
                                    [`${testId}-2`]: false,
                                    [`${testId}-3`]: false,
                                },
                            },
                        },
                    },
                });
                graph = await user1Api.pull({
                    [`${testId}-1`]: {
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

            it('pushes the edges in delete mode', () => {
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${testId}-1`, 'to', `${testId}-2`, 'statusCode'],
                    200,
                );
                expect(pushResult).toHaveProperty(
                    ['edges', 'from', `${testId}-1`, 'to', `${testId}-3`, 'statusCode'],
                    403,
                );
            });
            it('pulls only the edge that was not deleted', () => {
                expect(graph).not.toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-2`]);
                expect(graph).toHaveProperty(['edges', 'from', `${testId}-1`, 'to', `${testId}-3`], true);
            });
        });
    });
});
