import HTMLElementProxy from '../core/HTMLElementProxy';
import * as Utilities from '../core/Utilities';
import Node from './Node';

export default class Widget extends HTMLElementProxy {

    private tree: Node[];

    private connectedCallback(): void {
        this.dispatchEvent(new CustomEvent('widgetconnect'));

        window.requestAnimationFrame(() => {
            this.renderedCallback();

            window.requestAnimationFrame(() => {
                this.dispatchEvent(new CustomEvent('widgetready'));
            });
        });
    }

    private disconnectedCallback(): void {
        this.dispatchEvent(new CustomEvent('widgetdisconnect'));
    }

    private renderedCallback(): void {
        const style = this.design();
        const tree = Utilities.diffTree(this.tree, this.render());
        const existing = Array.from(this.shadowRoot.children);
        const incoming = tree.map(node => Reflect.get(node, 'element'));

        for (const child of existing) {

            if (!incoming.includes(child)) {
                child.remove();
            }
        }

        if (style) {
            new Node(HTMLStyleElement, { textContent: style }).connect(this.shadowRoot);
        }

        this.tree = tree;

        for (const node of this.tree) {
            node.connect(this.shadowRoot);
        }

        this.dispatchEvent(new CustomEvent('widgetrender'));
    }

    protected handleWidgetConnect(event: Event): void {
        event; // override
    }

    protected handleWidgetCreate(event: Event): void {
        event; // override
    }

    protected handleWidgetDisconnect(event: Event): void {
        event; // override
    }

    protected handleWidgetReady(event: Event): void {
        event; // override
    }

    protected handleWidgetRender(event: Event): void {
        event; // override
    }

    protected handleWidgetUpdate(event: Event): void {
        event; // override
    }

    public constructor() {
        super();

        this.attachShadow({ mode: 'open' });

        this.addEventListener('widgetconnect', event => this.handleWidgetConnect(event));
        this.addEventListener('widgetcreate', event => this.handleWidgetCreate(event));
        this.addEventListener('widgetdisconnect', event => this.handleWidgetDisconnect(event));
        this.addEventListener('widgetready', event => this.handleWidgetReady(event));
        this.addEventListener('widgetrender', event => this.handleWidgetRender(event));
        this.addEventListener('widgetupdate', event => this.handleWidgetUpdate(event));

        this.dispatchEvent(new CustomEvent('widgetcreate'));
    }

    public design(): string {
        return ''; // override
    }

    public render(): Node[] {
        return []; // override
    }

    public update(): void {
        window.requestAnimationFrame(() => {
            this.renderedCallback();
        });

        this.dispatchEvent(new CustomEvent('widgetupdate'));
    }
}
