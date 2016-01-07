var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('server', () => {
  browserSync({
      server: {
          baseDir: ["./build"]
      }
  });
});

gulp.task('coverage', () => {
  browserSync({
      server: {
          baseDir: ["./coverage"]
      }
  });
});

gulp.task('reload.server', () => {
    browserSync.reload()
})