import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {AppComponent} from './components/app.component'

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  ROUTER_DIRECTIVES,
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  HTTP_PROVIDERS
]);