import { Component } from "./Component";
import { render } from "./core/render";
export class Context extends Component {
    render() {
        return [render(HTMLSlotElement)];
    }
    theme() {
        return `
            :host {
                display: contents;
            }
        `;
    }
}
(function (Context) {
    /**
     * Error interface used for context runtime errors
     */
    class RuntimeError extends Error {}
    Context.RuntimeError = RuntimeError;
})(Context || (Context = {}));
//# sourceMappingURL=Context.js.map
