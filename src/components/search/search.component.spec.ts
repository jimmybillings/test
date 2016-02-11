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
import { ApiConfig } from '../../common/config/api.config';
import {CurrentUser} from '../../common/models/current-user.model';

export function main() {
  describe('Search Component', () => {
    beforeEachProviders(() => [
      RouteRegistry,
      provide(RouteParams, { useValue: new RouteParams({ q: 'blue' }) }),
      provide(Location, {useClass: SpyLocation}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: Search}),
      provide(Router, {useClass: RootRouter}),
      CurrentUser,
      ApiConfig
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
