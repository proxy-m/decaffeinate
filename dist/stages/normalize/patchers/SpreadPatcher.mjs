import { __extends } from "tslib";
import PassthroughPatcher from '../../../patchers/PassthroughPatcher';
var SpreadPatcher = /** @class */ (function (_super) {
    __extends(SpreadPatcher, _super);
    function SpreadPatcher(patcherContext, expression) {
        var _this = _super.call(this, patcherContext, expression) || this;
        _this.expression = expression;
        return _this;
    }
    return SpreadPatcher;
}(PassthroughPatcher));
export default SpreadPatcher;
