import { __extends } from "tslib";
import BinaryOpPatcher from './BinaryOpPatcher';
/**
 * Handles exponentiation, i.e. `a ** b`.
 */
var ExpOpPatcher = /** @class */ (function (_super) {
    __extends(ExpOpPatcher, _super);
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
}(BinaryOpPatcher));
export default ExpOpPatcher;
