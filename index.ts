import Node from './lib/Node';
import Store, { observe } from './lib/Store';
import Widget from './lib/Widget';

declare global {

    interface Element {
        __props__: Partial<this> | {
            attributes?: {
                [ key: string ]: any;
            };
        };
        tag?: string;
    }

    namespace JSX {

        interface ElementAttributesProperty {
            __props__: Partial<this> | {
                attributes?: {
                    [ key: string ]: any;
                };
            };
        }
    }
}

export { Node, Store, Widget, observe };
