import { __extends } from "tslib";
import SourceType from 'coffee-lex/dist/SourceType';
import { Identifier } from 'decaffeinate-parser/dist/nodes';
import { REMOVE_ARRAY_FROM } from '../../../suggestions';
import NodePatcher from './../../../patchers/NodePatcher';
import FunctionApplicationPatcher from './FunctionApplicationPatcher';
/**
 * Handles spread operations, e.g. `a(b...)` or `[a...]`.
 */
var SpreadPatcher = /** @class */ (function (_super) {
    __extends(SpreadPatcher, _super);
    function SpreadPatcher(patcherContext, expression) {
        var _this = _super.call(this, patcherContext) || this;
        _this.expression = expression;
        return _this;
    }
    SpreadPatcher.prototype.initialize = function () {
        this.expression.setRequiresExpression();
    };
    SpreadPatcher.prototype.setAssignee = function () {
        this.expression.setAssignee();
        _super.prototype.setAssignee.call(this);
    };
    /**
     * We need to move the `...` from the right to the left and wrap the
     * expression in Array.from, since CS allows array-like objects and JS
     * requires iterables.
     */
    SpreadPatcher.prototype.patchAsExpression = function () {
        var needsArrayFrom = this.needsArrayFrom();
        var isEllipsisOnLHS = this.firstToken().type === SourceType.RANGE;
        if (!isEllipsisOnLHS) {
            // `a...` → `...Array.from(a...`
            //           ^^^^^^^^^^^^^^
            this.insert(this.expression.outerStart, '...');
        }
        if (needsArrayFrom) {
            this.insert(this.expression.outerStart, 'Array.from(');
        }
        this.expression.patch();
        if (!isEllipsisOnLHS) {
            // `...Array.from(a...` → `...Array.from(a`
            //                 ^^^
            this.remove(this.expression.outerEnd, this.contentEnd);
        }
        if (needsArrayFrom) {
            // Replicate a bug in CoffeeScript where you're allowed to pass null or
            // undefined when the argument spread is the only argument.
            if (this.parent instanceof FunctionApplicationPatcher &&
                this.parent.args.length === 1 &&
                this.parent.args[0] === this) {
                this.insert(this.contentEnd, ' || []');
            }
            // `...Array.from(a` → `...Array.from(a)`
            //                                     ^
            this.insert(this.contentEnd, ')');
        }
    };
    SpreadPatcher.prototype.needsArrayFrom = function () {
        // CS2 converts spread to JS spread, so Array.from is never necessary.
        if (this.options.useCS2) {
            return false;
        }
        // Rest operations should never use Array.from.
        if (this.isAssignee()) {
            return false;
        }
        // Spreading over arguments is always safe.
        if (this.expression.node instanceof Identifier && this.expression.node.data === 'arguments') {
            return false;
        }
        this.addSuggestion(REMOVE_ARRAY_FROM);
        return true;
    };
    return SpreadPatcher;
}(NodePatcher));
export default SpreadPatcher;
