import { createVirtualElement } from './core/createVirtualElement';
import { Component } from './Component';
import { Fragment } from './Fragment';
const portals = new Map();
export class Portal extends Component {
    static Mirror(props) {
        return [
            createVirtualElement(Portal.Reflection, { target: this }, ...props?.children ?? [])
        ];
    }
    render() {
        return [
            createVirtualElement(HTMLSlotElement)
        ];
    }
    theme() {
        return `
            :host {
                display: contents;
                position: relative;
            }
        `;
    }
}
(function (Portal) {
    class Reflection extends Fragment {
    }
    Portal.Reflection = Reflection;
})(Portal || (Portal = {}));
//# sourceMappingURL=Portal.js.map