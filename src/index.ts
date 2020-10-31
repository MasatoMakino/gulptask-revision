"use strict";

const { series, src, dest } = require("gulp");
const { readFileSync } = require("fs");
const rev = require("gulp-rev");
const revRewrite = require("gulp-rev-rewrite");
const revDelete = require("gulp-rev-delete-original");
const path = require("path");

interface Option {
  distDir?: string;
}

const initOption = (option?: Option) => {
  option ??= {};
  option.distDir ??= "./dist";
  return option;
};

export function generateTasks(option: Option) {
  option = initOption(option);
  const manifestFileName = "rev-manifest.json";
  const distPath = path.resolve(option.distDir);

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
    const manifest = readFileSync(path.resolve(distPath, manifestFileName));
    return src(path.resolve(distPath, "**/*.+(html|css|js)"))
      .pipe(revRewrite({ manifest: manifest }))
      .pipe(dest(distPath));
  };

  return series(rev_files, rev_replace);
}
