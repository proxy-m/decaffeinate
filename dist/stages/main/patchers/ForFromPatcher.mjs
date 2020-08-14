import { __extends } from "tslib";
import ForInPatcher from './ForInPatcher';
var ForFromPatcher = /** @class */ (function (_super) {
    __extends(ForFromPatcher, _super);
    function ForFromPatcher(patcherContext, keyAssignee, valAssignee, target, filter, body) {
        return _super.call(this, patcherContext, keyAssignee, valAssignee, target, null /* step */, filter, body) || this;
    }
    ForFromPatcher.prototype.shouldPatchAsForOf = function () {
        return true;
    };
    ForFromPatcher.prototype.shouldWrapForOfStatementTargetInArrayFrom = function () {
        return false;
    };
    return ForFromPatcher;
}(ForInPatcher));
export default ForFromPatcher;
