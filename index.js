"use strict";

const { series, src, dest } = require("gulp");
const rev = require("gulp-rev");
const revRewrite = require("gulp-rev-rewrite");
const revDelete = require("gulp-rev-delete-original");
const path = require("path");

module.exports = distDir => {
  const manifestFileName = "rev-manifest.json";
  const distPath = path.resolve(distDir);

  const rev_files = () => {
    return src(
      path.resolve(distPath, "**/*.+(js|css|png|gif|jpg|jpeg|svg|woff)")
    )
      .pipe(rev())
      .pipe(revDelete())
      .pipe(dest(distPath))
      .pipe(rev.manifest(manifestFileName))
      .pipe(dest(distPath));
  };

  const rev_replace = () => {
    const manifest = src(path.resolve(distPath, manifestFileName));
    return src(path.resolve(distPath, "**/*.+(html|css|js)"))
      .pipe(revRewrite({ manifest: manifest }))
      .pipe(dest(distPath));
  };

  return series(rev_files, rev_replace);
};
