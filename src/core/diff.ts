import { Element } from '../interfaces/Element';

export function diff(existing: Element[], incoming: Element[]): Element[] {

    if (existing.length >= incoming.length) {
        return existing.map((element, index) => {

            if (!element) {
                return incoming[ index ] || null;
            }

            if (!incoming[ index ]) {
                element.node.parentNode.removeChild(element.node);
                return null;
            }

            if (element.constructor !== incoming[ index ].constructor) {
                return incoming[ index ] || null;
            }

            return Object.assign(element, {
                children: diff(element.children, incoming[ index ].children),
                properties: incoming[ index ].properties
            });
        });
    }

    return incoming.map((element, index) => {

        if (!existing[ index ]) {
            return element || null;
        }

        if (!element) {
            existing[ index ].node.parentNode.removeChild(existing[ index ].node);
            return null;
        }

        if (existing[ index ].constructor !== element.constructor) {
            return element || null;
        }

        return Object.assign(existing[ index ], {
            children: diff(existing[ index ].children, element.children),
            properties: element.properties
        });
    });
}
