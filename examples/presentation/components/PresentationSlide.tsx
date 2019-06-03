import * as Cortex from 'cortex';

import Presentation from './Presentation';

export default class PresentationSlide extends Cortex.Component {

    public parentElement: Presentation;

    public handleComponentReady(): void {
        this.slot = `slide_${ Array.from(this.parentElement.children).indexOf(this) }`;
    }

    public render(): Cortex.Node[] {
        return [
            <HTMLSlotElement/>
        ];
    }

    public theme(): string {
        return `
            :host {
                bottom: 0;
                display: flex;
                flex-direction: column;
                left: 0;
                padding: 40px;
                position: absolute;
                right: 0;
                top: 0;
            }
        `;
    }
}
