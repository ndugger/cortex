import * as Cortex from 'cortex';

import { blue, green } from '../utilities/palette';

import Timeline from './Timeline';

const MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

export default class TimelineEvent extends Cortex.Component {

    public month: number;
    public parentElement: Timeline;
    public year: number;

    public render(): Cortex.Node[] {
        return [
            <HTMLDivElement id='dot'/>,
            <HTMLDivElement id='content'>
                <HTMLDivElement id='center'>
                    <HTMLDivElement id='when'>
                        { MONTHS[ this.month ] }, { this.year }
                    </HTMLDivElement>
                    <HTMLSlotElement/>
                </HTMLDivElement>
            </HTMLDivElement>
        ];
    }

    public theme(): string {
        const [ from, to ] = this.parentElement.range;

        return `
            :host {
                height: 0;
                left: ${ ((this.year - from) / (to - from) * 100) + (((this.month || 0) + 1) / MONTHS.length * 10) }%;
                position: absolute;
            }

            #dot {
                background: rgb(${ blue });
                border-radius: 50%;
                box-shadow: 0 0 0 4px black;
                height: 24px;
                left: -10px;
                margin-top: -2px;
                position: relative;
                top: -10px;
                width: 24px;
            }

            #content {
                display: flex;
                justify-content: center;
                left: 2px;
                position: absolute;
                width: 0;
            }

            #content::before {
                content: '';
                display: block;
                border-left: 12px solid transparent;
                border-right: 12px solid transparent;
                position: absolute;
            }

            :host(:nth-of-type(even)) #content {
                top: 40px;
            }

            :host(:nth-of-type(even)) #content::before {
                border-bottom: 12px solid black;
                top: -12px;
            }

            :host(:nth-of-type(odd)) #content {
                bottom: 40px;
            }

            :host(:nth-of-type(odd)) #content::before {
                border-top: 12px solid black;
                bottom: -12px;
            }

            #center {
                background: black;
                color: white;
                flex-shrink: 0;
                padding: 12px 20px 0;
            }

            #when {
                color: rgb(${ green });
                font-family: Oswald;
                font-size: 0.8rem;
            }
        `;
    }
}
