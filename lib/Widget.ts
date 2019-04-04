import HTMLElementProxy from '../core/HTMLElementProxy';
import * as Utilities from '../core/Utilities';
import Node from './Node';
import Store from './Store';

export default class Widget<StateType = any> extends HTMLElementProxy {

    public nodes: Node[];

    protected initialState: StateType = null;
    protected state: Store<StateType> = null;

    public onwidgetconnect: (event: Event) => void;
    public onwidgetcreate: (event: Event) => void;
    public onwidgetdisconnect: (event: Event) => void;
    public onwidgetready: (event: Event) => void;
    public onwidgetrender: (event: Event) => void;
    public onwidgetupdate: (event: Event) => void;

    private connectedCallback(): void {

        if (this.initialState !== undefined) {
            this.state = new Store<StateType>(this.initialState || undefined);
            this.state.observe(this);

            // delete this.initialState;
        }

        const widgetConnect = new CustomEvent('widgetconnect');

        if (this.onwidgetconnect) {
            this.onwidgetconnect(widgetConnect);
        }

        this.dispatchEvent(widgetConnect);

        window.requestAnimationFrame(() => {
            this.renderedCallback();

            if (!this.classList.contains(this.constructor.name)) {
                this.className = this.constructor.name + (this.className ? ' ' : '') + this.className;
            }

            window.requestAnimationFrame(() => {
                const widgetReady = new CustomEvent('widgetready');

                if (this.onwidgetready) {
                    this.onwidgetready(widgetReady);
                }

                this.dispatchEvent(widgetReady);
            });
        });
    }

    private disconnectedCallback(): void {
        const widegetDisconnect = new CustomEvent('widgetdisconnect');

        if (this.onwidgetdisconnect) {
            this.onwidgetdisconnect(widegetDisconnect);
        }

        this.dispatchEvent(widegetDisconnect);
    }

    private renderedCallback(): void {
        const style = this.theme();
        const tree = Utilities.diffTree(this.nodes, this.render());
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

        this.nodes = tree;

        for (const node of this.nodes) {
            node.connect(this.shadowRoot);
        }

        const widgetRender = new CustomEvent('widgetrender');

        if (this.onwidgetrender) {
            this.onwidgetrender(widgetRender);
        }

        this.dispatchEvent(widgetRender);
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

        this.addEventListener('widgetconnect', event => this.handleWidgetConnect(event));
        this.addEventListener('widgetcreate', event => this.handleWidgetCreate(event));
        this.addEventListener('widgetdisconnect', event => this.handleWidgetDisconnect(event));
        this.addEventListener('widgetready', event => this.handleWidgetReady(event));
        this.addEventListener('widgetrender', event => this.handleWidgetRender(event));
        this.addEventListener('widgetupdate', event => this.handleWidgetUpdate(event));
        this.attachShadow({ mode: 'open' });

        const widgetCreate = new CustomEvent('widgetcreate');

        if (this.onwidgetcreate) {
            this.onwidgetcreate(widgetCreate);
        }

        this.dispatchEvent(widgetCreate);
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

        const widgetUpdate = new CustomEvent('widgetupdate');

        if (this.onwidgetupdate) {
            this.onwidgetupdate(widgetUpdate);
        }

        this.dispatchEvent(widgetUpdate);
    }
}
