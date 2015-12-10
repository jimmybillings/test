var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var typescript = require('gulp-tsc');
var watch = require('gulp-watch')

function isTSFile(event) {
    return event.path.indexOf('.ts') !== -1
}

gulp.task('ts', function(){
  return gulp.src('src/**/*.ts')
    .pipe(typescript({
      experimentalDecorators: true
    }))
    .pipe(gulp.dest('dist/'))
});

gulp.task('html', function(){
    return gulp.src('src/**/*.html')
    .pipe(gulp.dest('dist/'))
})

gulp.task('libs', function() {
    return gulp.src([
        'node_modules/es6-shim/es6-shim.js', 
        'node_modules/systemjs/dist/system.src.js', 
        'node_modules/angular2/bundles/angular2.dev.js'
    ]).pipe(gulp.dest('dist/lib/'))
})

// use default task to launch Browsersync and watch JS files
gulp.task('serve', ['libs', 'ts', 'html'], function () {
    // Serve files from the root of this project
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    // add browserSync.reload to the tasks array to make
    // all browsers reload after tasks are complete.
    gulp.watch(['src/**/*.html', 'src/**/*.ts'], function(event){
        if(isTSFile(event)) {
            gulp.start('ts', browserSync.reload)
        } else {
            gulp.start('html', browserSync.reload)
        } 
    });
});