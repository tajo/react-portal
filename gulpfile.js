var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var streamify = require('gulp-streamify');
var livereload = require('gulp-livereload');
var plumber = require('gulp-plumber');
var babelify = require('babelify');
var babel = require('gulp-babel');

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
      .on("error", function (err) { console.log("Error : " + err.message); })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('./examples'))
      .pipe(livereload());
  }
  return rebundle();
});

gulp.task('build', function(){
  return gulp.src('./lib/portal.js')
    .pipe(babel())
    .pipe(gulp.dest('./'));
});
