import { TestComponentBuilder } from '@angular/compiler/testing';
import {
describe,
expect,
inject,
it,
beforeEachProviders
} from '@angular/core/testing';

import {CurrentUser, currentUser} from '../shared/services/current-user.model';
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import {AdminComponent} from './admin.component';
import {provideStore} from '@ngrx/store';

export function main() {
  describe('Admin Component', () => {
    beforeEachProviders(() => [
      ROUTER_FAKE_PROVIDERS,
      provideStore({currentUser: currentUser}),
      CurrentUser
    ]);

    it('Should have an admin instance',
      inject([TestComponentBuilder], (tcb:any) => {
        tcb.createAsync(AdminComponent).then((fixture:any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof AdminComponent).toBeTruthy();
        });
      }));
  });
}
