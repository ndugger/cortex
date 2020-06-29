import { Element } from '../Element';

export function render<Constructor extends HTMLElement | SVGElement>(constructor: { new(): Constructor }, properties?: Element.Properties<Constructor>, ...children: Element[]): Element<Constructor> {
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
