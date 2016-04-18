import {
TestComponentBuilder,
describe,
expect,
injectAsync,
it,
beforeEachProviders
} from 'angular2/testing';

import {CurrentUser, currentUser} from '../../common/models/current-user.model';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {Admin} from './admin.component';
import {provideStore} from '@ngrx/store';

export function main() {
  describe('Admin Component', () => {
    beforeEachProviders(() => [
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Admin }),
      provide(Router, { useClass: RootRouter }),
      provideStore({currentUser: currentUser}),
      CurrentUser
    ]);
    
    it('Should have an admin instance',
      injectAsync([TestComponentBuilder], (tcb) => {
        return tcb.createAsync(Admin).then((fixture) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof Admin).toBeTruthy();
        });
      }));
  });
}
