"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var add_variable_declarations_1 = tslib_1.__importDefault(require("add-variable-declarations"));
var magic_string_1 = tslib_1.__importDefault(require("magic-string"));
var debug_1 = require("../../utils/debug");
var AddVariableDeclarationsStage = /** @class */ (function () {
    function AddVariableDeclarationsStage() {
    }
    AddVariableDeclarationsStage.run = function (content) {
        var log = debug_1.logger(this.name);
        log(content);
        var editor = new magic_string_1.default(content);
        add_variable_declarations_1.default(content, editor);
        return {
            code: editor.toString(),
            suggestions: [],
        };
    };
    return AddVariableDeclarationsStage;
}());
exports.default = AddVariableDeclarationsStage;
