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

gulp.task('favicons', () => {
    return gulp.src([
      'android-chrome-36x36.png',
      'android-chrome-48x48.png',
      'android-chrome-72x72.png',
      'android-chrome-96x96.png',
      'android-chrome-144x144.png',
      'android-chrome-192x192.png',
      'apple-touch-icon-57x57.png',
      'apple-touch-icon-60x60.png',
      'apple-touch-icon-72x72.png',
      'apple-touch-icon-76x76.png',
      'apple-touch-icon-114x114.png',
      'apple-touch-icon-120x120.png',
      'apple-touch-icon-144x144.png',
      'apple-touch-icon-152x152.png',
      'apple-touch-icon-180x180.png',
      'apple-touch-icon-precomposed.png',
      'apple-touch-icon.png',
      'browserconfig.xml',
      'favicon-16x16.png',
      'favicon-32x32.png',
      'favicon-96x96.png',
      'favicon-194x194.png',
      'favicon.ico',
      'manifest.json',
      'mstile-70x70.png',
      'mstile-144x144.png',
      'mstile-150x150.png',
      'mstile-310x150.png',
      'mstile-310x310.png',
      'safari-pinned-tab.svg'
      ])
    .pipe(gulp.dest('build/'))
});
