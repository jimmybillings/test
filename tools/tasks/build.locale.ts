import {APP_SRC, APP_DEST} from '../config';

export = function buildLocale(gulp, plugins) {
  return function () {
    return gulp.src(APP_SRC+'/resources/i18n/*')
    .pipe(gulp.dest(APP_DEST+'/resources/i18n/'));
  };
};
