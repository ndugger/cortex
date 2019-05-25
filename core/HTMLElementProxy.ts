export default new Proxy(HTMLElement, {

    construct: (element, args, component): object => {
        const name = component.name.replace(/([A-Z])/g, (char: string) => `-${ char.toLowerCase() }`).replace(/^-/, '');
        const tag = `${ name }-component`;

        if (!window.customElements.get(tag)) {
            window.customElements.define(tag, component);
        }

        return Reflect.construct(element, args, component);
    }
});
