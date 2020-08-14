import { __extends } from "tslib";
/**
 * Handles soaked array or string slicing, e.g. `names?[i..]`.
 */
import { REMOVE_GUARD } from '../../../suggestions';
import findSoakContainer from '../../../utils/findSoakContainer';
import SlicePatcher from './SlicePatcher';
var GUARD_HELPER = "function __guard__(value, transform) {\n  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;\n}";
var SoakedSlicePatcher = /** @class */ (function (_super) {
    __extends(SoakedSlicePatcher, _super);
    function SoakedSlicePatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SoakedSlicePatcher.prototype.patchAsExpression = function () {
        this.registerHelper('__guard__', GUARD_HELPER);
        this.addSuggestion(REMOVE_GUARD);
        var soakContainer = findSoakContainer(this);
        var varName = soakContainer.claimFreeBinding('x');
        var prefix = this.slice(soakContainer.contentStart, this.contentStart);
        if (prefix.length > 0) {
            this.remove(soakContainer.contentStart, this.contentStart);
        }
        this.insert(this.expression.outerEnd, ", " + varName + " => " + prefix + varName);
        soakContainer.insert(soakContainer.contentStart, '__guard__(');
        _super.prototype.patchAsExpression.call(this);
        soakContainer.appendDeferredSuffix(')');
    };
    /**
     * For a soaked splice operation, we are the soak container.
     */
    SoakedSlicePatcher.prototype.getSpliceCode = function (expressionCode) {
        var _this = this;
        var spliceStart = this.captureCodeForPatchOperation(function () {
            _this.registerHelper('__guard__', GUARD_HELPER);
            _this.addSuggestion(REMOVE_GUARD);
            var varName = _this.claimFreeBinding('x');
            _this.insert(_this.expression.outerEnd, ", " + varName + " => " + varName);
            _this.patchAsSpliceExpressionStart();
        });
        return "__guard__(" + spliceStart + ", ...[].concat(" + expressionCode + ")))";
    };
    return SoakedSlicePatcher;
}(SlicePatcher));
export default SoakedSlicePatcher;
