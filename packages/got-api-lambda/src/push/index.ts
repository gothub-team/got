import type { DataCache } from './types/dataCache';
import type { Graph, Node, Metadata, UploadNodeFileView, NodeFilesView } from '@gothub/got-core';
import { forEachObjDepth, mergeGraphObjRight } from '@gothub/got-core';
import type { FileMetadata, Loader } from './types/loader';
import type { GraphAssembler } from './types/graphAssembler';
import { promiseManager } from './util/promiseManager';
import type { Log } from './types/logs';
import type { Writer } from './types/writer';
import { MEDIA_DOMAIN, sha256 } from '@gothub/aws-util';
import { BUCKET_MEDIA } from './config';
import type { Signer } from './types/signer';
import { s3putMultipartSignedUrls } from '@gothub/aws-util/s3';

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
): Promise<[string, string, Log]> => {
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

    const removeNulls = <TObj extends Record<string, unknown>>(obj: TObj): TObj => {
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (obj[key] === null) {
                delete obj[key];
            }
        }

        return obj;
    };

    const updateReadRight = async (
        nodeId: string,
        principalType: string,
        principal: string,
        right: boolean,
        create: boolean,
    ) => {
        const exists = create ? false : await loader.getRead(nodeId, principalType, principal);
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
    const updateWriteRight = async (
        nodeId: string,
        principalType: string,
        principal: string,
        right: boolean,
        create: boolean,
    ) => {
        const exists = create ? false : await loader.getWrite(nodeId, principalType, principal);
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
    const updateAdminRight = async (
        nodeId: string,
        principalType: string,
        principal: string,
        right: boolean,
        create: boolean,
    ) => {
        const exists = create ? false : await loader.getAdmin(nodeId, principalType, principal);
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

    const updateNode = async (nodeId: string, node: Node | null, create: boolean) => {
        const nodeJSON = create ? null : await loader.getNode(nodeId);
        if (!nodeJSON && node) {
            await writer.setNode(nodeId, node);
            writeNodeChangelog(nodeId, `{"old":null,"new":${JSON.stringify(node)}}`);
        } else if (nodeJSON && !node) {
            await writer.setNode(nodeId, null);
            writeNodeChangelog(nodeId, `{"old":${nodeJSON},"new":null}`);
        } else if (nodeJSON && node) {
            const oldNode = JSON.parse(nodeJSON);
            const newNode = mergeGraphObjRight(oldNode, node);
            typeof newNode === 'object' && removeNulls(newNode);
            await writer.setNode(nodeId, newNode);
            writeNodeChangelog(nodeId, `{"old":${nodeJSON},"new":${JSON.stringify(newNode)}}`);
        }
    };

    const createNode = async (nodeId: string, node: Node) => {
        const principalType = asRole === 'user' ? 'user' : 'role';
        const principal = asRole === 'user' ? userEmail : asRole;
        await Promise.all([
            updateNode(nodeId, node, true),
            updateReadRight(nodeId, principalType, principal, true, true),
            updateWriteRight(nodeId, principalType, principal, true, true),
            updateAdminRight(nodeId, principalType, principal, true, true),
            updateOwner(nodeId, userEmail),
        ]);
    };

    const updateNodesAsync = async (nodeId: string, node: Node | false) => {
        const canWrite = await canWriteNode(nodeId);
        if (canWrite) {
            await updateNode(nodeId, node ? node : null, false);
            writeNode(nodeId, '{"statusCode":200}');
            return;
        }

        if (node && (await canWriteScope(nodeId)) && !(await loader.ownerExists(nodeId))) {
            await createNode(nodeId, node);
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
            const oldMetadata = JSON.parse(metadataJson) as Metadata;
            const newMetadata = mergeGraphObjRight(oldMetadata, metadata);
            typeof newMetadata === 'object' && removeNulls(newMetadata);
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
                promises.push(updateReadRight(toId, principalType, user, readFrom, false));
            }

            const writeFrom = fromRights?.get(user)?.get('write') === 'true';
            const writeTo = toRights?.get(user)?.get('write') === 'true';
            if (writeFrom !== writeTo) {
                promises.push(updateWriteRight(toId, principalType, user, writeFrom, false));
            }

            const adminFrom = fromRights?.get(user)?.get('admin') === 'true';
            const adminTo = toRights?.get(user)?.get('admin') === 'true';
            if (adminFrom !== adminTo) {
                promises.push(updateAdminRight(toId, principalType, user, adminFrom, false));
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
            await updateReadRight(nodeId, principalType, principal, val, false);
        } else if (right === 'write') {
            await updateWriteRight(nodeId, principalType, principal, val, false);
        } else if (right === 'admin') {
            await updateAdminRight(nodeId, principalType, principal, val, false);
        }

        writePrincipalRight(nodeId, principalType, principal, right, '{"statusCode":200}');
    };

    const updateRightsAsync = async (nodeId: string, rightsObject: Record<string, unknown>) => {
        const canAdmin = await canAdminNode(nodeId);

        if (canAdmin) {
            const promises: Promise<unknown>[] = [];
            const userObj = rightsObject.user as Record<string, Record<string, boolean>> | undefined;
            if (userObj) {
                forEachObjDepth(
                    userObj,
                    (val: boolean, path: string[]) => {
                        const [principal, right] = path;
                        promises.push(updateRightAsync(nodeId, 'user', principal, right, val));
                    },
                    2,
                );
            }

            const roleObj = rightsObject.role as Record<string, Record<string, boolean>> | undefined;
            if (roleObj) {
                forEachObjDepth(
                    roleObj,
                    (val: boolean, path: string[]) => {
                        const [principal, right] = path;
                        promises.push(updateRightAsync(nodeId, 'role', principal, right, val));
                    },
                    2,
                );
            }

            await Promise.all(promises);
        } else {
            const userObj = rightsObject.user as Record<string, Record<string, boolean>> | undefined;
            if (userObj) {
                forEachObjDepth(
                    userObj,
                    (val: boolean, path: string[]) => {
                        const [principal, right] = path;
                        writePrincipalRight(nodeId, 'user', principal, right, '{"statusCode":403}');
                    },
                    2,
                );
            }

            const roleObj = rightsObject.role as Record<string, Record<string, boolean>> | undefined;
            if (roleObj) {
                forEachObjDepth(
                    roleObj,
                    (val: boolean, path: string[]) => {
                        const [principal, right] = path;
                        writePrincipalRight(nodeId, 'role', principal, right, '{"statusCode":403}');
                    },
                    2,
                );
            }
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

    const updateFileMetadata = async (fileKey: string, metadata: FileMetadata) => {
        const oldMetadata = await loader.getFileMetadata(fileKey);

        if (!oldMetadata && metadata) {
            await writer.setFileMetadata(fileKey, metadata);
        } else if (oldMetadata && !metadata) {
            await writer.setFileMetadata(fileKey, null);
        } else if (oldMetadata && metadata) {
            const newMetadata = mergeGraphObjRight(oldMetadata, metadata);
            await writer.setFileMetadata(fileKey, newMetadata);
        }
    };

    const putFile = async (nodeId: string, prop: string, fileMetadata: UploadNodeFileView) => {
        const { filename, contentType, fileSize, partSize = 5242880 } = fileMetadata;
        const fileKey = `file/${sha256(`${nodeId}/${prop}`)}/${filename}`;

        await updateFileRef(nodeId, prop, fileKey);
        await updateFileMetadata(fileKey, {
            nodeId,
            prop,
            filename,
            contentType,
            fileSize,
        });

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
        // TODO: remove file metadata?
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
    const inheritRightsPromise = inheritRights();
    const updateEdgesPromise = updateEdges();
    const updateFilesPromise = updateFiles();

    await inheritRightsPromise;
    const updateRightsPromise = updateRights();

    await Promise.all([updateEdgesPromise, updateRightsPromise, updateFilesPromise]);

    await awaitPromises();

    // TODO write changelog
    await writer.setPushLog(userEmail, 'requestId', getGraphJsonChangelog());

    const res = getGraphJson();
    const changelog = getGraphJsonChangelog();
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
    return [res, changelog, log];
};
