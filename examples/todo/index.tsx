import * as Cortex from 'cortex';

import Button from './components/Button';
import Task from './components/Task';

interface Todo {
    task: string;
}

const tasks = new Cortex.Store<Todo[]>([]);
const completed = new Cortex.Store<Todo[]>([]);

@Cortex.observe(tasks)
@Cortex.observe(completed)
class Application extends Cortex.Component {

    private handleAddTaskClick(): void {
        tasks.add({ task: window.prompt('Enter Task Name:') });
    }

    private handleTaskComplete(index: number): void {
        const todo = tasks.get(index);

        console.log('complete', todo);

        tasks.delete(todo);
        completed.add(todo);
    }

    private handleTaskUndo(index: number): void {
        const todo = completed.get(index);

        completed.delete(todo);
        tasks.add(todo);
    }

    public render(): Cortex.Node[] {
        return [
            <HTMLElement tag='main'>
                <HTMLElement tag='nav'>
                    <Button onclick={ () => this.handleAddTaskClick() }>
                        Add Task
                    </Button>
                </HTMLElement>
                <HTMLUListElement>

                    { Array.from(tasks.entries()).map(([ index, value ]) => (
                        <HTMLLIElement>
                            <Task oncomplete={ () => this.handleTaskComplete(index) }>

                                { value.task }

                            </Task>
                        </HTMLLIElement>
                    )) }

                </HTMLUListElement>
                <HTMLHRElement/>
                <HTMLUListElement>

                    { Array.from(completed.entries()).map(([ index, value ]) => (
                        <HTMLLIElement>
                            <Task onundo={ () => this.handleTaskUndo(index) }>

                                { value.task }

                            </Task>
                        </HTMLLIElement>
                    )) }

                </HTMLUListElement>
            </HTMLElement>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: block;
                margin: auto;
                width: 800px;
            }

            nav.${ HTMLElement.name } {
                display: flex;
                justify-content: flex-end;
            }
        `;
    }
}

document.body.append(new Application());
