import { render } from '../core/render'
import { Element } from '../Element'

export function childToElement(child: Element.Child): Element.Optional {
    /**
     * If attempting to render plain text, convert to Text nodes
     */
    if (typeof child === 'string' || typeof child === 'number') {
        return render(Text, { data: child.toString() })
    }

    return child || undefined
}