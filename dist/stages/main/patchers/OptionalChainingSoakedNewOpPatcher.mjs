import { __extends } from "tslib";
import OptionalChainingSoakedFunctionApplicationPatcher from './OptionalChainingSoakedFunctionApplicationPatcher';
/**
 * Patches soaked new operations while targeting optional chaining. This is
 * not allowed in JavaScript, so all this patcher does is fail with a
 * descriptive error message.
 */
var OptionalChainingSoakedNewOpPatcher = /** @class */ (function (_super) {
    __extends(OptionalChainingSoakedNewOpPatcher, _super);
    function OptionalChainingSoakedNewOpPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OptionalChainingSoakedNewOpPatcher.prototype.patchAsExpression = function () {
        throw this.error("JavaScript does not allow constructors with optional chaining. Run without --optional-chaining or edit the original source to manually invoke the constructor conditionally.");
    };
    return OptionalChainingSoakedNewOpPatcher;
}(OptionalChainingSoakedFunctionApplicationPatcher));
export default OptionalChainingSoakedNewOpPatcher;
