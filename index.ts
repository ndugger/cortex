import Node from './lib/Node';
import Store, { observe } from './lib/Store';
import Widget from './lib/Widget';

declare global {

    interface Element {
        __props__: Partial<this>;
        tag?: string;
    }

    namespace JSX {

        interface ElementAttributesProperty {
            __props__: Partial<this>;
        }
    }
}

export { Node, Store, Widget, observe };
