import * as Cortex from 'cortex';

import { Task as TaskInterface } from '../stores/tasks';

import Checkbox from './Checkbox';
import PriorityIndicator from './PriorityIndicator';
import Spacer from './Spacer';
import Typography from './Typography';

import dateFormats from '../utilities/dateFormats';

export default class Task extends Cortex.Component implements TaskInterface {

    public completed: boolean;
    public name: string;
    public priority: 'high' | 'medium' | 'low';
    public when: Date;

    public onstatuschange: (event: Event) => void;

    private handleCheckboxChange(): void {
        const event = new Event('statuschange');

        if (this.onstatuschange) {
            this.onstatuschange(event);
        }

        this.dispatchEvent(event);
    }

    public render(): Cortex.Node[] {
        return [
            <HTMLDivElement style={ { alignItems: 'center', display: 'flex', flexGrow: '1' } }>
                <PriorityIndicator level={ this.priority }/>
                <Spacer width={ 16 }/>
                <HTMLDivElement style={ { opacity: this.completed ? '0.66' : '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }>
                    <Typography bold={ !this.completed } decoration={ this.completed && 'line-through' } textContent={ this.name } variant='content'/>
                </HTMLDivElement>
                <HTMLDivElement style={ { flexGrow: '1' } }>
                    <Spacer width={ 16 }/>
                </HTMLDivElement>
                <HTMLDivElement style={ { flexShrink: '0' } }>
                    <Typography textContent={ dateFormats.task.format(this.when) } variant='subheader'/>
                </HTMLDivElement>
                <Spacer width={ 16 }/>
                <Checkbox checked={ this.completed } onchange={ () => this.handleCheckboxChange() }/>
            </HTMLDivElement>
        ];
    }

    public theme(): string {
        return `
            :host {
                align-items: center;
                display: flex;
                height: 48px;
                padding: 0 16px;
            }
        `;
    }
}
