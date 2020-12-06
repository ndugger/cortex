"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fragment = void 0;
const connectElementToHost_1 = require("./core/connectElementToHost");
const createDocumentNode_1 = require("./core/createDocumentNode");
const mergeTreeChanges_1 = require("./core/mergeTreeChanges");
const mapChildToElement_1 = require("./core/mapChildToElement");
const layout = Symbol('layout');
class Fragment extends DocumentFragment {
    render(children) {
        return children;
    }
    connect(children) {
        let tree;
        if (this.template) {
            tree = this.template.constructor(Object.assign(Object.assign({}, this.template.properties), { children: this.render(children) })).map(mapChildToElement_1.mapChildToElement);
        }
        else {
            tree = this.render(children).map(mapChildToElement_1.mapChildToElement);
        }
        /**
         * If first time render, just save new tree
         * Otherwise diff tree recursively
         */
        if (!this[layout]) {
            this[layout] = tree;
        }
        else {
            this[layout] = mergeTreeChanges_1.mergeTreeChanges(this[layout], tree);
        }
        /**
         * Wire up any new component elements with DOM elements
         */
        for (const element of this[layout])
            if (element) {
                if (!element.node) {
                    element.node = createDocumentNode_1.createDocumentNode(element);
                }
                connectElementToHost_1.connectElementToHost(element, this);
            }
    }
    remove() {
        var _a, _b;
        for (const element of this[layout]) {
            if (Fragment.isFragment(element === null || element === void 0 ? void 0 : element.node)) {
                element === null || element === void 0 ? void 0 : element.node.remove();
            }
            (_b = (_a = element === null || element === void 0 ? void 0 : element.node) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(element === null || element === void 0 ? void 0 : element.node);
        }
    }
}
exports.Fragment = Fragment;
(function (Fragment) {
    function isFragment(node) {
        return node instanceof Fragment;
    }
    Fragment.isFragment = isFragment;
})(Fragment = exports.Fragment || (exports.Fragment = {}));
//# sourceMappingURL=Fragment.js.map