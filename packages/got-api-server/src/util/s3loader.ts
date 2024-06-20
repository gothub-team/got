/* eslint-disable prefer-template */
import { s3get, s3head, loadQueue, s3listKeysPaged, substringToFirst } from '@gothub/aws-util';
import { type EdgeWildcard, type FileHead, type FileRef, type Loader } from '../types/loader';
import { BUCKET_EDGES, BUCKET_MEDIA, BUCKET_NODES } from '../config';
import type { LoaderLog } from '../types/logs';

// TODO: maybe we could trial seperate queues for each bucket or request time?
const { queueLoad } = loadQueue(200);

const listNodes = async (wildcardPrefix: string) => s3listKeysPaged(BUCKET_NODES, wildcardPrefix);

const listEdgeWildcard = async (fromId: string, edgeTypes: string) => {
    const edgePrefix = substringToFirst(edgeTypes, '*');
    const edgeKeys = await s3listKeysPaged(BUCKET_EDGES, `${fromId}/${edgePrefix}`);

    const pattern = new RegExp(edgeTypes.replaceAll('*', '.*').replaceAll('/', '\\/'));

    if (edgePrefix.length < edgeTypes.length - 2) {
        return edgeKeys.filter((edgeKey) => edgeKey.match(pattern));
    }

    return edgeKeys;
};

const loadRef = async (refId: string) => {
    const [, , prop] = refId.split('/');
    const res = await s3get(BUCKET_MEDIA, refId);
    const { fileKey = '' } = res ? (JSON.parse(res.toString()) as { fileKey: string }) : {};
    return { prop, fileKey };
};
const listRefs = async (nodeId: string) => {
    const keys = await s3listKeysPaged(BUCKET_MEDIA, `ref/${nodeId}`);

    const promises = new Array(keys.length);
    for (let i = 0; i < keys.length; i++) {
        promises[i] = loadRef(keys[i]);
    }
    return Promise.all(promises);
};

export const s3loader: () => Loader = () => {
    let numNodes = 0;
    let numMetadata = 0;
    const numFiles = 0;

    const getNode = async (nodeId: string) => {
        numNodes += 1;
        const data = (await queueLoad(() => s3get(BUCKET_NODES, nodeId))) as string | null;
        if (data == null) {
            throw new Error('Node not found');
        }
        return data.toString();
    };
    const getMetadata = async (fromId: string, edgeTypes: string, toId: string) => {
        numMetadata += 1;
        const data = (await queueLoad(() => s3get(BUCKET_EDGES, fromId + '/' + edgeTypes + '/' + toId))) as
            | string
            | null;
        if (data == null) {
            return 'true';
        }
        return data.toString();
    };

    const getFileHead = (fileKey: string): Promise<FileHead | false | undefined> =>
        queueLoad(() => s3head(BUCKET_MEDIA, fileKey) as Promise<FileHead | false | undefined>);

    const getFileRefs = async (nodeId: string) => queueLoad(() => listRefs(nodeId)) as Promise<Array<FileRef>>;

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

    const getNodesWildcard = async (wildcardPrefix: string): Promise<Array<string>> =>
        queueLoad(() => listNodes(wildcardPrefix)) as Promise<Array<string>>;

    const getLog = (): LoaderLog => {
        return {
            nodes: numNodes,
            metadata: numMetadata,
            files: numFiles,
        };
    };

    return {
        getNode,
        getMetadata,
        getFileHead,
        getFileRefs,
        getEdgesWildcard,
        getNodesWildcard,
        getLog,
    };
};
