var gulp = require('gulp');
var del = require('del');
var runSequence = require('gulp-run-sequence');

gulp.task('clean.html', () => {
	return del([
		'build/app/**/*.html'
	])
});

gulp.task('clean.build', () => {
    return del([
		'build/'
	])
});

gulp.task('clean.test', () => {
    return del([
		'test/'
	])
});

gulp.task('clean.html.test', () => {
	return del([
		'test/app/**/*.html'
	])
});