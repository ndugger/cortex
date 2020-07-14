import { Component, Portal } from '../src'

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

const TestComponentFn: Component.Fn<TestComponentFn.Props> = (props, children) => {
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
    const foo = Component.Factory(TestComponentFn)
    const bar = <TestComponentFn/>;

    <TestPortal/>;
    <HTMLStyleElement/>;
    <HTMLStyleElement textContent=''/>;

    Component.Factory(HTMLStyleElement)
    Component.Factory(HTMLStyleElement, { textContent: '' })
    Component.Factory(TestPortal)
    Component.Factory(TestPortal, { foo: true });

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


