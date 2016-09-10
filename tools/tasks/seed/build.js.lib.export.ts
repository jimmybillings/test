import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import { join } from 'path';
const merge2 = require('merge2');
import { TMP_DIR, APP_SRC, APP_DEST } from '../../config';
import { makeTsProject, templateLocals } from '../../utils';

const plugins = <any>gulpLoadPlugins();

const INLINE_OPTIONS = {
  base: TMP_DIR,
  useRelativePaths: true,
  removeLineBreaks: true
};



/**
 * Executes the build process, transpiling the TypeScript files for the production environment.
 */
function buildTS() {
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
    .pipe(plugins.inlineNg2Template(INLINE_OPTIONS))
    .pipe(plugins.typescript(tsProject));

  gulp.src('library/package.json')
    .pipe(gulp.dest(APP_DEST));

  return merge2([
    result.dts.pipe(gulp.dest(APP_DEST)),
    result.js.pipe(plugins.template(templateLocals()))
      .pipe(gulp.dest(APP_DEST))
  ]);
}


export = () => buildTS();
