import { type DataCache } from './types/dataCache';
import { Graph, Node, forEachObjDepth, Metadata, UploadNodeFileView, NodeFilesView } from '@gothub/got-core';
import { type Loader } from './types/loader';
import { type GraphAssembler } from './types/graphAssembler';
import { promiseManager } from './util/promiseManager';
import { Log } from './types/logs';
import { Writer } from './types/writer';
import { MEDIA_DOMAIN, s3putMultipartSignedUrls, sha256 } from '@gothub/aws-util';
import { BUCKET_MEDIA } from './config';
import { Signer } from './types/signer';

type Dependencies = {
    // existsCache: ExistsCache;
    dataCache: DataCache;
    loader: Loader;
    writer: Writer;
    signer: Signer;
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

    const { awaitPromises } = promiseManager();

    const { signer, loader, writer, graphAssembler, changelogAssembler } = dependencies;
    const {
        writeNode,
        writeMetadata,
        writePrincipalRight: writePrincipalRight,
        writeInheritRight,
        writeFiles,
        getGraphJson,
        getLog: getLogGraphAssembler,
    } = graphAssembler;
    const {
        writeNode: writeNodeChangelog,
        writeMetadata: writeMetadataChangelog,
        writePrincipalRight: writeRightsChangelog,
        writeFiles: writeFilesChangelog,
        getGraphJson: getGraphJsonChangelog,
    } = changelogAssembler;

    const timeQueryNode = 0;
    const timeQueryEdge = 0;
    const timeLoadEdge = 0;

    const nodeExists = async (nodeId: string): Promise<boolean> => {
        const data = await loader.getNode(nodeId);
        return data != null;
    };

    const canUserRead = (nodeId: string): Promise<boolean> => loader.getRead(nodeId, 'user', userEmail);
    const canUserWrite = (nodeId: string): Promise<boolean> => loader.getWrite(nodeId, 'user', userEmail);
    const canUserAdmin = (nodeId: string): Promise<boolean> => loader.getAdmin(nodeId, 'user', userEmail);

    const userHasRole = async (role: string) => role === 'public' || (await canUserRead(role));

    // const canRoleRead = (nodeId: string, role: string): Promise<boolean> => loader.getRead(nodeId, 'role', role);
    const canRoleWrite = (nodeId: string, role: string): Promise<boolean> => loader.getWrite(nodeId, 'role', role);
    const canRoleAdmin = (nodeId: string, role: string): Promise<boolean> => loader.getAdmin(nodeId, 'role', role);

    // const canViewNode = async (nodeId: string) => {
    //     if (asAdmin) return nodeExists(nodeId);

    //     if (asRole === 'user') {
    //         return (await nodeExists(nodeId)) && (await canUserRead(nodeId));
    //     }

    //     return (await nodeExists(nodeId)) && (await userHasRole(asRole)) && (await canRoleRead(nodeId, asRole));
    // };
    const canWriteNode = async (nodeId: string) => {
        if (asAdmin) return nodeExists(nodeId);

        if (asRole === 'user') {
            return (await nodeExists(nodeId)) && (await canUserWrite(nodeId));
        }

        return (await nodeExists(nodeId)) && (await userHasRole(asRole)) && (await canRoleWrite(nodeId, asRole));
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
                writeRightsChangelog(nodeId, principalType, principal, 'read', 'true');
            } else {
                await writer.setRead(nodeId, principalType, principal, false);
                writeRightsChangelog(nodeId, principalType, principal, 'read', 'false');
            }
        }
    };
    const updateWriteRight = async (nodeId: string, principalType: string, principal: string, right: boolean) => {
        const exists = await loader.getWrite(nodeId, principalType, principal);
        if (!!exists !== right) {
            if (right) {
                await writer.setWrite(nodeId, principalType, principal, true);
                writeRightsChangelog(nodeId, principalType, principal, 'write', 'true');
            } else {
                await writer.setWrite(nodeId, principalType, principal, false);
                writeRightsChangelog(nodeId, principalType, principal, 'write', 'false');
            }
        }
    };
    const updateAdminRight = async (nodeId: string, principalType: string, principal: string, right: boolean) => {
        const exists = await loader.getAdmin(nodeId, principalType, principal);
        if (!!exists !== right) {
            if (right) {
                await writer.setAdmin(nodeId, principalType, principal, true);
                writeRightsChangelog(nodeId, principalType, principal, 'admin', 'true');
            } else {
                await writer.setAdmin(nodeId, principalType, principal, false);
                writeRightsChangelog(nodeId, principalType, principal, 'admin', 'false');
            }
        }
    };
    const updateOwner = async (nodeId: string, principal: string) => {
        return writer.setOwner(nodeId, principal);
        // TODO: add to changelog? owner log was previously not created
    };

    const updateNode = async (nodeId: string, node: Node | null) => {
        const nodeJSON = await loader.getNode(nodeId);
        if (!nodeJSON && node) {
            await writer.setNode(nodeId, node);
            writeNodeChangelog(nodeId, `{"old":null,"new":${JSON.stringify(node)}}`);
        } else if (nodeJSON && !node) {
            await writer.setNode(nodeId, null);
            writeNodeChangelog(nodeId, `{"old":${nodeJSON},"new":null}`);
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
            writeNodeChangelog(nodeId, `{"old":${nodeJSON},"new":${JSON.stringify(newNode)}}`);
        }
    };

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

    const updateMetadata = async (
        fromId: string,
        fromType: string,
        toType: string,
        toId: string,
        metadata: Metadata | boolean,
    ) => {
        const metadataJson = await loader.getMetadata(fromId, `${fromType}/${toType}`, toId);

        if (!metadataJson && metadata) {
            await writer.setMetadata(fromId, `${fromType}/${toType}`, toId, metadata);
            await writer.setReverseEdge(toId, `${toType}/${fromType}`, fromId, true);
            writeMetadataChangelog(fromId, fromType, toType, toId, `{"old":null,"new":${JSON.stringify(metadata)}}`);
        } else if (metadataJson && !metadata) {
            await writer.setMetadata(fromId, `${fromType}/${toType}`, toId, false);
            await writer.setReverseEdge(toId, `${toType}/${fromType}`, fromId, false);
            writeMetadataChangelog(fromId, fromType, toType, toId, `{"old":${metadataJson},"new":null}`);
        } else if (metadataJson && metadata) {
            const oldMetadata = JSON.parse(metadataJson);
            const newMetadata = { ...oldMetadata, ...metadata };
            const keys = Object.keys(newMetadata);
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (metadata[key] === null) {
                    delete newMetadata[key];
                }
            }
            await writer.setMetadata(fromId, `${fromType}/${toType}`, toId, newMetadata);
            writeMetadataChangelog(
                fromId,
                fromType,
                toType,
                toId,
                `{"old":${metadataJson},"new":${JSON.stringify(newMetadata)}}`,
            );
        }
    };

    const updateEdgesAsync = async (
        fromId: string,
        fromType: string,
        toType: string,
        toId: string,
        metadata: Metadata | boolean,
    ) => {
        const canWriteFrom = canWriteNode(fromId);
        const canWriteTo = canWriteNode(toId);
        const canWrite = (await canWriteFrom) && (await canWriteTo);

        if (canWrite) {
            await updateMetadata(fromId, fromType, toType, toId, metadata);
            writeMetadata(fromId, fromType, toType, toId, '{"statusCode":200}');
        } else {
            writeMetadata(fromId, fromType, toType, toId, '{"statusCode":403}');
        }
    };
    const updateEdges = (): Promise<unknown> | void => {
        const edges = graph.edges;
        if (!edges) return;

        const promises: Promise<unknown>[] = [];

        forEachObjDepth(
            edges,
            (val: Metadata | boolean, path: string[]) => {
                const [fromType, fromId, toType, toId] = path;
                promises.push(updateEdgesAsync(fromId, fromType, toType, toId, val));
            },
            4,
        );

        return Promise.all(promises);
    };

    const inheritPrincipalRights = (
        fromRights: Map<string, Map<string, string>> | undefined,
        toRights: Map<string, Map<string, string>> | undefined,
        principalType: string,
        toId: string,
    ): Promise<unknown> => {
        const promises: Promise<unknown>[] = [];
        // new set from keys of from and to user rights
        const users = new Set<string>();
        if (fromRights) {
            for (const user of fromRights.keys()) {
                users.add(user);
            }
        }
        if (toRights) {
            for (const user of toRights.keys()) {
                users.add(user);
            }
        }

        for (const user of users) {
            const readFrom = fromRights?.get(user)?.get('read') === 'true';
            const readTo = toRights?.get(user)?.get('read') === 'true';
            if (readFrom !== readTo) {
                promises.push(updateReadRight(toId, principalType, user, readFrom));
            }

            const writeFrom = fromRights?.get(user)?.get('write') === 'true';
            const writeTo = toRights?.get(user)?.get('write') === 'true';
            if (writeFrom !== writeTo) {
                promises.push(updateWriteRight(toId, principalType, user, writeFrom));
            }

            const adminFrom = fromRights?.get(user)?.get('admin') === 'true';
            const adminTo = toRights?.get(user)?.get('admin') === 'true';
            if (adminFrom !== adminTo) {
                promises.push(updateAdminRight(toId, principalType, user, adminFrom));
            }
        }

        return Promise.all(promises);
    };

    const inheritRigthsAsync = async (fromId: string, toId: string) => {
        const canAdmin = await canAdminNode(toId);

        if (canAdmin) {
            const fromRights = await loader.listRights(fromId);
            const userRightsFrom = fromRights.get('user') as Map<string, Map<string, string>> | undefined;
            const roleRightsFrom = fromRights.get('role') as Map<string, Map<string, string>> | undefined;

            const toRights = await loader.listRights(toId);
            const userRightsTo = toRights.get('user') as Map<string, Map<string, string>> | undefined;
            const roleRightsTo = toRights.get('role') as Map<string, Map<string, string>> | undefined;

            await inheritPrincipalRights(userRightsFrom, userRightsTo, 'user', toId);
            await inheritPrincipalRights(roleRightsFrom, roleRightsTo, 'role', toId);

            writeInheritRight(toId, '{"statusCode":200}');
        } else {
            writeInheritRight(toId, '{"statusCode":403}');
        }
    };
    const inheritRights = (): Promise<unknown> | void => {
        const rights = graph.rights;
        if (!rights) return;

        const nodeIds = Object.keys(rights);

        const promises: Promise<unknown>[] = [];
        for (let i = 0; i < nodeIds.length; i++) {
            const nodeId = nodeIds[i];
            const fromId = rights[nodeId]?.inherit?.from;
            if (!fromId) continue;

            promises.push(inheritRigthsAsync(fromId, nodeId));
        }

        return Promise.all(promises);
    };

    const updateRightAsync = async (
        nodeId: string,
        principalType: string,
        principal: string,
        right: string,
        val: boolean,
    ) => {
        if (right === 'read') {
            await updateReadRight(nodeId, principalType, principal, val);
        } else if (right === 'write') {
            await updateWriteRight(nodeId, principalType, principal, val);
        } else if (right === 'admin') {
            await updateAdminRight(nodeId, principalType, principal, val);
        }

        writePrincipalRight(nodeId, principalType, principal, right, '{"statusCode":200}');
    };

    // TODO: maybe split this before into user and roles, so no check and cheaper map
    const updateRightsAsync = async (nodeId: string, rightsObject: Record<string, unknown>) => {
        const canAdmin = await canAdminNode(nodeId);

        if (canAdmin) {
            const promises: Promise<unknown>[] = [];
            forEachObjDepth(
                rightsObject,
                (val: boolean, path: string[]) => {
                    const [principalType, principal, right] = path;
                    if (principalType !== 'user' && principalType !== 'role') return;
                    promises.push(updateRightAsync(nodeId, principalType, principal, right, val));
                },
                3,
            );

            await Promise.all(promises);
        } else {
            forEachObjDepth(
                rightsObject,
                (val: boolean, path: string[]) => {
                    const [principalType, principal, right] = path;
                    if (principalType !== 'user' && principalType !== 'role') return;
                    writePrincipalRight(nodeId, principalType, principal, right, '{"statusCode":403}');
                },
                3,
            );
        }
    };
    const updateRights = (): Promise<unknown> | void => {
        const rights = graph.rights;
        if (!rights) return;

        const nodeIds = Object.keys(rights);

        const promises: Promise<unknown>[] = [];
        for (let i = 0; i < nodeIds.length; i++) {
            const nodeId = nodeIds[i];
            const nodeRights = rights[nodeId];
            promises.push(updateRightsAsync(nodeId, nodeRights));
        }

        return Promise.all(promises);
    };

    const updateFileRef = async (nodeId: string, prop: string, fileKey: string | null) => {
        const fileRef = await loader.getFileRef(nodeId, prop);

        if (!fileRef && fileKey) {
            const newFileRef = { fileKey };
            await writer.setFileRef(nodeId, prop, newFileRef);
            writeFilesChangelog(nodeId, prop, `{"old":null,"new":${JSON.stringify(newFileRef)}}`);
        } else if (fileRef && !fileKey) {
            await writer.setFileRef(nodeId, prop, null);
            writeFilesChangelog(nodeId, prop, `{"old":${JSON.stringify(fileRef)},"new":null}`);
        } else if (fileRef && fileKey) {
            const newFileRef = { fileKey };
            await writer.setFileRef(nodeId, prop, newFileRef);
            writeFilesChangelog(nodeId, prop, `{"old":${JSON.stringify(fileRef)},"new":${JSON.stringify(newFileRef)}}`);
        }
    };

    const putFile = async (nodeId: string, prop: string, fileMetadata: UploadNodeFileView) => {
        const { filename, contentType, fileSize, partSize = 5242880 } = fileMetadata;
        const fileKey = `file/${sha256(`${nodeId}/${prop}`)}/${filename}`;

        await updateFileRef(nodeId, prop, fileKey);

        // TODO: update file metadata
        // const newMetadata = {
        //     nodeId,
        //     prop,
        //     filename,
        //     contentType,
        //     fileSize,
        // };

        if (fileSize > partSize) {
            // multipart upload
            const multipartUpload = await s3putMultipartSignedUrls(BUCKET_MEDIA, fileKey, {
                contentType,
                fileSize,
                partSize,
            });

            if (!multipartUpload) {
                writeFiles(nodeId, prop, '{"statusCode":500}');
                return;
            }

            const { uploadUrls, uploadId } = multipartUpload;
            await writer.setUploadId(uploadId, fileKey);
            writeFiles(
                nodeId,
                prop,
                `{"statusCode":200,"uploadId":"${uploadId}","uploadUrls":${JSON.stringify(uploadUrls)}}`,
            );
        } else {
            const uploadUrl = signer.signUrl(`https://${MEDIA_DOMAIN}/${fileKey}`); // TODO: move to signer
            writeFiles(nodeId, prop, `{"statusCode":200,"uploadUrls":["${uploadUrl}"]}`);
        }
    };

    const removeFile = async (nodeId: string, prop: string) => {
        await updateFileRef(nodeId, prop, null);
    };

    const updateFilesAsync = async (nodeId: string, files: NodeFilesView<UploadNodeFileView>) => {
        const canWrite = await canWriteNode(nodeId);

        if (canWrite) {
            const propNames = Object.keys(files);
            const promises: Promise<unknown>[] = new Array(propNames.length);
            for (let i = 0; i < propNames.length; i++) {
                const propName = propNames[i];
                const data = files[propName];
                if (data) {
                    promises.push(putFile(nodeId, propName, data));
                } else {
                    promises.push(removeFile(nodeId, propName));
                }
            }

            await Promise.all(promises);
        } else {
            const propNames = Object.keys(files);
            for (let i = 0; i < propNames.length; i++) {
                writeFiles(nodeId, propNames[i], '{"statusCode":403}');
            }
        }
    };
    const updateFiles = (): Promise<unknown> | void => {
        const files = graph.files;
        if (!files) return;

        const nodeIds = Object.keys(files);
        const promises: Promise<unknown>[] = new Array(nodeIds.length);
        for (let i = 0; i < nodeIds.length; i++) {
            const nodeId = nodeIds[i];
            const filesObj = files[nodeId] as NodeFilesView<UploadNodeFileView> | undefined;

            if (!filesObj) continue;
            promises[i] = updateFilesAsync(nodeId, filesObj);
        }

        return Promise.all(promises);
    };

    await updateNodes();
    await updateEdges();
    await inheritRights();
    await updateRights();
    await updateFiles();

    await awaitPromises();

    // TODO write changelog

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
