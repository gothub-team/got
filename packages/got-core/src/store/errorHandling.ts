import { ViewResult } from '../types/ViewResult';
import { Graph } from '../types/graph';
import { Metadata, Node, RightTypes } from '../types/graphObjects';
import { State } from '../types/state';
import { View } from '../types/view';
import { createInputValidator } from '../utils/errors';
import { type CreateStoreOptions, createStore } from './store';

type CreateErrorHandledStoreOptions = CreateStoreOptions & {
    onError?: (error: Error) => void;
    onWarn?: (error: Error) => void;
};

export const createErrorHandledStore = (
    options: CreateErrorHandledStoreOptions,
    store: ReturnType<typeof createStore>,
): ReturnType<typeof createStore> => {
    const { api, dispatch, select, onError = console.error, onWarn = console.warn } = options || {};

    const validateError = createInputValidator(onError);
    const validateWarn = createInputValidator(onWarn);

    validateWarn('GOT_STORE_CONFIG', 'api', 'api', api);
    validateWarn('GOT_STORE_CONFIG', 'function', 'dispatch', dispatch);
    validateWarn('GOT_STORE_CONFIG', 'function', 'select', select);

    const merge = (fromGraphName: string, toGraphName: string) => {
        if (
            validateError('GOT_MERGE', 'function', 'dispatch', dispatch) &&
            validateError('GOT_MERGE', 'string', 'fromGraphName', fromGraphName) &&
            validateError('GOT_MERGE', 'string', 'toGraphName', toGraphName)
        ) {
            return store.merge(fromGraphName, toGraphName);
        }
    };
    const mergeGraph = (fromGraph: Graph = {}, toGraphName: string) => {
        if (
            validateError('GOT_MERGE_GRAPH', 'function', 'dispatch', dispatch) &&
            validateError('GOT_MERGE_GRAPH', 'graph', 'fromGraph', fromGraph) &&
            validateError('GOT_MERGE_GRAPH', 'string', 'toGraphName', toGraphName)
        ) {
            return store.mergeGraph(fromGraph, toGraphName);
        }
    };
    const mergeOverwriteGraph = (fromGraph: Graph = {}, toGraphName: string) => {
        if (
            validateError('GOT_MERGE_OVERWRITE_GRAPH', 'function', 'dispatch', dispatch) &&
            validateError('GOT_MERGE_OVERWRITE_GRAPH', 'graph', 'fromGraph', fromGraph) &&
            validateError('GOT_MERGE_OVERWRITE_GRAPH', 'string', 'toGraphName', toGraphName)
        ) {
            return store.mergeOverwriteGraph(fromGraph, toGraphName);
        }
    };
    const clear = (graphName: string) => {
        if (
            validateError('GOT_CLEAR', 'function', 'dispatch', dispatch) &&
            validateError('GOT_CLEAR', 'string', 'graphName', graphName)
        ) {
            return store.clear(graphName);
        }
    };
    const clearAll = () => {
        if (validateError('GOT_CLEAR_ALL', 'function', 'dispatch', dispatch)) {
            return store.clearAll();
        }
    };

    const selectNode = (stack: string[], nodeId: string, state: State) => {
        if (
            validateError('GOT_SELECT_NODE', 'function', 'select', select) &&
            validateError('GOT_SELECT_NODE', 'stack', 'stack', stack) &&
            validateError('GOT_SELECT_NODE', 'string', 'nodeId', nodeId)
        ) {
            return store.selectNode(stack, nodeId, state);
        }
    };
    const getNode = (stack: string[], nodeId: string) => {
        if (
            validateError('GOT_GET_NODE', 'function', 'select', select) &&
            validateError('GOT_GET_NODE', 'stack', 'stack', stack) &&
            validateError('GOT_GET_NODE', 'string', 'nodeId', nodeId)
        ) {
            return store.getNode(stack, nodeId);
        }
    };
    const setNode = (graphName: string, node: Node) => {
        if (
            validateError('GOT_SET_NODE', 'function', 'dispatch', dispatch) &&
            validateError('GOT_SET_NODE', 'string', 'graphName', graphName) &&
            validateError('GOT_SET_NODE', 'node', 'node', node)
        ) {
            return store.setNode(graphName, node);
        }
    };
    const removeNode = (graphName: string, nodeId: string) => {
        if (
            validateError('GOT_REMOVE_NODE', 'function', 'dispatch', dispatch) &&
            validateError('GOT_REMOVE_NODE', 'string', 'graphName', graphName) &&
            validateError('GOT_REMOVE_NODE', 'string', 'nodeId', nodeId)
        ) {
            return store.removeNode(graphName, nodeId);
        }
    };

    const selectMetadata = (stack: string[], edgeTypes: string, fromId: string, toId: string, state: State) => {
        if (
            validateError('GOT_SELECT_METADATA', 'function', 'select', select) &&
            validateError('GOT_SELECT_METADATA', 'stack', 'stack', stack) &&
            validateError('GOT_SELECT_METADATA', 'string', 'edgeTypes', edgeTypes) &&
            validateError('GOT_SELECT_METADATA', 'string', 'fromId', fromId) &&
            validateError('GOT_SELECT_METADATA', 'string', 'toId', toId)
        ) {
            return store.selectMetadata(stack, edgeTypes, fromId, toId, state);
        }
    };
    const getMetadata = (stack: string[], edgeTypes: string, fromId: string, toId: string) => {
        if (
            validateError('GOT_GET_METADATA', 'function', 'select', select) &&
            validateError('GOT_GET_METADATA', 'stack', 'stack', stack) &&
            validateError('GOT_GET_METADATA', 'string', 'edgeTypes', edgeTypes) &&
            validateError('GOT_GET_METADATA', 'string', 'fromId', fromId) &&
            validateError('GOT_GET_METADATA', 'string', 'toId', toId)
        ) {
            return store.getMetadata(stack, edgeTypes, fromId, toId);
        }
    };
    const selectEdge = (stack: string[], edgeTypes: string, fromId: string, state: State): Record<string, Metadata> => {
        if (
            validateError('GOT_SELECT_EDGE', 'function', 'select', select) &&
            validateError('GOT_SELECT_EDGE', 'stack', 'stack', stack) &&
            validateError('GOT_SELECT_EDGE', 'string', 'edgeTypes', edgeTypes) &&
            validateError('GOT_SELECT_EDGE', 'string', 'fromId', fromId)
        ) {
            return store.selectEdge(stack, edgeTypes, fromId, state);
        }
    };
    const getEdge = (stack: string[], edgeTypes: string, fromId: string): Record<string, Metadata> => {
        if (
            validateError('GOT_GET_EDGE', 'function', 'select', select) &&
            validateError('GOT_GET_EDGE', 'stack', 'stack', stack) &&
            validateError('GOT_GET_EDGE', 'string', 'edgeTypes', edgeTypes) &&
            validateError('GOT_GET_EDGE', 'string', 'fromId', fromId)
        ) {
            return store.getEdge(stack, edgeTypes, fromId);
        }
    };
    const selectReverseEdge = (
        stack: string[],
        edgeTypes: string,
        toId: string,
        state: State,
    ): Record<string, Metadata> => {
        if (
            validateError('GOT_SELECT_REVERSE_EDGE', 'function', 'select', select) &&
            validateError('GOT_SELECT_REVERSE_EDGE', 'stack', 'stack', stack) &&
            validateError('GOT_SELECT_REVERSE_EDGE', 'string', 'edgeTypes', edgeTypes) &&
            validateError('GOT_SELECT_REVERSE_EDGE', 'string', 'toId', toId)
        ) {
            return store.selectReverseEdge(stack, edgeTypes, toId, state);
        }
    };
    const getReverseEdge = (stack: string[], edgeTypes: string, toId: string): Record<string, Metadata> => {
        if (
            validateError('GOT_GET_REVERSE_EDGE', 'function', 'select', select) &&
            validateError('GOT_GET_REVERSE_EDGE', 'stack', 'stack', stack) &&
            validateError('GOT_GET_REVERSE_EDGE', 'string', 'edgeTypes', edgeTypes) &&
            validateError('GOT_GET_REVERSE_EDGE', 'string', 'toId', toId)
        ) {
            return store.getReverseEdge(stack, edgeTypes, toId);
        }
    };

    const add = (graphName: string, edgeTypes: string, fromId: string, toNode: Node, metadata: Metadata = true) => {
        if (
            validateError('GOT_ADD', 'function', 'dispatch', dispatch) &&
            validateError('GOT_ADD', 'string', 'graphName', graphName) &&
            validateError('GOT_ADD', 'string', 'edgeTypes', edgeTypes) &&
            validateError('GOT_ADD', 'string', 'fromId', fromId) &&
            validateError('GOT_ADD', 'node', 'toNode', toNode) &&
            validateError('GOT_ADD', 'metadata', 'metadata', metadata)
        ) {
            return store.add(graphName, edgeTypes, fromId, toNode, metadata);
        }
    };
    const remove = (graphName: string, edgeTypes: string, fromId: string, toNode: Node | string) => {
        if (
            validateError('GOT_REMOVE', 'function', 'dispatch', dispatch) &&
            validateError('GOT_REMOVE', 'string', 'graphName', graphName) &&
            validateError('GOT_REMOVE', 'string', 'edgeTypes', edgeTypes) &&
            validateError('GOT_REMOVE', 'string', 'fromId', fromId) &&
            validateError('GOT_REMOVE', 'node', 'toNode', toNode)
        ) {
            return store.remove(graphName, edgeTypes, fromId, toNode);
        }
    };
    const assoc = (
        graphName: string,
        edgeTypes: string,
        fromId: string,
        toNode: Node | string,
        metadata: Metadata = true,
    ) => {
        if (
            validateError('GOT_ASSOC', 'function', 'dispatch', dispatch) &&
            validateError('GOT_ASSOC', 'string', 'graphName', graphName) &&
            validateError('GOT_ASSOC', 'string', 'edgeTypes', edgeTypes) &&
            validateError('GOT_ASSOC', 'string', 'fromId', fromId) &&
            validateError('GOT_ASSOC', 'node', 'toNode', toNode) &&
            validateError('GOT_ASSOC', 'metadata', 'metadata', metadata)
        ) {
            return store.assoc(graphName, edgeTypes, fromId, toNode, metadata);
        }
    };
    const dissoc = (graphName: string, edgeTypes: string, fromId: string, toNode: Node | string) => {
        if (
            validateError('GOT_DISSOC', 'function', 'dispatch', dispatch) &&
            validateError('GOT_DISSOC', 'string', 'graphName', graphName) &&
            validateError('GOT_DISSOC', 'string', 'edgeTypes', edgeTypes) &&
            validateError('GOT_DISSOC', 'string', 'fromId', fromId) &&
            validateError('GOT_DISSOC', 'node', 'toNode', toNode)
        ) {
            return store.dissoc(graphName, edgeTypes, fromId, toNode);
        }
    };

    const selectRights = (stack: string[], nodeId: string, state: State) => {
        if (
            validateError('GOT_SELECT_RIGHTS', 'function', 'select', select) &&
            validateError('GOT_SELECT_RIGHTS', 'stack', 'stack', stack) &&
            validateError('GOT_SELECT_RIGHTS', 'string', 'nodeId', nodeId)
        ) {
            return store.selectRights(stack, nodeId, state);
        }
    };
    const getRights = (stack: string[], nodeId: string) => {
        if (
            validateError('GOT_GET_RIGHTS', 'function', 'select', select) &&
            validateError('GOT_GET_RIGHTS', 'stack', 'stack', stack) &&
            validateError('GOT_GET_RIGHTS', 'string', 'nodeId', nodeId)
        ) {
            return store.getRights(stack, nodeId);
        }
    };
    const setRights = (graphName: string, nodeId: string, email: string, rights: RightTypes) => {
        if (
            validateError('GOT_SET_RIGHTS', 'function', 'dispatch', dispatch) &&
            validateError('GOT_SET_RIGHTS', 'string', 'graphName', graphName) &&
            validateError('GOT_SET_RIGHTS', 'string', 'nodeId', nodeId) &&
            validateError('GOT_SET_RIGHTS', 'string', 'email', email) &&
            validateError('GOT_SET_RIGHTS', 'rights', 'rights', rights)
        ) {
            return store.setRights(graphName, nodeId, email, rights);
        }
    };
    const setRoleRights = (graphName: string, nodeId: string, role: string, rights: RightTypes) => {
        if (
            validateError('GOT_SET_ROLE_RIGHTS', 'function', 'dispatch', dispatch) &&
            validateError('GOT_SET_ROLE_RIGHTS', 'string', 'graphName', graphName) &&
            validateError('GOT_SET_ROLE_RIGHTS', 'string', 'nodeId', nodeId) &&
            validateError('GOT_SET_ROLE_RIGHTS', 'string', 'role', role) &&
            validateError('GOT_SET_ROLE_RIGHTS', 'rights', 'rights', rights)
        ) {
            return store.setRoleRights(graphName, nodeId, role, rights);
        }
    };
    const inheritRights = (graphName: string, fromId: string, nodeId: string) => {
        if (
            validateError('GOT_INHERIT_RIGHTS', 'function', 'dispatch', dispatch) &&
            validateError('GOT_INHERIT_RIGHTS', 'string', 'graphName', graphName) &&
            validateError('GOT_INHERIT_RIGHTS', 'string', 'nodeId', nodeId) &&
            validateError('GOT_INHERIT_RIGHTS', 'string', 'fromId', fromId)
        ) {
            return store.inheritRights(graphName, nodeId, fromId);
        }
    };

    const selectFiles = (stack: string[], nodeId: string, state: State) => {
        if (
            validateError('GOT_SELECT_FILES', 'function', 'select', select) &&
            validateError('GOT_SELECT_FILES', 'stack', 'stack', stack) &&
            validateError('GOT_SELECT_FILES', 'string', 'nodeId', nodeId)
        ) {
            return store.selectFiles(stack, nodeId, state);
        }
    };
    const getFiles = (stack: string[], nodeId: string) => {
        if (
            validateError('GOT_GET_FILES', 'function', 'select', select) &&
            validateError('GOT_GET_FILES', 'stack', 'stack', stack) &&
            validateError('GOT_GET_FILES', 'string', 'nodeId', nodeId)
        ) {
            return store.getFiles(stack, nodeId);
        }
    };
    const setFile = (graphName: string, nodeId: string, prop: string, filename: string, file: Blob) => {
        if (
            validateError('GOT_SET_FILE', 'function', 'dispatch', dispatch) &&
            validateError('GOT_SET_FILE', 'string', 'graphName', graphName) &&
            validateError('GOT_SET_FILE', 'string', 'nodeId', nodeId) &&
            validateError('GOT_SET_FILE', 'string', 'prop', prop) &&
            validateError('GOT_SET_FILE', 'string', 'filename', filename) &&
            validateError('GOT_SET_FILE', 'blob', 'file', file)
        ) {
            return store.setFile(graphName, nodeId, prop, filename, file);
        }
    };
    const removeFile = (graphName: string, nodeId: string, prop: string) => {
        if (
            validateError('GOT_REMOVE_FILE', 'function', 'dispatch', dispatch) &&
            validateError('GOT_REMOVE_FILE', 'string', 'graphName', graphName) &&
            validateError('GOT_REMOVE_FILE', 'string', 'nodeId', nodeId) &&
            validateError('GOT_REMOVE_FILE', 'string', 'prop', prop)
        ) {
            return store.removeFile(graphName, nodeId, prop);
        }
    };

    const selectView = <TView extends View>(stack: string[], view: TView, state: State): ViewResult<TView> => {
        if (
            validateError('GOT_SELECT_VIEW', 'function', 'select', select) &&
            validateError('GOT_SELECT_VIEW', 'stack', 'stack', stack) &&
            validateError('GOT_SELECT_VIEW', 'view', 'view', view)
        ) {
            return store.selectView(stack, view, state);
        }
    };
    const getView = <TView extends View>(stack: string[], view: TView): ViewResult<TView> => {
        if (
            validateError('GOT_GET_VIEW', 'function', 'select', select) &&
            validateError('GOT_GET_VIEW', 'stack', 'stack', stack) &&
            validateError('GOT_GET_VIEW', 'view', 'view', view)
        ) {
            return store.getView(stack, view);
        }
    };

    const selectSubgraph = (stack: string[], view: View, state: State): Graph => {
        if (
            validateError('GOT_SELECT_SUBGRAPH', 'function', 'select', select) &&
            validateError('GOT_SELECT_SUBGRAPH', 'stack', 'stack', stack) &&
            validateError('GOT_SELECT_SUBGRAPH', 'view', 'view', view)
        ) {
            return store.selectSubgraph(stack, view, state);
        }
    };
    const getSubgraph = (stack: string[], view: View): Graph => {
        if (
            validateError('GOT_GET_SUBGRAPH', 'function', 'select', select) &&
            validateError('GOT_GET_SUBGRAPH', 'stack', 'stack', stack) &&
            validateError('GOT_GET_SUBGRAPH', 'view', 'view', view)
        ) {
            return store.getSubgraph(stack, view);
        }
    };

    return {
        merge,
        mergeGraph,
        mergeOverwriteGraph,
        clear,
        clearAll,
        selectNode,
        getNode,
        setNode,
        removeNode,
        selectMetadata,
        getMetadata,
        selectEdge,
        getEdge,
        selectReverseEdge,
        getReverseEdge,
        add,
        remove,
        assoc,
        dissoc,
        selectRights,
        getRights,
        setRights,
        setRoleRights,
        inheritRights,
        selectFiles,
        getFiles,
        setFile,
        removeFile,
        selectView,
        getView,
        selectSubgraph,
        getSubgraph,
    };
};
