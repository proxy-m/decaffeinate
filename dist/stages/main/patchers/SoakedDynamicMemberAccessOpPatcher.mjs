import { __extends } from "tslib";
import { REMOVE_GUARD, SHORTEN_NULL_CHECKS } from '../../../suggestions';
import findSoakContainer from '../../../utils/findSoakContainer';
import nodeContainsSoakOperation from '../../../utils/nodeContainsSoakOperation';
import ternaryNeedsParens from '../../../utils/ternaryNeedsParens';
import DynamicMemberAccessOpPatcher from './DynamicMemberAccessOpPatcher';
var GUARD_HELPER = "function __guard__(value, transform) {\n  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;\n}";
var SoakedDynamicMemberAccessOpPatcher = /** @class */ (function (_super) {
    __extends(SoakedDynamicMemberAccessOpPatcher, _super);
    function SoakedDynamicMemberAccessOpPatcher(patcherContext, expression, indexingExpr) {
        var _this = _super.call(this, patcherContext, expression, indexingExpr) || this;
        _this._shouldSkipSoakPatch = false;
        return _this;
    }
    SoakedDynamicMemberAccessOpPatcher.prototype.patchAsExpression = function () {
        if (!this._shouldSkipSoakPatch) {
            if (this.shouldPatchAsConditional()) {
                this.patchAsConditional();
            }
            else {
                this.patchAsGuardCall();
            }
        }
        else {
            this.expression.patch();
            this.indexingExpr.patch();
        }
    };
    SoakedDynamicMemberAccessOpPatcher.prototype.shouldPatchAsConditional = function () {
        return this.expression.isRepeatable() && !nodeContainsSoakOperation(this.expression.node);
    };
    SoakedDynamicMemberAccessOpPatcher.prototype.patchAsConditional = function () {
        this.addSuggestion(SHORTEN_NULL_CHECKS);
        var soakContainer = findSoakContainer(this);
        var expressionCode = this.expression.patchRepeatable();
        var conditionCode;
        if (this.expression.mayBeUnboundReference()) {
            conditionCode = "typeof " + expressionCode + " !== 'undefined' && " + expressionCode + " !== null";
        }
        else {
            conditionCode = expressionCode + " != null";
        }
        this.overwrite(this.expression.outerEnd, this.indexingExpr.outerStart, '[');
        this.indexingExpr.patch();
        if (soakContainer.willPatchAsExpression()) {
            var containerNeedsParens = ternaryNeedsParens(soakContainer);
            if (containerNeedsParens) {
                soakContainer.insert(soakContainer.contentStart, '(');
            }
            soakContainer.insert(soakContainer.contentStart, conditionCode + " ? ");
            soakContainer.appendDeferredSuffix(' : undefined');
            if (containerNeedsParens) {
                soakContainer.appendDeferredSuffix(')');
            }
        }
        else {
            soakContainer.insert(soakContainer.contentStart, "if (" + conditionCode + ") {\n" + soakContainer.getIndent(1));
            soakContainer.appendDeferredSuffix("\n" + soakContainer.getIndent() + "}");
        }
    };
    SoakedDynamicMemberAccessOpPatcher.prototype.patchAsGuardCall = function () {
        this.registerHelper('__guard__', GUARD_HELPER);
        this.addSuggestion(REMOVE_GUARD);
        var soakContainer = findSoakContainer(this);
        var varName = soakContainer.claimFreeBinding('x');
        var prefix = this.slice(soakContainer.contentStart, this.contentStart);
        if (prefix.length > 0) {
            this.remove(soakContainer.contentStart, this.contentStart);
        }
        this.overwrite(this.expression.outerEnd, this.indexingExpr.outerStart, ", " + varName + " => " + prefix + varName + "[");
        soakContainer.insert(soakContainer.contentStart, '__guard__(');
        soakContainer.appendDeferredSuffix(')');
        this.expression.patch();
        this.indexingExpr.patch();
    };
    SoakedDynamicMemberAccessOpPatcher.prototype.setShouldSkipSoakPatch = function () {
        this._shouldSkipSoakPatch = true;
    };
    return SoakedDynamicMemberAccessOpPatcher;
}(DynamicMemberAccessOpPatcher));
export default SoakedDynamicMemberAccessOpPatcher;