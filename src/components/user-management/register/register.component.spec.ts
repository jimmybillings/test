import {
  TestComponentBuilder,
  describe,
  expect,
  injectAsync,
  it,
  beforeEachProviders
} from 'angular2/testing';

import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {Register} from './register.component';
import { MockBackend } from 'angular2/http/testing';
import { BaseRequestOptions, Http } from 'angular2/http';
import { ApiConfig } from '../../../common/config/api.config';
import {CurrentUser} from '../../../common/models/current-user.model';
import {Authentication} from '../../../common/services/authentication.data.service';

export function main() {
  describe('Register Component', () => {
    beforeEachProviders(() => [
      RouteRegistry,
      provide(Location, {useClass: SpyLocation}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: Register}),
      provide(Router, {useClass: RootRouter}),
      MockBackend,
      BaseRequestOptions,
      provide(Http, {
        useFactory: (backend, defaultOptions) => new Http(backend, defaultOptions),
        deps: [MockBackend, BaseRequestOptions]
      }),
      ApiConfig,
      CurrentUser,
      Authentication
    ]);
    
    it('Should have a Register instance', 
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Register).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Register).toBeTruthy();
        });
    }));
    
  });
}
