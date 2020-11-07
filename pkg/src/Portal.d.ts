import { Component } from './Component';
import { Element } from './Element';
import { Fragment } from './Fragment';
export declare class Portal extends Fragment {
    static get Mirror(): () => Element<Portal.Reflection>[];
    protected theme(): string;
}
export declare namespace Portal {
    class Reflection extends Component {
        src: Component.Constructor<Portal>;
        constructor();
        protected render(): Element[];
        protected theme(): string;
    }
}
