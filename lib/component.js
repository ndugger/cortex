import element, { createNode, diffNode, renderNode } from './element';
import State from './state';
import * as symbols from './symbols';

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

export default class Component extends HTMLElementProxy {

    static get [ symbols.elementName ] () {
        const { elementName, name } = this;
        const validName = elementName || name.replace(/([A-Z])/g, x => `-${ x.toLowerCase() }`).replace(/^-/, '');

        if (!validName.includes('-')) {
            return `x-${ validName }`;
        }

        return validName;
    }

    static elementName = null;

    static defaultProperties = { };

    static initialState = { };

    [ symbols.elementTree ] = null;

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
            this[ symbols.elementTree ] = newTree.map(element => createNode(element));

            return this[ symbols.elementTree ];
        }

        if (existingTree.length > newTree.length) {
            this[ symbols.elementTree ] = existingTree.map((element, i) => diffNode(element, newTree[ i ]));
        }
        else {
            this[ symbols.elementTree ] = newTree.map((element, i) => diffNode(existingTree[ i ], element));
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

            tree.forEach(element => renderNode(this.shadowRoot, element));

            this.dispatchEvent(new CustomEvent('render'));
        });
    }

    [ symbols.updateComponent ] () {
        this[ symbols.renderComponent ]();

        this.dispatchEvent(new CustomEvent('update'));
    }

    get css () {
        return '' /* TODO `
            :host {
                display: contents;
            }
        `*/;
    }

    constructor () {
        super();

        Object.assign(this, this.constructor.defaultProperties);

        this.state = new State(this, Object.entries(this.constructor.initialState));

        this.attachShadow({ mode: 'open' });

        lifecycleEvents.forEach(type => {
            const handler = `handleComponent${ type.replace(/^(.)/, x => x.toUpperCase()) }`;

            if (this[ handler ]) {
                this.addEventListener(type, e => this[ handler ](e));
            }
        });

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
}
