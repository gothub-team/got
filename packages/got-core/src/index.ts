import { configureCreateCurriedGraph } from './store/createCurriedGraph';
import { configureCreateGraph } from './store/createGraph';
import { createCurriedStore } from './store/curried';
import { createErrorHandledStore } from './store/errorHandling';
import { type StoreAPI } from './types/api';
import { type State } from './types/state';
import { type GOT_ACTION } from './types/actions';
import { configureCreateLocalGraph } from './local-store/createLocalGraph';
import { configureCreateLocalCurriedGraph } from './local-store/createLocalCurriedGraph';

type SetupOption = {
    api: StoreAPI;
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

export type * from './types/graph';
export type * from './types/graphObjects';
export type * from './types/view';
export * from './utils/util';
