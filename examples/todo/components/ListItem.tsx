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
                border-bottom: 1px solid rgba(${ palette.black }, 0.12);
            }

            :host(:last-of-type) {
                border-bottom: none;
            }
        `;
    }
}
