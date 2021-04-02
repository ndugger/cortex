"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContext = void 0;
const Component_1 = require("../Component");
function getContext(context) {
    return Component_1.Component.getCurrentBranch().getContext(context);
}
exports.getContext = getContext;
