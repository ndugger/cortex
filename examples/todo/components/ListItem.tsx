import * as Cortex from 'cortex';

import palette from '../utilities/palette';

export default class ListItem extends Cortex.Component {

    public render(): Cortex.Node[] {
        return [
            <HTMLSlotElement/>
        ];
    }

    public theme(): string {
        return `
            :host {
                align-items: center;
                border-bottom: 1px solid rgba(${ palette.black }, 0.12);
                display: flex;
                height: 48px;
                padding: 0 16px;
            }

            :host(:last-of-type) {
                border-bottom: none;
            }
        `;
    }
}
