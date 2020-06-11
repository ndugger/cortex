import { Component } from './Component';
import { render } from './core/render';
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
//# sourceMappingURL=Context.js.map