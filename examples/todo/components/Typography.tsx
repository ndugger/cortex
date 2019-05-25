import * as Cortex from 'cortex';

export default class Typography extends Cortex.Component {

    public bold: boolean;
    public decoration: string;
    public variant: 'header' | 'subheader' | 'content';

    public render(): Cortex.Node[] {
        const { variant } = this;

        return [
            <HTMLSpanElement attributes={ { variant } } textContent={ this.textContent }/>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: contents;
            }

            .${ HTMLSpanElement.name } {
                font-family: Assistant;
                font-weight: ${ this.bold ? 700 : 400 };
                text-decoration: ${ this.decoration || 'none' };
            }

            .${ HTMLSpanElement.name }[ variant = content ] {
                font-size: 1rem;
            }

            .${ HTMLSpanElement.name }[ variant = header ] {
                font-size: 1.12rem;
            }

            .${ HTMLSpanElement.name }[ variant = subheader ] {
                font-size: 0.85rem;
                opacity: 0.66;
            }
        `;
    }
}
