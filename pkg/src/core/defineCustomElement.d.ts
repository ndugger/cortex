import { Component } from '../Component';
export declare const tags: Map<any, string>;
export declare function defineCustomElement<Type extends typeof Component>(tag: string): (type: Type) => Type;
