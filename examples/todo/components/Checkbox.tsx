import * as Cortex from 'cortex';

import Icon from './Icon';

import palette from '../utilities/palette';

interface CheckboxState {
    checked: boolean;
}

export default class Checkbox extends Cortex.Component<CheckboxState> {

    protected initialState = {
        checked: false
    };

    protected handleComponentReady(): void {
        const checked = this.state.get('checked');

        if (this.checked !== undefined && this.checked !== checked) {
            this.state.set('checked', this.checked);
        }
    }

    protected handleComponentUpdate(): void {
        const checked = this.state.get('checked');

        if (this.checked !== undefined && this.checked !== checked) {
            this.state.set('checked', this.checked);
        }
    }

    protected handleClick(): void {
        const checked = this.state.get('checked');

        this.state.set('checked', !checked);
        this.dispatchEvent(new Event('change'));
    }

    public checked: boolean;
    public onchange: (event: Event) => void;

    public render(): Cortex.Node[] {
        const checked = this.state.get('checked');
        const glyph = checked ? 'check_circle' : 'radio_button_unchecked';

        return [
            <Icon attributes={ { checked } } glyph={ glyph } onclick={ () => this.handleClick() } size={ 24 }/>
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
