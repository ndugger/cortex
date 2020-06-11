import { Element } from '../interfaces/Element';
import { Properties } from '../interfaces/Properties';

export function render<Constructor extends HTMLElement | SVGElement>(constructor: { new(): Constructor }, properties?: Properties<Constructor>, ...children: Element[]): Element<Constructor> {
    return {
        children: children.flat().map(child => {

            if (typeof child === 'string' || typeof child === 'number') {
                return {
                    constructor: Text,
                    children: [],
                    properties: {
                        textContent: child
                    }
                };
            }

            return child || null;
        }),
        constructor,
        properties
    };
}
