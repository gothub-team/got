import { type Graph, type PushResult } from './graph';
import { type View } from './view';

export type StoreAPI = {
    push: (graph: Graph) => Promise<PushResult>;
    pull: (view: View) => Promise<Graph>;
    upload: (
        uploadUrls: string[],
        file: Blob,
        options: { contentType: string; uploadId?: string; partSize?: number; onProgress: (progress: number) => void },
    ) => Promise<void>;
};
