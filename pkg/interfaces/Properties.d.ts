import { Component } from '../Component';
declare type ElementMinusAttributes = Partial<Pick<Element, Exclude<keyof Element, 'attributes'>>>;
declare type TypedProperties<Constructor extends Node> = Constructor extends Component ? ElementMinusAttributes & {
    [Key in keyof Constructor]: Constructor[Key];
} : Constructor extends HTMLElement ? Partial<Constructor> : Constructor extends SVGElement ? {
    [Key in keyof Constructor]?: string;
} : Partial<Constructor>;
export declare type Properties<Constructor extends Node = Node> = TypedProperties<Constructor> & {
    attributes?: {
        [K: string]: any;
    };
    namespaces?: {
        [K: string]: string;
    };
    tag?: string;
};
export {};
