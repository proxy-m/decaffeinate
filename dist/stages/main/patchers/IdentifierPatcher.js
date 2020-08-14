"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PassthroughPatcher_1 = tslib_1.__importDefault(require("./../../../patchers/PassthroughPatcher"));
var IdentifierPatcher = /** @class */ (function (_super) {
    tslib_1.__extends(IdentifierPatcher, _super);
    function IdentifierPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IdentifierPatcher.prototype.isRepeatable = function () {
        return true;
    };
    /**
     * Determine if this identifier might refer to a non-existent variable. In
     * that case, some code paths need to emit a `typeof` check to ensure that
     * we don't crash if this variable hasn't been declared.
     */
    IdentifierPatcher.prototype.mayBeUnboundReference = function () {
        return !this.getScope().hasBinding(this.node.data);
    };
    return IdentifierPatcher;
}(PassthroughPatcher_1.default));
exports.default = IdentifierPatcher;