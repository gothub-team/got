import { assocMap3, loadQueue, substringToFirst, type Storage } from '@gothub/aws-util';
import type { EdgeWildcard, FileHead, FileMetadata, FileRef, Loader } from '../types/loader';

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

export class ConfigurableLoader implements Loader {
    taskQueue = loadQueue(200);

    numNodes = 0;
    numMetadata = 0;
    numFiles = 0;

    constructor(
        private storage: Storage,
        private locations: Locations,
    ) {}

    async getNode(nodeId: string) {
        this.numNodes += 1;
        const data = (await this.taskQueue.queueLoad(() => this.storage.get(this.locations.NODES, nodeId))) as
            | string
            | null;
        if (data == null) {
            return null; // TODO: how is this null handled when coming from cache etc.
        }
        return data.toString();
    }

    async getRight(location: string, nodeId: string, principalType: string, principal: string) {
        const head = await this.taskQueue.queueLoad(() =>
            this.storage.exist(location, `${nodeId}/${principalType}/${principal}`),
        );
        return Boolean(head);
    }

    async getRead(nodeId: string, principalType: string, principal: string) {
        return this.getRight(this.locations.RIGHTS_READ, nodeId, principalType, principal);
    }
    async getWrite(nodeId: string, principalType: string, principal: string) {
        return this.getRight(this.locations.RIGHTS_WRITE, nodeId, principalType, principal);
    }
    async getAdmin(nodeId: string, principalType: string, principal: string) {
        return this.getRight(this.locations.RIGHTS_ADMIN, nodeId, principalType, principal);
    }

    async getMetadata(fromId: string, edgeTypes: string, toId: string) {
        this.numMetadata += 1;
        const data = (await this.taskQueue.queueLoad(() =>
            this.storage.get(this.locations.EDGES, `${fromId}/${edgeTypes}/${toId}`),
        )) as string | null;
        if (data === null) {
            return 'true';
        } else if (data === undefined) {
            return '';
        }
        return data.toString();
    }

    async getEdges(nodeId: string, edgeTypes: string) {
        const edges = (await this.taskQueue.queueLoad(() =>
            this.storage.list(this.locations.EDGES, `${nodeId}/${edgeTypes}/`),
        )) as Array<string>;

        const result = new Map<string, boolean>();
        for (let i = 0; i < edges.length; i++) {
            const [, , , toId] = edges[i].split('/');
            result.set(toId, true);
        }

        return result;
    }

    async getReverseEdges(nodeId: string, edgeTypes: string) {
        const edges = (await this.taskQueue.queueLoad(() =>
            this.storage.list(this.locations.REVERSE_EDGES, `${nodeId}/${edgeTypes}/`),
        )) as Array<string>;

        const result = new Map<string, boolean>();
        for (let i = 0; i < edges.length; i++) {
            const [, , , fromId] = edges[i].split('/');
            result.set(fromId, true);
        }

        return result;
    }

    async listRights(nodeId: string) {
        const readRightsPromise = this.taskQueue.queueLoad(() =>
            this.storage.list(this.locations.RIGHTS_READ, `${nodeId}/`),
        );
        const writeRightsPromise = this.taskQueue.queueLoad(() =>
            this.storage.list(this.locations.RIGHTS_WRITE, `${nodeId}/`),
        );
        const adminRightsPromise = this.taskQueue.queueLoad(() =>
            this.storage.list(this.locations.RIGHTS_ADMIN, `${nodeId}/`),
        );

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
    }

    async ownerExists(nodeId: string) {
        const owners = await this.taskQueue.queueLoad(() => this.storage.list(this.locations.OWNERS, `${nodeId}/`));
        return owners && owners.length > 0;
    }

    async getNodesWildcard(wildcardPrefix: string): Promise<Array<string>> {
        return this.taskQueue.queueLoad(() => this.storage.list(this.locations.NODES, wildcardPrefix));
    }

    async listEdgesWildcard(nodeId: string, edgeTypes: string): Promise<string[]> {
        const edgePrefix = substringToFirst(edgeTypes, '*');
        if (edgePrefix === '/') {
            // illegal edge prefix, for all edges '*/*' should be used
            return [];
        }

        const edgeKeys = await this.storage.list(this.locations.EDGES, `${nodeId}/${edgePrefix}`);
        const pattern = new RegExp(edgeTypes.replaceAll('*', '.*').replaceAll('/', '\\/'));

        if (edgePrefix.length < edgeTypes.length - 2) {
            return edgeKeys.filter((edgeKey) => edgeKey.match(pattern));
        }

        return edgeKeys;
    }

    async getEdgesWildcard(nodeId: string, edgeType: string): Promise<Array<EdgeWildcard>> {
        const edgeKeys = (await this.taskQueue.queueLoad(() =>
            this.listEdgesWildcard(nodeId, `${edgeType}/`),
        )) as Array<string>;

        if (!edgeKeys) return [];

        const result = new Array<EdgeWildcard>(edgeKeys.length);
        for (let i = 0; i < edgeKeys.length; i++) {
            const [, fromType, toType, toId] = edgeKeys[i].split('/');
            result[i] = [fromType, toType, toId];
        }

        return result;
    }

    async getFileHead(fileKey: string): Promise<FileHead | false | undefined> {
        throw new Error('Not Implemented');
    }

    async getFileMetadata(fileKey: string): Promise<FileMetadata | null> {
        throw new Error('Not Implemented');
    }

    async getFileRef(nodeId: string, prop: string): Promise<FileRef | null> {
        throw new Error('Not Implemented');
    }

    async getFileRefs(nodeId: string): Promise<FileRef[]> {
        throw new Error('Not Implemented');
    }

    async getUpload(uploadId: string): Promise<string | null> {
        throw new Error('Not Implemented');
    }

    getLog() {
        return {
            nodes: this.numNodes,
            metadata: this.numMetadata,
            files: this.numFiles,
        };
    }
}
