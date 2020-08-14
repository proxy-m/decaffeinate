"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var coffee_lex_1 = require("coffee-lex");
var isInsideAssignee_1 = tslib_1.__importDefault(require("../../../utils/isInsideAssignee"));
var notNull_1 = tslib_1.__importDefault(require("../../../utils/notNull"));
var FunctionApplicationPatcher_1 = tslib_1.__importDefault(require("./FunctionApplicationPatcher"));
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
    tslib_1.__extends(OptionalChainingSoakedFunctionApplicationPatcher, _super);
    function OptionalChainingSoakedFunctionApplicationPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OptionalChainingSoakedFunctionApplicationPatcher.prototype.patchAsExpression = function () {
        if (isInsideAssignee_1.default(this.node)) {
            throw this.error("JavaScript does not allow an optional chaining expression in an assignment position. Run without --optional-chaining or edit the original source to remove the assignment of an optional chaining expression.");
        }
        var existenceTokenIndex = notNull_1.default(this.indexOfSourceTokenAfterSourceTokenIndex(this.fn.outerEndTokenIndex, coffee_lex_1.SourceType.EXISTENCE));
        var lparenTokenIndex = notNull_1.default(this.indexOfSourceTokenAfterSourceTokenIndex(existenceTokenIndex, coffee_lex_1.SourceType.CALL_START));
        var lparenToken = notNull_1.default(this.sourceTokenAtIndex(lparenTokenIndex));
        // `a?(b)` → `a?.(b)`
        //              ^
        this.insert(lparenToken.start, '.');
        _super.prototype.patchAsExpression.call(this);
    };
    return OptionalChainingSoakedFunctionApplicationPatcher;
}(FunctionApplicationPatcher_1.default));
exports.default = OptionalChainingSoakedFunctionApplicationPatcher;
