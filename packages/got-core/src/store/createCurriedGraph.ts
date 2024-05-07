import { Graph } from '../types/graph';
import { View } from '../types/view';
import { createInputValidator } from '../utils/errors';
import { CurriedStore } from './curried';

export const configureCreateGraph = (store: CurriedStore, onError: (e: Error) => void) => {
    const validateError = createInputValidator(onError);
    const createGraph = (...stack: string[]) => {
        validateError('GOT_CREATE_CURRIED_GRAPH', 'stack', 'stack', stack);

        const currentGraphName = stack.at(-1);
        const nextBelowGraphName = stack.at(-2);
        const bottomGraphName = stack.at(0);

        const push = () => store.push(currentGraphName, bottomGraphName);
        const pull = (view: View) => store.pull(view, bottomGraphName);
        const getView = store.getView(...stack);
        const merge = (toGraphName?: string) => store.merge(currentGraphName, toGraphName || nextBelowGraphName);
        const mergeGraph = (fromGraph: Graph, toGraphName?: string) =>
            store.mergeGraph(fromGraph, toGraphName || currentGraphName);
        const clear = () => store.clear(currentGraphName);
        const node = store.getNode(...stack);
        const update = store.setNode(currentGraphName);
        const edge = store.getEdge(...stack);
        const metadata = store.getMetadata(...stack);
        const add = store.add(currentGraphName);
        const remove = store.remove(currentGraphName);
        const assoc = store.assoc(currentGraphName);
        const dissoc = store.dissoc(currentGraphName);
        const rights = store.getRights(...stack);
        const setRights = store.setRights(currentGraphName);
        const setRoleRights = store.setRoleRights(currentGraphName);
        const inheritRights = store.inheritRights(currentGraphName);
        const files = store.getFiles(...stack);
        const setFile = store.setFile(currentGraphName);
        const removeFile = store.removeFile(currentGraphName);

        return {
            push,
            pull,
            getView,
            merge,
            mergeGraph,
            clear,
            node,
            update,
            edge,
            metadata,
            add,
            remove,
            assoc,
            dissoc,
            rights,
            setRights,
            setRoleRights,
            inheritRights,
            files,
            setFile,
            removeFile,
        };
    };

    return createGraph;
};
