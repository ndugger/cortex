import * as Cortex from 'cortex';

import FormField from './FormField';

export default class Form extends Cortex.Component {

    public static Field = FormField;

    public onsubmit: (event: Event) => void;

    private handleSubmit(event: Event): void {
        event.preventDefault();
        this.dispatchEvent(new Event('submit'));
    }

    public render(): Cortex.Node[] {
        return [
            <HTMLFormElement onsubmit={ e => this.handleSubmit(e) }>
                <HTMLSlotElement/>
            </HTMLFormElement>
        ];
    }

    public theme(): string {
        return `

        `;
    }
}
