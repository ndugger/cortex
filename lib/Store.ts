import Component from './Component';

export function observe(store: Store): <SubscriberType>(subscriber: SubscriberType) => SubscriberType {
    return subscriber => new Proxy(subscriber as any, {

        construct: (widget, args, extension) => {
            const instance = Reflect.construct(widget, args, extension);

            store.observe(instance);

            return instance;
        }
    });
}

export default class Store<DataType = any> {

    private batch: boolean;
    private data: DataType;
    private observers: Component[];

    public constructor(initial: DataType = {} as DataType) {
        this.batch = false
        this.data = initial;
        this.observers = [];
    }

    public entries(): IterableIterator<any> {
        return Object.entries(this.data)[ Symbol.iterator ]();
    }

    public add(value: DataType[ keyof DataType ]): void {

        if (!Array.isArray(this.data)) {
            throw new Error('Store#add can only be used for array-based state');
        }

        this.data.push(value);

        if (!this.batch) {
            window.requestAnimationFrame(() => {
                this.batch = false;

                for (const observer of this.observers) {
                    observer.update();
                }
            });
        }

        this.batch = true;
    }

    public delete(item: keyof DataType | DataType[ keyof DataType ]): void {

        if (Array.isArray(this.data)) {
            this.data.splice(this.data.indexOf(item), 1);
        }
        else {
            delete this.data[ item as keyof DataType ];
        }

        if (!this.batch) {
            window.requestAnimationFrame(() => {
                this.batch = false;

                for (const observer of this.observers) {
                    observer.update();
                }
            });
        }

        this.batch = true;
    }

    public get(key: keyof DataType): DataType[ keyof DataType ] {
        return this.data[ key ];
    }

    public set(key: keyof DataType, value: DataType[ keyof DataType ]): void {
        this.data[ key ] = value;

        if (!this.batch) {
            window.requestAnimationFrame(() => {
                this.batch = false;

                for (const observer of this.observers) {
                    observer.update();
                }
            });
        }

        this.batch = true;
    }

    public observe<ComponentType extends Component>(instance: ComponentType): void {
        instance.addEventListener('componentconnect', () => {
            if (!this.observers.includes(instance)) this.observers.push(instance);
        });

        instance.addEventListener('componentdisconnect', () => {
            this.observers.splice(this.observers.indexOf(instance), 1);
        });
    }
}
