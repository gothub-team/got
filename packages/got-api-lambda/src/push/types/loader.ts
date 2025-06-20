import type { LoaderLog } from './logs';

export type FileRef = {
    fileKey: string;
};
export type FileHead = {
    etag: string;
    contentType: string;
    modifiedDate: string;
};

export type FileMetadata = {
    nodeId: string;
    prop: string;
    filename: string;
    contentType: string;
    fileSize: number;
};

export type EdgeWildcard = [fromType: string, toType: string, toId: string];

export interface Loader {
    getNode: (nodeId: string) => Promise<string | null>;
    getRead: (nodeId: string, principalType: string, principal: string) => Promise<boolean>;
    getWrite: (nodeId: string, principalType: string, principal: string) => Promise<boolean>;
    getAdmin: (nodeId: string, principalType: string, principal: string) => Promise<boolean>;
    getMetadata: (fromId: string, edgeTypes: string, toId: string) => Promise<string>;
    getLog: () => LoaderLog;
    getFileRef: (nodeId: string, prop: string) => Promise<FileRef | null>;
    getFileRefs: (nodeId: string) => Promise<FileRef[]>;
    getFileHead: (fileKey: string) => Promise<FileHead | false | undefined>;
    getFileMetadata: (fileKey: string) => Promise<FileMetadata | null>;
    getUpload: (uploadId: string) => Promise<string | null>;
    getEdges: (nodeId: string, edgeTypes: string) => Promise<Map<string, boolean>>;
    getReverseEdges: (nodeId: string, edgeTypes: string) => Promise<Map<string, boolean>>;
    getEdgesWildcard: (nodeId: string, edgeType: string) => Promise<Array<EdgeWildcard>>;
    getNodesWildcard: (wildcardPrefix: string) => Promise<Array<string>>;
    listRights: (nodeId: string) => Promise<Map<string, unknown>>;
    ownerExists: (nodeId: string) => Promise<boolean>;
}
