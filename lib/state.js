import * as symbols from './symbols';

export default class State {

    get [ Symbol.iterator ] () {
        return this[ symbols.map ][ Symbol.iterator ];
    }

    get [ Symbol.species ] () {
        return this[ symbols.map ][ Symbol.species ];
    }

    get [ Symbol.toStringTag ] () {
        return this[ symbols.map ][ Symbol.toStringTag ];
    }

    get size () {
        return this[ map ].size;
    }

    constructor (component, data) {
        this[ symbols.component ] = component;
        this[ symbols.map ] = new Map(data);
    }

    clear () {
        this[ symbols.map ].clear();
        this[ symbols.component ][ symbols.updateComponent ]();
    }

    delete (key) {
        this[ symbols.map ].delete(key);
        this[ symbols.component ][ symbols.updateComponent ]();
    }

    entries () {
        return this[ symbols.map ].entries();
    }

    forEach (callback, context) {
        this[ symbols.map ].forEach(callback, context);
    }

    get (key) {
        return this[ symbols.map ].get(key);
    }

    has (key) {
        return this[ symbols.map ].has(key);
    }

    keys () {
        return this[ symbols.map ].keys();
    }

    set (key, value) {
        this[ symbols.map ].set(key, value);
        this[ symbols.component ][ symbols.updateComponent ]();
    }

    values () {
        return this[ symbols.map ].values();
    }
}
