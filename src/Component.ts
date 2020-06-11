import { connect } from './core/connect';
import { create } from './core/create';
import { depend } from './core/depend';
import { diff } from './core/diff';
import { render } from './core/render';
import { tag } from './core/tag';

import { Element } from './interfaces/Element';
import { Context } from './Context';

export const cache = Symbol('cache');
export const dirty = Symbol('dirty');

/**
 * Proxy used to capture custom element lifecycle before any consturctors are called 
 * in order to enable automatic registration upon initialization
 * Trust me, it makes sense
 */
const CustomElement = new Proxy(HTMLElement, {

    construct: (element, args, component): object => {
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

    protected [ cache ]: Element[];
    protected [ dirty ]: boolean;

    public oncomponentconnect: (event: Component.LifecycleEvent) => void;
    public oncomponentcreate: (event: Component.LifecycleEvent) => void;
    public oncomponentdisconnect: (event: Component.LifecycleEvent) => void;
    public oncomponentready: (event: Component.LifecycleEvent) => void;
    public oncomponentrender: (event: Component.LifecycleEvent) => void;
    public oncomponentupdate: (event: Component.LifecycleEvent) => void;
    
    /**
     * Part of custom elements API: called when element mounts to a DOM
     */
    private connectedCallback(): void {
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
    private disconnectedCallback(): void {
        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentdisconnect'));
        });
    }

    /**
     * Custom lifecycle hook: called when element is ready or updated
     */
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

        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentrender'));
        });
    }

    protected handleComponentConnect(event: Component.LifecycleEvent): void {
        event; // override
    }

    protected handleComponentCreate(event: Component.LifecycleEvent): void {
        event; // override
    }

    protected handleComponentDisconnect(event: Component.LifecycleEvent): void {
        event; // override
    }

    protected handleComponentReady(event: Component.LifecycleEvent): void {
        event; // override
    }

    protected handleComponentRender(event: Component.LifecycleEvent): void {
        event; // override
    }

    protected handleComponentUpdate(event: Component.LifecycleEvent): void {
        event; // override
    }

    public constructor() {
        super();

        const componentTag = tag(this.constructor);

        if (!window.customElements.get(componentTag)) {
            window.customElements.define(componentTag, this.constructor as new() => Component);
        }

        this.addEventListener('componentconnect', (event: Component.LifecycleEvent) => {this.handleComponentConnect(event)});
        this.addEventListener('componentcreate', (event: Component.LifecycleEvent) => this.handleComponentCreate(event));
        this.addEventListener('componentdisconnect', (event: Component.LifecycleEvent) => this.handleComponentDisconnect(event));
        this.addEventListener('componentready', (event: Component.LifecycleEvent) => this.handleComponentReady(event));
        this.addEventListener('componentrender', (event: Component.LifecycleEvent) => this.handleComponentRender(event));
        this.addEventListener('componentupdate', (event: Component.LifecycleEvent) => this.handleComponentUpdate(event));
        
        this.attachShadow({ mode: 'open' });
        this.dispatchEvent(new Component.LifecycleEvent('componentcreate'));
    }

    /**
     * Retrieves a dependency from context.
     * @param key Object which acts as the key of the stored value.
     */
    public getContext<Key extends Context>(key: new() => Key): Key[ 'value' ] {
        const dependency = depend(this, key);

        if (!dependency) {
            throw new Context.RuntimeError(`Missing context: ${ key.name }`);
        }

        return dependency.value
    }

    public render(): Element[] {
        return []; // override
    }

    public theme(): string {
        return ''; // override
    }

    public update(props: object = {}, immediate = false): Promise<void> {
        this[ dirty ] = true;

        for (const prop of Object.keys(props)) {

            if (this[ prop ] === props[ prop ]) {
                continue;
            }

            if (this[ prop ] && typeof this[ prop ] === 'object') {
                Object.assign(this[ prop ], props[ prop ]);
            }
            else {
                this[ prop ] = props[ prop ];
            }
        }

        if (immediate) {
            this[ dirty ] = false;
            
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

                if (!this[ dirty ]) {
                    return;
                }

                this[ dirty ] = false;
        
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

export namespace Component {

    /**
     * Event interface used for component lifecycle triggers
     */
    export class LifecycleEvent extends Event {
        
    }
}
