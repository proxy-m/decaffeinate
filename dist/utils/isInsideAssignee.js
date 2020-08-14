"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var nodes_1 = require("decaffeinate-parser/dist/nodes");
/**
 * Determines whether `node` is inside the main path to an assignee.
 *
 * @example
 *
 * ```ts
 * // true for `a[b]`
 * isInsideAssignee(parse('a[b] = 1').body.statements[0].assignee)
 * // true for `a`
 * isInsideAssignee(parse('a[b] = 1').body.statements[0].assignee.expression)
 * // false for `b`
 * isInsideAssignee(parse('a[b] = 1').body.statements[0].assignee.indexingExpr)
 * ```
 */
function isInsideAssignee(node) {
    if (!node.parentNode) {
        return false;
    }
    if (node.parentNode instanceof nodes_1.AssignOp || node.parentNode instanceof nodes_1.CompoundAssignOp) {
        return node.parentNode.assignee === node;
    }
    if (node.parentNode instanceof nodes_1.PostIncrementOp ||
        node.parentNode instanceof nodes_1.PreIncrementOp ||
        node.parentNode instanceof nodes_1.PostDecrementOp ||
        node.parentNode instanceof nodes_1.PreDecrementOp) {
        return true;
    }
    if (node.parentNode instanceof nodes_1.MemberAccessOp ||
        node.parentNode instanceof nodes_1.DynamicMemberAccessOp ||
        node.parentNode instanceof nodes_1.SoakedMemberAccessOp ||
        node.parentNode instanceof nodes_1.SoakedDynamicMemberAccessOp) {
        return node.parentNode.expression === node && isInsideAssignee(node.parentNode);
    }
    if (node.parentNode instanceof nodes_1.SoakedNewOp) {
        return node.parentNode.ctor === node && isInsideAssignee(node.parentNode);
    }
    if (node.parentNode instanceof nodes_1.FunctionApplication || node.parentNode instanceof nodes_1.SoakedFunctionApplication) {
        return node.parentNode.function === node && isInsideAssignee(node.parentNode);
    }
    return false;
}
exports.default = isInsideAssignee;
