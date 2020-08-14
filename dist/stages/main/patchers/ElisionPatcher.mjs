import { __extends } from "tslib";
import NodePatcher from './../../../patchers/NodePatcher';
var ElisionPatcher = /** @class */ (function (_super) {
    __extends(ElisionPatcher, _super);
    function ElisionPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ElisionPatcher.prototype.patchAsExpression = function () {
        // Nothing to patch.
    };
    return ElisionPatcher;
}(NodePatcher));
export default ElisionPatcher;
