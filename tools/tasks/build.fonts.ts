import {APP_SRC, APP_DEST} from '../config';

export = function buildFonts(gulp, plugins) {
  return function () {
    return gulp.src(APP_SRC+'/resources/fonts/*')
    .pipe(gulp.dest(APP_DEST+'/resources/fonts/'));
  };
};
