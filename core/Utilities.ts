import Node from 'lib/Node';

export function constructComponent(node: Node): Node {
    return node;
}

export function diffTree(existing: Node[], incoming: Node[]): Node[] {

    if (!existing) {
        return incoming.map(node => constructComponent(node));
    }

    if (existing.length > incoming.length) {
        return existing.map((node, index) => node.diff(incoming[ index ])).filter(Boolean) as Node[];
    }
    else {
        return incoming.map((node, index) => {

            if (index + 1 > existing.length) {
                node.create();

                return node;
            }
            else {
                return existing[ index ].diff(node) as Node;
            }
        }).filter(Boolean);
    }
}
