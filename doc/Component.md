[<- Back](../readme.md)

## Component

Components are the bread and butter in Cortex, it's the mechanism used to define the markup of your application. Similar to other libraries, Cortex has two ways to define components:

- [**Classical**](#Classical-Components)

  Class-based components which register custom elements with the browser. These contain far more functionality than their functional counterparts and might be used to build out your core set of components.

- [**Functional**](#Functional-Components)

  Function-based components which render elements to a [Fragment](Fragment.md). These lack the abilities to hook into context, and to add scoped styles. Read more below.

### Classical Components

```typescript
import { Component } from 'cortex'

export class Example extends Component implements Example.Props {

    protected render() {
        return [
            <HTMLDivElement>
                <HTMLSlotElement/>
            </HTMLDivElement>
        ]
    }

    protected theme() {
        return `
            .${ HTMLDivElement.name } {
                font-weight: bold;
            }
        `
    }
}

export namespace Example {
    
    export interface Props {
        name: string
    }
}
```

### Functional Components

Added initially to help cross the bridge between [Fragment](Fragment.md) and [Portal](Portal.md), functional components are a great way to define a collection of markup that simply takes properties and renders them into other components (like a template). The child components may be functional or classical components which may then contain more complex logic.

The reason why functional components lack the ability to hook into context is because unlike other libraries which use a virtual DOM, Cortex renders custom elements directly to the DOM, so there needs to be a "physical" element that is rendered, and functional components render their contents to a [Fragment](Fragment.md) (which extends `DocumentFragment`).

The same reason explains the lack of ability to add scoped styles; since there is no custom element hosting the contents, there is no shadow root, and you lose the benefits of being able to locally scope your styles within.

It is important to note that use of `<HTMLSlotElement/>` inside of functional components is **highly discouraged**. It will render in the tree of the parent classical component and could cause content to render unexpectedly. Always feel free to experiment, however.

```typescript
import { Component } from 'cortex'

interface Props {
    name: string
}

export const Example: Component.Fn<Props> = ({
    children = []
    name = ''
}) => [
    <HTMLDivElement>
        <HTMLSpanElement>
            Hello, { name }
        </HTMLSpanElement>
        <HTMLDivElement>
            { ...children }
        </HTMLDivElement>
    </HTMLDivElement>
]
```
