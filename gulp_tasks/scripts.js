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
      
      
	// return tsProject.src('./app/**/*.ts') 
	// 	.pipe(typescript(tsProject))
    //     .js.pipe(gulp.dest('build'));
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
      
      
	// return tsProject.src('./app/**/*.ts') 
	// 	.pipe(typescript(tsProject))
    //     .js.pipe(gulp.dest('build'));
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
    // .pipe(concat('vendor.js'))
    .pipe(gulp.dest('build/lib'))
});

gulp.task('scripts.wzComponents', () =>{
    var src = [
        'node_modules/ng2-material/source/components/button/button.ts',
        'node_modules/ng2-material/source/core/util/**/*.ts'];
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
      .pipe(gulp.dest('build/app'));
});

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









