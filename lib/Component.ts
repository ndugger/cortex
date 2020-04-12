import { connect } from './core/connect';
import { create } from './core/create';
import { depend } from './core/depend';
import { diff } from './core/diff';
import { render } from './core/render';
import { tag } from './core/tag';

import { Element } from './interfaces/Element';

const HTMLElementProxy = new Proxy(HTMLElement, {

    construct: (element, args, component): object => {
        const componentTag = tag(component);

        if (!window.customElements.get(componentTag)) {
            window.customElements.define(componentTag, component);
        }

        return Reflect.construct(element, args, component);
    }
});

export const cache = Symbol('cache');

export const context = Symbol('context');

export class Component extends HTMLElementProxy {

    public [ cache ]: Element[];
    public [ context ]: Map<unknown, unknown>;

    public oncomponentconnect: (event: Event) => void;
    public oncomponentcreate: (event: Event) => void;
    public oncomponentdisconnect: (event: Event) => void;
    public oncomponentready: (event: Event) => void;
    public oncomponentrender: (event: Event) => void;
    public oncomponentupdate: (event: Event) => void;
    
    private connectedCallback(): void {
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

    private disconnectedCallback(): void {
        this.dispatchEvent(new Event('componentdisconnect'));
    }

    private renderedCallback(): void {
        const style = render(HTMLStyleElement, { textContent: this.theme() });
        const tree = this.render().concat(style);

        if (!this[ cache ]) {
            this[ cache ] = tree;
        }
        else {
            this[ cache ] = diff(this[ cache ], tree);
        }

        for (const element of this[ cache ]) if (element) {

            if (!element.node) {
                element.node = create(element);
            }

            connect(element, this.shadowRoot);
        }

        this.dispatchEvent(new Event('componentrender'));
    }

    protected handleComponentConnect(event: Event): void {
        event; // override
    }

    protected handleComponentCreate(event: Event): void {
        event; // override
    }

    protected handleComponentDisconnect(event: Event): void {
        event; // override
    }

    protected handleComponentReady(event: Event): void {
        event; // override
    }

    protected handleComponentRender(event: Event): void {
        event; // override
    }

    protected handleComponentUpdate(event: Event): void {
        event; // override
    }

    public constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.addEventListener('componentconnect', (event: Event) => this.handleComponentConnect(event));
        this.addEventListener('componentcreate', (event: Event) => this.handleComponentCreate(event));
        this.addEventListener('componentdisconnect', (event: Event) => this.handleComponentDisconnect(event));
        this.addEventListener('componentready', (event: Event) => this.handleComponentReady(event));
        this.addEventListener('componentrender', (event: Event) => this.handleComponentRender(event));
        this.addEventListener('componentupdate', (event: Event) => this.handleComponentUpdate(event));

        this.dispatchEvent(new Event('componentcreate'));
    }

    /**
     * Retrieves an object from context.
     * @param key Object which acts as the key of the stored value.
     */
    public getContext<Context = unknown>(key: any): Context {

        /**
         * If context not directly available on current component, climb up the tree until it is found or returns undefined.
         */
        if (!this[ context ].has(key)) {
            const found = depend(this, key);

            if (found) {
                return found as Context;
            }
        }

        return this[ context ].get(key) as Context;
    }

    public setContext(key: any, value: any): void {
        this[ context ].set(key, value);
    }

    public render(): Element[] {
        return [];
    }

    public theme(): string {
        return '';
    }

    public update(props: object = {}): void {

        for (const prop of Object.keys(props)) {

            if (this[ prop ] === props[ prop ]) {
                break;
            }

            if (this[ prop ] && typeof this[ prop ] === 'object') {
                Object.assign(this[ prop ], props[ prop ]);
            }
            else {
                this[ prop ] = props[ prop ];
            }
        }

        this.dispatchEvent(new Event('componentupdate'));

        window.requestAnimationFrame(() => {
            this.renderedCallback();
        });
    }
}
