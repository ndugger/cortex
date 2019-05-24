import * as Cortex from 'cortex';

interface CheckboxState {
    checked: boolean;
}

export default class Checkbox extends Cortex.Component<CheckboxState> {

    protected initialState = {
        checked: false
    };

    protected handleComponentRender(): void {
        const checked = this.state.get('checked');

        if (this.checked !== undefined && this.checked !== checked) {
            this.state.set('checked', this.checked);
        }
    }

    protected handleInputChange(): void {
        const checked = this.state.get('checked');

        this.state.set('checked', !checked);
        this.dispatchEvent(new Event('change'));
    }

    public checked: boolean;
    public onchange: (event: Event) => void;

    public render(): Cortex.Node[] {
        const checked = this.state.get('checked');

        return [
            <HTMLInputElement checked={ this.checked || checked } onchange={ () => this.handleInputChange() } type='checkbox'/>
        ];
    }

    public theme(): string {
        return `
            .${ HTMLInputElement.name } {
                height: 24px;
                width: 24px;
            }
        `;
    }
}
