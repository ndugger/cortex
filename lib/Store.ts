interface EventMap {
    [ key: string ]: Event;
}

class CortexStore<Data extends object, Events extends EventMap = EventMap> extends EventTarget {

    public data: Data;

    public constructor(data: Data) {
        super();

        this.data = data;
    }

    public addEventListener<Type extends keyof Events>(type: Type, listener: (event: Events[ Type ]) => void): void {
        return super.addEventListener(type as string, listener as EventListener);
    }

    public dispatchEvent<Type extends keyof Events, Event extends Events[ Type ]>(event: Event): boolean {
        return super.dispatchEvent(event);
    }
}

namespace CortexStore {

}

export default CortexStore;
