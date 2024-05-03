import { Graph, NodeFilesView } from './types/graph';
import { Metadata, NodeFileView, NodeRightsView } from './graphObjects';
import { State } from './types/state';
import { mergeDeepRight, mergeGraphObjRight } from './util';

export const isEdgeTypeString = (edgeTypes: string) => {
    const [fromType, toType] = edgeTypes.split('/');
    return fromType && toType && fromType.length > 0 && toType.length > 0;
};

export const selectGraphStack = (state: State, stack: string[]): Graph[] => {
    let acc = [];
    for (let i = 0; i < stack.length; i += 1) {
        const graphName = stack[i];
        const graph = state[graphName]?.graph;
        graph && acc.push(graph);
    }
    return acc;
};
export const nodeFromStack = (graphStack: Graph[], nodeId: string): Node | boolean => {
    let acc: Node | boolean;
    for (let i = 0; i < graphStack.length; i += 1) {
        const node = graphStack[i].nodes?.[nodeId];
        acc = mergeGraphObjRight(acc, node);
    }
    return acc;
};

export const edgeFromStack = (graphStack: Graph[], fromType: string, fromId: string, toType: string): Metadata => {
    if (graphStack.length === 0) return {};

    let acc = {};
    for (let i = 0; i < graphStack.length; i += 1) {
        const edge = graphStack[i].edges?.[fromType]?.[fromId]?.[toType];
        if (edge != null) {
            const toIds = Object.keys(edge);
            for (let j = 0; j < toIds.length; j += 1) {
                const toId = toIds[j];
                const metadata = edge[toId];
                if (metadata) {
                    acc[toId] = mergeGraphObjRight(acc[toId], metadata);
                } else if (metadata === false || metadata === null) {
                    delete acc[toId];
                }
            }
        }
    }
    return acc;
};

export const reverseEdgeFromStack = (graphStack: Graph[], toType: string, toId: string, fromType: string): Metadata => {
    if (graphStack.length === 0) return {};

    let acc = {};
    for (let i = 0; i < graphStack.length; i += 1) {
        const edge = graphStack[i].index?.reverseEdges?.[toType]?.[toId]?.[fromType];
        if (edge != null) {
            const toIds = Object.keys(edge);
            for (let j = 0; j < toIds.length; j += 1) {
                const toId = toIds[j];
                const metadata = edge[toId];
                if (metadata) {
                    acc[toId] = mergeGraphObjRight(acc[toId], metadata);
                } else if (metadata === false || metadata === null) {
                    delete acc[toId];
                }
            }
        }
    }
    return acc;
};

export const metadataFromStack = (
    graphStack: Graph[],
    fromType: string,
    fromId: string,
    toType: string,
    toId: string,
): Metadata => {
    let acc: Metadata;
    for (let i = 0; i < graphStack.length; i += 1) {
        const node = graphStack[i].edges?.[fromType]?.[fromId]?.[toType]?.[toId];
        acc = mergeGraphObjRight(acc, node);
    }
    return acc;
};

export const rightFromStack = (graphStack: Graph[], nodeId: string): NodeRightsView => {
    let acc: NodeRightsView;
    for (let i = 0; i < graphStack.length; i += 1) {
        const rights = graphStack[i].rights?.[nodeId];
        acc = mergeDeepRight(acc, rights);
    }
    return acc;
};

export const filesFromStack = (graphStack: Graph[], nodeId: string): NodeFilesView<NodeFileView> => {
    let acc: NodeFilesView<NodeFileView>;
    for (let i = 0; i < graphStack.length; i += 1) {
        const files = graphStack[i].files?.[nodeId];
        acc = mergeGraphObjRight(acc, files);
    }
    return acc;
};
