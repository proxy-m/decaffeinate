import { tokens } from 'decaffeinate-coffeescript';
import AddVariableDeclarationsStage from './stages/add-variable-declarations/index';
import SemicolonsStage from './stages/semicolons/index';
import EsnextStage from './stages/esnext/index';
import LiterateStage from './stages/literate/index';
import MainStage from './stages/main/index';
import { mergeSuggestions, prependSuggestionComment } from './suggestions';
import NormalizeStage from './stages/normalize/index';
import convertNewlines from './utils/convertNewlines';
import detectNewlineStr from './utils/detectNewlineStr';
import formatCoffeeLexAst from './utils/formatCoffeeLexTokens';
import formatCoffeeScriptAst from './utils/formatCoffeeScriptAst';
import formatCoffeeScriptLexerTokens from './utils/formatCoffeeScriptLexerTokens';
import formatDecaffeinateParserAst from './utils/formatDecaffeinateParserAst';
import parse from './utils/parse';
import PatchError from './utils/PatchError';
import removeUnicodeBOMIfNecessary from './utils/removeUnicodeBOMIfNecessary';
import resolveToPatchError from './utils/resolveToPatchError';

export { default as run } from './cli';
import type { Suggestion } from './suggestions';
export { PatchError };


export type Options = {
  filename: ?string,
  runToStage: ?string,
  literate: ?boolean,
  disableSuggestions: ?boolean,
  keepCommonJS: ?boolean,
  forceDefaultExport: ?boolean,
  safeImportFunctionIdentifiers: ?Array<string>,
  preferConst: ?boolean,
  looseDefaultParams: ?boolean,
  looseForExpressions: ?boolean,
  looseForOf: ?boolean,
  looseIncludes: ?boolean,
  looseComparisonNegation: ?boolean,
  allowInvalidConstructors: ?boolean,
  enableBabelConstructorWorkaround: ?boolean,
};

const DEFAULT_OPTIONS = {
  filename: 'input.coffee',
  runToStage: null,
  literate: false,
  disableSuggestions: true,
  keepCommonJS: false,
  forceDefaultExport: false,
  safeImportFunctionIdentifiers: [],
  preferConst: false,
  looseDefaultParams: false,
  looseForExpressions: false,
  looseForOf: false,
  looseIncludes: false,
  looseComparisonNegation: false,
  allowInvalidConstructors: false,
  enableBabelConstructorWorkaround: false,
};

type ConversionResult = {
  code: string,
};

export type StageResult = {
  code: string,
  suggestions: Array<Suggestion>,
}

type Stage = {
  name: string,
  run: (content: string, options: Options) => StageResult,
};

/**
 * Convert CoffeeScript source code into modern JavaScript preserving comments
 * and formatting.
 */
export function convert(source: string, options: ?Options={}): ConversionResult {
  source = removeUnicodeBOMIfNecessary(source);
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  let originalNewlineStr = detectNewlineStr(source);
  source = convertNewlines(source, '\n');

  let literate = options.literate ||
    options.filename.endsWith('.litcoffee') ||
    options.filename.endsWith('.coffee.md');
  let stages = [
    ...(literate ? [LiterateStage] : []),
    NormalizeStage,
    MainStage,
    AddVariableDeclarationsStage,
    SemicolonsStage,
    EsnextStage
  ];
  let runToStage = options.runToStage;
  if (runToStage !== null && runToStage !== undefined) {
    let stageIndex = stages.findIndex(stage => stage.name === runToStage);
    if (stageIndex !== -1) {
      stages = stages.slice(0, stageIndex + 1);
    } else {
      return convertCustomStage(source, runToStage);
    }
  }
  let result = runStages(source, options, stages);
  if (!options.disableSuggestions) {
    result.code = prependSuggestionComment(result.code, result.suggestions);
  }
  result.code = convertNewlines(result.code, originalNewlineStr);
  return {
    code: result.code,
  };
}

export function modernizeJS(source: string, options: ?Options={}): ConversionResult {
  source = removeUnicodeBOMIfNecessary(source);
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  let originalNewlineStr = detectNewlineStr(source);
  source = convertNewlines(source, '\n');
  let stages = [
    EsnextStage
  ];
  let result = runStages(source, options, stages);
  result.code = convertNewlines(result.code, originalNewlineStr);
  return {
    code: result.code,
  };
}

function runStages(initialContent: string, options: Options, stages: Array<Stage>): ConversionResult {
  let content = initialContent;
  let suggestions = [];
  stages.forEach(stage => {
    let { code, suggestions: stageSuggestions } = runStage(stage, content, options);
    content = code;
    suggestions.push(...stageSuggestions);
  });
  return { code: content, suggestions: mergeSuggestions(suggestions) };
}

function runStage(stage: Stage, content: string, options: Options): StageResult {
  try {
    return stage.run(content, options);
  } catch (err) {
    let patchError = resolveToPatchError(err, content, stage.name);
    if (patchError !== null) {
      throw patchError;
    }
    throw err;
  }
}

function convertCustomStage(source: string, stageName: string): ConversionResult {
  let ast = parse(source);
  if (stageName === 'coffeescript-lexer') {
    return {
      code: formatCoffeeScriptLexerTokens(tokens(source), ast.context),
    };
  } else if (stageName === 'coffeescript-parser') {
    return {
      code: formatCoffeeScriptAst(ast.context),
    };
  } else if (stageName === 'coffee-lex') {
    return {
      code: formatCoffeeLexAst(ast.context),
    };
  } else if (stageName === 'decaffeinate-parser') {
    return {
      code: formatDecaffeinateParserAst(ast),
    };
  } else {
    throw new Error(`Unrecognized stage name: ${stageName}`);
  }
}
