var gulp = require('gulp');
var typescript = require('gulp-typescript');
var browserSync = require('browser-sync');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var flatten = require('gulp-flatten');
var tsProject = typescript.createProject('tsconfig.json');
var del = require('del');
var runSequence = require('gulp-run-sequence');
var inlineNg2Template = require('gulp-inline-ng2-template');

gulp.task('server', () => {
  browserSync({
      server: {
          baseDir: ["./build"]
      }
  });
});

gulp.task('scripts:app', () => {
    
	return tsProject.src('./app/**/*.ts') 
		.pipe(typescript(tsProject))
        .js.pipe(gulp.dest('build'));
});

gulp.task('scripts:vendor', () => {
    return gulp.src([
        'node_modules/angular2/bundles/angular2-polyfills.js',
        'node_modules/systemjs/dist/system.src.js',
        'node_modules/rxjs/bundles/Rx.js',
        'node_modules/angular2/bundles/angular2.dev.js'
    ])
    .pipe(gulp.dest('build/lib'))
});

gulp.task('css:vendor', () => {
    return gulp.src([
        'node_modules/ng2-material/dist/ng2-material.css',
        'node_modules/ng2-material/dist/font.css'
    ])
    .pipe(gulp.dest('build/lib'))
})

gulp.task('templates', () => {
  var YOUR_LOCALS = {};
  gulp.src('./app/**/*.jade')
    .pipe(jade({
        locals: YOUR_LOCALS
    }))
    .pipe(gulp.dest('build/app'));
});

gulp.task('html', () => {
    return gulp.src('app/index.html')
    .pipe(gulp.dest('build/'))
})

gulp.task('styles', () => {
  return gulp.src('app/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    // .pipe(concat('app.css'))
    .pipe(gulp.dest('build/app'));
});

gulp.task('images', () => {
    return gulp.src(['app/**/*.png', 'src/**/*.jpg'])
    .pipe(flatten())
    .pipe(gulp.dest('build/images'))
});

gulp.task('test', (done) => {
  var Server = require('karma').Server;
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('ng2Template', () => {
    return tsProject.src('./app/**/*.ts') 
    .pipe(inlineNg2Template({ base: '/build' }))
    .pipe(typescript(tsProject))
    .js.pipe(gulp.dest('build'));
});

gulp.task('ng2Template.component', () => {
    return tsProject.src('./app/**/*.ts') 
    .pipe(inlineNg2Template({ base: '/app', jade:true }))
    .pipe(typescript(tsProject))
    .js.pipe(gulp.dest('components'));
});




gulp.task('clean', () => {
	return del([
        'build/app/**/*.css',
		'build/app/**/*.html'
	])
});

gulp.task('build.prod', done =>
 runSequence(
     'html', 
     'scripts:vendor', 
     'templates', 
     'styles', 
     'ng2Template', 
     'images', 
     'clean',
     done)
);

gulp.task('build.components', done =>
    runSequence(
        
    )
);


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