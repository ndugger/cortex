import { Element } from './Element';
import { Component } from './Component';
declare const cache: unique symbol;
export declare class Fragment extends DocumentFragment {
    private [cache];
    template: Component.Fn;
    protected render(children: Element.Child[]): Element.Child[];
    remove(): void;
    update(children: Element.Child[]): void;
}
export declare namespace Fragment {
    const Factory: () => void;
    function isFragment(node: Node | undefined): node is Fragment;
}
export {};
