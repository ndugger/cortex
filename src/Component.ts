import { connectElementToHost } from './core/connectElementToHost'
import { createDocumentNode } from './core/createDocumentNode'
import { createElement } from './core/createElement'
import { findParentContext } from './core/findParentContext'
import { mapChildToElement } from './core/mapChildToElement'
import { mapComponentToTag } from './core/mapComponentToTag'
import { mergeTreeChanges } from './core/mergeTreeChanges'

import { Element } from './Element'
import { Hook } from './Hook'

/**
 * Array which acts as a deque of the current branch of components
 */
const branch: Component[] = []

/**
 * Symbol which represents a flag to determine whether a component is connected
 */
const connected = Symbol('connected')

/**
 * Symbol which represents which hooks are attached to a component
 */
const hooks = Symbol('hooks')

/**
 * Symbol which represents a component's rendered tree
 */
const layout = Symbol('layout')

/**
 * Symbol which represents whether or not there are changes during update
 */
const flagged = Symbol('flagged')

/**
 * Symbol which represents which contexts a component is subscribed to
 */
const subscriptions = Symbol('subscriptions')

/**
 * Proxy used in order to register a custom element before it is instantiated for the first time
 */
const CustomHTMLElement = new Proxy(HTMLElement, {

    construct(element, args, component): object {
        const tag = mapComponentToTag(component as any)
        
        if (!globalThis.customElements.get(tag)) {
            globalThis.customElements.define(tag, component as any)
        }

        return Reflect.construct(element, args, component)
    }
})

/**
 * Base component class from which all custom components must extend
 */
export class Component extends CustomHTMLElement {

    /**\
     * Field in which a component's connected status is stored
     */
    private [ connected ]: boolean = false

    /**
     * Field in which component's registered hooks are stored
     */
    private [ hooks ]: Hook[] = []

    /**
     * Field in which component's template is stored
     */
    private [ layout ]: Element.Optional[] = []

    /**
     * Field in which component render status is stored
     */
    private [ flagged ]: boolean = false

    /**
     * Field in which component's subscribed contexts is stored
     */
    private [ subscriptions ]: Map<new() => Component.Context, Component.Context> = new Map()
    
