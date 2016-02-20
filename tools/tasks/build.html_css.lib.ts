import * as merge from 'merge-stream';
import {
  APP_SRC,
  TMP_DIR,
  APP_DEST
} from '../config';

export = function buildHtmlCssLib(gulp, plugins) {
  return function () {

    return merge(moveSass(), moveImages(), moveFonts(), moveFavicons(), prepareTemplates());

    function prepareTemplates() {
      return gulp.src(APP_SRC+'/**/*.jade')
        .pipe(plugins.jade())
        .pipe(gulp.dest(TMP_DIR));
    }

    function moveSass() {
      return gulp.src([
        APP_SRC+'/**/*.scss',
        '!'+APP_SRC+'/app.scss'])
        .pipe(gulp.dest(APP_DEST));
    }
    
    function moveImages() {
      return gulp.src(APP_SRC+'/resources/img/*')
        .pipe(gulp.dest(APP_DEST+'/resources/img'));
    }
    
    function moveFonts() {
      return gulp.src(APP_SRC+'/resources/fonts/*')
        .pipe(gulp.dest(APP_DEST+'/resources/fonts'));
    }
    
    function moveFavicons() {
      return gulp.src(APP_SRC+'/resources/favicon/*')
        .pipe(gulp.dest(APP_DEST+'/resources/favicon'));
    }
  };
};
