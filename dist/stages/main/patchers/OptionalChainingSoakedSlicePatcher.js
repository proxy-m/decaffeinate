"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
/**
 * Handles soaked array or string slicing, e.g. `names?[i..]`.
 */
var SlicePatcher_1 = tslib_1.__importDefault(require("./SlicePatcher"));
/**
 * Patches soaked slices while targeting optional chaining. This is
 * _almost_ a straight passthrough, we just keep the `?` in the slice call.
 *
 * @example
 *
 * This:
 *
 * ```coffee
 * a?[b..c]
 * ```
 *
 * converts to this:
 *
 * ```js
 * a?.slice(b, c + 1 || undefined)
 * ```
 */
var OptionalChainingSoakedSlicePatcher = /** @class */ (function (_super) {
    tslib_1.__extends(OptionalChainingSoakedSlicePatcher, _super);
    function OptionalChainingSoakedSlicePatcher() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OptionalChainingSoakedSlicePatcher.prototype.getSliceStartCode = function (splice) {
        if (splice === void 0) { splice = false; }
        return splice ? '?.splice(' : '?.slice(';
    };
    return OptionalChainingSoakedSlicePatcher;
}(SlicePatcher_1.default));
exports.default = OptionalChainingSoakedSlicePatcher;
