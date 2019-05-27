import Node from './library/Node';
import Store, { observe } from './library/Store';
import Component from './library/Component';

type Properties = Partial<Pick<Element, Exclude<keyof Element, 'attributes'>>> & {
    attributes?: {
        [ K: string ]: any
    };
    namespaces?: {
        [ K: string ]: string;
    };
    tag?: string;
};

declare global {

    interface Element {
        __props__: Properties & {
            [ K in keyof this ]?: Partial<this[ K ]>;
        };
    }

    namespace JSX {

        interface IntrinsicElements { }

        interface ElementAttributesProperty {
            __props__: any;
        }
    }
}

export { Node, Store, Component, observe };
