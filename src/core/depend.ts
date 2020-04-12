import { Component, context } from '../Component';

/**
 * Traverses up the DOM tree to find context which a component may depend on.
 * @param root Node from where to search.
 * @param key Key used to retrieve object from context.
 */
export function depend(root: Node, key: unknown): unknown {

    console.log(root);

    /**
     * If we reach the top, return undefined.
     */
    if (!root || !root.parentNode) {
        return;
    }

    /**
     * If parent is a component, check the context.
     */
    if (root.parentNode instanceof Component) {

        /**
         * Go up a level if parent's context does not contain key.
         */
        if (!root.parentNode[ context ].has(key)) {
            return depend(root.parentNode, key);
        }

        return root.parentNode[ context ].get(key);
    }

    /**
     * Go up a level.
     */
    return depend(root.parentNode, key);
}