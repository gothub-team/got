import { ViewResult } from '../types/ViewResult';
import { GOT_ACTION, GOT_UPLOAD_ACTION } from '../types/actions';
import { StoreAPI } from '../types/api';
import { ErrorGraph, Graph } from '../types/graph';
import { Metadata, Node, RightTypes } from '../types/graphObjects';
import { State } from '../types/state';
import { View } from '../types/view';
import { isEmptyGraph, selectDeleteGraph, selectSuccessAndErrorGraphs } from '../utils/graph';
import { mergeGraphsRight } from '../utils/mergeGraph';
import {
    edgeFromStack,
    filesFromStack,
    metadataFromStack,
    nodeFromStack,
    reverseEdgeFromStack,
    rightFromStack,
    selectGraphStack,
} from '../utils/stack';
import { createFileUploader } from '../utils/uploads';
import { Subscriber } from '../utils/util';
import { subgraphFromStack, viewResFromStack } from '../utils/view';

export type CreateStoreOptions = {
    api: StoreAPI;
    dispatch: (action: GOT_ACTION) => void;
    select: <TRes>(fnSelect: (state: State) => TRes) => TRes;
};

export type PushObservables = {
    uploads: {
        /**
         * Subscribes an object to the upload events.
         * Uploads must be initiated by calling start().
         */
        subscribe: (subscriber: Subscriber<GOT_UPLOAD_ACTION>) => void;
        /**
         * Starts the upload progress for all pushed files.
         * Progress and completion can be observed by subscribing before or after calling start().
         */
        start: () => Promise<void>;
    };
};

