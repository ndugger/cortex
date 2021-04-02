"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHook = void 0;
const Component_1 = require("../Component");
function useHook(hook) {
    return Component_1.Component.getCurrentBranch().useHook(hook);
}
exports.useHook = useHook;
