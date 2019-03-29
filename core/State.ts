import Widget from '../lib/Widget';

export default class State extends Map<string, any> {

    private owner: Widget;

    public constructor(owner: Widget) {
        super();

        this.owner = owner;
    }

    public clear(): void {
        const result = super.clear();

        this.owner.update();

        return result;
    }

    public delete(key: string): boolean {
        const result = super.delete(key as string);

        this.owner.update();

        return result;
    }

    public set(key: string, value: any): this {
        const result = super.set(key as string, value);

        this.owner.update();

        return result;
    }
}
