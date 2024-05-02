import { Graph } from './graph.types';
import { assocPathMutate, forEachObjDepth, getPathOr, mergeDeepRight, mergeGraphObjRight } from './util';

export const isEdgeTypeString = (edgeTypes: string) => {
    const [fromType, toType] = edgeTypes.split('/');
    return fromType && toType && fromType.length > 0 && toType.length > 0;
};

const mergeObjRight =
    <TMerge>(depth: number, fnMergeRight: (l: TMerge, r: TMerge) => TMerge) =>
    <TInput extends object>(left?: TInput, right?: TInput): TInput | undefined => {
        if (!right) return left;

        let result: TInput = left ?? ({} as TInput);
        forEachObjDepth(
            right,
            (valRight: TMerge, path: string[]) => {
                // console.log(valRight, path);
                if (typeof valRight === 'undefined') {
                    assocPathMutate(path, undefined, result);
                } else {
                    const valLeft = getPathOr(undefined, path, left);
                    const merged = fnMergeRight(valLeft, valRight);

                    assocPathMutate(path, merged, result);
                }
            },
            depth,
        );

        return result;
    };

const mergeNodesRight = mergeObjRight(1, mergeGraphObjRight);
const mergeEdgesRight = mergeObjRight(4, mergeGraphObjRight);
const mergeRightsRight = mergeObjRight(1, mergeDeepRight);
const mergeFilesRight = mergeObjRight(1, mergeGraphObjRight);
const mergeIndexRight = mergeObjRight(1, mergeDeepRight);

export const mergeGraphsRight = (left: Graph, right: Graph): Graph => {
    if (!right) return left;
    if (!left) return right;

    let result = left;

    const nodes = mergeNodesRight(left?.nodes, right?.nodes);
    if (nodes) {
        result.nodes = nodes;
    }

    const edges = mergeEdgesRight(left?.edges, right?.edges);
    if (edges) {
        result.edges = edges;
    }

    const rights = mergeRightsRight(left?.rights, right?.rights);
    if (rights) {
        result.rights = rights;
    }

    const files = mergeFilesRight(left?.files, right?.files);
    if (files) {
        result.files = files;
    }

    const index = mergeIndexRight(left?.index, right?.index);
    if (index) {
        result.index = index;
    }

    return result;
};
