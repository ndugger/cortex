import Component from './library/Component';
import Fragment from './library/Fragment';
import Node, { Properties } from './library/Node';
import Store, { subscribe } from './library/Store';

declare global {

    interface Element {
        __props__: Properties & {
            [ Key in keyof this ]?: Partial<this[ Key ]>;
        };
    }

    namespace JSX {

        interface IntrinsicElements { }

        interface ElementAttributesProperty {
            __props__: typeof Element.prototype.__props__;
        }
    }
}

export { Component, Fragment, Node, Store, subscribe };
