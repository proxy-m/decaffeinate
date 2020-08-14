export interface Options {
    filename?: string;
    useCS2?: boolean;
    runToStage?: string | null;
    literate?: boolean;
    disableSuggestionComment?: boolean;
    noArrayIncludes?: boolean;
    useJSModules?: boolean;
    looseJSModules?: boolean;
    safeImportFunctionIdentifiers?: Array<string>;
    preferLet?: boolean;
    loose?: boolean;
    looseDefaultParams?: boolean;
    looseForExpressions?: boolean;
    looseForOf?: boolean;
    looseIncludes?: boolean;
    looseComparisonNegation?: boolean;
    disallowInvalidConstructors?: boolean;
    optionalChaining?: boolean;
}
export declare const DEFAULT_OPTIONS: Options;
export declare function resolveOptions(options: Options): Options;
