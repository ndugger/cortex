import * as Cortex from '..';

interface State {
    count: number;
}

const state = new Cortex.Store<State>({
    count: 0
});

@Cortex.observe(state)
class Button extends Cortex.Component {

    public hint: string;

    private handleClick(e: Event): void {
        state.set('count', state.get('count') + 1);
    }

    public render(): Cortex.Node[] {
        return [
            <HTMLButtonElement onclick={ e => this.handleClick(e) }>
                <HTMLSlotElement/>

                ({ state.get('count').toString() })

            </HTMLButtonElement>
        ];
    }

    public theme(): string {
        return `
            .${ HTMLButtonElement.name } {
                background: blue;
                border: none;
                color: white;
            }
        `;
    }
}

interface SandboxState {
    foo: string;
    bar: string;
}

@Cortex.observe(state)
class Sandbox extends Cortex.Component<SandboxState> {

    protected initialState = {
        foo: 'hello world',
        bar: 'lorem ipsum'
    };

    public render(): Cortex.Node[] {
        return [
            <HTMLElement attributes={ { foo: true } } tag='section'>
                <HTMLElement tag='h1' textContent={ this.state.get('foo') }/>
                <HTMLHRElement style={ { height: '8px' } }/>
                <Button hint='asdf'>

                    { `${ this.state.get('bar') } - ${ Math.random() }` }

                </Button>
            </HTMLElement>
        ];
    }
}

document.body.append(new Sandbox());
