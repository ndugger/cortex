import { Element } from './interfaces/Element';
import { Context } from './Context';
export declare const cache: unique symbol;
export declare const dirty: unique symbol;
/**
 * Proxy used to capture custom element lifecycle before any consturctors are called
 * in order to enable automatic registration upon initialization
 * Trust me, it makes sense
 */
declare const CustomElement: {
    new (): HTMLElement;
    prototype: HTMLElement;
};
/**
 * Base component class from which all custom components must extend
 */
export declare class Component extends CustomElement {
    protected [cache]: Element[];
    protected [dirty]: boolean;
    oncomponentconnect: (event: Component.LifecycleEvent) => void;
    oncomponentcreate: (event: Component.LifecycleEvent) => void;
    oncomponentdisconnect: (event: Component.LifecycleEvent) => void;
    oncomponentready: (event: Component.LifecycleEvent) => void;
    oncomponentrender: (event: Component.LifecycleEvent) => void;
    oncomponentupdate: (event: Component.LifecycleEvent) => void;
    /**
     * Part of custom elements API: called when element mounts to a DOM
     */
    private connectedCallback;
    /**
     * Part of custom elements API: called when element is removed from its DOM
     */
    private disconnectedCallback;
    /**
     * Custom lifecycle hook: called when element is ready or updated
     */
    private renderedCallback;
    protected handleComponentConnect(event: Component.LifecycleEvent): void;
    protected handleComponentCreate(event: Component.LifecycleEvent): void;
    protected handleComponentDisconnect(event: Component.LifecycleEvent): void;
    protected handleComponentReady(event: Component.LifecycleEvent): void;
    protected handleComponentRender(event: Component.LifecycleEvent): void;
    protected handleComponentUpdate(event: Component.LifecycleEvent): void;
    constructor();
    /**
     * Retrieves a dependency from context.
     * @param key Object which acts as the key of the stored value.
     */
    getContext<Key extends Context>(key: new () => Key): Key['value'];
    render(): Element[];
    theme(): string;
    update(props?: object, immediate?: boolean): Promise<void>;
}
export declare namespace Component {
    /**
     * Event interface used for component lifecycle triggers
     */
    class LifecycleEvent extends Event {
    }
}
export {};
