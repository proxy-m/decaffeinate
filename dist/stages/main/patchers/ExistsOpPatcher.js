"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var suggestions_1 = require("../../../suggestions");
var BinaryOpPatcher_1 = tslib_1.__importDefault(require("./BinaryOpPatcher"));
var ExistsOpPatcher = /** @class */ (function (_super) {
    tslib_1.__extends(ExistsOpPatcher, _super);
    function ExistsOpPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * If we are a statement, the RHS should be patched as a statement.
     */
    ExistsOpPatcher.prototype.rhsMayBeStatement = function () {
        return true;
    };
    ExistsOpPatcher.prototype.setExpression = function (force) {
        this.right.setRequiresExpression();
        return _super.prototype.setExpression.call(this, force);
    };
    /**
     * LEFT '?' RIGHT → `LEFT != null ? LEFT : RIGHT`
     */
    ExistsOpPatcher.prototype.patchAsExpression = function (_a) {
        var _b = (_a === void 0 ? {} : _a).needsParens, needsParens = _b === void 0 ? false : _b;
        this.addSuggestion(suggestions_1.SHORTEN_NULL_CHECKS);
        var addParens = (needsParens && !this.isSurroundedByParentheses()) || this.binaryOpNegated;
        if (this.binaryOpNegated) {
            this.insert(this.contentStart, '!');
        }
        if (addParens) {
            this.insert(this.contentStart, '(');
        }
        var needsTypeofCheck = this.left.mayBeUnboundReference();
        if (needsTypeofCheck) {
            // `a ? b` → `typeof a ? b`
            //            ^^^^^^^
            this.insert(this.contentStart, "typeof ");
            var leftAgain = this.left.patchRepeatable({ parens: true, ref: 'left' });
            // `typeof a ? b` → `typeof a !== 'undefined' && a !== null ? a : b`
            //          ^^^              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            this.overwrite(this.left.outerEnd, this.right.outerStart, " !== 'undefined' && " + leftAgain + " !== null ? " + leftAgain + " : ");
        }
        else {
            var leftAgain = this.left.patchRepeatable({ parens: true, ref: 'left' });
            // `a.b ? c` → `a.b != null ? a.b : c`
            //     ^^^         ^^^^^^^^^^^^^^^^^
            this.overwrite(this.left.outerEnd, this.right.outerStart, " != null ? " + leftAgain + " : ");
        }
        this.right.patch();
        if (addParens) {
            this.insert(this.contentEnd, ')');
        }
    };
    /**
     * LEFT '?' RIGHT → `if (LEFT == null) { RIGHT }`
     */
    ExistsOpPatcher.prototype.patchAsStatement = function () {
        this.addSuggestion(suggestions_1.SHORTEN_NULL_CHECKS);
        var needsTypeofCheck = this.left.mayBeUnboundReference();
        // `a ? b` → `if (a ? b`
        //            ^^^
        this.insert(this.contentStart, "if (");
        if (needsTypeofCheck) {
            var leftAgain = this.left.patchRepeatable();
            // `if (a ? b` → `if (typeof a ? b`
            //                    ^^^^^^^
            this.insert(this.contentStart, "typeof ");
            // `if (typeof a ? b` → `if (typeof a === 'undefined' || a === null) { b`
            //              ^^^                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
            this.overwrite(this.left.outerEnd, this.right.outerStart, " === 'undefined' || " + leftAgain + " === null) { ");
        }
        else {
            this.left.patch();
            // `if (a.b ? b.c` → `if (a.b == null) { b.c`
            //         ^^^               ^^^^^^^^^^^^
            this.overwrite(this.left.outerEnd, this.right.outerStart, " == null) { ");
        }
        this.right.patch();
        // `if (a.b == null) { b.c` → `if (a.b == null) { b.c }`
        //                                                   ^^
        this.insert(this.innerEnd, " }");
    };
    /**
     * We'll always start with an `if` so we don't need parens.
     */
    ExistsOpPatcher.prototype.statementNeedsParens = function () {
        return false;
    };
    return ExistsOpPatcher;
}(BinaryOpPatcher_1.default));
exports.default = ExistsOpPatcher;
