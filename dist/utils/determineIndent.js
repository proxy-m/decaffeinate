"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
var detectIndent = require('detect-indent');
var DEFAULT_INDENT = '  ';
function determineIndent(source) {
    var indent = detectIndent(source);
    if (indent.type === 'space' && indent.amount % 2 === 1) {
        return DEFAULT_INDENT;
    }
    return indent.indent || DEFAULT_INDENT;
}
exports.default = determineIndent;
