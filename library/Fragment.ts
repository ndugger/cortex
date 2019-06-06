import Node from './Node';

export default class Fragment extends DocumentFragment {

    public render(): Node[] {
        return [];
    }

    public theme(): string {
        return '';
    }
}
