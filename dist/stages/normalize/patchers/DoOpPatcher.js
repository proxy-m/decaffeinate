"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PassthroughPatcher_1 = tslib_1.__importDefault(require("../../../patchers/PassthroughPatcher"));
var DoOpPatcher = /** @class */ (function (_super) {
    tslib_1.__extends(DoOpPatcher, _super);
    function DoOpPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DoOpPatcher;
}(PassthroughPatcher_1.default));
exports.default = DoOpPatcher;
