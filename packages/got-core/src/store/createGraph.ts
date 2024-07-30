import type { Graph } from '../types/graph';
import type { Metadata, Node, RightTypes } from '../types/graphObjects';
import type { State } from '../types/state';
import type { View } from '../types/view';
import { createInputValidator } from '../utils/errors';
import { decideStack } from '../utils/util';
import type { Store } from './store';

export const configureCreateGraph = (store: Store, onError: (e: Error) => void) => {
    const validateError = createInputValidator(onError);

    const createGraph = (...stack: string[] | string[1][]) => {
        const _stack = decideStack(stack);
        validateError('GOT_CREATE_GRAPH', 'stack', 'stack', stack);

        const currentGraphName = stack.at(-1) as string;
        const nextBelowGraphName = stack.at(-2) as string;
        const bottomGraphName = stack.at(0) as string;

        const merge = (toGraphName?: string) => store.merge(currentGraphName, toGraphName || nextBelowGraphName);
        const mergeGraph = (fromGraph: Graph, toGraphName?: string) =>
            store.mergeGraph(fromGraph, toGraphName || nextBelowGraphName);
        // TODO: merge error graph?
        // TODO: merge overwrite graph?

        const clear = () => store.clear(currentGraphName);

        const selectNode = (nodeId: string, state: State) => store.selectNode(_stack, nodeId, state);
        const node = (nodeId: string) => store.getNode(_stack, nodeId);
        const update = (node: Node) => store.setNode(currentGraphName, node);
        // TODO: remove node?

        const selectEdge = (edgeTypes: string, fromId: string, state: State) =>
            store.selectEdge(_stack, edgeTypes, fromId, state);
        const edge = (edgeTypes: string, fromId: string) => store.getEdge(_stack, edgeTypes, fromId);

        const selectMetadata = (edgeTypes: string, fromId: string, toId: string, state: State) =>
            store.selectMetadata(_stack, edgeTypes, fromId, toId, state);
        const metadata = (edgeTypes: string, fromId: string, toId: string) =>
            store.getMetadata(_stack, edgeTypes, fromId, toId);

        const add = (edgeTypes: string, fromId: string, toNode: Node, metadata?: Metadata) =>
            store.add(currentGraphName, edgeTypes, fromId, toNode, metadata);
        const remove = (edgeTypes: string, fromId: string, toId: string) =>
            store.remove(currentGraphName, edgeTypes, fromId, toId);
        const assoc = (edgeTypes: string, fromId: string, toNode: Node | string, metadata?: Metadata) =>
            store.assoc(currentGraphName, edgeTypes, fromId, toNode, metadata);
        const dissoc = (edgeTypes: string, fromId: string, toId: string) =>
            store.dissoc(currentGraphName, edgeTypes, fromId, toId);

        const selectRights = (nodeId: string, state: State) => store.selectRights(_stack, nodeId, state);
        const rights = (nodeId: string) => store.getRights(_stack, nodeId);

        const setRights = (nodeId: string, email: string, rightTypes: RightTypes) =>
            store.setRights(currentGraphName, nodeId, email, rightTypes);
        const setRoleRights = (nodeId: string, role: string, rightTypes: RightTypes) =>
            store.setRoleRights(currentGraphName, nodeId, role, rightTypes);
        const inheritRights = (fromNodeId: string, nodeId: string) =>
            store.inheritRights(currentGraphName, fromNodeId, nodeId);

        const selectFiles = (nodeId: string, state: State) => store.selectFiles(_stack, nodeId, state);
        const files = (nodeId: string) => store.getFiles(_stack, nodeId);
        const setFile = (nodeId: string, prop: string, fileName: string, file: Blob) =>
            store.setFile(currentGraphName, nodeId, prop, fileName, file);
        const removeFile = (nodeId: string, prop: string) => store.removeFile(currentGraphName, nodeId, prop);

        const push = async () => store.push(currentGraphName, bottomGraphName);
        const pull = async (view: View) => store.pull(view, bottomGraphName);

        const selectView = <TView extends View>(view: TView, state: State) => store.selectView(_stack, view, state);
        const getView = <TView extends View>(view: TView) => store.getView(_stack, view);

        return {
            merge,
            mergeGraph,
            clear,
            selectNode,
            node,
            update,
            selectEdge,
            edge,
            selectMetadata,
            metadata,
            add,
            remove,
            assoc,
            dissoc,
            selectRights,
            rights,
            setRights,
            setRoleRights,
            inheritRights,
            selectFiles,
            files,
            setFile,
            removeFile,
            push,
            pull,
            selectView,
            getView,
        };
    };
    return createGraph;
};

export type CreateGraph = ReturnType<typeof configureCreateGraph>;
export type CreateGraphRes = ReturnType<ReturnType<typeof configureCreateGraph>>;
