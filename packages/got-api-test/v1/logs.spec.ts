import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import type { GotApi } from '@gothub/got-api';
import crypto from 'crypto';
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

const getLatestLog = async (api: GotApi) => {
    const logs = (await api.getLogs({ prefix: '' })) as string[];
    const latestLog = logs.at(-1);

    return api.getLogs({ id: latestLog });
};

describe('nodes', () => {
    beforeEach(async () => {
        await fixture.user1Api.push({
            nodes: {
                [fixture.testId]: {
                    id: fixture.testId,
                    name: 'Test Node',
                    prop: 'value1',
                },
            },
        });
    });

    it('should create a log entry when a node is created', async () => {
        const logEntry = await getLatestLog(fixture.user1Api);

        expect(logEntry).toHaveProperty(['changeset', 'nodes', fixture.testId], {
            old: false,
            new: {
                id: fixture.testId,
                name: 'Test Node',
                prop: 'value1',
            },
        });
    });
    it('should create a log entry when a node is updated', async () => {
        await fixture.user1Api.push({
            nodes: {
                [fixture.testId]: {
                    id: fixture.testId,
                    name: 'Updated Name',
                    prop: 'Updated Value',
                },
            },
        });
        const logEntry = await getLatestLog(fixture.user1Api);

        expect(logEntry).toHaveProperty(['changeset', 'nodes', fixture.testId], {
            old: {
                id: fixture.testId,
                name: 'Test Node',
                prop: 'value1',
            },
            new: {
                id: fixture.testId,
                name: 'Updated Name',
                prop: 'Updated Value',
            },
        });
    });
    it('should create a log entry when a node is deleted', async () => {
        await fixture.user1Api.push({
            nodes: {
                [fixture.testId]: false,
            },
        });
        const logEntry = await getLatestLog(fixture.user1Api);

        expect(logEntry).toHaveProperty(['changeset', 'nodes', fixture.testId], {
            old: {
                id: fixture.testId,
                name: 'Test Node',
                prop: 'value1',
            },
            new: false,
        });
    });
    it('should not create a log entry when there are no changes in the nodes data', async () => {
        await fixture.user1Api.push({
            nodes: {
                [fixture.testId]: {
                    id: fixture.testId,
                    name: 'Test Node',
                    prop: 'value1',
                },
            },
        });
        const logEntry = await getLatestLog(fixture.user1Api);

        expect(logEntry).not.toHaveProperty(['changeset', 'nodes', fixture.testId]);
    });
});

