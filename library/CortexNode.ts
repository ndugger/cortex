import CortexComponent from './CortexComponent';
import CortexFragment from './CortexFragment';
import CortexTree from './CortexTree';

const HTML_CLASS_NAME_LOOKUP = {
    [ HTMLAnchorElement.name ]: 'a',
    [ HTMLImageElement.name ]: 'img',
    [ HTMLOListElement.name ]: 'ol',
    [ HTMLParagraphElement.name ]: 'p',
    [ HTMLQuoteElement.name ]: 'q',
    [ HTMLUListElement.name ]: 'ul'
};
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
const XML_NAMESPACE = 'http://www.w3.org/2000/xmlns/';

type InstantiableElement = typeof Text | (Partial<(HTMLElement | SVGElement)> & {
    new(data?: string): HTMLElement | SVGElement;
});

export type Properties = Partial<Pick<Element, Exclude<keyof Element, 'attributes'>>> & {
    attributes?: {
        [ K: string ]: any
    };
    namespaces?: {
        [ K: string ]: string;
    };
    tag?: string;
};

export default class CortexNode<Type extends InstantiableElement = any> {

    public static create<Type extends InstantiableElement>(type: Type, properties: Properties = null, ...children: CortexNode[]): CortexNode {
        return new CortexNode(type, properties, children);
    }

    public static getNode(node: CortexNode): Node {
        return node ? node.dom : null;
    }

    private children: CortexTree;
    private dom: Element;
    private properties: Properties;
    private type: Type;

    private constructor(type: Type, properties: Properties = null, children: CortexNode[] = []) {
        this.children = CortexTree.from(children.flat().map(child => child instanceof CortexNode ? child : child ? CortexNode.create(Text, { textContent: child }) : null));
        this.dom = null;
        this.properties = properties;
        this.type = type;
    }

    public connect(host: DocumentFragment | Element): void {

        if (this.dom === null) {
            this.create();
        }

        if (this.properties !== null) for (const option of Object.keys(this.properties)) {

            if (option === 'namespaces') for (const [ name, space ] of Object.entries(this.properties[ option ])) {
                this.dom.setAttributeNS(XML_NAMESPACE, `xmlns:${ name }`, space);

                continue;
            }

            if (option === 'attributes') {

                for (const attribute of Array.from(this.dom[ option ])) {

                    if (!(attribute.name in this.properties[ option ]) || this.properties[ option ][ attribute.name ] === false) {
                        this.dom.removeAttributeNode(attribute);
                    }
                }

                for (const [ attribute, object ] of Object.entries(this.properties[ option ])) {

                    if (object === false || object === undefined || object === null) {
                        continue;
                    }

                    if (object === true) {
                        this.dom.setAttribute(attribute, '');

                        continue;
                    }

                    if (typeof object === 'object') for (const [ key, value ] of Object.entries(object)) {

                        if (value === false || value === undefined || value === null) {
                            continue;
                        }

                        if ('namespaces' in this.properties && attribute in this.properties.namespaces) {
                            this.dom.setAttributeNS(this.properties.namespaces[ attribute ], `${ attribute }:${ key }`, value as string);
                        }
                        else {
                            const root = host.querySelector(`xmlns:${ attribute }`);

                            if (root) {
                                this.dom.setAttributeNS(root.getAttribute(`xmlns:${ attribute }`), `${ attribute }:${ key }`, value as string);
                            }
                            else {
                                this.dom.setAttributeNS(null, key, value as string);
                            }
                        }
                    }
                    else {
                        this.dom.setAttribute(attribute, object as string);
                    }

                    continue;
                }

                continue;
            }

            if (this.dom[ option ] === this.properties[ option ]) {
                continue;
            }

            if (this.dom[ option ] && typeof this.dom[ option ] === 'object' && !Array.isArray(this.properties[ option ])) {
                Object.assign(this.dom[ option ], this.properties[ option ]);
            }
            else {
                this.dom[ option ] = this.properties[ option ];
            }
        }

        if (!(this.dom instanceof Text) && !(this.dom instanceof CortexFragment) && !this.dom.classList.contains(this.type.name)) {
            this.dom.classList.add(this.type.name);
        }

        for (const child of this.children) if (child) {

            if (Array.isArray(child)) for (const sub of child) {

                if (sub) {
                    sub.connect(this.dom);
                }
            }
            else if (child instanceof CortexNode) {
                child.connect(this.dom);
            }
        }

        if (host !== this.dom.parentNode) {
            host.append(this.dom);
        }
        else if (this.dom instanceof CortexComponent) {
            this.dom.update();
        }
    }

    public create(): void {

        if ((this.type === HTMLElement || this.type === SVGElement) && !('tag' in this.properties)) {
            throw new Error(`Unable to create generic ${ this.type.name }: missing 'tag' from properties`);
        }

        if ((this.type.name.startsWith('HTML') || this.type.name.startsWith('SVG')) && this.type.name.endsWith('Element')) {

            if (this.type.name in HTML_CLASS_NAME_LOOKUP) {
                this.dom = document.createElement(HTML_CLASS_NAME_LOOKUP[ this.type.name ]);
            }
            else if (this.type === HTMLElement) {
                this.dom = document.createElement(this.properties.tag);
            }
            else if (this.type === SVGElement) {
                this.dom = document.createElementNS(SVG_NAMESPACE, this.properties.tag);
            }
            else {

                if (this.type.name.startsWith('HTML')) {
                    const tag = this.type.name.replace(/HTML(.*?)Element/, '$1').toLowerCase();

                    this.dom = document.createElement(tag);
                }

                if (this.type.name.startsWith('SVG')) {
                    const tag = this.type.name.replace(/SVG(.*?)Element/, '$1').replace(/^(FE|SVG|.)/, match => match.toLowerCase());

                    this.dom = document.createElementNS(SVG_NAMESPACE, tag);
                }
            }
        }
        else {
            this.dom = new this.type() as Element;
        }

        for (const child of this.children) if (child) {

            if (Array.isArray(child)) for (const sub of child) {

                if (sub) {
                    sub.create();
                }
            }
            else if (child instanceof CortexNode) {
                child.create();
            }
        }
    }

    public remove(): void {
        if (!this.dom || !this.dom.parentNode) return;
        this.dom.parentNode.removeChild(this.dom);
    }

    public diff(node: CortexNode): CortexNode {

        if (!node) {
            this.remove();

            return null;
        }

        if (this.type !== node.type) {
            return node || null;
        }

        if (this.children.length >= node.children.length) {
            return Object.assign(this, {
                children: CortexTree.from(this.children.map((child, index) => {
                    return child ? child.diff(node.children[ index ]) : node.children[ index ] || null;
                })),
                properties: node.properties
            });
        }
        else {
            return Object.assign(this, {
                children: CortexTree.from(node.children.map((child, index) => {

                    if (index + 1 > this.children.length) {
                        return child || null;
                    }
                    else {
                        return this.children[ index ] ? this.children[ index ].diff(child) : child || null;
                    }
                })),
                properties: node.properties
            });
        }
    }
}
