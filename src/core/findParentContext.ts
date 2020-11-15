import { Component } from '../Component';

/**
 * Traverses up the DOM tree to find context which a component may depend on
 * @param root Node from where to search
 * @param key Key used to retrieve object from context
 */
export function findParentContext<Dependency extends Component.Context>(root: Node | undefined, key: new() => Dependency): Dependency | undefined {

    /**
     * If we reach the top, return undefined
     */
    if (!root) {
        return;
    }

    /**
     * If context found, return
     */
    if (root instanceof Component.Context && root.constructor === key) {
        return root as Dependency;
    }

    /**
     * If we've reached the top of a shadow's tree, try the host next
     */
    if (root instanceof ShadowRoot) {
        return findParentContext(root.host, key);
    }

    /**
     * Go up a level
     */
    return findParentContext(root.parentNode ?? undefined, key);
}
