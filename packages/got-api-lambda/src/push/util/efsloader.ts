import { loadQueue, substringToFirst, assocMap3, fsget, fsexist, fslist } from '@gothub/aws-util';
import { FileMetadata, type EdgeWildcard, type FileHead, type FileRef, type Loader } from '../types/loader';
import type { LoaderLog } from '../types/logs';
import {
    DIR_EDGES,
    DIR_MEDIA,
    DIR_NODES,
    DIR_OWNERS,
    DIR_REVERSE_EDGES,
    DIR_RIGHTS_ADMIN,
    DIR_RIGHTS_READ,
    DIR_RIGHTS_WRITE,
} from '../config';

// TODO: maybe we could trial seperate queues for each bucket or request time?
const { queueLoad } = loadQueue(200);

const listNodes = async (wildcardPrefix: string) => fslist(DIR_NODES, `${wildcardPrefix}`);

const listEdge = async (fromId: string, edgeTypes: string) => fslist(DIR_EDGES, `${fromId}/${edgeTypes}/`);
const listReverseEdge = async (toId: string, edgeTypes: string) => fslist(DIR_REVERSE_EDGES, `${toId}/${edgeTypes}/`);

const listEdgeWildcard = async (fromId: string, edgeTypes: string) => {
    const edgePrefix = substringToFirst(edgeTypes, '*');
    const edgeKeys = await fslist(DIR_EDGES, `${fromId}/${edgePrefix}`);

    const pattern = new RegExp(edgeTypes.replaceAll('*', '.*').replaceAll('/', '\\/'));

    if (edgePrefix.length < edgeTypes.length - 2) {
        return edgeKeys.filter((edgeKey) => edgeKey.match(pattern));
    }

    return edgeKeys;
};

const loadRef = async (refId: string) => {
    const [, , prop] = refId.split('/');
    const res = await fsget(`${DIR_MEDIA}/${refId}`);
    const { fileKey = '' } = res ? (JSON.parse(res) as { fileKey: string }) : {};
    return { prop, fileKey };
};
const listRefs = async (nodeId: string) => {
    const keys = await fslist(DIR_MEDIA, `ref/${nodeId}/`);

    const promises = new Array(keys.length);
    for (let i = 0; i < keys.length; i++) {
        promises[i] = loadRef(keys[i]);
    }
    return Promise.all(promises);
};

