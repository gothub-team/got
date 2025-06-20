/* eslint-disable prefer-template */
import { loadQueue, substringToFirst, assocMap3 } from '@gothub/aws-util';
import { s3get, s3listKeysPaged, s3head } from '@gothub/aws-util/s3';
import type { EdgeWildcard, Loader } from '../types/loader';
import {
    BUCKET_EDGES,
    BUCKET_NODES,
    BUCKET_REVERSE_EDGES,
    BUCKET_RIGHTS_ADMIN,
    BUCKET_RIGHTS_READ,
    BUCKET_RIGHTS_WRITE,
    BUCKET_OWNERS,
} from '../config';
import type { LoaderLog } from '../types/logs';

// TODO: maybe we could trial seperate queues for each bucket or request time?
const { queueLoad } = loadQueue(200);

const listNodes = async (wildcardPrefix: string) => s3listKeysPaged(BUCKET_NODES, wildcardPrefix);

const listEdge = async (fromId: string, edgeTypes: string) => s3listKeysPaged(BUCKET_EDGES, `${fromId}/${edgeTypes}/`);
const listReverseEdge = async (toId: string, edgeTypes: string) =>
    s3listKeysPaged(BUCKET_REVERSE_EDGES, `${toId}/${edgeTypes}/`);

const listEdgeWildcard = async (fromId: string, edgeTypes: string) => {
    const edgePrefix = substringToFirst(edgeTypes, '*');
    const edgeKeys = await s3listKeysPaged(BUCKET_EDGES, `${fromId}/${edgePrefix}`);

    const pattern = new RegExp(edgeTypes.replaceAll('*', '.*').replaceAll('/', '\\/'));

    if (edgePrefix.length < edgeTypes.length - 2) {
        return edgeKeys.filter((edgeKey) => edgeKey.match(pattern));
    }

    return edgeKeys;
};

export const s3loader: () => Loader = () => {
    let numNodes = 0;
    let numMetadata = 0;
    const numFiles = 0;

    const getNode = async (nodeId: string) => {
        numNodes += 1;
        const data = (await queueLoad(() => s3get(BUCKET_NODES, nodeId))) as string | null;
        if (data == null) {
            return null; // TODO: how is this null handled when coming from cache etc.
        }
        return data.toString();
    };

    const configureGetRight =
        (bucketName: string) => async (nodeId: string, principalType: string, principal: string) => {
            const head = await queueLoad(() => s3head(bucketName, `${nodeId}/${principalType}/${principal}`));
            return !!head;
        };

    const getMetadata = async (fromId: string, edgeTypes: string, toId: string) => {
        numMetadata += 1;
        const data = (await queueLoad(() => s3get(BUCKET_EDGES, fromId + '/' + edgeTypes + '/' + toId))) as
            | string
            | null;
        if (data === null) {
            return 'true';
        } else if (data === undefined) {
            return ''; // TODO: this differs from the pull s3loader
        }
        return data.toString();
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
        const readRightsPromise = queueLoad(() => s3listKeysPaged(BUCKET_RIGHTS_READ, `${nodeId}/`));
        const writeRightsPromise = queueLoad(() => s3listKeysPaged(BUCKET_RIGHTS_WRITE, `${nodeId}/`));
        const adminRightsPromise = queueLoad(() => s3listKeysPaged(BUCKET_RIGHTS_ADMIN, `${nodeId}/`));

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
        const owners = await queueLoad(() => s3listKeysPaged(BUCKET_OWNERS, `${nodeId}/`));
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
        getRead: configureGetRight(BUCKET_RIGHTS_READ),
        getWrite: configureGetRight(BUCKET_RIGHTS_WRITE),
        getAdmin: configureGetRight(BUCKET_RIGHTS_ADMIN),
        getMetadata,
        getEdges,
        getReverseEdges,
        getEdgesWildcard,
        getNodesWildcard,
        listRights,
        ownerExists,
        getLog,
    };
};
