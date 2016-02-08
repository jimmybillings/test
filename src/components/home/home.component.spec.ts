import {
  TestComponentBuilder,
  describe,
  expect,
  injectAsync,
  it,
  beforeEachProviders
} from 'angular2/testing';

import {Home} from './home.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {CurrentUser} from '../../common/models/current-user.model';

export function main() {
  describe('Home Component', () => {
    beforeEachProviders(() => [
      RouteRegistry,
      provide(Location, {useClass: SpyLocation}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: Home}),
      provide(Router, {useClass: RootRouter}),
      CurrentUser
    ]);
    
    it('Create instance of home and assign the CurrentUser to an instance variable inside of home', 
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Home).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Home).toBeTruthy();
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
        });
    }));
    
  });
}
