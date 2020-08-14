import { __extends, __values } from "tslib";
import adjustIndent from '../../../utils/adjustIndent';
import getBindingCodeForMethod from '../../../utils/getBindingCodeForMethod';
import getInvalidConstructorErrorMessage from '../../../utils/getInvalidConstructorErrorMessage';
import BlockPatcher from './BlockPatcher';
import ClassAssignOpPatcher from './ClassAssignOpPatcher';
import ClassPatcher from './ClassPatcher';
import ConstructorPatcher from './ConstructorPatcher';
import { FIX_INVALID_CONSTRUCTOR } from '../../../suggestions';
var ClassBlockPatcher = /** @class */ (function (_super) {
    __extends(ClassBlockPatcher, _super);
    function ClassBlockPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClassBlockPatcher.patcherClassForChildNode = function (node, property) {
        if (property === 'statements' && node.type === 'AssignOp') {
            return ClassAssignOpPatcher;
        }
        return null;
    };
    ClassBlockPatcher.prototype.patch = function (options) {
        var e_1, _a;
        if (options === void 0) { options = {}; }
        try {
            for (var _b = __values(this.boundInstanceMethods()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var boundMethod = _c.value;
                boundMethod.key.setRequiresRepeatableExpression();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        _super.prototype.patch.call(this, options);
        if (!this.hasConstructor()) {
            var boundMethods = this.boundInstanceMethods();
            if (boundMethods.length > 0) {
                var isSubclass = this.getClassPatcher().isSubclass();
                if (isSubclass && !this.shouldAllowInvalidConstructors()) {
                    throw this.error(getInvalidConstructorErrorMessage('Cannot automatically convert a subclass that uses bound methods.'));
                }
                else if (isSubclass) {
                    this.addSuggestion(FIX_INVALID_CONSTRUCTOR);
                }
                var source = this.context.source;
                var insertionPoint = this.statements[0].outerStart;
                var methodIndent = adjustIndent(source, insertionPoint, 0);
                var methodBodyIndent_1 = adjustIndent(source, insertionPoint, 1);
                var constructor_1 = '';
                if (isSubclass) {
                    constructor_1 += "constructor(...args) {\n";
                }
                else {
                    constructor_1 += "constructor() {\n";
                }
                boundMethods.forEach(function (method) {
                    constructor_1 += "" + methodBodyIndent_1 + getBindingCodeForMethod(method) + ";\n";
                });
                if (isSubclass) {
                    constructor_1 += methodBodyIndent_1 + "super(...args)\n";
                }
                constructor_1 += methodIndent + "}\n\n" + methodIndent;
                this.prependLeft(insertionPoint, constructor_1);
            }
        }
    };
    ClassBlockPatcher.prototype.shouldAllowInvalidConstructors = function () {
        return !this.options.disallowInvalidConstructors;
    };
    ClassBlockPatcher.prototype.getClassPatcher = function () {
        if (!(this.parent instanceof ClassPatcher)) {
            throw this.error('Expected class block parent to be a class.');
        }
        return this.parent;
    };
    ClassBlockPatcher.prototype.canPatchAsExpression = function () {
        return false;
    };
    ClassBlockPatcher.prototype.hasConstructor = function () {
        return this.statements.some(function (statement) { return statement instanceof ConstructorPatcher; });
    };
    ClassBlockPatcher.prototype.boundInstanceMethods = function () {
        var e_2, _a;
        var boundMethods = [];
        try {
            for (var _b = __values(this.statements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var statement = _c.value;
                if (statement instanceof ClassAssignOpPatcher && statement.isBoundInstanceMethod()) {
                    boundMethods.push(statement);
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return boundMethods;
    };
    return ClassBlockPatcher;
}(BlockPatcher));
export default ClassBlockPatcher;
