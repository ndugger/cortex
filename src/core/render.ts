import { Component } from '../Component'
import { Element } from '../Element'
import { Fragment } from '../Fragment'

/**
 * Constructs a library element
 * @param type Element type (Either a class which extends Node, or a functional component)
 * @param properties Properties to apply or provide
 * @param children Child elements
 */
export function render<Constructor extends Node>(constructor: Component.Constructor<Constructor>, props?: Element.TypedProperties<Constructor>, ...children: Element.Child[]): Element<Constructor>
export function render<Props extends object>(constructor: Component.Fn<Props>, props?: Props, ...children: Element.Child[]): Element<Fragment>
export function render<Props extends undefined>(constructor: Component.Any<Props>, props?: Props, ...children: Element.Child[]): Element<Node> {

    /**
     * If rendering a functional component, return a fragment with the children being the output from the function
     */
    if (Component.isFn(constructor)) {
        return render(Fragment, undefined, ...constructor(Object.assign(props ?? {} as Partial<Props>, { children })))
    }

    return {
        children: children.flat().map(child => {

            /**
             * If attempting to render plain text, convert to Text nodes
             */
            if (typeof child === 'string' || typeof child === 'number') {
                return render(Text, { textContent: child.toString() })
            }

            return child || undefined
        }),
        constructor,
        defaults: {},
        properties: props
    }
}
