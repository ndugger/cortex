import Element from './interfaces/Element';

const DocumentFragmentProxy = new Proxy(DocumentFragment, {

});

export default class CortexFragment extends DocumentFragmentProxy {

    public render(): Element[] {
        return [];
    }

    public theme(): string {
        return '';
    }
}
