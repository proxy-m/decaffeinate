"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Handles soaked array or string slicing, e.g. `names?[i..]`.
 */
var suggestions_1 = require("../../../suggestions");
var findSoakContainer_1 = tslib_1.__importDefault(require("../../../utils/findSoakContainer"));
var SlicePatcher_1 = tslib_1.__importDefault(require("./SlicePatcher"));
var GUARD_HELPER = "function __guard__(value, transform) {\n  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;\n}";
var SoakedSlicePatcher = /** @class */ (function (_super) {
    tslib_1.__extends(SoakedSlicePatcher, _super);
    function SoakedSlicePatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SoakedSlicePatcher.prototype.patchAsExpression = function () {
        this.registerHelper('__guard__', GUARD_HELPER);
        this.addSuggestion(suggestions_1.REMOVE_GUARD);
        var soakContainer = findSoakContainer_1.default(this);
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
            _this.addSuggestion(suggestions_1.REMOVE_GUARD);
            var varName = _this.claimFreeBinding('x');
            _this.insert(_this.expression.outerEnd, ", " + varName + " => " + varName);
            _this.patchAsSpliceExpressionStart();
        });
        return "__guard__(" + spliceStart + ", ...[].concat(" + expressionCode + ")))";
    };
    return SoakedSlicePatcher;
}(SlicePatcher_1.default));
exports.default = SoakedSlicePatcher;
