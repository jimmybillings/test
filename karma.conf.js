// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2014-09-20 using
// generator-karma 0.8.3

 
module.exports = function(config) {
  config.set({
    basePath: './',
    frameworks: ['jasmine'],
    browsers: ['PhantomJS2'],
    files: [
      'node_modules/es6-module-loader/dist/es6-module-loader.js',
      'node_modules/traceur/bin/traceur-runtime.js', // Required by PhantomJS2, otherwise it shouts ReferenceError: Can't find variable: require
      'node_modules/traceur/bin/traceur.js',
      'node_modules/angular2/bundles/angular2-polyfills.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/rxjs/bundles/Rx.js',
      'node_modules/angular2/bundles/angular2.js',
      'node_modules/angular2/bundles/testing.dev.js',

      // paths loaded via module imports
      {pattern: 'test/app/**/*.js', included: false, watched: true},
      {pattern: 'test/**/*.html', included: false, watched: true},
      {pattern: 'test/**/*.css', included: false, watched: true},
      'karma-test-shim.js'
    ],

    exclude: [
      'node_modules/angular2/**/*_spec.js'
    ],
    
    preprocessors: {},
    reporters: ['mocha', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true
  });
};

