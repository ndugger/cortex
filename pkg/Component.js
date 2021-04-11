"use strict";
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
const connectElementToHost_1 = require("./core/connectElementToHost");
const createDocumentNode_1 = require("./core/createDocumentNode");
const createElement_1 = require("./core/createElement");
const findParentContext_1 = require("./core/findParentContext");
const mapChildToElement_1 = require("./core/mapChildToElement");
const mapComponentToTag_1 = require("./core/mapComponentToTag");
const mergeTreeChanges_1 = require("./core/mergeTreeChanges");
const displayContents_1 = require("./util/displayContents");
/**
 * Array which acts as a deque of the current branch of components
 */
const branch = [];
/**
 * Symbol which represents a flag to determine whether a component is connected
 */
const connected = Symbol('connected');
/**
 * Symbol which represents which hooks are attached to a component
 */
const hooks = Symbol('hooks');
/**
 * Symbol which represents a component's rendered tree
 */
const layout = Symbol('layout');
/**
 * Symbol which represents whether or not there are changes during update
 */
const flagged = Symbol('flagged');
/**
 * Symbol which represents a component's adopted style sheets
 */
const styles = Symbol('styles');
/**
 * Symbol which represents which contexts a component is subscribed to
 */
const subscriptions = Symbol('subscriptions');
/**
 * Proxy used in order to register a custom element before it is instantiated for the first time
 */
const CustomHTMLElement = new Proxy(HTMLElement, {
    construct(element, args, component) {
        const tag = mapComponentToTag_1.mapComponentToTag(component);
        if (!globalThis.customElements.get(tag)) {
            globalThis.customElements.define(tag, component);
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
        /**\
         * Field in which a component's connected status is stored
         */
        this[_a] = false;
        /**
         * Field in which component's registered hooks are stored
         */
        this[_b] = [];
        /**
         * Field in which component's template is stored
         */
        this[_c] = [];
        /**
         * Field in which component render status is stored
         */
        this[_d] = false;
        /**
         * Field in which component's subscribed contexts is stored
         */
        this[_e] = new Map();
        this.addEventListener('componentconnect', event => this.handleComponentConnect(event));
        this.addEventListener('componentcreate', event => this.handleComponentCreate(event));
        this.addEventListener('componentdisconnect', event => this.handleComponentDisconnect(event));
        this.addEventListener('componentready', event => this.handleComponentReady(event));
        this.addEventListener('componentrender', event => this.handleComponentRender(event));
        this.addEventListener('componentupdate', event => this.handleComponentUpdate(event));
        this.attachShadow({ mode: 'open' });
        if (this.shadowRoot) {
            this.shadowRoot.adoptedStyleSheets = [];
        }
        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentcreate'));
        });
    }
    /**
     * Part of custom elements API: called when element mounts to a DOM
     */
    connectedCallback() {
        this[connected] = true;
        this.dispatchEvent(new Component.LifecycleEvent('componentconnect'));
        /**
         * In order to increase type safety, each element receives a `className` equal to its class' name
         */
        if (!this.classList.contains(this.constructor.name)) {
            this.classList.add(this.constructor.name);
        }
        /**
         * Initialize component layout, then dispatch readiness
         */
        this.update().then(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentready'));
        });
    }
    /**
     * Part of custom elements API: called when element is removed from its DOM
     */
    disconnectedCallback() {
        this[connected] = false;
        this[subscriptions].clear();
        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentdisconnect'));
        });
    }
    /**
     * Custom lifecycle hook: called when element is ready or updated
     */
    updatedCallback() {
        branch.push(this);
        if (!this[connected] || !this.shadowRoot) {
            return void branch.pop();
        }
        const elements = this.render();
        const styles = this.theme();
        const css = styles.filter(style => typeof style === 'string').join('\n');
        this.shadowRoot.adoptedStyleSheets = styles.filter(style => style instanceof CSSStyleSheet);
        const style = createElement_1.createElement(HTMLStyleElement, { textContent: css });
        const template = elements.concat(style).map(mapChildToElement_1.mapChildToElement);
        /**
         * If first time render, just save new tree
         * Otherwise diff tree recursively
         */
        if (!this[layout]) {
            this[layout] = template;
        }
        else {
            this[layout] = mergeTreeChanges_1.mergeTreeChanges(this[layout], template);
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
        return [];
    }
    /**
     * Retrieves a dependency from context.
     * @param context Object which acts as the key of the stored value
     */
    getContext(context) {
        var _f;
        /**
         * Return cached context if found
         */
        if (this[subscriptions].has(context)) {
            return (_f = this[subscriptions].get(context)) === null || _f === void 0 ? void 0 : _f.value;
        }
        /**
         * Otherwise walk up DOM tree to find context
         */
        const found = findParentContext_1.findParentContext(this, context);
        /**
         * Return nothing if looking outside of any matching context's tree
         */
        if (!found) {
            return;
        }
        /**
         * If retrieving context for the first time, subscribe to its updates
         */
        if (!this[subscriptions].has(context)) {
            const contextListener = () => {
                this.update();
            };
            this[subscriptions].set(context, found);
            found.addEventListener('componentupdate', contextListener);
            this.addEventListener('componentdisconnect', () => {
                this[subscriptions].delete(context);
                found.removeEventListener('componentupdate', contextListener);
            });
        }
        return found === null || found === void 0 ? void 0 : found.value;
    }
    attachHook(hook) {
        if (this[hooks].includes(hook)) {
            return hook.state;
        }
        hook.addEventListener('hookupdate', () => {
            this.update();
        });
        this[hooks].push(hook);
        return hook.state;
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
_a = connected, _b = hooks, _c = layout, _d = flagged, _e = subscriptions;
(function (Component) {
    /**
     * Decides if a node is a component
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
    function getCurrentBranch() {
        return branch[branch.length - 1];
    }
    Component.getCurrentBranch = getCurrentBranch;
    /**
     * Used to provide contextual state within a given component tree
     */
    class Context extends Component {
        constructor() {
            super(...arguments);
            this.value = this;
        }
        render() {
            return [
                createElement_1.createElement(HTMLSlotElement)
            ];
        }
        theme() {
            return [
                displayContents_1.displayContents()
            ];
        }
    }
    Component.Context = Context;
    /**
     * Event interface used for component lifecycle triggers
     */
    class LifecycleEvent extends Event {
    }
    Component.LifecycleEvent = LifecycleEvent;
})(Component = exports.Component || (exports.Component = {}));
