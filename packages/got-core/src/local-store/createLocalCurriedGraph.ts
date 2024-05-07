import { getEmptyStore, gotReducer } from '../reducer/reducer';
import { configureCreateCurriedGraph } from '../store/createCurriedGraph';
import { createCurriedStore } from '../store/curried';
import { ErrorHandlers, createErrorHandledStore } from '../store/errorHandling';
import { GOT_ACTION } from '../types/actions';
import { StoreAPI } from '../types/api';
import { State } from '../types/state';

export const configureCreateLocalGraph = (api: StoreAPI, options: ErrorHandlers) => {
    /**
     * Factory function for creating a local got state and graph functions.
     *
     * When performing a lot of operations on the graph it is recommended to create a local graph to avoid unnecessary updates to the global store.
     *
     * By default the local graph will operate on the stack ['main', 'edit']. All edits made on the local graph will be stored in the "edit" graph.
     *
     * The local graph can be merged to the global got store by calling `mergeGraph(getGraph())`,
     * where `getGraph` is a function returned by `createLocalGraph` and `mergeGraph` is the function relating to the global store.
     *
     * The local graph does not have any API capabilities.
     */
    const createLocalGraph = (initialState?: State) => {
        const { onError = console.error, onWarn = console.warn } = options || {};

        let state = initialState || getEmptyStore();
        const getState = () => state;
        const select = (selector) => selector(state);
        const dispatch = (action: GOT_ACTION) => {
            try {
                state = gotReducer(state, action);
            } catch (error) {
                console.error(error);
            }
        };

        const store = createCurriedStore(
            createErrorHandledStore({
                dispatch,
                select,
                api,
                onError,
                onWarn,
            }),
        );

        const createGraph = configureCreateCurriedGraph(store, onError);
        const graphFns = createGraph('main', 'edit');

        const getGraph = (graphName = 'edit') => getState()?.[graphName]?.graph || {};
        return { ...graphFns, store, getState, getGraph };
    };

    return createLocalGraph;
};
