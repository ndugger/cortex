import { createVirtualElement } from './core/createVirtualElement';
import { Component } from './Component';
export class Context extends Component {
    render() {
        return [
            createVirtualElement(HTMLSlotElement)
        ];
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
    class RuntimeError extends Error {
    }
    Context.RuntimeError = RuntimeError;
})(Context || (Context = {}));
//# sourceMappingURL=Context.js.map