import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it,
  beforeEachProviders
} from '@angular/core/testing';

import { Router } from '@angular/router';
import {UserManagementComponent} from './user-management.component';

export function main() {
  describe('User Management Component', () => {
    class MockRouter{}
    beforeEachProviders(() => [
      { provide: Router, useClass: MockRouter },
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
