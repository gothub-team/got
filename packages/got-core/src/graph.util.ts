import { Edges, Files, Graph, NodeFilesView, Nodes, Rights } from './types/graph';
import { Metadata, NodeFileView, NodeRightsView } from './graphObjects';
import { State } from './types/state';
import {
    assocPathMutate,
    dissocPathMutate,
    forEachObjDepth,
    getPathOr,
    mergeDeepRight,
    mergeGraphObjRight,
} from './util';
import { EdgeView, NodeView, View } from './types/view';
import { NodeBag, NodeBagInternal, ViewResult } from './types/ViewResult';

export const isEdgeTypeString = (edgeTypes: string) => {
    const [fromType, toType] = edgeTypes.split('/');
    return fromType && toType && fromType.length > 0 && toType.length > 0;
};

const mergeObjRight =
    <TMerge>(depth: number, fnMergeRight: (l: TMerge, r: TMerge) => TMerge) =>
    <TInput extends object>(left?: TInput, right?: TInput): TInput | undefined => {
        if (!right) return left;

        let result: TInput = left ?? ({} as TInput);
        forEachObjDepth(
            right,
            (valRight: TMerge, path: string[]) => {
                // console.log(valRight, path);
                if (typeof valRight === 'undefined') {
                    assocPathMutate(path, undefined, result);
                } else {
                    const valLeft = getPathOr(undefined, path, left);
                    const merged = fnMergeRight(valLeft, valRight);

                    assocPathMutate(path, merged, result);
                }
            },
            depth,
        );

        return result;
    };

const mergeNodesRight = mergeObjRight(1, mergeGraphObjRight);
const mergeEdgesRight = mergeObjRight(4, mergeGraphObjRight);
const mergeRightsRight = mergeObjRight(1, mergeDeepRight);
const mergeFilesRight = mergeObjRight(1, mergeGraphObjRight);
const mergeIndexRight = mergeObjRight(1, mergeDeepRight);

export const mergeGraphsRight = (left: Graph, right: Graph): Graph => {
    if (!right) return left;
    if (!left) return right;

    let result = left;

    const nodes = mergeNodesRight(left?.nodes, right?.nodes);
    if (nodes) {
        result.nodes = nodes;
    }

    const edges = mergeEdgesRight(left?.edges, right?.edges);
    if (edges) {
        result.edges = edges;
    }

    const rights = mergeRightsRight(left?.rights, right?.rights);
    if (rights) {
        result.rights = rights;
    }

    const files = mergeFilesRight(left?.files, right?.files);
    if (files) {
        result.files = files;
    }

    const index = mergeIndexRight(left?.index, right?.index);
    if (index) {
        result.index = index;
    }

    return result;
};

const overwriteObjRight =
    (depth: number) =>
    <TInput extends object>(left?: TInput, right?: TInput): TInput | undefined => {
        if (!right) return left;

        let result: TInput = left ?? ({} as TInput);
        forEachObjDepth(
            right,
            (valRight, path) => {
                if (typeof valRight === 'undefined') {
                    dissocPathMutate(path, result);
                    return;
                }

                if (valRight === false || typeof valRight === 'object') {
                    assocPathMutate(path, valRight, result);
                    return;
                }

                const valLeft = getPathOr(undefined, path, left);
                if (!(valRight === true && typeof valLeft === 'object')) {
                    assocPathMutate(path, valRight, result);
                    return;
                }

                assocPathMutate(path, valLeft, result);
            },
            depth,
        );

        return result;
    };

const overwriteNodesRight = overwriteObjRight(1);
const overwriteEdgesRight = overwriteObjRight(4);
const overwriteRightsRight = overwriteObjRight(1);
const overwriteFilesRight = overwriteObjRight(1);
const overwriteIndexRight = overwriteObjRight(5);

