"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachHook = void 0;
const Component_1 = require("../Component");
function attachHook(hook) {
    return Component_1.Component.getCurrentBranch().attachHook(hook);
}
exports.attachHook = attachHook;
