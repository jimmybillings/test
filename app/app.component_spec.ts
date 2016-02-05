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

export function main() {
  describe('App Component', () => {
    beforeEachProviders(() => [
      RouteRegistry,
      provide(Location, {useClass: SpyLocation}),
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: AppComponent}),
      provide(Router, {useClass: RootRouter}),
      CurrentUser,
      ApiConfig
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
