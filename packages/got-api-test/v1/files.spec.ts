import { describe, beforeAll, beforeEach, it, expect, mock } from 'bun:test';
import { type GotApi } from '@gothub/got-api';
import crypto from 'crypto';
import { URL } from 'url';
import { TEST_USER_1_EMAIL, TEST_USER_1_PW, TEST_USER_2_EMAIL, TEST_USER_2_PW } from '../env';
import { createUserApi } from './shared';
import type { DownloadNodeFileView, Graph, PushResult } from '@gothub/got-core';
import { parseEnv } from '@gothub/typescript-util';

const env = parseEnv({
    TEST_USER_1_EMAIL,
    TEST_USER_1_PW,
    TEST_USER_2_EMAIL,
    TEST_USER_2_PW,
});

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
                [`${testId}-1`]: { id: `${testId}-1` },
                [`${testId}-2`]: { id: `${testId}-2` },
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
            let downloadElementResult: DownloadNodeFileView;
            beforeEach(async () => {
                graph = await user1Api.pull({
                    [`${testId}-1`]: {
                        include: {
                            files: true,
                        },
                    },
                });
                downloadElementResult = graph.files?.[`${testId}-1`].someFile as DownloadNodeFileView;
            });

            describe('url', () => {
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

            describe('security', () => {
                describe('download without signature', () => {
                    let downloadResult: Response;
                    beforeEach(async () => {
                        if (!downloadElementResult || !downloadElementResult.url) {
                            return;
                        }
                        const unsignedUrl = new URL(downloadElementResult.url);
                        unsignedUrl.search = '';
                        downloadResult = await fetch(unsignedUrl.toString());
                    });

                    it('responds with forbidden', async () => {
                        expect(downloadResult).toHaveProperty('status', 403);
                    });
                });

                describe('try to access root', () => {
                    let downloadResult: Response;
                    beforeEach(async () => {
                        if (!downloadElementResult || !downloadElementResult.url) {
                            return;
                        }
                        const badUrl = new URL(downloadElementResult.url);
                        badUrl.pathname = '';
                        badUrl.search = '';
                        downloadResult = await fetch(badUrl.toString());
                    });

                    it('responds with forbidden', async () => {
                        expect(downloadResult).toHaveProperty('status', 403);
                    });
                });

                describe('try to access file folder', () => {
                    let downloadResult: Response;
                    beforeEach(async () => {
                        if (!downloadElementResult || !downloadElementResult.url) {
                            return;
                        }
                        const badUrl = new URL(downloadElementResult.url);
                        badUrl.pathname = 'file';
                        badUrl.search = '';
                        downloadResult = await fetch(badUrl.toString());
                    });

                    it('responds with forbidden', async () => {
                        expect(downloadResult).toHaveProperty('status', 403);
                    });
                });

                describe('try to access ref folder', () => {
                    let downloadResult: Response;
                    beforeEach(async () => {
                        if (!downloadElementResult || !downloadElementResult.url) {
                            return;
                        }
                        const badUrl = new URL(downloadElementResult.url);
                        badUrl.pathname = 'ref';
                        badUrl.search = '';
                        downloadResult = await fetch(badUrl.toString());
                    });

                    it('responds with forbidden', async () => {
                        expect(downloadResult).toHaveProperty('status', 403);
                    });
                });
            });
        });

        describe('read rights', () => {
            beforeEach(async () => {
                await user1Api.push({
                    rights: {
                        [`${testId}-1`]: { user: { [user2Email]: { read: true } } },
                    },
                });
                graph = await user2Api.pull({
                    [`${testId}-1`]: { include: { files: true } },
                    [`${testId}-2`]: { include: { files: true } },
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

        describe('multiple files', () => {
            beforeEach(async () => {
                pushResult = await user1Api.push({
                    files: {
                        [`${testId}-1`]: {
                            someOtherFile: {
                                contentType: 'text/plain',
                                filename: 'some-file.txt',
                                fileSize: fileContent.length,
                            },
                        },
                    },
                });
                const uploadElement1Result = pushResult.files?.[`${testId}-1`].someOtherFile;
                if (!uploadElement1Result || uploadElement1Result.statusCode !== 200) {
                    return;
                }
                await fetch(uploadElement1Result.uploadUrls[0], {
                    method: 'PUT',
                    body: fileContent,
                    headers: {
                        'Content-Type': 'text/plain',
                    },
                });
                graph = await user1Api.pull({
                    [`${testId}-1`]: { include: { files: true } },
                });
            });

            it('pulls all two files attached to node 1', async () => {
                expect(graph).toHaveProperty(['files', `${testId}-1`, 'someFile', 'url']);
                expect(graph).toHaveProperty(['files', `${testId}-1`, 'someOtherFile', 'url']);
            });
        });
    });

    describe('file not uploaded', () => {
        beforeEach(async () => {
            graph = await user1Api.pull({
                [`${testId}-1`]: { include: { files: true } },
            });
        });

        it('does not pull the file download url', async () => {
            expect(graph).not.toHaveProperty(['files', `${testId}-1`, 'someFile']);
        });
    });

    describe('write rights', () => {
        beforeEach(async () => {
            await user1Api.push({
                rights: {
                    [`${testId}-1`]: { user: { [user2Email]: { write: true } } },
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

describe('multipart upload', () => {
    let pushResult: PushResult;
    let graph: Graph;
    let fileContent: string;
    beforeEach(async () => {
        fileContent = '';
        const chunk = 'FILE CONTENT';
        for (let i = 0; i < 1024 * 1024 * 6; i += chunk.length) {
            fileContent += chunk;
        }
        pushResult = await user1Api.push({
            nodes: {
                [`${testId}-1`]: { id: `${testId}-1` },
            },
            files: {
                [`${testId}-1`]: {
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
            expect(pushResult).toHaveProperty(['files', `${testId}-1`, 'someFile', 'uploadUrls', 'length'], 2);
            expect(pushResult).toHaveProperty(['files', `${testId}-1`, 'someFile', 'uploadId']);
        });
    });

    describe('upload file', () => {
        let fnProgress: ReturnType<typeof mock>;
        beforeEach(async () => {
            fnProgress = mock();
            const uploadElement1Result = pushResult.files?.[`${testId}-1`].someFile;
            if (!uploadElement1Result || uploadElement1Result.statusCode !== 200 || !uploadElement1Result.uploadId) {
                return;
            }
            await user1Api.upload(uploadElement1Result.uploadUrls, new Blob([fileContent], { type: 'text/plain' }), {
                contentType: 'text/plain',
                uploadId: uploadElement1Result.uploadId,
                onProgress: fnProgress,
            });
            graph = await user1Api.pull({
                [`${testId}-1`]: { include: { files: true } },
            });
        });

        describe('upload', () => {
            it('logs the progress', async () => {
                expect(fnProgress.mock.calls[0]).toEqual([0.5]);
                expect(fnProgress.mock.calls[1]).toEqual([1]);
            });
            it('pulls the download url after upload', async () => {
                expect(graph).toHaveProperty(['files', `${testId}-1`, 'someFile', 'contentType'], 'text/plain');
                expect(graph).toHaveProperty(
                    ['files', `${testId}-1`, 'someFile', 'etag'],
                    '"432625e3dbe0b09670bf3966198a630a-2"',
                );
                expect(graph).toHaveProperty(['files', `${testId}-1`, 'someFile', 'url']);
            });
        });
    });
});
