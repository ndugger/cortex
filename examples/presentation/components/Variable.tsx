import * as Cortex from 'cortex';

export default class Variable extends Cortex.Component {

    public render(): Cortex.Node[] {
        return [
            <HTMLElement tag='code'>
                <HTMLSlotElement/>
            </HTMLElement>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: contents;
            }

            code {
                background: rgba(0, 0, 0, 1);
                color: rgba(255, 255, 255, 0.85);
                font-size: 1.6rem;
                padding: 4px 8px;
            }
        `;
    }
}
