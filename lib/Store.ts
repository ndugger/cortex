import Widget from './Widget';

export function observe(store: Store): <SubscriberType>(subscriber: SubscriberType) => SubscriberType {
    return subscriber => new Proxy(subscriber as any, {

        construct: (widget, args, extension) => {
            const instance = Reflect.construct(widget, args, extension);

            store.observe(instance);

            return instance;
        }
    });
}

export default class Store<DataType = any> extends EventTarget {

    private batch: boolean;
    private data: DataType;
    private observers: Widget[];

    public constructor(initial: DataType = {} as DataType) {
        super();

        this.batch = false
        this.data = initial;
        this.observers = [];
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

    public emit(): void {

    }

    public observe<WidgetType extends Widget>(instance: WidgetType): void {
        instance.addEventListener('widgetconnect', () => {
            if (!this.observers.includes(instance)) this.observers.push(instance);
        });

        instance.addEventListener('widgetdisconnect', () => {
            this.observers.splice(this.observers.indexOf(instance), 1);
        });
    }
}
