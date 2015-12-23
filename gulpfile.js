var gulp = require('gulp');
var typescript = require('gulp-typescript');
var browserSync = require('browser-sync');
var jade = require('gulp-jade');
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

gulp.task('scripts:app', function() {
    var tsProject = typescript.createProject('tsconfig.json');
	return tsProject.src('./app/**/*.ts') 
		.pipe(typescript(tsProject))
        .js.pipe(gulp.dest('build'));
});

gulp.task('scripts:vendor', function() {
    return gulp.src([
        'node_modules/angular2/bundles/angular2-polyfills.js',
        'node_modules/systemjs/dist/system.src.js',
        'node_modules/rxjs/bundles/Rx.js',
        'node_modules/angular2/bundles/angular2.dev.js'
    ])
    .pipe(gulp.dest('build/lib'))
});

gulp.task('templates', function() {
  var YOUR_LOCALS = {};
  gulp.src('./app/**/*.jade')
    .pipe(jade({
        locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('build/app'));
});

gulp.task('html', function(){
    return gulp.src('app/index.html')
    .pipe(gulp.dest('build/'))
})

gulp.task('styles', function() {
  return gulp.src('app/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('build/css/'));
});

gulp.task('images', function(){
    return gulp.src(['app/**/*.png', 'src/**/*.jpg'])
    .pipe(flatten())
    .pipe(gulp.dest('build/images'))
});

gulp.task('build', ['templates', 'html', 'scripts:app', 'scripts:vendor', 'styles', 'images']);

gulp.task('default', ['templates', 'html', 'scripts:app', 'scripts:vendor', 'styles', 'images', 'server'], function() {
  gulp.watch('./app/**/*.scss', ['styles']);
  gulp.watch('./build/css/app.css', browserSync.reload);

  gulp.watch('./app/**/*.ts', function(){
    gulp.start('scripts:app', browserSync.reload)
  });
  
  gulp.watch('./app/**/*.jade', function(){
    gulp.start('templates', browserSync.reload)
  });
});