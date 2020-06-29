import { Component } from './Component'

export const name = Symbol('name')

export function Tag<Type extends new() => Component>(type: Type): (tag: string) => Type {
    return tag => Object.assign(type, { [ name ]: tag })
}

export namespace Tag {

    export function of<Type extends new() => Component>(type: Type): string {
        
        if (name in type) {
            return type[ name ]
        }
    
        if (!type.name) {
            return 'unknown';
        }
    
        return `${ type.name.replace(/([A-Z])/g, c => `-${ c.toLowerCase() }`).replace(/^-/, '') }-component`;
    }
}