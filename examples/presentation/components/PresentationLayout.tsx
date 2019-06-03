import * as Cortex from 'cortex';

type PresentationLayoutAlignment = 'start' | 'center' | 'end';
type PresentationLayoutDirection = 'horizontal' | 'vertical';
type PresentationLayoutJustification = 'start' | 'center' | 'end';

export default class PresentationLayout extends Cortex.Component {

    public align: PresentationLayoutAlignment;
    public direction: PresentationLayoutDirection;
    public justify: PresentationLayoutJustification;
    public grow: number;
    public shrink: number;

    public render(): Cortex.Node[] {
        return [
            <HTMLSlotElement/>
        ];
    }

    public theme(): string {
        return `
            :host {
                align-items: ${ this.align ? this.align === 'center' ? 'center' : `flex-${ this.align || 'start' }` : 'unset' };
                display: flex;
                flex-grow: ${ this.grow || 0 };
                flex-direction: ${ this.direction === 'vertical' ? 'column' : 'row' };
                flex-shrink: ${ this.shrink || 0 };
                justify-content: ${ this.justify ? this.justify === 'center' ? 'center' : `flex-${ this.justify || 'start' }` : 'unset' };
            }
        `;
    }
}
