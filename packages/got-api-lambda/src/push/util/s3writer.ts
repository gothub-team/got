import { s3delete, s3put } from '@gothub/aws-util';
import { BUCKET_NODES, BUCKET_OWNERS, BUCKET_RIGHTS_ADMIN, BUCKET_RIGHTS_READ, BUCKET_RIGHTS_WRITE } from '../config';
import { Writer } from '../types/writer';
import { Node } from '@gothub/got-core';

export const s3writer: () => Writer = () => {
    const setNode = async (nodeId: string, data: Node | null) => {
        if (data === null) {
            return s3delete(BUCKET_NODES, nodeId);
        } else {
            return s3put(BUCKET_NODES, nodeId, data);
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

    return {
        setNode,
        setRead: setRight(BUCKET_RIGHTS_READ),
        setWrite: setRight(BUCKET_RIGHTS_WRITE),
        setAdmin: setRight(BUCKET_RIGHTS_ADMIN),
        setOwner,
    };
};
