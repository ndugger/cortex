import { Element } from '../interfaces/Element';

const HTML_CLASS_NAME_LOOKUP = {
    [ HTMLAnchorElement.name ]: 'a',
    [ HTMLImageElement.name ]: 'img',
    [ HTMLOListElement.name ]: 'ol',
    [ HTMLParagraphElement.name ]: 'p',
    [ HTMLQuoteElement.name ]: 'q',
    [ HTMLUListElement.name ]: 'ul'
};

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export function create<Constructor extends HTMLElement | SVGElement>(element: Element<Constructor>): Constructor {

    /**
     * Invalid element.
     */
    if (!element.constructor) {
        return undefined;
    }

    /**
     * If incoming element's class is base HTML or SVG element, read tag from properties.
     */
    if ((element.constructor === HTMLElement || element.constructor === SVGElement) && !('tag' in element.properties)) {
        throw new Error(`Unable to create generic ${ element.constructor.name }: missing 'tag' from properties`);
    }

    let node: Constructor;

    if (element.constructor.name.endsWith('Element') && element.constructor.name in window) {

        if (element.constructor.name in HTML_CLASS_NAME_LOOKUP) {
            node = window.document.createElement(element.properties.tag) as Constructor;
        }
        else if (element.constructor as unknown === HTMLElement) {
            node = window.document.createElement(element.properties.tag) as Constructor;
        }
        else if (element.constructor.name.startsWith('HTML')) {

            if (element.properties && 'tag' in element.properties) {
                node = window.document.createElement(element.properties.tag) as Constructor;
            }

            node = window.document.createElement(element.constructor.name.replace(/HTML(.*?)Element/, '$1').toLowerCase()) as Constructor;
        }
        else if (element.constructor as unknown === SVGElement) {
            node = window.document.createElementNS(SVG_NAMESPACE, element.properties.tag) as Constructor;
        }
        else if (element.constructor.name.startsWith('SVG')) {

            if (element.properties && 'tag' in element.properties) {
                node = window.document.createElementNS(SVG_NAMESPACE, element.properties.tag) as Constructor;
            }

            node = window.document.createElementNS(SVG_NAMESPACE, element.constructor.name.replace(/SVG(.*?)Element/, '$1').replace(/^(FE|SVG|.)/, match => match.toLowerCase())) as Constructor;
        }
    }
    else {
        node = new element.constructor();
    }

    for (const child of element.children) if (child) {
        child.node = create(child);
        node.appendChild(child.node);
    }

    return node;
}
