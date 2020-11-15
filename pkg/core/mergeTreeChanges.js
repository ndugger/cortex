"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergeTreeChanges = void 0;
const Component_1 = require("../Component");
const Fragment_1 = require("../Fragment");
/**
 * Compare existing tree to incoming tree and merge incoming changes
 * @param existing Existing tree (previous render)
 * @param incoming Incoming tree (next render)
 */
function mergeTreeChanges(existing, incoming) {
    var _a, _b, _c, _d;
    const outgoing = [];
    for (let index = 0; index < Math.max(existing.length, incoming.length); ++index) {
        const existingElement = existing[index];
        const incomingElement = incoming[index];
        /**
         * If there is no existing element at this index, use incoming element
         */
        if (!existingElement) {
            outgoing.push(incomingElement);
            continue;
        }
        /**
         * If there is no incoming element at this index, the element was removed
         */
        if (!incomingElement) {
            outgoing.push(undefined);
            if (Component_1.Component.isComponent(existingElement.node) || Fragment_1.Fragment.isFragment(existingElement.node)) {
                existingElement.node.remove();
            }
            else {
                (_b = (_a = existingElement.node) === null || _a === void 0 ? void 0 : _a.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(existingElement.node);
            }
            continue;
        }
        /**
         * If constructors are different, replace existing element with incoming element
         * Else merge incoming properties and children with existing element
         */
        if (existingElement.constructor !== incomingElement.constructor) {
            outgoing.push(incomingElement);
            if (Component_1.Component.isComponent(existingElement.node) || Fragment_1.Fragment.isFragment(existingElement.node)) {
                existingElement.node.remove();
            }
            else {
                (_d = (_c = existingElement.node) === null || _c === void 0 ? void 0 : _c.parentNode) === null || _d === void 0 ? void 0 : _d.removeChild(existingElement.node);
            }
        }
        else {
            outgoing.push(Object.assign(existingElement, {
                children: mergeTreeChanges(existingElement.children, incomingElement.children),
                properties: incomingElement.properties // TODO properly merge props (consider defaults)
            }));
        }
    }
    return outgoing;
}
exports.mergeTreeChanges = mergeTreeChanges;
//# sourceMappingURL=mergeTreeChanges.js.map