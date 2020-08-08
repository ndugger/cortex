import { createVirtualElement } from './createVirtualElement'

import { Element } from '../Element'

export function mapChildToElement(child: Element.Child): Element.Optional {
    /**
     * If attempting to render plain text, convert to Text nodes
     */
    if (typeof child === 'string' || typeof child === 'number') {
        return createVirtualElement(Text, { data: child.toString() })
    }

    return child || undefined
}