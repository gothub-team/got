import { type Edges, type Files, type Graph, type Nodes, type Rights } from '../types/graph.js';
import { type Metadata, type NodeFileView, type Node } from '../types/graphObjects.js';
import { assocPathMutate, isEmptyObject } from './util.js';
import { type EdgeView, type NodeView, type View } from '../types/view.js';
import { type NodeBagInternal, type ViewResult } from '../types/ViewResult.js';
import {
    edgeFromStack,
    filesFromStack,
    metadataFromStack,
    nodeFromStack,
    reverseEdgeFromStack,
    rightFromStack,
} from './stack.js';

export const viewResFromStack = <TView extends View>(graphStack: Graph[], view: TView): ViewResult<TView> => {
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

                const edgeBag = queryEdge(subQueryObj, edgeTypes, nodeId);
                if (edgeBag) {
                    bag[edgeAlias] = edgeBag;
                }
            }
        }

        return bag;
    };

    const queryEdge = (
        queryObj: EdgeView,
        edgeTypes: string,
        nodeId: string,
    ): Record<string, NodeBagInternal> | undefined => {
        const [fromType, toType] = edgeTypes.split('/');
        const edgeIds = queryObj.reverse
            ? reverseEdgeFromStack(graphStack, toType, nodeId, fromType)
            : edgeFromStack(graphStack, fromType, nodeId, toType);

        if (!edgeIds) return;

        const edgeBag: Record<string, NodeBagInternal> = {};
        const keys = Object.keys(edgeIds);
        for (let i = 0; i < keys.length; i += 1) {
            const toId = keys[i];
            const metadata = queryObj.reverse
                ? metadataFromStack(graphStack, fromType, toId, toType, nodeId)
                : edgeIds[toId];
            if (!metadata) continue;

            const toNode = nodeFromStack(graphStack, toId);
            if (!toNode) continue;

            const nodeBag = queryNode(queryObj, toId, toNode, metadata);
            if (nodeBag) {
                edgeBag[toId] = nodeBag;
            }
        }

        return edgeBag;
    };

    const result: Record<string, NodeBagInternal> = {};
    const rootIds = Object.keys(view);
    for (let i = 0; i < rootIds.length; i += 1) {
        const nodeId = rootIds[i];
        const queryObj = view[nodeId];
        if (!queryObj) continue;

        const nodeAlias = queryObj?.as ?? nodeId;
        const node = nodeFromStack(graphStack, nodeId);
        if (!node) continue;

        const nodeBag = queryNode(queryObj, nodeId, node);
        if (nodeBag) {
            result[nodeAlias] = nodeBag;
        }
    }

    return result as ViewResult<TView>;
};

export const subgraphFromStack = (graphStack: Graph[], view: View): Graph => {
    const nodes: Nodes<Node | boolean> = {};
    const edges: Edges<Metadata> = {};
    const reverseEdges: Edges<boolean> = {};
    const rights: Rights<boolean, string> = {};
    const files: Files<NodeFileView> = {};

    const queryNode = <TSubView extends NodeView | EdgeView>(
        queryObj: TSubView,
        nodeId: string,
        node: Node | boolean,
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

            queryNode(queryObj, edgeId, toNode);
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

    const res = {} as Graph;
    if (!isEmptyObject(nodes)) {
        res.nodes = nodes;
    }

    if (!isEmptyObject(edges)) {
        res.edges = edges;
    }

    if (!isEmptyObject(rights)) {
        res.rights = rights;
    }

    if (!isEmptyObject(files)) {
        res.files = files;
    }

    if (!isEmptyObject(reverseEdges)) {
        res.index = { reverseEdges };
    }

    return res;
};
