import { __extends } from "tslib";
import NodePatcher from '../../../patchers/NodePatcher';
var DefaultParamPatcher = /** @class */ (function (_super) {
    __extends(DefaultParamPatcher, _super);
    function DefaultParamPatcher(patcherContext, param, value) {
        var _this = _super.call(this, patcherContext) || this;
        _this.param = param;
        _this.value = value;
        return _this;
    }
    DefaultParamPatcher.prototype.initialize = function () {
        this.param.setRequiresExpression();
        this.value.setRequiresExpression();
    };
    DefaultParamPatcher.prototype.patchAsExpression = function () {
        this.param.patch();
        this.value.patch();
    };
    return DefaultParamPatcher;
}(NodePatcher));
export default DefaultParamPatcher;
