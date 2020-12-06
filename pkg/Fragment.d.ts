import { Component } from './Component';
import { Element } from './Element';
declare const layout: unique symbol;
export declare class Fragment<Props extends object = {}> extends DocumentFragment {
    private [layout];
    template?: Fragment.Template<Props>;
    protected render(children: Element.Child[]): Element.Child[];
    connect(children: Element.Child[]): void;
    remove(): void;
}
export declare namespace Fragment {
    interface Constructor<Props extends object = {}> {
        new (): Fragment<Props>;
    }
    interface Props {
        template: Template;
    }
    interface Template<Props extends object = {}> {
        constructor: Component.Fn;
        properties?: Props;
    }
    function isFragment(node: Node | undefined): node is Fragment;
}
export {};
