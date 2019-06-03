import * as Cortex from 'cortex';

import PresentationListItem from './PresentationListItem';

export default class PresentationList extends Cortex.Component {

    public static Item = PresentationListItem;

    public ordered: boolean;

    public render(): Cortex.Node[] {

        if (this.ordered) return [
            <HTMLOListElement>
                <HTMLSlotElement/>
            </HTMLOListElement>
        ];

        return [
            <HTMLUListElement>
                <HTMLSlotElement/>
            </HTMLUListElement>
        ];
    }

    public theme(): string {
        return `

        `;
    }
}
