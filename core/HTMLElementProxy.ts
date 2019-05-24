export default new Proxy(HTMLElement, {

    construct: (element, args, widget): object => {
        const tag = `${ widget.name.replace(/([A-Z])/g, x => `-${ x.toLowerCase() }`).replace(/^-/, '') }-component`;

        if (!window.customElements.get(tag)) {
            window.customElements.define(tag, widget);
        }

        return Reflect.construct(element, args, widget);
    }
});
