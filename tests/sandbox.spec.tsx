import * as Cortex from '..';

class Example extends Cortex.Component {

    private handleClick(event: Event): void {
        alert('button was clicked!');
    }

    public render(): Cortex.Node[] {
        return [
            <HTMLButtonElement onclick={ e => this.handleClick(e) }>
                <HTMLSlotElement/>
            </HTMLButtonElement>
        ];
    }

    public theme(): string {
        return `
            .${ HTMLButtonElement.name } {
                background: blue;
                color: white;
            }
        `;
    }
}

const example = new Example();

example.append(new Text('Hello World'));
document.body.append(example);
