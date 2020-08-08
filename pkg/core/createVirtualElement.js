import { Component } from '../Component';
import { Fragment } from '../Fragment';
import { mapChildToElement } from './mapChildToElement';
export function createVirtualElement(constructor, props, ...children) {
    /**
     * If rendering a functional component, return a fragment with the children being included with the props
     */
    if (Component.isFn(constructor)) {
        return createVirtualElement(Fragment, { template: constructor }, ...children);
    }
    return {
        children: children.flat().map(mapChildToElement),
        constructor,
        defaults: {},
        properties: props
    };
}
//# sourceMappingURL=createVirtualElement.js.map