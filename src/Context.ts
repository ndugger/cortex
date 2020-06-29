import { Component } from './Component';
import { Element } from './Element'
import { render } from './core/render';

export class Context<Data extends object = {}> extends Component {

    public value?: Data;

    public render(): Element[] {
        return [ render(HTMLSlotElement) ];
    }

    public theme(): string {
        return `
            :host {
                display: contents;
            }
        `;
    }
}

export namespace Context {

    /**
     * Error interface used for context runtime errors
     */
    export class RuntimeError extends Error {
        
    }
}