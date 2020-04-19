/**
 * Traverses up the DOM tree to find context which a component may depend on.
 * @param root Node from where to search.
 * @param key Key used to retrieve object from context.
 */
export declare function depend(root: Node, key: unknown): unknown;
