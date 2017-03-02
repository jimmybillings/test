
// Require hammerjs - Needed for Material Design
require('hammerjs');
// Application class that will handle loading external
// dependencies if needed before bootstrapping the app
import { Application } from './application';

// Determine whether to run in production mode.
const productionMode = String('<%= BUILD_TYPE %>') === 'prod';

// Load up the app
new Application(productionMode).load();
