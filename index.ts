import Node, { Properties } from './library/Node';
import Store, { subscribe } from './library/Store';
import Component from './library/Component';

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

export { Node, Store, Component, subscribe };
