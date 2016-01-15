var gulp = require('gulp');
var typescript = require('gulp-typescript');
var concat = require('gulp-concat');
var tsProject = typescript.createProject('tsconfig.json');
var del = require('del');
var runSequence = require('gulp-run-sequence');
var inlineNg2Template = require('gulp-inline-ng2-template');
var plumber = require('gulp-plumber');
var join = require('path').join;
var sourcemaps = require('gulp-sourcemaps');
var Builder = require('systemjs-builder');


gulp.task('scripts.app', () => {
     var src = [
                join('app/**/*.ts'),
                '!' + join('app/**/*.spec.ts')
              ];
    var result = gulp.src(src)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(typescript(tsProject));

    return result.js
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('build/app'));
});

gulp.task('scripts.reload', (done) => {
    return runSequence(
        'scripts.app', 
        'reload.server', 
        done
    )
})

gulp.task('scripts.test', () => {
    var src = ['app/**/*.ts'];
    var result = gulp.src(src)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(typescript(tsProject));

    return result.js
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('test/app'));
});

gulp.task('script.ts.vendor', () => {
    var src = ['node_modules/ng2-material/source/components/**/*.ts', 
    'node_modules/ng2-material/source/core/**/*.ts'];
    var result = gulp.src(src)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(typescript(tsProject));

    return result.js
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('build/lib'));   
});

gulp.task('scripts.vendor', () => {
    gulp.src(['app/xmlToJson.js'])
    .pipe(gulp.dest('build/lib'))
    return gulp.src([
        'node_modules/angular2/bundles/angular2-polyfills.js',
        'node_modules/systemjs/dist/system.src.js',
        'node_modules/rxjs/bundles/Rx.js',
        'node_modules/angular2/bundles/angular2.dev.js',
        'node_modules/angular2/bundles/router.dev.js',
        'node_modules/angular2/bundles/http.dev.js',
        'app/config.js'
    ])
    .pipe(gulp.dest('build/lib'))
});

gulp.task('scripts.wzComponents', () => {
    var src = ['node_modules/ng2-material/dist/ng2-material.js'];
    var result = gulp.src(src)
      .pipe(plumber())
      .pipe(sourcemaps.init())
      .pipe(typescript(tsProject));

    return result.js
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('build/lib'));
})

gulp.task('ng2Template', () => {
    var src = [
        join('app/**/*.ts'),
        '!' + join('app/**/*.spec.ts')
    ];
    var result = gulp.src(src)
      .pipe(plumber())
      .pipe(inlineNg2Template({ base: '/build' }))
      .pipe(sourcemaps.init())
      .pipe(typescript(tsProject));

    return result.js
      .pipe(sourcemaps.write())
      .pipe(concat('app.js'))
      .pipe(gulp.dest('build/app'));
});

// var builder = new Builder('path/to/baseURL', 'path/to/system/config-file.js');

// builder
// .bundle('local/module.js', 'outfile.js')
// .then(function() {
//   console.log('Build complete');
// })
// .catch(function(err) {
//   console.log('Build error');
//   console.log(err);
// });

gulp.task('ng2Template.test', () => {
    var src = ['app/**/*.ts'];
    var result = gulp.src(src)
      .pipe(plumber())
      .pipe(inlineNg2Template({ base: '/test' }))
      .pipe(sourcemaps.init())
      .pipe(typescript(tsProject));

    return result.js
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('test/app'));
});









