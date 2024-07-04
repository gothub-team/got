import { type DataCache } from './types/dataCache';
import { type NodeView, type EdgeView, type View, Graph, Node } from '@gothub/got-core';
import { type Loader, type FileRef } from './types/loader';
import { type GraphAssembler } from './types/graphAssembler';
import { promiseManager } from './util/promiseManager';
import { Log } from './types/logs';
import { Writer } from './types/writer';

type Dependencies = {
    // existsCache: ExistsCache;
    dataCache: DataCache;
    loader: Loader;
    writer: Writer;
    graphAssembler: GraphAssembler;
    changelogAssembler: GraphAssembler;
};

export const push = async (
    graph: Graph,
    userEmail: string,
    asRole: string,
    asAdmin: boolean,
    dependencies: Dependencies,
): Promise<[string, Log]> => {
    const start = performance.now();

    const { addPromise, awaitPromises } = promiseManager();

    const { dataCache, signer, loader, writer, graphAssembler, changelogAssembler } = dependencies;
    const {
        writeNode,
        writeMetadata,
        writeEdgeReverse,
        writeRights,
        writeFiles,
        getGraphJson,
        getLog: getLogGraphAssembler,
    } = graphAssembler;
    const {
        writeNode: writeNodeChangelog,
        writeMetadata: writeMetadataChangelog,
        writeEdgeReverse: writeEdgeReverseChangelog,
        writeRights: writeRightsChangelog,
        writeFiles: writeFilesChangelog,
        getGraphJson: getGraphJsonChangelog,
        // getLog: getLogGraphAssembler,
    } = changelogAssembler;

    const timeQueryNode = 0;
    const timeQueryEdge = 0;
    const timeLoadEdge = 0;

    const nodeExists = async (nodeId: string): Promise<boolean> => {
        const data = await loader.getNode(nodeId);
        return data != null;
    };

    const nodeOwned = async (nodeId: string): Promise<boolean> => {};

    const canUserRead = (nodeId: string): Promise<boolean> => loader.getRead(nodeId, 'user', userEmail);
    const canUserWrite = (nodeId: string): Promise<boolean> => loader.getWrite(nodeId, 'user', userEmail);
    const canUserAdmin = (nodeId: string): Promise<boolean> => loader.getAdmin(nodeId, 'user', userEmail);

    const userHasRole = async (role: string) => role === 'public' || (await canUserRead(role));

    const canRoleRead = (nodeId: string, role: string): Promise<boolean> => loader.getRead(nodeId, 'role', role);
    const canRoleWrite = (nodeId: string, role: string): Promise<boolean> => loader.getWrite(nodeId, 'role', role);
    const canRoleAdmin = (nodeId: string, role: string): Promise<boolean> => loader.getAdmin(nodeId, 'role', role);

    const canViewNode = async (nodeId: string) => {
        if (asAdmin) return nodeExists(nodeId);

        if (asRole === 'user') {
            return (await nodeExists(nodeId)) && (await canUserRead(nodeId));
        }

        return (await nodeExists(nodeId)) && (await userHasRole(asRole)) && (await canRoleRead(nodeId, asRole));
    };
    const canWriteNode = async (nodeId: string) => {
        if (asAdmin) return nodeExists(nodeId);

        if (asRole === 'user') {
            return (await nodeExists(nodeId)) && (await canUserRead(nodeId));
        }

        return (await nodeExists(nodeId)) && (await userHasRole(asRole)) && (await canRoleRead(nodeId, asRole));
    };

    const canAdminNode = async (nodeId: string) => {
        if (asAdmin) return nodeExists(nodeId);

        if (asRole === 'user') {
            return (await nodeExists(nodeId)) && (await canUserAdmin(nodeId));
        }

        return (await nodeExists(nodeId)) && (await userHasRole(asRole)) && (await canRoleAdmin(nodeId, asRole));
    };

    const toScope = (nodeId: string): string => {
        const lastIndex = nodeId.slice(0, -1).lastIndexOf('.');
        if (lastIndex === -1) {
            return '';
        }
        return nodeId.substring(0, lastIndex + 1);
    };

    const canWriteScope = async (nodeId: string): Promise<boolean> => {
        const scope = toScope(nodeId);
        if (asRole === 'user') {
            return !scope || canUserWrite(scope);
        }

        return !scope || (await canWriteNode(nodeId));
    };

    const updateReadRight = async (nodeId: string, principalType: string, principal: string, right: boolean) => {
        const exists = await loader.getRead(nodeId, principalType, principal);
        if (!!exists !== right) {
            if (right) {
                await writer.setRead(nodeId, principalType, principal, true);
                // TODO: add to changelog
            } else {
                await writer.setRead(nodeId, principalType, principal, false);
                // TODO: add to changelog
            }
        }
    };
    const updateWriteRight = async (nodeId: string, principalType: string, principal: string, right: boolean) => {
        const exists = await loader.getWrite(nodeId, principalType, principal);
        if (!!exists !== right) {
            if (right) {
                await writer.setWrite(nodeId, principalType, principal, true);
                // TODO: add to changelog
            } else {
                await writer.setWrite(nodeId, principalType, principal, false);
                // TODO: add to changelog
            }
        }
    };
    const updateAdminRight = async (nodeId: string, principalType: string, principal: string, right: boolean) => {
        const exists = await loader.getAdmin(nodeId, principalType, principal);
        if (!!exists !== right) {
            if (right) {
                await writer.setAdmin(nodeId, principalType, principal, true);
                // TODO: add to changelog
            } else {
                await writer.setAdmin(nodeId, principalType, principal, false);
                // TODO: add to changelog
            }
        }
    };
    const updateOwner = async (nodeId: string, principal: string) => {
        return writer.setOwner(nodeId, principal);
        // TODO: add to changelog
    };

    const updateNode = async (nodeId: string, node: Node | null) => {
        const nodeJSON = await loader.getNode(nodeId);
        if (!nodeJSON && node) {
            await writer.setNode(nodeId, node);
            // TODO: add to changelog
        } else if (nodeJSON && !node) {
            await writer.setNode(nodeId, null);
            // TODO: add to changelog
        } else if (nodeJSON && node) {
            const oldNode = JSON.parse(nodeJSON);
            const newNode = { ...oldNode, ...node };
            const keys = Object.keys(newNode);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (node[key] === null) {
                    delete newNode[key];
                }
            }
            await writer.setNode(nodeId, newNode);
            // TODO: add to changelog
        }
    };

    // TODO: this was split in the old implementation
    const createNode = async (nodeId: string, node: Node) => {
        const principalType = asRole === 'user' ? 'user' : 'role';
        const principal = asRole === 'user' ? userEmail : asRole;
        await Promise.all([
            updateNode(nodeId, node),
            updateReadRight(nodeId, principalType, principal, true),
            updateWriteRight(nodeId, principalType, principal, true),
            updateAdminRight(nodeId, principalType, principal, true),
            updateOwner(nodeId, userEmail),
        ]);
    };

    const updateNodesAsync = async (nodeId: string, node: Node | false) => {
        // TODO: maybe check for write first before checking owner every time?
        if (node && !(await loader.ownerExists(nodeId)) && (await canWriteScope(nodeId))) {
            await createNode(nodeId, node);
            writeNode(nodeId, '{"statusCode":200}');
            return;
        }

        const canWrite = await canWriteNode(nodeId);
        if (canWrite) {
            await updateNode(nodeId, node ? node : null);
            writeNode(nodeId, '{"statusCode":200}');
            return;
        }

        console.log(
            'node',
            node,
            'owned',
            await loader.ownerExists(nodeId),
            'canWriteScope',
            await canWriteScope(nodeId),
            'canWrite',
            canWrite,
        );

        writeNode(nodeId, '{"statusCode":403}');
        return;
    };

    const updateNodes = (): Promise<unknown> | void => {
        const nodes = graph.nodes;
        if (!nodes) return;

        const nodeIds = Object.keys(nodes);
        const promises: Promise<unknown>[] = new Array(nodeIds.length);
        for (let i = 0; i < nodeIds.length; i++) {
            const nodeId = nodeIds[i];
            const node = nodes[nodeId] as Node | false;
            promises[i] = updateNodesAsync(nodeId, node);
        }

        return Promise.all(promises);
    };

    await updateNodes();
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
