"use strict";
Object.defineProperty(exports, "__esModule", {value : true});
exports.mapChildToElement = void 0;
const createElement_1 = require("./createElement");
function mapChildToElement(child) {
  /**
   * If attempting to render plain text, convert to Text nodes
   */
  if (typeof child === 'string' || typeof child === 'number') {
    return createElement_1.createElement(Text, {data : child.toString()});
  }
  return child || undefined;
}
exports.mapChildToElement = mapChildToElement;
//# sourceMappingURL=mapChildToElement.js.map