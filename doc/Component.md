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

interface Props {
    name: string
}

class Example extends Component {

    protected render() {
        return [

        ]
    }

    protected theme() {
        return `
        
        `
    }
}
```

### Functional Components

Added initially to help cross the bridge between [Fragment](Fragment.md) and [Portal](Portal.md), functional components are a great way to define a collection of markup that simply takes properties and renders them into other components (like a template). The child components may be functional or classical components which may then contain more complex logic.

The reason why functional components lack the ability to hook into context is because unlike other libraries which use a virtual DOM, Cortex renders custom elements directly to the DOM, so there needs to be a "physical" element that is rendered, and functional components render their contents to a [Fragment](Fragment.md).

The same reason explains the lack of ability to add scoped styles; since there is no custom element being registered, there is no shadow root, and you lose the benefits of being able to locally scope your styles within.

It is important to note that use of `<HTMLSlotElement/>` inside of functional components is **highly discouraged**. It will render in the tree of the parent classical component and could cause content to render unexpectedly.

```typescript
import { Component } from 'cortex'

interface Props {
    name: string
}

export const Example: Component.Fn<Props> = (props, ...children) => [
    <HTMLDivElement>
        <HTMLSpanElement>
            Hello, { props.name }
        </HTMLSpanElement>
        <HTMLDivElement>
            { ...children }
        </HTMLDivElement>
    </HTMLDivElement>
]
```
