import Component from './library/Component';
import Fragment from './library/Fragment';
import Store, { subscribe } from './library/Store';
import render from './library/core/render';
import VirtualElement from './library/interfaces/VirtualElement';
import Properties from './library/interfaces/Properties';

type Node = VirtualElement;

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

export { Component, Fragment, Node, Store, render, subscribe };
