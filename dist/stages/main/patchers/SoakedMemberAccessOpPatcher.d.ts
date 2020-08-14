import MemberAccessOpPatcher from './MemberAccessOpPatcher';
export default class SoakedMemberAccessOpPatcher extends MemberAccessOpPatcher {
    _shouldSkipSoakPatch: boolean;
    patchAsExpression(): void;
    shouldPatchAsConditional(): boolean;
    patchAsConditional(): void;
    patchAsGuardCall(): void;
    setShouldSkipSoakPatch(): void;
    /**
     * There isn't an implicit-dot syntax like @a for soaked access.
     */
    hasImplicitOperator(): boolean;
}
