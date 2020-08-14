"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lines_and_columns_1 = tslib_1.__importDefault(require("lines-and-columns"));
var PatchError_1 = tslib_1.__importDefault(require("./PatchError"));
/**
 * If the given exception is an error with code location information, extract
 * its start and end position and return a PatchError to use in its place.
 * Otherwise, return null.
 */
function resolveToPatchError(err, content, stageName) {
    var makePatchError = function (start, end, source) {
        return new PatchError_1.default(stageName + " failed to parse: " + err.message, source, start, end);
    };
    if ('pos' in err) {
        // Handle JavaScript parse errors.
        var pos = err.pos;
        if (pos === content.length) {
            pos--;
        }
        return makePatchError(pos, pos + 1, content);
    }
    else if ('syntaxError' in err) {
        // Handle CoffeeScript parse errors.
        var location = err.syntaxError.location;
        var lineMap = new lines_and_columns_1.default(content);
        var firstIndex = lineMap.indexForLocation({ line: location.first_line, column: location.first_column });
        var lastIndex = lineMap.indexForLocation({ line: location.last_line, column: location.last_column });
        if (firstIndex !== null) {
            if (lastIndex === null) {
                lastIndex = firstIndex + 1;
            }
            else {
                lastIndex++;
            }
            return makePatchError(firstIndex, lastIndex, content);
        }
    }
    return null;
}
exports.default = resolveToPatchError;
