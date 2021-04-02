"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hook = void 0;
class Hook extends EventTarget {
    constructor(state) {
        super();
        if (state) {
            this.state = state;
        }
    }
    update(state = this.state) {
        this.state = state;
        this.dispatchEvent(new Event('hookupdate'));
    }
}
exports.Hook = Hook;
