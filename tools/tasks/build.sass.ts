import {APP_SRC, APP_DEST} from '../config';

export = function buildSass(gulp, plugins, option) {
  return function () {
    return gulp.src(APP_SRC+'/app.scss')
      .pipe(plugins.sass().on('error', plugins.sass.logError))
      .pipe(gulp.dest(APP_DEST));
  };
};
