import { createElement } from './core/createElement'

import { Component } from './Component'
import { Element } from './Element'
import { Fragment } from './Fragment'

const portals = new Map<Component.Constructor<Portal>, Portal>()
const mirrors = new Map<Component.Constructor<Portal>, Portal.Reflection[]>()

export class Portal extends Fragment {
    
    public static get Mirror() {

        if (!mirrors.has(this)) {
            mirrors.set(this, [])
        }

        return () => [
            createElement(Portal.Reflection, { src: this })
        ]
    }

    protected theme(): string {
        return ``
    }
}

export namespace Portal {

    export class Reflection extends Component {

        public src: Component.Constructor<Portal>

        public constructor() {
            super()
            mirrors.get(this.src)?.push(this)
        }

        protected render(): Element[] {
            return [
                createElement(HTMLSlotElement)
            ]
        }

        protected theme(): string {
            return this.src.prototype.theme() || `
                :host {
                    display: contents;
                    position: relative;
                }
            `
        }
    }

    // export class Reflection extends Fragment implements Reflection.Props {
    //     public target: Component.Constructor<Portal>
    // }

    // export namespace Reflection {

    //     export interface Props {
    //         target: Component.Constructor<Portal>
    //     }
    // }
}
