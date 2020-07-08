import { Component } from './Component'

const tags: Map<new() => Component, string> = new Map()

export function Tag<Type extends new() => Component>(type: Type): (tag: string) => Type {
    return tag => {
        tags.set(type, tag)
        return type
    }
}

export namespace Tag {

    export function of<Type extends new() => Component>(type: Type): string {
        
        if (tags.has(type)) {
            return tags.get(type)
        }
    
        if (!type.name) {
            return 'unknown';
        }
    
        return `${ type.name.replace(/([A-Z])/g, c => `-${ c.toLowerCase() }`).replace(/^-/, '') }-component`;
    }
}