import { Context } from "./Context";
import { connect } from "./core/connect";
import { create } from "./core/create";
import { depend } from "./core/depend";
import { diff } from "./core/diff";
import { render } from "./core/render";
import { Tag } from "./Tag";
import { childToElement } from "./util/childToElement";

/**
 * Symbol which represents a component's element tree
 */
const template = Symbol("template");
/**
 * Sumbol which represents whether or not there are changes during updates
 */
const staged = Symbol("staged");
/**
 * Proxy used in order to register a custom element before it is instantiated
 * for the first time
 */
const CustomHTMLElement = new Proxy(HTMLElement, {
    construct(element, args, component) {
        const tag = Tag.of(component);
        if (!window.customElements.get(tag)) {
            window.customElements.define(tag, component);
        }
        return Reflect.construct(element, args, component);
    },
});
/**
 * Base component class from which all custom components must extend
 */
export class Component extends CustomHTMLElement {
    /**
     * Attaches lifecycle listeners upon instantiation, initializes shadow root
     */
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.addEventListener("componentconnect", (event) => {
            this.handleComponentConnect(event);
        });
        this.addEventListener("componentcreate", (event) =>
            this.handleComponentCreate(event)
        );
        this.addEventListener("componentdisconnect", (event) =>
            this.handleComponentDisconnect(event)
        );
        this.addEventListener("componentready", (event) =>
            this.handleComponentReady(event)
        );
        this.addEventListener("componentrender", (event) =>
            this.handleComponentRender(event)
        );
        this.addEventListener("componentupdate", (event) =>
            this.handleComponentUpdate(event)
        );
        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent("componentcreate"));
        });
    }
    /**
     * Part of custom elements API: called when element mounts to a DOM
     */
    connectedCallback() {
        window.requestAnimationFrame(() => {
            this.dispatchEvent(
                new Component.LifecycleEvent("componentconnect")
            );
            this.updatedCallback();
            /**
             * In order to increase type safety, each element receives a `className`
             * equal to its class' name
             */
            if (!this.classList.contains(this.constructor.name)) {
                this.classList.add(this.constructor.name);
            }
            window.requestAnimationFrame(() => {
                this.dispatchEvent(
                    new Component.LifecycleEvent("componentready")
                );
            });
        });
    }
    /**
     * Part of custom elements API: called when element is removed from its DOM
     */
    disconnectedCallback() {
        window.requestAnimationFrame(() => {
            this.dispatchEvent(
                new Component.LifecycleEvent("componentdisconnect")
            );
        });
    }
    /**
     * Custom lifecycle hook: called when element is ready or updated
     */
    updatedCallback() {
        const style = render(HTMLStyleElement, { textContent: this.theme() });
        const tree = this.render().concat(style).map(childToElement);
        /**
         * If first time render, just save new tree
         * Otherwise diff tree recursively
         */
        if (!this[template]) {
            this[template] = tree;
        } else {
            this[template] = diff(this[template], tree);
        }
        /**
         * Wire up any new component elements with DOM elements
         */
        for (const element of this[template])
            if (element) {
                if (!element.node) {
                    element.node = create(element);
                }
                connect(element, this.shadowRoot);
            }
        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent("componentrender"));
        });
    }
    /**
     * Used to hook into the connection lifecycle
     * @param event Connect lifecycle event
     */
    handleComponentConnect(event) {}
    /**
     * Used to hook into the create lifecycle
     * @param event Create lifecycle event
     */
    handleComponentCreate(event) {}
    /**
     * Used to hook into the disconnect lifecycle
     * @param event Disconnect lifecycle event
     */
    handleComponentDisconnect(event) {}
    /**
     * Used to hook into the ready lifecycle
     * @param event Ready lifecycle event
     */
    handleComponentReady(event) {}
    /**
     * Used to hook into the render lifecycle
     * @param event Render lifecycle event
     */
    handleComponentRender(event) {}
    /**
     * Used to hook into the update lifecycle
     * @param event Update lifecycle event
     */
    handleComponentUpdate(event) {}
    /**
     * Retrieves a dependency from context.
     * @param key Object which acts as the key of the stored value.
     */
    getContext(dependency) {
        const found = depend(this, dependency);
        /**
         * Since it will be unknown whether you are within the specified context,
         * throw if not found
         */
        if (!found) {
            throw new Context.RuntimeError(
                `Missing context: ${dependency.name}`
            );
        }
        return found.value;
    }
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
        return "";
    }
    /**
     * Triggers an update
     * @param props Optional properties to update with
     * @param immediate Whether or not to attempt an update this frame
     */
    update(props = {}, immediate = false) {
        this[staged] = true;
        for (const prop of Object.keys(props)) {
            if (this[prop] === props[prop]) {
                continue;
            }
            if (this[prop] && typeof this[prop] === "object") {
                Object.assign(this[prop], props[prop]);
            } else {
                this[prop] = props[prop];
            }
        }
        if (immediate) {
            this[staged] = false;
            this.dispatchEvent(new Component.LifecycleEvent("componentupdate"));
            try {
                this.updatedCallback();
                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        }
        return new Promise((resolve, reject) => {
            window.requestAnimationFrame(() => {
                if (!this[staged]) {
                    return;
                }
                this[staged] = false;
                this.dispatchEvent(
                    new Component.LifecycleEvent("componentupdate")
                );
                try {
                    this.updatedCallback();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}
(function (Component) {
    /**
     * JSX component factory
     */
    Component.Factory = render;
    /**
     * Decides if a node is a Component
     * @param node
     */
    function isComponent(node) {
        return node instanceof Component;
    }
    Component.isComponent = isComponent;
    /**
     * Decides if a component is a classical component
     * @param constructor
     */
    function isConstructor(constructor) {
        return constructor === constructor?.prototype?.constructor;
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
     * Event interface used for component lifecycle triggers
     */
    class LifecycleEvent extends Event {}
    Component.LifecycleEvent = LifecycleEvent;
})(Component || (Component = {}));
//# sourceMappingURL=Component.js.map
