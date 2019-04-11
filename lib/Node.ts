import Widget from './Widget';

interface ElementClass<ElementType> {
    new(): ElementType;
};

interface ElementOptions {
    [ key: string ]: any;
    attributes?: {
        [ key: string ]: any;
    };
    namespaces?: {
        [ key: string ]: string;
    };
    style?: Partial<CSSStyleDeclaration>;
    tag?: string;
}

type DOMElement = Partial<Element & (HTMLElement | SVGElement)> & ElementOptions;
type WritableElement<ElementType extends DOMElement> = Partial<ElementType> | ElementOptions;

const htmlClassNameLookup = {
    HTMLAnchorElement: 'a',
    HTMLOListElement: 'ol',
    HTMLParagraphElement: 'p',
    HTMLUListElement: 'ul'
};

const svgNamespace = 'http://www.w3.org/2000/svg';
const xmlNamespace = 'http://www.w3.org/2000/xmlns/';

export type JSXElement = WritableElement<Element>;

export default class Node<ElementType extends DOMElement = DOMElement> {

    public static getElement(node: Node): Element {
        return node.element;
    }

    public static jsxFactory<ElementType extends DOMElement = DOMElement>(type: ElementClass<ElementType>, options: WritableElement<ElementType> = null, ...children: Node[]): Node<ElementType> {
        return new Node(type, options, children);
    }

    private children: Node[];
    private element: Element;
    private options: WritableElement<ElementType>;
    private type: ElementClass<ElementType>;

    public constructor(type: ElementClass<ElementType>, options: WritableElement<ElementType> = null, children: Node[] = []) {
        this.children = children.flat();
        this.element = null;
        this.options = options;
        this.type = type;
    }

    public connect(host: ShadowRoot | Element): void {

        if (this.element === null) {
            this.create();
        }

        if (this.options !== null) for (const option of Object.keys(this.options)) {

            if (option === 'namespaces') for (const [ name, space ] of Object.entries(this.options[ option ])) {
                this.element.setAttributeNS(xmlNamespace, `xmlns:${ name }`, space);

                continue;
            }

            if (option === 'attributes') {

                for (const attribute of Array.from(this.element[ option ])) {

                    if (!(attribute.name in this.options[ option ]) || this.options[ option ][ attribute.name ] === false) {
                        this.element.removeAttributeNode(attribute);
                    }
                }

                for (const [ attribute, object ] of Object.entries(this.options[ option ])) {

                    if (object === false) {
                        continue;
                    }

                    if (object === true) {
                        this.element.setAttribute(attribute, ''); // TODO do the same for namespaced attributes below

                        continue;
                    }

                    if (typeof object === 'object') for (const [ key, value ] of Object.entries(object)) {

                        if (value === false) {
                            continue;
                        }

                        if ('namespaces' in this.options && attribute in this.options.namespaces) {
                            this.element.setAttributeNS(this.options.namespaces[ attribute ], `${ attribute }:${ key }`, value as string);
                        }
                        else {
                            const root = document.querySelector(`xmlns:${ attribute }`);

                            if (root) {
                                this.element.setAttributeNS(root.getAttribute(`xmlns:${ attribute }`), `${ attribute }:${ key }`, value as string);
                            }
                            else {
                                this.element.setAttributeNS(null, key, value as string);
                            }
                        }
                    }
                    else {
                        this.element.setAttribute(attribute, object as string);
                    }

                    continue;
                }

                continue;
            }

            if (this.element[ option ] === this.options[ option ]) {
                continue;
            }

            if (this.element[ option ] && typeof this.element[ option ] === 'object' && !Array.isArray(this.options[ option ])) {
                Object.assign(this.element[ option ], this.options[ option ]);
            }
            else {
                this.element[ option ] = this.options[ option ];
            }
        }

        if (!this.element.classList.contains(this.type.name)) {
            this.element.classList.add(this.type.name);
        }

        for (const child of this.children) if (child) {

            if (Array.isArray(child)) for (const sub of child) {

                if (sub) {
                    sub.connect(this.element);
                }
            }
            else {
                child.connect(this.element);
            }
        }

        if (host !== this.element.parentNode) {
            host.append(this.element);
        }
        else if (this.element instanceof Widget) {
            this.element.update();
        }
    }

    public create(): void {

        if ((this.type === HTMLElement || this.type === SVGElement) && !('tag' in this.options)) {
            throw new Error(`Unable to create generic ${ this.type.name }: missing 'tag' from options`);
        }

        if ((this.type.name.startsWith('HTML') || this.type.name.startsWith('SVG')) && this.type.name.endsWith('Element')) {

            if (this.type.name in htmlClassNameLookup) {
                this.element = document.createElement(htmlClassNameLookup[ this.type.name ]);
            }
            else if (this.type === HTMLElement) {
                this.element = document.createElement(this.options.tag);
            }
            else if (this.type === SVGElement) {
                this.element = document.createElementNS(svgNamespace, this.options.tag);
            }
            else {

                if (this.type.name.startsWith('HTML') && this.type.name.endsWith('Element')) {
                    const tag = this.type.name.replace(/HTML(.*?)Element/, '$1').toLowerCase();

                    this.element = document.createElement(tag);
                }

                if (this.type.name.startsWith('SVG') && this.type.name.endsWith('Element')) {
                    const tag = this.type.name.replace(/SVG(.*?)Element/, '$1').replace(/^(FE|SVG|.)/, char => char.toLowerCase());

                    this.element = document.createElementNS(svgNamespace, tag);
                }
            }
        }
        else {
            this.element = Reflect.construct(this.type, []);
        }

        for (const child of this.children) if (child) {

            if (Array.isArray(child)) for (const sub of child) {

                if (sub) {
                    sub.create();
                }
            }
            else {
                child.create();
            }
        }
    }

    public remove(): void {
        this.element.remove();
    }

    public diff(node: Node | void): Node | void {

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
