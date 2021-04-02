"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Portal = void 0;
const createElement_1 = require("./core/createElement");
const Component_1 = require("./Component");
const Fragment_1 = require("./Fragment");
/**
 * Map of model types to their respective instances
 */
const portals = new Map();
/**
 * Used to inject elements from one tree into another
 */
class Portal extends Component_1.Component {
    /**
     * Returns a Portal.Mirror bound to a specific portal type
     */
    static get Access() {
        return (props) => {
            var _a;
            return [
                createElement_1.createElement(Portal.Mirror, { target: this }, ...((_a = props.children) !== null && _a !== void 0 ? _a : []))
            ];
        };
    }
    render() {
        return [
            createElement_1.createElement(HTMLSlotElement)
        ];
    }
    theme() {
        return `
            :host {
                display: contents;
            }
        `;
    }
    constructor() {
        var _a;
        super();
        if (!portals.has(this.constructor)) {
            portals.set(this.constructor, [this]);
        }
        else {
            (_a = portals.get(this.constructor)) === null || _a === void 0 ? void 0 : _a.push(this);
        }
    }
}
exports.Portal = Portal;
(function (Portal) {
    /**
     * Used as the content reflection method for portals
     */
    class Mirror extends Fragment_1.Fragment {
        reflect() {
            var _a;
            for (const portal of (_a = portals.get(this.target)) !== null && _a !== void 0 ? _a : []) {
                portal.append(this);
            }
        }
    }
    Portal.Mirror = Mirror;
    /**
     * Decides if a node is a portal mirror
     * @param node
     */
    function isMirror(node) {
        return node instanceof Mirror;
    }
    Portal.isMirror = isMirror;
})(Portal = exports.Portal || (exports.Portal = {}));
