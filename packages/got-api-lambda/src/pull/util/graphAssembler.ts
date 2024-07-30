import { type GraphAssembler } from '../types/graphAssembler';
import { assocMap4, assocMap2, stringify } from '@gothub/aws-util';
import { GraphAssemblerLog } from '../types/logs';

export const graphAssembler = (): GraphAssembler => {
    const nodes = new Map<string, string>();
    const edges = new Map<string, unknown>();
    const edgesReverse = new Map<string, unknown>();
    const rights = new Map<string, unknown>();
    const files = new Map<string, unknown>();

    const timeNode = 0;
    const timeMetadata = 0;
    let timeJson = 0;

    const writeNode = (id: string, data: string) => {
        // const start = performance.now();
        nodes.set(id, data);
        // timeNode += performance.now() - start;
    };

    const writeMetadata = (fromId: string, fromType: string, toType: string, toId: string, data: string) => {
        // const start = performance.now();
        assocMap4(fromType, fromId, toType, toId, data, edges); // TODO: this order is old API
        // timeMetadata += performance.now() - start;
    };

    const writeEdgeReverse = (fromId: string, fromType: string, toType: string, toId: string) => {
        // const start = performance.now();
        assocMap4(toType, toId, fromType, fromId, 'true', edgesReverse); // TODO: this order is old API
        // timeMetadata += performance.now() - start;
    };

    const writeRights = (id: string, data: object | string) => {
        rights.set(id, data);
    };

    const writeFiles = (id: string, prop: string, data: string) => {
        assocMap2(id, prop, data, files);
    };

    const getGraphJson = () => {
        const jsonMap = new Map<string, unknown>();

        if (nodes.size > 0) {
            jsonMap.set('nodes', nodes);
        }
        if (edges.size > 0) {
            jsonMap.set('edges', edges);
        }
        if (rights.size > 0) {
            const rightsJson = stringify(rights);
            jsonMap.set('rights', rightsJson);
        }
        if (files.size > 0) {
            jsonMap.set('files', files);
        }
        if (edgesReverse.size > 0) {
            const edgesReverseJson = `{"reverseEdges":${stringify(edgesReverse)}}`;
            jsonMap.set('index', edgesReverseJson);
        }

        const start = performance.now();
        const jsonGraph = stringify(jsonMap);
        timeJson += performance.now() - start;

        return jsonGraph;
    };

    const getLog: () => GraphAssemblerLog = () => {
        return {
            timeNode,
            timeMetadata,
            timeJson,
        };
    };

    return {
        writeNode,
        writeMetadata,
        writeEdgeReverse,
        writeRights,
        writeFiles,
        getGraphJson,
        getLog,
    };
};
