import Component from './lib/Component';
import Fragment from './lib/Fragment';
import Store from './lib/Store';

import render from './lib/core/render';

import Element from './lib/interfaces/Element';
import Properties from './lib/interfaces/Properties';

declare global {

    interface Element {
        JSX_PROPERTY_TYPES_DO_NOT_USE: Properties & {
            [ Key in keyof this ]?: Partial<this[ Key ]>;
        };
    }

    namespace JSX {

        interface IntrinsicElements {}

        interface ElementAttributesProperty {
            JSX_PROPERTY_TYPES_DO_NOT_USE: typeof Element.prototype.JSX_PROPERTY_TYPES_DO_NOT_USE;
        }
    }
}

export { Component, Element, Fragment, Store, render };
