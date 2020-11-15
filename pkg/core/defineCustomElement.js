"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineCustomElement = exports.tags = void 0;
exports.tags = new Map();
function defineCustomElement(tag) {
    return (type) => {
        exports.tags.set(type, tag);
        return type;
    };
}
exports.defineCustomElement = defineCustomElement;
//# sourceMappingURL=defineCustomElement.js.map
