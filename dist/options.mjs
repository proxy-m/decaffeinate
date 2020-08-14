import { __assign } from "tslib";
export var DEFAULT_OPTIONS = {
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
export function resolveOptions(options) {
    if (options.loose) {
        options = __assign(__assign({}, options), { looseDefaultParams: true, looseForExpressions: true, looseForOf: true, looseIncludes: true, looseComparisonNegation: true, looseJSModules: true });
    }
    if (options.runToStage === 'EsnextStage') {
        options = __assign(__assign({}, options), { runToStage: 'ResugarStage' });
    }
    return __assign(__assign({}, DEFAULT_OPTIONS), options);
}
