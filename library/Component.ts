import connect from './core/connect';
import create from './core/create';
import diff from './core/diff';
import render from './core/render';
import tag from './core/tag';

import VirtualElement from './interfaces/VirtualElement';

const htmlElementProxy = new Proxy(HTMLElement, {

    construct: (element, args, component): object => {
        const componentTag = tag(component);

        if (!window.customElements.get(componentTag)) {
            window.customElements.define(componentTag, component);
        }

        return Reflect.construct(element, args, component);
    }
});

const cache = Symbol('cache');

export default class Component extends htmlElementProxy {

    private [ cache ]: VirtualElement[];

    public oncomponentconnect: (event: Event) => void;
    public oncomponentcreate: (event: Event) => void;
    public oncomponentdisconnect: (event: Event) => void;
    public oncomponentready: (event: Event) => void;
    public oncomponentrender: (event: Event) => void;
    public oncomponentupdate: (event: Event) => void;

    private connectedCallback(): void {
        this.dispatchEvent(new CustomEvent('componentconnect'));

        window.requestAnimationFrame(() => {
            this.renderedCallback();

            if (!this.classList.contains(this.constructor.name)) {
                this.classList.add(this.constructor.name);
            }

            window.requestAnimationFrame(() => {
                this.dispatchEvent(new CustomEvent('componentready'));
            });
        });
    }

    private disconnectedCallback(): void {
        this.dispatchEvent(new CustomEvent('componentdisconnect'));
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

        this.dispatchEvent(new CustomEvent('componentrender'));
    }

    protected handleComponentConnect(event: CustomEvent): void {}

    protected handleComponentCreate(event: CustomEvent): void {}

    protected handleComponentDisconnect(event: CustomEvent): void {}

    protected handleComponentReady(event: CustomEvent): void {}

    protected handleComponentRender(event: CustomEvent): void {}

    protected handleComponentUpdate(event: CustomEvent): void {}

    public constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.addEventListener('componentconnect', (event: CustomEvent) => this.handleComponentConnect(event));
        this.addEventListener('componentcreate', (event: CustomEvent) => this.handleComponentCreate(event));
        this.addEventListener('componentdisconnect', (event: CustomEvent) => this.handleComponentDisconnect(event));
        this.addEventListener('componentready', (event: CustomEvent) => this.handleComponentReady(event));
        this.addEventListener('componentrender', (event: CustomEvent) => this.handleComponentRender(event));
        this.addEventListener('componentupdate', (event: CustomEvent) => this.handleComponentUpdate(event));

        this.dispatchEvent(new CustomEvent('componentcreate'));
    }

    public render(): VirtualElement[] {
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

        this.dispatchEvent(new CustomEvent('componentupdate'));

        window.requestAnimationFrame(() => {
            this.renderedCallback();
        });
    }
}
