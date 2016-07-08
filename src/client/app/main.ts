
import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { DIRECTIVES, PROVIDERS, STORES, APP_ROUTER_PROVIDERS } from './platform/index';
import { AppComponent } from './app.component';
import 'rxjs/Rx';

// enable prod mode
if ('<%= ENV %>' === 'prod') { enableProdMode(); }

bootstrap(AppComponent, [
  ...APP_ROUTER_PROVIDERS,
  ...PROVIDERS,
  ...DIRECTIVES,
  ...STORES
  // ...PIPES
]);

