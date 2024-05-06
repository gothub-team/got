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
    const successRights = {} as Rights<boolean, string>;
    const successFiles = {} as Files<NodeFileView>;

    const errorNodes = {} as Nodes<GraphError<Node | boolean>>;
    const errorEdges = {} as Edges<GraphError<Metadata>>;
    const errorRights = {} as Rights<GraphError<boolean>, GraphError<string>>;
    const errorFiles = {} as Files<GraphError<UploadNodeFileView>>;

    forEachObjDepth(
        pushResult.nodes,
        (res: GraphElementResult, path: string[]) => {
            const node = getPathOr(undefined, path, pushGraph);
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
            const metedata = getPathOr(undefined, path, pushGraph);
            if (res.statusCode === 200) {
                assocPathMutate(path, metedata, successEdges);
            } else {
                assocPathMutate(path, { ...res, element: metedata }, errorEdges);
            }
        },
        4,
    );
    forEachObjDepth(
        pushResult.rights,
        (res: GraphElementResult, path: string[]) => {
            const right = getPathOr(undefined, path, pushGraph);
            if (res.statusCode === 200) {
                assocPathMutate(path, right, successRights);
            } else {
                assocPathMutate(path, { ...res, element: right }, errorRights);
            }
        },
        4,
    );
    forEachObjDepth(
        pushResult.files,
        (res: GraphElementResult, path: string[]) => {
            const file = getPathOr(undefined, path, pushGraph);
            if (res.statusCode === 200) {
                assocPathMutate(path, file, successFiles);
            } else {
                assocPathMutate(path, { ...res, element: file }, errorFiles);
            }
        },
        2,
    );

    const successGraph = {
        nodes: successNodes,
        edges: successEdges,
        rights: successRights,
        files: successFiles,
    };

    const errorGraph = {
        nodes: errorNodes,
        edges: errorEdges,
        rights: errorRights,
        files: errorFiles,
    };

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

    const res = {
        nodes: nodes,
        edges: edges,
        rights: rights,
        files: files,
        index: {
            reverseEdges: reverseEdges,
        },
    };

    return res;
};
