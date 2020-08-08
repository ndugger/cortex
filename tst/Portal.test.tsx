import { Component, Portal, createVirtualElement, tag } from '../src'

@tag('my-custom-test-component')
class TestComponent extends Component {

}

class TestPortal extends Portal { 

    /**
     * Foo of test portal
     */
    public foo: boolean;

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

const TestComponentFn: Component.Fn<TestComponentFn.Props> = ({ 
    children = [] 
}) => {
    return [
        <TestPortal.Mirror>
            { ...children }
        </TestPortal.Mirror>
    ]
}

namespace TestComponentFn {

    export interface Props {
        foo: boolean
    }
}

const TestRootComponentFn: Component.Fn = () => {
    const foo = createVirtualElement(TestComponentFn)
    const bar = <TestComponentFn/>;

    <TestPortal/>;
    <HTMLStyleElement/>;
    <HTMLStyleElement textContent=''/>;

    createVirtualElement(HTMLStyleElement)
    createVirtualElement(HTMLStyleElement, { textContent: '' })
    createVirtualElement(TestPortal)
    createVirtualElement(TestPortal, { foo: true });

    <Text data=''/>;

    return [
        <TestComponentFn/>,
        <TestPortal foo/>,
        'hello'
    ]
}

<TestRootComponentFn>
    foo bar baz
</TestRootComponentFn>


