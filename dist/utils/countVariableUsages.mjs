import { traverse } from 'decaffeinate-parser';
import { Identifier, MemberAccessOp, ObjectInitialiserMember } from 'decaffeinate-parser/dist/nodes';
/**
 * Gets the number of usages of the given name in the given node.
 */
export default function countVariableUsages(node, name) {
    var numUsages = 0;
    traverse(node, function (child) {
        // Make sure it's the name we're looking for.
        if (!(child instanceof Identifier) || child.data !== name) {
            return;
        }
        // Skip `b` in `a.b`.
        if (child.parentNode instanceof MemberAccessOp && child.parentNode.member === child) {
            return;
        }
        // Skip `a` in `{ a: b }`, but not in `{ a }` or `{ [a]: b }`.
        if (child.parentNode instanceof ObjectInitialiserMember &&
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
