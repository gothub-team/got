import { forEachObjDepth as _forEachObjDepth } from '@gothub/got-core';
import { type DataCache } from '../types/dataCache';
import { type ExistsCache } from '../types/existCache';
import { type Changes, type Changeset } from '../types/changeset';
import { s3get } from '@gothub/aws-util';
import { BUCKET_LOGS } from '../config';

const forEachObjDepth = _forEachObjDepth as (
    obj: object,
    fnForEach: (value: unknown, path: string[]) => void,
    depth: number,
) => void;

type Dependencies = {
    dataCache: DataCache;
    existsCache: ExistsCache;
};

export type LogBody = {
    key: string;
    changeset: Changeset;
};

const changesetFromEvent = async (body: LogBody) => {
    const key = body?.key;

    if (key) {
        console.log('Loading Log from S3', key);
        try {
            const str = (await s3get(BUCKET_LOGS, key))?.toString();
            const log = str ? (JSON.parse(str) as { changeset: Changeset } | null) : null;
            return log?.changeset || {};
        } catch (e) {
            console.log('error loading changeset', e);
            return {};
        }
    }

    return body?.changeset || {};
};

export const handleLog = async (body: LogBody, dependencies: Dependencies) => {
    const { dataCache, existsCache } = dependencies;

    const { nodes = {}, edges = {}, rights = {} } = await changesetFromEvent(body);

    forEachObjDepth(
        nodes,
        (_changes, path) => {
            const [nodeId] = path;
            const changes = _changes as Changes;
            if (changes && changes.new) {
                existsCache.node.addNode(nodeId);
                dataCache.nodes.removeNode(nodeId);
            } else if (changes && !changes.new) {
                existsCache.node.removeNode(nodeId);
                dataCache.nodes.removeNode(nodeId);
            }
        },
        1,
    );

    forEachObjDepth(
        edges,
        (_changes, path) => {
            const [fromType, fromId, toType, toId] = path; // TODO: this order is old API
            const edgeTypes = `${fromType}/${toType}`;
            const changes = _changes as Changes;
            if (changes && changes.new) {
                existsCache.edge.addEdge(fromId, edgeTypes, toId);
                existsCache.edgeReverse.addEdgeReverse(toId, edgeTypes, fromId);
                dataCache.metadata.removeMetadata(fromId, edgeTypes, toId);
            } else if (changes && !changes.new) {
                existsCache.edge.removeEdge(fromId, edgeTypes, toId);
                existsCache.edgeReverse.removeEdgeReverse(toId, edgeTypes, fromId);
                dataCache.metadata.removeMetadata(fromId, edgeTypes, toId);
            }
        },
        4,
    );

    forEachObjDepth(
        rights,
        (_changes, path) => {
            const changes = _changes as Changes;
            const [nodeId, principalType, principal, rightType] = path;

            if (rightType !== 'read' && rightType !== 'write' && rightType !== 'admin') {
                console.log('Invalid rightType', rightType);
                return;
            }

            if (principalType === 'user') {
                if (changes && changes.new) {
                    existsCache.userRights.addRight(nodeId, principal, rightType);
                } else if (changes && !changes.new) {
                    existsCache.userRights.removeRight(nodeId, principal, rightType);
                }
            } else if (principalType === 'role') {
                if (changes && changes.new) {
                    existsCache.roleRights.addRight(nodeId, principal, rightType);
                } else if (changes && !changes.new) {
                    existsCache.roleRights.removeRight(nodeId, principal, rightType);
                }
            }
        },
        4,
    );
};
