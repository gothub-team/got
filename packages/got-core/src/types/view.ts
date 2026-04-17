export declare const nodeTypeBrand: unique symbol;

export declare type View = Record<string, NodeView>;
export declare type EdgesView = Record<string, EdgeView>;

export declare type NodeInclude = {
    /**
     * Whether or not the body of the root node should be included.
     */
    node?: boolean;
    /**
     * Whether or not all rights of the parent node should be included. Only
     * returns rights if the currrent user has admin rights on the parent node.
     */
    rights?: boolean;
    /**
     * Whether or not all files attached to the parent node should be included.
     */
    files?: boolean;
    /**
     * Explicitly forbidden on top level
     */
    edges?: never;
    /**
     * Explicitly forbidden on top level
     */
    metadata?: never;
};

export declare interface NodeView {
    /**
     * Defines an optional alias for the node view
     */
    as?: string;
    /**
     * Defines an optional role to pull the view as.
     * Any '$NODEID' in the role name will be replaced by the nodeId.
     */
    role?: string;
    /**
     * Options defining which elements of the parent node should be included in the
     * result view tree.
     */
    include?: NodeInclude;
    /**
     * Hashmap of edge types that are pointing from the parent node.
     */
    edges?: EdgesView;
}

export declare type EdgeInclude = {
    /**
     * Whether or not the body of the node the parent edge is pointing to should be included.
     */
    node?: boolean;
    /**
     * Whether or not the parent edge to should be included.
     */
    edges?: boolean;
    /**
     * Whether or not metadata of the parent edge should be included.
     */
    metadata?: boolean;
    /**
     * Whether or not all rights of the node the parent edge is pointing
     * to should be included. Only returns rights if the currrent user has admin
     * rights on the node.
     */
    rights?: boolean;
    /**
     * Whether or not all files attached to the node the parent edge is pointing
     * to should be included.
     */
    files?: boolean;
};
export declare interface EdgeView {
    /**
     * Defines an optional alias for the edge view
     */
    as?: string;
    /**
     * Defines an optional role to pull the view as.
     * Any '$NODEID' in the role name will be replaced by the toIds of the edge.
     */
    role?: string;
    /**
     * Defines if the edge should be read out in reverse.
     */
    reverse?: boolean;
    /**
     * Options defining which elements of the node the parent edge is pointing to
     * should be included in the result view tree.
     */
    include?: EdgeInclude;
    /**
     * Hashmap of edge types that are pointing from all nodes the parent edge is
     * pointing to.
     */
    edges?: EdgesView;
}

/**
 * Brands `include: { node: ... }` with an entity type so the node body is typed
 * as `Node<TNode>` in the `ViewResult` instead of the default `Node`. Returns
 * `true` at runtime — the brand is a phantom, compile-time only.
 */
export const includeNode = <TNode extends Record<string, unknown>>(): true & {
    readonly [nodeTypeBrand]?: TNode;
} => true as true & { readonly [nodeTypeBrand]?: TNode };

/**
 * Brands `include: { metadata: ... }` with a metadata shape so the resulting
 * `metadata` field is typed as `Metadata<TMeta>` instead of `Metadata`. Returns
 * `true` at runtime.
 */
export const includeMetadata = <TMeta extends Record<string, unknown>>(): true & {
    readonly [nodeTypeBrand]?: TMeta;
} => true as true & { readonly [nodeTypeBrand]?: TMeta };
