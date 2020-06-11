import { connect } from './core/connect';
import { create } from './core/create';
import { depend } from './core/depend';
import { diff } from './core/diff';
import { render } from './core/render';
import { tag } from './core/tag';
import { Context } from './Context';
export const cache = Symbol('cache');
export const dirty = Symbol('dirty');
/**
 * Proxy used to capture custom element lifecycle before any consturctors are called
 * in order to enable automatic registration upon initialization
 * Trust me, it makes sense
 */
const CustomElement = new Proxy(HTMLElement, {
    construct: (element, args, component) => {
        const componentTag = tag(component);
        if (!window.customElements.get(componentTag)) {
            window.customElements.define(componentTag, component);
        }
        return Reflect.construct(element, args, component);
    }
});
/**
 * Base component class from which all custom components must extend
 */
export class Component extends CustomElement {
    constructor() {
        super();
        const componentTag = tag(this.constructor);
        if (!window.customElements.get(componentTag)) {
            window.customElements.define(componentTag, this.constructor);
        }
        this.addEventListener('componentconnect', (event) => { this.handleComponentConnect(event); });
        this.addEventListener('componentcreate', (event) => this.handleComponentCreate(event));
        this.addEventListener('componentdisconnect', (event) => this.handleComponentDisconnect(event));
        this.addEventListener('componentready', (event) => this.handleComponentReady(event));
        this.addEventListener('componentrender', (event) => this.handleComponentRender(event));
        this.addEventListener('componentupdate', (event) => this.handleComponentUpdate(event));
        this.attachShadow({ mode: 'open' });
        this.dispatchEvent(new Component.LifecycleEvent('componentcreate'));
    }
    /**
     * Part of custom elements API: called when element mounts to a DOM
     */
    connectedCallback() {
        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentconnect'));
            this.renderedCallback();
            if (!this.classList.contains(this.constructor.name)) {
                this.classList.add(this.constructor.name);
            }
            window.requestAnimationFrame(() => {
                this.dispatchEvent(new Component.LifecycleEvent('componentready'));
            });
        });
    }
    /**
     * Part of custom elements API: called when element is removed from its DOM
     */
    disconnectedCallback() {
        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentdisconnect'));
        });
    }
    /**
     * Custom lifecycle hook: called when element is ready or updated
     */
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
        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentrender'));
        });
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
        const dependency = depend(this, key);
        if (!dependency) {
            throw new Context.RuntimeError(`Missing context: ${key.name}`);
        }
        return dependency.value;
    }
    render() {
        return []; // override
    }
    theme() {
        return ''; // override
    }
    update(props = {}, immediate = false) {
        this[dirty] = true;
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
        if (immediate) {
            this[dirty] = false;
            this.dispatchEvent(new Component.LifecycleEvent('componentupdate'));
            try {
                this.renderedCallback();
                return Promise.resolve();
            }
            catch (error) {
                return Promise.reject(error);
            }
        }
        return new Promise((resolve, reject) => {
            window.requestAnimationFrame(() => {
                if (!this[dirty]) {
                    return;
                }
                this[dirty] = false;
                this.dispatchEvent(new Component.LifecycleEvent('componentupdate'));
                try {
                    this.renderedCallback();
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
}
(function (Component) {
    /**
     * Event interface used for component lifecycle triggers
     */
    class LifecycleEvent extends Event {
    }
    Component.LifecycleEvent = LifecycleEvent;
})(Component || (Component = {}));
//# sourceMappingURL=Component.js.map