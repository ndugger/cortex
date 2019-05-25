import * as Cortex from 'cortex';

import palette from '../utilities/palette';

export default class PriorityIndicator extends Cortex.Component {

    public level: 'high' | 'medium' | 'low';

    public render(): Cortex.Node[] {
        const { level } = this;

        return [
            <HTMLDivElement attributes={ { level } }/>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: contents;
            }

            .${ HTMLDivElement.name } {
                border-radius: 100%;
                display: block;
                flex-shrink: 0;
                height: 10px;
                width: 10px;
            }

            .${ HTMLDivElement.name }[ level = high ] {
                background: rgb(${ palette.red });
            }

            .${ HTMLDivElement.name }[ level = medium ] {
                background: rgb(${ palette.yellow });
            }

            .${ HTMLDivElement.name }[ level = low ] {
                background: rgb(${ palette.green });
            }
        `;
    }
}
