import { Component, Context, Element, Portal, createElement } from '../src'

interface TestValue {
    foo: string
}

class TestContext extends Context {
    value?: TestValue
}

class TestPortal extends Portal {

    protected theme(): string {
        return `
            :host {
                background: black;
                color: white;
                display: inline-block;
                margin-left: -6px;
                margin-right: 4px;
                padding: 4px 6px;
            }
        `
    }
}

const Div: Component.Fn<TestValue> = props => {
    return [
        <HTMLDivElement>
            { props.children }
        </HTMLDivElement>
    ]
}

const Span: Component.Fn = props => {
    return [
        <HTMLSpanElement>
            { props.children }
        </HTMLSpanElement>
    ]
}

const Slot: Component.Fn = () => {
    return [
        <HTMLSlotElement/>
    ]
}

class PortalAccessTest extends Component {

    private counter = 1

    protected render(): Element.Child[] {
        window.setTimeout(() => this.update({ counter: this.counter + 1 }), 1000)

        if (this.counter > 10) {

            if (this.counter % 2) {
                return [
                    <TestPortal.Access>
                        <Span>
                            world
                        </Span>
                    </TestPortal.Access>
                ]
            }

            return [
                <TestPortal.Access>
                    <Span>
                        hello
                    </Span>
                </TestPortal.Access>
            ]
        }

        return [
            <Div foo='1'>
                <Span>
                    world&nbsp;
                </Span>
                <TestPortal.Access>
                    <Span>
                        hello&nbsp;
                    </Span>
                </TestPortal.Access>
                { this.counter % 2 > 0 && (
                    <Span>
                        ({ this.counter })
                    </Span>
                ) }
                { this.counter % 2 > 0 && (
                    <TestPortal.Access>
                        <Span>
                            ({ this.counter })
                        </Span>
                    </TestPortal.Access>
                ) }
                <Div foo='2'>
                    <Slot/>
                </Div>
            </Div>
        ]
    }
}

class PortalWrapperTest extends Component {

    protected render() {
        setTimeout(() => this.update(), 1000)

        return [
            <Slot/>
        ]
    }
}

class PortalTest extends Component {

    protected render(): Element.Child[] {
        return [
            <PortalWrapperTest className='ROOT'>
                <TestContext value={ { foo: 'bar' } }>
                    <PortalWrapperTest>
                        <TestPortal/>
                        <PortalAccessTest>
                            A
                            <TestPortal.Access>
                                <Div foo='3'>
                                    B
                                </Div>
                            </TestPortal.Access>
                        </PortalAccessTest>
                        <HTMLTableElement>
                            <HTMLTableSectionElement tag='thead'>
                                <HTMLTableRowElement>
                                    { ...Array(15).fill(undefined).map(() => (
                                        <HTMLTableCellElement tag='th'>
                                            C
                                        </HTMLTableCellElement>
                                    )) }
                                </HTMLTableRowElement>
                            </HTMLTableSectionElement>
                            <HTMLTableSectionElement tag='tbody'>
                                { ...Array(100).fill(undefined).map(() => (
                                    <HTMLTableRowElement>
                                        { ...Array(15).fill(undefined).map(() => (
                                            <HTMLTableCellElement tag='td'>
                                                D
                                            </HTMLTableCellElement>
                                        )) }
                                    </HTMLTableRowElement>
                                )) }
                            </HTMLTableSectionElement>
                        </HTMLTableElement>
                    </PortalWrapperTest>
                </TestContext>
            </PortalWrapperTest>
        ]
    }

    protected theme(): string {
        return `
            :host {
                color: blue;
                display: inline-block;
                font-weight: bold;
                margin-left: 6px;
            }
        `
    }
}

document.body.append(new PortalTest())
