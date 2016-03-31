var examplesWebpackConfig = require('./examples/webpack.config');
var babel = require('gulp-babel');
var ghPages = require('gulp-gh-pages');
var gulp = require('gulp');
var webpack = require('webpack-stream');

gulp.task('build-node-js', function() {
  return gulp.src('src/**/*.js')
    .pipe(babel({
      experimental: true
    }))
    .pipe(gulp.dest('lib/'));
});

gulp.task('build-node-css', function() {
  return gulp.src('src/**/*.css')
    .pipe(gulp.dest('lib/'));
});

gulp.task('build-node', ['build-node-js', 'build-node-css']);

gulp.task('build-examples', function() {
  return gulp.src('examples/')
    .pipe(webpack(examplesWebpackConfig))
    .pipe(gulp.dest('examples/build/'));
});

gulp.task('deploy', ['build-examples'], function() {
  return gulp.src('./examples/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['build']);
