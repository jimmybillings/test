var gulp = require('gulp');
var del = require('del');
var runSequence = require('gulp-run-sequence');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

gulp.task('styles.reload', (done) => {
    runSequence(
        'styles', 
        'reload.server', 
        done
    )
})

gulp.task('styles', () => {
  return gulp.src('app/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('build/app'));
});

gulp.task('styles.test', () => {
  return gulp.src('app/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('test/app'));
});

gulp.task('styles.vendor', () => {
    return gulp.src([
        'node_modules/ng2-material/source/all.scss',
        'node_modules/ng2-material/dist/font.scss'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('build/app/css'))
});

gulp.task('font.vendor', () =>{
    return gulp.src([
        'node_modules/ng2-material/dist/MaterialIcons-Regular.eot',
        'node_modules/ng2-material/dist/MaterialIcons-Regular.ijmap',
        'node_modules/ng2-material/dist/MaterialIcons-Regular.ttf',
        'node_modules/ng2-material/dist/MaterialIcons-Regular.woff',
        'node_modules/ng2-material/dist/MaterialIcons-Regular.woff2'
    ])
    .pipe(gulp.dest('build/app/css'))
})

gulp.task('font.vendor.test', () =>{
    return gulp.src([
        'node_modules/ng2-material/dist/MaterialIcons-Regular.eot',
        'node_modules/ng2-material/dist/MaterialIcons-Regular.ijmap',
        'node_modules/ng2-material/dist/MaterialIcons-Regular.ttf',
        'node_modules/ng2-material/dist/MaterialIcons-Regular.woff',
        'node_modules/ng2-material/dist/MaterialIcons-Regular.woff2'
    ])
    .pipe(gulp.dest('test/app/css'))
})

gulp.task('styles.vendor.test', () => {
    return gulp.src([
        'node_modules/ng2-material/source/all.scss',
        'node_modules/ng2-material/dist/font.scss'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('test/app/css'))
})