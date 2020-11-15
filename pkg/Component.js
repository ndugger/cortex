"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const connectElementToHost_1 = require("./core/connectElementToHost");
const createDocumentNode_1 = require("./core/createDocumentNode");
const createElement_1 = require("./core/createElement");
const findParentContext_1 = require("./core/findParentContext");
const mapChildToElement_1 = require("./core/mapChildToElement");
const mapComponentToTag_1 = require("./core/mapComponentToTag");
const mergeTreeChanges_1 = require("./core/mergeTreeChanges");
const Fragment_1 = require("./Fragment");
/**
 * Array which acts as a deque of the current branch of components
 */
const branch = [];
/**
 * Symbol which represents a component's rendered tree
 */
const layout = Symbol('layout');
/**
 * Sumbol which represents whether or not there are changes during update
 */
const flagged = Symbol('flagged');
/**
 * Proxy used in order to register a custom element before it is instantiated for the first time
 */
const CustomHTMLElement = new Proxy(HTMLElement, {
    construct(element, args, component) {
        const tag = mapComponentToTag_1.mapComponentToTag(component);
        if (!window.customElements.get(tag)) {
            window.customElements.define(tag, component);
        }
        return Reflect.construct(element, args, component);
    }
});
/**
 * Base component class from which all custom components must extend
 */
