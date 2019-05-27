import * as Cortex from 'cortex';

export default class FormFieldOption<Type = any> extends Cortex.Component {

    public label: string;
    public value: Type;

    public render(): Cortex.Node[] {
        return [

        ];
    }

    public theme(): string {
        return `

        `;
    }
}
