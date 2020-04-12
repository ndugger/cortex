export function tag(component: any): string {

    if ('tag' in component) {
        return component.tag;
    }

    if (!component.name) {
        return 'unknown';
    }

    const name = component.name.replace(/([A-Z])/g, (char: string) => `-${ char.toLowerCase() }`).replace(/^-/, '');
    const tag = `${ name }-component`;

    return tag;
}
