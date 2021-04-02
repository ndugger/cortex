import { Component } from '../Component';
export declare function getContext<Context extends Component.Context>(context: new () => Context): Context['value'] | undefined;
