import { Component } from '../Component'
import { Element } from '../Element'
import { Fragment } from '../Fragment'

/**
 * Compare existing tree to incoming tree and merge incoming changes
 * @param existing Existing tree (previous render)
 * @param incoming Incoming tree (next render)
 */
export function mergeTreeChanges(existing: Element.Optional[], incoming: Element.Optional[]): Element.Optional[] {
    const outgoing: Element.Optional[] = []

    for (let index = 0; index < Math.max(existing.length, incoming.length); ++index) {
        const existingElement = existing[ index ]
        const incomingElement = incoming[ index ]
        
        /**
         * If there is no existing element at this index, use incoming element
         */
        if (!existingElement) {
            outgoing.push(incomingElement)

            continue
        }

        /**
         * If there is no incoming element at this index, the element was removed
         */
        if (!incomingElement) {
            outgoing.push(undefined)
            
            if (Component.isComponent(existingElement.node) || Fragment.isFragment(existingElement.node)) {
                existingElement.node.remove()
            }
            else {
                existingElement.node?.parentNode?.removeChild(existingElement.node)
            }

            continue
        }

        /**
         * If constructors are different, replace existing element with incoming element
         * Else merge incoming properties and children with existing element
         */
        if (existingElement.constructor !== incomingElement.constructor) {
            outgoing.push(incomingElement)
            
            if (Component.isComponent(existingElement.node) || Fragment.isFragment(existingElement.node)) {
                existingElement.node.remove()
            }
            else {
                existingElement.node?.parentNode?.removeChild(existingElement.node)
            }
        }
        else {
            outgoing.push(Object.assign(existingElement, {
                children: mergeTreeChanges(existingElement.children, incomingElement.children),
                properties: incomingElement.properties // TODO properly merge props (consider defaults)
            }))
        }
    }

    return outgoing
}
