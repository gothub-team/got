import { configureCreateCurriedGraph } from './store/createCurriedGraph';
import { configureCreateGraph } from './store/createGraph';
import { createCurriedStore } from './store/curried';
import { createErrorHandledStore } from './store/errorHandling';
import { type GotApi } from '@gothub-team/got-api';
import { type StoreAPI } from './types/api';
import { type State } from './types/state';
import { type GOT_ACTION } from './types/actions';

type SetupOption = {
    api: GotApi;
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
        api: api as StoreAPI,
        onError,
        onWarn,
    });

    const createGraph = configureCreateGraph(store, onError);

    const curriedStore = createCurriedStore(store);
    const createCurriedGraph = configureCreateCurriedGraph(curriedStore, onError);

    return {
        createGraph,
        store,
        curried: {
            createGraph: createCurriedGraph,
            store: curriedStore,
        },
    };
};
