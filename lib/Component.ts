import HTMLElementProxy from '../core/HTMLElementProxy';
import { diffTree } from '../core/Utilities';

import Node from './Node';
import Store from './Store';

export default class Component<StateType = any> extends HTMLElementProxy {

    public nodes: Node[];

    protected initialState: StateType;
    protected state: Store<StateType>;

    public oncomponentconnect: (event: Event) => void;
    public oncomponentcreate: (event: Event) => void;
    public oncomponentdisconnect: (event: Event) => void;
    public oncomponentready: (event: Event) => void;
    public oncomponentrender: (event: Event) => void;
    public oncomponentupdate: (event: Event) => void;

    private connectedCallback(): void {

        if (this.initialState !== undefined) {
            this.state = new Store<StateType>(this.initialState);
            this.state.observe(this);
        }

        this.dispatchEvent(new CustomEvent('componentconnect'));

        window.requestAnimationFrame(() => {
            this.renderedCallback();

            if (!this.classList.contains(this.constructor.name)) {
                this.className = this.constructor.name + (this.className ? ' ' : '') + this.className;
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
        const style = this.theme();
        const tree = diffTree(this.nodes, this.render());
        const existing = Array.from(this.shadowRoot.children);
        const incoming = tree.map(node => Node.getElement(node));

        for (const child of existing) {

            if (!incoming.includes(child)) {
                child.remove();
            }
        }

        if (style) {
            Node.create(HTMLStyleElement, { textContent: style }).connect(this.shadowRoot);
        }

        this.nodes = tree;

        for (const node of this.nodes) {
            node.connect(this.shadowRoot);
        }

        this.dispatchEvent(new CustomEvent('componentrender'));
    }

    protected handleWidgetConnect(event: CustomEvent): void {
        return; // override
    }

    protected handleWidgetCreate(event: CustomEvent): void {
        return; // override
    }

    protected handleWidgetDisconnect(event: CustomEvent): void {
        return; // override
    }

    protected handleWidgetReady(event: CustomEvent): void {
        return; // override
    }

    protected handleWidgetRender(event: CustomEvent): void {
        return; // override
    }

    protected handleWidgetUpdate(event: CustomEvent): void {
        return; // override
    }

    public constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.addEventListener('componentconnect', (event: CustomEvent) => this.handleWidgetConnect(event));
        this.addEventListener('componentcreate', (event: CustomEvent) => this.handleWidgetCreate(event));
        this.addEventListener('componentdisconnect', (event: CustomEvent) => this.handleWidgetDisconnect(event));
        this.addEventListener('componentready', (event: CustomEvent) => this.handleWidgetReady(event));
        this.addEventListener('componentrender', (event: CustomEvent) => this.handleWidgetRender(event));
        this.addEventListener('componentupdate', (event: CustomEvent) => this.handleWidgetUpdate(event));

        this.dispatchEvent(new CustomEvent('componentcreate'));
    }

    public render(): Node[] {
        return []; // override
    }

    public theme(): string {
        return ''; // override
    }

    public update(props: object = {}): void {
        Object.assign(this, props);

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

        window.requestAnimationFrame(() => {
            this.renderedCallback();
        });

        this.dispatchEvent(new CustomEvent('componentupdate'));
    }
}
