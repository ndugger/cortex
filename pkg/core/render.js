import { Component } from "../Component";
import { Fragment } from "../Fragment";
export function render(constructor, props, ...children) {
    /**
     * If rendering a functional component, return a fragment with the children
     * being the output from the function
     */
    if (Component.isFn(constructor)) {
        return render(
            Fragment,
            undefined,
            ...constructor(Object.assign(props ?? {}, { children }))
        );
    }
    return {
        children: children.flat().map((child) => {
            /**
             * If attempting to render plain text, convert to Text nodes
             */
            if (typeof child === "string" || typeof child === "number") {
                return render(Text, { textContent: child.toString() });
            }
            return child || undefined;
        }),
        constructor,
        defaults: {},
        properties: props,
    };
}
//# sourceMappingURL=render.js.map
