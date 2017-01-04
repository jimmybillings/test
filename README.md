# Wazee UI Platform

# How to start

**Note** that this project requires node v4.x.x or higher and npm 2.14.7 but in order to be able to take advantage of the complete functionality we **strongly recommend node >=v6.5.0 and npm >=3.10.3**.

**Here is how to [speed-up the build on Windows](https://github.com/mgechev/angular-seed/wiki/Speed-up-the-build-on-Windows)**.

In order to start the app:


```bash
$ git clone git@github.com:t3mediacorp/wazee-ui.git
$ cd wazee-ui

# install the project's dependencies
$ npm install

# watches your files and uses livereload by default
$ npm start

# to start deving with livereload site and coverage as well as continuous testing
$ npm run start.deving

# dev build
$ npm run build.dev
# prod build
$ npm run build.prod
# library build
$ npm run build.library
```
_Does not rely on any global dependencies._

# How to start with AoT compilation

**Note** that AoT compilation requires **node v6.5.0 or higher** and **npm 3.10.3 or higher**.

In order to start the seed with AoT use:

```bash
# prod build with AoT compilation
$ npm run build.prod.exp
```
# Configuration

Default application server configuration

```js
var PORT             = 5555;
var LIVE_RELOAD_PORT = 4002;
var DOCS_PORT        = 4003;
var APP_BASE         = '/';
```

Configure at runtime

```bash
$ npm start -- --port 8080 --reload-port 4000 --base /my-app/
```

# Tools documentation

A documentation of the provided tools can be found in [tools/README.md](tools/README.md).

# How to extend?

Visit the [Wiki page](https://github.com/mgechev/angular-seed/wiki) of the seed project.

# Running tests

```bash
$ npm test

# Development. Your app will be watched by karma
# on each change all your specs will be executed.
$ npm run test.watch
# NB: The command above might fail with a "EMFILE: too many open files" error.
# Some OS have a small limit of opened file descriptors (256) by default
# and will result in the EMFILE error.
# You can raise the maximum of file descriptors by running the command below:
$ ulimit -n 10480


# code coverage (istanbul)
# auto-generated at the end of `npm test`
# view coverage report:
$ npm run serve.coverage

# e2e (aka. end-to-end, integration) - In three different shell windows
# Make sure you don't have a global instance of Protractor
# Make sure you do have Java in your PATH (required for webdriver)

# npm install webdriver-manager <- Install this first for e2e testing
# npm run webdriver-update <- You will need to run this the first time
$ npm run webdriver-start
$ npm run serve.e2e
$ npm run e2e

# e2e live mode - Protractor interactive mode
# Instead of last command above, you can use:
$ npm run e2e.live
```

# Directory Structure

```
.
├── LICENSE
├── README.md
├── gulpfile.ts                <- configuration of the gulp tasks
├── karma.conf.js              <- configuration of the test runner
├── package.json               <- dependencies of the project
├── protractor.conf.js         <- e2e tests configuration
├── src                        <- source code of the application
│   └── client
│       ├── app
│       ├── assets
├── test-config.js             <- testing configuration
├── test-main.js               <- karma test launcher
├── tools
│   ├── README.md              <- build documentation
│   ├── config
│   │   ├── banner-256.txt
│   │   ├── banner.txt
│   │   ├── project.config.ts  <- configuration of the specific project
│   │   ├── project.tasks.json <- override composite gulp tasks
│   │   ├── seed.config.ts     <- generic configuration of the seed project
│   │   ├── seed.config.interfaces.ts
│   │   ├── seed.tasks.json    <- default composite gulp tasks
│   │   └── seed.tslint.json   <- generic tslint configuration of the seed project
│   ├── config.ts              <- exported configuration (merge both seed.config and project.config, project.config overrides seed.config)
│   ├── debug.ts
│   ├── env                    <- environment configuration
│   │   ├── base.ts
│   │   ├── dev.ts
│   │   ├── env-config.interface.ts
│   │   └── prod.ts
│   ├── manual_typings
│   │   ├── project            <- manual ambient typings for the project
│   │   │   └── sample.package.d.ts
│   │   └── seed               <- seed manual ambient typings
│   │       ├── autoprefixer.d.ts
│   │       ├── cssnano.d.ts
│   │       ├── express-history-api-fallback.d.ts
│   │       ├── istream.d.ts
│   │       ├── karma.d.ts
│   │       ├── merge-stream.d.ts
│   │       ├── open.d.ts
│   │       ├── operators.d.ts
│   │       ├── slash.d.ts
│   │       ├── systemjs-builder.d.ts
│   │       └── tildify.d.ts
│   ├── tasks                  <- gulp tasks
│   │   ├── assets_task.ts
│   │   ├── css_task.ts
│   │   ├── project            <- project specific gulp tasks
│   │   │   └── sample.task.ts
│   |   |   └── build.library.ts
│   │   └── seed               <- seed generic gulp tasks. They can be overriden by the project specific gulp tasks
│   │   │   ├── build.assets.dev.ts
│   │   │   ├── build.assets.prod.ts
│   │   │   ├── build.bundle.rxjs.ts
│   │   │   ├── build.bundles.app.exp.ts
│   │   │   ├── build.bundles.app.ts
│   │   │   ├── build.bundles.ts
│   │   │   ├── build.docs.ts
│   │   │   ├── build.html_css.ts
│   │   │   ├── build.index.dev.ts
│   │   │   ├── build.index.prod.ts
│   │   │   ├── build.js.dev.ts
│   │   │   ├── build.js.e2e.ts
│   │   │   ├── build.js.prod.exp.ts
│   │   │   ├── build.js.prod.ts
│   │   │   ├── build.js.test.ts
│   │   │   ├── build.tools.ts
│   │   │   ├── check.tools.ts
│   │   │   ├── check.versions.ts
│   │   │   ├── clean.all.ts
│   │   │   ├── clean.coverage.ts
│   │   │   ├── clean.dev.ts
│   │   │   ├── clean.prod.ts
│   │   │   ├── clean.tools.ts
│   │   │   ├── clear.files.ts
│   │   │   ├── compile.ahead.prod.ts
│   │   │   ├── copy.prod.ts
│   │   │   ├── e2e.ts
│   │   │   ├── generate.manifest.ts
│   │   │   ├── karma.run.ts
│   │   │   ├── karma.run.with_coverage.ts
│   │   │   ├── karma.watch.ts
│   │   │   ├── minify.bundles.ts
│   │   │   ├── print.banner.ts
│   │   │   ├── serve.coverage.ts
│   │   │   ├── serve.coverage.watch.ts
│   │   │   ├── serve.docs.ts
│   │   │   ├── server.prod.ts
│   │   │   ├── server.start.ts
│   │   │   ├── start.deving.ts
│   │   │   ├── tslint.ts
│   │   │   ├── watch.dev.ts
│   │   │   ├── watch.e2e.ts
│   │   │   ├── watch.test.ts
│   │   │   └── webdriver.ts
│   │   ├── task.ts
│   │   └── typescript_task.ts
│   ├── utils                  <- build utils
│   │   ├── project            <- project specific gulp utils
│   │   │   └── sample_util.ts
│   │   ├── project.utils.ts
│   │   ├── seed               <- seed specific gulp utils
│   │   │   ├── clean.ts
│   │   │   ├── code_change_tools.ts
│   │   │   ├── karma.start.ts
│   │   │   ├── server.ts
│   │   │   ├── tasks_tools.ts
│   │   │   ├── template_locals.ts
│   │   │   ├── tsproject.ts
│   │   │   └── watch.ts
│   │   └── seed.utils.ts
│   └── utils.ts
├── tsconfig.json              <- configuration of the typescript project (ts-node, which runs the tasks defined in gulpfile.ts)
├── tslint.json                <- tslint configuration
```

# Contributors

- [James Billings](https://github.com/jimmybillings)
- [Jeff Hyde](https://github.com/jhyde)
- [Ross Edfort](https://github.com/rossedfort)
- [Ed Tramell](https://github.com/etramell-tem)
