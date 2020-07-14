import { render } from './core/render'

import { Component } from './Component'
import { Element } from './Element'
import { Fragment } from './Fragment'

const portals = new Map<Component.Constructor<Portal>, Portal>()

export class Portal extends Component implements Portal.Props {

    public static Mirror(props: unknown, ...children: Element.Child[]) {
        return [
            render(Portal.Reflection, { target: this }, ...children)
        ]
    }

    protected render(): Element[] {
        return [
            render(HTMLSlotElement)
        ]
    }

    protected theme(): string {
        return `
            :host {
                display: contents;
                position: relative;
            }
        `
    }
}

export namespace Portal {

    export interface Props {}
    
    export class Reflection extends Fragment implements Reflection.Props {
        public target: Component.Constructor<Portal>
    }

    export namespace Reflection {

        export interface Props {
            target: Component.Constructor<Portal>
        }
    }
}