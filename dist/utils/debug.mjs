import { __read, __spread } from "tslib";
export function logger(name) {
    if (isLoggingEnabled(name)) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return console.log.apply(console, __spread([name], args));
        };
    }
    else {
        return function () {
            /* logging disabled */
        };
    }
}
function isLoggingEnabled(name) {
    return !!process.env["DEBUG:" + name] || !!process.env['DEBUG:*'];
}
