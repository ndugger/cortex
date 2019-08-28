import Component from '../Component';
import Element from '../interfaces/Element';

import create from './create';

export default function connect<Constructor extends HTMLElement | SVGElement>(element: Element<Constructor>, host: HTMLElement | SVGElement | ShadowRoot): void {

    if (!element.constructor) {
        return;
    }

    if (!element.node) {
        element.node = create(element);
    }

    if (element.properties) for (const option of Object.keys(element.properties)) {

        if (option === 'namespaces') for (const [ name, space ] of Object.entries(element.properties[ option ])) {
            element.node.setAttributeNS('http://www.w3.org/2000/xmlns/', `xmlns:${ name }`, space);
            continue;
        }

        if (option === 'attributes') {

            for (const attribute of Array.from(element.node.attributes)) {

                if (!(attribute.name in element.properties.attributes) || element.properties.attributes[ attribute.name ] === false) {
                    element.node.removeAttributeNode(attribute);
                }
            }

            for (const [ attribute, object ] of Object.entries(element.properties.attributes)) {

                if (object === false || object === undefined || object === null) {
                    continue;
                }

                if (object === true) {
                    element.node.setAttribute(attribute, '');
                    continue;
                }

                if (typeof object === 'object') for (const [ key, value ] of Object.entries(object)) {

                    if (value === false || value === undefined || value === null) {
                        continue;
                    }

                    if ('namespaces' in element.properties && attribute in element.properties.namespaces) {
                        element.node.setAttributeNS(element.properties.namespaces[ attribute ], `${ attribute }:${ key }`, value.toString());
                    }
                    else {
                        const root = host.querySelector(`xmlns:${ attribute }`);

                        if (root) {
                            element.node.setAttributeNS(root.getAttribute(`xmlns:${ attribute }`), `${ attribute }:${ key }`, value.toString());
                        }
                        else {
                            element.node.setAttributeNS(null, key, value.toString());
                        }
                    }
                }
                else {
                    element.node.setAttribute(attribute, object as string);
                }

                continue;
            }

            continue;
        }

        if (element.node[ option ] === element.properties[ option ]) {
            continue;
        }

        if (element.node[ option ] && typeof element.node[ option ] === 'object' && !Array.isArray(element.properties[ option ])) {
            Object.assign(element.node[ option ], element.properties[ option ]);
        }
        else {
            element.node[ option ] = element.properties[ option ];
        }
    }

    if (element.node instanceof Element && !element.node.classList.contains(element.constructor.name)) {
        element.node.classList.add(element.constructor.name);
    }

    for (const child of element.children) if (child) {
        connect(child, element.node);
    }

    if (host !== element.node.parentNode) {
        host.appendChild(element.node);
    }
    else if (element.node instanceof Component) {
        element.node.update();
    }
}
