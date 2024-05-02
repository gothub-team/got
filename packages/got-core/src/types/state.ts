import { ErrorGraph, Graph } from './graph';

export declare interface GraphState {
    graph: Graph;
    errors: ErrorGraph;
    vars: {
        [name: string]: any;
    };
    files: {
        [nodeId: string]: {
            [name: string]: {
                status: string;
                file: Blob;
            };
        };
    };
}

export declare type State<T extends Record<string, GraphState> = Record<string, GraphState>> = {
    main: GraphState;
} & T;
