var gulp = require('gulp'),
  nodemon = require('gulp-nodemon'),
  plumber = require('gulp-plumber'),
  livereload = require('gulp-livereload'),
  sass = require('gulp-sass'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream');

gulp.task('sass', function () {
  gulp.src('./public/css/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('./public/css'))
    .pipe(livereload());
});

gulp.task('browserify', function(){
  return browserify('./public/src/index.jsx')
          .bundle()
          .pipe(source('app.js'))
          .pipe(gulp.dest('./public/js/'));;
});

gulp.task('watch', function() {
  gulp.watch('./public/css/*.scss', ['sass']);
  gulp.watch('./public/src/**/*.jsx', ['browserify']);
});

gulp.task('develop', function () {
  livereload.listen();
  nodemon({
    script: 'bin/www',
    ext: 'js jade coffee',
  }).on('restart', function () {
    setTimeout(function () {
      livereload.changed(__dirname);
    }, 500);
  });
});

gulp.task('default', [
  'sass',
  'browserify',
  'develop',
  'watch'
]);
