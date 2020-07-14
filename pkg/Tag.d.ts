import { Component } from './Component';
export declare function Tag<Type extends Component.Constructor>(type: Type): (tag: string) => Type;
export declare namespace Tag {
    function of<Type extends Component.Constructor>(type: Type): string;
}
