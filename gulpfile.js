var gulp = require("gulp");
var babel = require("gulp-babel");

gulp.task('babel', function() {
  gulp.src('./src/*.es6')
    .pipe(babel())
    .pipe(gulp.dest('./lib/'))
});

gulp.task('watch', function() {
  gulp.watch('./src/*.es6', ['babel'])
});

gulp.task('default', ['babel', 'watch']);
