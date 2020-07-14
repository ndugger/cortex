import { connect } from './core/connect';
import { create } from './core/create';
import { diff } from './core/diff';
import { childToElement } from './util/childToElement';
const template = Symbol('template');
export class Fragment extends DocumentFragment {
    render(children) {
        return children;
    }
    remove() {
        for (const element of this[template])
            if (element?.node) {
                element.node.parentNode?.removeChild(element.node);
            }
    }
    update(children) {
        const tree = this.render(children).map(childToElement);
        /**
         * If first time render, just save new tree
         * Otherwise diff tree recursively
         */
        if (!this[template]) {
            this[template] = tree;
        }
        else {
            this[template] = diff(this[template], tree);
        }
        /**
         * Wire up any new component elements with DOM elements
         */
        for (const element of this[template])
            if (element) {
                if (!element.node) {
                    element.node = create(element);
                }
                connect(element, this);
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