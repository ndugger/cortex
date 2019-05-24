import * as Cortex from 'cortex';

import Checkbox from './Checkbox';

interface TaskState {
    completed: boolean;
}

export default class Task extends Cortex.Component<TaskState> {

    protected initialState = {
        completed: false
    };

    protected handleCheckboxChange(event: Event): void {
        const checkbox = event.target as Checkbox;

        if (checkbox.checked) {
            this.state.set('completed', true);
            this.dispatchEvent(new Event('complete'));
        }
        else {
            this.state.set('completed', false);
            this.dispatchEvent(new Event('undo'));
        }
    }

    public name: string;
    public oncomplete: (event: Event) => void;
    public onundo: (event: Event) => void;

    public render(): Cortex.Node[] {
        return [
            <HTMLElement tag='article'>
                <Checkbox checked={ false } onchange={ (e: Event) => this.handleCheckboxChange(e) }/>
                <HTMLElement tag='header'>
                    { this.name }
                </HTMLElement>
            </HTMLElement>
        ];
    }

    public theme(): string {
        return `
            article.${ HTMLElement.name } {
                align-items: center;
                display: flex;
            }

            header.${ HTMLElement.name } {
                font-family: sans-serif;
                font-weight: bold;
                margin-left: 8px;
            }
        `;
    }
}
