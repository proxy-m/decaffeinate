import { __extends } from "tslib";
import { Class, This } from 'decaffeinate-parser/dist/nodes';
import { FIX_INVALID_CONSTRUCTOR } from '../../../suggestions';
import containsDescendant from '../../../utils/containsDescendant';
import containsSuperCall from '../../../utils/containsSuperCall';
import getBindingCodeForMethod from '../../../utils/getBindingCodeForMethod';
import getInvalidConstructorErrorMessage from '../../../utils/getInvalidConstructorErrorMessage';
import { isFunction } from '../../../utils/types';
import ClassBlockPatcher from './ClassBlockPatcher';
import ClassPatcher from './ClassPatcher';
import ObjectBodyMemberPatcher from './ObjectBodyMemberPatcher';
var ConstructorPatcher = /** @class */ (function (_super) {
    __extends(ConstructorPatcher, _super);
    function ConstructorPatcher(patcherContext, assignee, expression) {
        var _this = _super.call(this, patcherContext, assignee, expression) || this;
        _this._bindings = null;
        // Constructor methods do not have implicit returns.
        expression.disableImplicitReturns();
        return _this;
    }
    ConstructorPatcher.prototype.patch = function (options) {
        if (options === void 0) { options = {}; }
        this.checkForConstructorErrors();
        if (this.expression.body) {
            var linesToInsert = this.getLinesToInsert();
            this.expression.body.insertStatementsAtIndex(linesToInsert, 0);
            _super.prototype.patch.call(this, options);
        }
        else {
            _super.prototype.patch.call(this, options);
            var linesToInsert = this.getLinesToInsert();
            if (linesToInsert.length > 0) {
                // As a special case, if there's no function body but we still want to
                // generate bindings, overwrite the function body with the desired
                // contents, since it's sort of hard to insert contents in the middle of
                // the generated {}.
                var indent = this.getIndent();
                var bodyIndent_1 = this.getIndent(1);
                var arrowToken = this.expression.getArrowToken();
                var fullLines = linesToInsert.map(function (line) { return "" + bodyIndent_1 + line + "\n"; });
                var bodyCode = "{\n" + fullLines.join('') + indent + "}";
                this.overwrite(arrowToken.start, this.expression.outerEnd, bodyCode);
            }
        }
    };
    ConstructorPatcher.prototype.getLinesToInsert = function () {
        var lines = [];
        lines = lines.concat(this.getBindings());
        return lines;
    };
    /**
     * Give an up-front error if this is a subclass that either omits the `super`
     * call or uses `this` before `super`.
     */
    ConstructorPatcher.prototype.checkForConstructorErrors = function () {
        var errorMessage = this.getInvalidConstructorMessage();
        if (errorMessage) {
            if (!this.options.disallowInvalidConstructors) {
                this.addSuggestion(FIX_INVALID_CONSTRUCTOR);
            }
            else {
                throw this.error(getInvalidConstructorErrorMessage(errorMessage));
            }
        }
    };
    /**
     * Return a string with an error if this constructor is invalid (generally one
     * that uses this before super). Otherwise return null.
     */
    ConstructorPatcher.prototype.getInvalidConstructorMessage = function () {
        if (!this.getEnclosingClassPatcher().isSubclass()) {
            return null;
        }
        // Any bindings would ideally go before the super call, so if there are any,
        // we'll need this before super.
        if (this.getBindings().length > 0) {
            return 'Cannot automatically convert a subclass that uses bound methods.';
        }
        var superIndex = this.getIndexOfSuperStatement();
        var thisIndex = this.getIndexOfFirstThisStatement();
        if (superIndex === -1) {
            return 'Cannot automatically convert a subclass with a constructor that does not call super.';
        }
        if (thisIndex >= 0 && thisIndex <= superIndex) {
            return 'Cannot automatically convert a subclass with a constructor that uses `this` before `super`.';
        }
        return null;
    };
    ConstructorPatcher.prototype.getBindings = function () {
        if (!this._bindings) {
            var boundMethods = this.getEnclosingClassBlockPatcher().boundInstanceMethods();
            var bindings = boundMethods.map(getBindingCodeForMethod);
            this._bindings = bindings;
        }
        return this._bindings;
    };
    ConstructorPatcher.prototype.getEnclosingClassPatcher = function () {
        var enclosingClassBlock = this.getEnclosingClassBlockPatcher();
        if (!(enclosingClassBlock.parent instanceof ClassPatcher)) {
            throw this.error('Expected grandparent of ConstructorPatcher to be ClassPatcher.');
        }
        return enclosingClassBlock.parent;
    };
    ConstructorPatcher.prototype.getEnclosingClassBlockPatcher = function () {
        if (!(this.parent instanceof ClassBlockPatcher)) {
            throw this.error('Expected parent of ConstructorPatcher to be ClassBlockPatcher.');
        }
        return this.parent;
    };
    ConstructorPatcher.prototype.getIndexOfSuperStatement = function () {
        if (!this.expression.body) {
            return -1;
        }
        var statements = this.expression.body.statements;
        for (var i = 0; i < statements.length; i++) {
            if (containsSuperCall(statements[i].node)) {
                return i;
            }
        }
        return -1;
    };
    ConstructorPatcher.prototype.getIndexOfFirstThisStatement = function () {
        if (!this.expression.body) {
            return -1;
        }
        var statements = this.expression.body.statements;
        for (var i = 0; i < statements.length; i++) {
            var usesThis = containsDescendant(statements[i].node, function (child) { return child instanceof This; }, {
                shouldStopTraversal: function (child) { return child instanceof Class || isFunction(child); },
            });
            if (usesThis) {
                return i;
            }
        }
        return -1;
    };
    /**
     * Don't put semicolons after class constructors.
     */
    ConstructorPatcher.prototype.statementNeedsSemicolon = function () {
        return false;
    };
    return ConstructorPatcher;
}(ObjectBodyMemberPatcher));
export default ConstructorPatcher;
