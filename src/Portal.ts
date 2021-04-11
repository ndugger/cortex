import { createElement } from './core/createElement'

import { Component } from './Component'
import { Element } from './Element'
import { Fragment } from './Fragment'
import { displayContents } from './util/displayContents'

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

    protected theme(): Component.Style[] {
        return [ 
            displayContents()
         ]
    }

    public constructor() {
        super()
        
        const constructor = this.constructor as Component.Constructor<Portal>

        if (!portals.has(constructor)) {
            portals.set(constructor, [ this ])
        } else {
            portals.get(constructor)?.push(this)
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