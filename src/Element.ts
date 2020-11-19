import { createElement } from './core/createElement'
import { mapComponentToTag } from './core/mapComponentToTag'

import { Component } from './Component'
import { Fragment } from './Fragment'

/**
 * Represents a virtual library element
 */
export interface Element<Props extends Node = Node> {

    /**
     * Child elements
     */
    children: Element.Optional[]
    
    /**
     * Component constructor
     */
    constructor: Component.Constructor<Props>

    /**
     * Default property values
     */
    defaults: {
        [ key: string ]: unknown
    }

    /**
     * Active DOM node
     */
    node?: Props | undefined

    /**
     * Incoming property values
     */
    properties?: Props extends Node ? Element.TypedProperties<Props> : Props
}

export namespace Element {

    /**
     * Used in situations where undefined is inserted to represent an empty branch
     */
    export type Optional = Element | undefined

    /**
     * Allowed child types (numbers and strings are converted into text nodes)
     */
    export type Child<Props extends Node = Node> = Element<Props> | number | string | undefined

    /**
     * Remove existing attributes interface so library can inject a new one
     */
    export type MinusAttributes<Constructor extends Node> = Pick<Constructor, Exclude<keyof Constructor, 'attributes'>>

    /**
     * Extract property types depending on which library, or DOM object is extended
     */
    export type TypedProperties<Constructor extends Node> =
        (Constructor extends Component ?
            Partial<MinusAttributes<Constructor> & { [ Key in keyof Constructor ]?: Constructor[ Key ] }> :
        Constructor extends Fragment ?
            Partial<Constructor> :
        Constructor extends HTMLElement ?
            Partial<MinusAttributes<Constructor>> :
        Constructor extends SVGElement ?
            Partial<{ [ Key in keyof Constructor ]: string }> :
        Constructor extends Node ?
            Partial<Constructor> : 
        unknown) & {
            attributes?: {
                [ K: string ]: any
            }
            namespaces?: {
                [ K: string ]: string
            }
            tag?: string
        }

    export const create = createElement

    /**
     * Determines if constructor is a custom element
     * @param element 
     */
    export function isCustom(element: Element): element is Element<Component> {
        return Boolean(window.customElements.get(mapComponentToTag(element.constructor)))
    }

    /**
     * Determines if constructor is a built-in element type
     * @param constructor 
     */
    export function isNative(element: Element): element is Element<HTMLElement> | Element<SVGElement>  {
        return element.constructor.name in globalThis && element.constructor.name.endsWith('Element')
    }

    /**
     * Determines if constructor is a text node
     * @param element 
     */
    export function isText(element: Element): element is Element<Text> {
        return element.constructor === Text
    }
}

/**
 * Enable JSX support
 */
declare global {

    interface Element {
        JSX_PROPERTY_TYPES_DO_NOT_USE: Element.TypedProperties<Node> & {
            [ key in keyof this ]?: this[ key ] extends object ? Partial<this[ key ]> : this[ key ]
        }
    }

    interface Text {
        JSX_PROPERTY_TYPES_DO_NOT_USE: Element.TypedProperties<Text> 
    }

    namespace JSX {

        /**
         * Intrinsic elements are not supported: use the class instead (ex: HTMLDivElement)
         */
        interface IntrinsicElements {
            [key: string]: never
        }

        interface ElementAttributesProperty {
            JSX_PROPERTY_TYPES_DO_NOT_USE: typeof Element.prototype.JSX_PROPERTY_TYPES_DO_NOT_USE
        }
    }
}
