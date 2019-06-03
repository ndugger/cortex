import * as Cortex from 'cortex';

export default class PresentationImage extends Cortex.Component {

    public src: string;
    public width: number;

    public render(): Cortex.Node[] {
        return [
            <HTMLImageElement src={ this.src }/>
        ];
    }

    public theme(): string {
        return `
            .${ HTMLImageElement.name } {
                width: ${ this.width ? `${ this.width }px` : 'auto' };
            }
        `;
    }
}
