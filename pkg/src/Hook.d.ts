export declare class Hook<State = unknown> extends EventTarget {
    state: State;
    constructor(state: State);
    update(state: State): void;
}
