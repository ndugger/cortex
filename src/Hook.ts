export class Hook<State = unknown> extends EventTarget {

    public state?: State
    
    public constructor(state?: State) {
        super()

        if (state) {
            this.state = state
        }
    }

    public update(state = this.state) {
        this.state = state
        this.dispatchEvent(new Event('hookupdate'))
    }
}