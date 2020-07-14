import { Element } from './Element';
declare const template: unique symbol;
export declare class Fragment extends DocumentFragment {
    private [template];
    protected render(children: Element.Child[]): Element.Child[];
    remove(): void;
    update(children: Element.Child[]): void;
}
export declare namespace Fragment {
    const Factory: () => void;
    function isFragment(node: Node | undefined): node is Fragment;
}
export {};
