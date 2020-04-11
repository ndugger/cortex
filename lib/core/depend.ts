import { Component } from '../Component';
import { registry } from '../Use';

export const dependencies: Map<unknown, unknown> = new Map();

export function depend(host: new() => Component): unknown[] {
    return registry.get(host).map(key => dependencies.get(key));
}