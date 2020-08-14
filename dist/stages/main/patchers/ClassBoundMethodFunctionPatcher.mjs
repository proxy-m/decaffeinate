import { __extends } from "tslib";
import FunctionPatcher from './FunctionPatcher';
var ClassBoundMethodFunctionPatcher = /** @class */ (function (_super) {
    __extends(ClassBoundMethodFunctionPatcher, _super);
    function ClassBoundMethodFunctionPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClassBoundMethodFunctionPatcher.prototype.expectedArrowType = function () {
        return '=>';
    };
    return ClassBoundMethodFunctionPatcher;
}(FunctionPatcher));
export default ClassBoundMethodFunctionPatcher;
