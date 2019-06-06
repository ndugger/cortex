import Component from './library/CortexComponent';
import Fragment from './library/CortexFragment';
import Node, { Properties } from './library/CortexNode';
import Store, { subscribe } from './library/CortexStore';

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
