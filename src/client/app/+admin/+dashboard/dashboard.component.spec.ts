import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { DashboardComponent} from './dashboard.component';
import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import { CurrentUser, currentUser} from '../../shared/services/current-user.model';
import { provideStore } from '@ngrx/store';

export function main() {
  describe('Admin Dashboard component', () => {
    beforeEachProviders(() => [
      ROUTER_FAKE_PROVIDERS,
      provideStore({ currentUser: currentUser }),
      CurrentUser
    ]);

    it('Create instance of dashboard and assign the CurrentUser to an instance variable inside of dashboard',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(DashboardComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof DashboardComponent).toBeTruthy();
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
        });
      }));
  });
}
