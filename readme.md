# cortex
Lightweight Web Component Framework

### Why "cortex"?
**cor·tex**

/ˈkôrˌteks/

> the thin outer layer of the cerebrum (the cerebral cortex ), composed of folded gray matter and playing an important role in consciousness.

Just as your cerebral cortex is a thin layer, cortex (library) is a thin layer on top of "native" web components. It helps orchestrate state management, diffing, and lifecycle triggers, like rendering and updating.

The main goal is to keep the orchestration to a minimum, and rely heavily on already built-in functionality, like CSS, Custom Elements, and Shadow DOM. This allows us to keep the library size very small.

### Example
For more in-depth examples, check out the [examples folder](./examples).
```typescript
import * as Cortex from 'cortex'

class Example extends Cortex.Component {

    private handleClick(event: Event): void {
        alert('button was clicked!')
    }

    public render(): Cortex.Node[] {
        return [
            <HTMLButtonElement onclick={ e => this.handleClick(e) }>
                <HTMLSlotElement/>
            </HTMLButtonElement>
        ]
    }

    public theme(): string {
        return `
            .${ HTMLButtonElement.name } {
                background: blue;
                color: white;
            }
        `
    }
}

const example = new Example()

example.append(new Text('Hello World'))

document.body.append(example)
```

![](https://i.imgur.com/6nMCuib.png)

### Explanation
"Native" web components are class-based. You need to extend the base class `HTMLElement` in order for it to be compatible with the DOM.

The `Component` class acts as proxy to the `HTMLElement` class that also automatically registers the custom element, and adds lifecycle capabilities.

```typescript
import * as Cortex from 'cortex'

export default class Example extends Cortex.Component {

}
```

There are two public methods that you can/should override: `render` & `theme`. The `render` method returns an array of `Cortex.Node`s (which is a virtual representation of that component's tree). The `theme` method returns a string containing the CSS for that component.

```typescript
public render(): Cortex.Node[] {
    return []
}

public theme(): string {
    return ``
}
```

Cortex also supports JSX, so within the render method, you can markup your components very similarly to React.

```typescript
public render(): Cortex.Node[] {
    return [
        <HTMLButtonElement/>
    ]
}
```

**Important!** Cortex does not support "intrinsic elements", meaning that you must always pass a class into the JSX; no "literals" allowed, like `div`, `button`, etc.

If there is no standalone class for an element (like `section`, `header`, etc.), you may do `<HTMLElement tag='section'/>`.

Because you must always pass in a class, cortex takes some "left turns" when it comes to certain things, like with CSS classes. Cortex will automatically apply a `className` that is equal to the class' name that you passed in for the element.

This means that `<HTMLButtonElement/>` becomes `<button class='HTMLButtonElement'/>` in the DOM.

This also contributes to styling your components, because you can now target your elements via their actual class name.

```typescript
public theme(): Cortex.Node[] {
    return `
        .${ HTMLButtonElement.name } {

        }
    `
}
```

Since cortex uses shadow DOM under the hood, not only is your CSS properly scoped to the component, but you can also make use of slot-based content. Instead of accessing children through a property of that component, simply render an `HTMLSlotElement` and watch as the DOM automatically inserts your content within.

```typescript
<HTMLButtonElement>
    <HTMLSlotElement/>
</HTMLButtonElement>
```

### Lifecycle Methods

##### - create
```typescript
protected handleComponentCreate(event: CustomEvent): void
```
Dispatched when the component's constructor is called.

##### - connect
```typescript
protected handleComponentConnect(event: CustomEvent): void
```
Dispatched when the component has been attached to the DOM.

##### - disconnect
```typescript
protected handleComponentDisconnect(event: CustomEvent): void
```
Dispatched when the component has been disconnected from the DOM.

##### - render
```typescript
protected handleComponentRender(event: CustomEvent): void
```
Dispatched when the component has been rendered.

##### - ready
```typescript
protected handleComponentReady(event: CustomEvent): void
```
Dispatched after the component has been rendered and is ready to be used.

##### - update
```typescript
protected handleComponentUpdate(event: CustomEvent): void
```
Dispatched every time the component's state changes.

### State Management
Cortex ships with some basic state management built in. You can either have separate stores that components may subscribe to, or you may define an interface for a component's instance's state, and connect it anytime during that component's lifecycle.

```typescript
import * as Cortex from 'cortex'

interface State {
    foo: string
}

const state = new Cortex.Store<State>({
    foo: 'bar'
})

@Cortex.subscribe(state)
export default class Example extends Cortex.Component {

}
```

```typescript
interface ExampleState {
    foo: string
}

export default class Example extends Cortex.Component<ExampleState> {

    private state = new Cortex.Store<ExampleState>({
        foo: 'bar'
    })

    protected handleComponentConnect(): void {
        this.state.connect(this)
    }
}
```

The `Store` is actually just a Proxy. Treat it exactly how you would treat the
type of the data it contains: `array`, `object`, etc.

```typescript
private handleFoo(event: CustomEvent): void {
    this.state.foo = 'baz'
}

public render(): Cortex.Node[] {
    return [
        <HTMLSpanElement textContent={ this.state.foo }/>
    ]
}
```

### SVG Support
WIP
