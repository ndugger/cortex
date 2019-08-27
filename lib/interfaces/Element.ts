import Properties from './Properties';

export default interface Element<Constructor extends HTMLElement | SVGElement = HTMLElement | SVGElement> {
    children: Element[];
    constructor: {
        new(): Constructor;
    };
    node?: HTMLElement | SVGElement;
    properties: Properties<Constructor>;
}
