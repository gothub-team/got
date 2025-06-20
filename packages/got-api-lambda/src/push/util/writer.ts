import { loadQueue, type Storage } from '@gothub/aws-util';
import type { Writer } from '../types/writer';
import type { Metadata, Node } from '@gothub/got-core';
import type { FileMetadata } from '../types/loader';

// TODO: duplicate
type Locations = {
    NODES: string;
    EDGES: string;
    REVERSE_EDGES: string;
    RIGHTS_READ: string;
    RIGHTS_WRITE: string;
    RIGHTS_ADMIN: string;
    OWNERS: string;
    MEDIA: string;
};

export class ConfigurableWriter implements Writer {
    taskQueue = loadQueue(200);

    constructor(
        private storage: Storage,
        private locations: Locations,
    ) {}

    async setNode(nodeId: string, data: Node | null) {
        if (data === null) {
            return this.storage.delete(this.locations.NODES, nodeId);
        } else {
            return this.storage.put(this.locations.NODES, nodeId, JSON.stringify(data));
        }
    }

    async setMetadata(fromId: string, edgeTypes: string, toId: string, data: Metadata | boolean) {
        if (!data) {
            return this.storage.delete(this.locations.EDGES, `${fromId}/${edgeTypes}/${toId}`);
        } else {
            return this.storage.put(this.locations.EDGES, `${fromId}/${edgeTypes}/${toId}`, JSON.stringify(data));
        }
    }

    async setReverseEdge(toId: string, edgeTypes: string, fromId: string, data: boolean) {
        if (data) {
            return this.storage.put(this.locations.REVERSE_EDGES, `${toId}/${edgeTypes}/${fromId}`, true);
        } else {
            return this.storage.delete(this.locations.REVERSE_EDGES, `${toId}/${edgeTypes}/${fromId}`);
        }
    }

    private async setRight(location: string, nodeId: string, principalType: string, principal: string, right: boolean) {
        const rightKey = `${nodeId}/${principalType}/${principal}`;
        if (right) {
            return this.storage.put(location, rightKey, 'true');
        } else {
            return this.storage.delete(location, rightKey);
        }
    }

    async setRead(nodeId: string, principalType: string, principal: string, right: boolean) {
        return this.setRight(this.locations.RIGHTS_READ, nodeId, principalType, principal, right);
    }
    async setWrite(nodeId: string, principalType: string, principal: string, right: boolean) {
        return this.setRight(this.locations.RIGHTS_WRITE, nodeId, principalType, principal, right);
    }
    async setAdmin(nodeId: string, principalType: string, principal: string, right: boolean) {
        return this.setRight(this.locations.RIGHTS_ADMIN, nodeId, principalType, principal, right);
    }

    async setOwner(nodeId: string, principal: string | null) {
        if (principal === null) {
            throw new Error('Cannot set owner to null');
        }
        return this.storage.put(this.locations.OWNERS, `${nodeId}/owner/${principal}`, 'true');
    }

    async setFileMetadata(fileKey: string, metadata: FileMetadata | null): Promise<void> {
        throw new Error('Not Implemented');
    }

    async setFileRef(nodeId: string, prop: string, fileRef: { fileKey: string } | null): Promise<void> {
        throw new Error('Not Implemented');
    }

    async setUploadId(uploadId: string, fileKey: string | null): Promise<void> {
        throw new Error('Not Implemented');
    }

    async setPushLog(userEmail: string, requestId: string, changeset: string): Promise<void> {
        throw new Error('Not Implemented');
    }
}
