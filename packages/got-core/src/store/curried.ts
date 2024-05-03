import { Metadata, Node, RightTypes } from '../types/graphObjects';
import { State } from '../types/state';
import { View } from '../types/view';
import { createStore } from './store';

const decideStack = (stack: string[] | string[1][]): string[] => {
    if (stack.length === 1 && Array.isArray(stack[0])) {
        return stack[0];
    }
    return stack;
};

export const createCurriedStore = (store: ReturnType<typeof createStore>) => {
    const merge = store.merge;
    const mergeGraph = store.mergeGraph;
    const mergeOverwriteGraph = store.mergeOverwriteGraph;
    const clear = store.clear;
    const clearAll = store.clearAll;

    const selectNode =
        (...stack: string[]) =>
        (nodeId: string) =>
        (state: State) => {
            store.selectNode(decideStack(stack), nodeId, state);
        };
    const getNode =
        (...stack: string[]) =>
        (nodeId: string) => {
            return store.getNode(decideStack(stack), nodeId);
        };
    const setNode = (graphName: string) => (node: Node) => {
        store.setNode(graphName, node);
    };
    const removeNode = (graphName: string) => (nodeId: string) => {
        store.removeNode(graphName, nodeId);
    };

    const selectMetadata =
        (...stack: string[]) =>
        (edgeTypes: string) =>
        (fromId: string) =>
        (toId: string) =>
        (state: State) => {
            store.selectMetadata(decideStack(stack), edgeTypes, fromId, toId, state);
        };
    const getMetadata =
        (...stack: string[]) =>
        (edgeTypes: string) =>
        (fromId: string) =>
        (toId: string) => {
            return store.getMetadata(decideStack(stack), edgeTypes, fromId, toId);
        };

    const selectEdge =
        (...stack: string[]) =>
        (edgeTypes: string) =>
        (fromId: string) =>
        (state: State) => {
            store.selectEdge(decideStack(stack), edgeTypes, fromId, state);
        };
    const getEdge =
        (...stack: string[]) =>
        (edgeTypes: string) =>
        (fromId: string) => {
            return store.getEdge(decideStack(stack), edgeTypes, fromId);
        };

    const selectReverseEdge =
        (...stack: string[]) =>
        (edgeTypes: string) =>
        (toId: string) =>
        (state: State) => {
            store.selectReverseEdge(decideStack(stack), edgeTypes, toId, state);
        };
    const getReverseEdge =
        (...stack: string[]) =>
        (edgeTypes: string) =>
        (toId: string) => {
            return store.getReverseEdge(decideStack(stack), edgeTypes, toId);
        };

    const add =
        (graphName: string) =>
        (edgeTypes: string) =>
        (fromId: string) =>
        (toNode: Node, metadata: Metadata = true) => {
            store.add(graphName, edgeTypes, fromId, toNode, metadata);
        };
    const remove = (graphName: string) => (edgeTypes: string) => (fromId: string) => (toNode: Node | string) => {
        store.remove(graphName, edgeTypes, fromId, toNode);
    };
    const assoc =
        (graphName: string) =>
        (edgeTypes: string) =>
        (fromId: string) =>
        (toNode: Node | string, metadata: Metadata = true) => {
            store.assoc(graphName, edgeTypes, fromId, toNode, metadata);
        };
    const dissoc = (graphName: string) => (edgeTypes: string) => (fromId: string) => (toNode: Node | string) => {
        store.dissoc(graphName, edgeTypes, fromId, toNode);
    };

    const selectRights =
        (...stack: string[]) =>
        (nodeId: string) =>
        (state: State) => {
            store.selectRights(decideStack(stack), nodeId, state);
        };
    const getRights =
        (...stack: string[]) =>
        (nodeId: string) => {
            return store.getRights(decideStack(stack), nodeId);
        };
    const setRights = (graphName: string) => (nodeId: string) => (email: string, rights: RightTypes) => {
        store.setRights(graphName, nodeId, email, rights);
    };
    const setRoleRights = (graphName: string) => (nodeId: string) => (role: string, rights: RightTypes) => {
        store.setRoleRights(graphName, nodeId, role, rights);
    };
    /**
     * @deprecated lower version of store have an inherit rights function with the signature (graphName, fromId, nodeId) => void
     */
    const inheritRights = (graphName: string) => (nodeId: string) => (fromId: string) => {
        store.inheritRights(graphName, fromId, nodeId);
    };

    const selectFiles =
        (...stack: string[]) =>
        (nodeId: string) =>
        (state: State) => {
            store.selectFiles(decideStack(stack), nodeId, state);
        };
    const getFiles =
        (...stack: string[]) =>
        (nodeId: string) => {
            return store.getFiles(decideStack(stack), nodeId);
        };
    const setFile = (graphName: string) => (nodeId: string) => (prop: string, filename: string, file: Blob) => {
        store.setFile(graphName, nodeId, prop, filename, file);
    };
    const removeFile = (graphName: string) => (nodeId: string) => (prop: string) => {
        store.removeFile(graphName, nodeId, prop);
    };

    const selectView =
        (...stack: string[]) =>
        (view: View) =>
        (state: State) => {
            store.selectView(decideStack(stack), view, state);
        };
    const getView =
        (...stack: string[]) =>
        (view: View) => {
            return store.getView(decideStack(stack), view);
        };

    const selectSubgraph =
        (...stack: string[]) =>
        (view: View) =>
        (state: State) => {
            store.selectSubgraph(decideStack(stack), view, state);
        };

    const getSubgraph =
        (...stack: string[]) =>
        (view: View) => {
            return store.getSubgraph(decideStack(stack), view);
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
