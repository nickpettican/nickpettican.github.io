const gulp = require("gulp");
const csso = require("gulp-csso");
const terser = require("gulp-terser");
const concat = require("gulp-concat");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const cp = require("child_process");
const imagemin = require("gulp-imagemin");
const browserSync = require("browser-sync");

const jekyllCommand = /^win/.test(process.platform) ? "jekyll.bat" : "bundle";

/*
 * Build the Jekyll Site
 * runs a child process in node that runs the jekyll commands
 */
gulp.task("jekyll-build", function (done) {
  return cp
    .spawn(jekyllCommand, ["exec", "jekyll", "build"], { stdio: "inherit" })
    .on("close", done);
});

/*
 * Rebuild Jekyll & reload browserSync
 */
gulp.task("jekyll-rebuild", gulp.series("jekyll-build"), function (done) {
  browserSync.reload();
  done();
});

/*
 * Build the jekyll site and launch browser-sync
 */
gulp.task("browser-sync", gulp.series("jekyll-build"), function () {
  browserSync({
    server: {
      baseDir: "_site",
    },
  });
});

/*
 * Compile and minify sass
 */
gulp.task("sass", function () {
  return gulp
    .src("src/styles/**/*.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(csso())
    .pipe(gulp.dest("assets/css/"));
});

/*
 * Compile fonts
 */
gulp.task("fonts", function () {
  return gulp
    .src("src/fonts/**/*.{ttf,woff,woff2}")
    .pipe(plumber())
    .pipe(gulp.dest("assets/fonts/"));
});

/*
 * Minify images
 */
gulp.task("imagemin", function () {
  return gulp
    .src("src/img/**/*.{jpg,png,gif}")
    .pipe(plumber())
    .pipe(
      imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })
    )
    .pipe(gulp.dest("assets/img/"));
});

/**
 * Compile and minify js
 */
gulp.task("js", function () {
  return gulp
    .src("src/js/**/*.js")
    .pipe(plumber())
    .pipe(concat("main.js"))
    .pipe(terser())
    .pipe(gulp.dest("assets/js/"));
});

gulp.task("watch", function (done) {
  gulp.watch("src/styles/**/*.scss", gulp.series("sass", "jekyll-rebuild"));
  gulp.watch("src/js/**/*.js", gulp.series("js"));
  gulp.watch("src/fonts/**/*.{tff,woff,woff2}", gulp.series("fonts"));
  gulp.watch("src/img/**/*.{jpg,png,gif}", gulp.series("imagemin"));
  gulp.watch(
    ["*html", "_includes/*html", "_layouts/*.html"],
    gulp.series("jekyll-rebuild")
  );
});

gulp.task(
  "default",
  gulp.series("js", "sass", "fonts", "browser-sync", "watch")
);
