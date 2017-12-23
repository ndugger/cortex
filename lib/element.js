import * as symbols from './symbols';

const dictionaries = [
    'dataset',
    'style'
].reduce((o, x) => ({ ...o, [ x ]: true }), { });

const inlineElements = [
    'a',
    'b',
    'em',
    'i',
    'span',
    'strong',
    'style'
].reduce((o, x) => ({ ...o, [ x ]: true }), { });

export function removeNode (element) {
    element.node.remove();
}

export function createNode (element) {
    const { tagName, properties, childNodes } = element;
    const node = typeof tagName === 'string' ? document.createElement(tagName) : new tagName(properties);

    return {
        tagName,
        properties,
        node,
        childNodes: childNodes.filter(child => child && !(child instanceof Text)).map(child => createNode(child))
    };
}

export function diffNode (existingElement, newElement) {

    if (!existingElement && !newElement) {
        return;
    }

    if (existingElement && !newElement) {
        return removeNode(existingElement);
    }

    if (!existingElement && newElement) {
        return createNode(newElement);
    }

    if (existingElement.tagName !== newElement.tagName) {
        removeNode(existingElement);
        return createNode(newElement);
    }

    if (existingElement.childNodes.length > newElement.childNodes.length) {
        return Object.assign(existingElement, {
            properties: newElement.properties || { },
            childNodes: Array.from(existingElement.childNodes).map((child, i) => diffNode(child, newElement.childNodes[ i ]))
        });
    }

    return Object.assign(existingElement, {
        properties: newElement.properties || { },
        childNodes: Array.from(newElement.childNodes).map((child, i) => diffNode(existingElement.childNodes[ i ], child))
    });
}

export function renderNode (parent, element) {

    if (!element) {
        return;
    }

    if (element.properties) {
        Object.keys(element.properties).forEach(property => {

            if (dictionaries[ property ]) {
                Object.assign(element.node[ property ], element.properties[ property ]);
            }
            else {
                element.node[ property ] = element.properties[ property ];
            }
        });
    }

    element.childNodes.forEach(child => renderNode(element.node, child));

    if (parent instanceof Node && parent !== element.node.parentNode) {
        return parent.appendChild(element.node);
    }

    if (element.node[ symbols.updateComponent ]) {
        element.node[ symbols.updateComponent ]();
    }
}

export default function element (tag, properties = { }, children = [ ], ...jsxChildren) {
    const tagName = typeof tag === 'string' ? tag.toLowerCase() : tag;

    if (typeof children === 'string' && inlineElements[ tagName ]) {
        return {
            tagName,
            properties: { ...properties, textContent: children },
            childNodes: [ ]
        };
    }

    const childArray = (Array.isArray(children) ? children : [ children ]).concat(jsxChildren);
    const childNodes = childArray.map(x => typeof x === 'string' ? element('span', null, x) : x);

    return {
        tagName,
        properties,
        childNodes
    };
}
