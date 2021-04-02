"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findParentContext = void 0;
const Component_1 = require("../Component");
/**
 * Traverses up the DOM tree to find context which a component may depend on
 * @param root Node from where to search
 * @param key Key used to retrieve object from context
 */
function findParentContext(root, key) {
    var _a;
    /**
     * If we reach the top, return undefined
     */
    if (!root) {
        if (root.shadowRoot.querySelector(`.${key.name}`)) {
            console.log(243856723458762345876);
        }
        return;
    }
    /**
     * If context found, return
     */
    if (root instanceof Component_1.Component.Context && root.constructor === key) {
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
    return findParentContext((_a = root.parentNode) !== null && _a !== void 0 ? _a : undefined, key);
}
exports.findParentContext = findParentContext;
