"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var https_1 = require("https");
var url_1 = require("url");
var package_json_1 = tslib_1.__importDefault(require("../package.json"));
var registry = package_json_1.default.publishConfig.registry;
function getLatestVersion(packageName) {
    var url = url_1.parse(registry);
    url.pathname = "/" + packageName;
    return new Promise(function (resolve, reject) {
        https_1.get(url_1.format(url), function (response) {
            var body = '';
            response.setEncoding('utf8');
            response.on('data', function (chunk) { return (body += chunk); });
            response.on('end', function () {
                if (response.statusCode !== 200) {
                    reject(new Error("unable to get latest version (code=" + response.statusCode + "): " + body));
                }
                var packageInfo = JSON.parse(body);
                resolve(packageInfo['dist-tags']['latest']);
            });
        }).on('error', reject);
    });
}
exports.default = getLatestVersion;
