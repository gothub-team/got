import { Metadata, Node } from '@gothub/got-core';

export type Writer = {
    setNode: (nodeId: string, data: Node | null) => Promise<void>;
    setMetadata: (fromId: string, edgeTypes: string, toId: string, data: Metadata | boolean) => Promise<void>;
    setReverseEdge: (toId: string, edgeTypes: string, fromId: string, data: boolean) => Promise<void>;
    setRead: (nodeId: string, principalType: string, principal: string, right: boolean) => Promise<void>;
    setWrite: (nodeId: string, principalType: string, principal: string, right: boolean) => Promise<void>;
    setAdmin: (nodeId: string, principalType: string, principal: string, right: boolean) => Promise<void>;
    setOwner: (nodeId: string, principal: string | null) => Promise<void>;
};