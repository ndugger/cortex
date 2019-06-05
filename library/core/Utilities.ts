import Component from '../Component';
import Node from '../Node';

export function diffTree(existing: Node[], incoming: Node[]): Node[] {

    if (!existing) {
        return incoming.filter(Boolean);
    }

    if (existing.length >= incoming.length) {
        return existing.map((node, index) => node.diff(incoming[ index ])).filter(Boolean) as Node[];
    }
    else {
        return incoming.map((node, index) => {

            if (!node) {
                return;
            }

            if (index + 1 > existing.length) {
                node.create();

                return node;
            }
            else {
                console.log('existing?', existing.length, incoming.length);
                return existing[ index ].diff(node) as Node;
            }
        }).filter(Boolean);
    }
}

export function tag(component: any): string {

    if (!component.name) {
        return 'unknown';
    }

    const name = component.name.replace(/([A-Z])/g, (char: string) => `-${ char.toLowerCase() }`).replace(/^-/, '');
    const tag = `${ name }-component`;

    return tag;
}
