"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var parser_1 = require("@codemod/parser");
var automatic_semicolon_insertion_1 = tslib_1.__importDefault(require("automatic-semicolon-insertion"));
var magic_string_1 = tslib_1.__importDefault(require("magic-string"));
var debug_1 = require("../../utils/debug");
var SemicolonsStage = /** @class */ (function () {
    function SemicolonsStage() {
    }
    SemicolonsStage.run = function (content) {
        var log = debug_1.logger(this.name);
        log(content);
        var editor = new magic_string_1.default(content);
        var ast = parser_1.parse(content, {
            tokens: true,
        });
        var _a = automatic_semicolon_insertion_1.default(content, ast), insertions = _a.insertions, removals = _a.removals;
        insertions.forEach(function (_a) {
            var index = _a.index, content = _a.content;
            return editor.appendLeft(index, content);
        });
        removals.forEach(function (_a) {
            var start = _a.start, end = _a.end;
            return editor.remove(start, end);
        });
        return {
            code: editor.toString(),
            suggestions: [],
        };
    };
    return SemicolonsStage;
}());
exports.default = SemicolonsStage;
