"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var coffee_lex_1 = require("coffee-lex");
var NodePatcher_1 = tslib_1.__importDefault(require("./../../../patchers/NodePatcher"));
var ElisionPatcher_1 = tslib_1.__importDefault(require("./ElisionPatcher"));
var ExpansionPatcher_1 = tslib_1.__importDefault(require("./ExpansionPatcher"));
var ArrayInitialiserPatcher = /** @class */ (function (_super) {
    tslib_1.__extends(ArrayInitialiserPatcher, _super);
    function ArrayInitialiserPatcher(patcherContext, members) {
        var _this = _super.call(this, patcherContext) || this;
        _this.members = members;
        return _this;
    }
    ArrayInitialiserPatcher.prototype.initialize = function () {
        this.members.forEach(function (member) { return member.setRequiresExpression(); });
    };
    ArrayInitialiserPatcher.prototype.setAssignee = function () {
        this.members.forEach(function (member) { return member.setAssignee(); });
        _super.prototype.setAssignee.call(this);
    };
    ArrayInitialiserPatcher.prototype.patchAsExpression = function () {
        var _this = this;
        this.members.forEach(function (member, i, members) {
            var isLast = i === members.length - 1;
            // An expansion in a final position is a no-op, so just remove it.
            if (isLast && member instanceof ExpansionPatcher_1.default) {
                _this.remove(members[i - 1].outerEnd, member.outerEnd);
                return;
            }
            var needsComma = !isLast && !member.hasSourceTokenAfter(coffee_lex_1.SourceType.COMMA) && !(member instanceof ElisionPatcher_1.default);
            member.patch();
            if (needsComma) {
                _this.insert(member.outerEnd, ',');
            }
        });
    };
    ArrayInitialiserPatcher.prototype.isPure = function () {
        return this.members.every(function (member) { return member.isPure(); });
    };
    return ArrayInitialiserPatcher;
}(NodePatcher_1.default));
exports.default = ArrayInitialiserPatcher;
