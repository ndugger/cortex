import * as Cortex from 'cortex';

import { black } from '../utilities/palette';

export default class PresentationQuote extends Cortex.Component {

    public src: string;

    public render(): Cortex.Node[] {
        return [
            <HTMLQuoteElement cite={ this.src }>
                <HTMLSlotElement/>
                <HTMLDivElement textContent={ this.src }/>
            </HTMLQuoteElement>
        ];
    }

    public theme(): string {
        return `
            .${ HTMLQuoteElement.name } {
                border-left: 6px solid rgb(${ black });
                display: block;
                padding-left: 20px;
            }

            .${ HTMLQuoteElement.name }::after,
            .${ HTMLQuoteElement.name }::before {
                content: none;
            }

            .${ HTMLDivElement.name } {
                align-items: center;
                display: flex;
                font-family: Oswald;
                font-size: 1.33rem;
            }

            .${ HTMLDivElement.name }::before {
                content: '';
                border-bottom: 3px solid rgb(${ black });
                margin-right: 16px;
                position: relative;
                top: 2px;
                width: 24px;
            }
        `;
    }
}
