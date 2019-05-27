import * as Cortex from 'cortex';

import palette from '../utilities/palette';

export default class Lightbox extends Cortex.Component {

    private handleCoverClick(): void {
        this.dispatchEvent(new Event('close'));
    }

    public render(): Cortex.Node[] {
        return [
            <HTMLDivElement id='cover' onclick={ () => this.handleCoverClick() }/>,
            <HTMLDivElement id='content'>
                <HTMLSlotElement/>
            </HTMLDivElement>
        ];
    }

    public theme(): string {
        return `
            :host, #cover {
                align-items: center;
                bottom: 0;
                display: flex;
                justify-content: center;
                left: 0;
                position: absolute;
                right: 0;
                top: 0;
            }

            #cover {
                background: rgba(${ palette.black }, 0.5);
            }

            #content {
                max-height: 100%;
                max-width: 100%;
                position: relative;
            }
        `;
    }
}
