var examplesWebpackConfig = require('./examples/webpack.config');
var ghPages = require('gulp-gh-pages');
var gulp = require('gulp');
var webpack = require('gulp-webpack');
var webpackConfig = require('./webpack.config');

gulp.task('build-node', function() {
  return gulp.src('src/Combobox.js')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('lib/'));
});

gulp.task('build-examples', function() {
  return gulp.src('examples/')
    .pipe(webpack(examplesWebpackConfig))
    .pipe(gulp.dest('examples/build/'));
});

gulp.task('build', ['build-node', 'build-examples']);

gulp.task('deploy', ['build-examples'], function() {
  return gulp.src('./examples/**/*')
    .pipe(ghPages());
});
