import { Component } from './Component'
import { Fragment } from './Fragment'

/**
 * Represents a virtual library element
 */
export interface Element<Props extends object = Node> {

    /**
     * Child elements
     */
    children: Element.Child[]
    
    /**
     * Component constructor
     */
    constructor: Component.Any<Props>

    /**
     * Default property values
     */
    default: {
        [ key: string ]: unknown
    }

    /**
     * Active DOM node
     */
    node?: Node

    /**
     * Incoming property values
     */
    properties?: Props extends Node ? Element.Properties<Props> : Props
}

export namespace Element {

    export type Child = Element | number | string

    export type MinusAttributes<Constructor extends Node> = 
        Partial<Pick<Element<Constructor>, Exclude<keyof Element<Constructor>, 'attributes'>>>

    export type TypedProperties<Constructor extends Node> = BaseProperties &
        Constructor extends Component ?
            MinusAttributes<Constructor> & { [ Key in keyof Constructor ]: Constructor[ Key ] } :
        Constructor extends Fragment ?
            Partial<Constructor> :
        Constructor extends HTMLElement ?
            Partial<Constructor> :
        Constructor extends SVGElement ?
            { [ Key in keyof Constructor ]?: string } :
        Partial<Constructor>

    export type BaseProperties = {
        attributes?: {
            [ K: string ]: any
        }
        namespaces?: {
            [ K: string ]: string
        }
        tag?: string
    }

    export type Constructor<Type extends Node> = { new(): Type, prototype: Type }
    export type Properties<Type extends Node> = TypedProperties<Type>
}

/**
 * Enable JSX support
 */
declare global {

    interface Element {
        JSX_PROPERTY_TYPES_DO_NOT_USE: Element.Properties<Node> & {
            [ Key in keyof this ]?: this[ Key ] extends object ? Partial<this[ Key ]> : this[ Key ]
        }
    }

    namespace JSX {

        interface IntrinsicElements {}

        interface ElementAttributesProperty {
            JSX_PROPERTY_TYPES_DO_NOT_USE: typeof Element.prototype.JSX_PROPERTY_TYPES_DO_NOT_USE
        }
    }
}
