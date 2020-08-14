"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var nodes_1 = require("decaffeinate-parser/dist/nodes");
var containsDescendant_1 = tslib_1.__importDefault(require("./containsDescendant"));
/**
 * Determine if there are any soak operations within this subtree of the AST.
 */
function nodeContainsSoakOperation(node) {
    return containsDescendant_1.default(node, function (child) {
        return child instanceof nodes_1.SoakedDynamicMemberAccessOp ||
            child instanceof nodes_1.SoakedFunctionApplication ||
            child instanceof nodes_1.SoakedMemberAccessOp;
    });
}
exports.default = nodeContainsSoakOperation;
