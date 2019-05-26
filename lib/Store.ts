import Component from './Component';

interface StoreProxy<Type> {
    new<Data>(data: Data): Type & {
        [ Key in keyof Data ]: Data[ Key ];
    };
}

export function observe(store: InternalStore<any>): <Subscriber>(subscriber: Subscriber) => Subscriber {
    return subscriber => new Proxy(subscriber as any, {

        construct<Target extends Component>(target: Target, args: any[], base: typeof Component) {
            const instance = Reflect.construct(target as any, args, base);

            store.observe(instance);

            return instance;
        }
    });
}

export class InternalStore<Data> {

    private data: Data;
    private observers: Component[];

    public constructor(data: any) {
        this.data = data;
        this.observers = [];
    }

    public observe<ComponentType extends Component>(instance: ComponentType): void {
        instance.addEventListener('componentconnect', () => {
            if (!this.observers.includes(instance)) this.observers.push(instance);
        });
        instance.addEventListener('componentdisconnect', () => {
            this.observers.splice(this.observers.indexOf(instance), 1);
        });

        if (instance.parentNode && !this.observers.includes(instance)) {
            this.observers.push(instance);
        }
    }

    public update() {
        for (const observer of this.observers) {
            observer.update();
        }
    }
}

export default new Proxy(InternalStore, {

    construct<Data>(target: typeof InternalStore, args: [ Data ]): InternalStore<Data> & Data {
        return new Proxy(Reflect.construct(target, args), {

            get<Target extends InternalStore<Data>>(target: Target, property: keyof Target): Target[ keyof Target ] {
                const actualTarget = (property in target) ? target : Reflect.get(target, 'data');
                const value = Reflect.get(actualTarget, property);

                if (typeof value === 'function') {
                    return new Proxy(value, {

                        apply(method: (...args: any[]) => any, _: any, args: any[]): any {
                            const value = Reflect.apply(method, actualTarget, args);

                            if (property !== 'update') switch (true) {

                                case Array.isArray(actualTarget): {

                                    if ([ 'concat', 'pop', 'push', 'splice' ].includes(property as string)) {
                                        target.update();
                                    }

                                    break;
                                }
                                case actualTarget instanceof Map: {

                                    if ([ 'clear', 'delete', 'set' ].includes(property as string)) {
                                        target.update();
                                    }

                                    break;
                                }
                                case actualTarget instanceof Set: {

                                    if ([ 'add', 'clear', 'delete' ].includes(property as string)) {
                                        target.update();
                                    }

                                    break;
                                }
                            }

                            return value;
                        }
                    });
                }

                return value;
            },

            set<Target extends InternalStore<Data>>(target: Target, property: keyof Target, value: Target[ keyof Target ]): boolean {
                const actualTarget = (property in target) ? target : Reflect.get(target, 'data');

                Reflect.set(actualTarget, property, value);
                target.update();

                return true;
            }
        });
    }
}) as StoreProxy<InternalStore<any>>
