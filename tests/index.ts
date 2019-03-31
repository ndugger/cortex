import * as Quark from '..';

interface TestState {
    clicked: boolean;
}

const state = new Quark.Store<TestState>({
    clicked: false
});

@Quark.observe(state)
class TestButton extends Quark.Widget {

    private handleButtonClick(): void {
        state.set('clicked', true);
    }

    public design(): string {
        return `
            .HTMLButtonElement {
                background: blue;
                color: white;
            }

            .HTMLButtonElement.xyz {
                color: yellow;
            }
        `;
    }

    public render(): Quark.Node[] {
        const clicked = state.get('clicked');

        return [
            new Quark.Node(HTMLButtonElement, { className: 'xyz', onclick: (e) => this.handleButtonClick() }, [
                new Quark.Node(HTMLSlotElement),
                new Quark.Node(HTMLSpanElement, { style: { }, textContent: `(clicked: ${ clicked })` })
            ])
        ];
    }
}

@Quark.observe(state)
class TestCanvas extends Quark.Widget {

    protected handleWidgetRender(): void {
        const canvas = this.shadowRoot.querySelector('canvas');
        const context = canvas.getContext('2d');
        const r = Math.round(Math.random() * 255);
        const g = Math.round(Math.random() * 255);
        const b = Math.round(Math.random() * 255);

        context.fillStyle = `rgb(${ r }, ${ g }, ${ b })`;
        context.fillRect(25, 25, 50, 50);
    }

    public design(): string {
        return `
            .HTMLCanvasElement {
                background: black;
            }
        `;
    }

    public render(): Quark.Node[] {
        return [
            new Quark.Node(HTMLCanvasElement, { width: 100, height: 100 })
        ];
    }
}

class TestContainer extends Quark.Widget<{ foo: boolean }> {

    private handleCanvasClick(): void {
        this.state.set('foo', true);
    }

    public render(): Quark.Node[] {
        const foo = this.state.get('foo');

        return [
            new Quark.Node(TestButton, null, [
                new Quark.Node(HTMLSpanElement, { textContent: `[foo: ${ foo }] Click Me` })
            ]),
            new Quark.Node(HTMLBRElement),
            new Quark.Node(TestCanvas, { onclick: () => this.handleCanvasClick() })
        ];
    }
}

document.body.append(new TestContainer());
