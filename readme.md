# quark

[ Shadow DOM + Virtual DOM ] Web Component Framework For Web Applications

**Compatible with JSX**

```
npm install git+https://github.com/ndugger/quark.git#v1.0.0 --save
```

This project is open source; although I will be using it in production (in personal projects),
I will not offer any promise of support, nor will I quickly address issues unless it suits my projects.

The purpose of this project is to explore how to create a react-like component
infrastructure and lifecycle using native Web Components (custom elements & shadow DOM).


## Browser Support

Since quark is based on bleeding-edge APIs, only **Chrome** (and **Opera**) is supported at the moment.

**Firefox** is currently working on Shadow DOM, and **Edge** has it set as, "under consideration".

There are no plans to ever support Internet Explorer.

The bleeding-edge APIs are as follows:

- Shadow DOM
- Custom Elements
- Proxy
- Reflect


## Performance

Performance will mostly be beholden to the efficiency of shadow DOM, but the virtual DOM diffing
will have a significant impact as well.

TODO


## State & Updating

Component state is managed by an object that implements `Map` (due to issues surrounding extending `Map`);
every change to the state's entries triggers the component to **update**, and then **render**.

```javascript
static initialState = {
    foo: false,
    bar: true
};

handleSomeAction () {
    this.state.set('foo', true);
    this.state.delete('bar');
}
```

you may also force a component to update without using the built-in state, by calling the `update` method.


## Lifecycle Methods

#### create - `handleComponentCreate (event) { }`
Dispatched when the component's constructor is called.

#### connect - `handleComponentConnect (event) { }`
Dispatched when the component has been attached to the DOM.

#### disconnect - `handleComponentDisconnect (event) { }`
Dispatched when the component has been disconnected from the DOM.

#### render - `handleComponentRender (event) { }`
Dispatched when the component has been rendered.

#### ready - `handleComponentReady (event) { }`
Dispatched after the component has been rendered and is ready to be used.

#### update - `handleComponentUpdate (event) { }`
Dispatched every time the component's state changes.


## Example

```javascript
import { Component, element } from 'quark';

class ExampleApp extends Component {

    static elementName = 'example-app';

    static initialState = {
        color: 'red'
    };

    static defaultProperties = {
        message: 'This text changes color!'
    };

    handleInput (event) {
        this.state.set('color', event.target.value);
    }

    render () {
        const color = this.state.get('color');

        return (
            element('article', null, [
                element('p', { style: { color } }, this.message),
                element('input', { oninput: e => this.handleInput(e) })
            ])
        )
    }
}

document.body.appendChild(new ExampleApp());
```


## Shadow DOM

quark uses Shadow DOM to render components; this means that you may take advantage of slots.

```javascript
class MyComponent extends Component {

    render () {
        return (
            element('section', null, [
                element('header', null, 'Children render below...'),
                element('slot')
            ])
        )
    }
}
```


## JSX Compatible

```javascript
element(MyComponent, null, [
    element('div', null, 'Without JSX')
])
```

```javascript
<MyComponent>
    <div>With JSX</div>
</MyComponent>
```


## CSS / Styling

Since shadow DOM allows for encapsulated styles, I figured quark should have a built-in way to take advantage of them. 
All you have to do is add `get css () { }` to your component that returns a string of CSS.

```javascript
class MyComponent extends Component {
    
    get css () {
        return `
            :host {
                display: block;
            }
            section {
                background: #CCC;
            }
            header {
                color: white;
                background: #666;
            }
        `
    }
}
```

The reason that `css` is a getter, is so that you can consume the component's state to manipulate your styles.

```javascript
static initialState = {
    error: false;
}

get css () {
    const error = this.state.get('error');
    
    return `
        header {
            color: ${ error ? 'red' : 'white' };
            background: #666;
        }
    `
}
```
