import 'rxjs/Rx';
require('hammerjs');
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import {enableProdMode} from '@angular/core';

if ('<%= ENV %>' === 'prod') { enableProdMode(); }
platformBrowserDynamic().bootstrapModule(AppModule);
