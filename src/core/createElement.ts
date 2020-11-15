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
export function createElement<Constructor extends Node>(constructor: Component.Constructor<Constructor>, properties?: Element.TypedProperties<Constructor>, ...children: Element.Child[]): Element<Constructor>
export function createElement<Props extends object>(constructor: Component.Fn<Props>, properties?: Props, ...children: Element.Child[]): Element<Fragment<Props>>
export function createElement<Props extends object>(constructor: Fragment.Constructor<Props>, properties?: Fragment.Props, ...children: Element.Child[]): Element<Fragment<Props>>
export function createElement<Props extends object>(constructor: Component.Any<Props>, properties?: Props, ...children: Element.Child[]): Element<Node> {

    /**
     * If rendering a functional component, return a fragment with the children being included with the props
     */
    if (Component.isFn(constructor)) {
        return createElement(Fragment, { template: { constructor, properties } }, ...children)
    }

    return {
        children: children.flat().map(mapChildToElement),
        constructor,
        defaults: {},
        properties
    }
}
