import { Component } from './Component'

export { createElement } from './core/createElement'
export { defineCustomElement as tag } from './core/defineCustomElement' // aliased temporarily until new decorators implementation
export { Component } from './Component'
export { Element } from './Element'
export { Fragment } from './Fragment'

export const Context = Component.Context
export type Context = Component.Context

export const Portal = Component.Portal
export type Portal = Component.Portal