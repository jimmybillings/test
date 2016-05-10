import {APP_SRC, APP_DEST} from '../config';

export = function buildAssetsDev(gulp, plugins) {
  return function () {
    return gulp.src(APP_SRC+'/resources/img/**/*')
    .pipe(gulp.dest(APP_DEST+'/resources/img/'));
  };
};
