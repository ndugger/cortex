import * as Cortex from 'cortex';

export default class PresentationText extends Cortex.Component {

    public bold: boolean;
    public color: string;
    public display: boolean;
    public height: number;
    public size: number;
    public strike: boolean;

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
                font-family: ${ this.display ? 'Oswald' : 'Abel' };
                font-weight: ${ this.bold ? 'bold' : 'normal' };
                font-size: ${ this.size || 1.8 }rem;
                line-height: ${ this.height ? `${ this.height }rem` : 'unset' };
                margin: 0 0 12px;
                padding: 0;
                text-decoration: ${ this.strike ? 'line-through' : 'none' };
            }
        `;
    }
}
