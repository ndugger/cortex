import { dependencies } from './core/depend';

import { Component } from './Component';

export const registry: Map<new() => Component, unknown[]> = new Map();

export function Inject<Keys extends [...any[]]>(...keys: Keys): (host: new() => Component) => new() => Component {

    return host => {

        if (!registry.has(host)) {
            registry.set(host, []);
        }

        registry.get(host).concat(keys);

        return host;
    }
}

Inject.setDependency = function setDependency(key: unknown, value: unknown): void {
    dependencies.set(key, value);
}