import {
TestComponentBuilder,
describe,
expect,
injectAsync,
it,
beforeEachProviders
} from 'angular2/testing';

import {Search} from './search.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, RouteParams, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter, } from 'angular2/src/router/router';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';
import { ApiConfig } from '../../common/config/api.config';
import {CurrentUser} from '../../common/models/current-user.model';
import {UiConfig} from '../../common/config/ui.config';

export function main() {
  describe('Search Component', () => {
    beforeEachProviders(() => [
      RouteRegistry,
      provide(RouteParams, { useValue: new RouteParams({ q: 'blue' }) }),
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Search }),
      provide(Router, { useClass: RootRouter }),
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      CurrentUser,
      ApiConfig,
      UiConfig
    ]);

    it('Should have a search instance',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Search).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Search).toBeTruthy();
        });
      }));

  });
}
