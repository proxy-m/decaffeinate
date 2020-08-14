"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var decaffeinate_parser_1 = require("decaffeinate-parser");
var nodes_1 = require("decaffeinate-parser/dist/nodes");
/**
 * Gets the number of usages of the given name in the given node.
 */
function countVariableUsages(node, name) {
    var numUsages = 0;
    decaffeinate_parser_1.traverse(node, function (child) {
        // Make sure it's the name we're looking for.
        if (!(child instanceof nodes_1.Identifier) || child.data !== name) {
            return;
        }
        // Skip `b` in `a.b`.
        if (child.parentNode instanceof nodes_1.MemberAccessOp && child.parentNode.member === child) {
            return;
        }
        // Skip `a` in `{ a: b }`, but not in `{ a }` or `{ [a]: b }`.
        if (child.parentNode instanceof nodes_1.ObjectInitialiserMember &&
            child.parentNode.key === child &&
            // `{ a }`
            child.parentNode.expression !== null &&
            // `{ [a]: b }`
            !child.parentNode.isComputed) {
            return;
        }
        numUsages += 1;
    });
    return numUsages;
}
exports.default = countVariableUsages;
