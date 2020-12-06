import { Component, Context, Element, Portal, createElement } from '../src'

interface Item {
    foo: string
}

class ItemContext extends Context {
    value?: Item
}

class BlackBoxPortal extends Portal { 

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

const Div: Component.Fn<Item> = props => [
    <HTMLDivElement>
        { props.children }
    </HTMLDivElement>
]

const Span: Component.Fn = props => [
    <HTMLSpanElement>
        { props.children }
    </HTMLSpanElement>
]

const Slot: Component.Fn = () => [
    <HTMLSlotElement/>
]

const Divider: Component.Fn = () => [
    <HTMLElement className='fragmented' is='hr'/>
]

class Swapper extends Component {

    private counter = 1

    protected render(): Element.Child[] {
        window.setTimeout(() => this.update({ counter: this.counter + 1 }), 1000)

        if (this.counter > 10) {

            if (this.counter % 2) {
                return [
                    <BlackBoxPortal.Access>
                        <Span>
                            world
                        </Span>
                    </BlackBoxPortal.Access>
                ]
            }

            return [
                <BlackBoxPortal.Access>
                    <Span>
                        hello
                    </Span>
                </BlackBoxPortal.Access>
            ]
        }

        return [
            <Div foo='1'>
                <Span>
                    world&nbsp;
                </Span>
                <BlackBoxPortal.Access>
                    <Span>
                        hello&nbsp;
                    </Span>
                </BlackBoxPortal.Access>
                { this.counter % 2 > 0 && (
                    <Span>
                        ({ this.counter })
                    </Span>
                ) }
                { this.counter % 2 > 0 && (
                    <BlackBoxPortal.Access>
                        <Span>
                            ({ this.counter })
                        </Span>
                    </BlackBoxPortal.Access>
                ) }
                <Div foo='2'>
                    <Slot/>
                </Div>
            </Div>
        ]
    }

    protected theme() {
        return `
            :host {
                display: block;
            }
        `
    }
}

class Wrapper extends Component {

    protected render() {
        // setTimeout(() => this.update(), 1000)

        return [
            <HTMLSlotElement/>
        ]
    }

    protected theme() {
        return `
            :host {
                background: rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(0, 0, 0, 0.1);
                box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.33);
                display: block;
                padding: 10px;
            }
        `
    }
}

class Root extends Component {

    protected render(): Element.Child[] {
        return [
            <Wrapper className='ROOT'>
                <ItemContext value={ { foo: 'bar' } }>
                    <Wrapper>
                        <BlackBoxPortal/>
                        <Divider/>
                        <HTMLElement is='hr'/>
                        <Swapper>
                            A
                            <BlackBoxPortal.Access>
                                <Div foo='3'>
                                    B
                                </Div>
                            </BlackBoxPortal.Access>
                        </Swapper>
                        <HTMLTableElement>
                            <HTMLTableSectionElement is='thead'>
                                <HTMLTableRowElement>
                                    { ...Array(2).fill(undefined).map(() => (
                                        <HTMLTableCellElement is='th'>
                                            C
                                        </HTMLTableCellElement>
                                    )) }
                                </HTMLTableRowElement>
                            </HTMLTableSectionElement>
                            <HTMLTableSectionElement is='tbody'>
                                { ...Array(1).fill(undefined).map(() => (
                                    <HTMLTableRowElement>
                                        { ...Array(2).fill(undefined).map(() => (
                                            <HTMLTableCellElement is='td'>
                                                D
                                            </HTMLTableCellElement>
                                        )) }
                                    </HTMLTableRowElement>
                                )) }
                            </HTMLTableSectionElement>
                        </HTMLTableElement>
                    </Wrapper>
                </ItemContext>
            </Wrapper>
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

class Debugger extends Component {

    protected render() {
        return [
            <Wrapper>
                <Div>hello</Div>
                <HTMLDivElement>world</HTMLDivElement>
            </Wrapper>
        ]
    }
}

document.body.append(new Root())