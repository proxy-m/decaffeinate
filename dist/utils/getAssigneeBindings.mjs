import { __read, __spread, __values } from "tslib";
/**
 * Determine the variables introduced by this assignee (array destructure,
 * object destructure, rest, etc.).
 */
import { ArrayInitialiser, AssignOp, Identifier, ObjectInitialiser, ObjectInitialiserMember, Rest, Spread, } from 'decaffeinate-parser/dist/nodes';
export default function getAssigneeBindings(node) {
    var e_1, _a, e_2, _b;
    if (node instanceof Identifier) {
        return [node.data];
    }
    else if (node instanceof ArrayInitialiser) {
        var bindings = [];
        try {
            for (var _c = __values(node.members), _d = _c.next(); !_d.done; _d = _c.next()) {
                var member = _d.value;
                bindings.push.apply(bindings, __spread(getAssigneeBindings(member)));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return bindings;
    }
    else if (node instanceof ObjectInitialiser) {
        var bindings = [];
        try {
            for (var _e = __values(node.members), _f = _e.next(); !_f.done; _f = _e.next()) {
                var member = _f.value;
                bindings.push.apply(bindings, __spread(getAssigneeBindings(member)));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
            }
            finally { if (e_2) throw e_2.error; }
        }
        return bindings;
    }
    else if (node instanceof ObjectInitialiserMember) {
        return getAssigneeBindings(node.expression || node.key);
    }
    else if (node instanceof AssignOp) {
        return getAssigneeBindings(node.assignee);
    }
    else if (node instanceof Spread || node instanceof Rest) {
        return getAssigneeBindings(node.expression);
    }
    return [];
}