export const createStore = ({ api, dispatch, select }: CreateStoreOptions) => {
    const merge = (fromGraph: Graph | string, toGraphName: string) => {
        const _graph = typeof fromGraph === 'string' ? select((state) => state[fromGraph]?.graph) : fromGraph;
        dispatch({
            type: 'GOT/MERGE',
            payload: {
                fromGraph: _graph,
                toGraphName,
            },
        });
    };
    const mergeGraph = (fromGraph: Graph = {}, toGraphName: string) => {
        dispatch({
            type: 'GOT/MERGE',
            payload: {
                fromGraph,
                toGraphName,
            },
        });
    };
    const mergeErrorGraph = (fromGraph: ErrorGraph = {}, toGraphName: string) => {
        dispatch({
            type: 'GOT/MERGE_ERROR',
            payload: {
                fromGraph,
                toGraphName,
            },
        });
    };
    const mergeOverwriteGraph = (fromGraph: Graph = {}, toGraphName: string) => {
        dispatch({
            type: 'GOT/MERGE_OVERWRITE',
            payload: {
                fromGraph,
                toGraphName,
            },
        });
    };
    const clear = (graphName: string) => {
        dispatch({
            type: 'GOT/CLEAR',
            payload: {
                graphName,
            },
        });
    };
    const clearAll = () => {
        dispatch({
            type: 'GOT/CLEAR_ALL',
        });
    };

    const selectNode = (stack: string[], nodeId: string, state: State) => {
        const graphStack = selectGraphStack(state, stack);
        return nodeFromStack(graphStack, nodeId);
    };
    const getNode = (stack: string[], nodeId: string) => select((state) => selectNode(stack, nodeId, state));
    const setNode = (graphName: string, node: Node) => {
        dispatch({
            type: 'GOT/SET_NODE',
            payload: {
                graphName,
                nodeId: node.id,
                node,
            },
        });
    };
    // TODO: tests for this
    const removeNode = (graphName: string, nodeId: string) => {
        dispatch({
            type: 'GOT/SET_NODE',
            payload: {
                graphName,
                nodeId,
                node: false,
            },
        });
    };

    const selectMetadata = (stack: string[], edgeTypes: string, fromId: string, toId: string, state: State) => {
        const [fromType, toType] = edgeTypes.split('/');
        const graphStack = selectGraphStack(state, stack);
        return metadataFromStack(graphStack, fromType, fromId, toType, toId);
    };
    const getMetadata = (stack: string[], edgeTypes: string, fromId: string, toId: string) =>
        select((state) => selectMetadata(stack, edgeTypes, fromId, toId, state));

    const selectEdge = (stack: string[], edgeTypes: string, fromId: string, state: State): Record<string, Metadata> => {
        const [fromType, toType] = edgeTypes.split('/');

        const graphStack = selectGraphStack(state, stack);

        if (!nodeFromStack(graphStack, fromId)) return {};

        const toEdges = edgeFromStack(graphStack, fromType, fromId, toType);
        const toIds = Object.keys(toEdges);

        const edge = {};
        for (let i = 0; i < toIds.length; i += 1) {
            const toId = toIds[i];

            const node = nodeFromStack(graphStack, toId);
            if (!node) continue;

            const metadata = toEdges[toId];
            if (!metadata) continue;

            edge[toId] = metadata;
        }

        return edge;
    };
    const getEdge = (stack: string[], edgeTypes: string, fromId: string): Record<string, Metadata> =>
        select((state) => selectEdge(stack, edgeTypes, fromId, state));

    const selectReverseEdge = (
        stack: string[],
        edgeTypes: string,
        toId: string,
        state: State,
    ): Record<string, Metadata> => {
        const [fromType, toType] = edgeTypes.split('/');

        const graphStack = selectGraphStack(state, stack);

        if (!nodeFromStack(graphStack, toId)) return {};

        const fromIds = Object.keys(reverseEdgeFromStack(graphStack, toType, toId, fromType));

        const edge = {};
        for (let i = 0; i < fromIds.length; i += 1) {
            const fromId = fromIds[i];

            const node = nodeFromStack(graphStack, fromId);
            if (!node) continue;

            const metadata = metadataFromStack(graphStack, fromType, fromId, toType, toId);
            if (!metadata) continue;

            edge[fromId] = metadata;
        }

        return edge;
    };
    const getReverseEdge = (stack: string[], edgeTypes: string, toId: string): Record<string, Metadata> =>
        select((state) => selectReverseEdge(stack, edgeTypes, toId, state));

    const add = (graphName: string, edgeTypes: string, fromId: string, toNode: Node, metadata: Metadata = true) => {
        const [fromType, toType] = edgeTypes.split('/');
        dispatch({
            type: 'GOT/ADD',
            payload: {
                graphName,
                fromType,
                toType,
                fromId,
                toNode,
                metadata,
            },
        });
    };
    const remove = (graphName: string, edgeTypes: string, fromId: string, toNode: Node | string) => {
        const [fromType, toType] = edgeTypes.split('/');
        const toId = typeof toNode === 'string' ? toNode : toNode.id;
        dispatch({
            type: 'GOT/REMOVE',
            payload: {
                graphName,
                fromType,
                toType,
                fromId,
                toId: toId,
            },
        });
    };
    const assoc = (
        graphName: string,
        edgeTypes: string,
        fromId: string,
        toNode: Node | string,
        metadata: Metadata = true,
    ) => {
        const [fromType, toType] = edgeTypes.split('/');
        const toId = typeof toNode === 'string' ? toNode : toNode.id;
        dispatch({
            type: 'GOT/ASSOC',
            payload: {
                graphName,
                fromType,
                toType,
                fromId,
                toId,
                metadata,
            },
        });
    };
    const dissoc = (graphName: string, edgeTypes: string, fromId: string, toNode: Node | string) => {
        const [fromType, toType] = edgeTypes.split('/');
        const toId = typeof toNode === 'string' ? toNode : toNode.id;
        dispatch({
            type: 'GOT/DISSOC',
            payload: {
                graphName,
                fromType,
                toType,
                fromId,
                toId,
            },
        });
    };

    const selectRights = (stack: string[], nodeId: string, state: State) => {
        const graphStack = selectGraphStack(state, stack);
        return rightFromStack(graphStack, nodeId);
    };
    const getRights = (stack: string[], nodeId: string) => select((state) => selectRights(stack, nodeId, state));
    const setRights = (graphName: string, nodeId: string, email: string, rights: RightTypes) => {
        dispatch({
            type: 'GOT/SET_RIGHTS',
            payload: {
                graphName,
                nodeId,
                email,
                rights,
            },
        });
    };
    const setRoleRights = (graphName: string, nodeId: string, role: string, rights: RightTypes) => {
        dispatch({
            type: 'GOT/SET_ROLE_RIGHTS',
            payload: {
                graphName,
                nodeId,
                role,
                rights,
            },
        });
    };
    const inheritRights = (graphName: string, fromId: string, nodeId: string) => {
        dispatch({
            type: 'GOT/INHERIT_RIGHTS',
            payload: {
                graphName,
                nodeId,
                fromId,
            },
        });
    };

    const selectFiles = (stack: string[], nodeId: string, state: State) => {
        const graphStack = selectGraphStack(state, stack);
        return filesFromStack(graphStack, nodeId);
    };
    const getFiles = (stack: string[], nodeId: string) => select((state) => selectFiles(stack, nodeId, state));
    const setFile = (graphName: string, nodeId: string, prop: string, filename: string, file: Blob) => {
        dispatch({
            type: 'GOT/SET_FILE',
            payload: {
                graphName,
                nodeId,
                prop,
                filename,
                file,
            },
        });
    };
    const removeFile = (graphName: string, nodeId: string, prop: string) => {
        dispatch({
            type: 'GOT/REMOVE_FILE',
            payload: {
                graphName,
                nodeId,
                prop,
            },
        });
    };

    const selectView = <TView extends View>(stack: string[], view: TView, state: State): ViewResult<TView> => {
        const graphStack = selectGraphStack(state, stack);
        return viewResFromStack(graphStack, view);
    };
    const getView = <TView extends View>(stack: string[], view: TView): ViewResult<TView> =>
        select((state) => selectView(stack, view, state));

    // TODO: tests for this?
    const selectSubgraph = (stack: string[], view: View, state: State): Graph => {
        const graphStack = selectGraphStack(state, stack);
        return subgraphFromStack(graphStack, view);
    };
    const getSubgraph = (stack: string[], view: View): Graph => select((state) => selectSubgraph(stack, view, state));

    const push = async (graphName: string, toGraphName: string = 'main'): Promise<PushObservables> => {
        const graph = select((state) => state[graphName]?.graph);
        const pushBody = { ...graph, index: undefined };
        if (isEmptyGraph(pushBody)) return;

        const fileStore = select((state) => state[graphName]?.files);

        const apiResult = await api.push(pushBody);
        const [successGraph, errorGraph] = selectSuccessAndErrorGraphs(graph, apiResult);

        if (!isEmptyGraph(successGraph)) {
            mergeGraph(successGraph, toGraphName);
        }

        clear(graphName);

        if (!isEmptyGraph(errorGraph)) {
            mergeErrorGraph(errorGraph, graphName);
        }

        return createFileUploader(api, toGraphName, graph, apiResult, successGraph, fileStore);
    };

    const pull = async (view: View, toGraphName = 'main'): Promise<Graph> => {
        const apiResult = api.pull(view);

        const localGraph = getSubgraph([toGraphName], view);
        const deleteGraph = selectDeleteGraph(localGraph);

        const fromGraph = mergeGraphsRight(deleteGraph, await apiResult);

        mergeOverwriteGraph(fromGraph, toGraphName);

        return apiResult;
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
