import { loadQueue, substringToFirst, type Storage } from '@gothub/aws-util';
import type { LoaderLog } from './logs';
import type { Metadata, Node } from '@gothub/got-core';

export type EdgeWildcard = [fromType: string, toType: string, toId: string];

export class GraphService {
    taskQueue = loadQueue(200);

    numNodes = 0;
    numMetadata = 0;
    numFiles = 0;

    constructor(
        private readonly storage: Storage,
        private readonly locations: {
            NODES: string;
            EDGES: string;
            REVERSE_EDGES: string;
        },
    ) {}

    async setNode(nodeId: string, data: Node | null) {
        if (data === null) {
            return this.storage.delete(this.locations.NODES, nodeId);
        } else {
            return this.storage.put(this.locations.NODES, nodeId, JSON.stringify(data));
        }
    }

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

    async getNodesWildcard(wildcardPrefix: string): Promise<Array<string>> {
        return this.taskQueue.queueLoad(() => this.storage.list(this.locations.NODES, wildcardPrefix));
    }

    async setMetadata(fromId: string, edgeTypes: string, toId: string, data: Metadata | boolean) {
        if (!data) {
            return this.storage.delete(this.locations.EDGES, `${fromId}/${edgeTypes}/${toId}`);
        } else {
            return this.storage.put(this.locations.EDGES, `${fromId}/${edgeTypes}/${toId}`, JSON.stringify(data));
        }
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

    async setReverseEdge(toId: string, edgeTypes: string, fromId: string, data: boolean) {
        if (!data) {
            return this.storage.delete(this.locations.REVERSE_EDGES, `${toId}/${edgeTypes}/${fromId}`);
        } else {
            return this.storage.put(this.locations.REVERSE_EDGES, `${toId}/${edgeTypes}/${fromId}`, 'true');
        }
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

    getLog(): LoaderLog {
        return {
            nodes: this.numNodes,
            metadata: this.numMetadata,
            files: this.numFiles,
        };
    }
}
