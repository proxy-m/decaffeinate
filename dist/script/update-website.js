"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var child_process_1 = require("mz/child_process");
var fs_1 = require("mz/fs");
var path_1 = require("path");
var getLatestVersion_1 = tslib_1.__importDefault(require("./getLatestVersion"));
var commit = true;
for (var i = 2; i < process.argv.length; i++) {
    switch (process.argv[i]) {
        case '--no-commit':
            commit = false;
            break;
        default:
            console.error('error: unexpected argument:', process.argv[i]);
            console.error('update-website [--no-commit|--force]');
            process.exit(-1);
    }
}
function pkg() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var content;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.readFile(path_1.join(__dirname, '../package.json'), { encoding: 'utf8' })];
                case 1:
                    content = _a.sent();
                    return [2 /*return*/, JSON.parse(content)];
            }
        });
    });
}
function configureGithubRemote(name, project) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var githubToken, url, err_1;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    githubToken = process.env['GH_TOKEN'] || process.env['GITHUB_TOKEN'];
                    url = githubToken ? "https://" + githubToken + "@github.com/" + project + ".git" : "git@github.com:" + project + ".git";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, run('git', ['remote', 'remove', 'website'])];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    return [3 /*break*/, 4];
                case 4:
                    console.log("Adding remote " + name + "\u2026");
                    return [4 /*yield*/, run('git', ['remote', 'add', '-f', name, url])];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, run('git', ['config', 'user.name', 'Brian Donovan'])];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, run('git', ['config', 'user.email', '1938+eventualbuddha@users.noreply.github.com'])];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function run(command, args) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var _a, stdout, stderr;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, child_process_1.execFile(command, args)];
                case 1:
                    _a = tslib_1.__read.apply(void 0, [_b.sent(), 2]), stdout = _a[0], stderr = _a[1];
                    return [2 /*return*/, { stdout: stdout, stderr: stderr }];
            }
        });
    });
}
function gitRevParse(ref) {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var stdout;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, run('git', ['rev-parse', ref])];
                case 1:
                    stdout = (_a.sent()).stdout;
                    return [2 /*return*/, stdout.trim()];
            }
        });
    });
}
function hasChanges() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var err_2;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // update the cache
                return [4 /*yield*/, run('git', ['status'])];
                case 1:
                    // update the cache
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, run('git', ['diff-index', '--exit-code', 'HEAD', '--'])];
                case 3:
                    _a.sent();
                    return [2 /*return*/, false];
                case 4:
                    err_2 = _a.sent();
                    return [2 /*return*/, true];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function updateWebsite() {
    return tslib_1.__awaiter(this, void 0, void 0, function () {
        var name, latestVersion, currentRef, decaffeinatePackage, decaffeinateRegistry, websitePackage, currentVersion, args, _a, _b;
        return tslib_1.__generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, configureGithubRemote('website', 'decaffeinate/decaffeinate-project.org')];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, pkg()];
                case 2:
                    name = (_c.sent()).name;
                    return [4 /*yield*/, getLatestVersion_1.default(name)];
                case 3:
                    latestVersion = _c.sent();
                    return [4 /*yield*/, gitRevParse('HEAD')];
                case 4:
                    currentRef = _c.sent();
                    return [4 /*yield*/, pkg()];
                case 5:
                    decaffeinatePackage = _c.sent();
                    decaffeinateRegistry = decaffeinatePackage['publishConfig']['registry'];
                    console.log('Setting up website repo…');
                    return [4 /*yield*/, run('git', ['fetch', '-f', 'website', 'master:website-master'])];
                case 6:
                    _c.sent();
                    return [4 /*yield*/, run('git', ['reset', '--hard', 'website-master'])];
                case 7:
                    _c.sent();
                    return [4 /*yield*/, pkg()];
                case 8:
                    websitePackage = _c.sent();
                    currentVersion = websitePackage['devDependencies']['decaffeinate'];
                    if (!(currentVersion === latestVersion)) return [3 /*break*/, 9];
                    console.log("Already using decaffeinate v" + latestVersion + ", skipping install.");
                    return [3 /*break*/, 16];
                case 9:
                    console.log(currentVersion + " != " + latestVersion + ", installing decaffeinate v" + latestVersion + "\u2026");
                    args = ['add', '--dev', '--exact', "decaffeinate@" + latestVersion];
                    if (decaffeinateRegistry) {
                        args.unshift('--registry', decaffeinateRegistry);
                    }
                    return [4 /*yield*/, run('yarn', args)];
                case 10:
                    _c.sent();
                    return [4 /*yield*/, hasChanges()];
                case 11:
                    if (!_c.sent()) return [3 /*break*/, 16];
                    if (!commit) return [3 /*break*/, 14];
                    console.log('Pushing changes to website repo…');
                    return [4 /*yield*/, run('git', ['commit', '-av', '-m', "chore: update to decaffeinate " + latestVersion])];
                case 12:
                    _c.sent();
                    return [4 /*yield*/, run('git', ['push', 'website', 'HEAD:master'])];
                case 13:
                    _c.sent();
                    return [3 /*break*/, 16];
                case 14:
                    console.log('Not committing because --no-commit was given:');
                    _b = (_a = console).log;
                    return [4 /*yield*/, run('git', ['diff'])];
                case 15:
                    _b.apply(_a, [(_c.sent()).stdout]);
                    _c.label = 16;
                case 16:
                    console.log("Switching back to " + currentRef.slice(0, 7) + "\u2026");
                    return [4 /*yield*/, run('git', ['reset', '--hard', currentRef])];
                case 17:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    });
}
updateWebsite().catch(function (err) {
    console.error(err.stack);
    process.exit(1);
});
