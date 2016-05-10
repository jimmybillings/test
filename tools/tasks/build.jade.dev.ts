import {APP_SRC, APP_DEST} from '../config';

export = function buildJadeDev(gulp, plugins, option) {
  return function () {
    return gulp.src(APP_SRC+'/**/*.html')
    .pipe(gulp.dest(APP_DEST));
  };
};
