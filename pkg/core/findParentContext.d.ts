import { Component } from '../Component';
/**
 * Traverses up the DOM tree to find context which a component may depend on
 * @param root Node from where to search
 * @param key Key used to retrieve object from context
 */
export declare function findParentContext<Dependency extends Component.Context>(root: Node | undefined, key: new () => Dependency): Dependency | undefined;
