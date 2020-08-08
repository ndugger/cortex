export const tags = new Map();
export function defineCustomElement(tag) {
    return type => {
        tags.set(type, tag);
        return type;
    };
}
//# sourceMappingURL=defineCustomElement.js.map