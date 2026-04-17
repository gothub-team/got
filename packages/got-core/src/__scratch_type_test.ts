import { nodeView, edgeView } from './types/view';
import type { ViewResult } from './types/ViewResult';

type Contract = { contractNumber: string; startDate: string };
type Position = { amount: number; label: string };

const view = {
    'contract-1': nodeView<Contract>()({
        include: { node: true },
        edges: {
            'contract/positions': edgeView<Position>()({
                as: 'positions',
                include: { node: true, metadata: true },
            }),
        },
    }),
};

type Result = ViewResult<typeof view>;

declare const result: Result;

const contractId: string = result['contract-1'].nodeId;
const contractNumber: string = result['contract-1'].node.contractNumber;
const contractStart: string = result['contract-1'].node.startDate;

const positionsMap = result['contract-1'].positions;
const somePosition = positionsMap['pos-1'];
const positionAmount: number = somePosition.node.amount;
const positionLabel: string = somePosition.node.label;

const legacyView = {
    'contract-1': {
        include: { node: true },
        edges: {
            'contract/positions': {
                include: { node: true },
            },
        },
    },
};
type LegacyResult = ViewResult<typeof legacyView>;
declare const legacy: LegacyResult;
const legacyId: string = legacy['contract-1'].nodeId;

export { contractId, contractNumber, contractStart, positionAmount, positionLabel, legacyId };

// Negative check: this MUST fail to prove the types are actually narrowed
// @ts-expect-error - contract.node does not have an `amount` field
const shouldFail: number = result['contract-1'].node.amount;
// @ts-expect-error - position.node does not have a `contractNumber` field
const shouldFail2: string = somePosition.node.contractNumber;
export { shouldFail, shouldFail2 };
