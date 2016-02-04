import {join} from 'path';
import {APP_SRC, APP_DEST} from '../config';

export = function buildTsLibExport(gulp, plugins) {
  return function () {
    return gulp.src([
        join(APP_SRC, '**', '*.ts'),
        '!' + join(APP_SRC, '**/hot_loader_main.ts'),
        '!' + join(APP_SRC, '**/main.ts'),
        '!' + join(APP_SRC, '**/*.e2e.ts'),
        '!' + join(APP_SRC, '**/*_spec.ts')
      ])
      .pipe(gulp.dest(APP_DEST));
  };
}
