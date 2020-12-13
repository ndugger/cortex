"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = void 0;
const createElement_1 = require("./core/createElement");
const mapComponentToTag_1 = require("./core/mapComponentToTag");
var Element;
(function (Element) {
    Element.create = createElement_1.createElement;
    /**
     * Determines if constructor is a custom element
     * @param element
     */
    function isCustom(element) {
        return Boolean(window.customElements.get(mapComponentToTag_1.mapComponentToTag(element.constructor)));
    }
    Element.isCustom = isCustom;
    /**
     * Determines if constructor is a built-in element type
     * @param constructor
     */
    function isNative(element) {
        return element.constructor.name in globalThis && element.constructor.name.endsWith('Element');
    }
    Element.isNative = isNative;
    /**
     * Determines if constructor is a text node
     * @param element
     */
    function isText(element) {
        return element.constructor === Text;
    }
    Element.isText = isText;
})(Element = exports.Element || (exports.Element = {}));
