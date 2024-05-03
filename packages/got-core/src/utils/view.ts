import { Graph } from '../types/graph';
import { Metadata } from '../types/graphObjects';
import { State } from '../types/state';
import { assocPathMutate } from './util';
import { EdgeView, NodeView, View } from '../types/view';
import { NodeBagInternal, ViewResult } from '../types/ViewResult';
import {
    edgeFromStack,
    filesFromStack,
    metadataFromStack,
    nodeFromStack,
    reverseEdgeFromStack,
    rightFromStack,
} from './stack';

export const viewResFromStack = <TView extends View>(
    graphStack: Graph[],
    view: TView,
    state: State,
): ViewResult<TView> => {
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

export const subgraphFromStack = (graphStack: Graph[], view: View, state: State): Graph => {
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
