import * as Cortex from 'cortex';

import Logo from '../components/Logo';
import Presentation from '../components/Presentation';

export default class ExampleTodoSlide extends Cortex.Component {

    public render(): Cortex.Node[] {
        return [
            <Logo/>,
            <Presentation.Layout direction='vertical' grow={ 1 }>
                <Presentation.Heading level={ 2 }>
                    Example: Todo
                </Presentation.Heading>
                <Presentation.Text>
                    Using web components, you can create new tasks, assign a
                    priority, and mark them as complete.
                </Presentation.Text>
                <HTMLIFrameElement frameBorder='0' src='../todo/index.html'/>
            </Presentation.Layout>
        ];
    }

    public theme(): string {
        return `
            :host {
                display: contents;
            }

            code {
                background: rgba(0, 0, 0, 1);
                color: rgba(255, 255, 255, 0.85);
                padding: 4px 8px;
            }

            .${ HTMLIFrameElement.name } {
                border-radius: 4px;
                flex-grow: 1;
            }
        `;
    }
}
