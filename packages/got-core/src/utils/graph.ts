import { Edges, ErrorGraph, Files, Graph, Nodes, PushResult, Rights } from '../types/graph';
import { GraphElementResult, GraphError, Metadata, NodeFileView, UploadNodeFileView } from '../types/graphObjects';
import { assocPathMutate, forEachObjDepth, getPathOr } from './util';

export const isEdgeTypeString = (edgeTypes: string) => {
    const [fromType, toType] = edgeTypes.split('/');
    return fromType && toType && fromType.length > 0 && toType.length > 0;
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
