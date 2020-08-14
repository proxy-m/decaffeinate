"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BinaryOpPatcher_1 = tslib_1.__importDefault(require("./BinaryOpPatcher"));
/**
 * Handles exponentiation, i.e. `a ** b`.
 */
var ExpOpPatcher = /** @class */ (function (_super) {
    tslib_1.__extends(ExpOpPatcher, _super);
    function ExpOpPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * LEFT '**' RIGHT
     */
    ExpOpPatcher.prototype.patchAsExpression = function () {
        // `a ** b` → `Math.pow(a ** b`
        //             ^^^^^^^^^
        this.insert(this.contentStart, "Math.pow(");
        this.left.patch();
        // `Math.pow(a ** b` → `Math.pow(a, b`
        //            ^^^^                ^^
        this.overwrite(this.left.outerEnd, this.right.outerStart, ', ');
        this.right.patch();
        // `Math.pow(a, b` → `Math.pow(a, b)`
        //                                 ^
        this.insert(this.contentEnd, ")");
    };
    /**
     * We'll always start with `Math.pow` so we don't need parens.
     */
    ExpOpPatcher.prototype.statementNeedsParens = function () {
        return false;
    };
    return ExpOpPatcher;
}(BinaryOpPatcher_1.default));
exports.default = ExpOpPatcher;
