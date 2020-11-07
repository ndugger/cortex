import { Component, Element, Portal, createElement } from '../src'

class TestPortal extends Portal { 

    protected theme(): string {
        return `
            :host {
                display: contents;
                left: 0;
                position: absolute;
                top: 0;
            }
        `
    }
}

namespace TestComponentFn {

    export interface Props {
        foo: boolean
    }
}

const TestRootComponentFn: Component.Fn = () => {
    return [
        <TestPortal.Mirror/>,
        'hello',
        ' ',
        <TestPortal>
            world
        </TestPortal>
    ]
}

class PortalTest extends Component {

    public render(): Element.Child[] {
        console.dir(this)
        return [
            <TestRootComponentFn/>
        ]
    }
}

document.body.append(new PortalTest())