"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var nodes_1 = require("decaffeinate-parser/dist/nodes");
var containsDescendant_1 = tslib_1.__importDefault(require("./containsDescendant"));
function containsSuperCall(node) {
    return containsDescendant_1.default(node, function (child) { return child instanceof nodes_1.Super || child instanceof nodes_1.BareSuperFunctionApplication; }, {
        shouldStopTraversal: function (child) { return child instanceof nodes_1.Class; },
    });
}
exports.default = containsSuperCall;
