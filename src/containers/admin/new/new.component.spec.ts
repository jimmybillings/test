import {
describe,
expect,
inject,
TestComponentBuilder,
it,
beforeEachProviders
} from 'angular2/testing';

import {AdminService} from '../services/admin.service';
import {BaseRequestOptions, Http} from 'angular2/http';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT, RouteParams} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {MockBackend} from 'angular2/http/testing';
import {ApiConfig} from '../../../common/config/api.config';
import {New} from './new.component';
import {UiConfig, config} from '../../../common/config/ui.config';
// import {Observable} from 'rxjs/Rx';
import {provideStore} from '@ngrx/store';

export function main() {
  describe('Admin New component', () => {

    beforeEachProviders(() => [
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: New }),
      provide(Router, { useClass: RootRouter }),
      provide(RouteParams, { useValue: new RouteParams({ resource: 'user' }) }),
      ApiConfig,
      provideStore({config: config}),
      UiConfig,
      AdminService,
      New
    ]);

    it('Should Create instance of New',
      inject([TestComponentBuilder], (tcb) => {
        tcb.createAsync(New).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof New).toBeTruthy();
        });
      }));
  });
}
