
var gulp = require('gulp');

gulp.task('run.test', (done) => {
    var Server = require('karma').Server;
    new Server({
      configFile: __dirname + '/../karma.conf.js',
      singleRun: true
    }).start(done);
});
