import * as gulp from 'gulp';
import {runSequence, task} from './tools/utils';

// --------------
// Clean (override).
gulp.task('clean',       task('clean', 'all'));
gulp.task('clean.dist',  task('clean', 'dist'));
gulp.task('clean.test',  task('clean', 'test'));
gulp.task('clean.tmp',   task('clean', 'tmp'));

gulp.task('check.versions', task('check.versions'));
gulp.task('build.docs', task('build.docs'));
gulp.task('serve.docs', task('serve.docs'));

// --------------
// Postinstall.
gulp.task('postinstall', done =>
  runSequence('clean',
              'npm',
              done));

              
// --------------
// Build dev.
gulp.task('build.dev', done =>
  runSequence('clean.dist',
              'tslint',
              'build.sass.dev',
              'build.jade.dev',
              'build.assets',
              'build.fonts',
              'build.favicon',
              'build.js.dev',
              'build.index.dev',
              done));
              
// --------------
// Build prod.
gulp.task('build.prod', done =>
  runSequence('clean.dist',
              'clean.tmp',
              'tslint',
              'build.assets',
              'build.fonts',
              'build.favicon',
              'build.html_css.prod',
              'build.js.prod',
              'build.bundles',
              'build.index.prod',
              done));

// --------------
// Build exportable library.
gulp.task('build.library.export', done =>
  runSequence('clean.dist',
              'clean.tmp',
              'tslint',
              'build.html_css.lib',
              'build.js.lib.export',
              done));
              
// --------------
// Watch.
gulp.task('build.dev.watch', done =>
  runSequence('build.dev',
              'watch.dev',
              done));

gulp.task('build.test.watch', done =>
  runSequence('build.test',
              'watch.test',
              done));

// --------------
// Test.
gulp.task('test', done =>
  runSequence('clean.test',
              'tslint',
              'build.jade.test',
              'build.assets.test',
              'build.test',
              'karma.start',
              done));

// --------------
// Serve.
gulp.task('serve', done =>
  runSequence('build.dev',
              'server.start',
              'watch.serve',
              done));

gulp.task('serve.prod', done =>
  runSequence('build.prod',
              'server.start',
              done));

// --------------
// Docs
// Disabled until https://github.com/sebastian-lenz/typedoc/issues/162 gets resolved
gulp.task('docs', done =>
  runSequence('build.docs',
              'serve.docs',
              done));
