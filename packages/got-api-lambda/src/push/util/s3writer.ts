import { s3delete, s3put } from '@gothub/aws-util/s3';
import {
    BUCKET_EDGES,
    BUCKET_LOGS,
    BUCKET_MEDIA,
    BUCKET_NODES,
    BUCKET_OWNERS,
    BUCKET_REVERSE_EDGES,
    BUCKET_RIGHTS_ADMIN,
    BUCKET_RIGHTS_READ,
    BUCKET_RIGHTS_WRITE,
} from '../config';
import type { Writer } from '../types/writer';
import type { Metadata, Node } from '@gothub/got-core';
import { loadQueue } from '@gothub/aws-util';

// TODO: maybe we could trial seperate queues for each bucket or request time?
const { queueLoad } = loadQueue(100);

// TODO: load queue for s3?
export const s3writer: () => Writer = () => {
    const setNode = async (nodeId: string, data: Node | null) => {
        if (data === null) {
            return queueLoad(() => s3delete(BUCKET_NODES, nodeId));
        } else {
            return queueLoad(() => s3put(BUCKET_NODES, nodeId, data));
        }
    };

    const setMetadata = async (fromId: string, edgeTypes: string, toId: string, data: Metadata | boolean) => {
        if (!data) {
            return queueLoad(() => s3delete(BUCKET_EDGES, `${fromId}/${edgeTypes}/${toId}`));
        } else {
            return queueLoad(() => s3put(BUCKET_EDGES, `${fromId}/${edgeTypes}/${toId}`, data));
        }
    };

    const setReverseEdge = async (toId: string, edgeTypes: string, fromId: string, data: boolean) => {
        if (data) {
            return queueLoad(() => s3put(BUCKET_REVERSE_EDGES, `${toId}/${edgeTypes}/${fromId}`, true));
        } else {
            return queueLoad(() => s3delete(BUCKET_REVERSE_EDGES, `${toId}/${edgeTypes}/${fromId}`));
        }
    };

    const setRight =
        (rightBucket: string) => async (nodeId: string, principalType: string, principal: string, right: boolean) => {
            const rightKey = `${nodeId}/${principalType}/${principal}`;
            if (right) {
                return queueLoad(() => s3put(rightBucket, rightKey, true));
            } else {
                return queueLoad(() => s3delete(rightBucket, rightKey));
            }
        };
    const setOwner = async (nodeId: string, principal: string | null) => {
        if (principal === null) {
            throw new Error('Cannot set owner to null');
        }
        return queueLoad(() => s3put(BUCKET_OWNERS, `${nodeId}/owner/${principal}`, true));
    };

    const setFileRef = async (nodeId: string, prop: string, fileRef: { fileKey: string } | null) => {
        const refId = `ref/${nodeId}/${prop}`;
        if (fileRef === null) {
            return queueLoad(() => s3delete(BUCKET_MEDIA, refId));
        } else {
            return queueLoad(() => s3put(BUCKET_MEDIA, refId, fileRef));
        }
    };

    const setFileMetadata = async (fileKey: string, metadata: Metadata | null) => {
        if (metadata === null) {
            return queueLoad(() => s3delete(BUCKET_MEDIA, `metadata/${fileKey}`));
        } else {
            return queueLoad(() => s3put(BUCKET_MEDIA, `metadata/${fileKey}`, metadata));
        }
    };

    const setUploadId = async (uploadId: string, fileKey: string | null) => {
        if (fileKey === null) {
            return queueLoad(() => s3delete(BUCKET_MEDIA, `uploads/${uploadId}`));
        } else {
            return queueLoad(() => s3put(BUCKET_MEDIA, `uploads/${uploadId}`, { fileKey }));
        }
    };

    const setPushLog = async (userEmail: string, requestId: string, changeset: string) => {
        const timestamp = new Date().toISOString();
        const logEntry = `{"userEmail":"${userEmail}","timestamp":"${timestamp}","requestId":"${requestId}","changeset":${changeset}}`;
        const logKey = `push/${userEmail}/${timestamp}/${requestId}`;
        await queueLoad(() => s3put(BUCKET_LOGS, logKey, logEntry));
    };

    return {
        setNode,
        setMetadata,
        setReverseEdge,
        setRead: setRight(BUCKET_RIGHTS_READ),
        setWrite: setRight(BUCKET_RIGHTS_WRITE),
        setAdmin: setRight(BUCKET_RIGHTS_ADMIN),
        setOwner,
        setFileRef,
        setFileMetadata,
        setUploadId,
        setPushLog,
    };
};
