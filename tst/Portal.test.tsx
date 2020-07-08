import { render, Component, Portal } from '../src'

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

const TestComponentFn: Component.Fn<TestComponentFn.Props> = (props, ...children) => {
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

const TestRootComponentFn: Component.Fn = (props, ...children) => {
    const foo = render(TestComponentFn)
    const bar = <TestComponentFn/>;

    <TestPortal/>;

    return [
        <TestComponentFn/>,
        <TestPortal/>
    ]
}

<TestRootComponentFn>
    foo bar baz
</TestRootComponentFn>


