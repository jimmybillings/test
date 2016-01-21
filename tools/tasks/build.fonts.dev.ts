import {APP_DEST} from '../config';

export = function buildFontsDev(gulp, plugins, option) {
  return function () {
    return gulp.src([
      'node_modules/ng2-material/dist/MaterialIcons-Regular.eot',
      'node_modules/ng2-material/dist/MaterialIcons-Regular.ijmap',
      'node_modules/ng2-material/dist/MaterialIcons-Regular.ttf',
      'node_modules/ng2-material/dist/MaterialIcons-Regular.woff',
      'node_modules/ng2-material/dist/MaterialIcons-Regular.woff2'
    ])
    .pipe(gulp.dest(APP_DEST+'/resources/fonts'));
  };
}

