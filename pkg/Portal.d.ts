import { Component } from './Component';
import { Element } from './Element';
import { Fragment } from './Fragment';
/**
 * Used to inject elements from one tree into another
 */
export declare class Portal extends Component {
    /**
     * Returns a Portal.Mirror bound to a specific portal type
     */
    static get Access(): (props: Component.PropsWithChildren) => Element<Portal.Mirror>[];
    protected render(): Element.Child[];
    protected theme(): string;
    constructor();
}
export declare namespace Portal {
    /**
     * Used as the content reflection method for portals
     */
    class Mirror extends Fragment {
        target: Component.Constructor<Portal>;
        reflect(): void;
    }
    /**
     * Decides if a node is a portal mirror
     * @param node
     */
    function isMirror(node: Node | undefined): node is Mirror;
}
