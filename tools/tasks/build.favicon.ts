
import {APP_SRC, APP_DEST} from '../config';

export = function buildFavicon(gulp, plugins) {
  return function () {
    return gulp.src(APP_SRC+'/resources/favicon/*')
    .pipe(gulp.dest(APP_DEST));
  };
}
