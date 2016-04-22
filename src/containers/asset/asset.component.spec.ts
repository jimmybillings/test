import {
TestComponentBuilder,
describe,
expect,
injectAsync,
it,
beforeEachProviders
} from 'angular2/testing';

import {Asset} from './asset.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT, RouteParams} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';
import { ApiConfig } from '../../common/config/api.config';
import {CurrentUser} from '../../common/models/current-user.model';
import {UiConfig, config} from '../../common/config/ui.config';
import { Error } from '../../common/services/error.service';
import { provideStore } from '@ngrx/store';
import {ViewportHelper} from 'ng2-material/all';

export function main() {
  describe('Asset Component', () => {
    beforeEachProviders(() => [
      RouteRegistry,
      provide(RouteParams, { useValue: new RouteParams({ q: 'blue' }) }),
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Asset }),
      provide(Router, { useClass: RootRouter }),
      MockBackend,
      BaseRequestOptions,
      ViewportHelper,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      provideStore({config: config}),
      CurrentUser,
      UiConfig,
      ApiConfig,
      Error
    ]);

    it('Create instance of asset component',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Asset).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Asset).toBeTruthy();
        });
      }));

  });
}
