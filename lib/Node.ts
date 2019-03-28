import Widget from 'lib/Widget';

interface ElementClass {
    new(): Element;
    __proto__?: any;
};

export default class Node {

    public static getElement(node: Node): Element {
        return node.element;
    }

    private children: Node[];
    private element: Element;
    private options: any;
    private type: ElementClass;

    public constructor(type: ElementClass, options: any = {}, children: Node[] = []) {
        this.children = children;
        this.element = null;
        this.options = options;
        this.type = type;
    }

    public connect(host: ShadowRoot | Element): void {

        if (this.element === null) {
            this.create();
        }

        for (const option of Object.keys(this.options)) {

            if (this.element[ option ] && typeof this.element[ option ] === 'object') {
                Object.assign(this.element[ option ], this.options[ option ]);
            }
            else {
                this.element[ option ] = this.options[ option ];
            }
        }

        for (const child of this.children) {
            child.connect(this.element);
        }

        if (host !== this.element.parentNode) {
            host.append(this.element);
        }
        else {
            (this.element as unknown as Widget).update();
        }
    }

    public create(): void {

        if (this.type.__proto__ === HTMLElement) {
            const name = this.type.name;
            const tag = name.replace(/HTML(.*?)Element/, '$1').toLowerCase();

            this.element = document.createElement(tag);
        }
        else {
            this.element = Reflect.construct(this.type, []);
        }

        for (const child of this.children) {
            child.create();
        }
    }

    public remove(): void {
        this.element.remove();
    }

    public diff(node: void | Node): void | Node {

        if (!node) {
            return this.remove();
        }

        if (this.type !== node.type) {
            this.remove();
            node.create();

            return node;
        }

        if (this.children.length > node.children.length) {
            return Object.assign(this, {
                children: this.children.map((child, index) => child.diff(node.children[ index ])),
                options: node.options
            });
        }
        else {
            return Object.assign(this, {
                children: node.children.map((child, index) => {

                    if (index + 1 > this.children.length) {
                        child.create();

                        return child;
                    }
                    else {
                        return this.children[ index ].diff(child);
                    }
                }),
                options: node.options
            });
        }
    }
}