describe('edges', () => {
    beforeEach(async () => {
        await fixture.user1Api.push({
            nodes: {
                [`${fixture.testId}-1`]: { id: `${fixture.testId}-1` },
                [`${fixture.testId}-2`]: { id: `${fixture.testId}-2` },
            },
            edges: {
                from: { [`${fixture.testId}-1`]: { to: { [`${fixture.testId}-2`]: true } } },
            },
        });
    });

    it("should create a log entry when an edge is created'", async () => {
        const logEntry = await getLatestLog(fixture.user1Api);

        expect(logEntry).toHaveProperty(
            ['changeset', 'edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`],
            {
                old: false,
                new: true,
            },
        );
    });

    it("should create a log entry when an edge is updated with metadata'", async () => {
        await fixture.user1Api.push({
            edges: {
                from: { [`${fixture.testId}-1`]: { to: { [`${fixture.testId}-2`]: { meta: 'data' } } } },
            },
        });
        const logEntry = await getLatestLog(fixture.user1Api);

        expect(logEntry).toHaveProperty(
            ['changeset', 'edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`],
            {
                old: true,
                new: { meta: 'data' },
            },
        );

        await fixture.user1Api.push({
            edges: {
                from: { [`${fixture.testId}-1`]: { to: { [`${fixture.testId}-2`]: { meta: 'updated' } } } },
            },
        });
        const logEntry2 = await getLatestLog(fixture.user1Api);

        expect(logEntry2).toHaveProperty(
            ['changeset', 'edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`],
            {
                old: { meta: 'data' },
                new: { meta: 'updated' },
            },
        );
    });

    it("should create a log entry when an edge is deleted'", async () => {
        await fixture.user1Api.push({
            edges: {
                from: { [`${fixture.testId}-1`]: { to: { [`${fixture.testId}-2`]: false } } },
            },
        });
        const logEntry = await getLatestLog(fixture.user1Api);

        expect(logEntry).toHaveProperty(
            ['changeset', 'edges', 'from', `${fixture.testId}-1`, 'to', `${fixture.testId}-2`],
            {
                old: true,
                new: false,
            },
        );
    });

    it('should not create a log entry when there are no changes in the edges existence', async () => {
        await fixture.user1Api.push({
            edges: {
                from: { [`${fixture.testId}-1`]: { to: { [`${fixture.testId}-2`]: true } } },
            },
        });
        const logEntry = await getLatestLog(fixture.user1Api);

        expect(logEntry).not.toHaveProperty([
            'changeset',
            'edges',
            'from',
            `${fixture.testId}-1`,
            'to',
            `${fixture.testId}-2`,
        ]);
    });

    it('should not create a log entry when there are no changes in the edges metadata', async () => {
        await fixture.user1Api.push({
            edges: {
                from: { [`${fixture.testId}-1`]: { to: { [`${fixture.testId}-2`]: { meta: 'data' } } } },
            },
        });
        await fixture.user1Api.push({
            edges: {
                from: { [`${fixture.testId}-1`]: { to: { [`${fixture.testId}-2`]: { meta: 'data' } } } },
            },
        });
        const logEntry = await getLatestLog(fixture.user1Api);

        expect(logEntry).not.toHaveProperty([
            'changeset',
            'edges',
            'from',
            `${fixture.testId}-1`,
            'to',
            `${fixture.testId}-2`,
        ]);
    });
});

describe('rights', () => {
    beforeEach(async () => {
        await fixture.user1Api.push({
            nodes: {
                [fixture.testId]: { id: fixture.testId },
            },
            rights: {
                [fixture.testId]: {
                    user: {
                        [fixture.user2Email]: {
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
        const logEntry = await getLatestLog(fixture.user1Api);

        // has log for rights that are created on node create
        expect(logEntry).toHaveProperty(['changeset', 'rights', fixture.testId, 'user', fixture.user1Email], {
            read: { old: false, new: true },
            write: { old: false, new: true },
            admin: { old: false, new: true },
        });

        // has log for rights that are set
        expect(logEntry).toHaveProperty(['changeset', 'rights', fixture.testId, 'user', fixture.user2Email], {
            read: { old: false, new: true },
            write: { old: false, new: true },
            admin: { old: false, new: true },
        });
    });
    it("should create a log entry when a right is removed'", async () => {
        await fixture.user1Api.push({
            nodes: {
                [fixture.testId]: { id: fixture.testId },
            },
            rights: {
                [fixture.testId]: {
                    user: {
                        [fixture.user2Email]: {
                            read: false,
                            write: false,
                            admin: false,
                        },
                    },
                },
            },
        });

        const logEntry = await getLatestLog(fixture.user1Api);

        expect(logEntry).toHaveProperty(['changeset', 'rights', fixture.testId, 'user', fixture.user2Email], {
            read: { old: true, new: false },
            write: { old: true, new: false },
            admin: { old: true, new: false },
        });
    });

    it('should not create a log entry when there are no changes in rights', async () => {
        await fixture.user1Api.push({
            rights: {
                [fixture.testId]: {
                    user: {
                        [fixture.user2Email]: {
                            read: true,
                            write: true,
                            admin: true,
                        },
                    },
                },
            },
        });

        const logEntry = await getLatestLog(fixture.user1Api);

        expect(logEntry).not.toHaveProperty([
            'changeset',
            'rights',
            fixture.testId,
            'user',
            fixture.user2Email,
            'read',
        ]);
        expect(logEntry).not.toHaveProperty([
            'changeset',
            'rights',
            fixture.testId,
            'user',
            fixture.user2Email,
            'write',
        ]);
        expect(logEntry).not.toHaveProperty([
            'changeset',
            'rights',
            fixture.testId,
            'user',
            fixture.user2Email,
            'admin',
        ]);
    });
});

describe.skip('files', () => {
    beforeEach(async () => {
        await fixture.user1Api.push({
            nodes: {
                [fixture.testId]: { id: fixture.testId },
            },
            files: {
                [fixture.testId]: {
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
        const logEntry = await getLatestLog(fixture.user1Api);

        const fileKey = `file/${sha256(`${fixture.testId}/someFile`)}/file1.txt`;

        expect(logEntry).toHaveProperty(['changeset', 'files', fixture.testId, 'someFile'], {
            old: false,
            new: {
                // TODO: the old tests assumed filemetadata here, but filekey is probably the more important change?
                fileKey,
            },
        });
    });

    it("should create a log entry when a file is updated'", async () => {
        await fixture.user1Api.push({
            files: {
                [fixture.testId]: {
                    someFile: {
                        filename: 'file2.json',
                        fileSize: 28,
                        contentType: 'application/json',
                    },
                },
            },
        });

        const logEntry = await getLatestLog(fixture.user1Api);

        const fileKeyOld = `file/${sha256(`${fixture.testId}/someFile`)}/file1.txt`;
        const fileKeyNew = `file/${sha256(`${fixture.testId}/someFile`)}/file2.json`;

        expect(logEntry).toHaveProperty(['changeset', 'files', fixture.testId, 'someFile'], {
            old: {
                fileKey: fileKeyOld,
            },
            new: {
                fileKey: fileKeyNew,
            },
        });
    });

    it("should create a log entry when a file is deleted'", async () => {
        await fixture.user1Api.push({
            files: {
                [fixture.testId]: {
                    someFile: false,
                },
            },
        });

        const logEntry = await getLatestLog(fixture.user1Api);

        const fileKey = `file/${sha256(`${fixture.testId}/someFile`)}/file1.txt`;

        expect(logEntry).toHaveProperty(['changeset', 'files', fixture.testId, 'someFile'], {
            old: {
                fileKey: fileKey,
            },
            new: false,
        });
    });

    it('should not create a log entry when there are no changes in files', async () => {
        await fixture.user1Api.push({
            files: {
                [fixture.testId]: {
                    someFile: {
                        filename: 'file1.txt',
                        fileSize: 14,
                        contentType: 'text/plain',
                    },
                },
            },
        });

        const logEntry = await getLatestLog(fixture.user1Api);

        expect(logEntry).not.toHaveProperty(['changeset', 'files', fixture.testId, 'someFile']);
    });
});
