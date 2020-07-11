import { Element } from '../Element';

/**
 * Compare existing tree to incoming tree and merge incoming changes
 * @param existing Existing tree (previous render)
 * @param incoming Incoming tree (next render)
 */
export function diff(existing: Element.Optional[], incoming: Element.Optional[]): Element.Optional[] {
    const outgoing: Element.Optional[] = []

    for (let index = 0; index < Math.max(existing.length, incoming.length); ++index) {
        
        /**
         * If there is no existing element at this index, use incoming element
         */
        if (!existing[ index ]) {
            outgoing.push(incoming[ index ])

            continue
        }

        /**
         * If there is no incoming element at this index, the element was removed
         */
        if (!incoming[ index ]) {
            existing[ index ]?.node?.parentNode?.removeChild(existing[ index ]?.node as Node)
            outgoing.push(undefined)

            continue
        }

        /**
         * If constructors are different, replace existing element with incoming element
         * Else merge incoming properties and children with existing element
         */
        if (existing[ index ]?.constructor !== incoming[ index ]?.constructor) {
            existing[ index ]?.node?.parentNode?.removeChild(existing[ index ]?.node as Node)
            outgoing.push(incoming[ index ])
        }
        else {
            outgoing.push(Object.assign(existing[ index ], {
                children: diff(existing[ index ]?.children ?? [], incoming[ index ]?.children ?? []),
                properties: incoming[ index ]?.properties // TODO properly merge props (consider defaults)
            }))
        }
    }

    return outgoing
}
