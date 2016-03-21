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
import {UserManagement} from './user-management.component';

export function main() {
  describe('User Management Component', () => {
    beforeEachProviders(() => [
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: UserManagement }),
      provide(Router, { useClass: RootRouter }),

    ]);

    it('Should have a user-management instance',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(UserManagement).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof UserManagement).toBeTruthy();
        });
      }));

  });
}
