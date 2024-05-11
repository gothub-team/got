import { type ErrorGraph, type Graph } from './graph';

export type FileStore = {
    [nodeId: string]: {
        [name: string]: {
            status: string;
            file: Blob;
        };
    };
};

export declare interface GraphState {
    graph: Graph;
    errors: ErrorGraph;
    files: FileStore;
}

export declare type State<T extends Record<string, GraphState> = Record<string, GraphState>> = {
    main: GraphState;
} & T;
