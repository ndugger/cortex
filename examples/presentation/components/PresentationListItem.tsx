import * as Cortex from 'cortex';

export default class PresentationListItem extends Cortex.Component {

    public render(): Cortex.Node[] {
        return [
            <HTMLLIElement>
                <HTMLSlotElement/>
            </HTMLLIElement>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: contents;
            }

            .${ HTMLLIElement.name } {
                font-family: Abel;
                font-size: 1.8rem;
                margin: 0 0 12px;
                padding: 0;
            }
        `;
    }
}
