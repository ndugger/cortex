import * as Cortex from 'cortex';

import Checkbox from './Checkbox';

interface TaskState {
    completed?: boolean;
}

export default class Task extends Cortex.Component<TaskState> {

    protected initialState = {};

    protected handleClick(): void {
        const completed = this.state.get('completed');

        if (completed) {
            const event = new Event('undo');

            this.state.set('completed', false);
            this.dispatchEvent(event);

            if (this.onundo) {
                this.onundo(event);
            }
        }
        else {
            const event = new Event('complete');

            this.state.set('completed', true);
            this.dispatchEvent(event);

            if (this.oncomplete) {
                this.oncomplete(event);
            }
        }
    }

    public oncomplete: (event: Event) => void;
    public onundo: (event: Event) => void;

    public render(): Cortex.Node[] {
        const completed = this.state.get('completed');

        return [
            <HTMLElement attributes={ { completed } } onclick={ () => this.handleClick() } tag='article'>
                <Checkbox checked={ completed }/>
                <HTMLElement tag='header'>
                    <HTMLSlotElement/>
                </HTMLElement>
            </HTMLElement>
        ];
    }

    public theme(): string {
        return `
            article.${ HTMLElement.name } {
                align-items: center;
                background: rgba(0, 0, 0, 0.1);
                border-radius: 1000px;
                box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
                display: flex;
                padding: 8px 16px;
                transition: opacity .12s ease;
                user-select: none;
            }

            article.${ HTMLElement.name }[ completed ] {
                opacity: 0.66;
            }

            article.${ HTMLElement.name }:hover {
                opacity: 0.66;
            }

            header.${ HTMLElement.name } {
                font-family: sans-serif;
                font-weight: bold;
                margin-left: 8px;
                transition: opacity .12s ease;
            }

            article.${ HTMLElement.name }[ completed ] > header.${ HTMLElement.name } {
                opacity: 0.66;
                text-decoration: line-through;
            }
        `;
    }
}
