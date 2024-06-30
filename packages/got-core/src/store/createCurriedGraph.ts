import type { Graph } from '../types/graph';
import type { View } from '../types/view';
import { createInputValidator } from '../utils/errors.js';
import type { CurriedStore } from './curried';

export const configureCreateCurriedGraph = (store: CurriedStore, onError: (e: Error) => void) => {
    const validateError = createInputValidator(onError);
    const createGraph = (...stack: string[]) => {
        validateError('GOT_CREATE_CURRIED_GRAPH', 'stack', 'stack', stack);

        const currentGraphName = stack.at(-1) as string;
        const nextBelowGraphName = stack.at(-2) as string;
        const bottomGraphName = stack.at(0) as string;

        const push = () => store.push(currentGraphName, bottomGraphName);
        const pull = (view: View) => store.pull(view, bottomGraphName);
        const selectView = store.selectView(...stack);
        const getView = store.getView(...stack);
        const merge = (toGraphName?: string) => store.merge(currentGraphName, toGraphName || nextBelowGraphName);
        const mergeGraph = (fromGraph: Graph, toGraphName?: string) =>
            store.mergeGraph(fromGraph, toGraphName || currentGraphName);
        const clear = () => store.clear(currentGraphName);
        const selectNode = store.selectNode(...stack);
        const node = store.getNode(...stack);
        const update = store.setNode(currentGraphName);
        const selectEdge = store.selectEdge(...stack);
        const edge = store.getEdge(...stack);
        const selectMetadata = store.selectMetadata(...stack);
        const metadata = store.getMetadata(...stack);
        const add = store.add(currentGraphName);
        const remove = store.remove(currentGraphName);
        const assoc = store.assoc(currentGraphName);
        const dissoc = store.dissoc(currentGraphName);
        const selectRights = store.selectRights(...stack);
        const rights = store.getRights(...stack);
        const setRights = store.setRights(currentGraphName);
        const setRoleRights = store.setRoleRights(currentGraphName);
        const inheritRights = store.inheritRights(currentGraphName);
        const selectFiles = store.selectFiles(...stack);
        const files = store.getFiles(...stack);
        const setFile = store.setFile(currentGraphName);
        const removeFile = store.removeFile(currentGraphName);

        return {
            push,
            pull,
            selectView,
            getView,
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
        };
    };

    return createGraph;
};

export type CreateCurriedGraph = ReturnType<typeof configureCreateCurriedGraph>;
export type CreateCurriedGraphRes = ReturnType<ReturnType<typeof configureCreateCurriedGraph>>;
