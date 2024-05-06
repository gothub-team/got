import { GOT_ACTION } from '../types/actions';
import { State } from '../types/state';
import { assocPathMutate, getPathOr, mergeGraphObjRight } from '../utils/util';

export const gotReducer = (state: State, action: GOT_ACTION): State => {
    if (!state) {
        return {
            main: {
                graph: {},
                errors: {},
                files: {},
            },
        };
    }

    if (action.type === 'GOT/SET_NODE') {
        const { graphName, nodeId, node } = action.payload;
        const path = [graphName, 'graph', 'nodes', nodeId];

        const oldNode = getPathOr(undefined, path, state);
        const newNode = mergeGraphObjRight(oldNode, node);
        assocPathMutate(path, newNode, state);

        return state;
    } else if (action.type === 'GOT/ADD') {
        const { graphName, fromId, fromType, toType, toNode, metadata } = action.payload;

        // set node
        const nodePath = [graphName, 'graph', 'nodes', toNode.id];
        const oldNode = getPathOr(undefined, nodePath, state);
        const newNode = mergeGraphObjRight(oldNode, toNode);
        assocPathMutate(nodePath, newNode, state);

        // set edge
        const edgePath = [graphName, 'graph', 'edges', fromType, fromId, toType, toNode.id];
        const oldMetadata = getPathOr(undefined, edgePath, state);
        const newMetadata = mergeGraphObjRight(oldMetadata, metadata || true);
        assocPathMutate(edgePath, newMetadata, state);

        // set reverse edge
        const reverseEdgePath = [graphName, 'graph', 'index', 'reverseEdges', toType, toNode.id, fromType, fromId];
        assocPathMutate(reverseEdgePath, true, state);

        return state;
    } else if (action.type === 'GOT/REMOVE') {
        const { graphName, fromId, fromType, toType, toId } = action.payload;

        // set node
        const nodePath = [graphName, 'graph', 'nodes', toId];
        assocPathMutate(nodePath, false, state);

        // set edge
        const edgePath = [graphName, 'graph', 'edges', fromType, fromId, toType, toId];
        assocPathMutate(edgePath, false, state);

        // set reverse edge
        const reverseEdgePath = [graphName, 'graph', 'index', 'reverseEdges', toType, toId, fromType, fromId];
        assocPathMutate(reverseEdgePath, false, state);

        return state;
    } else if (action.type === 'GOT/ASSOC') {
        const { graphName, fromId, fromType, toType, toId, metadata } = action.payload;

        // set edge
        const edgePath = [graphName, 'graph', 'edges', fromType, fromId, toType, toId];
        const oldMetadata = getPathOr(undefined, edgePath, state);
        const newMetadata = mergeGraphObjRight(oldMetadata, metadata || true);
        assocPathMutate(edgePath, newMetadata, state);

        // set reverse edge
        const reverseEdgePath = [graphName, 'graph', 'index', 'reverseEdges', toType, toId, fromType, fromId];
        assocPathMutate(reverseEdgePath, true, state);

        return state;
    } else if (action.type === 'GOT/DISSOC') {
        const { graphName, fromId, fromType, toType, toId } = action.payload;

        // set edge
        const edgePath = [graphName, 'graph', 'edges', fromType, fromId, toType, toId];
        assocPathMutate(edgePath, false, state);

        // set reverse edge
        const reverseEdgePath = [graphName, 'graph', 'index', 'reverseEdges', toType, toId, fromType, fromId];
        assocPathMutate(reverseEdgePath, false, state);

        return state;
    }

    return state;
};
