import { Edges, ErrorGraph, Files, Graph, Nodes, PushResult, Rights } from '../types/graph';
import { GraphElementResult, GraphError, Metadata, NodeFileView, UploadNodeFileView } from '../types/graphObjects';
import { assocPathMutate, forEachObjDepth, getPathOr, isEmptyObject } from './util';

export const isEmptyGraph = (graph: Graph | ErrorGraph): boolean => {
    if (!graph || isEmptyObject(graph)) return true;

    return (
        isEmptyObject(graph.nodes) &&
        isEmptyObject(graph.edges) &&
        isEmptyObject(graph.rights) &&
        isEmptyObject(graph.files) &&
        isEmptyObject(graph.index)
    );
};

export const selectSuccessAndErrorGraphs = (pushGraph: Graph, pushResult: PushResult): [Graph, ErrorGraph] => {
    const successNodes = {} as Nodes<Node | boolean>;
    const successEdges = {} as Edges<Metadata>;
    const successReverseEdges = {} as Edges<boolean>;
    const successRights = {} as Rights<boolean, string>;
    const successFiles = {} as Files<NodeFileView>;

    const errorNodes = {} as Nodes<GraphError<Node | boolean>>;
    const errorEdges = {} as Edges<GraphError<Metadata>>;
    const errorReverseEdges = {} as Edges<GraphError<boolean>>;
    const errorRights = {} as Rights<GraphError<boolean>, GraphError<string>>;
    const errorFiles = {} as Files<GraphError<UploadNodeFileView>>;

    forEachObjDepth(
        pushResult.nodes,
        (res: GraphElementResult, path: string[]) => {
            const node = getPathOr(undefined, path, pushGraph.nodes);
            if (res.statusCode === 200) {
                assocPathMutate(path, node, successNodes);
            } else {
                assocPathMutate(path, { ...res, element: node }, errorNodes);
            }
        },
        1,
    );
    forEachObjDepth(
        pushResult.edges,
        (res: GraphElementResult, path: string[]) => {
            const metedata = getPathOr(undefined, path, pushGraph.edges);
            const [fromType, fromId, toType, toId] = path;
            if (res.statusCode === 200) {
                assocPathMutate(path, metedata, successEdges);
                assocPathMutate([toType, toId, fromType, fromId], true, successReverseEdges);
            } else {
                assocPathMutate(path, { ...res, element: metedata }, errorEdges);
                assocPathMutate([toType, toId, fromType, fromId], { ...res, element: true }, errorReverseEdges);
            }
        },
        4,
    );

    forEachObjDepth(
        pushResult.rights,
        (res: GraphElementResult, path: string[]) => {
            const obj = getPathOr(undefined, path, pushGraph.rights);
            if (path[1] === 'inherit') {
                if (res.statusCode === 200) {
                    assocPathMutate(path, obj, successRights);
                } else {
                    assocPathMutate(path, { ...res, element: obj }, errorRights);
                }
            } else {
                forEachObjDepth(
                    res,
                    (rightRes: GraphElementResult, p: string[]) => {
                        const rightPath = [...path, ...p];
                        const right = getPathOr(undefined, rightPath, pushGraph.rights);
                        if (rightRes.statusCode === 200) {
                            assocPathMutate(rightPath, right, successRights);
                        } else {
                            assocPathMutate(rightPath, { ...rightRes, element: right }, errorRights);
                        }
                    },
                    2,
                );
            }
        },
        2,
    );

    forEachObjDepth(
        pushResult.files,
        (res: GraphElementResult, path: string[]) => {
            const file = getPathOr(undefined, path, pushGraph.files);
            if (res.statusCode === 200) {
                assocPathMutate(path, file, successFiles);
            } else {
                assocPathMutate(path, { ...res, element: file }, errorFiles);
            }
        },
        2,
    );

    const successGraph = {} as Graph;
    if (!isEmptyObject(successNodes)) {
        successGraph.nodes = successNodes;
    }

    if (!isEmptyObject(successEdges)) {
        successGraph.edges = successEdges;
    }

    if (!isEmptyObject(successReverseEdges)) {
        successGraph.index = { reverseEdges: successReverseEdges };
    }

    if (!isEmptyObject(successRights)) {
        successGraph.rights = successRights;
    }

    if (!isEmptyObject(successFiles)) {
        successGraph.files = successFiles;
    }

    const errorGraph = {} as ErrorGraph;
    if (!isEmptyObject(errorNodes)) {
        errorGraph.nodes = errorNodes;
    }

    if (!isEmptyObject(errorEdges)) {
        errorGraph.edges = errorEdges;
    }

    if (!isEmptyObject(errorReverseEdges)) {
        errorGraph.index = { reverseEdges: errorReverseEdges };
    }

    if (!isEmptyObject(errorRights)) {
        errorGraph.rights = errorRights;
    }

    if (!isEmptyObject(errorFiles)) {
        errorGraph.files = errorFiles;
    }

    return [successGraph, errorGraph];
};

export const selectDeleteGraph = (graph: Graph): Graph => {
    const nodes = {} as { [nodeId: string]: undefined };
    const edges = {} as Edges<undefined>;
    const rights = {} as { [nodeId: string]: undefined };
    const files = {} as { [nodeId: string]: undefined };
    const reverseEdges = {} as Edges<undefined>;

    forEachObjDepth(
        graph.nodes,
        (_, path: string[]) => {
            assocPathMutate(path, undefined, nodes);
        },
        1,
    );
    forEachObjDepth(
        graph.edges,
        (_, path: string[]) => {
            assocPathMutate(path, undefined, edges);
        },
        4,
    );
    forEachObjDepth(
        graph.rights,
        (_, path: string[]) => {
            assocPathMutate(path, undefined, rights);
        },
        1,
    );
    forEachObjDepth(
        graph.files,
        (_, path: string[]) => {
            assocPathMutate(path, undefined, files);
        },
        1,
    );
    forEachObjDepth(
        graph.index?.reverseEdges,
        (_, path: string[]) => {
            assocPathMutate(path, undefined, reverseEdges);
        },
        4,
    );

    const res = {} as Graph;
    if (!isEmptyObject(nodes)) {
        res.nodes = nodes;
    }

    if (!isEmptyObject(edges)) {
        res.edges = edges;
    }

    if (!isEmptyObject(rights)) {
        res.rights = rights;
    }

    if (!isEmptyObject(files)) {
        res.files = files;
    }

    if (!isEmptyObject(reverseEdges)) {
        res.index = { reverseEdges };
    }

    return res;
};
