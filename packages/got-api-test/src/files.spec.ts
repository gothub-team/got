import { describe, beforeAll, beforeEach, it, expect } from 'bun:test';
import { type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import { env } from '../env';
import { createUserApi } from './shared';
import type { DownloadNodeFileView, Graph, PushResult } from '@gothub-team/got-core';

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

describe('files', () => {
    let pushResult: PushResult;
    let graph: Graph;
    let fileContent: string;
    beforeEach(async () => {
        fileContent = 'FILE CONTENT';
        pushResult = await user1Api.push({
            nodes: {
                [`${testId}-1`]: {
                    id: `${testId}-1`,
                },
                [`${testId}-2`]: {
                    id: `${testId}-2`,
                },
            },
            files: {
                [`${testId}-1`]: {
                    someFile: {
                        contentType: 'text/plain',
                        filename: 'some-file.txt',
                        fileSize: fileContent.length,
                    },
                },
                [`${testId}-2`]: {
                    someFile: {
                        contentType: 'text/plain',
                        filename: 'some-file.txt',
                        fileSize: fileContent.length,
                    },
                },
            },
        });
    });

    describe('push', () => {
        it('initiates the upload', async () => {
            expect(pushResult).toHaveProperty(['files', `${testId}-1`, 'someFile', 'statusCode'], 200);
            expect(pushResult).toHaveProperty(['files', `${testId}-1`, 'someFile', 'uploadUrls']);
        });
    });

    describe('upload file', () => {
        let uploadResult: Response;
        beforeEach(async () => {
            const uploadElement1Result = pushResult.files?.[`${testId}-1`].someFile;
            const uploadElement2Result = pushResult.files?.[`${testId}-2`].someFile;
            if (
                !uploadElement1Result ||
                uploadElement1Result.statusCode !== 200 ||
                !uploadElement2Result ||
                uploadElement2Result.statusCode !== 200
            ) {
                return;
            }
            uploadResult = await fetch(uploadElement1Result.uploadUrls[0], {
                method: 'PUT',
                body: fileContent,
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
            await fetch(uploadElement2Result.uploadUrls[0], {
                method: 'PUT',
                body: fileContent,
                headers: {
                    'Content-Type': 'text/plain',
                },
            });
        });

        describe('put', () => {
            it('uploads the file', async () => {
                expect(uploadResult).toHaveProperty('status', 200);
            });
        });

        describe('pull', () => {
            beforeEach(async () => {
                graph = await user1Api.pull({
                    [`${testId}-1`]: {
                        include: {
                            files: true,
                        },
                    },
                });
            });

            describe('pull', () => {
                it('pulls the file download url', async () => {
                    expect(graph).toHaveProperty(['files', `${testId}-1`, 'someFile', 'contentType'], 'text/plain');
                    expect(graph).toHaveProperty(
                        ['files', `${testId}-1`, 'someFile', 'etag'],
                        '"9b5d8c336958531a6fd6a917e9a362a1"',
                    );
                    expect(graph).toHaveProperty(['files', `${testId}-1`, 'someFile', 'url']);
                });
            });

            describe('download', () => {
                let downloadResult: Response;
                beforeEach(async () => {
                    const downloadElementResult = graph.files?.[`${testId}-1`].someFile as DownloadNodeFileView;
                    if (!downloadElementResult || !downloadElementResult.url) {
                        return;
                    }
                    downloadResult = await fetch(downloadElementResult.url);
                });

                it('downloads the file', async () => {
                    expect(downloadResult).toHaveProperty('status', 200);
                    expect(await downloadResult.text()).toBe(fileContent);
                });
            });
        });

        describe('read rights', () => {
            beforeEach(async () => {
                await user1Api.push({
                    rights: {
                        [`${testId}-1`]: {
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
                        include: {
                            files: true,
                        },
                    },
                    [`${testId}-2`]: {
                        include: {
                            files: true,
                        },
                    },
                });
            });

            it('pulls the download url and metadata for node 1', async () => {
                expect(graph).toHaveProperty(['files', `${testId}-1`, 'someFile', 'contentType'], 'text/plain');
                expect(graph).toHaveProperty(
                    ['files', `${testId}-1`, 'someFile', 'etag'],
                    '"9b5d8c336958531a6fd6a917e9a362a1"',
                );
                expect(graph).toHaveProperty(['files', `${testId}-1`, 'someFile', 'url']);
            });
            it('does not pull the download url and metadata for node 2', async () => {
                expect(graph).not.toHaveProperty(['files', `${testId}-2`, 'someFile']);
            });
        });
    });

    describe('write rights', () => {
        beforeEach(async () => {
            await user1Api.push({
                rights: {
                    [`${testId}-1`]: {
                        user: {
                            [user2Email]: {
                                write: true,
                            },
                        },
                    },
                },
            });
            pushResult = await user2Api.push({
                files: {
                    [`${testId}-1`]: {
                        someOtherFile: {
                            contentType: 'text/plain',
                            filename: 'some-file.txt',
                            fileSize: fileContent.length,
                        },
                    },
                    [`${testId}-2`]: {
                        someOtherFile: {
                            contentType: 'text/plain',
                            filename: 'some-file.txt',
                            fileSize: fileContent.length,
                        },
                    },
                },
            });
        });

        it('returns upload urls for node 1', async () => {
            expect(pushResult).toHaveProperty(['files', `${testId}-1`, 'someOtherFile', 'statusCode'], 200);
            expect(pushResult).toHaveProperty(['files', `${testId}-1`, 'someOtherFile', 'uploadUrls']);
        });
        it('does not return upload urls for node 2', async () => {
            expect(pushResult).toHaveProperty(['files', `${testId}-2`, 'someOtherFile', 'statusCode'], 403);
            expect(pushResult).not.toHaveProperty(['files', `${testId}-2`, 'someOtherFile', 'uploadUrls']);
        });
    });
});