export const efsloader: () => Loader = () => {
    let numNodes = 0;
    let numMetadata = 0;
    const numFiles = 0;

    const getNode = async (nodeId: string) => {
        numNodes += 1;
        return queueLoad(async () => fsget(`${DIR_NODES}/${nodeId}`));
    };

    const configureGetRight = (dirName: string) => (nodeId: string, principalType: string, principal: string) => {
        return queueLoad(async () => fsexist(`${dirName}/${nodeId}/${principalType}/${principal}`));
    };

    const getMetadata = async (fromId: string, edgeTypes: string, toId: string) => {
        numMetadata += 1;
        const data = await queueLoad(() => fsget(`${DIR_EDGES}/${fromId}/${edgeTypes}/${toId}`));
        if (data == null) {
            return '';
        }
        return data;
    };

    const getFileHead = async (fileKey: string): Promise<FileHead | false | undefined> => undefined; //         queueLoad(() => s3head(BUCKET_MEDIA, fileKey) as Promise<FileHead | false | undefined>);

    const getFileRef = async (nodeId: string, prop: string): Promise<FileRef | null> => {
        const refId = `ref/${nodeId}/${prop}`;
        const res = await fsget(`${DIR_MEDIA}/${refId}`);
        if (!res) return null;

        const { fileKey = '' } = JSON.parse(res) as { fileKey: string };
        return { prop, fileKey };
    };

    const getFileRefs = async (nodeId: string) => queueLoad(() => listRefs(nodeId)) as Promise<Array<FileRef>>;

    const getFileMetadata = async (fileKey: string): Promise<FileMetadata | null> => {
        const metadataKey = `metadata/${fileKey}`;
        const res = await fsget(`${DIR_MEDIA}/${metadataKey}`);
        if (!res) return null;

        return JSON.parse(res) as FileMetadata;
    };

    const getUpload = async (uploadId: string) => {
        const res = await fsget(`${DIR_MEDIA}/uploads/${uploadId}`);
        if (!res) return null;

        const { fileKey = '' } = JSON.parse(res) as { fileKey: string };
        return fileKey;
    };

    const getEdgesWildcard = async (nodeId: string, edgeType: string): Promise<Array<EdgeWildcard>> => {
        const edgeKeys = (await queueLoad(() => listEdgeWildcard(nodeId, `${edgeType}/`))) as Array<string>;

        if (!edgeKeys) return [];

        const result = new Array<EdgeWildcard>(edgeKeys.length);
        for (let i = 0; i < edgeKeys.length; i++) {
            const [, fromType, toType, toId] = edgeKeys[i].split('/');
            result[i] = [fromType, toType, toId];
        }

        return result;
    };

    const getEdges = async (nodeId: string, edgeTypes: string): Promise<Map<string, boolean>> => {
        const edges = (await queueLoad(() => listEdge(nodeId, edgeTypes))) as Array<string>;

        const result = new Map<string, boolean>();
        for (let i = 0; i < edges.length; i++) {
            const [, , , toId] = edges[i].split('/');
            result.set(toId, true);
        }

        return result;
    };
    const getReverseEdges = async (nodeId: string, edgeTypes: string): Promise<Map<string, boolean>> => {
        const edges = (await queueLoad(() => listReverseEdge(nodeId, edgeTypes))) as Array<string>;

        const result = new Map<string, boolean>();
        for (let i = 0; i < edges.length; i++) {
            const [, , , fromId] = edges[i].split('/');
            result.set(fromId, true);
        }

        return result;
    };

    const getNodesWildcard = async (wildcardPrefix: string): Promise<Array<string>> =>
        queueLoad(() => listNodes(wildcardPrefix)) as Promise<Array<string>>;

    const listRights = async (nodeId: string) => {
        const readRightsPromise = queueLoad(() => fslist(DIR_RIGHTS_READ, `${nodeId}/`));
        const writeRightsPromise = queueLoad(() => fslist(DIR_RIGHTS_WRITE, `${nodeId}/`));
        const adminRightsPromise = queueLoad(() => fslist(DIR_RIGHTS_ADMIN, `${nodeId}/`));

        const readRights = await readRightsPromise;
        const writeRights = await writeRightsPromise;
        const adminRights = await adminRightsPromise;

        const res = new Map<string, unknown>();
        for (let i = 0; i < readRights.length; i++) {
            const [, principalType, principal] = readRights[i].split('/');
            if (principalType === 'user' || principalType === 'role') {
                assocMap3(principalType, principal, 'read', 'true', res);
            }
        }
        for (let i = 0; i < writeRights.length; i++) {
            const [, principalType, principal] = writeRights[i].split('/');
            if (principalType === 'user' || principalType === 'role') {
                assocMap3(principalType, principal, 'write', 'true', res);
            }
        }
        for (let i = 0; i < adminRights.length; i++) {
            const [, principalType, principal] = adminRights[i].split('/');
            if (principalType === 'user' || principalType === 'role') {
                assocMap3(principalType, principal, 'admin', 'true', res);
            }
        }

        return res;
    };

    const ownerExists = async (nodeId: string) => {
        const owners = await queueLoad(() => fslist(DIR_OWNERS, `${nodeId}/`));
        return owners && owners.length > 0;
    };

    const getLog = (): LoaderLog => {
        return {
            nodes: numNodes,
            metadata: numMetadata,
            files: numFiles,
        };
    };

    return {
        getNode,
        getRead: configureGetRight(DIR_RIGHTS_READ),
        getWrite: configureGetRight(DIR_RIGHTS_WRITE),
        getAdmin: configureGetRight(DIR_RIGHTS_ADMIN),
        ownerExists,
        getMetadata,
        getFileHead,
        getFileRef,
        getFileRefs,
        getFileMetadata,
        getUpload,
        getEdges,
        getReverseEdges,
        getEdgesWildcard,
        getNodesWildcard,
        listRights,
        getLog,
    };
};
