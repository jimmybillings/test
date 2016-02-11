import {provide} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS, HTTP_BINDINGS} from 'angular2/http';
import {AppComponent} from './app.component';
import { ApiConfig } from './common/config/api.config';
import {CurrentUser} from './common/models/current-user.model';
import { User } from './common/services/user.data.service';
import {MATERIAL_PROVIDERS} from 'ng2-material/all';
import {UiConfig} from './common/config/ui.config';

bootstrap(AppComponent, [
  ROUTER_PROVIDERS,
  MATERIAL_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  HTTP_PROVIDERS,
  HTTP_BINDINGS,
  ApiConfig,
  CurrentUser,
  User,
  UiConfig
]);

