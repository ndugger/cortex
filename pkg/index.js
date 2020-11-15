"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Portal = exports.Context = exports.Fragment = exports.Element = exports.Component = exports.tag = exports.createElement = void 0;
const Component_1 = require("./Component");
Object.defineProperty(exports, "Component", { enumerable: true, get: function () { return Component_1.Component; } });
var createElement_1 = require("./core/createElement");
Object.defineProperty(exports, "createElement", { enumerable: true, get: function () { return createElement_1.createElement; } });
var defineCustomElement_1 = require("./core/defineCustomElement"); // aliased temporarily until new decorators implementation
Object.defineProperty(exports, "tag", { enumerable: true, get: function () { return defineCustomElement_1.defineCustomElement; } });
var Component_2 = require("./Component");
Object.defineProperty(exports, "Component", { enumerable: true, get: function () { return Component_2.Component; } });
var Element_1 = require("./Element");
Object.defineProperty(exports, "Element", { enumerable: true, get: function () { return Element_1.Element; } });
var Fragment_1 = require("./Fragment");
Object.defineProperty(exports, "Fragment", { enumerable: true, get: function () { return Fragment_1.Fragment; } });
exports.Context = Component_1.Component.Context;
exports.Portal = Component_1.Component.Portal;
//# sourceMappingURL=index.js.map