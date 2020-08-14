import { __extends } from "tslib";
import UnaryOpPatcher from './UnaryOpPatcher';
/**
 * Handles `typeof`, e.g. `typeof name`.
 */
var UnaryTypeofOpPatcher = /** @class */ (function (_super) {
    __extends(UnaryTypeofOpPatcher, _super);
    function UnaryTypeofOpPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * `typeof` does not have side-effects.
     */
    UnaryTypeofOpPatcher.prototype.isRepeatable = function () {
        return this.expression.isRepeatable();
    };
    /**
     * This always starts with `typeof` and doesn't need parens.
     */
    UnaryTypeofOpPatcher.prototype.statementNeedsParens = function () {
        return false;
    };
    return UnaryTypeofOpPatcher;
}(UnaryOpPatcher));
export default UnaryTypeofOpPatcher;
