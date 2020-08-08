import { createVirtualElement } from './core/createVirtualElement'

import { Component } from './Component'
import { Element } from './Element'
import { Fragment } from './Fragment'

const portals = new Map<Component.Constructor<Portal>, Portal>()

export class Portal extends Component implements Portal.Props {

    public static Mirror(props: Component.PropsWithChildren) {
        return [
            createVirtualElement(Portal.Reflection, { target: this }, ...props?.children ?? [])
        ]
    }

    protected render(): Element[] {
        return [
            createVirtualElement(HTMLSlotElement)
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