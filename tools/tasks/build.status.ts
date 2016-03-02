import {join} from 'path';
import {APP_SRC, APP_DEST} from '../config';

export = function buildStatus(gulp, plugins) {
  return function () {
    return gulp.src(join(APP_SRC, 'status.html'))
      .pipe(gulp.dest(APP_DEST));
  };
};
