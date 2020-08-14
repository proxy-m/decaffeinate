import { __extends } from "tslib";
import { SourceType } from 'coffee-lex';
import isInsideAssignee from '../../../utils/isInsideAssignee';
import notNull from '../../../utils/notNull';
import FunctionApplicationPatcher from './FunctionApplicationPatcher';
/**
 * Patches soaked function applications while targeting optional chaining. This
 * is _almost_ a straight passthrough, but JavaScript adds a `.` compared to
 * CoffeeScript.
 *
 * @example
 *
 * This:
 *
 * ```coffee
 * a?(b)
 * ```
 *
 * Converts to this:
 *
 * ```js
 * a?.(b)
 * ```
 */
var OptionalChainingSoakedFunctionApplicationPatcher = /** @class */ (function (_super) {
    __extends(OptionalChainingSoakedFunctionApplicationPatcher, _super);
    function OptionalChainingSoakedFunctionApplicationPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OptionalChainingSoakedFunctionApplicationPatcher.prototype.patchAsExpression = function () {
        if (isInsideAssignee(this.node)) {
            throw this.error("JavaScript does not allow an optional chaining expression in an assignment position. Run without --optional-chaining or edit the original source to remove the assignment of an optional chaining expression.");
        }
        var existenceTokenIndex = notNull(this.indexOfSourceTokenAfterSourceTokenIndex(this.fn.outerEndTokenIndex, SourceType.EXISTENCE));
        var lparenTokenIndex = notNull(this.indexOfSourceTokenAfterSourceTokenIndex(existenceTokenIndex, SourceType.CALL_START));
        var lparenToken = notNull(this.sourceTokenAtIndex(lparenTokenIndex));
        // `a?(b)` → `a?.(b)`
        //              ^
        this.insert(lparenToken.start, '.');
        _super.prototype.patchAsExpression.call(this);
    };
    return OptionalChainingSoakedFunctionApplicationPatcher;
}(FunctionApplicationPatcher));
export default OptionalChainingSoakedFunctionApplicationPatcher;
