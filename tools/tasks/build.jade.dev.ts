import {APP_SRC, APP_DEST} from '../config';

export = function buildJadeDev(gulp, plugins, option) {
  return function () {
    return gulp.src(APP_SRC+'/**/*.jade')
    .pipe(plugins.jade())
    .pipe(gulp.dest(APP_DEST));
  };
}
