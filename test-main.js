debugger;
if (!Object.hasOwnProperty('name')) {
  Object.defineProperty(Function.prototype, 'name', {
    get: function() {
      var matches = this.toString().match(/^\s*function\s*(\S*)\s*\(/);
      var name = matches && matches.length > 1 ? matches[1] : "";
      Object.defineProperty(this, 'name', {value: name});
      return name;
    }
  });
}

// Turn on full stack traces in errors to help debugging
Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

// Cancel Karma's synchronous start,
// we will call `__karma__.start()` later, once all the specs are loaded.
__karma__.loaded = function() {};

// Load our SystemJS configuration.

var packageNames = [
  '@angular/common',
  '@angular/compiler',
  '@angular/core',
  '@angular/http',
  '@angular/platform-browser',
  '@angular/platform-browser-dynamic',
  '@angular/router',
  '@angular/forms',
  '@angular/testing',
  '@angular/upgrade',
  
];

var materialPackages = [
  'core',
  'button',
  'card',
  'checkbox',
  'input',
  'list',
  'progress-bar',
  'progress-circle',
  'radio',
  'sidenav',
  'slide-toggle',
  'tabs',
  'toolbar',
  'icon',
  'button-toggle',
  'menu',
  'slider',
  'tooltip',
  'grid-list'
];

var config = {
  baseURL: '/base/',
  defaultJSExtensions: true,
  paths: {
    'ng2-translate/*': 'node_modules/ng2-translate/*.js'
  },
  map: {
    'rxjs': 'node_modules/rxjs',
    '@angular': 'node_modules/@angular',
    '@ngrx/store': 'node_modules/@ngrx/store/index.js',
    '@angular2-material': 'node_modules/@angular2-material',
    'pikaday': 'node_modules/pikaday/pikaday'
  },
  packages: {
    'rxjs': {
      defaultExtension: 'js'
    }
  }
};

packageNames.forEach(function (pkgName) {
  config.packages[pkgName] = {main: 'index.js', defaultExtension: 'js'};
});

materialPackages.forEach(function (pkgName) {
  config.packages['@angular2-material/' + pkgName] = {main: pkgName + '.js', defaultExtension: 'js', format: 'cjs'}
});

System.config(config);


Promise.all([
  System.import('@angular/core/testing'),
  System.import('@angular/platform-browser-dynamic/testing')
]).then(function (providers) {
  debugger;
  var testing = providers[0];
  var testingBrowser = providers[1];

  testing.setBaseTestProviders(testingBrowser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
    testingBrowser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

}).then(function() {
  return Promise.all(
    Object.keys(window.__karma__.files) // All files served by Karma.
    .filter(onlySpecFiles)
    .map(file2moduleName)
    .map(function(path) {
      return System.import(path).then(function(module) {
        if (module.hasOwnProperty('main')) {
          module.main();
        } else {
          throw new Error('Module ' + path + ' does not implement main() method.');
        }
      });
    }));
})
.then(function() {
  __karma__.start();
}, function(error) {
  console.error(error.stack || error);
  __karma__.start();
});

function onlySpecFiles(path) {
  // check for individual files, if not given, always matches to all
  var patternMatched = __karma__.config.files ?
    path.match(new RegExp(__karma__.config.files)) : true;

  return patternMatched && /[\.|_]spec\.js$/.test(path);
}

// Normalize paths to module names.
function file2moduleName(filePath) {
  return filePath.replace(/\\/g, '/')
    .replace(/^\/base\//, '')
    .replace(/\.js$/, '');
}
