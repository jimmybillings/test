var gulp = require('gulp');
var del = require('del');
var runSequence = require('gulp-run-sequence');
var flatten = require('gulp-flatten');

gulp.task('images', () => {
    return gulp.src(['app/**/*.svg', 'app/**/*.png', 'app/**/*.jpg', '!app/resources/favicon/*.png'])
    .pipe(flatten())
    .pipe(gulp.dest('build/images'))
});

gulp.task('images.test', () => {
    return gulp.src(['app/**/*.svg', 'app/**/*.png', 'app/**/*.jpg', '!app/resources/favicon/*.png'])
    .pipe(flatten())
    .pipe(gulp.dest('test/images'))
});

gulp.task('favicons', () => {
    return gulp.src([
      'app/resources/favicon/android-chrome-36x36.png',
      'app/resources/favicon/android-chrome-48x48.png',
      'app/resources/favicon/android-chrome-72x72.png',
      'app/resources/favicon/android-chrome-96x96.png',
      'app/resources/favicon/android-chrome-144x144.png',
      'app/resources/favicon/android-chrome-192x192.png',
      'app/resources/favicon/apple-touch-icon-57x57.png',
      'app/resources/favicon/apple-touch-icon-60x60.png',
      'app/resources/favicon/apple-touch-icon-72x72.png',
      'app/resources/favicon/apple-touch-icon-76x76.png',
      'app/resources/favicon/apple-touch-icon-114x114.png',
      'app/resources/favicon/apple-touch-icon-120x120.png',
      'app/resources/favicon/apple-touch-icon-144x144.png',
      'app/resources/favicon/apple-touch-icon-152x152.png',
      'app/resources/favicon/apple-touch-icon-180x180.png',
      'app/resources/favicon/apple-touch-icon-precomposed.png',
      'app/resources/favicon/apple-touch-icon.png',
      'app/resources/favicon/browserconfig.xml',
      'app/resources/favicon/favicon-16x16.png',
      'app/resources/favicon/favicon-32x32.png',
      'app/resources/favicon/favicon-96x96.png',
      'app/resources/favicon/favicon-194x194.png',
      'app/resources/favicon/favicon.ico',
      'app/resources/favicon/manifest.json',
      'app/resources/favicon/mstile-144x144.png',
      'app/resources/favicon/mstile-150x150.png',
      'app/resources/favicon/mstile-310x150.png',
      'app/resources/favicon/mstile-310x310.png',
      'app/resources/favicon/safari-pinned-tab.svg'
      ])
    .pipe(gulp.dest('build/'))
});
