import { Context } from '../Context';
/**
 * Traverses up the DOM tree to find context which a component may depend on
 * @param root Node from where to search
 * @param key Key used to retrieve object from context
 */
export function findParentContext(root, key) {
    /**
     * If we reach the top, return undefined
     */
    if (!root) {
        return;
    }
    /**
     * If context found, return
     */
    if (root instanceof Context && root.constructor === key) {
        return root;
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
//# sourceMappingURL=findParentContext.js.map