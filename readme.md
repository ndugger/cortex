# cortex
Lightweight Web Component Framework













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
