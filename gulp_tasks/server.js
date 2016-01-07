var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('server', () => {
  browserSync({
      server: {
          baseDir: ["./build"]
      }
  });
});

gulp.task('reload.server', () => {
    browserSync.reload()
})