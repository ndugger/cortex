import { Element } from './interfaces/Element';
declare const HTMLElementProxy: {
    new (): HTMLElement;
    prototype: HTMLElement;
};
export declare const cache: unique symbol;
export declare const context: unique symbol;
export declare const dirty: unique symbol;
export declare class Component extends HTMLElementProxy {
    [cache]: Element[];
    [context]: Map<unknown, unknown>;
    [dirty]: boolean;
    oncomponentconnect: (event: Event) => void;
    oncomponentcreate: (event: Event) => void;
    oncomponentdisconnect: (event: Event) => void;
    oncomponentready: (event: Event) => void;
    oncomponentrender: (event: Event) => void;
    oncomponentupdate: (event: Event) => void;
    private connectedCallback;
    private disconnectedCallback;
    private renderedCallback;
    protected handleComponentConnect(event: Event): void;
    protected handleComponentCreate(event: Event): void;
    protected handleComponentDisconnect(event: Event): void;
    protected handleComponentReady(event: Event): void;
    protected handleComponentRender(event: Event): void;
    protected handleComponentUpdate(event: Event): void;
    constructor();
    /**
     * Retrieves a dependency from context.
     * @param key Object which acts as the key of the stored value.
     */
    getContext<Context = unknown>(key: any): Context;
    /**
     * Removes a dependency from context.
     * @param key Object which acts as the key of the stored value.
     */
    removeContext(key: any): void;
    /**
     * Registers an object in context and updates component.
     * @param key
     * @param value
     */
    setContext(key: any, value: any): void;
    render(): Element[];
    theme(): string;
    update(props?: object): void;
}
export {};
