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
    getNode: (nodeId: string) => Promise<string | null>;
    getRead: (nodeId: string, principalType: string, principal: string) => Promise<boolean>;
    getWrite: (nodeId: string, principalType: string, principal: string) => Promise<boolean>;
    getAdmin: (nodeId: string, principalType: string, principal: string) => Promise<boolean>;
    getMetadata: (fromId: string, edgeTypes: string, toId: string) => Promise<string>;
    getLog: () => LoaderLog;
    getFileRef: (nodeId: string, prop: string) => Promise<FileRef | null>;
    getFileRefs: (nodeId: string) => Promise<FileRef[]>;
    getFileHead: (fileKey: string) => Promise<FileHead | false | undefined>;
    getUpload: (uploadId: string) => Promise<string | null>;
    getEdges: (nodeId: string, edgeTypes: string) => Promise<Map<string, boolean>>;
    getReverseEdges: (nodeId: string, edgeTypes: string) => Promise<Map<string, boolean>>;
    getEdgesWildcard: (nodeId: string, edgeType: string) => Promise<Array<EdgeWildcard>>;
    getNodesWildcard: (wildcardPrefix: string) => Promise<Array<string>>;
    listRights: (nodeId: string) => Promise<Map<string, unknown>>;
    ownerExists: (nodeId: string) => Promise<boolean>;
};
