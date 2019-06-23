import Properties from './Properties';

export default interface VirtualElement<Constructor extends Node = Node> {
    children: VirtualElement[];
    constructor: {
        new(): Constructor
    };
    node?: Node;
    properties: Properties<Constructor>;
}
