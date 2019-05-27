import * as Cortex from 'cortex';

export interface Task {
    completed: boolean;
    name: string;
    priority: 'high' | 'medium' | 'low';
    when: Date;
}

export default new Cortex.Store<Task[]>([]);
