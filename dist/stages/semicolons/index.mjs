import { parse } from '@codemod/parser';
import asi from 'automatic-semicolon-insertion';
import MagicString from 'magic-string';
import { logger } from '../../utils/debug';
var SemicolonsStage = /** @class */ (function () {
    function SemicolonsStage() {
    }
    SemicolonsStage.run = function (content) {
        var log = logger(this.name);
        log(content);
        var editor = new MagicString(content);
        var ast = parse(content, {
            tokens: true,
        });
        var _a = asi(content, ast), insertions = _a.insertions, removals = _a.removals;
        insertions.forEach(function (_a) {
            var index = _a.index, content = _a.content;
            return editor.appendLeft(index, content);
        });
        removals.forEach(function (_a) {
            var start = _a.start, end = _a.end;
            return editor.remove(start, end);
        });
        return {
            code: editor.toString(),
            suggestions: [],
        };
    };
    return SemicolonsStage;
}());
export default SemicolonsStage;
