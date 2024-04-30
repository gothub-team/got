import { describe, beforeAll, afterAll, beforeEach, afterEach, it, expect } from 'bun:test';
import { createApi, type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import type { Graph, PushResult } from '@gothub-team/got-core';
import { createAdminApi, createNewUserApi } from './shared';
import { env } from '../env';

let adminApi: ReturnType<typeof createApi>;
let testId: string;
let user1Api: GotApi;
let user1Email: string;
// let user2Api: GotApi;
// let user2Email: string;
beforeAll(async () => {
    adminApi = await createAdminApi();
    user1Email = env.TEST_USER_1_EMAIL;
    user1Api = await createNewUserApi(adminApi, user1Email);
    // user2Email = env.TEST_USER_2_EMAIL;
    // user2Api = await createNewUserApi(adminApi, user2Email);
});
beforeEach(async () => {
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
});
afterAll(async () => {
    await adminApi.deleteUser({ email: user1Email });
    // await adminApi.deleteUser({ email: user2Email });
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
    afterEach(async () => {
        await adminApi.push({
            nodes: {
                [`${testId}-1`]: false,
                [`${testId}-2`]: false,
            },
            edges: {
                from: {
                    [`${testId}-1`]: {
                        to: { [`${testId}-2`]: false },
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
        afterEach(async () => {
            await adminApi.push({
                nodes: {
                    [`${testId}-3`]: false,
                    [`${testId}-4`]: false,
                },
                edges: {
                    from: {
                        [`${testId}-1`]: {
                            to: {
                                [`${testId}-3`]: false,
                                [`${testId}-4`]: false,
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
        afterEach(async () => {
            await adminApi.push({
                nodes: {
                    [`${testId}-3`]: false,
                    [`${testId}-4`]: false,
                },
                edges: {
                    from: {
                        [`${testId}-2`]: {
                            to: {
                                [`${testId}-3`]: false,
                            },
                        },
                        [`${testId}-3`]: {
                            to: {
                                [`${testId}-4`]: false,
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
});
