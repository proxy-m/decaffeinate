import FunctionApplicationPatcher from './FunctionApplicationPatcher';
/**
 * Patches soaked function applications while targeting optional chaining. This
 * is _almost_ a straight passthrough, but JavaScript adds a `.` compared to
 * CoffeeScript.
 *
 * @example
 *
 * This:
 *
 * ```coffee
 * a?(b)
 * ```
 *
 * Converts to this:
 *
 * ```js
 * a?.(b)
 * ```
 */
export default class OptionalChainingSoakedFunctionApplicationPatcher extends FunctionApplicationPatcher {
    patchAsExpression(): void;
}
