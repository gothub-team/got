import type { DataCache } from './types/dataCache';
import type { NodeView, EdgeView, View } from '@gothub/got-core';
import type { WithEdgeTypes } from './util/withEdgeTypes';
import { withEdgeTypes } from './util/withEdgeTypes';
import type { Signer } from './types/signer';
import type { GraphAssembler } from './types/graphAssembler';
import { promiseManager } from './util/promiseManager';
import type { FileRef, FileService } from '../shared/files.service';
import type { Log } from '../shared/logs';
import type { GraphService } from '../shared/graph.service';
import type { RightsService } from '../shared/rights.service';

const parseRole = (role: string, nodeId: string): string => role.replaceAll('$NODEID', nodeId);

type Dependencies = {
    // existsCache: ExistsCache;
    dataCache: DataCache;
    graphService: GraphService;
    rightsService: RightsService;
    fileService: FileService;
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

    const { dataCache, signer, graphService, rightsService, fileService, graphAssembler } = dependencies;
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

    const nodeExists = async (nodeId: string): Promise<boolean> => {
        const data = await graphService.getNode(nodeId);
        return data != null;
    };

    const canUserRead = (nodeId: string): Promise<boolean> => rightsService.getRead(nodeId, 'user', userEmail);
    const canUserWrite = (nodeId: string): Promise<boolean> => rightsService.getWrite(nodeId, 'user', userEmail);
    const canUserAdmin = (nodeId: string): Promise<boolean> => rightsService.getAdmin(nodeId, 'user', userEmail);

    const userHasRole = async (role: string) => role === 'public' || (await canUserRead(role));

    const canRoleRead = (nodeId: string, role: string): Promise<boolean> => rightsService.getRead(nodeId, 'role', role);
    const canRoleWrite = (nodeId: string, role: string): Promise<boolean> =>
        rightsService.getWrite(nodeId, 'role', role);
    const canRoleAdmin = (nodeId: string, role: string): Promise<boolean> =>
        rightsService.getAdmin(nodeId, 'role', role);

    const canViewNode = async (nodeId: string, asRole: string = 'user') => {
        if (asAdmin) return nodeExists(nodeId);

        if (asRole === 'user') {
            return (await nodeExists(nodeId)) && (await canUserRead(nodeId));
        }

        return (await nodeExists(nodeId)) && (await userHasRole(asRole)) && (await canRoleRead(nodeId, asRole));
    };

    const canAdminNode = async (nodeId: string, asRole: string = 'user') => {
        if (asAdmin) return nodeExists(nodeId);

        if (asRole === 'user') {
            return (await nodeExists(nodeId)) && (await canUserAdmin(nodeId));
        }

        return (await nodeExists(nodeId)) && (await userHasRole(asRole)) && (await canRoleAdmin(nodeId, asRole));
    };

    type OnNodeData = (nodeId: string, data: string) => void | Promise<void>;
    const loadNode = (nodeId: string, onData?: OnNodeData): string | null | Promise<string | null> => {
        const data = dataCache.nodes.getNode(nodeId);
        if (data != null) {
            onData && onData(nodeId, data);
            return data;
        } else {
            return addPromise(loadNodeAsync(nodeId, onData));
        }
    };

    const loadNodeAsync = async (nodeId: string, onData?: OnNodeData): Promise<string | null> => {
        const cachedPromise = dataCache.nodes.getNodePromise(nodeId);
        if (cachedPromise != null) {
            const data = await cachedPromise;
            onData && onData(nodeId, data);
            return data;
        } else {
            const promise = graphService.getNode(nodeId);
            dataCache.nodes.setNodePromise(nodeId, promise as Promise<string>);
            const data = await promise;
            if (data !== null) {
                dataCache.nodes.setNode(nodeId, data);
                dataCache.nodes.removeNodePromise(nodeId);
                onData && onData(nodeId, data);
                return data;
            }
            dataCache.nodes.removeNodePromise(nodeId);
        }

        return null;
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

    type OnMetadataData = (fromId: string, fromType: string, toType: string, toId: string, data: string) => void;
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
            const promise = graphService.getMetadata(fromId, edgeTypes, toId); // do a thing
            dataCache.metadata.setMetadataPromise(fromId, edgeTypes, toId, promise);
            const data = await promise;
            dataCache.metadata.setMetadata(fromId, edgeTypes, toId, data);
            dataCache.metadata.removeMetadataPromise(fromId, edgeTypes, toId);
            onData && onData(fromId, fromType, toType, toId, data);
        }
    };

    const loadRights = async (nodeId: string) => {
        const resMap = await rightsService.listRights(nodeId);

        const userRights = resMap.get('user') as Map<string, unknown>;
        const roleRights = resMap.get('role') as Map<string, unknown>;

        if (!userRights && !roleRights) return;

        const rights: { user?: Map<string, unknown>; role?: Map<string, unknown> } = {};
        if (userRights) rights.user = userRights;
        if (roleRights) rights.role = roleRights;

        writeRights(nodeId, rights);
    };
    const loadPrincipalRights = async (nodeId: string, role: string) => {
        // at this point we know the user can read but has no admin rights
        if (role === 'user') {
            const canWrite = await canUserWrite(nodeId);
            if (canWrite) {
                writeRights(nodeId, `{"user":{"${userEmail}":{"read":true,"write":true}}}`);
            } else {
                writeRights(nodeId, `{"user":{"${userEmail}":{"read":true}}}`);
            }
        } else {
            const canWrite = await canRoleWrite(nodeId, role);
            if (canWrite) {
                writeRights(nodeId, `{"role":{"${role}":{"read":true,"write":true}}}`);
            } else {
                writeRights(nodeId, `{"role":{"${role}":{"read":true}}}`);
            }
        }
    };

    type OnFileData = (nodeId: string, prop: string, data: string) => void;
    const loadFileAsync = async (nodeId: string, { fileKey, prop }: FileRef, onData?: OnFileData) => {
        const fileHead = await fileService.getFileHead(fileKey);

        if (!fileHead) return;
        const { contentType, etag, modifiedDate } = fileHead;

        const urlObject = dataCache.urls.getUrl(fileKey, etag);
        if (urlObject && urlObject.expire > Date.now()) {
            onData && onData(nodeId, prop, JSON.stringify({ etag, contentType, modifiedDate, url: urlObject.url }));
            return;
        } else {
            dataCache.urls.removeUrl(fileKey, etag);
            const url = signer.signUrl(signer.getUrl(fileKey, etag));
            const twelveHours = 1000 * 60 * 60 * 12;
            dataCache.urls.setUrl(fileKey, etag, { url, expire: Date.now() + twelveHours });

            onData && onData(nodeId, prop, JSON.stringify({ etag, contentType, modifiedDate, url }));
        }
    };

    const loadFilesAsync = async (nodeId: string, onData?: OnFileData) => {
        const fileRefs = await fileService.getFileRefs(nodeId);

        if (!fileRefs) return;

        for (let i = 0; i < fileRefs.length; i++) {
            const fileRef = fileRefs[i];
            addPromise(loadFileAsync(nodeId, fileRef, onData));
        }
    };

    const queryNode = async (nodeId: string, queryObject: NodeView | EdgeView, role: string) => {
        const { include, edges } = queryObject;

        if (edges) {
            const edgeTypes = Object.keys(edges);
            for (let i = 0; i < edgeTypes.length; i++) {
                const edgeType = edgeTypes[i];
                addPromise(queryEdges(nodeId, edgeType, edges[edgeType], role));
            }
        }

        // includes after edges, to queue edge loads first if needed
        if (include?.node) loadNode(nodeId, writeNode);
        if (include?.files) addPromise(loadFilesAsync(nodeId, writeFiles));
        if (include?.rights) {
            if (await canAdminNode(nodeId, role)) {
                await loadRights(nodeId);
            } else {
                await loadPrincipalRights(nodeId, role);
            }
        }
    };

    const queryEdgesAsync = async (
        queryObject: EdgeView,
        role: string,
        edgeTypes: string,
        nodeId: string,
        fromId: string,
        fromType: string,
        toType: string,
        toId: string,
    ) => {
        if (await canViewNode(nodeId, role)) {
            addPromise(queryNode(nodeId, queryObject, role));
            queryEdge(fromId, edgeTypes, fromType, toType, toId, queryObject);
        }
    };
    const queryEdges = async (nodeId: string, edgeTypes: string, queryObject: EdgeView, _role: string) => {
        if (edgeTypes.includes('*')) {
            addPromise(queryEdgesWildcardAsync(nodeId, edgeTypes, queryObject, _role));
            return;
        }

        const { fromType, toType } = queryObject as WithEdgeTypes;

        if (queryObject.reverse) {
            const toId = nodeId;
            const fromIds = await graphService.getReverseEdges(toId, `${toType}/${fromType}`);
            if (fromIds == null) return;

            const fromIdsKeys = fromIds.keys();
            for (const fromId of fromIdsKeys) {
                const role = queryObject.role ? parseRole(queryObject.role, fromId) : _role;
                addPromise(queryEdgesAsync(queryObject, role, edgeTypes, fromId, fromId, fromType, toType, toId));
            }
        } else {
            const fromId = nodeId;
            const toIds = await graphService.getEdges(fromId, edgeTypes);
            if (toIds == null) return;

            const toIdsKeys = toIds.keys();
            for (const toId of toIdsKeys) {
                const role = queryObject.role ? parseRole(queryObject.role, toId) : _role;
                addPromise(queryEdgesAsync(queryObject, role, edgeTypes, toId, fromId, fromType, toType, toId));
            }
        }
    };

    const queryEdgesWildcardAsync = async (nodeId: string, edgeTypes: string, queryObject: EdgeView, _role: string) => {
        if (queryObject.reverse) {
            throw new Error('Reverse wildcards are not supported');
        } else {
            const fromId = nodeId;
            const wildcardEdges = await graphService.getEdgesWildcard(fromId, edgeTypes);
            for (let i = 0; i < wildcardEdges.length; i++) {
                const [fromType, toType, toId] = wildcardEdges[i];
                const role = queryObject.role ? parseRole(queryObject.role, toId) : _role;
                addPromise(
                    queryEdgesAsync(queryObject, role, `${fromType}/${toType}`, toId, fromId, fromType, toType, toId),
                );
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
        if (include?.edges && !include.metadata) {
            loadEdge(fromId, fromType, toType, toId);
        } else if (include?.edges && include.metadata) {
            loadMetadata(fromId, edgeTypes, fromType, toType, toId, writeMetadata);
        }
        reverse && loadEdgeReverse(fromId, fromType, toType, toId);
    };

    const fromNodeIdWildcard = (nodeId: string): string | undefined => {
        if (nodeId.endsWith('*')) {
            return nodeId.slice(0, -1);
        }
        return;
    };

    const queryNodeViewWildcardAsync = async (wildcardPrefix: string, queryObject: NodeView) => {
        const nodeIds = await graphService.getNodesWildcard(wildcardPrefix);

        if (!nodeIds) return;

        for (let i = 0; i < nodeIds.length; i++) {
            const nodeId = nodeIds[i];
            const role = queryObject.role ? parseRole(queryObject.role, nodeId) : 'user';
            addPromise(queryNodeViewAsync(nodeId, queryObject, role));
        }
    };

    const queryNodeViewAsync = async (nodeId: string, queryObject: EdgeView, role: string) => {
        if (await canViewNode(nodeId, role)) {
            return queryNode(nodeId, queryObject, role);
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

            addPromise(queryNodeViewAsync(nodeId, queryObject, role));
        }
    };

    queryNodeView();
    await awaitPromises();
    const res = getGraphJson();
    const log: Log = {
        graphAssembler: getLogGraphAssembler(),
        loader: graphService.getLog(),
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
