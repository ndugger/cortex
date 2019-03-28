import HTMLElementProxy from 'core/HTMLElementProxy';
import * as Utilities from 'core/Utilities';
import Node from 'lib/Node';

export default class Widget extends HTMLElementProxy {

    public static readonly tag = 'x-widget';

    private tree: Node[];

    protected options: any;

    private connectedCallback(): void {
        this.dispatchEvent(new CustomEvent('connect'));

        window.requestAnimationFrame(() => {
            this.renderCallback();

            window.requestAnimationFrame(() => {
                this.dispatchEvent(new CustomEvent('ready'));
            });
        });
    }

    private disconnectedCallback(): void {
        this.dispatchEvent(new CustomEvent('disconnect'));
    }

    private renderCallback(): void {
        const tree = Utilities.diffTree(this.tree, this.render());
        const existing = Array.from(this.shadowRoot.children);
        const incoming = tree.map(node => Reflect.get(node, 'element'));

        for (const child of existing) {

            if (!incoming.includes(child)) {
                child.remove();
            }
        }

        for (const node of tree) {
            node.connect(this.shadowRoot);
        }

        this.dispatchEvent(new CustomEvent('render'));
    }

    private handleWidgetConnect(event: Event): void {
        event; // override
    }

    private handleWidgetCreate(event: Event): void {
        event; // override
    }

    private handleWidgetDisconnect(event: Event): void {
        event; // override
    }

    private handleWidgetReady(event: Event): void {
        event; // override
    }

    private handleWidgetRender(event: Event): void {
        event; // override
    }

    private handleWidgetUpdate(event: Event): void {
        event; // override
    }

    public constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.addEventListener('connect', event => this.handleWidgetConnect(event));
        this.addEventListener('create', event => this.handleWidgetCreate(event));
        this.addEventListener('disconnect', event => this.handleWidgetDisconnect(event));
        this.addEventListener('ready', event => this.handleWidgetReady(event));
        this.addEventListener('render', event => this.handleWidgetRender(event));
        this.addEventListener('update', event => this.handleWidgetUpdate(event));

        this.dispatchEvent(new CustomEvent('create'));
    }

    public update() {
        window.requestAnimationFrame(() => {
            this.renderCallback();
        });

        this.dispatchEvent(new CustomEvent('update'));
    }

    public render(): Node[] {
        return []; // override
    }
}
