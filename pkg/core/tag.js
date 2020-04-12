export function tag(component) {
    if ('tag' in component) {
        return component.tag;
    }
    if (!component.name) {
        return 'unknown';
    }
    const name = component.name.replace(/([A-Z])/g, (char) => `-${char.toLowerCase()}`).replace(/^-/, '');
    const tag = `${name}-component`;
    return tag;
}
//# sourceMappingURL=tag.js.map