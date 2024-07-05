import { GraphAssemblerLog } from './logs';

export type GraphAssembler = {
    writeNode: (id: string, data: string) => void;
    writeMetadata: (fromId: string, fromType: string, toType: string, toId: string, data: string) => void;
    writeEdgeReverse: (fromId: string, fromType: string, toType: string, toId: string) => void;
    writeRights: (id: string, data: object | string) => void;
    writeRightsAtomic: (id: string, principalType: string, principal: string, rightType: string, data: string) => void;
    writeFiles: (id: string, prop: string, data: string) => void;
    getGraphJson: () => string;
    getLog: () => GraphAssemblerLog;
};
