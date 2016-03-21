import {
  TestComponentBuilder,
  describe,
  expect,
  injectAsync,
  it,
  beforeEachProviders
} from 'angular2/testing';

import {AppComponent} from './app.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {CurrentUser} from './common/models/current-user.model';
import {ApiConfig} from './common/config/api.config';
import {UiConfig, config} from './common/config/ui.config';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';
import { provideStore } from '@ngrx/store/dist/index';
import { TranslateService, TranslateLoader, TranslateStaticLoader} from 'ng2-translate/ng2-translate';
import {Authentication} from './containers/user-management/services/authentication.data.service';


export function main() {
  
  describe('App Component', () => {
    beforeEachProviders(() => [
      RouteRegistry,
      provide(Location, {useClass: SpyLocation}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: AppComponent}),
      provide(Router, {useClass: RootRouter}),
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provide(TranslateLoader, {
          useFactory: (http: Http) => new TranslateStaticLoader(http, 'assets/i18n', '.json'),
          deps: [Http]
      }),
      provideStore({config: config}),
      CurrentUser,
      TranslateService,
      ApiConfig,
      Authentication,
      UiConfig
    ]);
    
    it('Create instance of app and assign the CurrentUser to an instance variable inside of app', 
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(AppComponent).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
          expect(instance instanceof AppComponent).toBeTruthy();
        });
    }));
    
  });
}
