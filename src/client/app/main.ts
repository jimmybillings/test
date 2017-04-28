// rxjs
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/takeLast';
// Require hammerjs - Needed for Material Design
require('hammerjs');
// Application class that will handle loading external
// dependencies if needed before bootstrapping the app
import { Application } from './application';

// Determine whether to run in production mode.
const productionMode = String('<%= BUILD_TYPE %>') === 'prod';

// Load up the app
new Application(productionMode).load();
