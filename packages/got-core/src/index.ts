import { configureCreateCurriedGraph } from './store/createCurriedGraph.js';
import { configureCreateGraph } from './store/createGraph.js';
import { createCurriedStore } from './store/curried.js';
import { createErrorHandledStore } from './store/errorHandling.js';
import { type StoreAPI } from './types/api.js';
import { type State } from './types/state.js';
import { type GOT_ACTION } from './types/actions.js';
import { configureCreateLocalGraph } from './local-store/createLocalGraph.js';
import { configureCreateLocalCurriedGraph } from './local-store/createLocalCurriedGraph.js';

type SetupOption = {
    api: StoreAPI; // TODO: make type module and fix this
    select: <TRes>(fnSelect: (state: State) => TRes) => TRes;
    dispatch: (action: GOT_ACTION) => void;
    onError: (e: Error) => void;
    onWarn: (e: Error) => void;
    adminMode?: boolean;
    sessionExpireTime?: number;
};

export const setup = ({ api, dispatch, select, onError, onWarn }: SetupOption) => {
    const store = createErrorHandledStore({
        dispatch,
        select,
        api: api as unknown as StoreAPI, // TODO: Fix this
        onError,
        onWarn,
    });

    const createGraph = configureCreateGraph(store, onError);
    const createLocalGraph = configureCreateLocalGraph(api as unknown as StoreAPI, { onError, onWarn });

    const curriedStore = createCurriedStore(store);
    const createCurriedGraph = configureCreateCurriedGraph(curriedStore, onError);
    const createLocalCurriedGraph = configureCreateLocalCurriedGraph(api as unknown as StoreAPI, { onError, onWarn });

    return {
        createGraph,
        createLocalGraph,
        store,
        /**
         * @deprecated
         */
        curried: {
            createGraph: createCurriedGraph,
            createLocalGraph: createLocalCurriedGraph,
            store: curriedStore,
        },
    };
};

export type * from './types/state';
export type * from './types/actions';
export type * from './types/graph';
export type * from './types/graphObjects';
export type * from './types/view';
export * from './store/createGraph.js';
export * from './store/createCurriedGraph.js';

export * from './utils/util.js';
export * from './reducer/reducer.js';
