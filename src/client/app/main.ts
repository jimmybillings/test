
import { enableProdMode, PLATFORM_PIPES } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { DIRECTIVES, PROVIDERS, STORES, APP_ROUTER_PROVIDERS } from './platform/index';
import { TranslatePipe} from 'ng2-translate/ng2-translate';
import { AppComponent } from './app.component';
import 'rxjs/Rx';

// enable prod mode
if ('<%= ENV %>' === 'prod') { enableProdMode(); }

bootstrap(AppComponent, [
  {provide: PLATFORM_PIPES, useValue: TranslatePipe, multi: true},
  ...APP_ROUTER_PROVIDERS,
  ...PROVIDERS,
  ...DIRECTIVES,
  ...STORES,
]);

