"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var adjustIndent_1 = tslib_1.__importDefault(require("../../../utils/adjustIndent"));
var getBindingCodeForMethod_1 = tslib_1.__importDefault(require("../../../utils/getBindingCodeForMethod"));
var getInvalidConstructorErrorMessage_1 = tslib_1.__importDefault(require("../../../utils/getInvalidConstructorErrorMessage"));
var BlockPatcher_1 = tslib_1.__importDefault(require("./BlockPatcher"));
var ClassAssignOpPatcher_1 = tslib_1.__importDefault(require("./ClassAssignOpPatcher"));
var ClassPatcher_1 = tslib_1.__importDefault(require("./ClassPatcher"));
var ConstructorPatcher_1 = tslib_1.__importDefault(require("./ConstructorPatcher"));
var suggestions_1 = require("../../../suggestions");
var ClassBlockPatcher = /** @class */ (function (_super) {
    tslib_1.__extends(ClassBlockPatcher, _super);
    function ClassBlockPatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ClassBlockPatcher.patcherClassForChildNode = function (node, property) {
        if (property === 'statements' && node.type === 'AssignOp') {
            return ClassAssignOpPatcher_1.default;
        }
        return null;
    };
    ClassBlockPatcher.prototype.patch = function (options) {
        var e_1, _a;
        if (options === void 0) { options = {}; }
        try {
            for (var _b = tslib_1.__values(this.boundInstanceMethods()), _c = _b.next(); !_c.done; _c = _b.next()) {
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
                    throw this.error(getInvalidConstructorErrorMessage_1.default('Cannot automatically convert a subclass that uses bound methods.'));
                }
                else if (isSubclass) {
                    this.addSuggestion(suggestions_1.FIX_INVALID_CONSTRUCTOR);
                }
                var source = this.context.source;
                var insertionPoint = this.statements[0].outerStart;
                var methodIndent = adjustIndent_1.default(source, insertionPoint, 0);
                var methodBodyIndent_1 = adjustIndent_1.default(source, insertionPoint, 1);
                var constructor_1 = '';
                if (isSubclass) {
                    constructor_1 += "constructor(...args) {\n";
                }
                else {
                    constructor_1 += "constructor() {\n";
                }
                boundMethods.forEach(function (method) {
                    constructor_1 += "" + methodBodyIndent_1 + getBindingCodeForMethod_1.default(method) + ";\n";
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
        if (!(this.parent instanceof ClassPatcher_1.default)) {
            throw this.error('Expected class block parent to be a class.');
        }
        return this.parent;
    };
    ClassBlockPatcher.prototype.canPatchAsExpression = function () {
        return false;
    };
    ClassBlockPatcher.prototype.hasConstructor = function () {
        return this.statements.some(function (statement) { return statement instanceof ConstructorPatcher_1.default; });
    };
    ClassBlockPatcher.prototype.boundInstanceMethods = function () {
        var e_2, _a;
        var boundMethods = [];
        try {
            for (var _b = tslib_1.__values(this.statements), _c = _b.next(); !_c.done; _c = _b.next()) {
                var statement = _c.value;
                if (statement instanceof ClassAssignOpPatcher_1.default && statement.isBoundInstanceMethod()) {
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
}(BlockPatcher_1.default));
exports.default = ClassBlockPatcher;
