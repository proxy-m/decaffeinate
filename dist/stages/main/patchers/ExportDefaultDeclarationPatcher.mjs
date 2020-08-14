import { __extends } from "tslib";
import NodePatcher from '../../../patchers/NodePatcher';
var ExportDefaultDeclarationPatcher = /** @class */ (function (_super) {
    __extends(ExportDefaultDeclarationPatcher, _super);
    function ExportDefaultDeclarationPatcher(patcherContext, expression) {
        var _this = _super.call(this, patcherContext) || this;
        _this.expression = expression;
        return _this;
    }
    ExportDefaultDeclarationPatcher.prototype.patchAsStatement = function () {
        this.expression.patch();
    };
    return ExportDefaultDeclarationPatcher;
}(NodePatcher));
export default ExportDefaultDeclarationPatcher;
