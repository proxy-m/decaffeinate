import { __assign, __extends } from "tslib";
import NodePatcher from './../../../patchers/NodePatcher';
var UnaryOpPatcher = /** @class */ (function (_super) {
    __extends(UnaryOpPatcher, _super);
    function UnaryOpPatcher(patcherContext, expression) {
        var _this = _super.call(this, patcherContext) || this;
        _this.expression = expression;
        return _this;
    }
    UnaryOpPatcher.prototype.initialize = function () {
        this.expression.setRequiresExpression();
    };
    /**
     * OP EXPRESSION
     */
    UnaryOpPatcher.prototype.patchAsExpression = function (options) {
        if (options === void 0) { options = {}; }
        this.expression.patch(__assign(__assign({}, options), { needsParens: true }));
    };
    /**
     * If `EXPRESSION` needs parens then `EXPRESSION OP` needs parens.
     */
    UnaryOpPatcher.prototype.statementNeedsParens = function () {
        return this.expression.statementShouldAddParens();
    };
    return UnaryOpPatcher;
}(NodePatcher));
export default UnaryOpPatcher;
