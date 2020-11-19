# cortex
Lightweight Web Component Framework

<<<<<<< Updated upstream
## Attention
Cortex is currently being rewritten to add functional components, fragments, and portals. To install the current working version (`2.0.0`) you may run the following command:

```
npm install github:ndugger/cortex#2.0.0 --save
```
=======
Cortex is a thin orchestration layer on top of "native" web components. It helps diff changes, and enables lifecycle triggers like rendering, connecting, and updating.

The main goal is to keep the orchestration to a minimum, and rely heavily on already built-in functionality like plain CSS, Custom Elements, and Shadow DOM. This allows us to keep the library size very small.
>>>>>>> Stashed changes

The current up to date `3.0.0-alpha` may be installed with the following command:

```
npm install github:ndugger/cortex --save
```

### Documentation
- [Component](doc/Component.md)
- [Context](doc/Context.md)
- [Element](doc/Element.md)
- [Fragment](doc/Fragment.md)
- [Portal](doc/Portal.md)

## 2.0.0 Documentation

### Why "cortex"?
**cor·tex**

/ˈkôrˌteks/

> the thin outer layer of the cerebrum (the cerebral cortex ), composed of folded gray matter and playing an important role in consciousness.

Cortex (library) is a thin layer on top of "native" web components. It helps orchestrate diffing, and lifecycle triggers like rendering, and updating.

The main goal is to keep the orchestration to a minimum, and rely heavily on already built-in functionality, like plain CSS, Custom Elements, and Shadow DOM. This allows us to keep the library size very tiny.

### Example
```typescript
import { Component, createElement } from 'cortex'

class Example extends Component {

    private handleClick(event: Event): void {
        alert('button was clicked!')
    }

    public render(): Cortex.Element[] {
        return [
            <HTMLButtonElement onclick={ event => this.handleClick(event) }>
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

document.body.append(new Example())
```
<<<<<<< Updated upstream
=======
<p align='center'>
    <img align='center' src='https://i.imgur.com/6nMCuib.png'/>
</p>

&nbsp;
>>>>>>> Stashed changes

![](https://i.imgur.com/6nMCuib.png)

### Explanation
"Native" web components are class-based. You need to extend the base class `HTMLElement` in order for it to be compatible with the DOM.

The `Component` class acts as proxy to the `HTMLElement` class that also automatically registers the custom element, and adds lifecycle capabilities.

```typescript
import * as Cortex from 'cortex'

export class Example extends Cortex.Component {

}
```

There are two public methods that you can/should override: `render` & `theme`. The `render` method returns an array of `Cortex.Element`s (which is a virtual representation of that component's tree). The `theme` method returns a string containing the CSS for that component.

```typescript
<<<<<<< Updated upstream
public render(): Cortex.Element[] {
    return []
}

public theme(): string {
    return ``
}
```

Cortex also supports JSX, so within the render method, you can markup your components very similarly to React.
=======
export class Example extends Component {
    
    protected render(): Element.Child[] {
        return []
    }

    protected theme(): string {
        return ``
    }
}
```

Since cortex uses shadow DOM under the hood, not only is your CSS properly scoped to the component, but you can also make use of slot-based content. Instead of accessing children through a property of that component, simply render an `HTMLSlotElement` and watch as the DOM automatically inserts your content within.

```typescript
<HTMLButtonElement>
    <HTMLSlotElement/>
</HTMLButtonElement>
```

&nbsp;

---

&nbsp;

### JSX Support
Cortex also supports JSX within the render method so you can markup your components very similarly to React.
>>>>>>> Stashed changes

```typescript
public render(): Element.Child[] {
    return [
        <HTMLButtonElement/>
    ]
}
```

<<<<<<< Updated upstream
**Important!** Cortex does not support "intrinsic elements", meaning that you must always pass a class into the JSX; no "literals" allowed, like `div`, `button`, etc.

If there is no standalone class for an element (like `section`, `header`, etc.), you may do `<HTMLElement tag='section'/>`.

Because you must always pass in a class, cortex takes some "left turns" when it comes to certain things, like with CSS classes. Cortex will automatically apply a `className` that is equal to the class' name that you passed in for the element.
=======
In order to enable JSX for cotex, you must add the following to your TypeScript compiler options:

```json
{
    "compilerOptions": {
        "jsx": "react",
        "jsxFactory": "createElement"
    }
}
```

**Important!** Cortex does not support "intrinsic elements", meaning that you must always pass a class (or function) to the JSX factory; no "literals" allowed, like `div`, `button`, `a`, etc.

If there is no standalone class for an element (like `section`, `header`, etc.), you may use `<HTMLElement tag='section'/>`.

Because you must always pass in a class, cortex makes some opinionated decisions when it comes to certain things, like with CSS classes. Cortex will automatically apply a `className` that is equal to the class' name that you passed in for the element.
>>>>>>> Stashed changes

This means that `<HTMLButtonElement/>` becomes `<button class='HTMLButtonElement'/>` in the DOM.

This also contributes to styling your components, because you can now target your elements via their actual class name.

```typescript
public theme(): Cortex.Element[] {
    return `
        .${ HTMLButtonElement.name } {

        }
    `
}
```

<<<<<<< Updated upstream
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
State management is missing from Cortex, as that level of control is up to you. As it stands, you may update fields on a component and initiate a manual update with the `update()` method.

```typescript
class Root extends Cortex.Component {

    public foo: boolean;

    protected handleComponentReady(): void {
        this.update({ foo: true })
    }
}
```

### Context
Cortex components may hook into data stores in the form of context. This context is local to the DOM tree in which it resides.

```typescript
interface App {
    name: string
}

class AppContext extends Cortex.Context<App> {
    value = {
        name: 'default_value'
    }
}
```
=======
&nbsp;
>>>>>>> Stashed changes

```typescript
class Page extends Cortex.Component {

    public name?: string;

    public render(): Cortex.Element[] {
        const app = this.getContext(AppContext)

        return [
            <HTMLElement tag='strong'>
                hello { this?.name }
            </HTMLElement>,
            <HTMLElement tag='em'>
                welcome to { app?.name }
            </HTMLElement>
        ]
    }
}
```

```typescript
class Root extends Cortex.Component {

    public render(): Cortex.Element[] {
        const app = { 
            name: 'demo' 
        }

        return [
            <AppContext value={ app }>
                <Page/>
            </AppContext>
        ]
    }
}
```

### SVG Support
WIP... had this working at one point, will revist in near future
