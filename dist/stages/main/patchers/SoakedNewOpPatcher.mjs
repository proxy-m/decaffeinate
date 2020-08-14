import { __extends } from "tslib";
import SoakedFunctionApplicationPatcher from './SoakedFunctionApplicationPatcher';
var SoakedNewOpPatcher = /** @class */ (function (_super) {
    __extends(SoakedNewOpPatcher, _super);
    function SoakedNewOpPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Since `new` makes a new `this`, don't bother with the `guardMethod` variant.
     */
    SoakedNewOpPatcher.prototype.patchMethodCall = function () {
        this.patchNonMethodCall();
    };
    /**
     * Since `new` makes a new `this`, don't bother with the `guardMethod` variant.
     */
    SoakedNewOpPatcher.prototype.patchDynamicMethodCall = function () {
        this.patchNonMethodCall();
    };
    return SoakedNewOpPatcher;
}(SoakedFunctionApplicationPatcher));
export default SoakedNewOpPatcher;
