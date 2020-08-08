import { connectElementToHost } from './core/connectElementToHost';
import { createActualElement } from './core/createActualElement';
import { mergeTreeChanges } from './core/mergeTreeChanges';
import { mapChildToElement } from './core/mapChildToElement';
const cache = Symbol('cache');
export class Fragment extends DocumentFragment {
    render(children) {
        return children;
    }
    remove() {
        for (const element of this[cache])
            if (element?.node) {
                element.node.parentNode?.removeChild(element.node);
            }
    }
    update(children) {
        const tree = this.render(children).map(mapChildToElement);
        /**
         * If first time render, just save new tree
         * Otherwise diff tree recursively
         */
        if (!this[cache]) {
            this[cache] = tree;
        }
        else {
            this[cache] = mergeTreeChanges(this[cache], tree);
        }
        /**
         * Wire up any new component elements with DOM elements
         */
        for (const element of this[cache])
            if (element) {
                if (!element.node) {
                    element.node = createActualElement(element);
                }
                connectElementToHost(element, this);
            }
    }
}
(function (Fragment) {
    Fragment.Factory = () => { };
    function isFragment(node) {
        return node instanceof Fragment;
    }
    Fragment.isFragment = isFragment;
})(Fragment || (Fragment = {}));
//# sourceMappingURL=Fragment.js.map