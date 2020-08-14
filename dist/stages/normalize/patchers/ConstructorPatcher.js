"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var PassthroughPatcher_1 = tslib_1.__importDefault(require("../../../patchers/PassthroughPatcher"));
var ConstructorPatcher = /** @class */ (function (_super) {
    tslib_1.__extends(ConstructorPatcher, _super);
    function ConstructorPatcher(patcherContext, assignee, expression) {
        var _this = _super.call(this, patcherContext, assignee, expression) || this;
        _this.assignee = assignee;
        _this.expression = expression;
        return _this;
    }
    return ConstructorPatcher;
}(PassthroughPatcher_1.default));
exports.default = ConstructorPatcher;
