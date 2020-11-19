import { Component } from '../Component';
import { Element } from '../Element';
declare type Host = Component | HTMLElement | SVGElement | ShadowRoot;
export declare function connectElementToHost<Constructor extends Node>(element: Element<Constructor>, host: Constructor | Host): void;
export {};
