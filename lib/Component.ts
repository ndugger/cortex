import HTMLElementProxy from '../core/HTMLElementProxy';
import { diffTree } from '../core/Utilities';

import Node from './Node';

export default class Component extends HTMLElementProxy {

    public nodes: Node[];

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

    public render(): Node[] {
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
