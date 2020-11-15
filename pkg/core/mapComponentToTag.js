"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapComponentToTag = void 0;
const defineCustomElement_1 = require("./defineCustomElement");
function mapComponentToTag(type) {
    var _a;
    if (defineCustomElement_1.tags.has(type)) {
        return (_a = defineCustomElement_1.tags.get(type)) !== null &&
            _a !== void 0
            ? _a
            : "unknown";
    }
    if (!type.name) {
        return "unknown";
    }
    return `${type.name
        .replace(/([A-Z])/g, (c) => `-${c.toLowerCase()}`)
        .replace(/^-/, "")}-component`;
}
exports.mapComponentToTag = mapComponentToTag;
//# sourceMappingURL=mapComponentToTag.js.map
