import { Component } from '../Component'

export function getContext<Context extends Component.Context>(context: new() => Context): Context[ 'value' ] | undefined {
    return Component.getCurrentBranch().getContext(context)
}