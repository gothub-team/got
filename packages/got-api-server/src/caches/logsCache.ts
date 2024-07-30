import type { Log } from '../types/logs';

export const createLogsCache = () => {
    const logs: Log[] = [];

    const addLog = (log: Log) => {
        logs.push(log);
    };

    const getAvg = (): Log => {
        const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

        const requestTime = avg(logs.map((log) => log.request.time));
        const requestSendTime = avg(logs.map((log) => log.request.sendTime));
        const requestPayloadBytes = avg(logs.map((log) => log.request.payloadBytes));
        const requestTimeQueryNode = avg(logs.map((log) => log.request.timeQueryNode));
        const requestTimeQueryEdge = avg(logs.map((log) => log.request.timeQueryEdge));
        const requestTimeLoadEdge = avg(logs.map((log) => log.request.timeLoadEdge));

        const loaderNodes = avg(logs.map((log) => log.loader.nodes));
        const loaderMetadata = avg(logs.map((log) => log.loader.metadata));
        const loaderFiles = avg(logs.map((log) => log.loader.files));

        const graphAssemblerTimeNode = avg(logs.map((log) => log.graphAssembler.timeNode));
        const graphAssemblerTimeMetadata = avg(logs.map((log) => log.graphAssembler.timeMetadata));
        const graphAssemblerTimeJson = avg(logs.map((log) => log.graphAssembler.timeJson));

        return {
            request: {
                time: requestTime,
                sendTime: requestSendTime,
                payloadBytes: requestPayloadBytes,
                timeQueryNode: requestTimeQueryNode,
                timeQueryEdge: requestTimeQueryEdge,
                timeLoadEdge: requestTimeLoadEdge,
            },
            loader: {
                nodes: loaderNodes,
                metadata: loaderMetadata,
                files: loaderFiles,
            },
            graphAssembler: {
                timeNode: graphAssemblerTimeNode,
                timeMetadata: graphAssemblerTimeMetadata,
                timeJson: graphAssemblerTimeJson,
            },
        };
    };

    return {
        addLog,
        getAvg,
    };
};
