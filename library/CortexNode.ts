import CortexComponent from './CortexComponent';
import CortexFragment from './CortexFragment';

import * as constants from './core/constants';

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

    public static getElement(node: CortexNode): Element {
        return node.element;
    }

    private children: CortexNode[];
    private element: Element;
    private properties: Properties;
    private type: Type;

    private constructor(type: Type, properties: Properties = null, children: CortexNode[] = []) {
        this.children = children.flat().filter(Boolean).map(child => child instanceof CortexNode ? child : CortexNode.create(Text, { textContent: child }));
        this.element = null;
        this.properties = properties;
        this.type = type;
    }

    public connect(host: ShadowRoot | Element): void {

        if (this.element === null) {
            this.create();
        }

        if (this.properties !== null) for (const option of Object.keys(this.properties)) {

            if (option === 'namespaces') for (const [ name, space ] of Object.entries(this.properties[ option ])) {
                this.element.setAttributeNS(constants.XML_NAMESPACE, `xmlns:${ name }`, space);

                continue;
            }

            if (option === 'attributes') {

                for (const attribute of Array.from(this.element[ option ])) {

                    if (!(attribute.name in this.properties[ option ]) || this.properties[ option ][ attribute.name ] === false) {
                        this.element.removeAttributeNode(attribute);
                    }
                }

                for (const [ attribute, object ] of Object.entries(this.properties[ option ])) {

                    if (object === false || object === undefined || object === null) {
                        continue;
                    }

                    if (object === true) {
                        this.element.setAttribute(attribute, '');

                        continue;
                    }

                    if (typeof object === 'object') for (const [ key, value ] of Object.entries(object)) {

                        if (value === false || value === undefined || value === null) {
                            continue;
                        }

                        if ('namespaces' in this.properties && attribute in this.properties.namespaces) {
                            this.element.setAttributeNS(this.properties.namespaces[ attribute ], `${ attribute }:${ key }`, value as string);
                        }
                        else {
                            const root = host.querySelector(`xmlns:${ attribute }`);

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

            if (this.element[ option ] === this.properties[ option ]) {
                continue;
            }

            if (this.element[ option ] && typeof this.element[ option ] === 'object' && !Array.isArray(this.properties[ option ])) {
                Object.assign(this.element[ option ], this.properties[ option ]);
            }
            else {
                this.element[ option ] = this.properties[ option ];
            }
        }

        if (!(this.element instanceof Text) && !(this.element instanceof DocumentFragment) && !this.element.classList.contains(this.type.name)) {
            this.element.classList.add(this.type.name);
        }

        for (const child of this.children) if (child) {

            if (Array.isArray(child)) for (const sub of child) {

                if (sub) {
                    sub.connect(this.element);
                }
            }
            else if (child instanceof CortexNode) {
                child.connect(this.element);
            }
        }

        if (this.element instanceof CortexFragment) {
            CortexNode.create(HTMLStyleElement, { textContent: this.element.theme() }).connect(this.element);

            for (const node of this.element.render()) {
                node.connect(this.element);
            }
        }

        if (host !== this.element.parentNode) {

            host.append(this.element);
        }
        else if (this.element instanceof CortexComponent) {
            this.element.update();
        }
    }

    public create(): void {

        if ((this.type === HTMLElement || this.type === SVGElement) && !('tag' in this.properties)) {
            throw new Error(`Unable to create generic ${ this.type.name }: missing 'tag' from properties`);
        }

        if ((this.type.name.startsWith('HTML') || this.type.name.startsWith('SVG')) && this.type.name.endsWith('Element')) {

            if (this.type.name in constants.HTML_CLASS_NAME_LOOKUP) {
                this.element = document.createElement(constants.HTML_CLASS_NAME_LOOKUP[ this.type.name ]);
            }
            else if (this.type === HTMLElement) {
                this.element = document.createElement(this.properties.tag);
            }
            else if (this.type === SVGElement) {
                this.element = document.createElementNS(constants.SVG_NAMESPACE, this.properties.tag);
            }
            else {

                if (this.type.name.startsWith('HTML')) {
                    const tag = this.type.name.replace(/HTML(.*?)Element/, '$1').toLowerCase();

                    this.element = document.createElement(tag);
                }

                if (this.type.name.startsWith('SVG')) {
                    const tag = this.type.name.replace(/SVG(.*?)Element/, '$1').replace(/^(FE|SVG|.)/, match => match.toLowerCase());

                    this.element = document.createElementNS(constants.SVG_NAMESPACE, tag);
                }
            }
        }
        else {
            this.element = new this.type() as Element;
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
        this.element.remove();
    }

    public diff(node: CortexNode | void): CortexNode | void {

        if (!node) {
            this.remove();

            return;
        }

        if (this.type !== node.type) {
            this.remove();
            node.create();

            return node;
        }

        if (this.children.length >= node.children.length) {
            return Object.assign(this, {
                children: this.children.filter(Boolean).map((child, index) => child.diff(node.children[ index ])),
                properties: node.properties
            });
        }
        else {
            return Object.assign(this, {
                children: node.children.filter(Boolean).map((child, index) => {

                    if (index + 1 > this.children.length) {
                        child.create();

                        return child;
                    }
                    else {
                        return this.children[ index ].diff(child);
                    }
                }),
                properties: node.properties
            });
        }
    }
}
