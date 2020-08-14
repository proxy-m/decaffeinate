"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var isInsideAssignee_1 = tslib_1.__importDefault(require("../../../utils/isInsideAssignee"));
var MemberAccessOpPatcher_1 = tslib_1.__importDefault(require("./MemberAccessOpPatcher"));
/**
 * Patches soaked member access while targeting optional chaining. This is
 * a straight passthrough, but we add a check to ensure the resulting JavaScript
 * would be valid. CoffeeScript allows such expressions in a LHS assignment
 * context, but JavaScript does not.
 *
 * @example
 *
 * ```coffee
 * a?.b       # this is fine in CoffeesScript and JavaScript
 * a?.b = 1   # this is fine in CoffeeScript, but not JavaScript
 * ```
 */
var OptionalChainingSoakedMemberAccessOpPatcher = /** @class */ (function (_super) {
    tslib_1.__extends(OptionalChainingSoakedMemberAccessOpPatcher, _super);
    function OptionalChainingSoakedMemberAccessOpPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OptionalChainingSoakedMemberAccessOpPatcher.prototype.patchAsExpression = function () {
        if (isInsideAssignee_1.default(this.node)) {
            throw this.error("JavaScript does not allow an optional chaining expression in an assignment position. Run without --optional-chaining or edit the original source to remove the assignment of an optional chaining expression.");
        }
        this.expression.patch();
    };
    /**
     * There isn't an implicit-dot syntax like @a for soaked access.
     */
    OptionalChainingSoakedMemberAccessOpPatcher.prototype.hasImplicitOperator = function () {
        return false;
    };
    return OptionalChainingSoakedMemberAccessOpPatcher;
}(MemberAccessOpPatcher_1.default));
exports.default = OptionalChainingSoakedMemberAccessOpPatcher;
