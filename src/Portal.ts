import { render } from './core/render'

import { Component } from './Component'
import { Element } from './Element'
import { Fragment } from './Fragment'

const portals: Map<new() => Portal, Portal> = new Map()

export class Portal extends Component implements Portal.Props {

    public static Mirror: Component.Fn = function (props, ...children) {
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
        public target: Element.Constructor<Portal>
    }

    export namespace Reflection {

        export interface Props {
            target: Element.Constructor<Portal>
        }
    }
}