"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PassthroughPatcher_1 = tslib_1.__importDefault(require("../../../patchers/PassthroughPatcher"));
var IdentifierPatcher = /** @class */ (function (_super) {
    tslib_1.__extends(IdentifierPatcher, _super);
    function IdentifierPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return IdentifierPatcher;
}(PassthroughPatcher_1.default));
exports.default = IdentifierPatcher;
