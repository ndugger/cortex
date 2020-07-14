import { Tag } from "./Tag";
export var Element;
(function (Element) {
    /**
     * Determines if constructor is a custom element
     * @param element
     */
    function isCustom(element) {
        return Boolean(window.customElements.get(Tag.of(element.constructor)));
    }
    Element.isCustom = isCustom;
    /**
     * Determines if constructor is a built-in element type
     * @param constructor
     */
    function isNative(element) {
        return (
            element.constructor.name in globalThis &&
            element.constructor.name.endsWith("Element")
        );
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
})(Element || (Element = {}));
//# sourceMappingURL=Element.js.map
