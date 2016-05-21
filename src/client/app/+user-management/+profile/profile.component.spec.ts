import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';

import {ProfileComponent} from './profile.component';
import {CurrentUser, currentUser} from '../../shared/services/current-user.model';
import { provideStore } from '@ngrx/store';

export function main() {
  describe('Profile Component', () => {
    beforeEachProviders(() => [
      ROUTER_FAKE_PROVIDERS,
      provideStore({ currentUser: currentUser }),
      CurrentUser
    ]);

    it('Create instance of profile and assign the CurrentUser to an instance variable inside of profile',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(ProfileComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof ProfileComponent).toBeTruthy();
          expect(instance.currentUser instanceof CurrentUser).toBeTruthy();
        });
      }));
  });
}
