import { Component, context } from '../Component';
export function depend(root, key) {
    if (!root || !root.parentNode) {
        return;
    }
    if (root instanceof ShadowRoot) {
        return depend(root.host, key);
    }
    if (root instanceof Component) {
        if (!root[context].has(key)) {
            return depend(root.parentNode, key);
        }
        return root[context].get(key);
    }
    return depend(root.parentNode, key);
}
//# sourceMappingURL=depend.js.map