"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTasks = void 0;
var _a = require("gulp"), series = _a.series, src = _a.src, dest = _a.dest;
var rev = require("gulp-rev");
var revRewrite = require("gulp-rev-rewrite");
var revDelete = require("gulp-rev-delete-original");
var path = require("path");
var initOption = function (option) {
    var _a;
    option !== null && option !== void 0 ? option : (option = {});
    (_a = option.distDir) !== null && _a !== void 0 ? _a : (option.distDir = "./dist");
    return option;
};
function generateTasks(option) {
    option = initOption(option);
    var manifestFileName = "rev-manifest.json";
    var distPath = path.resolve(option.distDir);
    var rev_files = function () {
        return src(path.resolve(distPath, "**/*.+(js|css|png|gif|jpg|jpeg|svg|woff)"))
            .pipe(rev())
            .pipe(revDelete())
            .pipe(dest(distPath))
            .pipe(rev.manifest(manifestFileName))
            .pipe(dest(distPath));
    };
    var rev_replace = function () {
        var manifest = src(path.resolve(distPath, manifestFileName));
        return src(path.resolve(distPath, "**/*.+(html|css|js)"))
            .pipe(revRewrite({ manifest: manifest }))
            .pipe(dest(distPath));
    };
    return series(rev_files, rev_replace);
}
exports.generateTasks = generateTasks;
//# sourceMappingURL=index.js.map