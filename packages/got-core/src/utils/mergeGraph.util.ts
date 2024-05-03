import { Graph } from '../types/graph';
import {
    assocPathMutate,
    dissocPathMutate,
    forEachObjDepth,
    getPathOr,
    mergeDeepRight,
    mergeGraphObjRight,
} from '../util';

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

const overwriteObjRight =
    (depth: number) =>
    <TInput extends object>(left?: TInput, right?: TInput): TInput | undefined => {
        if (!right) return left;

        let result: TInput = left ?? ({} as TInput);
        forEachObjDepth(
            right,
            (valRight, path) => {
                if (typeof valRight === 'undefined') {
                    dissocPathMutate(path, result);
                    return;
                }

                if (valRight === false || typeof valRight === 'object') {
                    assocPathMutate(path, valRight, result);
                    return;
                }

                const valLeft = getPathOr(undefined, path, left);
                if (!(valRight === true && typeof valLeft === 'object')) {
                    assocPathMutate(path, valRight, result);
                    return;
                }

                assocPathMutate(path, valLeft, result);
            },
            depth,
        );

        return result;
    };

const overwriteNodesRight = overwriteObjRight(1);
const overwriteEdgesRight = overwriteObjRight(4);
const overwriteRightsRight = overwriteObjRight(1);
const overwriteFilesRight = overwriteObjRight(1);
const overwriteIndexRight = overwriteObjRight(5);

export const mergeOverwriteGraphsRight = (left: Graph, right: Graph) => {
    if (!right) return left;
    if (!left) return right;

    let result = left;

    const nodes = overwriteNodesRight(left?.nodes, right?.nodes);
    if (nodes) {
        result.nodes = nodes;
    }

    const edges = overwriteEdgesRight(left?.edges, right?.edges);
    if (edges) {
        result.edges = edges;
    }

    const rights = overwriteRightsRight(left?.rights, right?.rights);
    if (rights) {
        result.rights = rights;
    }

    const files = overwriteFilesRight(left?.files, right?.files);
    if (files) {
        result.files = files;
    }

    const index = overwriteIndexRight(left?.index, right?.index);
    if (index) {
        result.index = index;
    }
    return result;
};
