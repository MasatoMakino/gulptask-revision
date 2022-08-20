"use strict";

const { series, src, dest } = require("gulp");
const { readFileSync } = require("fs");
const rev = require("gulp-rev");
const revRewrite = require("gulp-rev-rewrite");
const revDelete = require("gulp-rev-delete-original");
const path = require("path");
import { unlinkSync, accessSync } from "fs";

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

  const removeManifest = () => {
    const manifestFilePath = path.resolve(distPath, manifestFileName);

    const existManifest = () => {
      try {
        accessSync(manifestFilePath);
        return true;
      } catch {
        return false;
      }
    };

    const exist = existManifest();
    if (exist) {
      unlinkSync(manifestFilePath);
    }
  };

  const rev_files = () => {
    removeManifest();

    const globPattern = path.resolve(
      distPath,
      "**/*.+(js|css|png|gif|jpg|jpeg|svg|woff|json)"
    );

    return src(globPattern)
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
