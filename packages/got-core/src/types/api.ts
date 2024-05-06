import { Graph, PushResult } from './graph';
import { View } from './view';

export type StoreAPI = {
    push: (graph: Graph) => Promise<PushResult>;
    pull: (view: View) => Promise<Graph>;
    upload: (
        uploadUrls: string[],
        file: Blob,
        options: { contentType: string; uploadId: string; partSize: number; onProgress: (progress: number) => void },
    ) => Promise<void>;
};
