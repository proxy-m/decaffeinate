"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var coffee_lex_1 = require("coffee-lex");
var downgradeUnicodeCodePointEscapesInRange_1 = tslib_1.__importDefault(require("../../../utils/downgradeUnicodeCodePointEscapesInRange"));
var escape_1 = tslib_1.__importDefault(require("../../../utils/escape"));
var escapeSpecialWhitespaceInRange_1 = tslib_1.__importDefault(require("../../../utils/escapeSpecialWhitespaceInRange"));
var escapeZeroCharsInRange_1 = tslib_1.__importDefault(require("../../../utils/escapeZeroCharsInRange"));
var notNull_1 = tslib_1.__importDefault(require("../../../utils/notNull"));
var NodePatcher_1 = tslib_1.__importDefault(require("./../../../patchers/NodePatcher"));
var InterpolatedPatcher = /** @class */ (function (_super) {
    tslib_1.__extends(InterpolatedPatcher, _super);
    function InterpolatedPatcher(patcherContext, quasis, expressions) {
        var _this = _super.call(this, patcherContext) || this;
        _this.quasis = quasis;
        _this.expressions = expressions;
        return _this;
    }
    InterpolatedPatcher.prototype.initialize = function () {
        var e_1, _a;
        try {
            for (var _b = tslib_1.__values(this.expressions), _c = _b.next(); !_c.done; _c = _b.next()) {
                var expression = _c.value;
                if (expression) {
                    expression.setRequiresExpression();
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    InterpolatedPatcher.prototype.patchInterpolations = function () {
        for (var i = 0; i < this.expressions.length; i++) {
            var interpolationStart = this.getInterpolationStartTokenAtIndex(i);
            var expression = this.expressions[i];
            if (expression) {
                this.overwrite(interpolationStart.start, interpolationStart.start + 1, '$');
                expression.patch();
            }
            else {
                var interpolationEndIndex = this.quasis[i + 1].contentStart;
                this.remove(interpolationStart.start, interpolationEndIndex);
            }
        }
    };
    InterpolatedPatcher.prototype.getInterpolationStartTokenAtIndex = function (index) {
        var interpolationStartIndex = this.indexOfSourceTokenBetweenSourceIndicesMatching(this.quasis[index].contentEnd, this.contentEnd, function (token) { return token.type === coffee_lex_1.SourceType.INTERPOLATION_START; });
        if (!interpolationStartIndex) {
            throw this.error('Cannot find interpolation start for string interpolation.');
        }
        var interpolationStart = this.sourceTokenAtIndex(interpolationStartIndex);
        if (!interpolationStart || this.slice(interpolationStart.start, interpolationStart.start + 1) !== '#') {
            throw this.error("Cannot find '#' in interpolation start.");
        }
        return interpolationStart;
    };
    /**
     * Handle "padding" characters: characters like leading whitespace that should
     * be removed according to the lexing rules. In addition to STRING_PADDING
     * tokens, which indicate that the range should be removed, there are also
     * STRING_LINE_SEPARATOR tokens that indicate that the newlines should be
     * replaced with a space.
     *
     * To preserve the formatting of multiline strings a little better, newline
     * characters are escaped rather than removed.
     *
     * Also change any \u2028 and \u2029 characters we see into their unicode
     * escape form.
     */
    InterpolatedPatcher.prototype.processContents = function () {
        var e_2, _a, e_3, _b;
        try {
            for (var _c = tslib_1.__values(this.quasis), _d = _c.next(); !_d.done; _d = _c.next()) {
                var quasi = _d.value;
                var tokens = this.getProgramSourceTokens()
                    .slice(quasi.contentStartTokenIndex, notNull_1.default(quasi.contentEndTokenIndex.next()))
                    .toArray();
                try {
                    for (var tokens_1 = (e_3 = void 0, tslib_1.__values(tokens)), tokens_1_1 = tokens_1.next(); !tokens_1_1.done; tokens_1_1 = tokens_1.next()) {
                        var token = tokens_1_1.value;
                        if (token.type === coffee_lex_1.SourceType.STRING_PADDING || token.type === coffee_lex_1.SourceType.HEREGEXP_COMMENT) {
                            var paddingCode = this.slice(token.start, token.end);
                            var numNewlines = (paddingCode.match(/\n/g) || []).length;
                            this.overwrite(token.start, token.end, '\\\n'.repeat(numNewlines));
                        }
                        else if (token.type === coffee_lex_1.SourceType.STRING_LINE_SEPARATOR) {
                            this.insert(token.start, ' \\');
                        }
                        else if (token.type === coffee_lex_1.SourceType.STRING_CONTENT) {
                            escapeSpecialWhitespaceInRange_1.default(token.start, token.end, this);
                            if (this.shouldExcapeZeroChars()) {
                                escapeZeroCharsInRange_1.default(token.start, token.end, this);
                            }
                            if (this.shouldDowngradeUnicodeCodePointEscapes()) {
                                downgradeUnicodeCodePointEscapesInRange_1.default(token.start, token.end, this, { needsExtraEscape: true });
                            }
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (tokens_1_1 && !tokens_1_1.done && (_b = tokens_1.return)) _b.call(tokens_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_2) throw e_2.error; }
        }
    };
    InterpolatedPatcher.prototype.shouldExcapeZeroChars = function () {
        return false;
    };
    InterpolatedPatcher.prototype.shouldDowngradeUnicodeCodePointEscapes = function () {
        return false;
    };
    InterpolatedPatcher.prototype.escapeQuasis = function (skipPattern, escapeStrings) {
        var e_4, _a, e_5, _b;
        try {
            for (var _c = tslib_1.__values(this.quasis), _d = _c.next(); !_d.done; _d = _c.next()) {
                var quasi = _d.value;
                var tokens = this.getProgramSourceTokens()
                    .slice(quasi.contentStartTokenIndex, notNull_1.default(quasi.contentEndTokenIndex.next()))
                    .toArray();
                try {
                    for (var tokens_2 = (e_5 = void 0, tslib_1.__values(tokens)), tokens_2_1 = tokens_2.next(); !tokens_2_1.done; tokens_2_1 = tokens_2.next()) {
                        var token = tokens_2_1.value;
                        if (token.type === coffee_lex_1.SourceType.STRING_CONTENT) {
                            escape_1.default(this.context.source, this.editor, skipPattern, escapeStrings, token.start, token.end);
                        }
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (tokens_2_1 && !tokens_2_1.done && (_b = tokens_2.return)) _b.call(tokens_2);
                    }
                    finally { if (e_5) throw e_5.error; }
                }
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    InterpolatedPatcher.prototype.isRepeatable = function () {
        return this.expressions.every(function (patcher) { return patcher !== null && patcher.isRepeatable(); });
    };
    return InterpolatedPatcher;
}(NodePatcher_1.default));
exports.default = InterpolatedPatcher;
