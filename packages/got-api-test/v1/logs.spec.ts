import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import type { GotApi } from '@gothub/got-api';
import crypto from 'crypto';
// import type { Graph, Node, PushResult } from '@gothub/got-core';
import { createUserApi } from './shared';
import { parseEnv } from '@gothub/typescript-util';
import {
    TEST_USER_1_EMAIL,
    TEST_USER_1_PW,
    // TEST_USER_2_EMAIL,
    // TEST_USER_2_PW
} from '../env';

const env = parseEnv({
    TEST_USER_1_EMAIL,
    TEST_USER_1_PW,
    // TEST_USER_2_EMAIL,
    // TEST_USER_2_PW,
});

let testId: string;
let user1Api: GotApi;
let user1Email: string;
// let user2Api: GotApi;
// let user2Email: string;
beforeAll(async () => {
    user1Email = env.TEST_USER_1_EMAIL;
    user1Api = await createUserApi(user1Email, env.TEST_USER_1_PW);
    // user2Email = env.TEST_USER_2_EMAIL;
    // user2Api = await createUserApi(user2Email, env.TEST_USER_2_PW);
});
beforeEach(async () => {
    testId = `test-${crypto.randomBytes(8).toString('hex')}`;
});

const getLatestLog = async (api: GotApi) => {
    const logs = (await api.getLogs({ prefix: '' })) as string[];
    const latestLog = logs.at(-1);

    return api.getLogs({ id: latestLog });
};

describe('nodes', () => {
    beforeEach(async () => {
        await user1Api.push({
            nodes: {
                [testId]: {
                    id: testId,
                    name: 'Test Node',
                    prop: 'value1',
                },
            },
        });
    });

    it('should create a log entry when a node is created', async () => {
        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).toHaveProperty(['changeset', 'nodes'], {
            [testId]: {
                old: null,
                new: {
                    id: testId,
                    name: 'Test Node',
                    prop: 'value1',
                },
            },
        });
    });
    it('should create a log entry when a node is updated', async () => {
        await user1Api.push({
            nodes: {
                [testId]: {
                    id: testId,
                    name: 'Updated Name',
                    prop: 'Updated Value',
                },
            },
        });
        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).toHaveProperty(['changeset', 'nodes'], {
            [testId]: {
                old: {
                    id: testId,
                    name: 'Test Node',
                    prop: 'value1',
                },
                new: {
                    id: testId,
                    name: 'Updated Name',
                    prop: 'Updated Value',
                },
            },
        });
    });
    it('should create a log entry when a node is deleted', async () => {
        await user1Api.push({
            nodes: {
                [testId]: false,
            },
        });
        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).toHaveProperty(['changeset', 'nodes'], {
            [testId]: {
                old: {
                    id: testId,
                    name: 'Test Node',
                    prop: 'value1',
                },
                new: null,
            },
        });
    });
});

describe('edges', () => {
    beforeEach(async () => {
        await user1Api.push({
            nodes: {
                [`${testId}-1`]: { id: `${testId}-1` },
                [`${testId}-2`]: { id: `${testId}-2` },
            },
            edges: {
                from: { [`${testId}-1`]: { to: { [`${testId}-2`]: true } } },
            },
        });
    });

    it("should create a log entry when an edge is created'", async () => {
        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).toHaveProperty(['changeset', 'edges'], {
            from: {
                [`${testId}-1`]: {
                    to: {
                        [`${testId}-2`]: {
                            old: null,
                            new: true,
                        },
                    },
                },
            },
        });
    });

    it("should create a log entry when an edge is updated with metadata'", async () => {
        await user1Api.push({
            edges: {
                from: { [`${testId}-1`]: { to: { [`${testId}-2`]: { meta: 'data' } } } },
            },
        });
        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).toHaveProperty(['changeset', 'edges'], {
            from: {
                [`${testId}-1`]: {
                    to: {
                        [`${testId}-2`]: {
                            old: true,
                            new: { meta: 'data' },
                        },
                    },
                },
            },
        });

        await user1Api.push({
            edges: {
                from: { [`${testId}-1`]: { to: { [`${testId}-2`]: { meta: 'updated' } } } },
            },
        });
        const logEntry2 = await getLatestLog(user1Api);

        expect(logEntry2).toHaveProperty(['changeset', 'edges'], {
            from: {
                [`${testId}-1`]: {
                    to: {
                        [`${testId}-2`]: {
                            old: { meta: 'data' },
                            new: { meta: 'updated' },
                        },
                    },
                },
            },
        });
    });

    it("should create a log entry when an edge is deleted'", async () => {
        await user1Api.push({
            edges: {
                from: { [`${testId}-1`]: { to: { [`${testId}-2`]: false } } },
            },
        });
        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).toHaveProperty(['changeset', 'edges'], {
            from: {
                [`${testId}-1`]: {
                    to: {
                        [`${testId}-2`]: {
                            old: true,
                            new: null,
                        },
                    },
                },
            },
        });
    });
});
