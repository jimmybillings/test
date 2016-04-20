import {
describe,
expect,
injectAsync,
TestComponentBuilder,
it,
beforeEachProviders
} from 'angular2/testing';

import {Account} from './account.component';
import {provide} from 'angular2/core';
import {Location, Router, RouteRegistry, ROUTER_PRIMARY_COMPONENT} from 'angular2/router';
import {SpyLocation} from 'angular2/src/mock/location_mock';
import {RootRouter} from 'angular2/src/router/router';
import {CurrentUser, currentUser} from '../../../common/models/current-user.model';
import { provideStore } from '@ngrx/store';

export function main() {
  describe('Admin Account component', () => {
    beforeEachProviders(() => [
      RouteRegistry,
      provide(Location, { useClass: SpyLocation }),
      provide(ROUTER_PRIMARY_COMPONENT, { useValue: Account }),
      provide(Router, { useClass: RootRouter }),
      provideStore({currentUser: currentUser}),
      CurrentUser
    ]);
    
  it('Create instance of account and assign the CurrentUser to an instance variable inside of account',
    injectAsync([TestComponentBuilder], (tcb) => {
      return tcb.createAsync(Account).then((fixture) => {
        let instance = fixture.debugElement.componentInstance;
        expect(instance instanceof Account).toBeTruthy();
        expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
      });
    }));
  });
}
