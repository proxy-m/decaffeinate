import { __extends, __read, __values } from "tslib";
import normalizeListItem from '../../../utils/normalizeListItem';
import NodePatcher from './../../../patchers/NodePatcher';
var ArrayInitialiserPatcher = /** @class */ (function (_super) {
    __extends(ArrayInitialiserPatcher, _super);
    function ArrayInitialiserPatcher(patcherContext, members) {
        var _this = _super.call(this, patcherContext) || this;
        _this.members = members;
        return _this;
    }
    ArrayInitialiserPatcher.prototype.patchAsExpression = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.members.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var _d = __read(_c.value, 2), i = _d[0], member = _d[1];
                member.patch();
                normalizeListItem(this, member, this.members[i + 1]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    return ArrayInitialiserPatcher;
}(NodePatcher));
export default ArrayInitialiserPatcher;
