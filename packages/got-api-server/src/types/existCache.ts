export type ExistsCacheNode = {
    addNode: (id: string) => void;
    removeNode: (id: string) => void;
    getNode: (id: string) => boolean;
};

export type ExistsCacheEdge = {
    addEdge: (fromId: string, edgeTypes: string, toId: string) => void;
    removeEdge: (fromId: string, edgeTypes: string, toId: string) => void;
    getEdge: (fromId: string, edgeTypes: string, toId: string) => boolean;
    listEdge: (fromId: string, edgeTypes: string) => Map<string, boolean> | undefined;
};

export type ExistsCacheEdgeReverse = {
    addEdgeReverse: (toId: string, edgeTypes: string, fromId: string) => void;
    removeEdgeReverse: (toId: string, edgeTypes: string, fromId: string) => void;
    getEdgeReverse: (toId: string, edgeTypes: string, fromId: string) => boolean;
    listEdgeReverse: (toId: string, edgeTypes: string) => Map<string, boolean> | undefined;
};

export type RightType = 'read' | 'write' | 'admin';
export type Rights = {
    read?: 'true';
    write?: 'true';
    admin?: 'true';
};

export type ExistsCacheRights = {
    addRight: (node: string, principal: string, right: RightType) => void;
    removeRight: (node: string, principal: string, right: RightType) => void;
    getRead: (node: string, principal: string) => boolean;
    getWrite: (node: string, principal: string) => boolean;
    getAdmin: (node: string, principal: string) => boolean;
    listRights: (node: string) => Map<string, Rights> | undefined;
};

export type ExistsCache = {
    node: ExistsCacheNode;
    edge: ExistsCacheEdge;
    edgeReverse: ExistsCacheEdgeReverse;
    userRights: ExistsCacheRights;
    roleRights: ExistsCacheRights;
};
