import { Component } from './deps/circular';
import { Element } from './Element';
export declare class Context<Data extends object = {}> extends Component {
    value?: Data;
    render(): Element[];
    theme(): string;
}
