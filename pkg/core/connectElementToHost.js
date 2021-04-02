"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectElementToHost = void 0;
const Component_1 = require("../Component");
const Element_1 = require("../Element");
const Fragment_1 = require("../Fragment");
const createDocumentNode_1 = require("./createDocumentNode");
const XML_NAMESPACE = 'http://www.w3.org/2000/xmlns/';
function connectElementToHost(element, host) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    if (!element.constructor) {
        return;
    }
    /**
     * If node hasn't been initialized (unlikely), try again
     */
    if (!element.node) {
        element.node = createDocumentNode_1.createDocumentNode(element);
    }
    /**
     * If it still doesn't exist, something is probably wrong
     */
    if (!element.node) {
        console.error('Unable to create node for element:', element);
        return;
    }
    if (Element_1.Element.isText(element)) {
        Object.assign(element.node, element.properties);
    }
    else if ((Element_1.Element.isNative(element) || Element_1.Element.isCustom(element)) && element.properties) {
        for (const property of Object.keys(element.properties)) {
            /**
             * Add attribute namespaces to DOM node
             */
            if (property === 'namespaces') {
                for (const [name, space] of Object.entries((_a = element.properties[property]) !== null && _a !== void 0 ? _a : {})) {
                    (_b = element.node) === null || _b === void 0 ? void 0 : _b.setAttributeNS(XML_NAMESPACE, `xmlns:${name}`, space);
                }
            }
            /**
             * Add attributes to DOM node
             */
            if (property === 'attributes') {
                for (const attribute of Array.from((_d = (_c = element.node) === null || _c === void 0 ? void 0 : _c.attributes) !== null && _d !== void 0 ? _d : [])) {
                    /**
                     * Remove extra attributes
                     */
                    if (!(attribute.name in ((_e = element.properties[property]) !== null && _e !== void 0 ? _e : {})) || Reflect.get((_f = element.properties[property]) !== null && _f !== void 0 ? _f : {}, attribute.name) === false) {
                        element.node.removeAttributeNode(attribute);
                    }
                }
                for (const [attribute, object] of Object.entries((_g = element.properties[property]) !== null && _g !== void 0 ? _g : {})) {
                    /**
                     * Skip 'nulled' attributes
                     */
                    if (object === false || object === undefined || object === null) {
                        continue;
                    }
                    /**
                     * Apply attributes which are true as ones which are empty
                     * <HTMLDivElement hidden/>
                     */
                    if (object === true) {
                        (_h = element.node) === null || _h === void 0 ? void 0 : _h.setAttribute(attribute, '');
                    }
                    /**
                     * If attribute is an object, iterate over fields
                     */
                    if (typeof object === 'object')
                        for (const [key, value] of Object.entries(object)) {
                            /**
                             * Skip 'nulled' attributes
                             */
                            if (value === false || value === undefined || value === null) {
                                continue;
                            }
                            /**
                             * Apply namespaced attributes
                             */
                            if ('namespaces' in element.properties && attribute in ((_k = (_j = element.properties) === null || _j === void 0 ? void 0 : _j.namespaces) !== null && _k !== void 0 ? _k : {})) {
                                element.node.setAttributeNS(((_m = (_l = element.properties) === null || _l === void 0 ? void 0 : _l.namespaces) !== null && _m !== void 0 ? _m : {})[attribute], `${attribute}:${key}`, String(value));
                            }
                            else {
                                const root = host.querySelector(`xmlns:${attribute}`);
                                if (root) {
                                    element.node.setAttributeNS(root.getAttribute(`xmlns:${attribute}`), `${attribute}:${key}`, String(value));
                                }
                                else {
                                    element.node.setAttributeNS(null, key, String(value));
                                }
                            }
                        }
                    else {
                        element.node.setAttribute(attribute, String(object));
                    }
                    continue;
                }
            }
            /**
             * Allow direct child element insertion by first removing all children, then appending all to target node
             */
            if (property === 'children') {
                for (const child of Array.from((_o = element.node.children) !== null && _o !== void 0 ? _o : [])) {
                    element.node.removeChild(child);
                }
                if (typeof element.properties.children === 'string') {
                    element.node.appendChild(new Text(element.properties.children));
                }
                else
                    for (const child of Array.from((_p = element.properties.children) !== null && _p !== void 0 ? _p : [])) {
                        element.node.appendChild(child);
                    }
                continue;
            }
            /**
             * Allow direct child node insertion by first removing all child nodes, then appending all to target node
             */
            if (property === 'childNodes') {
                for (const childNode of Array.from((_q = element.node.childNodes) !== null && _q !== void 0 ? _q : [])) {
                    element.node.removeChild(childNode);
                }
                for (const childNode of Array.from((_r = element.properties.childNodes) !== null && _r !== void 0 ? _r : [])) {
                    element.node.appendChild(childNode);
                }
                continue;
            }
            if (element.node[property] === element.properties[property]) {
                continue;
            }
            if (element.node[property] && typeof element.node[property] === 'object' && !Array.isArray(element.properties[property])) {
                Object.assign(element.node[property], element.properties[property]);
            }
            else {
                element.node[property] = element.properties[property];
            }
        }
    }
    if (Element_1.Element.isNative(element) && !element.node.classList.contains(element.constructor.name)) {
        element.node.classList.add(element.constructor.name);
    }
    if (Fragment_1.Fragment.isFragment(element.node)) {
        if (element.properties)
            for (const property of Object.keys(element.properties)) {
                if (element.node[property] && typeof element.node[property] === 'object' && !Array.isArray(element.properties[property])) {
                    Object.assign(element.node[property], element.properties[property]);
                }
                else {
                    element.node[property] = element.properties[property];
                }
            }
        element.node.connect(element.children);
    }
    else
        for (const child of element.children)
            if (child) {
                connectElementToHost(child, element.node);
            }
    if (element.node instanceof Fragment_1.Fragment && typeof element.node.reflect === 'function') {
        element.node.reflect(); // OOF I may need to rearchitect some of this project due to circular dependencies
    }
    else if (host !== element.node.parentNode) {
        host.appendChild(element.node);
    }
    else if (Component_1.Component.isComponent(element.node)) {
        element.node.update(); // TODO only do if props changed?
    }
}
exports.connectElementToHost = connectElementToHost;
