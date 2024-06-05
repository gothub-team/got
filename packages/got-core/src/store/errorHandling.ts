import { type ViewResult } from '../types/ViewResult';
import { type Graph } from '../types/graph';
import { type Metadata, type Node, type RightTypes } from '../types/graphObjects';
import { type State } from '../types/state';
import { type View } from '../types/view';
import { createInputValidator } from '../utils/errors';
import { isEmptyObject } from '../utils/util';
import { createStore, type CreateStoreOptions, type PushObservables, type Store } from './store';

const GOT_STORE_CONFIG = 'GOT_STORE_CONFIG';
const GOT_MERGE = 'GOT_MERGE';
const GOT_MERGE_GRAPH = 'GOT_MERGE_GRAPH';
const GOT_MERGE_OVERWRITE_GRAPH = 'GOT_MERGE_OVERWRITE_GRAPH';
const GOT_CLEAR = 'GOT_CLEAR';
const GOT_CLEAR_ALL = 'GOT_CLEAR_ALL';
const GOT_SELECT_NODE = 'GOT_SELECT_NODE';
const GOT_GET_NODE = 'GOT_GET_NODE';
const GOT_SET_NODE = 'GOT_SET_NODE';
const GOT_REMOVE_NODE = 'GOT_REMOVE_NODE';
const GOT_SELECT_METADATA = 'GOT_SELECT_METADATA';
const GOT_GET_METADATA = 'GOT_GET_METADATA';
const GOT_SELECT_EDGE = 'GOT_SELECT_EDGE';
const GOT_GET_EDGE = 'GOT_GET_EDGE';
const GOT_SELECT_REVERSE_EDGE = 'GOT_SELECT_REVERSE_EDGE';
const GOT_GET_REVERSE_EDGE = 'GOT_GET_REVERSE_EDGE';
const GOT_ADD = 'GOT_ADD';
const GOT_REMOVE = 'GOT_REMOVE';
const GOT_ASSOC = 'GOT_ASSOC';
const GOT_DISSOC = 'GOT_DISSOC';
const GOT_SELECT_RIGHTS = 'GOT_SELECT_RIGHTS';
const GOT_GET_RIGHTS = 'GOT_GET_RIGHTS';
const GOT_SET_RIGHTS = 'GOT_SET_RIGHTS';
const GOT_SET_ROLE_RIGHTS = 'GOT_SET_ROLE_RIGHTS';
const GOT_INHERIT_RIGHTS = 'GOT_INHERIT_RIGHTS';
const GOT_SELECT_FILES = 'GOT_SELECT_FILES';
const GOT_GET_FILES = 'GOT_GET_FILES';
const GOT_SET_FILE = 'GOT_SET_FILE';
const GOT_REMOVE_FILE = 'GOT_REMOVE_FILE';
const GOT_SELECT_VIEW = 'GOT_SELECT_VIEW';
const GOT_GET_VIEW = 'GOT_GET_VIEW';
const GOT_SELECT_SUBGRAPH = 'GOT_SELECT_SUBGRAPH';
const GOT_GET_SUBGRAPH = 'GOT_GET_SUBGRAPH';
const GOT_PUSH = 'GOT_PUSH';
const GOT_PULL = 'GOT_PULL';

const STRING = 'string';
const API = 'api';
const FUNCTION = 'function';
const STACK = 'stack';
const NODE = 'node';
const EDGE_TYPES = 'edgetypes';
const METADATA = 'metadata';
const BLOB = 'blob';
const VIEW = 'view';
const GRAPH = 'graph';
const RIGHTS = 'rights';

const DISPATCH = 'dispatch';
const SELECT = 'select';
const GRAPH_NAME = 'graphName';
const NODE_ID = 'nodeId';
const FROM_ID = 'fromId';
const TO_ID = 'toId';

export type ErrorHandlers = {
    onError?: (error: Error) => void;
    onWarn?: (error: Error) => void;
};

export type CreateErrorHandledStoreOptions = CreateStoreOptions & ErrorHandlers;

