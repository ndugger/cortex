"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createElement = void 0;
const Component_1 = require("../Component");
const Fragment_1 = require("../Fragment");
const mapChildToElement_1 = require("./mapChildToElement");
function createElement(constructor, properties, ...children) {
    /**
     * If rendering a functional component, return a fragment with the children
     * being included with the props
     */
    if (Component_1.Component.isFn(constructor)) {
        return createElement(
            Fragment_1.Fragment,
            { template: { constructor, properties } },
            ...children
        );
    }
    return {
        children: children.flat().map(mapChildToElement_1.mapChildToElement),
        constructor,
        defaults: {},
        properties,
    };
}
exports.createElement = createElement;
//# sourceMappingURL=createElement.js.map
