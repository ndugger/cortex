import * as Cortex from 'cortex';

import Checkbox from './components/Checkbox';
import List from './components/List';
import Pane from './components/Pane';
import PriorityIndicator from './components/PriorityIndicator';
import Spacer from './components/Spacer';
import Typography from './components/Typography';

import palette from './utilities/palette';

interface Task {
    completed: boolean;
    name: string;
    priority: 'high' | 'medium' | 'low';
    when: Date;
}

const tasks = new Cortex.Store<Task[]>([]);

@Cortex.observe(tasks)
class Application extends Cortex.Component {

    public handleAddTask(): void {
        tasks.push({
            completed: false,
            name: window.prompt('Enter Task Name'),
            priority: 'high',
            when: new Date()
        });
    }

    private handleCheckboxChange(task: Task): void {
        tasks.splice(tasks.indexOf(task), 1, { ...task, completed: !task.completed });
    }

    public renderTask(task: Task): Cortex.Node {
        return (
            <HTMLDivElement style={ { alignItems: 'center', display: 'flex', flexGrow: '1' } }>
                <PriorityIndicator level={ task.priority }/>
                <Spacer width={ 16 }/>
                <HTMLDivElement style={ { opacity: task.completed ? '0.66' : '1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }>
                    <Typography bold={ !task.completed } decoration={ task.completed && 'line-through' } textContent={ task.name } variant='content'/>
                </HTMLDivElement>
                <HTMLDivElement style={ { flexGrow: '1' } }>
                    <Spacer width={ 16 }/>
                </HTMLDivElement>
                <HTMLDivElement style={ { flexShrink: '0' } }>
                    <Typography textContent='May 25, 2019' variant='subheader'/>
                </HTMLDivElement>
                <Spacer width={ 16 }/>
                <Checkbox checked={ task.completed } onchange={ () => this.handleCheckboxChange(task) }/>
            </HTMLDivElement>
        );
    }

    public render(): Cortex.Node[] {
        return [
            <HTMLElement tag='main'>
                <Pane action='Add Task' header='My Tasks' onaction={ () => this.handleAddTask() } subheader='May 25, 2019' >

                    { (tasks.length === 0) && (
                        <HTMLDivElement style={ { padding: '24px', textAlign: 'center' } }>
                            <Typography textContent='You Have Nothing To Do Today' variant='content'/>
                        </HTMLDivElement>
                    ) }

                    <List>
                        { tasks.filter(task => !task.completed).map(task => <List.Item>{ this.renderTask(task) }</List.Item>) }
                        { tasks.filter(task => task.completed).map(task => <List.Item>{ this.renderTask(task) }</List.Item>) }
                    </List>

                </Pane>
            </HTMLElement>
        ];
    }

    public theme(): string {
        return `
            :host {
                background: rgb(${ palette.blue });
                display: flex;
                height: 100%;
                justify-content: center;
                user-select: none;
                width: 100%;
            }

            main.${ HTMLElement.name } {
                padding: 32px;
            }

            .${ Pane.name } {
                width: 600px;
            }
        `;
    }
}

document.body.append(new Application());
