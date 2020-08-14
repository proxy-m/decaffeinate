"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveOptions = exports.DEFAULT_OPTIONS = void 0;
var tslib_1 = require("tslib");
exports.DEFAULT_OPTIONS = {
    filename: 'input.coffee',
    useCS2: false,
    runToStage: null,
    literate: false,
    disableSuggestionComment: false,
    noArrayIncludes: false,
    useJSModules: false,
    looseJSModules: false,
    safeImportFunctionIdentifiers: [],
    preferLet: false,
    loose: false,
    looseDefaultParams: false,
    looseForExpressions: false,
    looseForOf: false,
    looseIncludes: false,
    looseComparisonNegation: false,
    disallowInvalidConstructors: false,
};
function resolveOptions(options) {
    if (options.loose) {
        options = tslib_1.__assign(tslib_1.__assign({}, options), { looseDefaultParams: true, looseForExpressions: true, looseForOf: true, looseIncludes: true, looseComparisonNegation: true, looseJSModules: true });
    }
    if (options.runToStage === 'EsnextStage') {
        options = tslib_1.__assign(tslib_1.__assign({}, options), { runToStage: 'ResugarStage' });
    }
    return tslib_1.__assign(tslib_1.__assign({}, exports.DEFAULT_OPTIONS), options);
}
exports.resolveOptions = resolveOptions;
