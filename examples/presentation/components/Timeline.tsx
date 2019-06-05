import * as Cortex from 'cortex';

import TimelineEvent from './TimelineEvent';

export default class Timeline extends Cortex.Component {

    public static Event = TimelineEvent;

    public range: [ number, number ];

    public render(): Cortex.Node[] {
        const [ from, to ] = this.range;
        const years = to - from;

        return [
            <HTMLDivElement id='from' textContent={ from.toString() }/>,
            <HTMLDivElement id='to' textContent={ to.toString() }/>,
            <HTMLDivElement id='years'>

                { Array.from(Array(years + 1)).map((_, i: number) => (
                    <HTMLDivElement style={ { left: `${ (i / years) * 100 }%` } }/>
                )) }

            </HTMLDivElement>,
            <HTMLDivElement id='events'>
                <HTMLSlotElement/>
            </HTMLDivElement>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: block;
                position: relative;
            }

            #from, #to {
                display: flex;
                font-family: Oswald;
                font-size: 1rem;
                justify-content: center;
                position: absolute;
                top: 24px;
                width: 0;
            }

            #from {
                left: 0;
            }

            #to {
                right: -4px;
            }

            #years {
                background: black;
                height: 4px;
                position: relative;
            }

            #years > .${ HTMLDivElement.name } {
                background: black;
                height: 32px;
                position: absolute;
                top: -14px;
                width: 4px;
            }

            #events {
                align-items: center;
                display: flex;
                height: 3px;
                position: relative;
                top: -3px;
            }
        `;
    }
}
