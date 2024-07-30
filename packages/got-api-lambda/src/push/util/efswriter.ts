import type { Writer } from '../types/writer';
import type { Metadata, Node } from '@gothub/got-core';
import { fsput, fsdelete } from '@gothub/aws-util';
import {
    DIR_EDGES,
    DIR_LOGS,
    DIR_MEDIA,
    DIR_NODES,
    DIR_OWNERS,
    DIR_REVERSE_EDGES,
    DIR_RIGHTS_ADMIN,
    DIR_RIGHTS_READ,
    DIR_RIGHTS_WRITE,
} from '../config';

export const efswriter: () => Writer = () => {
    const setNode = async (nodeId: string, data: Node | null) => {
        if (data === null) {
            return fsdelete(`/mnt/efs/nodes/${nodeId}`);
        } else {
            return fsput(`${DIR_NODES}/${nodeId}`, JSON.stringify(data));
        }
    };

    const setMetadata = async (fromId: string, edgeTypes: string, toId: string, data: Metadata | boolean) => {
        if (!data) {
            return fsdelete(`${DIR_EDGES}/${fromId}/${edgeTypes}/${toId}`);
        } else {
            return fsput(`${DIR_EDGES}/${fromId}/${edgeTypes}/${toId}`, JSON.stringify(data));
        }
    };

    const setReverseEdge = async (toId: string, edgeTypes: string, fromId: string, data: boolean) => {
        if (!data) {
            return fsdelete(`${DIR_REVERSE_EDGES}/${toId}/${edgeTypes}/${fromId}`);
        } else {
            return fsput(`${DIR_REVERSE_EDGES}/${toId}/${edgeTypes}/${fromId}`, 'true');
        }
    };

    const setRight =
        (dirName: string) => async (nodeId: string, principalType: string, principal: string, right: boolean) => {
            const rightKey = `${dirName}/${nodeId}/${principalType}/${principal}`;
            if (!right) {
                return fsdelete(rightKey);
            } else {
                return fsput(rightKey, 'true');
            }
        };
    const setOwner = async (nodeId: string, principal: string | null) => {
        if (principal === null) {
            throw new Error('Cannot set owner to null');
        }

        return fsput(`${DIR_OWNERS}/${nodeId}`, principal);
    };

    const setFileRef = async (nodeId: string, prop: string, fileRef: { fileKey: string } | null) => {
        const refId = `ref/${nodeId}/${prop}`;
        if (fileRef === null) {
            return fsdelete(`${DIR_MEDIA}/${refId}`);
        } else {
            return fsput(`${DIR_MEDIA}/${refId}`, JSON.stringify(fileRef));
        }
    };

    const setFileMetadata = async (fileKey: string, metadata: Metadata | null) => {
        if (metadata === null) {
            return fsdelete(`${DIR_MEDIA}/metadata/${fileKey}`);
        } else {
            return fsput(`${DIR_MEDIA}/metadata/${fileKey}`, JSON.stringify(metadata));
        }
    };

    const setUploadId = async (uploadId: string, fileKey: string | null) => {
        if (fileKey === null) {
            return fsdelete(`${DIR_MEDIA}/uploads/${uploadId}`);
        } else {
            return fsput(`${DIR_MEDIA}/uploads/${uploadId}`, `{"fileKey":"${fileKey}"}`);
        }
    };

    const setPushLog = async (userEmail: string, requestId: string, changeset: string) => {
        const timestamp = new Date().toISOString();
        const logEntry = `{"userEmail":"${userEmail}","timestamp":"${timestamp}","requestId":"${requestId}","changeset":${changeset}}`;
        const logKey = `push/${userEmail}/${timestamp}/${requestId}`;
        await fsput(`${DIR_LOGS}/${logKey}`, logEntry);
    };

    return {
        setNode,
        setMetadata,
        setReverseEdge,
        setRead: setRight(DIR_RIGHTS_READ),
        setWrite: setRight(DIR_RIGHTS_WRITE),
        setAdmin: setRight(DIR_RIGHTS_ADMIN),
        setOwner,
        setFileRef,
        setFileMetadata,
        setUploadId,
        setPushLog,
    };
};
