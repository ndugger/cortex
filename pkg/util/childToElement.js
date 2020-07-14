import { render } from '../core/render';
export function childToElement(child) {
    /**
     * If attempting to render plain text, convert to Text nodes
     */
    if (typeof child === 'string' || typeof child === 'number') {
        return render(Text, { data: child.toString() });
    }
    return child || undefined;
}
//# sourceMappingURL=childToElement.js.map