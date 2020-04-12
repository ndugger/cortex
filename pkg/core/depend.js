import { Component, context } from '../Component';
export function depend(root, key) {
    console.log(root);
    if (!root || !root.parentNode) {
        return;
    }
    if (root.parentNode instanceof Component) {
        if (!root.parentNode[context].has(key)) {
            return depend(root.parentNode, key);
        }
        return root.parentNode[context].get(key);
    }
    return depend(root.parentNode, key);
}
//# sourceMappingURL=depend.js.map