class Component extends CustomHTMLElement {
    /**
     * Creates a component, attaches lifecycle listeners upon instantiation, and initializes shadow root
     */
    constructor() {
        super();
        this.addEventListener('componentconnect', event => this.handleComponentConnect(event));
        this.addEventListener('componentcreate', event => this.handleComponentCreate(event));
        this.addEventListener('componentdisconnect', event => this.handleComponentDisconnect(event));
        this.addEventListener('componentready', event => this.handleComponentReady(event));
        this.addEventListener('componentrender', event => this.handleComponentRender(event));
        this.addEventListener('componentupdate', event => this.handleComponentUpdate(event));
        this.attachShadow({ mode: 'open' });
        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentcreate'));
        });
    }
    /**
     * Part of custom elements API: called when element mounts to a DOM
     */
    connectedCallback() {
        this.dispatchEvent(new Component.LifecycleEvent('componentconnect'));
        this.update();
        /**
         * In order to increase type safety, each element receives a `className` equal to its class' name
         */
        if (!this.classList.contains(this.constructor.name)) {
            this.classList.add(this.constructor.name);
        }
        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentready'));
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
    updatedCallback() {
        branch.push(this);
        const style = createElement_1.createElement(HTMLStyleElement, { textContent: this.theme() });
        const elements = this.render().concat(style).map(mapChildToElement_1.mapChildToElement);
        /**
         * If first time render, just save new tree
         * Otherwise diff tree recursively
         */
        if (!this[layout]) {
            this[layout] = elements;
        }
        else {
            this[layout] = mergeTreeChanges_1.mergeTreeChanges(this[layout], elements);
        }
        /**
         * Wire up any new component elements with DOM elements
         */
        for (const element of this[layout])
            if (element) {
                if (!element.node) {
                    element.node = createDocumentNode_1.createDocumentNode(element);
                }
                connectElementToHost_1.connectElementToHost(element, this.shadowRoot);
            }
        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentrender'));
        });
        branch.pop();
    }
    /**
     * Used to hook into the connection lifecycle
     * @param event Connect lifecycle event
     */
    handleComponentConnect(event) { }
    /**
     * Used to hook into the create lifecycle
     * @param event Create lifecycle event
     */
    handleComponentCreate(event) { }
    /**
     * Used to hook into the disconnect lifecycle
     * @param event Disconnect lifecycle event
     */
    handleComponentDisconnect(event) { }
    /**
     * Used to hook into the ready lifecycle
     * @param event Ready lifecycle event
     */
    handleComponentReady(event) { }
    /**
     * Used to hook into the render lifecycle
     * @param event Render lifecycle event
     */
    handleComponentRender(event) { }
    /**
     * Used to hook into the update lifecycle
     * @param event Update lifecycle event
     */
    handleComponentUpdate(event) { }
    /**
     * Constructs a component's template
     */
    render() {
        return [];
    }
    /**
     * Constructs a component's stylesheet
     */
    theme() {
        return '';
    }
    /**
     * Retrieves a dependency from context.
     * @param dependency Object which acts as the key of the stored value
     */
    getContext(dependency) {
        const found = findParentContext_1.findParentContext(this, dependency);
        /**
         * Since it will be unknown whether you are within the specified context, throw if not found
         */
        if (!found) {
            // TODO (delay functional render so context is rendered before functions called) throw new Error(`Missing context: ${ dependency.name }`)
        }
        return found === null || found === void 0 ? void 0 : found.value;
    }
    /**
     * Triggers an update
     * @param props Optional properties to update with
     * @param immediate Whether or not to attempt an update this frame
     */
    update(props = {}, immediate = false) {
        this[flagged] = true;
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
        /**
         * If immediate mode enabled, don't batch update
         */
        if (immediate) {
            this[flagged] = false;
            this.dispatchEvent(new Component.LifecycleEvent('componentupdate'));
            try {
                this.updatedCallback();
                return Promise.resolve();
            }
            catch (error) {
                return Promise.reject(error);
            }
        }
        /**
         * If immediate mode not enabled, batch updates
         */
        return new Promise((resolve, reject) => {
            window.requestAnimationFrame(() => {
                if (!this[flagged]) {
                    return;
                }
                this[flagged] = false;
                this.dispatchEvent(new Component.LifecycleEvent('componentupdate'));
                try {
                    this.updatedCallback();
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            });
        });
    }
}
exports.Component = Component;
(function (Component) {
    /**
     * Decides if a node is a Component
     * @param node
     */
    function isComponent(node) {
        return node instanceof Component;
    }
    Component.isComponent = isComponent;
    /**
     * Decides if a component is a node constructor
     * @param constructor
     */
    function isConstructor(constructor) {
        if (!constructor || constructor === Object) {
            return false;
        }
        if (constructor === Node) {
            return true;
        }
        return isConstructor(Object.getPrototypeOf(constructor));
    }
    Component.isConstructor = isConstructor;
    /**
     * Decides if a component is a functional component
     * @param constructor
     */
    function isFn(constructor) {
        return !isConstructor(constructor);
    }
    Component.isFn = isFn;
    /**
     * Decides if a node is a portal mirror
     * @param node
     */
    function isMirror(node) {
        return node instanceof Component.Portal.Mirror;
    }
    Component.isMirror = isMirror;
    /**
     * Used to provide contextual state within a given component tree
     */
    class Context extends Component {
        render() {
            return [
                createElement_1.createElement(HTMLSlotElement)
            ];
        }
        theme() {
            return `
                :host {
                    display: contents;
                }
            `;
        }
    }
    Component.Context = Context;
    /**
     * Event interface used for component lifecycle triggers
     */
    class LifecycleEvent extends Event {
    }
    Component.LifecycleEvent = LifecycleEvent;
    /**
     * Map of model types to their respective instances
     */
    const portals = new Map();
    /**
     * Used to inject elements from one tree into another
     */
    class Portal extends Component {
        /**
         * Returns a Portal.Mirror bound to a specific portal type
         */
        static get Access() {
            return (props) => {
                var _a;
                return [
                    createElement_1.createElement(Portal.Mirror, { target: this }, ...((_a = props.children) !== null && _a !== void 0 ? _a : []))
                ];
            };
        }
        render() {
            return [
                createElement_1.createElement(HTMLSlotElement)
            ];
        }
        theme() {
            return `
                :host {
                    display: contents;
                }
            `;
        }
        constructor() {
            var _a;
            super();
            if (!portals.has(this.constructor)) {
                portals.set(this.constructor, [this]);
            }
            else {
                (_a = portals.get(this.constructor)) === null || _a === void 0 ? void 0 : _a.push(this);
            }
        }
    }
    Component.Portal = Portal;
    (function (Portal) {
        /**
         * Used as the injection method for portals
         */
        class Mirror extends Fragment_1.Fragment {
            reflect() {
                var _a;
                for (const portal of (_a = portals.get(this.target)) !== null && _a !== void 0 ? _a : []) {
                    portal.append(this);
                }
            }
        }
        Portal.Mirror = Mirror;
    })(Portal = Component.Portal || (Component.Portal = {}));
})(Component = exports.Component || (exports.Component = {}));
//# sourceMappingURL=Component.js.map