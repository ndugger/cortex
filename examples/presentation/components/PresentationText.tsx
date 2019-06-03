import * as Cortex from 'cortex';

export default class PresentationText extends Cortex.Component {

    public color: string;

    public render(): Cortex.Node[] {
        return [
            <HTMLDivElement>
                <HTMLSlotElement/>
            </HTMLDivElement>
        ];
    }

    public theme(): string {
        return `
            .${ HTMLDivElement.name } {
                color: ${ this.color || 'inherit' };
                font-family: Abel;
                font-size: 1.8rem;
                margin: 0 0 12px;
                padding: 0;
            }
        `;
    }
}
