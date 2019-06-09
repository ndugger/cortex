import * as Cortex from 'cortex';

import Button from './components/Button';
import Form from './components/Form';
import Lightbox from './components/Lightbox';
import List from './components/List';
import Pane from './components/Pane';
import Spacer from './components/Spacer';
import Task from './components/Task';
import Typography from './components/Typography';

import tasks from './stores/tasks';

import dateFormats from './utilities/dateFormats';
import palette from './utilities/palette';

interface ApplicationState {
    displayAddTaskForm: boolean;
}

class ExampleFragment extends Cortex.Fragment {

    public render(): Cortex.Node[] {
        return [
            <HTMLElement tag='h1'>
                Example Fragment
            </HTMLElement>
        ];
    }

    public theme(): string {
        return `
            h1 {
                color: red;
            }
        `;
    }
}

@Cortex.subscribe(tasks)
class Application extends Cortex.Component {

    private state = new Cortex.Store<ApplicationState>({
        displayAddTaskForm: false
    });

    private handleAddTask(): void {
        this.state.displayAddTaskForm = true;
    }

    private handleCompleteTask(task: Task): void {
        tasks.splice(tasks.indexOf(task), 1, { ...task, completed: true });
    }

    private handleUndoTask(task: Task): void {
        tasks.splice(tasks.indexOf(task), 1, { ...task, completed: false });
    }

    private handleSubmitButtonClick(): void {
        const name = Reflect.get(this.shadowRoot.getElementById('task_name'), 'state').value;
        const priority = Reflect.get(this.shadowRoot.getElementById('task_priority'), 'state').value;

        tasks.push({
            completed: false,
            name,
            priority,
            when: new Date()
        });

        this.state.displayAddTaskForm = false;
    }

    private handleLightboxClose(): void {
        this.state.displayAddTaskForm = false;
    }

    protected handleComponentConnect(): void {
        this.state.connect(this);
    }

    public render(): Cortex.Node[] {
        const today = dateFormats.today.format(new Date());

        return [
            <ExampleFragment/>,
            <HTMLElement tag='main'>
                <Pane action='Add Task' header='My Tasks' onaction={ () => this.handleAddTask() } subheader={ today } style={ { width: '600px' } }>

                    <ExampleFragment/>

                    { (tasks.length === 0) && (
                        <HTMLDivElement id='ATTENTION_M8' style={ { padding: '24px', textAlign: 'center' } }>
                            <Typography textContent='You Have Nothing To Do Today' variant='content'/>
                        </HTMLDivElement>
                    ) }

                    <List>

                        { ...tasks.filter(task => !task.completed).map(task => (
                            <List.Item>
                                <Task onstatuschange={ () => this.handleCompleteTask(task as Task) } { ...task }/>
                            </List.Item>
                        )) }

                        { ...tasks.filter(task => task.completed).map(task => (
                            <List.Item>
                                <Task onstatuschange={ () => this.handleUndoTask(task as Task) } { ...task }/>
                            </List.Item>
                        )) }

                    </List>
                </Pane>
            </HTMLElement>,

            (this.state.displayAddTaskForm) && (
                <Lightbox onclose={ () => this.handleLightboxClose() }>
                    <Pane action='X' header='Add Task' onaction={ () => this.handleLightboxClose() }>
                        <HTMLDivElement style={ { padding: '16px', width: '480px' } }>
                            <Form>
                                <Form.Field id='task_name' label='Task Name' placeholder='Ex: Buy groceries' type='text' value={ 0 }/>
                                <Spacer height={ 16 }/>
                                <Form.Field id='task_priority' label='Task Priority' type='select'>
                                    <Form.Field.Option label='Low' value='low'/>
                                    <Form.Field.Option label='Medium' value='medium'/>
                                    <Form.Field.Option label='High' value='high'/>
                                </Form.Field>
                                <Spacer height={ 16 }/>
                                <HTMLDivElement style={ { textAlign: 'center' } }>
                                    <Button onclick={ () => this.handleSubmitButtonClick() }>
                                         <Typography textContent='Add Task' variant='content'/>
                                    </Button>
                                </HTMLDivElement>
                            </Form>
                        </HTMLDivElement>
                    </Pane>
                </Lightbox>
            )
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
        `;
    }
}

document.body.append(new Application());
