"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var AssignOpPatcher_1 = tslib_1.__importDefault(require("../stages/main/patchers/AssignOpPatcher"));
var DynamicMemberAccessOpPatcher_1 = tslib_1.__importDefault(require("../stages/main/patchers/DynamicMemberAccessOpPatcher"));
var FunctionPatcher_1 = tslib_1.__importDefault(require("../stages/main/patchers/FunctionPatcher"));
var MemberAccessOpPatcher_1 = tslib_1.__importDefault(require("../stages/main/patchers/MemberAccessOpPatcher"));
/**
 * Given a main stage patcher, determine if it assigns a function to a class
 * prototype. This means that a super call within the function needs access to
 * the enclosing function.
 */
function extractPrototypeAssignPatchers(patcher) {
    if (!(patcher instanceof AssignOpPatcher_1.default) ||
        !(patcher.expression instanceof FunctionPatcher_1.default) ||
        !(patcher.assignee instanceof MemberAccessOpPatcher_1.default || patcher.assignee instanceof DynamicMemberAccessOpPatcher_1.default) ||
        !(patcher.assignee.expression instanceof MemberAccessOpPatcher_1.default) ||
        patcher.assignee.expression.member.node.data !== 'prototype') {
        return null;
    }
    return {
        classRefPatcher: patcher.assignee.expression.expression,
        methodAccessPatcher: patcher.assignee,
    };
}
exports.default = extractPrototypeAssignPatchers;
