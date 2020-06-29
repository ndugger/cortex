import { Component } from './Component';

/**
 * Represents a virtual library element
 */
export interface Element<Constructor extends HTMLElement | SVGElement = HTMLElement | SVGElement> {

    /**
     * Child elements
     */
    children: Element[]
    
    /**
     * Component constructor
     */
    constructor: new() => Constructor

    /**
     * Default property values
     */
    default: {
        [ key: string ]: unknown
    }

    /**
     * Active DOM node
     */
    node?: HTMLElement | SVGElement

    /**
     * Incoming property values
     */
    properties: Element.Properties<Constructor>
}

export namespace Element {

    export  type MinusAttributes = Partial<Pick<Element, Exclude<keyof Element, 'attributes'>>>;

    export  type TypedProperties<Constructor extends Node> =
        Constructor extends Component ?
            MinusAttributes & { [ Key in keyof Constructor ]: Constructor[ Key ] } :
        Constructor extends HTMLElement ?
            Partial<Constructor> :
        Constructor extends SVGElement ?
            { [ Key in keyof Constructor ]?: string } :
        Partial<Constructor>;

    export type Properties<Constructor extends Node = Node> = TypedProperties<Constructor> & {
        attributes?: {
            [ K: string ]: any;
        };
        namespaces?: {
            [ K: string ]: string;
        };
        tag?: string;
    }
}

declare global {

    interface Element {
        JSX_PROPERTY_TYPES_DO_NOT_USE: Element.Properties & {
            [ Key in keyof this ]?: this[ Key ] extends object ? Partial<this[ Key ]> : this[ Key ];
        };
    }

    namespace JSX {

        interface IntrinsicElements {}

        interface ElementAttributesProperty {
            JSX_PROPERTY_TYPES_DO_NOT_USE: typeof Element.prototype.JSX_PROPERTY_TYPES_DO_NOT_USE;
        }
    }
}
