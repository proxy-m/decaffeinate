import { __extends } from "tslib";
import SharedProgramPatcher from '../../../patchers/SharedProgramPatcher';
var ProgramPatcher = /** @class */ (function (_super) {
    __extends(ProgramPatcher, _super);
    function ProgramPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ProgramPatcher.prototype.patchAsStatement = function () {
        if (this.body) {
            this.body.patch();
        }
        this.patchHelpers();
    };
    return ProgramPatcher;
}(SharedProgramPatcher));
export default ProgramPatcher;
