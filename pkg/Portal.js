import { Component } from "./Component";
import { render } from "./core/render";
import { Fragment } from "./Fragment";

const portals = new Map();
export class Portal extends Component {
    static Mirror(props) {
        return [
            render(
                Portal.Reflection,
                { target: this },
                ...(props?.children ?? [])
            ),
        ];
    }
    render() {
        return [render(HTMLSlotElement)];
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
    class Reflection extends Fragment {}
    Portal.Reflection = Reflection;
})(Portal || (Portal = {}));
//# sourceMappingURL=Portal.js.map
