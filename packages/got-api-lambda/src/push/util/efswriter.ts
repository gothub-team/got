import { Writer } from '../types/writer';
import { Metadata, Node } from '@gothub/got-core';
import { mkdirSync, writeFileSync, rmSync } from 'fs';

// TODO: load queue for s3?
export const efswriter: () => Writer = () => {
    const setNode = async (nodeId: string, data: Node | null) => {
        if (data === null) {
            return rmSync(`/mnt/efs/nodes/${nodeId}`);
        } else {
            console.log('Creating directory', `/mnt/efs/nodes`);
            await mkdirSync(`/mnt/efs/nodes`, { recursive: true });
            console.log('Creating file', `/mnt/efs/nodes/${nodeId}`);
            return writeFileSync(`/mnt/efs/nodes/${nodeId}`, JSON.stringify(data));
        }
    };

    const setMetadata = async (fromId: string, edgeTypes: string, toId: string, data: Metadata | boolean) => {
        // if (!data) {
        //     return s3delete(BUCKET_EDGES, `${fromId}/${edgeTypes}/${toId}`);
        // } else {
        //     return s3put(BUCKET_EDGES, `${fromId}/${edgeTypes}/${toId}`, data);
        // }
    };

    const setReverseEdge = async (toId: string, edgeTypes: string, fromId: string, data: boolean) => {
        // if (data) {
        //     return s3put(BUCKET_REVERSE_EDGES, `${toId}/${edgeTypes}/${fromId}`, true);
        // } else {
        //     return s3delete(BUCKET_REVERSE_EDGES, `${toId}/${edgeTypes}/${fromId}`);
        // }
    };

    const setRight =
        (dirName: string) => async (nodeId: string, principalType: string, principal: string, right: boolean) => {
            // const rightKey = `${nodeId}/${principalType}/${principal}`;
            if (right) {
                console.log('Creating directory', `/mnt/efs/${dirName}/${nodeId}/${principalType}`);
                await mkdirSync(`/mnt/efs/${dirName}/${nodeId}/${principalType}`, { recursive: true });
                console.log('Creating file', `/mnt/efs/${dirName}/${nodeId}/${principalType}/${principal}`);
                return writeFileSync(`/mnt/efs/${dirName}/${nodeId}/${principalType}/${principal}`, 'true');
            } else {
                return rmSync(`/mnt/efs/${dirName}/${nodeId}/${principalType}/${principal}`);
            }
        };
    const setOwner = async (nodeId: string, principal: string | null) => {
        if (principal === null) {
            throw new Error('Cannot set owner to null');
        }

        await mkdirSync(`/mnt/efs/owners/${nodeId}`, { recursive: true });
        return writeFileSync(`/mnt/efs/owners/${nodeId}/${principal}`, 'true');
    };

    const setFileRef = async (nodeId: string, prop: string, fileRef: { fileKey: string } | null) => {
        // const refId = `ref/${nodeId}/${prop}`;
        // if (fileRef === null) {
        //     return s3delete(BUCKET_MEDIA, refId);
        // } else {
        //     return s3put(BUCKET_MEDIA, refId, fileRef);
        // }
    };

    const setFileMetadata = async (fileKey: string, metadata: Metadata | null) => {
        // if (metadata === null) {
        //     return s3delete(BUCKET_MEDIA, `metadata/${fileKey}`);
        // } else {
        //     return s3put(BUCKET_MEDIA, `metadata/${fileKey}`, metadata);
        // }
    };

    const setUploadId = async (uploadId: string, fileKey: string | null) => {
        // if (fileKey === null) {
        //     return s3delete(BUCKET_MEDIA, `uploads/${uploadId}`);
        // } else {
        //     return s3put(BUCKET_MEDIA, `uploads/${uploadId}`, { fileKey });
        // }
    };

    const setPushLog = async (userEmail: string, requestId: string, changeset: string) => {
        // const timestamp = new Date().toISOString();
        // const logEntry = `{"userEmail":"${userEmail}","timestamp":"${timestamp}","requestId":"${requestId}","changeset":${changeset}}`;
        // const logKey = `push/${userEmail}/${timestamp}/${requestId}`;
        // await s3put(BUCKET_LOGS, logKey, logEntry);
    };

    return {
        setNode,
        setMetadata,
        setReverseEdge,
        setRead: setRight('rights-read'),
        setWrite: setRight('rights-write'),
        setAdmin: setRight('rights-admin'),
        setOwner,
        setFileRef,
        setFileMetadata,
        setUploadId,
        setPushLog,
    };
};
