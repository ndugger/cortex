import { Component } from '../Component'

export const tags = new Map<any, string>()

export function defineCustomElement<Type extends typeof Component>(tag: string): (type: Type) => Type {
    return type => {
        tags.set(type, tag)
        return type
    }
}
