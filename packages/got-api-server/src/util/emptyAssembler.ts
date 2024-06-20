import { type GraphAssembler } from '../types/graphAssembler';
import type { GraphAssemblerLog } from '../types/logs';

export const emptyAssembler = (): GraphAssembler => {
    const writeNode = () => {};

    const writeMetadata = () => {};

    const writeEdgeReverse = () => {};

    const writeRights = () => {};

    const writeFiles = () => {};

    const getGraphJson = () => '';

    const getLog: () => GraphAssemblerLog = () => {
        return {
            timeNode: 0,
            timeMetadata: 0,
            timeJson: 0,
        };
    };

    return {
        writeNode,
        writeMetadata,
        writeEdgeReverse,
        writeRights,
        writeFiles,
        getGraphJson,
        getLog,
    };
};
