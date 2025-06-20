import type { LoaderLog } from './logs';

export type EdgeWildcard = [fromType: string, toType: string, toId: string];

export interface Loader {
    getNode: (nodeId: string) => Promise<string | null>;
    getRead: (nodeId: string, principalType: string, principal: string) => Promise<boolean>;
    getWrite: (nodeId: string, principalType: string, principal: string) => Promise<boolean>;
    getAdmin: (nodeId: string, principalType: string, principal: string) => Promise<boolean>;
    getMetadata: (fromId: string, edgeTypes: string, toId: string) => Promise<string>;
    getLog: () => LoaderLog;
    getEdges: (nodeId: string, edgeTypes: string) => Promise<Map<string, boolean>>;
    getReverseEdges: (nodeId: string, edgeTypes: string) => Promise<Map<string, boolean>>;
    getEdgesWildcard: (nodeId: string, edgeType: string) => Promise<Array<EdgeWildcard>>;
    getNodesWildcard: (wildcardPrefix: string) => Promise<Array<string>>;
    listRights: (nodeId: string) => Promise<Map<string, unknown>>;
    ownerExists: (nodeId: string) => Promise<boolean>;
}
