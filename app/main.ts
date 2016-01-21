import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS, HTTP_BINDINGS} from 'angular2/http';
import {AppComponent} from './components/application/app.component';
import { ApiConfig } from './common/config/api.config';
import {CurrentUser} from './common/models/current-user.model';
import { User } from './common/services/user.data.service';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  HTTP_PROVIDERS,
  HTTP_BINDINGS,
  ApiConfig,
  CurrentUser,
  User
]);
