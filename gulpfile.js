const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const uglify = require('gulp-uglify');
const pump = require('pump');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: './'
    },
  })
});

gulp.task('minify-css', () => {
  return gulp.src(['css/*.css', '!css/*.min.css'])
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('css'));
});

gulp.task('compress', (cb) => {
  pump([
      gulp.src(['js/*.js', '!js/*.min.js']),
      uglify(),
      rename({
        suffix: '.min'
      }),
      gulp.dest('js')
    ],
    cb
  );
});

gulp.task('default', ['browserSync', 'minify-css', 'compress']);
