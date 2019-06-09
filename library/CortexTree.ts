import CortexComponent from './CortexComponent';
import CortexFragment from './CortexFragment';
import CortexNode from './CortexNode';

function isFragment(target: any): boolean {

    if (target === CortexComponent || target === Array  || target === Object|| !target) {
        return false;
    }

    if (target === CortexFragment) {
        return true;
    }

    return isFragment(target.__proto__);
}

export default class CortexTree extends Array<CortexNode> {

    public static from(nodes: CortexNode[] = []): CortexTree {
        const self = new CortexTree();
        const root = nodes.flat();

        for (const node of root) {

            if (node && isFragment(Reflect.get(node, 'type'))) {
                node.create();

                for (const x of (CortexNode.getNode(node) as CortexFragment).render()) {
                    self.push(x || null);
                }
            }
            else {
                self.push(node || null);
            }
        }

        return self;
    }

    public diff(incoming: CortexTree): CortexTree {

        if (this.length >= incoming.length) {
            return CortexTree.from(this.map((node, index) => {
                return node ? node.diff(incoming[ index ]) : incoming[ index ] || null;
            }));
        }

        return CortexTree.from(incoming.map((node, index) => {

            if (index > this.length - 1) {
                return node || null;
            }
            else {
                return this[ index ] ? this[ index ].diff(node) : node || null;
            }
        }));
    }
}
