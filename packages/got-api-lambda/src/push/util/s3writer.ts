import { s3delete, s3put } from '@gothub/aws-util';
import {
    BUCKET_EDGES,
    BUCKET_MEDIA,
    BUCKET_NODES,
    BUCKET_OWNERS,
    BUCKET_REVERSE_EDGES,
    BUCKET_RIGHTS_ADMIN,
    BUCKET_RIGHTS_READ,
    BUCKET_RIGHTS_WRITE,
} from '../config';
import { Writer } from '../types/writer';
import { Metadata, Node } from '@gothub/got-core';

// TODO: load queue for s3?
export const s3writer: () => Writer = () => {
    const setNode = async (nodeId: string, data: Node | null) => {
        if (data === null) {
            return s3delete(BUCKET_NODES, nodeId);
        } else {
            return s3put(BUCKET_NODES, nodeId, data);
        }
    };

    const setMetadata = async (fromId: string, edgeTypes: string, toId: string, data: Metadata | boolean) => {
        if (!data) {
            return s3delete(BUCKET_EDGES, `${fromId}/${edgeTypes}/${toId}`);
        } else {
            return s3put(BUCKET_EDGES, `${fromId}/${edgeTypes}/${toId}`, data);
        }
    };

    const setReverseEdge = async (toId: string, edgeTypes: string, fromId: string, data: boolean) => {
        if (data) {
            return s3put(BUCKET_REVERSE_EDGES, `${toId}/${edgeTypes}/${fromId}`, true);
        } else {
            return s3delete(BUCKET_REVERSE_EDGES, `${toId}/${edgeTypes}/${fromId}`);
        }
    };

    const setRight =
        (rightBucket: string) => async (nodeId: string, principalType: string, principal: string, right: boolean) => {
            const rightKey = `${nodeId}/${principalType}/${principal}`;
            if (right) {
                return s3put(rightBucket, rightKey, true);
            } else {
                return s3delete(rightBucket, rightKey);
            }
        };
    const setOwner = async (nodeId: string, principal: string | null) => {
        if (principal === null) {
            throw new Error('Cannot set owner to null');
        }
        return s3put(BUCKET_OWNERS, `${nodeId}/owner/${principal}`, true);
    };

    const setFileRef = async (nodeId: string, prop: string, fileRef: { fileKey: string } | null) => {
        const refId = `ref/${nodeId}/${prop}`;
        if (fileRef === null) {
            return s3delete(BUCKET_MEDIA, refId);
        } else {
            return s3put(BUCKET_MEDIA, refId, fileRef);
        }
    };

    const setUploadId = async (uploadId: string, fileKey: string | null) => {
        if (fileKey === null) {
            return s3delete(BUCKET_MEDIA, `uploads/${uploadId}`);
        } else {
            return s3put(BUCKET_MEDIA, `uploads/${uploadId}`, { fileKey });
        }
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
        setUploadId,
    };
};
