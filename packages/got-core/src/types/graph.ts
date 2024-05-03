import {
    GraphElementResult,
    GraphError,
    Metadata,
    NodeFileView,
    UploadElementResult,
    UploadNodeFileView,
} from './graphObjects';

export declare type Nodes<TNode> = {
    [nodeId: string]: TNode;
};

export declare type Edges<TEdge> = {
    [fromType: string]: {
        [fromId: string]: {
            [toType: string]: {
                [toId: string]: TEdge;
            };
        };
    };
};

export declare type Rights<TRight, TInheritRights> = {
    [nodeId: string]: {
        user?: {
            [email: string]: {
                read?: TRight;
                write?: TRight;
                admin?: TRight;
            };
        };
        roles?: {
            [name: string]: {
                read?: TRight;
                write?: TRight;
                admin?: TRight;
            };
        };
        inherit?: {
            from: TInheritRights;
        };
    };
};

export declare type NodeFilesView<TFile> = Record<string, TFile>;

export declare type Files<TFile> = {
    [nodeId: string]: NodeFilesView<TFile>;
};

export declare interface GraphLayer<TNode, TEdge, TReverseEdge, TRight, TInheritRights, TFile> {
    nodes?: Nodes<TNode>;
    edges?: Edges<TEdge>;
    index?: {
        reverseEdges?: Edges<TReverseEdge>;
    };
    rights?: Rights<TRight, TInheritRights>;
    files?: Files<TFile>;
}

export declare type PushBody = Omit<
    GraphLayer<Node | boolean, Metadata, never, boolean, string, UploadNodeFileView>,
    'index'
>;

export declare type PushResult = Omit<
    GraphLayer<
        GraphElementResult,
        GraphElementResult,
        never,
        GraphElementResult,
        GraphElementResult,
        UploadElementResult
    >,
    'index'
>;

export declare type ErrorGraph = GraphLayer<
    GraphError<Node | boolean>,
    GraphError<Metadata>,
    GraphError<boolean>,
    GraphError<boolean>,
    GraphError<string>,
    GraphError<UploadNodeFileView>
>;

export declare type Graph = GraphLayer<Node | boolean, Metadata, boolean, boolean, string, NodeFileView>;
