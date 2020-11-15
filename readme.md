# cortex
Lightweight Web Component Framework

Cortex (library) is a thin layer on top of "native" web components. It helps orchestrate diffing, and lifecycle triggers like rendering, and updating.

The main goal is to keep the orchestration to a minimum, and rely heavily on already built-in functionality, like plain CSS, Custom Elements, and Shadow DOM. This allows us to keep the library size very tiny.

See [how to enable JSX](#JSX-Support) below.

```
npm install github:ndugger/cortex --save
```

### Documentation
- [Component](doc/Component.md)
- [Context](doc/Context.md)
- [Element](doc/Element.md)
- [Fragment](doc/Fragment.md)
- [Portal](doc/Portal.md)
- [Tag](doc/Tag.md)

&nbsp;

---

&nbsp;

### Example
```typescript
import * as Cortex from 'cortex'

class Example extends Cortex.Component {

    private handleClick(event: Event): void {
        alert('button was clicked!')
    }

    public render(): Cortex.Element[] {
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
<p style='display: flex; justify-content: center'>
    <img src='https://i.imgur.com/6nMCuib.png'/>
</p>

&nbsp;

---

&nbsp;

### Explanation
"Native" web components are class-based. You need to extend the base class `HTMLElement` in order for it to be compatible with the DOM.

The `Component` class acts as proxy to the `HTMLElement` class that also automatically registers the custom element, and adds lifecycle capabilities.

```typescript
import { Component, Element, createElement } from 'cortex'

export class Example extends Component {}
```

There are two protected methods that you can/should override: `render` & `theme`. The `render` method returns an array of `Element.Child`s (which is a virtual representation of that component's layout). The `theme` method returns a string containing the CSS for that component.

```typescript
protected render(): Element.Child[] {
    return []
}

protected theme(): string {
    return ``
}
```

&nbsp;

---

&nbsp;

### JSX Support
Cortex also supports JSX within the render method so you can markup your components very similarly to React.

```typescript
public render(): Cortex.Element[] {
    return [
        <HTMLButtonElement/>
    ]
}
```

In order to enable JSX for cotex, you must add the following to your TypeScript compiler options:

```json
"jsx": "react",
"jsxFactory": "createElement",
```

&nbsp;

---

&nbsp;

**Important!** Cortex does not support "intrinsic elements", meaning that you must always pass a class into the JSX; no "literals" allowed, like `div`, `button`, etc.

If there is no standalone class for an element (like `section`, `header`, etc.), you may do `<HTMLElement tag='section'/>`.

Because you must always pass in a class, cortex takes some "left turns" when it comes to certain things, like with CSS classes. Cortex will automatically apply a `className` that is equal to the class' name that you passed in for the element.

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

Since cortex uses shadow DOM under the hood, not only is your CSS properly scoped to the component, but you can also make use of slot-based content. Instead of accessing children through a property of that component, simply render an `HTMLSlotElement` and watch as the DOM automatically inserts your content within.

```typescript
<HTMLButtonElement>
    <HTMLSlotElement/>
</HTMLButtonElement>
```

&nbsp;

---

&nbsp;

### SVG Support
WIP... had this working at one point, will revist in near future
