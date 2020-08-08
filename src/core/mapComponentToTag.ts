import { tags } from './defineCustomElement'

import { Component } from '../Component'

export function mapComponentToTag<Type extends Component.Constructor>(type: Type): string {
        
    if (tags.has(type)) {
        return tags.get(type) ?? 'unknown'
    }

    if (!type.name) {
        return 'unknown'
    }

    return `${ type.name.replace(/([A-Z])/g, c => `-${ c.toLowerCase() }`).replace(/^-/, '') }-component`
}