export const mergeOverwriteGraphsRight = (left: Graph, right: Graph) => {
    if (!right) return left;
    if (!left) return right;

    let result = left;

    const nodes = overwriteNodesRight(left?.nodes, right?.nodes);
    if (nodes) {
        result.nodes = nodes;
    }

    const edges = overwriteEdgesRight(left?.edges, right?.edges);
    if (edges) {
        result.edges = edges;
    }

    const rights = overwriteRightsRight(left?.rights, right?.rights);
    if (rights) {
        result.rights = rights;
    }

    const files = overwriteFilesRight(left?.files, right?.files);
    if (files) {
        result.files = files;
    }

    const index = overwriteIndexRight(left?.index, right?.index);
    if (index) {
        result.index = index;
    }
    return result;
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

export const selectView = <TView extends View>(graphStack: Graph[], view: TView, state: State): ViewResult<TView> => {
    const queryNode = <TSubView extends NodeView | EdgeView>(
        queryObj: TSubView,
        nodeId: string,
        node: Node | boolean,
        metadata?: Metadata,
    ): NodeBagInternal => {
        const bag = { nodeId } as NodeBagInternal;
        const { include } = queryObj;

        // include node bag info
        if (include?.metadata && metadata) {
            bag.metadata = metadata;
        }
        if (include?.node && typeof node === 'object') {
            bag.node = node;
        }
        if (include?.rights) {
            bag.rights = rightFromStack(graphStack, nodeId);
        }
        if (include?.files) {
            bag.files = filesFromStack(graphStack, nodeId);
        }

        // include edges
        const { edges } = queryObj;
        if (edges) {
            const keys = Object.keys(edges);
            for (let i = 0; i < keys.length; i += 1) {
                const edgeTypes = keys[i];
                const subQueryObj = edges[edgeTypes];
                if (!subQueryObj) continue;
                const edgeAlias = subQueryObj.as ?? edgeTypes;

                bag[edgeAlias] = queryEdge(subQueryObj, edgeTypes, nodeId);
            }
        }

        return bag;
    };

    const queryEdge = (queryObj: EdgeView, edgeTypes: string, nodeId: string) => {
        const [fromType, toType] = edgeTypes.split('/');
        const edgeIds = queryObj.reverse
            ? reverseEdgeFromStack(graphStack, toType, nodeId, fromType)
            : edgeFromStack(graphStack, fromType, nodeId, toType);

        if (!edgeIds) return;

        const edgeBag = {};
        const keys = Object.keys(edgeIds);
        for (let i = 0; i < keys.length; i += 1) {
            const toId = keys[i];
            const metadata = queryObj.reverse
                ? metadataFromStack(graphStack, fromType, toId, toType, nodeId)
                : edgeIds[toId];
            if (!metadata) continue;

            const toNode = nodeFromStack(graphStack, toId);
            if (!toNode) continue;

            edgeBag[toId] = queryNode(queryObj, toId, toNode, metadata);
        }

        return edgeBag;
    };

    const result = {} as ViewResult<TView>;
    const rootIds = Object.keys(view);
    for (let i = 0; i < rootIds.length; i += 1) {
        const nodeId = rootIds[i];
        const queryObj = view[nodeId];
        if (!queryObj) continue;

        const nodeAlias = queryObj?.as ?? nodeId;
        const node = nodeFromStack(graphStack, nodeId);
        if (!node) continue;

        result[nodeAlias] = queryNode(queryObj, nodeId, node);
    }

    return result;
};

export const selectSubGraph = (graphStack: Graph[], view: View, state: State): Graph => {
    const nodes = {};
    const edges = {};
    const reverseEdges = {};
    const rights = {};
    const files = {};

    const queryNode = <TSubView extends NodeView | EdgeView>(
        queryObj: TSubView,
        nodeId: string,
        node: Node | boolean,
        metadata?: Metadata,
    ) => {
        const { include } = queryObj;

        if (include?.node) {
            nodes[nodeId] = node;
        }
        if (include?.rights) {
            rights[nodeId] = rightFromStack(graphStack, nodeId);
        }
        if (include?.files) {
            files[nodeId] = filesFromStack(graphStack, nodeId);
        }

        // include edges
        const { edges } = queryObj;
        if (edges) {
            const keys = Object.keys(edges);
            for (let i = 0; i < keys.length; i += 1) {
                const edgeTypes = keys[i];
                const subQueryObj = edges[edgeTypes];
                if (!subQueryObj) continue;

                queryEdge(subQueryObj, edgeTypes, nodeId);
            }
        }
    };

    const queryEdge = (queryObj: EdgeView, edgeTypes: string, nodeId: string) => {
        const [fromType, toType] = edgeTypes.split('/');
        const edgeIds = queryObj.reverse
            ? reverseEdgeFromStack(graphStack, toType, nodeId, fromType)
            : edgeFromStack(graphStack, fromType, nodeId, toType);

        if (!edgeIds) return;

        const keys = Object.keys(edgeIds);
        for (let i = 0; i < keys.length; i += 1) {
            const edgeId = keys[i];
            const metadata = queryObj.reverse
                ? metadataFromStack(graphStack, fromType, edgeId, toType, nodeId)
                : edgeIds[edgeId];
            if (!metadata) continue;

            const toNode = nodeFromStack(graphStack, edgeId);
            if (!toNode) continue;

            // include node bag info
            if (metadata && (queryObj?.include?.metadata || queryObj?.include?.edges)) {
                const _metadata = queryObj.include?.metadata ? metadata : true;
                if (queryObj.reverse) {
                    assocPathMutate([fromType, edgeId, toType, nodeId], _metadata, edges);
                    assocPathMutate([toType, nodeId, fromType, edgeId], true, reverseEdges);
                } else {
                    assocPathMutate([fromType, nodeId, toType, edgeId], _metadata, edges);
                    assocPathMutate([toType, edgeId, fromType, nodeId], true, reverseEdges);
                }
            }

            queryNode(queryObj, edgeId, toNode, metadata);
        }
    };

    const rootIds = Object.keys(view);
    for (let i = 0; i < rootIds.length; i += 1) {
        const nodeId = rootIds[i];
        const queryObj = view[nodeId];
        if (!queryObj) continue;

        const node = nodeFromStack(graphStack, nodeId);
        if (!node) continue;

        queryNode(queryObj, nodeId, node);
    }

    return {
        nodes,
        edges,
        index: { reverseEdges },
        rights,
        files,
    };
};
