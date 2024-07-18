import { type Graph, type NodeFilesView } from '../types/graph.js';
import { type Metadata, type NodeFileView, type NodeRightsView, type Node } from '../types/graphObjects.js';
import { type State } from '../types/state.js';
import { mergeDeepRight, mergeGraphObjRight } from './util.js';

export const selectGraphStack = (state: State, stack: string[]): Graph[] => {
    const acc = [];
    for (let i = 0; i < stack.length; i += 1) {
        const graphName = stack[i];
        const graph = state[graphName]?.graph;
        graph && acc.push(graph);
    }
    return acc;
};
export const nodeFromStack = (graphStack: Graph[], nodeId: string): Node | boolean | undefined => {
    let acc = undefined;
    for (let i = 0; i < graphStack.length; i += 1) {
        const node = graphStack[i].nodes?.[nodeId];
        acc = mergeGraphObjRight(acc, node);
    }
    return acc;
};

export const edgeFromStack = (
    graphStack: Graph[],
    fromType: string,
    fromId: string,
    toType: string,
): Record<string, Metadata> => {
    if (graphStack.length === 0) return {};

    const acc: Record<string, unknown> = {};
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
    return acc as Record<string, Metadata>;
};

export const reverseEdgeFromStack = (
    graphStack: Graph[],
    toType: string,
    toId: string,
    fromType: string,
): Record<string, boolean> => {
    if (graphStack.length === 0) return {};

    const acc: Record<string, unknown> = {};
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
    return acc as Record<string, boolean>;
};

export const metadataFromStack = (
    graphStack: Graph[],
    fromType: string,
    fromId: string,
    toType: string,
    toId: string,
): Metadata | undefined => {
    let acc = undefined;
    for (let i = 0; i < graphStack.length; i += 1) {
        const node = graphStack[i].edges?.[fromType]?.[fromId]?.[toType]?.[toId];
        acc = mergeGraphObjRight(acc, node);
    }
    return acc;
};

export const rightFromStack = (graphStack: Graph[], nodeId: string): NodeRightsView => {
    let acc = undefined;
    for (let i = 0; i < graphStack.length; i += 1) {
        const rights = graphStack[i].rights?.[nodeId];
        acc = mergeDeepRight(acc, rights);
    }
    return (acc || {}) as NodeRightsView;
};

export const filesFromStack = (graphStack: Graph[], nodeId: string): NodeFilesView<NodeFileView> => {
    let acc = undefined;
    for (let i = 0; i < graphStack.length; i += 1) {
        const files = graphStack[i].files?.[nodeId];
        acc = mergeGraphObjRight(acc, files);
    }
    return (acc || {}) as NodeFilesView<NodeFileView>;
};
