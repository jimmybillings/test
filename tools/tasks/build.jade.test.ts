
import {APP_SRC, TEST_DEST} from '../config';

export = function buildJadeTest(gulp, plugins, option) {
  return function () {
    return gulp.src(APP_SRC+'/**/*.jade')
        .pipe(plugins.jade())
        .pipe(gulp.dest(TEST_DEST));
  };
};
