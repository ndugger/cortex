import * as Quark from '..';

class TestButton extends Quark.Widget {

    public design(): string {
        return `
            :host {
                display: contents;
            }

            button {
                background: blue;
                color: white;
            }
        `;
    }

    public render(): Quark.Node[] {
        return [
            new Quark.Node(HTMLButtonElement, null, [
                new Quark.Node(HTMLSlotElement)
            ])
        ];
    }
}

class TestCanvas extends Quark.Widget {

    protected handleWidgetRender(event: CustomEvent): void {
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
            :host {
                display: contents;
            }

            canvas {
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

class TestContainer extends Quark.Widget {

    private handleButtonClick(): void {
        this.update();
    }

    public render(): Quark.Node[] {
        return [
            new Quark.Node(TestButton, { onclick: () => this.handleButtonClick() }, [
                new Quark.Node(HTMLSpanElement, { textContent: 'Click Here' })
            ]),
            new Quark.Node(HTMLBRElement),
            new Quark.Node(TestCanvas)
        ];
    }
}

document.body.append(new TestContainer());
