import { __read, __spread } from "tslib";
import lex from 'coffee-lex';
import { nodes as getCoffee1Nodes, tokens as getCoffee1Tokens } from 'decaffeinate-coffeescript';
import { nodes as getCoffee2Nodes, tokens as getCoffee2Tokens } from 'decaffeinate-coffeescript2';
import { parse as decaffeinateParse } from 'decaffeinate-parser';
import AddVariableDeclarationsStage from './stages/add-variable-declarations/index';
import ResugarStage from './stages/resugar/index';
import LiterateStage from './stages/literate/index';
import MainStage from './stages/main/index';
import NormalizeStage from './stages/normalize/index';
import SemicolonsStage from './stages/semicolons/index';
import { mergeSuggestions, prependSuggestionComment } from './suggestions';
import CodeContext from './utils/CodeContext';
import convertNewlines from './utils/convertNewlines';
import detectNewlineStr from './utils/detectNewlineStr';
import formatCoffeeLexTokens from './utils/formatCoffeeLexTokens';
import formatCoffeeScriptAst from './utils/formatCoffeeScriptAst';
import formatCoffeeScriptLexerTokens from './utils/formatCoffeeScriptLexerTokens';
import formatDecaffeinateParserAst from './utils/formatDecaffeinateParserAst';
import PatchError from './utils/PatchError';
import removeUnicodeBOMIfNecessary from './utils/removeUnicodeBOMIfNecessary';
import resolveToPatchError from './utils/resolveToPatchError';
export { default as run } from './cli';
import { resolveOptions } from './options';
import notNull from './utils/notNull';
export { PatchError };
/**
 * Convert CoffeeScript source code into modern JavaScript preserving comments
 * and formatting.
 */
export function convert(source, options) {
    if (options === void 0) { options = {}; }
    source = removeUnicodeBOMIfNecessary(source);
    options = resolveOptions(options);
    var originalNewlineStr = detectNewlineStr(source);
    source = convertNewlines(source, '\n');
    var literate = options.literate ||
        notNull(options.filename).endsWith('.litcoffee') ||
        notNull(options.filename).endsWith('.coffee.md');
    var stages = __spread((literate ? [LiterateStage] : []), [
        NormalizeStage,
        MainStage,
        AddVariableDeclarationsStage,
        SemicolonsStage,
        ResugarStage,
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
        result.code = prependSuggestionComment(result.code, result.suggestions);
    }
    result.code = convertNewlines(result.code, originalNewlineStr);
    return {
        code: result.code,
    };
}
export function modernizeJS(source, options) {
    if (options === void 0) { options = {}; }
    source = removeUnicodeBOMIfNecessary(source);
    options = resolveOptions(options);
    var originalNewlineStr = detectNewlineStr(source);
    source = convertNewlines(source, '\n');
    var stages = [ResugarStage];
    var result = runStages(source, options, stages);
    result.code = convertNewlines(result.code, originalNewlineStr);
    return {
        code: result.code,
    };
}
function runStages(initialContent, options, stages) {
    var content = initialContent;
    var suggestions = [];
    stages.forEach(function (stage) {
        var _a = runStage(stage, content, options), code = _a.code, stageSuggestions = _a.suggestions;
        content = code;
        suggestions.push.apply(suggestions, __spread(stageSuggestions));
    });
    return { code: content, suggestions: mergeSuggestions(suggestions) };
}
function runStage(stage, content, options) {
    try {
        return stage.run(content, options);
    }
    catch (err) {
        var patchError = resolveToPatchError(err, content, stage.name);
        if (patchError !== null) {
            throw patchError;
        }
        throw err;
    }
}
function convertCustomStage(source, stageName, useCS2) {
    var context = new CodeContext(source);
    if (stageName === 'coffeescript-lexer') {
        var tokens = useCS2 ? getCoffee2Tokens(source) : getCoffee1Tokens(source);
        return {
            code: formatCoffeeScriptLexerTokens(tokens, context),
        };
    }
    else if (stageName === 'coffeescript-parser') {
        var nodes = useCS2 ? getCoffee2Nodes(source) : getCoffee1Nodes(source);
        return {
            code: formatCoffeeScriptAst(nodes, context),
        };
    }
    else if (stageName === 'coffee-lex') {
        return {
            code: formatCoffeeLexTokens(lex(source, { useCS2: useCS2 }), context),
        };
    }
    else if (stageName === 'decaffeinate-parser') {
        return {
            code: formatDecaffeinateParserAst(decaffeinateParse(source, { useCS2: useCS2 }), context),
        };
    }
    else {
        throw new Error("Unrecognized stage name: " + stageName);
    }
}
