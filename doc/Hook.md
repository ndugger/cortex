[<- Back](../readme.md)

## Hook

Hooks, formally known as "render hooks", are a way to trigger component updates through the browser's event system. They are accessible from both classical, and functional components.

Although they are used similarly to React hooks, the way they work under the hood is fundamentally different. There are some gotchas with the hook system to watch out for:

- **Hooks should *only* be used during the render lifecycle**
  
  Classical components may use the `this.attachHook()` method at any time of their lifecycle, though it may cause undefined behaviour. Functional components may **only** use the `attachHook()` function while it is rendering, as it will otherwise not know its location in the DOM.

- **Hooks in functional components attach themselves to the encompassing classical component**

  This is an important point as to how the library works under the hood. Hooks will tie themselves to the closest encompassing classical component, as functional components do not render any root node to the DOM. This means that any functional component which causes a hook to update may cause its siblings to re-render, depending on the circumstances.


