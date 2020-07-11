import { Element } from '../Element';
import { Tag } from 'src/Tag';

const HTML_CLASS_NAME_LOOKUP = {
    [ HTMLAnchorElement.name ]: 'a',
    [ HTMLImageElement.name ]: 'img',
    [ HTMLOListElement.name ]: 'ol',
    [ HTMLParagraphElement.name ]: 'p',
    [ HTMLQuoteElement.name ]: 'q',
    [ HTMLUListElement.name ]: 'ul'
};

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export function create<Constructor extends Node>(element: Element<Constructor>): Constructor | undefined {
    let node: Node

    if (Element.isNative(element)) {

        /**
         * If incoming element's type is base HTML or SVG element, read tag from properties.
         */
        if ((element.constructor === HTMLElement || element.constructor === SVGElement) && !(element as Element)?.properties?.tag) {
            throw new Error(`Unable to construct generic ${ (element as Element).constructor.name }: missing 'tag' from properties`)
        }

        if (element.constructor.name in HTML_CLASS_NAME_LOOKUP) {
            node = window.document.createElement(HTML_CLASS_NAME_LOOKUP[ element.constructor.name ])
        }
        else if (element.constructor as unknown === HTMLElement) {
            node = window.document.createElement(element.properties?.tag ?? Tag.of(HTMLUnknownElement))
        }
        else if (element.constructor.name.startsWith('HTML')) {

            if (element?.properties?.tag) {
                node = window.document.createElement(element.properties.tag)
            }

            node = window.document.createElement(element.constructor.name.replace(/HTML(.*?)Element/, '$1').toLowerCase())
        }
        else if (element.constructor as unknown === SVGElement) {
            node = window.document.createElementNS(SVG_NAMESPACE, element.properties?.tag ?? Tag.of(HTMLUnknownElement))
        }
        else if (element.constructor.name.startsWith('SVG')) {

            if (element.properties && 'tag' in element.properties) {
                node = window.document.createElementNS(SVG_NAMESPACE, element.properties?.tag ?? Tag.of(HTMLUnknownElement))
            }

            node = window.document.createElementNS(SVG_NAMESPACE, element.constructor.name.replace(/SVG(.*?)Element/, '$1').replace(/^(FE|SVG|.)/, match => match.toLowerCase()))
        }
        else {
            node = window.document.createElement(Tag.of(HTMLUnknownElement))
        }
    }
    else {
        node = new element.constructor()
    }

    for (const child of element.children) if (child) {
        child.node = create(child)

        if (child.node) {
            node.appendChild(child.node)
        }
    }

    return node as Constructor
}
