import VirtualElement from '../interfaces/VirtualElement';
import Properties from '../interfaces/Properties';

export default function render<Constructor extends Node>(constructor: { new(): Constructor }, properties: Properties<Constructor>, ...children: VirtualElement[]): VirtualElement<Constructor> {
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
