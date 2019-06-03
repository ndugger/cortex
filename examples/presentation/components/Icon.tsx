import * as Cortex from 'cortex';

export default class Icon extends Cortex.Component {

    public glyph: string;
    public size: number = 24;

    public render(): Cortex.Node[] {
        return [
            <HTMLSpanElement>
                { this.glyph }
            </HTMLSpanElement>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: contents;
            }

            .${ HTMLSpanElement.name } {
                color: inherit;
                direction: ltr;
                font-family: 'Material Icons';
                font-feature-settings: 'liga';
                font-weight: normal;
                font-style: normal;
                font-size: ${ this.size }px;
                display: inline-block;
                letter-spacing: normal;
                line-height: 1;
                opacity: inherit;
                text-rendering: optimizeLegibility;
                text-transform: none;
                white-space: nowrap;
                word-wrap: normal;
                -moz-osx-font-smoothing: grayscale;
                -webkit-font-smoothing: antialiased;
            }
        `;
    }
}
