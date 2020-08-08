import { Element } from './Element'
import { Component } from './Component'

import { connectElementToHost } from './core/connectElementToHost'
import { createActualElement } from './core/createActualElement'
import { mergeTreeChanges } from './core/mergeTreeChanges'
import { mapChildToElement } from './core/mapChildToElement'

const cache = Symbol('cache')

export class Fragment extends DocumentFragment {

    private [ cache ]: Element.Optional[]

    public template: Component.Fn

    protected render(children: Element.Child[]): Element.Child[] {
        return children
    }

    public remove(): void {
        for (const element of this[ cache ]) if (element?.node) {
            element.node.parentNode?.removeChild(element.node)
        }
    }

    public update(children: Element.Child[]): void {
        const tree = this.render(children).map(mapChildToElement)

        /**
         * If first time render, just save new tree
         * Otherwise diff tree recursively
         */
        if (!this[ cache ]) {
            this[ cache ] = tree
        }
        else {
            this[ cache ] = mergeTreeChanges(this[ cache ], tree)
        }

        /**
         * Wire up any new component elements with DOM elements
         */
        for (const element of this[ cache ]) if (element) {

            if (!element.node) {
                element.node = createActualElement(element)
            }

            connectElementToHost(element, this)
        }
    }
}

export namespace Fragment {
    
    export const Factory = () => {}
    
    export function isFragment(node: Node | undefined): node is Fragment {
        return node instanceof Fragment
    }
}