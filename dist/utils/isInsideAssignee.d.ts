import { Node } from 'decaffeinate-parser/dist/nodes';
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
export default function isInsideAssignee(node: Node): boolean;
