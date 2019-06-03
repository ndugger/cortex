import * as Cortex from 'cortex';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export default class PresentationHeading extends Cortex.Component {

    public color: string;
    public level: HeadingLevel;

    public render(): Cortex.Node[] {
        return [
            <HTMLElement tag={ `h${ this.level }` }>
                <HTMLSlotElement/>
            </HTMLElement>
        ];
    }

    public theme(): string {
        return `
            .${ HTMLElement.name } {
                color: ${ this.color || 'inherit' };
                font-family: Oswald;
                margin: 0;
                padding: 0;
            }

            h1.${ HTMLElement.name } {
                font-size: 3.5rem;
                margin-bottom: 12px;
            }

            h2.${ HTMLElement.name } {
                font-size: 2.66rem;
                margin-bottom: 12px;
            }

            h3.${ HTMLElement.name } {
                font-size: 2.1rem;
                margin-bottom: 8px;
            }

            h4.${ HTMLElement.name } {
                font-size: 1.66rem;
                margin-bottom: 8px;
            }

            h5.${ HTMLElement.name } {
                font-size: 1.1rem;
                margin-bottom: 4px;
            }

            h6.${ HTMLElement.name } {
                font-size: 0.66rem;
                margin-bottom: 4px;
            }
        `;
    }
}
