import * as Cortex from 'cortex';

import Icon from './Icon';

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
        const glyph = checked ? 'check_box' : 'check_box_outline_blank';

        return [
            <Icon glyph={ glyph } onclick={ () => this.handleClick() } size={ 32 }/>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: contents;
            }

            .${ Icon.name } {
                color: blue;
                cursor: default;
                user-select: none;
            }
        `;
    }
}
