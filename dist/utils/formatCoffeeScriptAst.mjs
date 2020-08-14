import { __read, __spread, __values } from "tslib";
import { Base as CS1Base } from 'decaffeinate-coffeescript/lib/coffee-script/nodes';
import { Base as CS2Base } from 'decaffeinate-coffeescript2/lib/coffeescript/nodes';
import formatCoffeeScriptLocationData from './formatCoffeeScriptLocationData';
export default function formatCoffeeScriptAst(program, context) {
    var resultLines = formatAstNodeLines(program, context);
    return resultLines.map(function (line) { return line + '\n'; }).join('');
}
function formatAstNodeLines(node, context) {
    var e_1, _a, e_2, _b, e_3, _c, e_4, _d;
    var propLines = [];
    var blacklistedProps = ['locationData'];
    try {
        // Show the non-node children first.
        for (var _e = __values(Object.keys(node)), _f = _e.next(); !_f.done; _f = _e.next()) {
            var key = _f.value;
            var value = node[key];
            if (shouldTraverse(value) || blacklistedProps.indexOf(key) !== -1) {
                continue;
            }
            var valueText = void 0;
            try {
                valueText = JSON.stringify(value);
            }
            catch (e) {
                valueText = '(error)';
            }
            propLines.push(key + ": " + valueText);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
        }
        finally { if (e_1) throw e_1.error; }
    }
    try {
        // Then show the node children.
        for (var _g = __values(Object.keys(node)), _h = _g.next(); !_h.done; _h = _g.next()) {
            var key = _h.value;
            var value = node[key];
            if (!shouldTraverse(value)) {
                continue;
            }
            if (Array.isArray(value) && value.length === 0) {
                propLines.push(key + ": []");
            }
            else if (Array.isArray(value)) {
                propLines.push(key + ": [");
                try {
                    for (var value_1 = (e_3 = void 0, __values(value)), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
                        var child = value_1_1.value;
                        if (Array.isArray(child)) {
                            propLines.push("  [");
                            try {
                                for (var child_1 = (e_4 = void 0, __values(child)), child_1_1 = child_1.next(); !child_1_1.done; child_1_1 = child_1.next()) {
                                    var grandchild = child_1_1.value;
                                    propLines.push.apply(propLines, __spread(formatAstNodeLines(grandchild, context).map(function (s) { return '    ' + s; })));
                                }
                            }
                            catch (e_4_1) { e_4 = { error: e_4_1 }; }
                            finally {
                                try {
                                    if (child_1_1 && !child_1_1.done && (_d = child_1.return)) _d.call(child_1);
                                }
                                finally { if (e_4) throw e_4.error; }
                            }
                            propLines.push("  ]");
                        }
                        else {
                            propLines.push.apply(propLines, __spread(formatAstNodeLines(child, context).map(function (s) { return '  ' + s; })));
                        }
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (value_1_1 && !value_1_1.done && (_c = value_1.return)) _c.call(value_1);
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                propLines.push("]");
            }
            else {
                var childLines = formatAstNodeLines(value, context);
                childLines[0] = key + ": " + childLines[0];
                propLines.push.apply(propLines, __spread(childLines));
            }
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return __spread([
        node.constructor.name + " " + formatCoffeeScriptLocationData(node.locationData, context) + " {"
    ], propLines.map(function (s) { return '  ' + s; }), [
        '}',
    ]);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function shouldTraverse(value) {
    if (Array.isArray(value)) {
        return value.length === 0 || shouldTraverse(value[0]);
    }
    return value instanceof CS1Base || value instanceof CS2Base;
}
