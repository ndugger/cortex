import * as Cortex from 'cortex';

import ListItem from './ListItem';

export default class List extends Cortex.Component {

    public static Item = ListItem;

    public render(): Cortex.Node[] {
        return [
            <HTMLSlotElement/>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: flex;
                flex-direction: column;
            }
        `;
    }
}
