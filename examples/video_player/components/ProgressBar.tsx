import * as Cortex from 'cortex';

export default class ProgressBar extends Cortex.Component {

    public value: number;

    public render(): Cortex.Node[] {
        return [
            <HTMLDivElement/>
        ];
    }

    public theme(): string {
        return `
            :host {
                background: rgba(255, 255, 255, 0.5);
                height: 4px;
                position: relative;
            }

            .${ HTMLDivElement.name } {
                background: yellow;
                height: 4px;
                width: ${ this.value * 100 }%;
            }
        `;
    }
}
