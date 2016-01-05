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
var minify = require('gulp-minify');


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
    .pipe(concat('vendor.js'))
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
  return gulp.src('app/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
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
    .pipe(gulp.dest('build'));
});


gulp.task('clean', () => {
	return del([
		'build/app/**/*.html'
	])
});

gulp.task('clean.build', () => {
    return del([
		'build/'
	])
})

// --------------
// Build prod for a deploy
gulp.task('prod', done =>
 runSequence(
     'clean.build',
     'html', 
     'scripts:vendor', 
     'templates', 
     'styles', 
     'ng2Template', 
     'images', 
     'clean',
     done)
);

// --------------
// Build prod and spin up local server
gulp.task('prod.server', done =>
 runSequence(
     'clean.build',
     'html', 
     'scripts:vendor', 
     'templates', 
     'styles', 
     'ng2Template', 
     'images', 
     'clean',
     'server',
     done)
);

// --------------
// Build dev and spin up local server
gulp.task('dev.server', () => {
    runSequence(
        'clean.build', 
        'templates', 
        'html', 
        'scripts:app', 
        'scripts:vendor', 
        'styles', 
        'images', 
        'server', 
        function() {
            gulp.watch('./app/**/*.scss', ['styles']);
            gulp.watch('./build/app/app.css', browserSync.reload);

            gulp.watch('./app/**/*.ts', function(){
                gulp.start('scripts:app', browserSync.reload)
            });
            
            gulp.watch('./app/**/*.jade', function(){
                gulp.start('templates', browserSync.reload)
            });
        }
    );
});


// gulp.task('styles.component', () => {
//   return gulp.src('app/components/**/*.scss')
//     .pipe(sass().on('error', sass.logError))
//     // .pipe(concat('app.css'))
//     .pipe(gulp.dest('tmp/app/components'));
// });

// gulp.task('move.ts',() => {
//     return gulp.src('./app/components/**/*.ts')
//     .pipe(gulp.dest('tmp/app/components')) 
// });

// gulp.task('templates.component', () => {
//   var YOUR_LOCALS = {};
//   gulp.src('./app/components/**/*.jade')
//     .pipe(jade({
//         locals: YOUR_LOCALS
//     }))
//     .pipe(gulp.dest('tmp/app/components'));
// });

// gulp.task('ng2Template.component', () => {
//     return tsProject.src('./tmp/app/components/**/*.ts') 
//     .pipe(inlineNg2Template({ base: '/tmp', jade:true }))
//     .pipe(typescript(tsProject))
//     .js.pipe(gulp.dest('components'));
// });

// gulp.task('build.components', done =>
//     runSequence(
//        'move.ts',
//        'templates.component',
//        'styles.component',
//        'ng2Template.component' 
//     )
// );