export default function tag(component: any): string {

    if (!component.name) {
        return 'unknown';
    }

    const name = component.name.replace(/([A-Z])/g, (char: string) => `-${ char.toLowerCase() }`).replace(/^-/, '');
    const tag = `${ name }-component`;

    return tag;
}
