import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { ROUTER_FAKE_PROVIDERS } from '@angular/router/testing';
import {UserManagementComponent} from './user-management.component';

export function main() {
  describe('User Management Component', () => {
    beforeEachProviders(() => [
      ROUTER_FAKE_PROVIDERS
    ]);

    it('Should have a user-management instance',
      inject([TestComponentBuilder], (tcb: any) => {
        tcb.createAsync(UserManagementComponent).then((fixture: any) => {
          let instance = fixture.debugElement.componentInstance;
          expect(instance instanceof UserManagementComponent).toBeTruthy();
        });
      }));

  });
}