    /**
     * Part of custom elements API: called when element mounts to a DOM
     */
    protected connectedCallback(): void {
        this[ connected ] = true

        this.dispatchEvent(new Component.LifecycleEvent('componentconnect'))

        /**
         * In order to increase type safety, each element receives a `className` equal to its class' name
         */
        if (!this.classList.contains(this.constructor.name)) {
            this.classList.add(this.constructor.name)
        }

        /**
         * Initialize component layout, then dispatch readiness
         */
        this.update().then(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentready'))
        })
    }

    /**
     * Part of custom elements API: called when element is removed from its DOM
     */
    protected disconnectedCallback(): void {
        this[ connected ] = false
        this[ subscriptions ].clear()

        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentdisconnect'))
        })
    }

    /**
     * Custom lifecycle hook: called when element is ready or updated
     */
    protected updatedCallback(): void {
        branch.push(this)

        /**
         * Only render if element connected to a host in case of context subscription leaks
         */
        const elements = this[ connected ] 
            ? this.render()
                .concat(createElement(HTMLStyleElement, { textContent: this.theme() }))
                .map(mapChildToElement) 
            : []

        /**
         * If first time render, just save new tree
         * Otherwise diff tree recursively
         */
        if (!this[ layout ]) {
            this[ layout ] = elements
        }
        else {
            this[ layout ] = mergeTreeChanges(this[ layout ], elements)
        }

        /**
         * Wire up any new component elements with DOM elements
         */
        for (const element of this[ layout ]) if (element) {

            if (!element.node) {
                element.node = createDocumentNode(element)
            }

            connectElementToHost(element, this.shadowRoot as ShadowRoot)
        }

        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentrender'))
        })
        
        branch.pop()
    }

    /**
     * Used to hook into the connection lifecycle
     * @param event Connect lifecycle event
     */
    protected handleComponentConnect(event: Component.LifecycleEvent): void {}

    /**
     * Used to hook into the create lifecycle
     * @param event Create lifecycle event
     */
    protected handleComponentCreate(event: Component.LifecycleEvent): void {}

    /**
     * Used to hook into the disconnect lifecycle
     * @param event Disconnect lifecycle event
     */
    protected handleComponentDisconnect(event: Component.LifecycleEvent): void {}

    /**
     * Used to hook into the ready lifecycle
     * @param event Ready lifecycle event
     */
    protected handleComponentReady(event: Component.LifecycleEvent): void {}

    /**
     * Used to hook into the render lifecycle
     * @param event Render lifecycle event
     */
    protected handleComponentRender(event: Component.LifecycleEvent): void {}

    /**
     * Used to hook into the update lifecycle
     * @param event Update lifecycle event
     */
    protected handleComponentUpdate(event: Component.LifecycleEvent): void {}

    /**
     * Constructs a component's template
     */
    protected render(): Element.Child[] {
        return []
    }

    /**
     * Constructs a component's stylesheet
     */
    protected theme(): string {
        return ''
    }

    /**
     * Creates a component, attaches lifecycle listeners upon instantiation, and initializes shadow root
     */
    public constructor() {
        super()

        this.addEventListener('componentconnect', event => this.handleComponentConnect(event))
        this.addEventListener('componentcreate', event => this.handleComponentCreate(event))
        this.addEventListener('componentdisconnect', event => this.handleComponentDisconnect(event))
        this.addEventListener('componentready', event => this.handleComponentReady(event))
        this.addEventListener('componentrender', event => this.handleComponentRender(event))
        this.addEventListener('componentupdate', event => this.handleComponentUpdate(event))

        this.attachShadow({ mode: 'open' })

        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentcreate'))
        })
    }

    /**
     * Retrieves a dependency from context.
     * @param context Object which acts as the key of the stored value
     */
    public getContext<Context extends Component.Context>(context: new() => Context): Context[ 'value' ] | undefined {

        /**
         * Return cached context if found
         */
        if (this[ subscriptions ].has(context)) {
            return this[ subscriptions ].get(context)?.value
        }

        /**
         * Otherwise walk up DOM tree to find context
         */
        const found = findParentContext(this, context)

        /**
         * Return nothing if looking outside of any matching context's tree
         */
        if (!found) {
            // TODO is the following todo still relevant? (oops)
            // TODO (delay functional render so context is rendered before functions called) throw new Error(`Missing context: ${ dependency.name }`)
            return
        }

        /**
         * If retrieving context for the first time, subscribe to its updates
         */
        if (!this[ subscriptions ].has(context)) {
            const contextListener = () => {
                this.update()
            }

            this[ subscriptions ].set(context, found)

            found.addEventListener('componentupdate', contextListener)

            this.addEventListener('componentdisconnect', () => {
                this[ subscriptions ].delete(context)
                found.removeEventListener('componentupdate', contextListener)
            })
        }

        return found?.value
    }

    public attachHook<State>(hook: Hook<State>): State | undefined {
        
        if (this[ hooks ].includes(hook)) {
            return hook.state
        }

        hook.addEventListener('hookupdate', () => {
            this.update()
        })

        this[ hooks ].push(hook)

        return hook.state
    }

    /**
     * Triggers an update
     * @param props Optional properties to update with
     * @param immediate Whether or not to attempt an update this frame
     */
    public update(props: object = {}, immediate = false): Promise<void> {
        this[ flagged ] = true

        for (const prop of Object.keys(props)) {

            if (this[ prop ] === props[ prop ]) {
                continue
            }

            if (this[ prop ] && typeof this[ prop ] === 'object') {
                Object.assign(this[ prop ], props[ prop ])
            }
            else {
                this[ prop ] = props[ prop ]
            }
        }

        /**
         * If immediate mode enabled, don't batch update
         */
        if (immediate) {
            this[ flagged ] = false
            
            this.dispatchEvent(new Component.LifecycleEvent('componentupdate'))

            try {
                this.updatedCallback()
                return Promise.resolve()
            }
            catch (error) {
                return Promise.reject(error)
            }
        }

        /**
         * If immediate mode not enabled, batch updates
         */
        return new Promise((resolve, reject) => {
            window.requestAnimationFrame(() => {

                if (!this[ flagged ]) {
                    return
                }

                this[ flagged ] = false;
                this.dispatchEvent(new Component.LifecycleEvent('componentupdate'))

                try {
                    this.updatedCallback()
                    resolve()
                }
                catch (error) {
                    reject(error)
                }
            })
        })
    }
}

export namespace Component {

    /**
     * Adds `children` to props, useful for function-based components
     */
    export type PropsWithChildren<Props = unknown> = Props & {
        children?: Element.Child[]
    }

    /**
     * Defines any component
     */
    export type Any<Props> = Constructor<Node & Props> | Fn<Props> | (new() => Node)

    /**
     * Defines a class-based component
     */
    export interface Constructor<Type extends Node = Node> {
        new(): Type
    }

    /**
     * Defines a function-based component
     */
    export interface Fn<Props = unknown> {
        (props: PropsWithChildren<Props>): Element[]
    }

    /**
     * Decides if a node is a Component
     * @param node
     */
    export function isComponent(node: Node | undefined): node is Component {
        return node instanceof Component
    }

    /**
     * Decides if a component is a node constructor
     * @param constructor
     */
    export function isConstructor<Props>(constructor: Any<Props>): constructor is Constructor<Node & Props> {

        if (!constructor || constructor === Object) {
            return false
        }

        if (constructor as any === Node) {
            return true
        }

        return isConstructor(Object.getPrototypeOf(constructor))
    }

    /**
     * Decides if a component is a functional component
     * @param constructor
     */
    export function isFn<Props>(constructor: Any<Props>): constructor is Fn<Props> {
        return !isConstructor(constructor)
    }

    export function getCurrentBranch(): Component {
        return branch[ branch.length - 1 ]
    }

    /**
     * Used to provide contextual state within a given component tree
     */
    export class Context<Data = any> extends Component {

        public value?: Data = this as any
    
        public render(): Element[] {
            return [ 
                createElement(HTMLSlotElement)
            ]
        }
    
        public theme(): string { // https://developers.google.com/web/updates/2019/02/constructable-stylesheets
            return `
                :host {
                    display: contents;
                }
            `
        }
    }

    /**
     * Event interface used for component lifecycle triggers
     */
    export class LifecycleEvent extends Event {

    }
}
