/*eslint-disable no-console */

'use strict';

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var livereload = require('gulp-livereload');
var babelify = require('babelify');
var babel = require('gulp-babel');
var eslint = require('gulp-eslint');

gulp.task('default', function() {
  livereload.listen(35729);

  var watcher = watchify(browserify({
    entries: ['./examples/index.js'],
    transform: [babelify],
    debug: true,
    cache: {}, packageCache: {}, fullPaths: true
  }));

  watcher.on('update', rebundle);
  function rebundle() {
    return watcher
      .bundle()
      .on('error', function(err) { console.log('Error : ' + err.message); })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./examples'))
      .pipe(livereload());
  }
  return rebundle();
});

gulp.task('eslint', function() {
  return gulp.src(['lib/**/*.js', 'gulpfile.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('build', function() {
  return gulp.src('./lib/portal.js')
    .pipe(babel())
    .pipe(gulp.dest('./'));
});
