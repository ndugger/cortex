import { createElement } from './core/createElement'

import { Component } from './Component'
import { Element } from './Element'
import { Fragment } from './Fragment'

/**
 * Map of model types to their respective instances
 */
const portals = new Map<Component.Constructor<Portal>, Portal[]>()

/**
 * Used to inject elements from one tree into another
 */
export class Portal extends Component {

    /**
     * Returns a Portal.Mirror bound to a specific portal type
     */
    public static get Access() {
        return (props: Component.PropsWithChildren) => [
            createElement(Portal.Mirror, { target: this }, ...(props.children ?? []))
        ]
    }

    protected render(): Element.Child[] {
        return [
            createElement(HTMLSlotElement)
        ]
    }

    protected theme(): string {
        return `
            :host {
                display: contents;
            }
        `
    }

    public constructor() {
        super()

        if (!portals.has(this.constructor as Component.Constructor<Portal>)) {
            portals.set(this.constructor as Component.Constructor<Portal>, [ this ])
        } else {
            portals.get(this.constructor as Component.Constructor<Portal>)?.push(this)
        }
    }
}

export namespace Portal {

    /**
     * Used as the content reflection method for portals
     */
    export class Mirror extends Fragment {

        public target: Component.Constructor<Portal>

        public reflect() {
            for (const portal of portals.get(this.target) ?? []) {
                portal.append(this)
            }
        }
    }

    /**
     * Decides if a node is a portal mirror
     * @param node 
     */
    export function isMirror(node: Node | undefined): node is Mirror {
        return node instanceof Mirror
    }
}