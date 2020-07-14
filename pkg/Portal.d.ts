import { Component } from './Component';
import { Element } from './Element';
import { Fragment } from './Fragment';
export declare class Portal extends Component implements Portal.Props {
    static Mirror(props: unknown, ...children: Element.Child[]): Element<Portal.Reflection>[];
    protected render(): Element[];
    protected theme(): string;
}
export declare namespace Portal {
    interface Props {
    }
    class Reflection extends Fragment implements Reflection.Props {
        target: Component.Constructor<Portal>;
    }
    namespace Reflection {
        interface Props {
            target: Component.Constructor<Portal>;
        }
    }
}
