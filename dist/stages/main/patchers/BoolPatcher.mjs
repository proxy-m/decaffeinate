import { __extends } from "tslib";
import NodePatcher from './../../../patchers/NodePatcher';
var BoolPatcher = /** @class */ (function (_super) {
    __extends(BoolPatcher, _super);
    function BoolPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BoolPatcher.prototype.patchAsExpression = function () {
        switch (this.getOriginalSource()) {
            case 'off':
            case 'no':
                this.overwrite(this.contentStart, this.contentEnd, 'false');
                break;
            case 'on':
            case 'yes':
                this.overwrite(this.contentStart, this.contentEnd, 'true');
                break;
        }
    };
    BoolPatcher.prototype.isRepeatable = function () {
        return true;
    };
    return BoolPatcher;
}(NodePatcher));
export default BoolPatcher;
