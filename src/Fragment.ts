import { Element } from './Element'

export class Fragment extends DocumentFragment {

    protected render(): Element[] {
        return []
    }
}

export namespace Fragment {
    
    export const Factory = () => {}
    
}