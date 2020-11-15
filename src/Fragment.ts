import { Component } from './Component'
import { Element } from './Element'

import { connectElementToHost } from './core/connectElementToHost'
import { createDocumentNode } from './core/createDocumentNode'
import { mergeTreeChanges } from './core/mergeTreeChanges'
import { mapChildToElement } from './core/mapChildToElement'

const layout = Symbol('layout')

export class Fragment<Props extends object = {}> extends DocumentFragment {

    private [ layout ]: Element.Optional[]

    public template?: Fragment.Template<Props>

    protected render(children: Element.Child[]): Element.Child[] {
        return children
    }

    public remove(): void {
        for (const element of this[ layout ]) {

            if (Fragment.isFragment(element?.node)) {
                element?.node.remove();
            }

            element?.node?.parentNode?.removeChild(element?.node)
        }
    }

    public update(children: Element.Child[]): void {
        let tree: Element.Optional[]

        if (this.template) {
            tree = this.template.constructor({ ...this.template.properties, children: this.render(children) }).map(mapChildToElement)
        }
        else {
            tree = this.render(children).map(mapChildToElement)
        }

        /**
         * If first time render, just save new tree
         * Otherwise diff tree recursively
         */
        if (!this[ layout ]) {
            this[ layout ] = tree
        }
        else {
            this[ layout ] = mergeTreeChanges(this[ layout ], tree)
        }

        /**
         * Wire up any new component elements with DOM elements
         */
        for (const element of this[ layout ]) if (element) {

            if (!element.node) {
                element.node = createDocumentNode(element)
            }

            connectElementToHost(element, this)
        }
    }
}

export namespace Fragment {

    export interface Constructor<Props extends object = {}> {
        new(): Fragment<Props>
    }

    export interface Props {
        template: Template
    }

    export interface Template<Props extends object = {}> {
        constructor: Component.Fn
        properties?: Props
    }

    export function isFragment(node: Node | undefined): node is Fragment {
        return node instanceof Fragment
    }
}
