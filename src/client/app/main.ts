// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/take';
// import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/operator/combineLatest';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/operator/mergeMap';
// import 'rxjs/add/operator/merge';
require('hammerjs');
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import {enableProdMode} from '@angular/core';

if ('<%= ENV %>' === 'prod') { enableProdMode(); }
platformBrowserDynamic().bootstrapModule(AppModule);
