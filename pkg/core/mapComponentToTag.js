import { tags } from './defineCustomElement';
export function mapComponentToTag(type) {
    if (tags.has(type)) {
        return tags.get(type) ?? 'unknown';
    }
    if (!type.name) {
        return 'unknown';
    }
    return `${type.name.replace(/([A-Z])/g, c => `-${c.toLowerCase()}`).replace(/^-/, '')}-component`;
}
//# sourceMappingURL=mapComponentToTag.js.map