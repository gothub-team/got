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

const getAnyStack =
    <TRes>(fnSelect: (state: State, graphName: string) => TRes) =>
    (state: State, stack: string[]): TRes[] => {
        let acc = [];
        for (let i = 0; i < stack.length; i += 1) {
            const graphName = stack[i];
            const val = fnSelect(state, graphName);
            val && acc.push(val);
        }
        return acc;
    };

export const getNodeStack = getAnyStack((state, graphName) => state[graphName]?.graph?.nodes);
export const getEdgeStack = getAnyStack((state, graphName) => state[graphName]?.graph?.edges);
export const getReverseEdgeStack = getAnyStack((state, graphName) => state[graphName]?.graph?.index?.reverseEdges);
export const getRightStack = getAnyStack((state, graphName) => state[graphName]?.graph?.rights);
export const getFileStack = getAnyStack((state, graphName) => state[graphName]?.graph?.files);

export const nodeFromNodeStack = (nodeStack: Array<Nodes<Node | boolean>>, nodeId: string): Node | boolean => {
    let acc: Node | boolean;
    for (let i = 0; i < nodeStack.length; i += 1) {
        const node = nodeStack[i][nodeId];
        acc = mergeGraphObjRight(acc, node);
    }
    return acc;
};

export const edgeFromEdgeStack = (
    edgeStack: Array<Edges<Metadata>>,
    fromType: string,
    fromId: string,
    toType: string,
): Metadata => {
    if (edgeStack.length === 0) return {};

    let acc = {};
    for (let i = 0; i < edgeStack.length; i += 1) {
        const edge = edgeStack[i][fromType]?.[fromId]?.[toType];
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

export const metadataFromEdgeStack = (
    edgeStack: Array<Edges<Metadata>>,
    fromType: string,
    fromId: string,
    toType: string,
    toId: string,
): Metadata => {
    let acc: Metadata;
    for (let i = 0; i < edgeStack.length; i += 1) {
        const node = edgeStack[i][fromType]?.[fromId]?.[toType]?.[toId];
        acc = mergeGraphObjRight(acc, node);
    }
    return acc;
};

export const rightFromRightStack = (rightStack: Array<Rights<boolean, string>>, nodeId: string): NodeRightsView => {
    let acc: NodeRightsView;
    for (let i = 0; i < rightStack.length; i += 1) {
        const node = rightStack[i][nodeId];
        acc = mergeDeepRight(acc, node);
    }
    return acc;
};

export const filesFromFileStack = (
    fileStack: Array<Files<NodeFileView>>,
    nodeId: string,
): NodeFilesView<NodeFileView> => {
    let acc: NodeFilesView<NodeFileView>;
    for (let i = 0; i < fileStack.length; i += 1) {
        const files = fileStack[i][nodeId];
        acc = mergeGraphObjRight(acc, files);
    }
    return acc;
};

const selectView = <TView extends View>(stack: string[], view: TView, state: State): ViewResult<TView> => {
    const nodeStack = getNodeStack(state, stack);
    const edgeStack = getEdgeStack(state, stack);
    const reverseEdgeStack = getReverseEdgeStack(state, stack);
    const fileStack = getFileStack(state, stack);
    const rightStack = getRightStack(state, stack);

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
            bag.rights = rightFromRightStack(rightStack, nodeId);
        }
        if (include?.files) {
            bag.files = filesFromFileStack(fileStack, nodeId);
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
            ? edgeFromEdgeStack(reverseEdgeStack, toType, nodeId, fromType)
            : edgeFromEdgeStack(edgeStack, fromType, nodeId, toType);

        if (!edgeIds) return;

        const edgeBag = {};
        const keys = Object.keys(edgeIds);
        for (let i = 0; i < keys.length; i += 1) {
            const toId = keys[i];
            const metadata = queryObj.reverse
                ? metadataFromEdgeStack(edgeStack, fromType, toId, toType, nodeId)
                : edgeIds[toId];
            if (!metadata) continue;

            const toNode = nodeFromNodeStack(nodeStack, toId);
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
        const node = nodeFromNodeStack(nodeStack, nodeId);
        if (!node) continue;

        result[nodeAlias] = queryNode(queryObj, nodeId, node);
    }

    return result;
};
