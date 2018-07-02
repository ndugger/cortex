const symbols = require('./symbols');

module.exports = function element (tag, properties = { }, children = [ ], ...jsxChildren) {
    const tagName = typeof tag === 'string' ? tag.toLowerCase() : tag;

    if (typeof children === 'string' && jsxChildren.length === 0) {
        return {
            tagName,
            properties: { ...properties, textContent: children },
            childNodes: [ ]
        };
    }

    const childArray = (Array.isArray(children) ? children : [ children ]).concat(jsxChildren);
    const childNodes = childArray.map(x => typeof x === 'string' ? module.exports(null, null, x) : x);

    return {
        tagName,
        properties,
        childNodes
    };
};

module.exports.removeNode = function removeNode (element) {
    element.node.remove();
}

module.exports.createNode = function createNode (element) {
    const { tagName, properties, childNodes } = element;

    if (tagName === null) {
        return {
            tagName,
            properties,
            node: new Text(),
            childNodes: [ ]
        };
    }

    return {
        tagName,
        properties,
        node: typeof tagName === 'string' ? document.createElement(tagName) : new tagName(properties, childNodes),
        childNodes: childNodes.filter(child => child && !(child instanceof Text)).map(child => module.exports.createNode(child))
    };
}

module.exports.diffNode = function diffNode (existingElement, newElement) {

    if (!existingElement && !newElement) {
        return;
    }

    if (existingElement && !newElement) {
        return module.exports.removeNode(existingElement);
    }

    if (!existingElement && newElement) {
        return module.exports.createNode(newElement);
    }

    if (existingElement.tagName !== newElement.tagName) {
        module.exports.removeNode(existingElement);
        return module.exports.createNode(newElement);
    }

    if (existingElement.childNodes.length > newElement.childNodes.length) {
        return Object.assign(existingElement, {
            properties: newElement.properties || { },
            childNodes: existingElement.childNodes.map((child, i) => module.exports.diffNode(child, newElement.childNodes[ i ]))
        });
    }

    return Object.assign(existingElement, {
        properties: newElement.properties || { },
        childNodes: newElement.childNodes.map((child, i) => module.exports.diffNode(existingElement.childNodes[ i ], child))
    });
}

module.exports.renderNode = function renderNode (parent, element) {

    if (!element) {
        return;
    }

    if (element.properties) {
        Object.keys(element.properties).forEach(property => {

            if (typeof element.node[ property ] === 'object' && element.node[ property ] !== null) {
                Object.assign(element.node[ property ], element.properties[ property ]);
            }
            else {
                element.node[ property ] = element.properties[ property ];
            }
        });
    }

    element.childNodes.forEach(child => module.exports.renderNode(element.node, child));

    if (parent instanceof Node && parent !== element.node.parentNode) {
        return; // parent.appendChild(element.node);
    }

    if (element.node[ symbols.updateComponent ]) {
        element.node[ symbols.updateComponent ]();
    }
}
