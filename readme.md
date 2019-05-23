# cortex
Lightweight Web Component Framework

### Why "cortex"?
**cor·tex**

/ˈkôrˌteks/

> the thin outer layer of the cerebrum (the cerebral cortex ), composed of folded gray matter and playing an important role in consciousness.

Just as your cerebral cortex is a thin layer, cortex (library) is a thin layer on top of "native" web components. It helps orchestrate state management, diffing, and lifecycle triggers, like rendering and updating.

The main goal is to keep the orchestration to a minimum, and rely heavily on already built-in functionality, like CSS, Custom Elements, and Shadow DOM. This allows us to keep the library size very small.

### Example
```typescript
import * as Cortex from 'cortex';

class Example extends Cortex.Component {

    private handleClick(event: Event): void {
        alert('button was clicked!');
    }

    public render(): Cortex.Node[] {
        return [
            <HTMLButtonElement onclick={ e => this.handleClick(e) }>
                <HTMLSlotElement/>
            </HTMLButtonElement>
        ];
    }

    public theme(): string {
        return `
            .${ HTMLButtonElement.name } {
                background: blue;
                color: white;
            }
        `;
    }
}

const example = new Example();

example.append(new Text('Hello World'));

document.body.append(example);
```

![](https://i.imgur.com/6nMCuib.png)







---

**Old Readme (Very Outdated):**

# quark

[ Shadow DOM + Virtual DOM ] Web Component Framework For Web Applications

**Compatible with JSX**

```
npm install ndugger/quark --save
```

## Performance
Performance will mostly be beholden to the efficiency of shadow DOM, but the virtual DOM diffing
will have a significant impact as well.

TODO

## State & Updating
Component state is managed by an object that implements `Map` (due to issues surrounding extending `Map`);
every change to the state's entries triggers the component to **update**, and then **render**.

```typescript
handleSomeAction(): void {
    this.state.set('foo', true);
    this.state.delete('bar');
}
```

you may also force a component to update without using the built-in state, by calling the `update` method.


## Lifecycle Methods

#### create - `handleComponentCreate(event)`
Dispatched when the component's constructor is called.

#### connect - `handleComponentConnect(event)`
Dispatched when the component has been attached to the DOM.

#### disconnect - `handleComponentDisconnect(event)`
Dispatched when the component has been disconnected from the DOM.

#### render - `handleComponentRender(event)`
Dispatched when the component has been rendered.

#### ready - `handleComponentReady(event)`
Dispatched after the component has been rendered and is ready to be used.

#### update - `handleComponentUpdate(event)`
Dispatched every time the component's state changes.

## TODO
- Updates are batched, in a sense, but it needs to be better
- Add event dispatching to the `Store` for a reux-like feel
