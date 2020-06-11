import { Component } from '../Component';

type ElementMinusAttributes = Partial<Pick<Element, Exclude<keyof Element, 'attributes'>>>;

type TypedProperties<Constructor extends Node> =
    Constructor extends Component ?
        ElementMinusAttributes & { [ Key in keyof Constructor ]: Constructor[ Key ] } :
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
