import { Element } from '../interfaces/Element';
import { Properties } from '../interfaces/Properties';
export declare function render<Constructor extends HTMLElement | SVGElement>(constructor: {
    new (): Constructor;
}, properties?: Properties<Constructor>, ...children: Element[]): Element<Constructor>;
