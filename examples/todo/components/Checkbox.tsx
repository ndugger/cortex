import * as Cortex from 'cortex';

import Icon from './Icon';

import palette from '../utilities/palette';

interface CheckboxState {
    checked: boolean;
}

export default class Checkbox extends Cortex.Component {

    private state = new Cortex.Store<CheckboxState>({
        checked: false
    });

    public checked: boolean;
    public onchange: (event: Event) => void;

    protected handleComponentConnect(): void {
        this.state.connect(this);
    }

    protected handleComponentReady(): void {

        if (this.checked !== this.state.checked) {
            this.state.checked = this.checked;
        }
    }

    protected handleComponentUpdate(): void {

        if (this.checked !== this.state.checked) {
            this.state.checked = this.checked;
        }
    }

    protected handleCheckboxChange(): void {
        this.state.checked = !this.state.checked;
        this.dispatchEvent(new Event('change'));
    }

    public render(): Cortex.Node[] {
        const { checked } = this.state;
        const glyph = checked ? 'check_circle' : 'radio_button_unchecked';

        return [
            <Icon attributes={ { checked } } glyph={ glyph } onclick={ () => this.handleCheckboxChange() } size={ 24 }/>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: contents;
            }

            .${ Icon.name } {
                color: rgba(${ palette.black }, 0.4);
                cursor: default;
                user-select: none;
            }

            .${ Icon.name }[ checked ] {
                color: rgb(${ palette.green });
            }
        `;
    }
}
