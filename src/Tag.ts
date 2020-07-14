import { Component } from './Component'

const tags = new Map<Component.Constructor, string>()
const unknown = 'unknown'

export function Tag<Type extends Component.Constructor>(type: Type): (tag: string) => Type {
    return tag => {
        tags.set(type, tag)
        return type
    }
}

export namespace Tag {

    export function of<Type extends Component.Constructor>(type: Type): string {
        
        if (tags.has(type)) {
            return tags.get(type) ?? unknown
        }
    
        if (!type.name) {
            return unknown
        }
    
        return `${ type.name.replace(/([A-Z])/g, c => `-${ c.toLowerCase() }`).replace(/^-/, '') }-component`
    }
}