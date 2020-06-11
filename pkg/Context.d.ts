import { Component } from './Component';
import { Element } from './interfaces/Element';
export declare class Context<Data extends object = {}> extends Component {
    value?: Data;
    render(): Element[];
    theme(): string;
}
export declare namespace Context {
    /**
     * Error interface used for context runtime errors
     */
    class RuntimeError extends Error {
    }
}
