var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var livereload = require('gulp-livereload');

gulp.task('sass', function () {
  return gulp.src('sass/**/*.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest('./public/css/'))
    .pipe(livereload({ start: true }));
});

gulp.task('watch', function() {
  livereload.listen();
  gulp.watch('sass/**/*.scss', ['sass']);
});
gulp.task('default', ['watch']);