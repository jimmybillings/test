import * as merge from 'merge-stream';
import {
  APP_SRC,
  TMP_DIR,
  PROD_DEPENDENCIES,
  CSS_PROD_BUNDLE,
  CSS_DEST,
  APP_DEST
} from '../config';

export = function buildJSDev(gulp, plugins) {
  return function () {

    return merge(minifyComponentCss(), prepareTemplates(), processExternalCss());

    function prepareTemplates() {
      return gulp.src(APP_SRC+'/**/*.jade')
        .pipe(plugins.jade())
        .pipe(gulp.dest(TMP_DIR));
    }

    function minifyComponentCss() {
      
      
      return gulp.src(APP_SRC+'/app.scss')
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        // .pipe(plugins.cssnano())
        .pipe(gulp.dest(APP_DEST));
    }

    function processExternalCss() {
      return gulp.src(getExternalCss().map(r => r.src))
        .pipe(plugins.cssnano())
        .pipe(plugins.concat(CSS_PROD_BUNDLE))
        .pipe(gulp.dest(CSS_DEST));
    }

    function getExternalCss() {
      return PROD_DEPENDENCIES.filter(d => /\.css$/.test(d.src));
    }
  };
};
