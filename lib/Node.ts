import Widget from './Widget';

interface ElementClass<ElementType> {
    new(): ElementType;
    __proto__?: any;
};

const htmlClassNameExceptions = {
    HTMLOListElement: 'ol',
    HTMLParagraphElement: 'p',
    HTMLUListElement: 'ul'
};

export default class Node<ElementType extends Element = Element> {

    public static getElement(node: Node<Element>): Element {
        return node.element;
    }

    private children: Node<Element>[];
    private element: Element;
    private options: { [ key in keyof ElementType ]?: any };
    private type: ElementClass<ElementType>;

    public constructor(type: ElementClass<ElementType>, options: { [ key in keyof ElementType ]?: any } = {}, children: Node<Element>[] = []) {
        this.children = children;
        this.element = null;
        this.options = options;
        this.type = type;
    }

    public connect(host: ShadowRoot | Element): void {

        if (this.element === null) {
            this.create();
        }

        if (this.options !== null) for (const option of Object.keys(this.options)) {

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
        else if (this.element instanceof Widget) {
            this.element.update();
        }
    }

    public create(): void {

        if (this.type.__proto__ === HTMLElement || this.type.__proto__ === SVGElement) {

            if (this.type.name in htmlClassNameExceptions) {
                this.element = document.createElement(htmlClassNameExceptions[ this.type.name ]);
            }
            else {
                const name = this.type.name;
                const tag = name.replace(/HTML(.*?)Element/, '$1').toLowerCase();

                this.element = document.createElement(tag);
            }
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

        if (this.children.length >= node.children.length) {
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
