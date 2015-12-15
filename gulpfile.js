var gulp = require('gulp');
var webpack = require('gulp-webpack');
var browserSync = require('browser-sync')
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');

gulp.task('server', function() {
  browserSync({
      server: {
          baseDir: ["./build"]
      }
  });
});

gulp.task('scripts', function() {
	return gulp.src('./src/app.ts')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./build'))
  ;
});

gulp.task('styles', function() {
  return gulp.src('src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('build/css/'));
});

gulp.task('html', function(){
    return gulp.src('src/**/*.html')
    .pipe(gulp.dest('build/'))
});

gulp.task('images', function(){
    return gulp.src(['src/**/*.png', 'src/**/*.jpg'])
    .pipe(flatten())
    .pipe(gulp.dest('build/images'))
});

gulp.task('build', ['scripts', 'html', 'styles', 'images']);

gulp.task('default', ['scripts', 'html', 'styles', 'images', 'server'], function() {
  gulp.watch('./src/**/*.scss', ['styles']);
  gulp.watch('./build/css/app.css', browserSync.reload);

  gulp.watch('./src/**/*.ts', function(){
    gulp.start('scripts', browserSync.reload)
  });
  gulp.watch('./src/**/*.html', function(){
    gulp.start('html', browserSync.reload)
  });
});
