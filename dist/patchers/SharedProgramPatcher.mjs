import { __extends, __values } from "tslib";
import determineIndent from '../utils/determineIndent';
import NodePatcher from './NodePatcher';
var ProgramPatcher = /** @class */ (function (_super) {
    __extends(ProgramPatcher, _super);
    function ProgramPatcher(patcherContext, body) {
        var _this = _super.call(this, patcherContext) || this;
        _this.helpers = new Map();
        _this._indentString = null;
        _this.body = body;
        return _this;
    }
    ProgramPatcher.prototype.shouldTrimContentRange = function () {
        return true;
    };
    /**
     * Register a helper to be reused in several places.
     *
     * FIXME: Pick a different name than what is in scope.
     */
    ProgramPatcher.prototype.registerHelper = function (name, code) {
        code = code.trim();
        if (this.helpers.has(name)) {
            if (this.helpers.get(name) !== code) {
                throw new Error("BUG: cannot override helper '" + name + "'");
            }
        }
        else {
            this.helpers.set(name, code);
        }
        return name;
    };
    ProgramPatcher.prototype.patchHelpers = function () {
        var e_1, _a;
        try {
            for (var _b = __values(this.helpers.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                var helper = _c.value;
                this.editor.append("\n" + helper);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /**
     * Gets the indent string used for each indent in this program.
     */
    ProgramPatcher.prototype.getProgramIndentString = function () {
        if (!this._indentString) {
            this._indentString = determineIndent(this.context.source);
        }
        return this._indentString;
    };
    return ProgramPatcher;
}(NodePatcher));
export default ProgramPatcher;
