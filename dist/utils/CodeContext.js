"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lines_and_columns_1 = tslib_1.__importDefault(require("lines-and-columns"));
var CodeContext = /** @class */ (function () {
    function CodeContext(source) {
        this.source = source;
        this.linesAndColumns = new lines_and_columns_1.default(source);
    }
    /**
     * Display a range of code, e.g. for a token or an AST node.
     *
     * The line and column are displayed as 1-indexed, to agree with most editors,
     * and the actual 0-indexed code index is also displayed.
     *
     * For example, if a program is just "foo", then the "foo" token has this range:
     * [1:1(0)-1:4(3)]
     */
    CodeContext.prototype.formatRange = function (startIndex, endIndex) {
        return "[" + this.formatIndex(startIndex) + "-" + this.formatIndex(endIndex) + "]";
    };
    CodeContext.prototype.formatIndex = function (index) {
        if (index > this.source.length) {
            index = this.source.length;
        }
        var location = this.linesAndColumns.locationForIndex(index);
        if (!location) {
            return 'INVALID POSITION';
        }
        var line = location.line, column = location.column;
        return line + 1 + ":" + (column + 1) + "(" + index + ")";
    };
    return CodeContext;
}());
exports.default = CodeContext;
