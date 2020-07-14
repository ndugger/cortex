const tags = new Map();
export function Tag(type) {
    return (tag) => {
        tags.set(type, tag);
        return type;
    };
}
(function (Tag) {
    function of(type) {
        if (tags.has(type)) {
            return tags.get(type) ?? "unknown";
        }
        if (!type.name) {
            return "unknown";
        }
        return `${type.name
            .replace(/([A-Z])/g, (c) => `-${c.toLowerCase()}`)
            .replace(/^-/, "")}-component`;
    }
    Tag.of = of;
})(Tag || (Tag = {}));
//# sourceMappingURL=Tag.js.map
