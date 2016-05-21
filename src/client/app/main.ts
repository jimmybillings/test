
import { enableProdMode } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { DIRECTIVES, PROVIDERS, STORES } from './platform/index';
import { AppComponent } from './app.component';
import 'rxjs/Rx';

// enable prod mode
if ('<%= ENV %>' === 'prod') { enableProdMode(); }

bootstrap(AppComponent, [
  ...PROVIDERS,
  ...DIRECTIVES,
  ...STORES
]);

