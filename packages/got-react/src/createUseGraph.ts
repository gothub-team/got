/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    decideStack,
    type CreateGraph,
    type Metadata,
    type Node,
    type NodeFileView,
    type NodeFilesView,
    type NodeRightsView,
    type State,
    type View,
} from '@gothub/got-core';
import equals from 'fast-deep-equal';
import { useCallback, useMemo, useRef } from 'react';
import { useEqualRef } from './util';
import type { ViewResult } from '@gothub/got-core/dist/module/types/ViewResult';

let fnEquals = equals;
export const setFnEquals = (fn: (a: unknown, b: unknown) => boolean) => {
    fnEquals = fn;
};

type EqualsObj<TRes> = {
    requireEqCheck: boolean;
    result: TRes;
};

const useViewEquality = (next: EqualsObj<any>, prev: EqualsObj<any>) =>
    next.requireEqCheck ? fnEquals(next.result, prev.result) : true;

type ConfigureGraphOptions = {
    createGraph: CreateGraph;
    useSelector: <TRes>(fnSelect: (state: State) => TRes, fnEquals: (next: any, prev: any) => boolean) => TRes;
};

type Refs = {
    selectView?: (state: State) => any;
    selectViewResult?: any;
    fnTransform?: (viewRes: any) => any;
    fnTransformResult?: any;
};

export const configureUseGraph =
    ({ createGraph, useSelector }: ConfigureGraphOptions) =>
    (...stack: string[] | string[1][]) => {
        const _stack = decideStack(stack);

        const graphFns = useMemo(() => createGraph(..._stack), [...stack]); // TODO: get rid of stack spreading

        const useView = <TView extends View, TRes>(view: TView, fnTransform?: (viewRes: ViewResult<TView>) => TRes) => {
            const _view = useEqualRef<View>(view);

            const refs = useRef<Refs>();
            const refsObj = refs.current || {};
            refs.current = refsObj;

            // creating new function here instead of using currying to make function calls testable
            const selectView = useCallback((state: State) => graphFns.selectView(_view, state), [_view]);

            const selector = useCallback(
                (state: State): EqualsObj<unknown> => {
                    const selectViewUpdated = !equals(refsObj.selectView, selectView);
                    if (selectViewUpdated) refsObj.selectView = selectView;

                    const fnTransformUpdated = !equals(refsObj.fnTransform, fnTransform);
                    if (fnTransformUpdated) refsObj.fnTransform = fnTransform;

                    // if unchanged, return the last result
                    if (!selectViewUpdated && !fnTransformUpdated) {
                        return {
                            requireEqCheck: false,
                            result: refsObj.fnTransformResult,
                        };
                    }

                    if (selectViewUpdated) {
                        refsObj.selectViewResult = selectView(state);
                    }

                    refsObj.fnTransformResult = fnTransform
                        ? fnTransform(refsObj.selectViewResult)
                        : refsObj.selectViewResult;

                    return {
                        requireEqCheck: true,
                        result: refsObj.fnTransformResult,
                    };
                },
                [selectView, fnTransform],
            );

            const { result } = useSelector(selector, useViewEquality);

            if (fnTransform) {
                return result as TRes;
            } else {
                return result as ViewResult<TView>;
            }
        };

        const useNode = <TRes>(nodeId: string, fnTransform: (node: Node | undefined) => TRes) => {
            const selector = useCallback(
                (state: State) => {
                    const res = graphFns.selectNode(nodeId, state);
                    let node: Node | undefined;

                    if (typeof res === 'object') {
                        node = res;
                    } else if (res === true) {
                        node = { id: nodeId };
                    } else if (res === false) {
                        node = undefined;
                    }

                    if (fnTransform) {
                        return fnTransform(node);
                    }
                    return node;
                },
                [stack, nodeId, fnTransform],
            );

            return useSelector(selector, fnEquals);
        };

        const useEdge = <TRes>(
            edgeTypes: string,
            fromId: string,
            fnTransform?: (edge: Record<string, Metadata>) => TRes,
        ) => {
            const selector = useCallback(
                (state: State) => {
                    const res = graphFns.selectEdge(edgeTypes, fromId, state);
                    if (fnTransform) {
                        return fnTransform(res);
                    }
                    return res;
                },
                [stack, edgeTypes, fromId, fnTransform],
            );

            return useSelector(selector, fnEquals);
        };

        const useMetadata = <TRes>(
            edgeTypes: string,
            fromId: string,
            toId: string,
            fnTransform?: (metadata: Metadata | undefined) => TRes,
        ) => {
            const selector = useCallback(
                (state: State) => {
                    const res = graphFns.selectMetadata(edgeTypes, fromId, toId, state);
                    if (fnTransform) {
                        return fnTransform(res);
                    }
                    return res;
                },
                [stack, fromId, toId, fnTransform],
            );

            return useSelector(selector, fnEquals);
        };

        const useRights = <TRes>(nodeId: string, fnTransform?: (rights: NodeRightsView) => TRes) => {
            const selector = useCallback(
                (state: State) => {
                    const res = graphFns.selectRights(nodeId, state);
                    if (fnTransform) {
                        return fnTransform(res);
                    }
                    return res;
                },
                [stack, nodeId, fnTransform],
            );

            return useSelector(selector, fnEquals);
        };

        const useFiles = <TRes>(nodeId: string, fnTransform?: (files: NodeFilesView<NodeFileView>) => TRes) => {
            const selector = useCallback(
                (state: State) => {
                    const res = graphFns.selectFiles(nodeId, state);
                    if (fnTransform) {
                        return fnTransform(res);
                    }
                    return res;
                },
                [stack, nodeId, fnTransform],
            );

            return useSelector(selector, fnEquals);
        };

        return {
            ...graphFns,
            useView,
            useNode,
            useEdge,
            useMetadata,
            useRights,
            useFiles,
        };
    };
