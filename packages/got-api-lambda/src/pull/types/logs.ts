export type RequestLog = {
    time: number;
    sendTime: number;
    payloadBytes: number;
    timeQueryNode: number;
    timeQueryEdge: number;
    timeLoadEdge: number;
};

export type LoaderLog = {
    nodes: number;
    metadata: number;
    files: number;
};

export type GraphAssemblerLog = {
    timeNode: number;
    timeMetadata: number;
    timeJson: number;
};

export type Log = {
    request: RequestLog;
    loader: LoaderLog;
    graphAssembler: GraphAssemblerLog;
};
