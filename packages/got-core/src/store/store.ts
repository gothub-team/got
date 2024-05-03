import { ViewResult } from '../types/ViewResult';
import { GOT_ACTION } from '../types/actions';
import { Graph } from '../types/graph';
import { Metadata, Node, RightTypes } from '../types/graphObjects';
import { State } from '../types/state';
import { View } from '../types/view';
import {
    edgeFromStack,
    filesFromStack,
    metadataFromStack,
    nodeFromStack,
    rightFromStack,
    selectGraphStack,
} from '../utils/stack';
import { subgraphFromStack, viewResFromStack } from '../utils/view';

type CreateStoreOptions = {
    // api: Api;
    dispatch: (action: GOT_ACTION) => void;
    select: <TRes>(fnSelect: (state: State) => TRes) => TRes;
};

export const createStore = ({ dispatch, select }: CreateStoreOptions) => {
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
    const setNode = (graphName: string, node) => {
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
    const getEdge = (stack: string[], edgeTypes: string, fromId: string) =>
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

        const fromIds = Object.keys(edgeFromStack(graphStack, toType, toId, fromType));

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
    const getReverseEdge = (stack: string[], edgeTypes: string, toId: string) =>
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
    const inheritRights = (graphName: string, nodeId: string, fromId: string) => {
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
        return viewResFromStack(graphStack, view, state);
    };
    const getView = <TView extends View>(stack: string[], view: TView): ViewResult<TView> =>
        select((state) => selectView(stack, view, state));

    // TODO: tests for this?
    const selectSubgraph = (stack: string[], view: View, state: State) => {
        const graphStack = selectGraphStack(state, stack);
        return subgraphFromStack(graphStack, view, state);
    };
    const getSubgraph = (stack: string[], view: View) => select((state) => selectSubgraph(stack, view, state));

    return {
        merge,
        mergeGraph,
        mergeOverwriteGraph,
        clear,
        clearAll,
        getNode,
        setNode,
        removeNode,
        getMetadata,
        getEdge,
        getReverseEdge,
        add,
        remove,
        assoc,
        dissoc,
        getRights,
        setRights,
        setRoleRights,
        inheritRights,
        getFiles,
        setFile,
        removeFile,
        getView,
        getSubgraph,
    };
};
