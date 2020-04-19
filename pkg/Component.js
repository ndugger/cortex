import { connect } from './core/connect';
import { create } from './core/create';
import { depend } from './core/depend';
import { diff } from './core/diff';
import { render } from './core/render';
import { tag } from './core/tag';
const HTMLElementProxy = new Proxy(HTMLElement, {
    construct: (element, args, component) => {
        const componentTag = tag(component);
        if (!window.customElements.get(componentTag)) {
            window.customElements.define(componentTag, component);
        }
        return Reflect.construct(element, args, component);
    }
});
export const cache = Symbol('cache');
export const context = Symbol('context');
export const dirty = Symbol('dirty');
export class Component extends HTMLElementProxy {
    constructor() {
        super();
        this[context] = new Map();
        this.attachShadow({ mode: 'open' });
        this.addEventListener('componentconnect', (event) => this.handleComponentConnect(event));
        this.addEventListener('componentcreate', (event) => this.handleComponentCreate(event));
        this.addEventListener('componentdisconnect', (event) => this.handleComponentDisconnect(event));
        this.addEventListener('componentready', (event) => this.handleComponentReady(event));
        this.addEventListener('componentrender', (event) => this.handleComponentRender(event));
        this.addEventListener('componentupdate', (event) => this.handleComponentUpdate(event));
        this.dispatchEvent(new Event('componentcreate'));
    }
    connectedCallback() {
        this.dispatchEvent(new Event('componentconnect'));
        window.requestAnimationFrame(() => {
            this.renderedCallback();
            if (!this.classList.contains(this.constructor.name)) {
                this.classList.add(this.constructor.name);
            }
            window.requestAnimationFrame(() => {
                this.dispatchEvent(new Event('componentready'));
            });
        });
    }
    disconnectedCallback() {
        this.dispatchEvent(new Event('componentdisconnect'));
    }
    renderedCallback() {
        const style = render(HTMLStyleElement, { textContent: this.theme() });
        const tree = this.render().concat(style);
        if (!this[cache]) {
            this[cache] = tree;
        }
        else {
            this[cache] = diff(this[cache], tree);
        }
        for (const element of this[cache])
            if (element) {
                if (!element.node) {
                    element.node = create(element);
                }
                connect(element, this.shadowRoot);
            }
        this.dispatchEvent(new Event('componentrender'));
    }
    handleComponentConnect(event) {
        event; // override
    }
    handleComponentCreate(event) {
        event; // override
    }
    handleComponentDisconnect(event) {
        event; // override
    }
    handleComponentReady(event) {
        event; // override
    }
    handleComponentRender(event) {
        event; // override
    }
    handleComponentUpdate(event) {
        event; // override
    }
    /**
     * Retrieves a dependency from context.
     * @param key Object which acts as the key of the stored value.
     */
    getContext(key) {
        return depend(this, key);
    }
    /**
     * Removes a dependency from context.
     * @param key Object which acts as the key of the stored value.
     */
    removeContext(key) {
        this[context].delete(key);
    }
    /**
     * Registers an object in context and updates component.
     * @param key
     * @param value
     */
    setContext(key, value) {
        this[context].set(key, value);
        this.update({ foo: 'bar' });
    }
    render() {
        return [];
    }
    theme() {
        return '';
    }
    update(props = {}) {
        this[dirty] = true;
        window.requestAnimationFrame(() => {
            for (const prop of Object.keys(props)) {
                if (this[prop] === props[prop]) {
                    continue;
                }
                if (this[prop] && typeof this[prop] === 'object') {
                    Object.assign(this[prop], props[prop]);
                }
                else {
                    this[prop] = props[prop];
                }
            }
            if (!this[dirty]) {
                return;
            }
            this[dirty] = false;
            this.dispatchEvent(new Event('componentupdate'));
            this.renderedCallback();
        });
    }
}
//# sourceMappingURL=Component.js.map