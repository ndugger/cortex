import { render } from './core/render';
import { Component } from './Component';
import { Context } from './Context';
import { Element } from './interfaces/Element';
import { Properties } from './interfaces/Properties';
declare global {
    interface Element {
        JSX_PROPERTY_TYPES_DO_NOT_USE: Properties & {
            [Key in keyof this]?: this[Key] extends object ? Partial<this[Key]> : this[Key];
        };
    }
    namespace JSX {
        interface IntrinsicElements {
        }
        interface ElementAttributesProperty {
            JSX_PROPERTY_TYPES_DO_NOT_USE: typeof Element.prototype.JSX_PROPERTY_TYPES_DO_NOT_USE;
        }
    }
}
export { Component, Context, Element, render };
