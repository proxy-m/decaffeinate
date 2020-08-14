"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var IdentifierPatcher_1 = tslib_1.__importDefault(require("../stages/main/patchers/IdentifierPatcher"));
function getBindingCodeForMethod(method) {
    var accessCode;
    if (method.key instanceof IdentifierPatcher_1.default) {
        accessCode = "." + method.key.node.data;
    }
    else {
        accessCode = "[" + method.key.getRepeatCode() + "]";
    }
    return "this" + accessCode + " = this" + accessCode + ".bind(this)";
}
exports.default = getBindingCodeForMethod;
