import * as Cortex from 'cortex';

export default class Button extends Cortex.Component {

    private handleClick(): void {
        this.dispatchEvent(new Event('click'));
    }

    public onclick: (event: Event) => void;

    public render(): Cortex.Node[] {
        return [
            <HTMLButtonElement>
                <HTMLSlotElement/>
            </HTMLButtonElement>
        ];
    }

    public theme(): string {
        return `
            .${ HTMLButtonElement.name } {

            }
        `;
    }
}
