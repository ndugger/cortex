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

### Explanation
"Native" web components are class-based. You need to extend the base class `HTMLElement` in order for it to be compatible with the DOM.

The `Component` class acts as proxy to the `HTMLElement` class that also automatically registers the custom element, and adds lifecycle capabilities.

```typescript
import * as Cortex from 'cortex';

export default class Example extends Cortex.Component {

}
```

There are two public methods that you can/should override: `render` & `theme`. The `render` method returns an array of `Cortex.Node`s (which is a virtual representation of that component's tree). The `theme` method returns a string containing the CSS for that component.

```typescript
public render(): Cortex.Node[] {
    return [];
}

public theme(): string {
    return ``;
}
```

Cortex also supports JSX, so within the render method, you can markup your components very similarly to React.

```typescript
public render(): Cortex.Node[] {
    return [
        <HTMLButtonElement/>
    ];
}
```

**Important!** Cortex does not support "intrinsic elements", meaning that you must always pass a class into the JSX; no "literals" allowed, like `div`, `button`, etc.

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

### Lifecycle Methods

#### create - `handleComponentCreate(event: CustomEvent): void`
Dispatched when the component's constructor is called.

#### connect - `handleComponentConnect(event: CustomEvent): void`
Dispatched when the component has been attached to the DOM.

#### disconnect - `handleComponentDisconnect(event: CustomEvent): void`
Dispatched when the component has been disconnected from the DOM.

#### render - `handleComponentRender(event: CustomEvent): void`
Dispatched when the component has been rendered.

#### ready - `handleComponentReady(event: CustomEvent): void`
Dispatched after the component has been rendered and is ready to be used.

#### update - `handleComponentUpdate(event: CustomEvent): void`
Dispatched every time the component's state changes.


---

**Old Readme (Very Outdated):**

### State & Updating
Component state is managed by an object that implements `Map` (due to issues surrounding extending `Map`);
every change to the state's entries triggers the component to **update**, and then **render**.

```typescript
handleSomeAction(): void {
    this.state.set('foo', true);
    this.state.delete('bar');
}
```

you may also force a component to update without using the built-in state, by calling the `update` method.
