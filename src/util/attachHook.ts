import { Component } from '../Component'
import { Hook } from '../Hook'

export function attachHook<State>(hook: Hook<State>): State | undefined {
    return Component.getCurrentBranch().attachHook(hook)
}