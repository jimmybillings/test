import {APP_SRC, APP_DEST} from '../../config';
import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import {join} from 'path';
const plugins = <any>gulpLoadPlugins();

export = () => {
  return gulp.src([join(APP_SRC, '**', 'app.scss')])
      .pipe(plugins.sass().on('error', plugins.sass.logError))
      .pipe(gulp.dest(APP_DEST));
};
