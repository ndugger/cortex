import { Component } from '../Component'
import { Element } from '../Element'
import { Fragment } from '../Fragment'
import { Portal } from '../Portal'

import { mapChildToElement } from './mapChildToElement'

/**
 * Constructs a library element
 * @param type Element type (Either a class which extends Node, or a functional component)
 * @param properties Properties to apply or provide
 * @param children Child elements
 */
export function createElement<Constructor extends Node>(constructor: Component.Constructor<Constructor>, props?: Element.TypedProperties<Constructor>, ...children: Element.Child[]): Element<Constructor>
export function createElement<Props extends object>(constructor: Component.Fn<Props>, props?: Props, ...children: Element.Child[]): Element<Fragment>
export function createElement<Props>(constructor: Component.Any<Props>, props: Props, ...children: Element.Child[]): Element<Node> {

    if (constructor as any === Portal.Reflection) {
        console.warn(constructor)
    }
    
    /**
     * If rendering a functional component, return a fragment with the children being included with the props
     */
    if (Component.isFn(constructor)) {
        return createElement(Fragment, undefined, ...constructor({ ...props, children }))
    }

    return {
        children: children.flat().map(mapChildToElement),
        constructor,
        defaults: {},
        properties: props
    }
}
