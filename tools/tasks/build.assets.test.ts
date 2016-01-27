import {APP_SRC, TEST_DEST} from '../config';

export = function buildAssetsTest(gulp, plugins) {
  return function () {
    return gulp.src(APP_SRC+'/resources/img/**/*')
    .pipe(gulp.dest(TEST_DEST+'/resources/img/'));
  };
}
