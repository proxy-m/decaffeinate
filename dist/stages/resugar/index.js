"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var t = tslib_1.__importStar(require("@babel/types"));
var codemod_declarations_block_scope_1 = tslib_1.__importDefault(require("@resugar/codemod-declarations-block-scope"));
var codemod_functions_arrow_1 = tslib_1.__importDefault(require("@resugar/codemod-functions-arrow"));
var codemod_modules_commonjs_1 = tslib_1.__importDefault(require("@resugar/codemod-modules-commonjs"));
var codemod_objects_concise_1 = tslib_1.__importDefault(require("@resugar/codemod-objects-concise"));
var codemod_objects_destructuring_1 = tslib_1.__importDefault(require("@resugar/codemod-objects-destructuring"));
var codemod_objects_shorthand_1 = tslib_1.__importDefault(require("@resugar/codemod-objects-shorthand"));
var codemod_strings_template_1 = tslib_1.__importDefault(require("@resugar/codemod-strings-template"));
var debug_1 = require("../../utils/debug");
var core_1 = require("@codemod/core");
var ResugarStage = /** @class */ (function () {
    function ResugarStage() {
    }
    ResugarStage.run = function (content, options) {
        var log = debug_1.logger(this.name);
        log(content);
        var code = core_1.transform(content, {
            plugins: Array.from(this.getPluginsForOptions(options)),
        }).code;
        return {
            code: code,
            suggestions: [],
        };
    };
    ResugarStage.getPluginsForOptions = function (options) {
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, codemod_objects_shorthand_1.default];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, codemod_objects_concise_1.default];
                case 2:
                    _a.sent();
                    if (!options.useJSModules) return [3 /*break*/, 4];
                    return [4 /*yield*/, [
                            codemod_modules_commonjs_1.default,
                            {
                                forceDefaultExport: !options.looseJSModules,
                                safeFunctionIdentifiers: options.safeImportFunctionIdentifiers,
                            },
                        ]];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, codemod_functions_arrow_1.default];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, [
                            codemod_declarations_block_scope_1.default,
                            {
                                disableConst: function (_a) {
                                    var node = _a.node, parent = _a.parent;
                                    if (options.preferLet) {
                                        return (
                                        // Only use `const` for top-level variables…
                                        !t.isProgram(parent) ||
                                            // … as the only variable in its declaration …
                                            node.declarations.length !== 1 ||
                                            // … without any sort of destructuring …
                                            !t.isIdentifier(node.declarations[0].id) ||
                                            // … starting with a capital letter.
                                            !/^[$_]?[A-Z]+$/.test(node.declarations[0].id.name));
                                    }
                                    else {
                                        return false;
                                    }
                                },
                            },
                        ]];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, codemod_objects_destructuring_1.default];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, codemod_strings_template_1.default];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
    return ResugarStage;
}());
exports.default = ResugarStage;
