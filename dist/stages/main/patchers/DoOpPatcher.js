"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var coffee_lex_1 = require("coffee-lex");
var NodePatcher_1 = tslib_1.__importDefault(require("../../../patchers/NodePatcher"));
var notNull_1 = tslib_1.__importDefault(require("../../../utils/notNull"));
var AssignOpPatcher_1 = tslib_1.__importDefault(require("./AssignOpPatcher"));
var DefaultParamPatcher_1 = tslib_1.__importDefault(require("./DefaultParamPatcher"));
var FunctionPatcher_1 = tslib_1.__importDefault(require("./FunctionPatcher"));
var IdentifierPatcher_1 = tslib_1.__importDefault(require("./IdentifierPatcher"));
var DoOpPatcher = /** @class */ (function (_super) {
    tslib_1.__extends(DoOpPatcher, _super);
    function DoOpPatcher(patcherContext, expression) {
        var _this = _super.call(this, patcherContext) || this;
        _this.expression = expression;
        return _this;
    }
    DoOpPatcher.prototype.initialize = function () {
        this.expression.setRequiresExpression();
    };
    DoOpPatcher.prototype.patchAsExpression = function () {
        var _this = this;
        var doTokenIndex = this.getDoTokenIndex();
        var doToken = notNull_1.default(this.sourceTokenAtIndex(doTokenIndex));
        var nextToken = notNull_1.default(this.sourceTokenAtIndex(notNull_1.default(doTokenIndex.next())));
        this.remove(doToken.start, nextToken.start);
        var addParens = !(this.expression instanceof IdentifierPatcher_1.default);
        if (addParens) {
            this.insert(this.contentStart, '(');
        }
        this.expression.patch();
        if (addParens) {
            this.insert(this.innerEnd, ')');
        }
        var args = [];
        if (this.hasDoFunction()) {
            var func = this.getDoFunction();
            func.parameters.forEach(function (param) {
                if (param instanceof DefaultParamPatcher_1.default) {
                    var valueSource = param.value.getPatchedSource();
                    _this.remove(param.param.outerEnd, param.value.outerEnd);
                    args.push(valueSource);
                }
                else {
                    args.push(param.getPatchedSource());
                }
            });
        }
        this.insert(this.innerEnd, "(" + args.join(', ') + ")");
    };
    /**
     * Determine whether there is a "do function"--that is, a function where we
     * should change default params to arguments to the do call.
     */
    DoOpPatcher.prototype.hasDoFunction = function () {
        return (this.expression instanceof FunctionPatcher_1.default ||
            (this.expression instanceof AssignOpPatcher_1.default && this.expression.expression instanceof FunctionPatcher_1.default));
    };
    DoOpPatcher.prototype.getDoFunction = function () {
        if (this.expression instanceof FunctionPatcher_1.default) {
            return this.expression;
        }
        else if (this.expression instanceof AssignOpPatcher_1.default && this.expression.expression instanceof FunctionPatcher_1.default) {
            return this.expression.expression;
        }
        else {
            throw this.error('Should only call getDoFunction if hasDoFunction is true.');
        }
    };
    /**
     * @private
     */
    DoOpPatcher.prototype.getDoTokenIndex = function () {
        var index = this.contentStartTokenIndex;
        var token = this.sourceTokenAtIndex(index);
        if (!token || token.type !== coffee_lex_1.SourceType.DO) {
            throw this.error("expected 'do' at start of expression");
        }
        return index;
    };
    return DoOpPatcher;
}(NodePatcher_1.default));
exports.default = DoOpPatcher;
