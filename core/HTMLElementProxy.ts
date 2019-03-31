export default new Proxy(HTMLElement, {

    construct: (element, args, widget): object => {
        let tag = widget.name.replace(/([A-Z])/g, x => `-${ x.toLowerCase() }`).replace(/^-/, '');

        if (!tag.includes('-')) {
            tag = `${ tag }-widget`;
        }

        if (!window.customElements.get(tag)) {
            window.customElements.define(tag, widget);
        }

        return Reflect.construct(element, args, widget);
    }
});
