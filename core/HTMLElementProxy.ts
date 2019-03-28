export default new Proxy(HTMLElement, {

    construct(element, args, component): object {

        if (!window.customElements.get(component.tag)) {
            window.customElements.define(component.tag, component);
        }

        return Reflect.construct(element, args, component);
    }
});
