"use strict";

const { series, src, dest } = require("gulp");
const rev = require("gulp-rev");
const revRewrite = require("gulp-rev-rewrite");
const revDelete = require("gulp-rev-delete-original");

const manifestFileName = "rev-manifest.json";
const distDir = "./dist/";

const rev_files = () => {
  return src(distDir + "**/*.+(js|css|png|gif|jpg|jpeg|svg|woff)")
    .pipe(rev())
    .pipe(revDelete())
    .pipe(dest(distDir))
    .pipe(rev.manifest(manifestFileName))
    .pipe(dest(distDir));
};

const rev_replace = () => {
  const manifest = src(distDir + manifestFileName);
  return src(distDir + "/**/*.+(html|css|js)")
    .pipe(revRewrite({ manifest: manifest }))
    .pipe(dest(distDir));
};

exports.revision = series(rev_files, rev_replace);
