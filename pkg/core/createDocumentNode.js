"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentNode = void 0;
const Element_1 = require("../Element");
const mapComponentToTag_1 = require("./mapComponentToTag");
const HTML_CLASS_NAME_LOOKUP = {
    [HTMLAnchorElement.name]: 'a',
    [HTMLImageElement.name]: 'img',
    [HTMLOListElement.name]: 'ol',
    [HTMLParagraphElement.name]: 'p',
    [HTMLQuoteElement.name]: 'q',
    [HTMLTableRowElement.name]: 'tr',
    [HTMLUListElement.name]: 'ul'
};
const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
function createDocumentNode(element) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    let node;
    if (Element_1.Element.isNative(element)) {
        /**
         * If incoming element's type is base HTML or SVG element, read tag from properties.
         */
        if ((element.constructor === HTMLElement || element.constructor === SVGElement) && !((_b = (_a = element) === null || _a === void 0 ? void 0 : _a.properties) === null || _b === void 0 ? void 0 : _b.is)) {
            throw new Error(`Unable to construct generic ${element.constructor.name}: missing 'tag' from properties`);
        }
        if (element.constructor.name in HTML_CLASS_NAME_LOOKUP) {
            node = window.document.createElement(HTML_CLASS_NAME_LOOKUP[element.constructor.name]);
        }
        else if (element.constructor === HTMLElement) {
            node = window.document.createElement((_d = (_c = element.properties) === null || _c === void 0 ? void 0 : _c.is) !== null && _d !== void 0 ? _d : mapComponentToTag_1.mapComponentToTag(HTMLUnknownElement));
        }
        else if (element.constructor.name.startsWith('HTML')) {
            if ((_e = element === null || element === void 0 ? void 0 : element.properties) === null || _e === void 0 ? void 0 : _e.is) {
                node = window.document.createElement(element.properties.is);
            }
            else {
                node = window.document.createElement(element.constructor.name.replace(/HTML(.*?)Element/, '$1').toLowerCase());
            }
        }
        else if (element.constructor === SVGElement) {
            node = window.document.createElementNS(SVG_NAMESPACE, (_g = (_f = element.properties) === null || _f === void 0 ? void 0 : _f.is) !== null && _g !== void 0 ? _g : mapComponentToTag_1.mapComponentToTag(HTMLUnknownElement));
        }
        else if (element.constructor.name.startsWith('SVG')) {
            if (element.properties && 'is' in element.properties) {
                node = window.document.createElementNS(SVG_NAMESPACE, (_j = (_h = element.properties) === null || _h === void 0 ? void 0 : _h.is) !== null && _j !== void 0 ? _j : mapComponentToTag_1.mapComponentToTag(HTMLUnknownElement));
            }
            node = window.document.createElementNS(SVG_NAMESPACE, element.constructor.name.replace(/SVG(.*?)Element/, '$1').replace(/^(FE|SVG|.)/, match => match.toLowerCase()));
        }
        else {
            node = window.document.createElement(mapComponentToTag_1.mapComponentToTag(HTMLUnknownElement));
        }
    }
    else {
        node = new element.constructor();
    }
    for (const child of element.children)
        if (child) {
            child.node = createDocumentNode(child);
        }
    return node;
}
exports.createDocumentNode = createDocumentNode;
