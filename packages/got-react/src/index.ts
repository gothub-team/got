import type { Atom } from '@gothub-team/got-atom';
import { createApi } from '@gothub/got-api';
import { gotReducer, setup as setupCore, type GOT_ACTION, type State } from '@gothub/got-core';
import type { StoreAPI } from '@gothub/got-core/dist/module/types/api';
import { getLocalStorageSessionStore } from './util';
import { configureUseGraph } from './createUseGraph';
import { configureUseCurriedGraph } from './createUseCurriedGraph';

export declare interface ReduxStore {
    /**
     * Dispatches an action to the redux store.
     */
    dispatch: (action: GOT_ACTION) => void;
    /**
     * Returns the current state of the redux store.
     */
    getState: () => unknown;
}

type SetupOptions = {
    host: string;
    reduxStore?: ReduxStore;
    atom?: Atom<State>;
    useSelector: <TRes>(fnSelect: (state: State) => TRes, fnEquals: (next: unknown, prev: unknown) => boolean) => TRes;
    baseState?: string;
    onError?: (e: Error | string) => void;
    onWarn?: (e: Error | string) => void;
    adminMode?: boolean;
    sessionExpireTime?: number;
};

export const setup = ({
    host, // string
    reduxStore, // Redux Store
    atom,
    useSelector,
    baseState, // string
    onError = (e: Error | string) => console.error(e),
    onWarn = (e: Error | string) => console.warn(e),
    adminMode = false,
    sessionExpireTime,
}: SetupOptions) => {
    let dispatch: (action: GOT_ACTION) => void;
    let getState: () => State;

    if (atom) {
        dispatch = (action: GOT_ACTION) => atom.set(gotReducer(atom.get(), action));
        getState = atom.get;
    } else if (reduxStore) {
        dispatch = reduxStore.dispatch;
        getState = reduxStore.getState as () => State;
    } else {
        onError('You must provide either a Redux store or an Atom');
        return;
    }

    if (!useSelector) {
        onError('You must provide a useSelector function');
        return;
    }

    const api = createApi({
        host,
        adminMode,
        sessionStore: getLocalStorageSessionStore(`got-auth_${host}`),
        sessionExpireTime,
    });

    const { createGraph, createLocalGraph, store, curried } = setupCore({
        api: api as unknown as StoreAPI,
        dispatch,
        select: baseState
            ? (selector) => selector((reduxStore?.getState() as Record<string, State>)?.[baseState] || {})
            : (selector) => selector(getState() as State),
        onError,
        onWarn,
        adminMode,
        sessionExpireTime,
    });

    const useGraph = configureUseGraph({
        createGraph,
        useSelector: baseState
            ? (selector, fnEquals) =>
                  useSelector(
                      (state: State | Record<string, State>) =>
                          selector(((state as Record<string, State>)?.[baseState] || {}) as State),
                      fnEquals,
                  )
            : useSelector,
    });

    const useCurriedGraph = configureUseCurriedGraph({
        createGraph: curried.createGraph,
        useSelector: baseState
            ? (selector, fnEquals) =>
                  useSelector(
                      (state: State | Record<string, State>) =>
                          selector(((state as Record<string, State>)?.[baseState] || {}) as State),
                      fnEquals,
                  )
            : useSelector,
    });

    return {
        createGraph,
        createLocalGraph,
        useGraph,
        curried: {
            createGraph: curried.createGraph,
            createLocalGraph: curried.createLocalGraph,
            useGraph: useCurriedGraph,
        },
        store,
        api,
    };
};

export { configureUseCurriedGraph, configureUseGraph };
