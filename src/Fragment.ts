import { connect } from './core/connect'
import { create } from './core/create'
import { diff } from './core/diff'
import { render } from './core/render'
import { childToElement } from './util/childToElement'
import { Element } from './Element'

const template = Symbol('template')

export class Fragment extends DocumentFragment {

    private [ template ]: Element.Optional[]

    protected render(children: Element.Child[]): Element.Child[] {
        return children
    }

    public remove(): void {
        for (const element of this[ template ]) if (element?.node) {
            element.node.parentNode?.removeChild(element.node)
        }
    }

    public update(children: Element.Child[]): void {
        const tree = this.render(children).map(childToElement)

        /**
         * If first time render, just save new tree
         * Otherwise diff tree recursively
         */
        if (!this[ template ]) {
            this[ template ] = tree
        }
        else {
            this[ template ] = diff(this[ template ], tree)
        }

        /**
         * Wire up any new component elements with DOM elements
         */
        for (const element of this[ template ]) if (element) {

            if (!element.node) {
                element.node = create(element)
            }

            connect(element, this)
        }
    }
}

export namespace Fragment {
    
    export const Factory = () => {}
    
    export function isFragment(node: Node | undefined): node is Fragment {
        return node instanceof Fragment
    }
}