import MemberAccessOpPatcher from './MemberAccessOpPatcher';
/**
 * Patches soaked member access while targeting optional chaining. This is
 * a straight passthrough, but we add a check to ensure the resulting JavaScript
 * would be valid. CoffeeScript allows such expressions in a LHS assignment
 * context, but JavaScript does not.
 *
 * @example
 *
 * ```coffee
 * a?.b       # this is fine in CoffeesScript and JavaScript
 * a?.b = 1   # this is fine in CoffeeScript, but not JavaScript
 * ```
 */
export default class OptionalChainingSoakedMemberAccessOpPatcher extends MemberAccessOpPatcher {
    patchAsExpression(): void;
    /**
     * There isn't an implicit-dot syntax like @a for soaked access.
     */
    hasImplicitOperator(): boolean;
}
