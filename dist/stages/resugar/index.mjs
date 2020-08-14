import { __generator } from "tslib";
import * as t from '@babel/types';
import declarationsBlockScope from '@resugar/codemod-declarations-block-scope';
import functionsArrow from '@resugar/codemod-functions-arrow';
import modulesCommonjs from '@resugar/codemod-modules-commonjs';
import objectsConcise from '@resugar/codemod-objects-concise';
import objectsDestructuring from '@resugar/codemod-objects-destructuring';
import objectsShorthand from '@resugar/codemod-objects-shorthand';
import stringsTemplate from '@resugar/codemod-strings-template';
import { logger } from '../../utils/debug';
import { transform } from '@codemod/core';
var ResugarStage = /** @class */ (function () {
    function ResugarStage() {
    }
    ResugarStage.run = function (content, options) {
        var log = logger(this.name);
        log(content);
        var code = transform(content, {
            plugins: Array.from(this.getPluginsForOptions(options)),
        }).code;
        return {
            code: code,
            suggestions: [],
        };
    };
    ResugarStage.getPluginsForOptions = function (options) {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, objectsShorthand];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, objectsConcise];
                case 2:
                    _a.sent();
                    if (!options.useJSModules) return [3 /*break*/, 4];
                    return [4 /*yield*/, [
                            modulesCommonjs,
                            {
                                forceDefaultExport: !options.looseJSModules,
                                safeFunctionIdentifiers: options.safeImportFunctionIdentifiers,
                            },
                        ]];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, functionsArrow];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, [
                            declarationsBlockScope,
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
                    return [4 /*yield*/, objectsDestructuring];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, stringsTemplate];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    };
    return ResugarStage;
}());
export default ResugarStage;
