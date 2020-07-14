import { Element } from '../Element';
/**
 * Compare existing tree to incoming tree and merge incoming changes
 * @param existing Existing tree (previous render)
 * @param incoming Incoming tree (next render)
 */
export declare function diff(existing: Element.Optional[], incoming: Element.Optional[]): Element.Optional[];
