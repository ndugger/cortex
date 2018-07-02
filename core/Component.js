const State = require('./state');

const element = require('./element');
const symbols = require('./symbols');

const lifecycleEvents = [
    'connect',
    'create',
    'disconnect',
    'ready',
    'render',
    'update'
];

const HTMLElementProxy = new Proxy(HTMLElement, {

    construct: (htmlElement, args, component) => {

        if (!window.customElements.get(component[ symbols.elementName ])) {
            window.customElements.define(component[ symbols.elementName ], component);
        }

        return Reflect.construct(htmlElement, args, component);
    }
});

module.exports = class Component extends HTMLElementProxy {

    [ symbols.connectComponent ] () {
        this.dispatchEvent(new CustomEvent('connect'));

        this[ symbols.renderComponent ]();

        window.requestAnimationFrame(() => {
            this.dispatchEvent(new CustomEvent('ready'));
        });
    }

    [ symbols.diffComponent ] () {
        const css = this.css;
        const existingTree = this[ symbols.elementTree ];
        const template = this.render();
        const newTree = Array.isArray(template) ? template : [ template ];

        if (css) {
            newTree.splice(0, 0, element('style', { }, css));
        }

        if (!existingTree) {
            this[ symbols.elementTree ] = newTree.map(e => element.createNode(e));

            return this[ symbols.elementTree ];
        }

        if (existingTree.length > newTree.length) {
            this[ symbols.elementTree ] = existingTree.map((e, i) => element.diffNode(e, newTree[ i ]));
        }
        else {
            this[ symbols.elementTree ] = newTree.map((e, i) => element.diffNode(existingTree[ i ], e));
        }

        return this[ symbols.elementTree ];
    }

    [ symbols.disconnectComponent ] () {
        this.dispatchEvent(new CustomEvent('disconnect'));
    }

    [ symbols.renderComponent ] () {
        window.requestAnimationFrame(() => {
            const tree = this[ symbols.diffComponent ]();
            const existingChildren = Array.from(this.shadowRoot.childNodes);
            const newChildren = tree.map(element => element.node);

            existingChildren.forEach(child => {
                if (!newChildren.includes(child)) {
                    child.remove();
                }
            });

            tree.forEach(e => element.renderNode(this.shadowRoot, e));

            this.dispatchEvent(new CustomEvent('render'));
        });
    }

    [ symbols.updateComponent ] () {
        this[ symbols.renderComponent ]();

        this.dispatchEvent(new CustomEvent('update'));
    }

    get css () {
        return '';
    }

    constructor (properties = { }, childNodes = [ ]) {
        super();

        this[ symbols.elementTree ] = null;

        Object.assign(this, this.constructor.defaultProperties);
        Object.assign(this, properties);

        this.state = new State(this, Object.entries(this.constructor.initialState));

        this.attachShadow({ mode: 'open' });

        lifecycleEvents.forEach(type => {
            const handler = `handleComponent${ type.replace(/^(.)/, x => x.toUpperCase()) }`;

            if (this[ handler ]) {
                this.addEventListener(type, e => this[ handler ](e));
            }
        });

        for (const child of childNodes) {
            this.appendChild(child);
        }

        this.dispatchEvent(new CustomEvent('create'));
    }

    connectedCallback () {
        this[ symbols.connectComponent ]();
    }

    disconnectedCallback () {
        this[ symbols.disconnectComponent ]();
    }

    update () {
        this[ symbols.updateComponent ]();
    }

    render () {
        return [ ];
    }
};

module.exports.elementName = null;
module.exports.defaultProperties = { };
module.exports.initialState = { };

Object.defineProperty(module.exports, symbols.elementName, {
    get () {
        const { elementName, name } = this;
        const validName = elementName || name.replace(/([A-Z])/g, x => `-${ x.toLowerCase() }`).replace(/^-/, '');

        if (!validName.includes('-')) {
            return `x-${ validName }`;
        }

        return validName;
    }
});
