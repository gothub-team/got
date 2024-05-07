import { GOT_ACTION } from '../types/actions';
import { ErrorGraph, Graph } from '../types/graph';
import { State } from '../types/state';
import { mergeGraphsRight, mergeOverwriteGraphsRight } from '../utils/mergeGraph';
import { assocPathMutate, dissocPathMutate, getPathOr, mergeGraphObjRight } from '../utils/util';

const getEmptyStack = () => ({
    graph: {},
    errors: {},
    files: {},
});

export const getEmptyStore = (): State => ({
    main: getEmptyStack(),
});

export const gotReducer = (state: State, action: GOT_ACTION): State => {
    if (!state) {
        return getEmptyStore();
    }

    if (action.type === 'GOT/MERGE') {
        const { toGraphName, fromGraph } = action.payload;

        const path = [toGraphName, 'graph'];
        const oldGraph = getPathOr(undefined, path, state) as Graph;
        const newGraph = mergeGraphsRight(oldGraph, fromGraph);
        assocPathMutate(path, newGraph, state);

        return state;
    } else if (action.type === 'GOT/MERGE_ERROR') {
        const { toGraphName, fromGraph } = action.payload;

        const path = [toGraphName, 'errors'];
        const oldGraph = getPathOr(undefined, path, state) as ErrorGraph;
        const newGraph = mergeGraphsRight(oldGraph, fromGraph);
        assocPathMutate(path, newGraph, state);

        return state;
    } else if (action.type === 'GOT/MERGE_OVERWRITE') {
        const { toGraphName, fromGraph } = action.payload;

        const path = [toGraphName, 'graph'];
        const oldGraph = getPathOr(undefined, path, state);
        const newGraph = mergeOverwriteGraphsRight(oldGraph, fromGraph);
        assocPathMutate(path, newGraph, state);

        return state;
    } else if (action.type === 'GOT/CLEAR') {
        const { graphName } = action.payload;

        if (graphName in state) {
            delete state[graphName];
        }

        return state;
    } else if (action.type === 'GOT/CLEAR_ALL') {
        return getEmptyStore();
    } else if (action.type === 'GOT/SET_NODE') {
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
    } else if (action.type === 'GOT/SET_RIGHTS') {
        const { email, graphName, nodeId, rights } = action.payload;

        const path = [graphName, 'graph', 'rights', nodeId, 'user', email];
        const oldRights = getPathOr(undefined, path, state);
        const newRights = mergeGraphObjRight(oldRights, rights);
        assocPathMutate(path, newRights, state);

        return state;
    } else if (action.type === 'GOT/SET_ROLE_RIGHTS') {
        const { graphName, nodeId, role, rights } = action.payload;

        const path = [graphName, 'graph', 'rights', nodeId, 'role', role];
        const oldRights = getPathOr(undefined, path, state);
        const newRights = mergeGraphObjRight(oldRights, rights);
        assocPathMutate(path, newRights, state);

        return state;
    } else if (action.type === 'GOT/INHERIT_RIGHTS') {
        const { graphName, fromId, nodeId } = action.payload;

        const path = [graphName, 'graph', 'rights', nodeId, 'inherit', 'from'];
        assocPathMutate(path, fromId, state);

        return state;
    } else if (action.type === 'GOT/SET_FILE') {
        const { graphName, nodeId, prop, filename, file } = action.payload;

        // set file in graph
        const graphPath = [graphName, 'graph', 'files', nodeId, prop];
        const fileObj = {
            filename,
            contentType: file.type,
            fileSize: file.size,
        };
        assocPathMutate(graphPath, fileObj, state);

        // set file in files
        const filesPath = [graphName, 'files', nodeId, prop];
        assocPathMutate(filesPath, { file }, state);

        return state;
    } else if (action.type === 'GOT/REMOVE_FILE') {
        const { graphName, nodeId, prop } = action.payload;

        // remove file in graph
        const graphPath = [graphName, 'graph', 'files', nodeId, prop];
        assocPathMutate(graphPath, false, state);

        // remove file in files
        const filesPath = [graphName, 'files', nodeId, prop];
        dissocPathMutate(filesPath, state);

        return state;
    }

    return state;
};
