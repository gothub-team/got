import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import type { GotApi } from '@gothub/got-api';
import crypto from 'crypto';
// import type { Graph, Node, PushResult } from '@gothub/got-core';
import { createUserApi } from './shared';
import { parseEnv } from '@gothub/typescript-util';
import { TEST_USER_1_EMAIL, TEST_USER_1_PW, TEST_USER_2_EMAIL } from '../env';

const env = parseEnv({
    TEST_USER_1_EMAIL,
    TEST_USER_1_PW,
    TEST_USER_2_EMAIL,
});

let testId: string;
let user1Api: GotApi;
let user1Email: string;
beforeAll(async () => {
    user1Email = env.TEST_USER_1_EMAIL;
    user1Api = await createUserApi(user1Email, env.TEST_USER_1_PW);
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

        expect(logEntry).toHaveProperty(['changeset', 'nodes', testId], {
            old: false,
            new: {
                id: testId,
                name: 'Test Node',
                prop: 'value1',
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

        expect(logEntry).toHaveProperty(['changeset', 'nodes', testId], {
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
        });
    });
    it('should create a log entry when a node is deleted', async () => {
        await user1Api.push({
            nodes: {
                [testId]: false,
            },
        });
        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).toHaveProperty(['changeset', 'nodes', testId], {
            old: {
                id: testId,
                name: 'Test Node',
                prop: 'value1',
            },
            new: false,
        });
    });
    it('should not create a log entry when there are no changes in the nodes data', async () => {
        await user1Api.push({
            nodes: {
                [testId]: {
                    id: testId,
                    name: 'Test Node',
                    prop: 'value1',
                },
            },
        });
        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).not.toHaveProperty(['changeset', 'nodes', testId]);
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

        expect(logEntry).toHaveProperty(['changeset', 'edges', 'from', `${testId}-1`, 'to', `${testId}-2`], {
            old: false,
            new: true,
        });
    });

    it("should create a log entry when an edge is updated with metadata'", async () => {
        await user1Api.push({
            edges: {
                from: { [`${testId}-1`]: { to: { [`${testId}-2`]: { meta: 'data' } } } },
            },
        });
        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).toHaveProperty(['changeset', 'edges', 'from', `${testId}-1`, 'to', `${testId}-2`], {
            old: true,
            new: { meta: 'data' },
        });

        await user1Api.push({
            edges: {
                from: { [`${testId}-1`]: { to: { [`${testId}-2`]: { meta: 'updated' } } } },
            },
        });
        const logEntry2 = await getLatestLog(user1Api);

        expect(logEntry2).toHaveProperty(['changeset', 'edges', 'from', `${testId}-1`, 'to', `${testId}-2`], {
            old: { meta: 'data' },
            new: { meta: 'updated' },
        });
    });

    it("should create a log entry when an edge is deleted'", async () => {
        await user1Api.push({
            edges: {
                from: { [`${testId}-1`]: { to: { [`${testId}-2`]: false } } },
            },
        });
        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).toHaveProperty(['changeset', 'edges', 'from', `${testId}-1`, 'to', `${testId}-2`], {
            old: true,
            new: false,
        });
    });

    it('should not create a log entry when there are no changes in the edges existence', async () => {
        await user1Api.push({
            edges: {
                from: { [`${testId}-1`]: { to: { [`${testId}-2`]: true } } },
            },
        });
        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).not.toHaveProperty(['changeset', 'edges', 'from', `${testId}-1`, 'to', `${testId}-2`]);
    });

    it('should not create a log entry when there are no changes in the edges metadata', async () => {
        await user1Api.push({
            edges: {
                from: { [`${testId}-1`]: { to: { [`${testId}-2`]: { meta: 'data' } } } },
            },
        });
        await user1Api.push({
            edges: {
                from: { [`${testId}-1`]: { to: { [`${testId}-2`]: { meta: 'data' } } } },
            },
        });
        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).not.toHaveProperty(['changeset', 'edges', 'from', `${testId}-1`, 'to', `${testId}-2`]);
    });
});

