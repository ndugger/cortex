import { Element } from '../Element';

/**
 * Compare existing tree to incoming tree and merge incoming changes
 * @param existing Existing tree (previous render)
 * @param incoming Incoming tree (next render)
 */
export function diff(existing: Element[], incoming: Element[]): Element[] {

    /**
     * Iterate over whichever collection is longer
     */
    if (existing.length > incoming.length) {
        return existing.map((element, index) => {
        
            /**
             * If there is no existing element at this index, add incoming
             */
            if (!element) {
                return incoming[ index ]
            }

            /**
             * If there is no incoming element at this index, the element was removed
             */
            if (!incoming[ index ]) {
                element.node.parentNode.removeChild(element.node)
                return undefined
            }

            /**
             * If constructors are different, replace existing element with incoming
             */
            if (element.constructor !== incoming[ index ].constructor) {
                element.node.parentNode.removeChild(element.node)
                return incoming[ index ]
            }

            /**
             * If constructors are identical, merge props
             */
            return Object.assign(element, {
                children: diff(element.children, incoming[ index ].children),
                properties: incoming[ index ].properties
            })
        })
    }

    return incoming.map((element, index) => {
    
        /**
         * If there is no existing element at this index, add incoming
         */
        if (!existing[ index ]) {
            return element
        }

        /**
         * If there is no incoming element at this index, the element was removed
         */
        if (!element) {
            existing[ index ].node.parentNode.removeChild(existing[ index ].node)
            return undefined
        }

        /**
         * If constructors are different, replace existing element with incoming
         */
        if (existing[ index ].constructor !== element.constructor) {
            existing[ index ].node.parentNode.removeChild(existing[ index ].node) 
            return element
        }

        /**
         * If constructors are identical, merge props
         */
        return Object.assign(existing[ index ], {
            children: diff(existing[ index ].children, element.children),
            properties: element.properties
        })
    })
}
