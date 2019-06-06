import CortexComponent from './CortexComponent';

interface StoreProxy<Type> {
    new<Data>(data: Data): Type & {
        [ Key in keyof Data ]: Data[ Key ];
    };
}

const dataSymbol = Symbol('data');
const subscribersSymbol = Symbol('subscribers');

export function subscribe(store: CortexStore): <Subscriber>(subscriber: Subscriber) => Subscriber {
    return subscriber => new Proxy(subscriber as any, {

        construct<Target extends CortexComponent>(target: Target, args: any[], base: typeof CortexComponent) {
            const component = Reflect.construct(target as any, args, base);

            store.connect(component);

            return component;
        }
    });
}

export class CortexStore {

    private [ dataSymbol ]: unknown;
    private [ subscribersSymbol ]: CortexComponent[];

    public constructor(data: unknown) {
        this[ dataSymbol ] = data;
        this[ subscribersSymbol ] = [];
    }

    public connect<ComponentType extends CortexComponent>(instance: ComponentType): void {
        instance.addEventListener('componentconnect', () => {
            !this[ subscribersSymbol ].includes(instance) && this[ subscribersSymbol ].push(instance);
        });
        instance.addEventListener('componentdisconnect', () => {
            this[ subscribersSymbol ].splice(this[ subscribersSymbol ].indexOf(instance), 1);
        });

        if (instance.parentNode && !this[ subscribersSymbol ].includes(instance)) {
            this[ subscribersSymbol ].push(instance);
        }
    }

    public update() {
        for (const observer of this[ subscribersSymbol ]) {
            observer.update();
        }
    }
}

export default new Proxy<StoreProxy<CortexStore>>(CortexStore as StoreProxy<CortexStore>, {

    construct<Data>(target: typeof CortexStore, args: [ Data ]): CortexStore & Data {
        return new Proxy(Reflect.construct(target, args), {

            get<Target extends CortexStore>(target: Target, property: keyof Target): Target[ keyof Target ] {
                const actualTarget = (property in target) ? target : Reflect.get(target, dataSymbol);
                const value = Reflect.get(actualTarget, property);

                if (property === 'update') {
                    return Reflect.apply(value, actualTarget, []);
                }

                if (typeof value === 'function') {
                    return new Proxy(value, {

                        apply(method: (...args: any[]) => any, _: any, args: any[]): any {
                            const value = Reflect.apply(method, actualTarget, args);

                            switch (true) {

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

            set<Target extends CortexStore>(target: Target, property: keyof Target, value: Target[ keyof Target ]): boolean {
                const actualTarget = (property in target) ? target : Reflect.get(target, dataSymbol);

                Reflect.set(actualTarget, property, value);
                target.update();

                return true;
            }
        });
    }
});
