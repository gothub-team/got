import { type GOT_UPLOAD_ACTION } from '../types/actions';
import { type StoreAPI } from '../types/api';
import { type Graph, type PushResult } from '../types/graph';
import { type OK_UPLOAD, type UploadNodeFileView } from '../types/graphObjects';
import { type FileStore } from '../types/state';
import { createSubscribable, forEachObjDepth } from './util';

export const createFileUploader = (
    api: StoreAPI,
    graphName: string,
    graph: Graph,
    apiResult: PushResult,
    successGraph: Graph,
    fileStore: FileStore,
) => {
    const { subscribe, subscriber } = createSubscribable<GOT_UPLOAD_ACTION | undefined>();

    const uploadFile = async (nodeId: string, prop: string) => {
        try {
            const { contentType, partSize } = (graph.files?.[nodeId]?.[prop] as UploadNodeFileView) || {};
            const { uploadUrls, uploadId } = (apiResult.files?.[nodeId]?.[prop] as OK_UPLOAD) || {};
            const file = fileStore[nodeId]?.[prop]?.file;

            subscriber.next({
                type: 'GOT/UPLOAD_PROGRESS',
                payload: {
                    graphName,
                    nodeId,
                    prop,
                    progress: 0,
                },
            });

            await api.upload(uploadUrls, file, {
                contentType,
                uploadId,
                partSize,
                onProgress: (progress) =>
                    subscriber.next({
                        type: 'GOT/UPLOAD_PROGRESS',
                        payload: {
                            graphName,
                            nodeId,
                            prop,
                            progress,
                        },
                    }),
            });

            subscriber.next({
                type: 'GOT/UPLOAD_COMPLETE',
                payload: {
                    graphName,
                    nodeId,
                    prop,
                },
            });
        } catch (error) {
            subscriber.next({
                type: 'GOT/UPLOAD_ERROR',
                payload: {
                    graphName,
                    nodeId,
                    prop,
                    error: (error as Error).message,
                },
            });
        }
    };

    const uploadFiles = async () => {
        const uploads: Promise<void>[] = [];

        forEachObjDepth(
            successGraph?.files || {},
            (_, [nodeId, prop]) => {
                if (nodeId && prop) {
                    const upload = uploadFile(nodeId, prop);
                    uploads.push(upload);
                }
            },
            2,
        );

        await Promise.all(uploads);
        subscriber.complete(undefined);
    };

    return { uploads: { subscribe, start: uploadFiles } };
};
