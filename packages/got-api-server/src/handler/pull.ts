import { promiseManager } from '../util/promiseManager';
import type { DataCache } from '../types/dataCache';
import type { ExistsCache } from '../types/existCache';
import type { NodeView, EdgeView, View } from '@gothub/got-core';
import type { WithEdgeTypes } from '../util/withEdgeTypes';
import { withEdgeTypes } from '../util/withEdgeTypes';
import type { Loader, FileRef } from '../types/loader';
import type { Signer } from '../types/signer';
import type { GraphAssembler } from '../types/graphAssembler';
import type { Log } from '../types/logs';

const parseRole = (role: string, nodeId: string): string => role.replaceAll('$NODEID', nodeId);

type Dependencies = {
    existsCache: ExistsCache;
    dataCache: DataCache;
    loader: Loader;
    signer: Signer;
    graphAssembler: GraphAssembler;
};

export const pull = async (
    view: View,
    userEmail: string,
    asAdmin: boolean,
    dependencies: Dependencies,
): Promise<[string, Log]> => {
    const start = performance.now();

    withEdgeTypes(view);

    const { addPromise, awaitPromises } = promiseManager();

    const { existsCache, dataCache, signer, loader, graphAssembler } = dependencies;
    const {
        writeNode,
        writeMetadata,
        writeEdgeReverse,
        writeRights,
        writeFiles,
        getGraphJson,
        getLog: getLogGraphAssembler,
    } = graphAssembler;

    const timeQueryNode = 0;
    const timeQueryEdge = 0;
    const timeLoadEdge = 0;

    const nodeExists = existsCache.node.getNode;

    const canUserRead = (nodeId: string) => existsCache.userRights.getRead(nodeId, userEmail);
    const canUserAdmin = (nodeId: string) => existsCache.userRights.getAdmin(nodeId, userEmail);

    const userHasRole = (role: string) => role === 'public' || canUserRead(role);

    const canRoleRead = (nodeId: string, role: string) => existsCache.roleRights.getRead(nodeId, role);
    const canRoleAdmin = (nodeId: string, role: string) => existsCache.roleRights.getAdmin(nodeId, role);

    const canViewNode = (nodeId: string, asRole: string = 'user') => {
        if (asAdmin) return nodeExists(nodeId);

        if (asRole === 'user') {
            return nodeExists(nodeId) && canUserRead(nodeId);
        }

        return nodeExists(nodeId) && userHasRole(asRole) && canRoleRead(nodeId, asRole);
    };

    const canAdminNode = (nodeId: string, asRole: string = 'user') => {
        if (asAdmin) return nodeExists(nodeId);

        if (asRole === 'user') {
            return nodeExists(nodeId) && canUserAdmin(nodeId);
        }

        return nodeExists(nodeId) && userHasRole(asRole) && canRoleAdmin(nodeId, asRole);
    };

    type OnNodeData = (nodeId: string, data: string) => void | Promise<void>;
    const loadNode = (nodeId: string, onData?: OnNodeData): string | Promise<string> => {
        const data = dataCache.nodes.getNode(nodeId);
        if (data != null) {
            onData && onData(nodeId, data);
            return data;
        } else {
            return addPromise(loadNodeAsync(nodeId, onData));
        }
    };

    const loadNodeAsync = async (nodeId: string, onData?: OnNodeData): Promise<string> => {
        const cachedPromise = dataCache.nodes.getNodePromise(nodeId);
        if (cachedPromise != null) {
            const data = await cachedPromise;
            onData && onData(nodeId, data);
            return data;
        } else {
            const promise = loader.getNode(nodeId);
            dataCache.nodes.setNodePromise(nodeId, promise);
            const data = await promise;
            dataCache.nodes.setNode(nodeId, data);
            dataCache.nodes.removeNodePromise(nodeId);
            onData && onData(nodeId, data);
            return data;
        }
    };

    const loadEdge = (fromId: string, fromType: string, toType: string, toId: string) => {
        if (!fromType || !toType) {
            console.log('LOADEDGE:: Invalid edge key', `${fromId}/${fromType}/${toType}/${toId}`);
            return;
        }
        writeMetadata(fromId, fromType, toType, toId, 'true');
    };

    const loadEdgeReverse = (fromId: string, fromType: string, toType: string, toId: string) => {
        if (!fromType || !toType) {
            console.log('LOADEDGE:: Invalid edge key', `${fromId}/${fromType}/${toType}/${toId}`);
            return;
        }
        writeEdgeReverse(fromId, fromType, toType, toId);
    };

    type OnMetadataData = (fromId: string, edgeTypes: string, fromType: string, toType: string, toId: string) => void;
    const loadMetadata = (
        fromId: string,
        edgeTypes: string,
        fromType: string,
        toType: string,
        toId: string,
        onData?: OnMetadataData,
    ) => {
        if (!fromType || !toType) {
            console.log('LOADMETADATA:: Invalid edge key', `${fromId}/${fromType}/${toType}/${toId}`);
        }
        const data = dataCache.metadata.getMetadata(fromId, edgeTypes, toId);
        if (data != null) {
            onData && onData(fromId, fromType, toType, toId, data);
        } else {
            addPromise(loadMetadataAsync(fromId, edgeTypes, fromType, toType, toId, onData));
        }
    };

    const loadMetadataAsync = async (
        fromId: string,
        edgeTypes: string,
        fromType: string,
        toType: string,
        toId: string,
        onData?: OnMetadataData,
    ) => {
        const cachedPromise = dataCache.metadata.getMetadataPromise(fromId, edgeTypes, toId);
        if (cachedPromise != null) {
            const data = await cachedPromise;
            onData && onData(fromId, fromType, toType, toId, data);
        } else {
            const promise = loader.getMetadata(fromId, edgeTypes, toId); // do a thing
            dataCache.metadata.setMetadataPromise(fromId, edgeTypes, toId, promise);
            const data = await promise;
            dataCache.metadata.setMetadata(fromId, edgeTypes, toId, data);
            dataCache.metadata.removeMetadataPromise(fromId, edgeTypes, toId);
            onData && onData(fromId, fromType, toType, toId, data);
        }
    };

    const loadRights = (nodeId: string) => {
        const userRights = existsCache.userRights.listRights(nodeId);
        const roleRights = existsCache.roleRights.listRights(nodeId);

        if (!userRights && !roleRights) return;

        const rights: { user?: Map<string, unknown>; role?: Map<string, unknown> } = {};
        if (userRights) rights.user = userRights;
        if (roleRights) rights.role = roleRights;

        writeRights(nodeId, rights);
    };
    const loadPrincipalRights = (nodeId: string, role: string) => {
        // at this point we know the user can read but has no admin rights
        if (role === 'user') {
            const canWrite = existsCache.userRights.getWrite(nodeId, userEmail);
            if (canWrite) {
                writeRights(nodeId, `{"user":{"${userEmail}":{"read":true,"write":true}}}`);
            } else {
                writeRights(nodeId, `{"user":{"${userEmail}":{"read":true}}}`);
            }
        } else {
            const canWrite = existsCache.roleRights.getWrite(nodeId, role);
            if (canWrite) {
                writeRights(nodeId, `{"role":{"${role}":{"read":true,"write":true}}}`);
            } else {
                writeRights(nodeId, `{"role":{"${role}":{"read":true}}}`);
            }
        }
    };

    type OnFileData = (nodeId: string, prop: string, data: string) => void;
    const loadFileAsync = async (nodeId: string, { fileKey, prop }: FileRef, onData?: OnFileData) => {
        const fileHead = await loader.getFileHead(fileKey);

        if (!fileHead) return;
        const { contentType, etag, modifiedDate } = fileHead;

        const urlObject = dataCache.urls.getUrl(fileKey, etag);
        if (urlObject && urlObject.expire > Date.now()) {
            onData && onData(nodeId, prop, JSON.stringify({ etag, contentType, modifiedDate, url: urlObject.url }));
        } else {
            dataCache.urls.removeUrl(fileKey, etag);
            const url = signer.signUrl(signer.getUrl(fileKey, etag));
            const twelveHours = 1000 * 60 * 60 * 12;
            dataCache.urls.setUrl(fileKey, etag, { url, expire: Date.now() + twelveHours });

            onData && onData(nodeId, prop, JSON.stringify({ etag, contentType, modifiedDate, url }));
        }
    };

    const loadFilesAsync = async (nodeId: string, onData?: OnFileData) => {
        const fileRefs = await loader.getFileRefs(nodeId);

        if (!fileRefs) return;

        for (let i = 0; i < fileRefs.length; i++) {
            const fileRef = fileRefs[i];
            addPromise(loadFileAsync(nodeId, fileRef, onData));
        }
    };

    const queryNode = (nodeId: string, queryObject: NodeView | EdgeView, role: string) => {
        // const start = performance.now();
        const { include, edges } = queryObject;

        if (edges) {
            const edgeTypes = Object.keys(edges);
            // timeQueryNode += performance.now() - start;
            for (let i = 0; i < edgeTypes.length; i++) {
                const edgeType = edgeTypes[i];
                queryEdges(nodeId, edgeType, edges[edgeType], role);
            }
        }

        // includes after edges, to queue edge loads first if needed
        if (include?.node) loadNode(nodeId, writeNode);
        if (include?.rights) {
            if (canAdminNode(nodeId, role)) {
                loadRights(nodeId);
            } else {
                loadPrincipalRights(nodeId, role);
            }
        }
        if (include?.files) addPromise(loadFilesAsync(nodeId, writeFiles));
    };

    const queryEdges = (nodeId: string, edgeTypes: string, queryObject: EdgeView, _role: string) => {
        if (edgeTypes.includes('*')) {
            addPromise(queryEdgesWildcardAsync(nodeId, edgeTypes, queryObject, _role));
            return;
        }

        const { fromType, toType } = queryObject as WithEdgeTypes;

        // const start = performance.now();
        if (queryObject.reverse) {
            const toId = nodeId;
            const fromIds = existsCache.edgeReverse.listEdgeReverse(toId, edgeTypes);
            if (fromIds == null) return;

            const fromIdsKeys = fromIds.keys();
            // timeQueryEdge += performance.now() - start;
            for (const fromId of fromIdsKeys) {
                const role = queryObject.role ? parseRole(queryObject.role, fromId) : _role;
                if (canViewNode(fromId, role)) {
                    queryNode(fromId, queryObject, role);
                    queryEdge(fromId, edgeTypes, fromType, toType, toId, queryObject);
                }
            }
        } else {
            const fromId = nodeId;
            const toIds = existsCache.edge.listEdge(fromId, edgeTypes);
            if (toIds == null) return;

            const toIdsKeys = toIds.keys();
            // timeQueryEdge += performance.now() - start;
            for (const toId of toIdsKeys) {
                const role = queryObject.role ? parseRole(queryObject.role, toId) : _role;
                if (canViewNode(toId, role)) {
                    queryNode(toId, queryObject, role);
                    queryEdge(fromId, edgeTypes, fromType, toType, toId, queryObject);
                }
            }
        }
    };

    const queryEdgesWildcardAsync = async (nodeId: string, edgeTypes: string, queryObject: EdgeView, _role: string) => {
        // const start = performance.now();
        if (queryObject.reverse) {
            throw new Error('Reverse wildcards are not supported');
        } else {
            const fromId = nodeId;
            const wildcardEdges = await loader.getEdgesWildcard(fromId, edgeTypes);
            // timeQueryEdge += performance.now() - start;
            for (let i = 0; i < wildcardEdges.length; i++) {
                const [fromType, toType, toId] = wildcardEdges[i];
                const role = queryObject.role ? parseRole(queryObject.role, toId) : _role;
                if (canViewNode(toId, role)) {
                    queryNode(toId, queryObject, role);
                    queryEdge(fromId, `${fromType}/${toType}`, fromType, toType, toId, queryObject);
                }
            }
        }
    };

    const queryEdge = (
        fromId: string,
        edgeTypes: string,
        fromType: string,
        toType: string,
        toId: string,
        queryObject: EdgeView,
    ) => {
        const { include, reverse } = queryObject;
        // const start2 = performance.now();
        if (include?.edges && !include.metadata) {
            loadEdge(fromId, fromType, toType, toId);
        } else if (include?.edges && include.metadata) {
            loadMetadata(fromId, edgeTypes, fromType, toType, toId, writeMetadata);
        }
        reverse && loadEdgeReverse(fromId, fromType, toType, toId);
        // timeLoadEdge += performance.now() - start2;
    };

    const fromNodeIdWildcard = (nodeId: string): string | undefined => {
        if (nodeId.endsWith('*')) {
            return nodeId.slice(0, -1);
        }
        return;
    };

    const queryNodeViewWildcardAsync = async (wildcardPrefix: string, queryObject: NodeView) => {
        const nodeIds = await loader.getNodesWildcard(wildcardPrefix);

        if (!nodeIds) return;

        for (let i = 0; i < nodeIds.length; i++) {
            const nodeId = nodeIds[i];
            const role = queryObject.role ? parseRole(queryObject.role, nodeId) : 'user';
            if (canViewNode(nodeId, role)) {
                queryNode(nodeId, queryObject, role);
            }
        }
    };

    const queryNodeView = () => {
        if (view == null) return;
        const nodeIds = Object.keys(view);
        for (let i = 0; i < nodeIds.length; i++) {
            const nodeId = nodeIds[i];

            const wildcardPrefix = fromNodeIdWildcard(nodeId);
            if (wildcardPrefix) {
                addPromise(queryNodeViewWildcardAsync(wildcardPrefix, view[nodeId]));
                continue;
            }

            const queryObject = view[nodeId];
            const role = queryObject.role ? parseRole(queryObject.role, nodeId) : 'user';
            if (canViewNode(nodeId, role)) {
                queryNode(nodeId, queryObject, role);
            }
        }
    };

    queryNodeView();
    await awaitPromises();
    const res = getGraphJson();
    const log: Log = {
        graphAssembler: getLogGraphAssembler(),
        loader: loader.getLog(),
        request: {
            payloadBytes: res.length,
            time: performance.now() - start,
            sendTime: 0,
            timeQueryNode,
            timeQueryEdge,
            timeLoadEdge,
        },
    };
    return [res, log];
};
