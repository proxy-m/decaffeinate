"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var coffee_lex_1 = require("coffee-lex");
var isInsideAssignee_1 = tslib_1.__importDefault(require("../../../utils/isInsideAssignee"));
var DynamicMemberAccessOpPatcher_1 = tslib_1.__importDefault(require("./DynamicMemberAccessOpPatcher"));
/**
 * Patches soaked dynamic member access operations while targeting optional
 * chaining. This is _almost_ a straight passthrough, but JavaScript adds a `.`
 * compared to CoffeeScript.
 *
 * @example
 *
 * This:
 *
 * ```coffee
 * a?[b]
 * ```
 *
 * Converts to this:
 *
 * ```js
 * a?.[b]
 * ```
 */
var OptionalChainingSoakedDynamicMemberAccessOpPatcher = /** @class */ (function (_super) {
    tslib_1.__extends(OptionalChainingSoakedDynamicMemberAccessOpPatcher, _super);
    function OptionalChainingSoakedDynamicMemberAccessOpPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OptionalChainingSoakedDynamicMemberAccessOpPatcher.prototype.patchAsExpression = function () {
        if (isInsideAssignee_1.default(this.node)) {
            throw this.error("JavaScript does not allow an optional chaining expression in an assignment position. Run without --optional-chaining or edit the original source to remove the assignment of an optional chaining expression.");
        }
        var bracketTokenIndex = this.indexOfSourceTokenBetweenPatchersMatching(this.expression, this.indexingExpr, function (token) { return token.type === coffee_lex_1.SourceType.LBRACKET; });
        if (!bracketTokenIndex) {
            throw this.error("Expected left bracket between expression and index expression, but none was found");
        }
        var bracketToken = this.sourceTokenAtIndex(bracketTokenIndex);
        if (!bracketToken) {
            throw this.error("Expected left bracket between expression and index expression, but none was found");
        }
        this.expression.patch();
        // `a?[b]` → `a?.[b]`
        //              ^
        this.insert(bracketToken.start, '.');
        this.indexingExpr.patch();
    };
    return OptionalChainingSoakedDynamicMemberAccessOpPatcher;
}(DynamicMemberAccessOpPatcher_1.default));
exports.default = OptionalChainingSoakedDynamicMemberAccessOpPatcher;