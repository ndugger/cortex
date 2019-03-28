import * as Quark from '..';

class TestButton extends Quark.Widget {

    public render(): Quark.Node[] {
        const { onclick, label } = this.options;

        return [
            new Quark.Node(HTMLButtonElement, { onclick, textContent: label })
        ];
    }
}

class TestContainer extends Quark.Widget {

    private handleButtonClick(event: Event): void {
        console.log(event.target);
    }

    public render(): Quark.Node[] {
        const onclick = (e: Event) => this.handleButtonClick(e);

        return [
            new Quark.Node(TestButton, { label: 'Click Here', onclick })
        ];
    }
}

document.body.append(new TestContainer());
