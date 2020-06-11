import { Context } from '../Context';
/**
 * Traverses up the DOM tree to find context which a component may depend on
 * @param root Node from where to search
 * @param key Key used to retrieve object from context
 */
export declare function depend<Dependency extends Context>(root: Node, key: new () => Dependency): Dependency | void;
