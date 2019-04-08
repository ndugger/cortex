import Node, { JSXElement } from './lib/Node';
import Store, { observe } from './lib/Store';
import Widget from './lib/Widget';

interface FixThisLater {
    d?: any;
    fill?: any;
}

declare global {

    interface Element {
        __props__: Partial<this> | JSXElement | FixThisLater;
        tag?: string;
    }

    namespace JSX {

        interface ElementAttributesProperty {
            __props__: Partial<this> | JSXElement | FixThisLater;
        }
    }
}

export { Node, Store, Widget, observe };
