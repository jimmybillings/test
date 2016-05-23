import {join} from 'path';
import {APP_SRC, TMP_DIR, APP_DEST} from '../../config';
import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { makeTsProject, templateLocals } from '../../utils';
const merge2 = require('merge2');
const plugins = <any>gulpLoadPlugins();

export = () => {
  let tsProject = makeTsProject();
  let src = [
    'typings/browser.d.ts',
    join(APP_SRC, '**/*.ts'),
    '!' + join(APP_SRC, '**/hot_loader_main.ts'),
    '!' + join(APP_SRC, '**/main.ts'),
    '!' + join(APP_SRC, '**/*.e2e.ts'),
    '!' + join(APP_SRC, '**/*.spec.ts')
  ];

  let result = gulp.src(src)
    .pipe(plugins.plumber())
    .pipe(plugins.inlineNg2Template({ base: TMP_DIR }))
    .pipe(plugins.typescript(tsProject));

  gulp.src('library/package.json')
    .pipe(gulp.dest(APP_DEST));

  return merge2([
    result.dts.pipe(gulp.dest(APP_DEST)),
    result.js.pipe(plugins.template(templateLocals()))
      .pipe(gulp.dest(APP_DEST))
  ]);

};
