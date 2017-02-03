var gulp = require("gulp");
var babel = require("gulp-babel");
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('browserify', function(){
  browserify({
    entries: ['./sample/main.js']
  })
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(gulp.dest('./sample/'));
});

gulp.task('babel', function() {
  gulp.src('./src/*.es6')
    .pipe(plumber())
    .pipe(babel())
    .pipe(gulp.dest('./lib/'))
});

gulp.task('watch', function() {
  gulp.watch('./src/*.es6', ['babel', 'browserify'])
});

gulp.task('default', ['babel', 'watch']);
