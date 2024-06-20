import type { LoaderLog } from './logs';

export type FileRef = {
    prop: string;
    fileKey: string;
};
export type FileHead = {
    etag: string;
    contentType: string;
    modifiedDate: string;
};

export type EdgeWildcard = [fromType: string, toType: string, toId: string];

export type Loader = {
    getNode: (nodeId: string) => Promise<string>;
    getMetadata: (fromId: string, edgeTypes: string, toId: string) => Promise<string>;
    getLog: () => LoaderLog;
    getFileRefs: (nodeId: string) => Promise<FileRef[]>;
    getFileHead: (fileKey: string) => Promise<FileHead | false | undefined>;
    getEdgesWildcard: (nodeId: string, edgeType: string) => Promise<Array<EdgeWildcard>>;
    getNodesWildcard: (wildcardPrefix: string) => Promise<Array<string>>;
};
