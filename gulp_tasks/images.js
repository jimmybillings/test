var gulp = require('gulp');
var del = require('del');
var runSequence = require('gulp-run-sequence');
var flatten = require('gulp-flatten');

gulp.task('images', () => {
    return gulp.src(['app/**/*.png', 'src/**/*.jpg'])
    .pipe(flatten())
    .pipe(gulp.dest('build/images'))
});

gulp.task('images.test', () => {
    return gulp.src(['app/**/*.png', 'src/**/*.jpg'])
    .pipe(flatten())
    .pipe(gulp.dest('test/images'))
});