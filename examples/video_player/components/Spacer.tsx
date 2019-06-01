import * as Cortex from 'cortex';

export default class Spacer extends Cortex.Component {

    public height: number;
    public width: number;

    public theme(): string {
        return `
            :host {
                display: block;
                flex-shrink: 0;
                height: ${ this.height || 0 }px;
                width: ${ this.width || 0 }px;
            }
        `;
    }
}
