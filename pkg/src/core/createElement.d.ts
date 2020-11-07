import { Component } from '../Component';
import { Element } from '../Element';
import { Fragment } from '../Fragment';
/**
 * Constructs a library element
 * @param type Element type (Either a class which extends Node, or a functional component)
 * @param properties Properties to apply or provide
 * @param children Child elements
 */
export declare function createElement<Constructor extends Node>(constructor: Component.Constructor<Constructor>, props?: Element.TypedProperties<Constructor>, ...children: Element.Child[]): Element<Constructor>;
export declare function createElement<Props extends object>(constructor: Component.Fn<Props>, props?: Props, ...children: Element.Child[]): Element<Fragment>;
