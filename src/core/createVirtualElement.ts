import { Component } from '../Component'
import { Element } from '../Element'
import { Fragment } from '../Fragment'

import { mapChildToElement } from './mapChildToElement'

/**
 * Constructs a library element
 * @param type Element type (Either a class which extends Node, or a functional component)
 * @param properties Properties to apply or provide
 * @param children Child elements
 */
export function createVirtualElement<Constructor extends Node>(constructor: Component.Constructor<Constructor>, props?: Element.TypedProperties<Constructor>, ...children: Element.Child[]): Element<Constructor>
export function createVirtualElement<Props extends object>(constructor: Component.Fn<Props>, props?: Props, ...children: Element.Child[]): Element<Fragment>
export function createVirtualElement<Props>(constructor: Component.Any<Props>, props: Props, ...children: Element.Child[]): Element<Node> {
    
    /**
     * If rendering a functional component, return a fragment with the children being included with the props
     */
    if (Component.isFn(constructor)) {
        return createVirtualElement(Fragment, { template: constructor }, ...children)
    }

    return {
        children: children.flat().map(mapChildToElement),
        constructor,
        defaults: {},
        properties: props
    }
}
