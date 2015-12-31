// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-09-20 using
// generator-karma 0.8.3

 

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      {pattern: 'node_modules/systemjs/dist/system.src.js', included: true, watched: true},      
      {pattern: 'build/lib/Rx.js', included: true, watched: true},
      {pattern: 'build/lib/angular2-polyfills.js', included: true, watched: true},
      {pattern: 'node_modules/angular2/bundles/angular2.js', included: true, watched: true},
      {pattern: 'node_modules/angular2/bundles/testing.dev.js', included: true, watched: true},

      {pattern: 'karma-test-shim.js', included: true, watched: true},

      // paths loaded via module imports
      {pattern: 'build/**/*.js', included: false, watched: true},

      // paths loaded via Angular's component compiler
      // (these paths need to be rewritten, see proxies section)
      {pattern: 'build/**/*.html', included: false, watched: true},
      {pattern: 'build/**/*.css', included: false, watched: true}
     
    ],
    proxies: {
      // required for component assests fetched by Angular's compiler
      "/app/": "/base/build/app/"
    },
    exclude: [],
    preprocessors: {},
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};

