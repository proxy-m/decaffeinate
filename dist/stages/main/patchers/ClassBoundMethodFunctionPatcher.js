"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var FunctionPatcher_1 = tslib_1.__importDefault(require("./FunctionPatcher"));
var ClassBoundMethodFunctionPatcher = /** @class */ (function (_super) {
    tslib_1.__extends(ClassBoundMethodFunctionPatcher, _super);
    function ClassBoundMethodFunctionPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClassBoundMethodFunctionPatcher.prototype.expectedArrowType = function () {
        return '=>';
    };
    return ClassBoundMethodFunctionPatcher;
}(FunctionPatcher_1.default));
exports.default = ClassBoundMethodFunctionPatcher;