export const createErrorHandledStore = (options: CreateErrorHandledStoreOptions): Store => {
    const { api, dispatch, select, onError = console.error, onWarn = console.warn } = options || {};

    const validateError = createInputValidator(onError);
    const validateWarn = createInputValidator(onWarn);

    validateWarn(GOT_STORE_CONFIG, API, API, api);
    validateWarn(GOT_STORE_CONFIG, FUNCTION, 'dispatch', dispatch);
    validateWarn(GOT_STORE_CONFIG, FUNCTION, 'select', select);

    const store = createStore({
        api,
        dispatch,
        select,
    });

    const merge = (fromGraphName: string, toGraphName: string) => {
        if (
            validateError(GOT_MERGE, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_MERGE, STRING, 'fromGraphName', fromGraphName) &&
            validateError(GOT_MERGE, STRING, 'toGraphName', toGraphName)
        ) {
            store.merge(fromGraphName, toGraphName);
        }
    };
    const mergeGraph = (fromGraph: Graph, toGraphName: string) => {
        if (
            validateError(GOT_MERGE_GRAPH, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_MERGE_GRAPH, GRAPH, 'fromGraph', fromGraph) &&
            validateError(GOT_MERGE_GRAPH, STRING, 'toGraphName', toGraphName)
        ) {
            store.mergeGraph(fromGraph, toGraphName);
        }
    };
    const mergeOverwriteGraph = (fromGraph: Graph, toGraphName: string) => {
        if (
            validateError(GOT_MERGE_OVERWRITE_GRAPH, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_MERGE_OVERWRITE_GRAPH, GRAPH, 'fromGraph', fromGraph) &&
            validateError(GOT_MERGE_OVERWRITE_GRAPH, STRING, 'toGraphName', toGraphName)
        ) {
            store.mergeOverwriteGraph(fromGraph, toGraphName);
        }
    };
    const clear = (graphName: string) => {
        if (
            validateError(GOT_CLEAR, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_CLEAR, STRING, 'graphName', graphName)
        ) {
            return store.clear(graphName);
        }
    };
    const clearAll = () => {
        if (validateError(GOT_CLEAR_ALL, FUNCTION, 'dispatch', dispatch)) {
            return store.clearAll();
        }
    };

    const selectNode = (stack: string[], nodeId: string, state: State) => {
        if (
            validateError(GOT_SELECT_NODE, FUNCTION, 'select', select) &&
            validateError(GOT_SELECT_NODE, STACK, STACK, stack) &&
            validateError(GOT_SELECT_NODE, STRING, 'nodeId', nodeId)
        ) {
            return store.selectNode(stack, nodeId, state);
        }
    };
    const getNode = (stack: string[], nodeId: string) => {
        if (
            validateError(GOT_GET_NODE, FUNCTION, 'select', select) &&
            validateError(GOT_GET_NODE, STACK, STACK, stack) &&
            validateError(GOT_GET_NODE, STRING, 'nodeId', nodeId)
        ) {
            return store.getNode(stack, nodeId);
        }
    };
    const setNode = (graphName: string, node: Node) => {
        if (
            validateError(GOT_SET_NODE, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_SET_NODE, STRING, 'graphName', graphName) &&
            validateError(GOT_SET_NODE, NODE, NODE, node)
        ) {
            return store.setNode(graphName, node);
        }
    };
    const removeNode = (graphName: string, nodeId: string) => {
        if (
            validateError(GOT_REMOVE_NODE, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_REMOVE_NODE, STRING, 'graphName', graphName) &&
            validateError(GOT_REMOVE_NODE, STRING, 'nodeId', nodeId)
        ) {
            return store.removeNode(graphName, nodeId);
        }
    };

    const selectMetadata = (stack: string[], edgeTypes: string, fromId: string, toId: string, state: State) => {
        if (
            validateError(GOT_SELECT_METADATA, FUNCTION, 'select', select) &&
            validateError(GOT_SELECT_METADATA, STACK, STACK, stack) &&
            validateError(GOT_SELECT_METADATA, EDGE_TYPES, EDGE_TYPES, edgeTypes) &&
            validateError(GOT_SELECT_METADATA, STRING, 'fromId', fromId) &&
            validateError(GOT_SELECT_METADATA, STRING, 'toId', toId)
        ) {
            return store.selectMetadata(stack, edgeTypes, fromId, toId, state);
        }
    };
    const getMetadata = (stack: string[], edgeTypes: string, fromId: string, toId: string) => {
        if (
            validateError(GOT_GET_METADATA, FUNCTION, 'select', select) &&
            validateError(GOT_GET_METADATA, STACK, STACK, stack) &&
            validateError(GOT_GET_METADATA, EDGE_TYPES, EDGE_TYPES, edgeTypes) &&
            validateError(GOT_GET_METADATA, STRING, 'fromId', fromId) &&
            validateError(GOT_GET_METADATA, STRING, 'toId', toId)
        ) {
            return store.getMetadata(stack, edgeTypes, fromId, toId);
        }
    };
    const selectEdge = (stack: string[], edgeTypes: string, fromId: string, state: State): Record<string, Metadata> => {
        if (
            validateError(GOT_SELECT_EDGE, FUNCTION, 'select', select) &&
            validateError(GOT_SELECT_EDGE, STACK, STACK, stack) &&
            validateError(GOT_SELECT_EDGE, EDGE_TYPES, EDGE_TYPES, edgeTypes) &&
            validateError(GOT_SELECT_EDGE, STRING, 'fromId', fromId)
        ) {
            return store.selectEdge(stack, edgeTypes, fromId, state);
        }
        return {};
    };
    const getEdge = (stack: string[], edgeTypes: string, fromId: string): Record<string, Metadata> => {
        if (
            validateError(GOT_GET_EDGE, FUNCTION, 'select', select) &&
            validateError(GOT_GET_EDGE, STACK, STACK, stack) &&
            validateError(GOT_GET_EDGE, EDGE_TYPES, EDGE_TYPES, edgeTypes) &&
            validateError(GOT_GET_EDGE, STRING, 'fromId', fromId)
        ) {
            return store.getEdge(stack, edgeTypes, fromId);
        }
        return {};
    };
    const selectReverseEdge = (
        stack: string[],
        edgeTypes: string,
        toId: string,
        state: State,
    ): Record<string, Metadata> => {
        if (
            validateError(GOT_SELECT_REVERSE_EDGE, FUNCTION, 'select', select) &&
            validateError(GOT_SELECT_REVERSE_EDGE, STACK, STACK, stack) &&
            validateError(GOT_SELECT_REVERSE_EDGE, EDGE_TYPES, EDGE_TYPES, edgeTypes) &&
            validateError(GOT_SELECT_REVERSE_EDGE, STRING, 'toId', toId)
        ) {
            return store.selectReverseEdge(stack, edgeTypes, toId, state);
        }
        return {};
    };
    const getReverseEdge = (stack: string[], edgeTypes: string, toId: string): Record<string, Metadata> => {
        if (
            validateError(GOT_GET_REVERSE_EDGE, FUNCTION, 'select', select) &&
            validateError(GOT_GET_REVERSE_EDGE, STACK, STACK, stack) &&
            validateError(GOT_GET_REVERSE_EDGE, EDGE_TYPES, EDGE_TYPES, edgeTypes) &&
            validateError(GOT_GET_REVERSE_EDGE, STRING, 'toId', toId)
        ) {
            return store.getReverseEdge(stack, edgeTypes, toId);
        }
        return {};
    };

    const add = (graphName: string, edgeTypes: string, fromId: string, toNode: Node, metadata: Metadata = true) => {
        if (
            validateError(GOT_ADD, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_ADD, STRING, 'graphName', graphName) &&
            validateError(GOT_ADD, EDGE_TYPES, EDGE_TYPES, edgeTypes) &&
            validateError(GOT_ADD, STRING, 'fromId', fromId) &&
            validateError(GOT_ADD, NODE, 'toNode', toNode) &&
            validateError(GOT_ADD, METADATA, METADATA, metadata)
        ) {
            return store.add(graphName, edgeTypes, fromId, toNode, metadata);
        }
    };
    const remove = (graphName: string, edgeTypes: string, fromId: string, toNode: Node | string) => {
        if (
            validateError(GOT_REMOVE, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_REMOVE, STRING, 'graphName', graphName) &&
            validateError(GOT_REMOVE, EDGE_TYPES, EDGE_TYPES, edgeTypes) &&
            validateError(GOT_REMOVE, STRING, 'fromId', fromId) &&
            validateError(GOT_REMOVE, NODE, 'toNode', toNode)
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
            validateError(GOT_ASSOC, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_ASSOC, STRING, 'graphName', graphName) &&
            validateError(GOT_ASSOC, EDGE_TYPES, EDGE_TYPES, edgeTypes) &&
            validateError(GOT_ASSOC, STRING, 'fromId', fromId) &&
            validateError(GOT_ASSOC, NODE, 'toNode', toNode) &&
            validateError(GOT_ASSOC, METADATA, METADATA, metadata)
        ) {
            return store.assoc(graphName, edgeTypes, fromId, toNode, metadata);
        }
    };
    const dissoc = (graphName: string, edgeTypes: string, fromId: string, toNode: Node | string) => {
        if (
            validateError(GOT_DISSOC, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_DISSOC, STRING, 'graphName', graphName) &&
            validateError(GOT_DISSOC, EDGE_TYPES, EDGE_TYPES, edgeTypes) &&
            validateError(GOT_DISSOC, STRING, 'fromId', fromId) &&
            validateError(GOT_DISSOC, NODE, 'toNode', toNode)
        ) {
            return store.dissoc(graphName, edgeTypes, fromId, toNode);
        }
    };

    const selectRights = (stack: string[], nodeId: string, state: State) => {
        if (
            validateError(GOT_SELECT_RIGHTS, FUNCTION, 'select', select) &&
            validateError(GOT_SELECT_RIGHTS, STACK, STACK, stack) &&
            validateError(GOT_SELECT_RIGHTS, STRING, 'nodeId', nodeId)
        ) {
            return store.selectRights(stack, nodeId, state);
        }
        return {};
    };
    const getRights = (stack: string[], nodeId: string) => {
        if (
            validateError(GOT_GET_RIGHTS, FUNCTION, 'select', select) &&
            validateError(GOT_GET_RIGHTS, STACK, STACK, stack) &&
            validateError(GOT_GET_RIGHTS, STRING, 'nodeId', nodeId)
        ) {
            return store.getRights(stack, nodeId);
        }
        return {};
    };
    const setRights = (graphName: string, nodeId: string, email: string, rights: RightTypes) => {
        if (
            validateError(GOT_SET_RIGHTS, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_SET_RIGHTS, STRING, 'graphName', graphName) &&
            validateError(GOT_SET_RIGHTS, STRING, 'nodeId', nodeId) &&
            validateError(GOT_SET_RIGHTS, STRING, 'email', email) &&
            validateError(GOT_SET_RIGHTS, RIGHTS, RIGHTS, rights)
        ) {
            return store.setRights(graphName, nodeId, email, rights);
        }
    };
    const setRoleRights = (graphName: string, nodeId: string, role: string, rights: RightTypes) => {
        if (
            validateError(GOT_SET_ROLE_RIGHTS, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_SET_ROLE_RIGHTS, STRING, 'graphName', graphName) &&
            validateError(GOT_SET_ROLE_RIGHTS, STRING, 'nodeId', nodeId) &&
            validateError(GOT_SET_ROLE_RIGHTS, STRING, 'role', role) &&
            validateError(GOT_SET_ROLE_RIGHTS, RIGHTS, RIGHTS, rights)
        ) {
            return store.setRoleRights(graphName, nodeId, role, rights);
        }
    };
    const inheritRights = (graphName: string, fromId: string, nodeId: string) => {
        if (
            validateError(GOT_INHERIT_RIGHTS, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_INHERIT_RIGHTS, STRING, 'graphName', graphName) &&
            validateError(GOT_INHERIT_RIGHTS, STRING, 'nodeId', nodeId) &&
            validateError(GOT_INHERIT_RIGHTS, STRING, 'fromId', fromId)
        ) {
            return store.inheritRights(graphName, fromId, nodeId);
        }
    };

    const selectFiles = (stack: string[], nodeId: string, state: State) => {
        if (
            validateError(GOT_SELECT_FILES, FUNCTION, 'select', select) &&
            validateError(GOT_SELECT_FILES, STACK, STACK, stack) &&
            validateError(GOT_SELECT_FILES, STRING, 'nodeId', nodeId)
        ) {
            return store.selectFiles(stack, nodeId, state);
        }
        return {};
    };
    const getFiles = (stack: string[], nodeId: string) => {
        if (
            validateError(GOT_GET_FILES, FUNCTION, 'select', select) &&
            validateError(GOT_GET_FILES, STACK, STACK, stack) &&
            validateError(GOT_GET_FILES, STRING, 'nodeId', nodeId)
        ) {
            return store.getFiles(stack, nodeId);
        }
        return {};
    };
    const setFile = (graphName: string, nodeId: string, prop: string, filename: string, file: Blob) => {
        if (
            validateError(GOT_SET_FILE, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_SET_FILE, STRING, 'graphName', graphName) &&
            validateError(GOT_SET_FILE, STRING, 'nodeId', nodeId) &&
            validateError(GOT_SET_FILE, STRING, 'prop', prop) &&
            validateError(GOT_SET_FILE, STRING, 'filename', filename) &&
            validateError(GOT_SET_FILE, BLOB, 'file', file)
        ) {
            return store.setFile(graphName, nodeId, prop, filename, file);
        }
    };
    const removeFile = (graphName: string, nodeId: string, prop: string) => {
        if (
            validateError(GOT_REMOVE_FILE, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_REMOVE_FILE, STRING, 'graphName', graphName) &&
            validateError(GOT_REMOVE_FILE, STRING, 'nodeId', nodeId) &&
            validateError(GOT_REMOVE_FILE, STRING, 'prop', prop)
        ) {
            return store.removeFile(graphName, nodeId, prop);
        }
    };

    const selectView = <TView extends View>(stack: string[], view: TView, state: State): ViewResult<TView> => {
        if (
            validateError(GOT_SELECT_VIEW, FUNCTION, 'select', select) &&
            validateError(GOT_SELECT_VIEW, STACK, STACK, stack) &&
            validateError(GOT_SELECT_VIEW, VIEW, VIEW, view)
        ) {
            return store.selectView(stack, view, state);
        }
        return {} as ViewResult<TView>;
    };
    const getView = <TView extends View>(stack: string[], view: TView): ViewResult<TView> => {
        if (
            validateError(GOT_GET_VIEW, FUNCTION, 'select', select) &&
            validateError(GOT_GET_VIEW, STACK, STACK, stack) &&
            validateError(GOT_GET_VIEW, VIEW, VIEW, view)
        ) {
            return store.getView(stack, view);
        }
        return {} as ViewResult<TView>;
    };

    const selectSubgraph = (stack: string[], view: View, state: State): Graph => {
        if (
            validateError(GOT_SELECT_SUBGRAPH, FUNCTION, 'select', select) &&
            validateError(GOT_SELECT_SUBGRAPH, STACK, STACK, stack) &&
            validateError(GOT_SELECT_SUBGRAPH, VIEW, VIEW, view)
        ) {
            return store.selectSubgraph(stack, view, state);
        }
        return {};
    };
    const getSubgraph = (stack: string[], view: View): Graph => {
        if (
            validateError(GOT_GET_SUBGRAPH, FUNCTION, 'select', select) &&
            validateError(GOT_GET_SUBGRAPH, STACK, STACK, stack) &&
            validateError(GOT_GET_SUBGRAPH, VIEW, VIEW, view)
        ) {
            return store.getSubgraph(stack, view);
        }
        return {};
    };

    const push = async (graphName: string, toGraphName: string = 'main'): Promise<PushObservables> => {
        if (
            validateError(GOT_PUSH, API, API, api) &&
            validateError(GOT_PUSH, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_PUSH, STRING, 'graphName', graphName) &&
            validateError(GOT_PUSH, STRING, 'toGraphName', toGraphName)
        ) {
            try {
                const res = await store.push(graphName, toGraphName);
                return res;
            } catch (error) {
                onError && onError(error);
            }
        }
        return { uploads: { subscribe: () => {}, start: async () => {} } };
    };

    const pull = async (view: View, toGraphName = 'main'): Promise<Graph> => {
        if (
            validateError(GOT_PULL, API, API, api) &&
            validateError(GOT_PULL, FUNCTION, 'dispatch', dispatch) &&
            validateError(GOT_PULL, VIEW, VIEW, view) &&
            validateError(GOT_PULL, STRING, 'toGraphName', toGraphName)
        ) {
            if (isEmptyObject(view)) {
                onWarn && onWarn('Pull view is empty');
                return {};
            }

            try {
                const res = await store.pull(view, toGraphName);
                return res;
            } catch (error) {
                onError && onError(error);
            }
        }
        return {};
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
        push,
        pull,
    };
};
