var gulp = require("gulp");
var babel = require("gulp-babel");
var plumber = require('gulp-plumber');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var samples = ['clapAlert', 'knockCookRecipe', 'snapCamera', 'knuckleKnockScroll']
gulp.task('browserify', function(){
  samples.forEach((item) => {
    browserify({
      entries: ['./sample/' + item + '/main.js']
    })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./sample/' + item));
  })
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

gulp.task('default', ['babel', 'watch', 'browserify']);
