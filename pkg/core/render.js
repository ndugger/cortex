export function render(constructor, properties, ...children) {
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
//# sourceMappingURL=render.js.map