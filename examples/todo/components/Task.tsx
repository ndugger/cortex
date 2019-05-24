import * as Cortex from 'cortex';

import Checkbox from './Checkbox';

export default class Task extends Cortex.Component {

    protected handleCheckboxChange(event: Event): void {
        console.log(event.target);
    }

    public render(): Cortex.Node[] {
        return [
            <Checkbox onchange={ (e: Event) => this.handleCheckboxChange(e) }/>
        ];
    }

    public theme(): string {
        return `
            
        `;
    }
}
