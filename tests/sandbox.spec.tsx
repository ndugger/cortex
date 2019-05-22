import * as Quark from '..';

interface State {
    count: number;
}

const state = new Quark.Store<State>({
    count: 0
});

@Quark.observe(state)
class Button extends Quark.Component {

    public hint: string;

    private handleClick(e: Event): void {
        state.set('count', state.get('count') + 1);
    }

    public render(): Quark.Node[] {
        return [
            <HTMLButtonElement onclick={ e => this.handleClick(e) }>
                <HTMLSlotElement/>
                <HTMLSpanElement textContent={ `(${ state.get('count') })` }/>
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

@Quark.observe(state)
class Sandbox extends Quark.Component<SandboxState> {

    protected initialState = {
        foo: 'hello world',
        bar: 'lorem ipsum'
    };

    public render(): Quark.Node[] {
        return [
            <HTMLElement attributes={ { foo: true } } tag='section'>
                <HTMLElement tag='h1' textContent={ this.state.get('foo') }/>
                <HTMLHRElement style={ { height: '8px' } }/>
                <Button hint='asdf'>
                    { this.state.get('bar') }
                </Button>
            </HTMLElement>
        ];
    }
}

document.body.append(new Sandbox());
