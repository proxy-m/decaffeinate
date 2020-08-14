import { __extends } from "tslib";
import isInsideAssignee from '../../../utils/isInsideAssignee';
import MemberAccessOpPatcher from './MemberAccessOpPatcher';
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
    __extends(OptionalChainingSoakedMemberAccessOpPatcher, _super);
    function OptionalChainingSoakedMemberAccessOpPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OptionalChainingSoakedMemberAccessOpPatcher.prototype.patchAsExpression = function () {
        if (isInsideAssignee(this.node)) {
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
}(MemberAccessOpPatcher));
export default OptionalChainingSoakedMemberAccessOpPatcher;
