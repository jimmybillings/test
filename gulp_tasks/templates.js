var gulp = require('gulp');
var del = require('del');
var runSequence = require('gulp-run-sequence');
var jade = require('gulp-jade');

gulp.task('templates.reload', (done) => {
    runSequence(
        'templates', 
        'server.reload',
        done
    )
});

gulp.task('templates', () => {
  var YOUR_LOCALS = {};
  gulp.src('./app/**/*.jade')
    .pipe(jade({
        locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('build/app'));
});

gulp.task('templates.test', () => {
  var YOUR_LOCALS = {};
  gulp.src('./app/**/*.jade')
    .pipe(jade({
        locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('test/app'));
});

gulp.task('html', () => {
    return gulp.src('app/index.html')
    .pipe(gulp.dest('build/'))
});

gulp.task('html.test', () => {
    return gulp.src('app/index.html')
    .pipe(gulp.dest('test/'))
});