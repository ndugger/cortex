import { Element } from './Element'

export class Fragment extends DocumentFragment {

    protected render(): Element[] {
        return []
    }

    public constructor() { super()
        
    }
}

export namespace Fragment {
    
}