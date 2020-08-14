"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.modernizeJS = exports.convert = exports.PatchError = void 0;
var tslib_1 = require("tslib");
var coffee_lex_1 = tslib_1.__importDefault(require("coffee-lex"));
var decaffeinate_coffeescript_1 = require("decaffeinate-coffeescript");
var decaffeinate_coffeescript2_1 = require("decaffeinate-coffeescript2");
var decaffeinate_parser_1 = require("decaffeinate-parser");
var index_1 = tslib_1.__importDefault(require("./stages/add-variable-declarations/index"));
var index_2 = tslib_1.__importDefault(require("./stages/resugar/index"));
var index_3 = tslib_1.__importDefault(require("./stages/literate/index"));
var index_4 = tslib_1.__importDefault(require("./stages/main/index"));
var index_5 = tslib_1.__importDefault(require("./stages/normalize/index"));
var index_6 = tslib_1.__importDefault(require("./stages/semicolons/index"));
var suggestions_1 = require("./suggestions");
var CodeContext_1 = tslib_1.__importDefault(require("./utils/CodeContext"));
var convertNewlines_1 = tslib_1.__importDefault(require("./utils/convertNewlines"));
var detectNewlineStr_1 = tslib_1.__importDefault(require("./utils/detectNewlineStr"));
var formatCoffeeLexTokens_1 = tslib_1.__importDefault(require("./utils/formatCoffeeLexTokens"));
var formatCoffeeScriptAst_1 = tslib_1.__importDefault(require("./utils/formatCoffeeScriptAst"));
var formatCoffeeScriptLexerTokens_1 = tslib_1.__importDefault(require("./utils/formatCoffeeScriptLexerTokens"));
var formatDecaffeinateParserAst_1 = tslib_1.__importDefault(require("./utils/formatDecaffeinateParserAst"));
var PatchError_1 = tslib_1.__importDefault(require("./utils/PatchError"));
exports.PatchError = PatchError_1.default;
var removeUnicodeBOMIfNecessary_1 = tslib_1.__importDefault(require("./utils/removeUnicodeBOMIfNecessary"));
var resolveToPatchError_1 = tslib_1.__importDefault(require("./utils/resolveToPatchError"));
var cli_1 = require("./cli");
Object.defineProperty(exports, "run", { enumerable: true, get: function () { return cli_1.default; } });
var options_1 = require("./options");
var notNull_1 = tslib_1.__importDefault(require("./utils/notNull"));
/**
 * Convert CoffeeScript source code into modern JavaScript preserving comments
 * and formatting.
 */
function convert(source, options) {
    if (options === void 0) { options = {}; }
    source = removeUnicodeBOMIfNecessary_1.default(source);
    options = options_1.resolveOptions(options);
    var originalNewlineStr = detectNewlineStr_1.default(source);
    source = convertNewlines_1.default(source, '\n');
    var literate = options.literate ||
        notNull_1.default(options.filename).endsWith('.litcoffee') ||
        notNull_1.default(options.filename).endsWith('.coffee.md');
    var stages = tslib_1.__spread((literate ? [index_3.default] : []), [
        index_5.default,
        index_4.default,
        index_1.default,
        index_6.default,
        index_2.default,
    ]);
    var runToStage = options.runToStage;
    if (runToStage !== null && runToStage !== undefined) {
        var stageIndex = stages.findIndex(function (stage) { return stage.name === runToStage; });
        if (stageIndex !== -1) {
            stages = stages.slice(0, stageIndex + 1);
        }
        else {
            return convertCustomStage(source, runToStage, Boolean(options.useCS2));
        }
    }
    var result = runStages(source, options, stages);
    if (!options.disableSuggestionComment) {
        result.code = suggestions_1.prependSuggestionComment(result.code, result.suggestions);
    }
    result.code = convertNewlines_1.default(result.code, originalNewlineStr);
    return {
        code: result.code,
    };
}
exports.convert = convert;
function modernizeJS(source, options) {
    if (options === void 0) { options = {}; }
    source = removeUnicodeBOMIfNecessary_1.default(source);
    options = options_1.resolveOptions(options);
    var originalNewlineStr = detectNewlineStr_1.default(source);
    source = convertNewlines_1.default(source, '\n');
    var stages = [index_2.default];
    var result = runStages(source, options, stages);
    result.code = convertNewlines_1.default(result.code, originalNewlineStr);
    return {
        code: result.code,
    };
}
exports.modernizeJS = modernizeJS;
function runStages(initialContent, options, stages) {
    var content = initialContent;
    var suggestions = [];
    stages.forEach(function (stage) {
        var _a = runStage(stage, content, options), code = _a.code, stageSuggestions = _a.suggestions;
        content = code;
        suggestions.push.apply(suggestions, tslib_1.__spread(stageSuggestions));
    });
    return { code: content, suggestions: suggestions_1.mergeSuggestions(suggestions) };
}
function runStage(stage, content, options) {
    try {
        return stage.run(content, options);
    }
    catch (err) {
        var patchError = resolveToPatchError_1.default(err, content, stage.name);
        if (patchError !== null) {
            throw patchError;
        }
        throw err;
    }
}
function convertCustomStage(source, stageName, useCS2) {
    var context = new CodeContext_1.default(source);
    if (stageName === 'coffeescript-lexer') {
        var tokens = useCS2 ? decaffeinate_coffeescript2_1.tokens(source) : decaffeinate_coffeescript_1.tokens(source);
        return {
            code: formatCoffeeScriptLexerTokens_1.default(tokens, context),
        };
    }
    else if (stageName === 'coffeescript-parser') {
        var nodes = useCS2 ? decaffeinate_coffeescript2_1.nodes(source) : decaffeinate_coffeescript_1.nodes(source);
        return {
            code: formatCoffeeScriptAst_1.default(nodes, context),
        };
    }
    else if (stageName === 'coffee-lex') {
        return {
            code: formatCoffeeLexTokens_1.default(coffee_lex_1.default(source, { useCS2: useCS2 }), context),
        };
    }
    else if (stageName === 'decaffeinate-parser') {
        return {
            code: formatDecaffeinateParserAst_1.default(decaffeinate_parser_1.parse(source, { useCS2: useCS2 }), context),
        };
    }
    else {
        throw new Error("Unrecognized stage name: " + stageName);
    }
}
