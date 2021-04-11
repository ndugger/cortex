import { Component } from './Component'

export { createElement } from './core/createElement'
export { defineCustomElement as tag } from './core/defineCustomElement' // aliased temporarily until new decorators implementation

export { attachHook } from './util/attachHook'
export { displayContents } from './util/displayContents'
export { getContext } from './util/getContext'

export { Component } from './Component'
export { Element } from './Element'
export { Fragment } from './Fragment'
export { Hook } from './Hook'
export { Portal } from './Portal'

export const Context = Component.Context
export type Context = Component.Context