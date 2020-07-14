import { connect } from './core/connect'
import { create } from './core/create'
import { depend } from './core/depend'
import { diff } from './core/diff'
import { render } from './core/render'

import { childToElement } from './util/childToElement'

import { Context } from './Context'
import { Element } from './Element'
import { Tag } from './Tag'

/**
 * Symbol which represents a component's element tree
 */
const template = Symbol('template')

/**
 * Sumbol which represents whether or not there are changes during updates
 */
const staged = Symbol('staged')

/**
 * Proxy used in order to register a custom element before it is instantiated for the first time
 */
const CustomHTMLElement = new Proxy(HTMLElement, {

    construct(element, args, component): object {
        const tag = Tag.of(component)
        
        if (!window.customElements.get(tag)) {
            window.customElements.define(tag, component)
        }

        return Reflect.construct(element, args, component)
    }
})

/**
 * Base component class from which all custom components must extend
 */
export class Component extends CustomHTMLElement {

    /**
     * Field in which component's template is stored
     */
    private [ template ]: Element.Optional[]

    /**
     * Field in which component render status is stored
     */
    private [ staged ]: boolean
    
    /**
     * Part of custom elements API: called when element mounts to a DOM
     */
    protected connectedCallback(): void {
        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentconnect'))
            this.updatedCallback()

            /**
             * In order to increase type safety, each element receives a `className` equal to its class' name
             */
            if (!this.classList.contains(this.constructor.name)) {
                this.classList.add(this.constructor.name)
            }

            window.requestAnimationFrame(() => {
                this.dispatchEvent(new Component.LifecycleEvent('componentready'))
            })
        })
    }

    /**
     * Part of custom elements API: called when element is removed from its DOM
     */
    protected disconnectedCallback(): void {
        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentdisconnect'))
        })
    }

    /**
     * Custom lifecycle hook: called when element is ready or updated
     */
    protected updatedCallback(): void {
        const style = render(HTMLStyleElement, { textContent: this.theme() })
        const tree = this.render().concat(style).map(childToElement)

        /**
         * If first time render, just save new tree
         * Otherwise diff tree recursively
         */
        if (!this[ template ]) {
            this[ template ] = tree
        }
        else {
            this[ template ] = diff(this[ template ], tree)
        }

        /**
         * Wire up any new component elements with DOM elements
         */
        for (const element of this[ template ]) if (element) {

            if (!element.node) {
                element.node = create(element)
            }

            connect(element, this.shadowRoot as ShadowRoot)
        }

        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentrender'))
        })
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
     * Retrieves a dependency from context.
     * @param key Object which acts as the key of the stored value.
     */
    protected getContext<Dependency extends Context>(dependency: new() => Dependency): Dependency[ 'value' ] {
        const found = depend(this, dependency)

        /**
         * Since it will be unknown whether you are within the specified context, throw if not found
         */
        if (!found) {
            throw new Context.RuntimeError(`Missing context: ${ dependency.name }`)
        }

        return found.value
    }

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
     * Attaches lifecycle listeners upon instantiation, initializes shadow root
     */
    public constructor() { 
        super()

        this.attachShadow({ mode: 'open' })

        this.addEventListener('componentconnect', event => {this.handleComponentConnect(event)})
        this.addEventListener('componentcreate', event => this.handleComponentCreate(event))
        this.addEventListener('componentdisconnect', event => this.handleComponentDisconnect(event))
        this.addEventListener('componentready', event => this.handleComponentReady(event))
        this.addEventListener('componentrender', event => this.handleComponentRender(event))
        this.addEventListener('componentupdate', event => this.handleComponentUpdate(event))

        window.requestAnimationFrame(() => {
            this.dispatchEvent(new Component.LifecycleEvent('componentcreate'))
        })
    }

    /**
     * Triggers an update
     * @param props Optional properties to update with
     * @param immediate Whether or not to attempt an update this frame
     */
    public update(props: object = {}, immediate = false): Promise<void> {
        this[ staged ] = true

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

        if (immediate) {
            this[ staged ] = false
            
            this.dispatchEvent(new Component.LifecycleEvent('componentupdate'))
            
            try {
                this.updatedCallback()
                return Promise.resolve()
            }
            catch (error) {
                return Promise.reject(error)
            }
        }
        
        return new Promise((resolve, reject) => {
            window.requestAnimationFrame(() => {

                if (!this[ staged ]) {
                    return
                }

                this[ staged ] = false;
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
     * JSX component factory
     */
    export const Factory = render

    /**
     * Defines any component
     */
    export type Any<Props> = Constructor<Node & Props> | Fn<Props>

    /**
     * Defines a class-based component
     */
    export interface Constructor<Type extends Node = Node> { 
        new(): Type & Node
    }

    /**
     * Defines a function-based component
     */
    export interface Fn<Props = unknown> {
        (props?: Partial<Props>, ...children: Element.Child[]): Element[]
    }

    /**
     * Decides if a node is a Component
     * @param node 
     */
    export function isComponent(node: Node | undefined): node is Component {
        return node instanceof Component
    }

    /**
     * Decides if a component is a classical component
     * @param constructor 
     */
    export function isConstructor<Props>(constructor: Any<Props>): constructor is Constructor<Node & Props> {
        return constructor === constructor?.prototype?.constructor
    }

    /**
     * Decides if a component is a functional component
     * @param constructor 
     */
    export function isFn<Props>(constructor: Any<Props>): constructor is Fn<Props> {
        return !isConstructor(constructor)
    }

    /**
     * Event interface used for component lifecycle triggers
     */
    export class LifecycleEvent extends Event {
        
    }
}
