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
     * Phantom type-only brand used by `nodeView<T>()` to carry the entity type
     * into `ViewResult`. Never set at runtime.
     */
    readonly [nodeTypeBrand]?: Record<string, unknown>;
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
    readonly [nodeTypeBrand]?: Record<string, unknown>;
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
 * Brands a `NodeView` literal with an entity type `TNode` so the node body in
 * the resulting `ViewResult` is typed as `Node<TNode>` instead of `Node`.
 *
 * Curried so the `TNode` type can be supplied explicitly while `V` is still
 * inferred with `const`-preserved literal types (TS cannot do both in a single
 * call when the constraint is a named type).
 *
 * @example
 *   nodeView<Contract>()({ include: { node: true }, edges: { ... } })
 *
 * Plain object views remain valid — this helper is purely additive.
 */
export const nodeView =
    <TNode extends Record<string, unknown> = Record<string, unknown>>() =>
    <const V extends NodeView>(view: V): V & { readonly [nodeTypeBrand]?: TNode } =>
        view as V & { readonly [nodeTypeBrand]?: TNode };

/**
 * Brands an `EdgeView` literal with an entity type `TNode` so the node body of
 * every node reached through this edge is typed as `Node<TNode>`.
 *
 * @example
 *   edgeView<Position>()({ include: { node: true } })
 */
export const edgeView =
    <TNode extends Record<string, unknown> = Record<string, unknown>>() =>
    <const V extends EdgeView>(view: V): V & { readonly [nodeTypeBrand]?: TNode } =>
        view as V & { readonly [nodeTypeBrand]?: TNode };