describe('rights', () => {
    beforeEach(async () => {
        await user1Api.push({
            nodes: {
                [testId]: { id: testId },
            },
            rights: {
                [testId]: {
                    user: {
                        [env.TEST_USER_2_EMAIL]: {
                            read: true,
                            write: true,
                            admin: true,
                        },
                    },
                },
            },
        });
    });

    it("should create a log entry when a right is created'", async () => {
        const logEntry = await getLatestLog(user1Api);

        // has log for rights that are created on node create
        expect(logEntry).toHaveProperty(['changeset', 'rights', testId, 'user', env.TEST_USER_1_EMAIL], {
            read: { old: false, new: true },
            write: { old: false, new: true },
            admin: { old: false, new: true },
        });

        // has log for rights that are set
        expect(logEntry).toHaveProperty(['changeset', 'rights', testId, 'user', env.TEST_USER_2_EMAIL], {
            read: { old: false, new: true },
            write: { old: false, new: true },
            admin: { old: false, new: true },
        });
    });
    it("should create a log entry when a right is removed'", async () => {
        await user1Api.push({
            nodes: {
                [testId]: { id: testId },
            },
            rights: {
                [testId]: {
                    user: {
                        [env.TEST_USER_2_EMAIL]: {
                            read: false,
                            write: false,
                            admin: false,
                        },
                    },
                },
            },
        });

        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).toHaveProperty(['changeset', 'rights', testId, 'user', env.TEST_USER_2_EMAIL], {
            read: { old: true, new: false },
            write: { old: true, new: false },
            admin: { old: true, new: false },
        });
    });

    it('should not create a log entry when there are no changes in rights', async () => {
        await user1Api.push({
            rights: {
                [testId]: {
                    user: {
                        [env.TEST_USER_2_EMAIL]: {
                            read: true,
                            write: true,
                            admin: true,
                        },
                    },
                },
            },
        });

        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).not.toHaveProperty(['changeset', 'rights', testId, 'user', env.TEST_USER_2_EMAIL, 'read']);
        expect(logEntry).not.toHaveProperty(['changeset', 'rights', testId, 'user', env.TEST_USER_2_EMAIL, 'write']);
        expect(logEntry).not.toHaveProperty(['changeset', 'rights', testId, 'user', env.TEST_USER_2_EMAIL, 'admin']);
    });
});

describe('files', () => {
    beforeEach(async () => {
        await user1Api.push({
            nodes: {
                [testId]: { id: testId },
            },
            files: {
                [testId]: {
                    someFile: {
                        filename: 'file1.txt',
                        fileSize: 14,
                        contentType: 'text/plain',
                    },
                },
            },
        });
    });

    const sha256 = (data: string): string => {
        return crypto.createHash('sha256').update(data).digest('hex');
    };

    it("should create a log entry when a file is created'", async () => {
        const logEntry = await getLatestLog(user1Api);

        const fileKey = `file/${sha256(`${testId}/someFile`)}/file1.txt`;

        expect(logEntry).toHaveProperty(['changeset', 'files', testId, 'someFile'], {
            old: false,
            new: {
                // TODO: the old tests assumed filemetadata here, but filekey is probably the more important change?
                fileKey,
            },
        });
    });

    it("should create a log entry when a file is updated'", async () => {
        await user1Api.push({
            files: {
                [testId]: {
                    someFile: {
                        filename: 'file2.json',
                        fileSize: 28,
                        contentType: 'application/json',
                    },
                },
            },
        });

        const logEntry = await getLatestLog(user1Api);

        const fileKeyOld = `file/${sha256(`${testId}/someFile`)}/file1.txt`;
        const fileKeyNew = `file/${sha256(`${testId}/someFile`)}/file2.json`;

        expect(logEntry).toHaveProperty(['changeset', 'files', testId, 'someFile'], {
            old: {
                fileKey: fileKeyOld,
            },
            new: {
                fileKey: fileKeyNew,
            },
        });
    });

    it("should create a log entry when a file is deleted'", async () => {
        await user1Api.push({
            files: {
                [testId]: {
                    someFile: false,
                },
            },
        });

        const logEntry = await getLatestLog(user1Api);

        const fileKey = `file/${sha256(`${testId}/someFile`)}/file1.txt`;

        expect(logEntry).toHaveProperty(['changeset', 'files', testId, 'someFile'], {
            old: {
                fileKey: fileKey,
            },
            new: false,
        });
    });

    it('should not create a log entry when there are no changes in files', async () => {
        await user1Api.push({
            files: {
                [testId]: {
                    someFile: {
                        filename: 'file1.txt',
                        fileSize: 14,
                        contentType: 'text/plain',
                    },
                },
            },
        });

        const logEntry = await getLatestLog(user1Api);

        expect(logEntry).not.toHaveProperty(['changeset', 'files', testId, 'someFile']);
    });
});
