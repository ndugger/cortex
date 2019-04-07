import Node, { JSXElement } from './lib/Node';
import Store, { observe } from './lib/Store';
import Widget from './lib/Widget';

declare global {

    interface Element {
        __props__: Partial<this> & JSXElement;
        tag?: string;
    }

    namespace JSX {

        interface ElementAttributesProperty {
            __props__: Partial<this> & JSXElement;
        }
    }
}

export { Node, Store, Widget, observe };
