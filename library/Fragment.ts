import VirtualElement from './interfaces/VirtualElement';

const documentFragmentProxy = new Proxy(DocumentFragment, {

});

export default class CortexFragment extends documentFragmentProxy {

    public render(): VirtualElement[] {
        return [];
    }

    public theme(): string {
        return '';
    }
}
