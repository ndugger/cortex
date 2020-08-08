import { createVirtualElement } from './createVirtualElement';
export function mapChildToElement(child) {
    /**
     * If attempting to render plain text, convert to Text nodes
     */
    if (typeof child === 'string' || typeof child === 'number') {
        return createVirtualElement(Text, { data: child.toString() });
    }
    return child || undefined;
}
//# sourceMappingURL=mapChildToElement.js.map