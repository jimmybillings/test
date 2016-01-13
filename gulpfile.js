var gulp = require('gulp');
var wrench = require('wrench');
var runSequence = require('gulp-run-sequence');


/**
 *  This will load all js files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp_tasks').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp_tasks/' + file);
});



// --------------
// Build prod for a deploy
gulp.task('prod', done =>
 runSequence(
     'clean.build',
     'html', 
     'templates', 
     'scripts.vendor', 
     'styles', 
     'styles.vendor',
     'font.vendor',
     'ng2Template', 
     'images',
     'favicons',
     'clean.html',
     done)
);

// --------------
// Build prod and spin up local server
gulp.task('prod.server', done =>
 runSequence(
     'clean.build',
     'html', 
     'templates', 
     'scripts.vendor', 
     'styles', 
     'styles.vendor',
     'font.vendor',
     'ng2Template', 
     'images',
     'favicons',
     'clean.html',
     'server',
     done)
);

// --------------
// Build dev and spin up local server
gulp.task('dev.server', (done) => {
    runSequence(
        'clean.build', 
        'templates', 
        'html', 
        'scripts.app', 
        'scripts.vendor',
        'styles',
        'styles.vendor', 
        'font.vendor',
        'images',
        'favicons',
        'server',
        () => {
            gulp.watch('./app/**/*.scss', ['styles.reload']);
            gulp.watch('./app/**/*.ts', ['scripts.reload']);
            gulp.watch('./app/**/*.jade', ['templates.reload']);
        }
    );
});

// --------------
// Build prod and spin up local server to run the unit tests.
gulp.task('test', (done) => {
     runSequence(
        'clean.test',
        'html.test', 
        'templates.test', 
        'styles.test', 
        'styles.vendor.test',
        'font.vendor.test',
        'ng2Template.test', 
        'images.test',
        'favicons',
        'clean.html.test',
        'run.test',
        done
     );
})