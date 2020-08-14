"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function formatCoffeeScriptLocationData(locationData, context) {
    var firstIndex = context.linesAndColumns.indexForLocation({
        line: locationData.first_line,
        column: locationData.first_column,
    });
    if (firstIndex === null) {
        return 'INVALID RANGE';
    }
    var lastIndex = context.linesAndColumns.indexForLocation({
        line: locationData.last_line,
        column: locationData.last_column,
    });
    if (lastIndex === null) {
        return 'INVALID RANGE';
    }
    return context.formatRange(firstIndex, lastIndex + 1);
}
exports.default = formatCoffeeScriptLocationData;
