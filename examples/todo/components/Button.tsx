import * as Cortex from 'cortex';

import palette from '../utilities/palette';

export default class Button extends Cortex.Component {

    public render(): Cortex.Node[] {
        return [
            <HTMLButtonElement>
                <HTMLSlotElement/>
            </HTMLButtonElement>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: contents;
            }

            .${ HTMLButtonElement.name } {
                background: rgb(${ palette.blue });
                border: none;
                border-radius: 4px;
                color: rgb(${ palette.white });
                padding: 4px 16px;
                transition: opacity .12s ease;
            }

            .${ HTMLButtonElement.name }:hover {
                opacity: 0.85;
            }
        `;
    }
}
